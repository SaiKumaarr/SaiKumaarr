"""Utility module for interacting with the Firecrawl API."""
from __future__ import annotations

import logging
import os
from typing import Dict, List, Optional

import requests

logger = logging.getLogger(__name__)


class FirecrawlExtractor:
    """Wrapper around Firecrawl search and extract endpoints."""

    def __init__(
        self,
        api_key: Optional[str] = None,
        base_url: Optional[str] = None,
        timeout: int = 60,
    ) -> None:
        self.api_key = api_key or os.getenv("FIRECRAWL_API_KEY")
        if not self.api_key:
            raise ValueError("FIRECRAWL_API_KEY environment variable is required")

        self.base_url = (base_url or os.getenv("FIRECRAWL_BASE_URL") or "https://api.firecrawl.dev").rstrip("/")
        self.timeout = timeout

        self.session = requests.Session()
        # Firecrawl currently supports either Authorization or X-API-Key headers; we send both for safety.
        self.session.headers.update(
            {
                "Authorization": f"Bearer {self.api_key}",
                "X-API-Key": self.api_key,
                "Content-Type": "application/json",
                "Accept": "application/json",
            }
        )

    def _post(self, path: str, payload: Dict) -> Dict:
        url = f"{self.base_url}{path}"
        logger.debug("POST %s payload=%s", url, payload)
        response = self.session.post(url, json=payload, timeout=self.timeout)
        response.raise_for_status()
        return response.json()

    def search_profiles(self, query: str, limit: int = 10) -> List[str]:
        """Run a Firecrawl search query and return LinkedIn profile URLs."""
        if not query.strip():
            return []

        payload = {"query": query}
        try:
            data = self._post("/v1/search", payload)
        except requests.RequestException as exc:
            logger.error("Firecrawl search failed: %s", exc)
            raise RuntimeError("Firecrawl search failed") from exc

        results = data.get("results", []) if isinstance(data, dict) else []
        urls: List[str] = []
        for item in results:
            url = item.get("url") if isinstance(item, dict) else None
            if url and "linkedin.com/in" in url:
                urls.append(url)
            if len(urls) >= limit:
                break
        return urls

    @staticmethod
    def _profile_schema() -> Dict:
        return {
            "type": "object",
            "properties": {
                "name": {"type": "string"},
                "headline": {"type": "string"},
                "company": {"type": "string"},
                "location": {"type": "string"},
                "linkedin_url": {"type": "string"},
            },
            "required": ["name"],
            "additionalProperties": True,
        }

    def extract_profile(self, url: str) -> Dict:
        """Extract structured data for a single LinkedIn profile."""
        payload = {
            "url": url,
            "schema": self._profile_schema(),
        }
        try:
            data = self._post("/v1/extract", payload)
        except requests.RequestException as exc:
            logger.error("Firecrawl extract failed for %s: %s", url, exc)
            raise RuntimeError(f"Firecrawl extract failed for {url}") from exc

        extracted = {}
        if isinstance(data, dict):
            extracted = data.get("data") or data.get("result") or data
        if not isinstance(extracted, dict):
            extracted = {}

        # ensure linkedin url stored
        extracted.setdefault("linkedin_url", url)
        return extracted

    def search_and_extract(self, query: str, limit: int = 10) -> List[Dict]:
        """Convenience method to search for LinkedIn URLs and extract each profile."""
        urls = self.search_profiles(query, limit=limit)
        leads: List[Dict] = []
        for url in urls:
            try:
                profile = self.extract_profile(url)
            except RuntimeError:
                logger.warning("Skipping profile due to extract failure: %s", url)
                continue
            if profile:
                leads.append(profile)
        return leads


__all__ = ["FirecrawlExtractor"]
