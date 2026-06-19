"""
AI Viral Studio PRO — Streamlit Community Cloud 진입점
React SPA를 iframe으로 로드하고 Secrets를 postMessage로 주입합니다.
"""

import json
from pathlib import Path

import streamlit as st
import streamlit.components.v1 as components

ROOT = Path(__file__).parent
STATIC = ROOT / "static"
INDEX = STATIC / "index.html"


def load_secrets_config() -> dict:
    try:
        return {
            "VITE_YOUTUBE_API_KEY": st.secrets.get("VITE_YOUTUBE_API_KEY", ""),
            "VITE_GEMINI_API_KEY": st.secrets.get("VITE_GEMINI_API_KEY", ""),
        }
    except Exception:
        return {"VITE_YOUTUBE_API_KEY": "", "VITE_GEMINI_API_KEY": ""}


def build_iframe_shell(config: dict) -> str:
    config_json = json.dumps(config)
    return f"""
<div style="width:100%;height:900px;overflow:hidden;">
  <iframe
    id="avs-spa-frame"
    src="/app/static/index.html"
    style="width:100%;height:900px;border:none;display:block;"
    allow="clipboard-write"
  ></iframe>
</div>
<script>
(function () {{
  var config = {config_json};
  var frame = document.getElementById("avs-spa-frame");

  function sendConfig() {{
    if (!frame || !frame.contentWindow) return;
    frame.contentWindow.postMessage({{ type: "RUNTIME_CONFIG", config: config }}, "*");
  }}

  frame.addEventListener("load", sendConfig);
  setTimeout(sendConfig, 300);
  setTimeout(sendConfig, 1200);
}})();
</script>
"""


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

components.html(build_iframe_shell(load_secrets_config()), height=900, scrolling=False)
