# Cloudflare Pages 배포 가이드

AI Viral Studio PRO를 **Cloudflare Pages**에 배포하는 방법입니다.  
GitHub 저장소와 연동하면 `main` 브랜치 push 시 자동 배포됩니다.

---

## 방법 A — Cloudflare 대시보드 (가장 쉬움)

### 1. Cloudflare 가입
https://dash.cloudflare.com/sign-up

### 2. Pages 프로젝트 생성
1. **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
2. GitHub 계정 연결 → `haseonho8342/ai-viral-studio-pro` 선택
3. 빌드 설정:

| 항목 | 값 |
|------|-----|
| Framework preset | Vite |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Node version | `20` |

### 3. 환경 변수 (Settings → Environment variables)

| 변수 | 필수 | 설명 |
|------|------|------|
| `VITE_YOUTUBE_API_KEY` | ✅ | YouTube Data API v3 키 |
| `VITE_GEMINI_API_KEY` | 선택 | Gemini API 키 |

Production / Preview 모두에 추가하세요.

### 4. Deploy 클릭

배포 완료 후 URL 예시:
`https://ai-viral-studio-pro.pages.dev`

---

## 방법 B — GitHub Actions 자동 배포

`.github/workflows/cloudflare-pages.yml` 이 포함되어 있습니다.

### GitHub Secrets 등록

저장소 → **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

| Secret 이름 | 설명 |
|-------------|------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare API 토큰 (Pages Edit 권한) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare 대시보드 우측 Account ID |
| `VITE_YOUTUBE_API_KEY` | YouTube API 키 |
| `VITE_GEMINI_API_KEY` | Gemini API 키 (선택) |

### API 토큰 발급
1. Cloudflare → **My Profile** → **API Tokens**
2. **Create Token** → **Edit Cloudflare Workers** 템플릿 사용
3. Account Resources: 해당 계정 전체
4. Zone Resources: All zones (또는 해당 zone)

`main` 브랜치에 push하면 자동 배포됩니다.

---

## 로컬에서 수동 배포

```bash
npm install
npm run build
npx wrangler pages deploy dist --project-name=ai-viral-studio-pro
```

최초 1회 Cloudflare 로그인 필요:
```bash
npx wrangler login
```

---

## 커스텀 도메인

Cloudflare Pages → 프로젝트 → **Custom domains** → 도메인 추가

---

## 보안 참고

- `VITE_` 환경 변수는 **빌드 시 클라이언트 번들에 포함**됩니다.
- 운영 환경에서는 API 키를 **Cloudflare Workers 프록시**로 숨기는 것을 권장합니다.
