"""
AI Viral Studio PRO — Streamlit Community Cloud 진입점
React 빌드 결과(static/)를 iframe으로 표시하고 Secrets를 주입합니다.
"""

import json
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent
STATIC = ROOT / "static"
INDEX = STATIC / "index.html"


def write_runtime_config() -> None:
    try:
        config = {
            "VITE_YOUTUBE_API_KEY": st.secrets.get("VITE_YOUTUBE_API_KEY", ""),
            "VITE_GEMINI_API_KEY": st.secrets.get("VITE_GEMINI_API_KEY", ""),
        }
    except Exception:
        config = {"VITE_YOUTUBE_API_KEY": "", "VITE_GEMINI_API_KEY": ""}

    (STATIC / "runtime-config.js").write_text(
        f"window.__RUNTIME_CONFIG__ = {json.dumps(config)};",
        encoding="utf-8",
    )


st.set_page_config(
    page_title="AI Viral Studio PRO v4.0",
    page_icon="✨",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      header[data-testid="stHeader"] { visibility: hidden; height: 0; }
      .stApp { margin-top: -2rem; }
      iframe { border: none; width: 100%; }
    </style>
    """,
    unsafe_allow_html=True,
)

if not INDEX.exists():
    st.error(
        "static/index.html이 없습니다. "
        "로컬에서 `npm run build:streamlit` 실행 후 GitHub에 push해 주세요."
    )
    st.stop()

write_runtime_config()

components.iframe("/-/static/index.html", height=900, scrolling=True)
