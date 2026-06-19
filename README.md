# AI Viral Studio PRO v4.0

YouTube Shorts 실시간 데이터 기반 AI 콘텐츠 제작 SaaS (React + Vite)

## 주요 기능

- **대시보드** — 실시간 수집 통계, 트렌드 키워드, TOP5 급상승
- **유튜브 쇼츠 실시간** — YouTube API 연동, 조회수/좋아요/최신순 정렬
- **Workspace** — 카드 클릭 시 쿠팡·인포크·중국어·대본·썸네일 자동 생성
- **규칙 기반 AI 엔진** — Gemini 없이도 동작 (Gemini는 수동 재시도)

## 시작하기

### 1. 의존성 설치

```bash
npm install
```

### 2. 환경 변수 설정

`.env.example`을 복사해 `.env.local` 생성:

```bash
copy .env.example .env.local
```

| 변수 | 설명 |
|------|------|
| `VITE_GEMINI_API_KEY` | Google Gemini API 키 (선택) |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 키 (필수) |

### 3. 개발 서버 실행

```bash
npm run dev
```

또는 Windows에서 `start.bat` 더블클릭

브라우저: http://localhost:3000

## 빌드

```bash
npm run build
npm run preview
```

## 프로젝트 구조

```
src/
├── components/       # UI 컴포넌트
├── context/          # AppContext (전역 상태)
├── hooks/            # 커스텀 훅
├── services/         # API·엔진 레이어
│   ├── youtubeShortsEngine.js
│   ├── workspaceEngine.js
│   ├── scriptFallbackEngine.js
│   ├── thumbnailFallbackEngine.js
│   └── translateFallbackEngine.js
└── styles/           # CSS
```

## 스택

- React 19 + Vite 6
- YouTube Data API v3
- Google Gemini API (선택)

## Streamlit Community Cloud 배포

자세한 내용은 [DEPLOY.md](./DEPLOY.md) 참고.

```bash
npm run build:streamlit   # static/ 폴더 생성
git push origin main        # GitHub push
```

1. https://share.streamlit.io → GitHub 연동
2. Main file: `app.py`
3. Secrets: `VITE_YOUTUBE_API_KEY`, `VITE_GEMINI_API_KEY`

## 보안

- `.env.local` / `.streamlit/secrets.toml` 은 Git에 포함되지 않습니다.
- Streamlit Cloud **Secrets** 탭에서 API 키를 설정하세요.

## 라이선스

Private — All Rights Reserved © 2026
