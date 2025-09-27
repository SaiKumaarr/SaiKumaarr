# Streamlit AI Lead Generation Agent

This project provides a Streamlit-based AI assistant that performs boolean Google searches for public LinkedIn profiles, extracts structured lead data, enriches it with Google Gemini, and saves the final results to a Google Sheet using Composio.

## Features
- 🔍 Boolean Google search queries executed through Firecrawl
- 🧠 Lead enrichment via Google Gemini (with graceful fallback to raw data)
- 📄 Structured profile extraction using Firecrawl's extract endpoint and JSON schema
- 🧾 Automatic lead export to Google Sheets powered by Composio
- 🖥️ Streamlit UI with simple input and actionable feedback

## Project Structure
```
.
├── app.py
├── requirements.txt
├── utils
│   ├── firecrawl_extractor.py
│   └── gemini_parser.py
├── .env.example
├── .gitignore
└── README.md
```

## Getting Started

1. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Create an environment file**
   ```bash
   cp .env.example .env
   ```
   Populate `.env` with the appropriate API keys.

3. **Run the Streamlit app**
   ```bash
   streamlit run app.py
   ```

## Environment Variables
| Variable | Description |
| --- | --- |
| `FIRECRAWL_API_KEY` | API key for Firecrawl search/extract APIs |
| `FIRECRAWL_BASE_URL` | (Optional) Override for the Firecrawl API base URL |
| `GOOGLE_API_KEY` | Google Gemini API key used by `google-generativeai` |
| `COMPOSIO_API_KEY` | API key for Composio's tool execution |

## Usage Notes
- No CLI authentication flows are required—Composio is used directly with its API key.
- The app handles failures gracefully and will surface actionable feedback in the UI.
- When Gemini enrichment fails or is unavailable, the app will fall back to Firecrawl's raw extracted data.
- Leads are written to a new Google Sheet with headers for easy review.

## Deployment
The codebase is organized for GitHub deployment. Ensure environment variables are securely configured in your hosting provider before launching the Streamlit application.
