# Vercel + Supabase 배포 가이드

**Vercel**에 React 앱을 배포하고 **Supabase Postgres**에 데이터를 저장합니다.

---

## 1. Supabase 프로젝트 설정

1. https://supabase.com/dashboard → **New project**
2. **SQL Editor** → `supabase/migrations/001_initial_schema.sql` 내용 붙여넣기 → **Run**
3. **Authentication** → **Providers** → **Anonymous sign-ins** → **Enable**
4. **Project Settings** → **API** 에서 복사:
   - Project URL → `VITE_SUPABASE_URL`
   - anon public key → `VITE_SUPABASE_ANON_KEY`

---

## 2. 로컬 개발

```bash
npm install
cp .env.example .env.local
# .env.local 에 API 키 + Supabase URL/anon key 입력
npm run dev
```

---

## 3. Vercel 배포

### 방법 A — GitHub 연동 (권장)

1. https://vercel.com → **Add New Project**
2. GitHub 저장소 `haseonho8342/ai-viral-studio-pro` 선택
3. Framework: **Vite** (자동 감지)
4. **Environment Variables** 추가:

| 변수 | 값 |
|------|-----|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon key |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API 키 |
| `VITE_GEMINI_API_KEY` | Gemini API 키 (선택) |

5. **Deploy** 클릭

### 방법 B — CLI

```bash
npm i -g vercel
vercel login
vercel --prod
```

---

## 4. Supabase에 저장되는 데이터

| 테이블 | 내용 |
|--------|------|
| `analysis_history` | 쇼츠 분석 히스토리 (최대 50건) |
| `user_settings` | 대본 톤, 쇼츠 지역 설정 |
| `saved_shorts` | 저장한 쇼츠 (확장용) |

- 익명 로그인(`signInAnonymously`)으로 세션 생성
- RLS로 본인 데이터만 접근 가능

---

## 5. 코드 수정 후 재배포

```bash
git add .
git commit -m "Update app"
git push origin main
```

Vercel이 GitHub push 시 자동 재배포합니다.

---

## 주의사항

- Supabase **anon key**는 프론트엔드에 노출되어도 됩니다 (RLS로 보호)
- YouTube/Gemini API 키는 Vercel Environment Variables에 저장
- Streamlit 배포(`app.py`, `static/`)는 Vercel 배포와 별개로 유지 가능
