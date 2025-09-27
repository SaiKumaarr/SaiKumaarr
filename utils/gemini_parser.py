"""Utility helpers for cleaning lead data with Google Gemini."""
from __future__ import annotations

import json
import logging
import os
from typing import Dict, Optional

import google.generativeai as genai

logger = logging.getLogger(__name__)


class GeminiParser:
    """Wraps Google Gemini to normalize lead data."""

    def __init__(self, api_key: Optional[str] = None, model_name: str = "models/gemini-1.5-flash") -> None:
        self.api_key = api_key or os.getenv("GOOGLE_API_KEY")
        self.model_name = model_name
        self.model = None
        if self.api_key:
            try:
                genai.configure(api_key=self.api_key)
                self.model = genai.GenerativeModel(model_name)
            except Exception as exc:  # pragma: no cover - configuration failures should not crash app
                logger.error("Failed to configure Gemini: %s", exc)
                self.model = None

    def enrich_lead(self, lead: Dict) -> Dict:
        """Enrich or clean a lead dictionary using Gemini.

        Returns the enriched payload, or the original lead on failure.
        """
        if not self.model:
            return lead

        prompt = (
            "You are cleaning structured lead data extracted from LinkedIn. "
            "Return a JSON object containing the fields name, headline, company, and location. "
            "Use the original value when unsure and never hallucinate companies."
        )

        try:
            response = self.model.generate_content(
                [
                    prompt,
                    json.dumps(lead, ensure_ascii=False),
                ],
                generation_config={"response_mime_type": "application/json"},
            )
        except Exception as exc:  # pragma: no cover
            logger.warning("Gemini enrichment failed: %s", exc)
            return lead

        if not response:
            return lead

        text_payload: Optional[str] = None
        try:
            # google-generativeai>=0.5 exposes a .text convenience attribute; fall back otherwise.
            text_payload = getattr(response, "text", None)
            if not text_payload and getattr(response, "candidates", None):
                parts = response.candidates[0].content.parts
                text_payload = "".join(part.text for part in parts if getattr(part, "text", None))
        except Exception as exc:  # pragma: no cover
            logger.debug("Unable to parse Gemini response text: %s", exc)

        if not text_payload:
            return lead

        try:
            parsed = json.loads(text_payload)
            if not isinstance(parsed, dict):
                return lead
            cleaned = {key: (parsed.get(key) or lead.get(key)) for key in ["name", "headline", "company", "location"]}
            cleaned["linkedin_url"] = lead.get("linkedin_url")
            return cleaned
        except json.JSONDecodeError:
            logger.debug("Gemini response was not valid JSON: %s", text_payload)
            return lead


__all__ = ["GeminiParser"]
