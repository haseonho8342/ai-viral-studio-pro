# AI Viral Studio PRO v5 — 기능 개편 명세 (적용 완료)

> 명세서의 Next.js 경로는 **기존 React + Vite 구조**에 맞게 컴포넌트 기반 라우팅으로 변환했습니다.

## 배포 URL

https://ai-viral-studio-pro.vercel.app

---

## 제거된 기능

- TikTok 소싱
- 샤오홍슈 (Xiaohongshu)
- 중국어 번역
- 썸네일 스튜디오
- 쿠팡 파트너스 / 인포크 / 대본 생성 / 바이럴 쇼츠 실시간 등 구 플랫폼 메뉴

---

## 새 메뉴 구조

| 메뉴 ID | 화면 | 파일 |
|---------|------|------|
| home | Home | `src/components/Home.jsx` |
| youtubeSearch | YouTube Search | `src/components/YoutubeSearch.jsx` |
| youtubeDetail | 영상 상세 | `src/components/YoutubeDetail.jsx` |
| aiAnalysis | AI Analysis | `src/components/AiAnalysis.jsx` |
| downloadCenter | Download Center | `src/components/DownloadCenter.jsx` |
| dashboard | Dashboard | `src/components/DashboardPage.jsx` |
| history | History | `src/components/HistoryPage.jsx` |
| settings | Settings | `src/components/Settings.jsx` |

---

## 아키텍처

```
User (Browser)
    ↓
React + Vite (Vercel)
    ↓
YouTube Data API v3  ← VITE_YOUTUBE_API_KEY
    ↓
FastAPI (yt-dlp)     ← VITE_API_BASE_URL
    ↓
OpenAI API           ← OPENAI_API_KEY (FastAPI 서버)
    ↓
Supabase Postgres    ← VITE_SUPABASE_URL / ANON_KEY
```

---

## Supabase 테이블 (002 마이그레이션)

`supabase/migrations/002_youtube_platform.sql` 실행 필요

### videos

| 컬럼 | 타입 |
|------|------|
| id | uuid |
| user_id | uuid |
| video_id | text |
| title | text |
| channel | text |
| thumbnail | text |
| url | text |
| view_count | bigint |
| duration | text |
| published_at | timestamptz |
| created_at | timestamptz |

### analysis

| 컬럼 | 타입 |
|------|------|
| id | uuid |
| user_id | uuid |
| video_id | text |
| subtitle | text |
| summary | text |
| keywords | text |
| study_note | text |
| blog_summary | text |
| three_line_summary | text |
| important_sentences | text |
| korean_translation | text |
| created_at | timestamptz |

---

## FastAPI 백엔드

```bash
cd api
pip install -r requirements.txt
# OPENAI_API_KEY 환경변수 설정
uvicorn main:app --reload --port 8000
```

### 엔드포인트

| Method | Path | 기능 |
|--------|------|------|
| GET | /health | 헬스체크 |
| POST | /api/metadata | 메타데이터 추출 |
| POST | /api/subtitles | 자막 추출 (공식→자동) |
| POST | /api/analyze | OpenAI 자막 분석 |
| GET | /api/download/video | MP4 다운로드 |
| GET | /api/download/mp3 | MP3 다운로드 |
| GET | /api/download/subtitle | 자막 다운로드 |
| GET | /api/download/auto-subtitle | 자동 자막 다운로드 |

---

## 환경 변수

### Vercel / .env.local (프론트)

```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
VITE_YOUTUBE_API_KEY=
VITE_API_BASE_URL=https://your-fastapi-server.com
```

### FastAPI 서버

```
OPENAI_API_KEY=sk-...
```

---

## 설정 체크리스트

- [ ] Supabase `002_youtube_platform.sql` 실행
- [ ] Anonymous sign-ins 활성화
- [ ] Vercel 환경 변수 4개 설정
- [ ] FastAPI 서버 배포 (Railway/Render/로컬)
- [ ] yt-dlp + ffmpeg 서버 설치

---

## 기능 흐름

```
유튜브 검색 → 영상 선택 → 상세 정보
    → 다운로드 (MP4/MP3/자막)
    → AI 분석 (요약/키워드/공부노트)
    → Supabase 저장 → History/Dashboard
```
