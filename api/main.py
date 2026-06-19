"""
FastAPI — yt-dlp 다운로드 + OpenAI 자막 분석
실행: uvicorn main:app --reload --port 8000
"""
import json
import os
import re
import tempfile
from pathlib import Path

from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel

app = FastAPI(title="AI Viral Studio API", version="5.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

TMP = Path(tempfile.gettempdir()) / "avs_downloads"
TMP.mkdir(exist_ok=True)


class UrlBody(BaseModel):
    url: str


class AnalyzeBody(BaseModel):
    subtitle: str
    mode: str = "summary"


def _run_ytdlp(args: list[str]) -> None:
    import subprocess
    result = subprocess.run(
        ["yt-dlp", *args],
        capture_output=True,
        text=True,
        timeout=300,
    )
    if result.returncode != 0:
        raise HTTPException(500, result.stderr or "yt-dlp 실행 실패")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/api/metadata")
def metadata(body: UrlBody):
    """영상 메타데이터 추출"""
    import yt_dlp

    opts = {"quiet": True, "no_warnings": True, "skip_download": True}
    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(body.url, download=False)
    except Exception as e:
        raise HTTPException(400, str(e))

    return {
        "title": info.get("title"),
        "channel": info.get("channel") or info.get("uploader"),
        "duration": info.get("duration_string"),
        "view_count": info.get("view_count"),
        "thumbnail": info.get("thumbnail"),
        "description": (info.get("description") or "")[:500],
    }


@app.post("/api/subtitles")
def subtitles(body: UrlBody):
    """자막 추출 — 공식 자막 우선, 없으면 자동 생성 자막"""
    import yt_dlp

    out = TMP / "subs"
    out.mkdir(exist_ok=True)

    # 1) 공식 자막 (수동)
    for sub_opts in [
        {"writesubtitles": True, "subtitleslangs": ["ko", "en"], "skip_download": True},
        {"writeautomaticsub": True, "subtitleslangs": ["ko", "en"], "skip_download": True},
    ]:
        opts = {
            "quiet": True,
            "no_warnings": True,
            "outtmpl": str(out / "%(id)s"),
            **sub_opts,
        }
        try:
            with yt_dlp.YoutubeDL(opts) as ydl:
                info = ydl.extract_info(body.url, download=True)
            vid = info.get("id", "sub")
            for ext in ("vtt", "srt"):
                for lang in ("ko", "en"):
                    f = out / f"{vid}.{lang}.{ext}"
                    if f.exists():
                        text = _parse_subtitle(f.read_text(encoding="utf-8", errors="ignore"))
                        return {"source": "official" if "writesubtitles" in str(sub_opts) else "auto", "text": text}
        except Exception:
            continue

    raise HTTPException(404, "자막을 찾을 수 없습니다. 공식·자동 자막 모두 없음.")


def _parse_subtitle(raw: str) -> str:
    """VTT/SRT → 순수 텍스트"""
    lines = []
    for line in raw.splitlines():
        line = line.strip()
        if not line or line.startswith("WEBVTT") or "-->" in line or re.match(r"^\d+$", line):
            continue
        if re.match(r"^\d{2}:\d{2}", line):
            continue
        lines.append(line)
    return "\n".join(dict.fromkeys(lines))  # 중복 제거


@app.post("/api/analyze")
def analyze(body: AnalyzeBody):
    """OpenAI로 자막 분석"""
    api_key = os.getenv("OPENAI_API_KEY", "")
    if not api_key:
        raise HTTPException(500, "OPENAI_API_KEY가 설정되지 않았습니다.")

    prompts = {
        "summary": "다음 자막을 한국어로 5~7문장 요약해 주세요.",
        "three_line": "다음 자막을 한국어 3줄로 요약해 주세요.",
        "keywords": "다음 자막에서 핵심 키워드 10개를 쉼표로 구분해 추출해 주세요.",
        "study_note": "다음 자막을 바탕으로 공부 노트 형식(제목, 핵심 개념, 정리)으로 작성해 주세요.",
        "blog": "다음 자막을 블로그 포스트 형식으로 정리해 주세요.",
        "translate": "다음 자막을 자연스러운 한국어로 번역해 주세요.",
        "important": "다음 자막에서 가장 중요한 문장 5개를 bullet로 추출해 주세요.",
    }
    prompt = prompts.get(body.mode, prompts["summary"])

    import urllib.request

    payload = json.dumps({
        "model": "gpt-4o-mini",
        "messages": [
            {"role": "system", "content": "당신은 유튜브 학습 콘텐츠 분석 전문가입니다."},
            {"role": "user", "content": f"{prompt}\n\n---\n{body.subtitle[:12000]}"},
        ],
        "temperature": 0.4,
    }).encode()

    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=payload,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            data = json.loads(resp.read())
        text = data["choices"][0]["message"]["content"]
        return {"result": text, "mode": body.mode}
    except Exception as e:
        raise HTTPException(500, f"OpenAI 분석 실패: {e}")


@app.get("/api/download/{dtype}")
def download(dtype: str, url: str = Query(...)):
    """mp4 / mp3 / subtitle 다운로드"""
    import yt_dlp

    out = TMP / "files"
    out.mkdir(exist_ok=True)

    if dtype == "video":
        opts = {
            "format": "best[ext=mp4]/best",
            "outtmpl": str(out / "%(id)s.%(ext)s"),
            "quiet": True,
        }
    elif dtype == "mp3":
        opts = {
            "format": "bestaudio/best",
            "outtmpl": str(out / "%(id)s.%(ext)s"),
            "postprocessors": [{"key": "FFmpegExtractAudio", "preferredcodec": "mp3"}],
            "quiet": True,
        }
    elif dtype in ("subtitle", "auto-subtitle"):
        opts = {
            "writesubtitles": dtype == "subtitle",
            "writeautomaticsub": dtype == "auto-subtitle",
            "subtitleslangs": ["ko", "en"],
            "skip_download": True,
            "outtmpl": str(out / "%(id)s"),
            "quiet": True,
        }
    else:
        raise HTTPException(400, "지원하지 않는 형식")

    try:
        with yt_dlp.YoutubeDL(opts) as ydl:
            info = ydl.extract_info(url, download=True)
        vid = info.get("id", "file")

        if dtype in ("subtitle", "auto-subtitle"):
            for ext in ("vtt", "srt"):
                for lang in ("ko", "en"):
                    f = out / f"{vid}.{lang}.{ext}"
                    if f.exists():
                        return FileResponse(f, filename=f.name)
            raise HTTPException(404, "자막 파일을 찾을 수 없습니다.")

        for f in out.glob(f"{vid}.*"):
            if dtype == "mp3" and f.suffix == ".mp3":
                return FileResponse(f, filename=f.name)
            if dtype == "video" and f.suffix in (".mp4", ".webm", ".mkv"):
                return FileResponse(f, filename=f.name)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(500, str(e))

    raise HTTPException(500, "다운로드 파일을 찾을 수 없습니다.")
