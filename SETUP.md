# AI Viral Studio PRO — Supabase + Vercel 설정 가이드

> 저장소: `haseonho8342/ai-viral-studio-pro`  
> 스택: React 19 + Vite 6 + Supabase + Vercel

---

## 목차

1. [Supabase DB 설정](#1-supabase-db-설정)
2. [SQL 실행 결과 확인](#2-sql-실행-결과-확인)
3. [익명 로그인 활성화](#3-익명-로그인-활성화)
4. [API 키 복사](#4-api-키-복사)
5. [Vercel 배포](#5-vercel-배포)
6. [동작 확인](#6-동작-확인)
7. [로컬 개발](#7-로컬-개발)
8. [문제 해결](#8-문제-해결)

---

## 1. Supabase DB 설정

### 1-1. 프로젝트 생성

1. https://supabase.com/dashboard 접속
2. **New project** 클릭
3. 프로젝트 이름·비밀번호·리전 설정 후 생성 (1~2분 대기)

### 1-2. SQL 실행

1. 왼쪽 메뉴 **SQL Editor** 클릭
2. **New query** 클릭
3. 아래 파일 **전체 내용**을 붙여넣기:

```
supabase/migrations/001_initial_schema.sql
```

4. **Run** (또는 Ctrl+Enter) 클릭

> ⚠️ **1~73줄 전체**를 한 번에 실행하세요. RLS 정책(56~72줄)만 실행하면 테이블이 없을 수 있습니다.

### 1-3. 생성되는 테이블

| 테이블 | 용도 |
|--------|------|
| `user_settings` | 대본 톤, 쇼츠 지역 설정 |
| `analysis_history` | 쇼츠 분석 히스토리 (최대 50건) |
| `saved_shorts` | 저장한 쇼츠 (확장용) |

---

## 2. SQL 실행 결과 확인

### 정상 메시지

```
Success. No rows returned
```

이 메시지가 나오면 **정상**입니다.

- `CREATE TABLE`, `CREATE POLICY` 같은 명령은 **결과 행(row)을 반환하지 않습니다**
- 오류가 있으면 빨간색 에러 메시지가 표시됩니다

### 테이블 생성 확인

1. 왼쪽 메뉴 **Table Editor** 클릭
2. 아래 3개 테이블이 보이면 성공:
   - `user_settings`
   - `analysis_history`
   - `saved_shorts`

테이블이 없으면 SQL Editor에서 **1~73줄 전체**를 다시 실행하세요.

---

## 3. 익명 로그인 활성화

앱이 별도 회원가입 없이 Supabase에 접속하려면 **익명 로그인**이 필요합니다.

1. 왼쪽 메뉴 **Authentication** 클릭
2. **Providers** 탭 선택
3. **Anonymous sign-ins** 찾기
4. **Enable** 켜기
5. **Save** 클릭

---

## 4. API 키 복사

1. 왼쪽 메뉴 **Project Settings** (톱니바퀴) 클릭
2. **API** 메뉴 선택
3. 아래 두 값을 복사해 둡니다:

| Supabase 항목 | Vercel 환경 변수명 |
|---------------|-------------------|
| Project URL | `VITE_SUPABASE_URL` |
| anon public (키) | `VITE_SUPABASE_ANON_KEY` |

> `service_role` 키는 **절대** 프론트엔드에 넣지 마세요. `anon` 키만 사용합니다.

---

## 5. Vercel 배포

### 5-1. 프로젝트 연결

1. https://vercel.com 접속 → 로그인
2. **Add New Project** 클릭
3. GitHub 저장소 **`haseonho8342/ai-viral-studio-pro`** 선택
4. Framework: **Vite** (자동 감지됨)
5. Root Directory: 기본값(`.`) 유지

### 5-2. 환경 변수 설정

**Environment Variables**에 아래 4개를 추가합니다:

| 변수명 | 값 | 필수 |
|--------|-----|------|
| `VITE_SUPABASE_URL` | Supabase Project URL | ✅ |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key | ✅ |
| `VITE_YOUTUBE_API_KEY` | YouTube Data API v3 키 | ✅ |
| `VITE_GEMINI_API_KEY` | Google Gemini API 키 | 선택 |

**YouTube API 키 발급:** https://console.cloud.google.com/apis/library/youtube.googleapis.com  
**Gemini API 키 발급:** https://aistudio.google.com/apikey

### 5-3. 배포

1. **Deploy** 클릭
2. 1~3분 대기
3. 배포 완료 후 URL 확인 (예: `https://ai-viral-studio-pro.vercel.app`)

### 5-4. 환경 변수 추가 후 재배포

환경 변수를 나중에 추가·수정했다면:

1. Vercel 프로젝트 → **Settings** → **Environment Variables**
2. 변수 저장 후 **Deployments** → 최신 배포 → **Redeploy**

---

## 6. 동작 확인

### 앱에서 확인

1. Vercel 배포 URL 접속
2. 왼쪽 사이드바 **⚙️ 설정** 클릭
3. **🗄️ Supabase DB** 항목 확인:
   - **● 연결됨** → DB 연동 성공
   - **○ 미연결** → 환경 변수 또는 익명 로그인 확인 필요

4. **📺 유튜브 쇼츠 실시간**에서 카드 클릭
5. 분석이 실행되면 DB에 저장됨

### Supabase에서 확인

1. Supabase **Table Editor** → `analysis_history` 테이블
2. 카드 클릭 후 새 row가 추가되면 **DB 저장 성공**

---

## 7. 로컬 개발

```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 파일 생성
cp .env.example .env.local

# 3. .env.local 편집 (아래 4개 입력)
# VITE_SUPABASE_URL=https://xxxx.supabase.co
# VITE_SUPABASE_ANON_KEY=eyJhbG...
# VITE_YOUTUBE_API_KEY=AIza...
# VITE_GEMINI_API_KEY=AIza...

# 4. 개발 서버 실행
npm run dev
```

브라우저: http://localhost:3000

---

## 8. 문제 해결

### SQL 실행 시 "relation already exists"

이미 테이블이 만들어진 상태입니다. **정상**이며, Table Editor에서 테이블만 확인하면 됩니다.

### SQL 실행 시 "policy already exists"

RLS 정책이 이미 있습니다. **정상**입니다. Table Editor에서 테이블 3개만 확인하세요.

### 설정에서 Supabase "○ 미연결"

| 확인 항목 | 해결 |
|-----------|------|
| Vercel 환경 변수 | `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` 입력 후 Redeploy |
| 익명 로그인 | Supabase → Authentication → Anonymous sign-ins **Enable** |
| SQL 미실행 | `001_initial_schema.sql` **전체** 다시 실행 |

### YouTube 데이터가 안 나옴

| 확인 항목 | 해결 |
|-----------|------|
| YouTube API 키 | Vercel에 `VITE_YOUTUBE_API_KEY` 설정 |
| API 활성화 | Google Cloud에서 YouTube Data API v3 활성화 |
| 재배포 | 환경 변수 추가 후 Vercel **Redeploy** |

### 분석 히스토리가 DB에 안 쌓임

1. 설정 → Supabase **● 연결됨** 인지 확인
2. Table Editor → `analysis_history` 선택
3. 브라우저 개발자 도구(F12) → Console에 `[Supabase]` 오류 있는지 확인

---

## 체크리스트 (한눈에)

- [ ] Supabase 프로젝트 생성
- [ ] SQL Editor에서 `001_initial_schema.sql` **전체** 실행
- [ ] 결과: `Success. No rows returned`
- [ ] Table Editor에 테이블 3개 확인
- [ ] Anonymous sign-ins **Enable**
- [ ] Project URL + anon key 복사
- [ ] Vercel 프로젝트 생성 + GitHub 연동
- [ ] 환경 변수 4개 입력
- [ ] Deploy / Redeploy
- [ ] 앱 설정에서 Supabase **● 연결됨** 확인
- [ ] 쇼츠 카드 클릭 후 `analysis_history`에 데이터 확인

---

## 참고 링크

| 서비스 | URL |
|--------|-----|
| GitHub 저장소 | https://github.com/haseonho8342/ai-viral-studio-pro |
| Supabase 대시보드 | https://supabase.com/dashboard |
| Vercel 대시보드 | https://vercel.com/dashboard |
| YouTube API | https://console.cloud.google.com/apis/library/youtube.googleapis.com |
| Gemini API | https://aistudio.google.com/apikey |

---

## 코드 수정 후 재배포

```bash
git add .
git commit -m "Update app"
git push origin main
```

GitHub에 push하면 Vercel이 **자동으로 재배포**합니다.
