"""
Streamlit Community Cloud 기본 진입점 (streamlit_app.py)
app.py와 동일한 앱을 실행합니다.
"""

import importlib.util
from pathlib import Path

_app_path = Path(__file__).parent / "app.py"
_spec = importlib.util.spec_from_file_location("ai_viral_studio_app", _app_path)
_module = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_module)
