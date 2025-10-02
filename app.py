"""Streamlit application for AI-powered lead generation."""
from __future__ import annotations

import logging
import os
from datetime import datetime
from typing import Callable, Dict, List

import pandas as pd
import streamlit as st
from composio import ComposioToolSet
from dotenv import load_dotenv

from utils.firecrawl_extractor import FirecrawlExtractor
from utils.gemini_parser import GeminiParser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


def _resolve_executor(toolset: ComposioToolSet) -> Callable[[ComposioToolSet, str, str, Dict], Dict]:
    """Return a callable that can execute Composio actions regardless of SDK version."""
    if hasattr(toolset, "execute_action"):
        return lambda ts, tool, action, params: ts.execute_action(tool_name=tool, action_name=action, params=params)
    if hasattr(toolset, "execute"):
        return lambda ts, tool, action, params: ts.execute(tool_name=tool, action_name=action, params=params)
    if hasattr(toolset, "run_action"):
        return lambda ts, tool, action, params: ts.run_action(tool_name=tool, action_name=action, params=params)
    raise AttributeError("ComposioToolSet client does not support action execution methods")


def create_leads_sheet(leads: List[Dict]) -> str:
    """Return the URL for a newly created Google Sheet populated with the supplied leads without changing sharing settings.

    Additional steps are required if the sheet needs to be publicly accessible.
    """
    api_key = os.getenv("COMPOSIO_API_KEY")
    if not api_key:
        raise ValueError("COMPOSIO_API_KEY environment variable is required to save leads")

    toolset = ComposioToolSet(api_key=api_key)
    executor = _resolve_executor(toolset)

    title = f"AI Leads {datetime.utcnow():%Y%m%d-%H%M%S}"
    create_response = executor(toolset, "google_sheets", "create_spreadsheet", {"title": title})

    spreadsheet_id = None
    if isinstance(create_response, dict):
        spreadsheet_id = (
            create_response.get("spreadsheetId")
            or create_response.get("id")
            or create_response.get("spreadsheet_id")
        )
    if not spreadsheet_id:
        raise RuntimeError("Failed to create Google Sheet via Composio")

    headers = ["name", "headline", "company", "location", "linkedin_url"]
    values = [headers]
    for lead in leads:
        row = [lead.get(key, "") for key in headers]
        values.append(row)

    update_payload = {
        "spreadsheet_id": spreadsheet_id,
        "range": "Leads!A1",
        "values": values,
    }

    executor(toolset, "google_sheets", "batch_update_values", update_payload)

    return f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}"


def generate_leads(criteria: str, limit: int = 10) -> List[Dict]:
    extractor = FirecrawlExtractor()
    leads = extractor.search_and_extract(criteria, limit=limit)
    if not leads:
        return []

    parser = GeminiParser()
    enriched: List[Dict] = []
    for lead in leads:
        enriched.append(parser.enrich_lead(lead))
    return enriched


def main() -> None:
    st.set_page_config(page_title="AI Lead Generation Agent", layout="wide")
    st.title("AI Lead Generation Agent")
    st.write("Enter a boolean query to discover LinkedIn leads and export them to Google Sheets.")

    criteria = st.text_input(
        "Lead criteria",
        placeholder='e.g. site:linkedin.com/in "Marketing Director" AND "SaaS" AND "Berlin" -jobs',
    )
    max_leads = st.slider("Number of leads", min_value=1, max_value=25, value=10)

    if st.button("Generate Leads"):
        if not criteria.strip():
            st.warning("Please provide a search query to continue.")
            return

        with st.spinner("Searching and enriching leads..."):
            try:
                leads = generate_leads(criteria, limit=max_leads)
            except ValueError as exc:
                st.error(str(exc))
                return
            except Exception as exc:  # pragma: no cover - runtime errors surfaced to UI
                logger.exception("Lead generation failed")
                st.error(f"Lead generation failed: {exc}")
                return

        if not leads:
            st.info("No leads were found for the provided query. Try adjusting your keywords.")
            return

        try:
            sheet_url = create_leads_sheet(leads)
        except Exception as exc:  # pragma: no cover
            logger.exception("Failed to save leads to Google Sheets")
            st.error(f"Failed to save leads to Google Sheets: {exc}")
            st.dataframe(pd.DataFrame(leads))
            return

        st.success("Leads generated and saved successfully!")
        st.markdown(f"[Open Google Sheet]({sheet_url})")
        st.dataframe(pd.DataFrame(leads))


if __name__ == "__main__":
    main()
