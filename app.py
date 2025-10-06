"""Streamlit application for AI-powered lead generation."""
from __future__ import annotations

import logging
from typing import Dict, List

import pandas as pd
import streamlit as st
from dotenv import load_dotenv

from utils.firecrawl_extractor import FirecrawlExtractor
from utils.gemini_parser import GeminiParser

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

load_dotenv()


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
    st.write("Enter a boolean query to discover LinkedIn leads.")

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

        st.success("Leads generated successfully!")
        st.dataframe(pd.DataFrame(leads))


if __name__ == "__main__":
    main()
