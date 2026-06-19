# AI Viral Studio PRO — 배포 정보

## 🌐 라이브 URL

| 항목 | 링크 |
|------|------|
| **프로덕션 (메인)** | https://ai-viral-studio-pro.vercel.app |
| **캐시 우회 접속** | https://ai-viral-studio-pro.vercel.app/?cachebust=3 |

---

## 📦 프로젝트 정보

| 항목 | 내용 |
|------|------|
| 앱 이름 | AI Viral Studio PRO v4.0 |
| GitHub | https://github.com/haseonho8342/ai-viral-studio-pro |
| 배포 플랫폼 | [Vercel](https://vercel.com) |
| DB | [Supabase](https://supabase.com) (Postgres) |
| 프레임워크 | React 19 + Vite 6 |

---

## 🔗 관리 대시보드

| 서비스 | URL |
|--------|-----|
| Vercel 대시보드 | https://vercel.com/dashboard |
| Supabase 대시보드 | https://supabase.com/dashboard |
| GitHub 저장소 | https://github.com/haseonho8342/ai-viral-studio-pro |

---

## ⚙️ 환경 변수 (Vercel)

| 변수명 | 용도 |
|--------|------|
| `VITE_SUPABASE_URL` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | Supabase anon public key |
| `VITE_YOUTUBE_API_KEY` | YouTube Shorts 실시간 피드 |
| `VITE_GEMINI_API_KEY` | Gemini AI 분석 (선택) |

> 환경 변수 수정 후 Vercel에서 **Redeploy** 필요

---

## 🧭 앱 메뉴

| 메뉴 | 기능 |
|------|------|
| 🏠 대시보드 | 실시간 통계, TOP5 급상승, AI 추천 |
| 📺 유튜브 쇼츠 실시간 | YouTube API 기반 Shorts 피드 |
| 🎵 TikTok 소싱 | TikTok 메타 분석 |
| 🛒 쿠팡 파트너스 | 쿠팡 연동 |
| 🔗 인포크 링크 | 인포크 링크 생성 |
| 🌏 중국어 번역 | 중국어 바이럴 번역 |
| 📝 대본 생성 | 30초/60초 대본 |
| 🖼️ 썸네일 스튜디오 | 썸네일 문구 제안 |
| 📊 분석 | 통계 |
| ⚙️ 설정 | API 키 · Supabase DB 상태 |

---

## 🗄️ Supabase 테이블

| 테이블 | 저장 내용 |
|--------|-----------|
| `analysis_history` | 쇼츠 분석 히스토리 |
| `user_settings` | 대본 톤, 쇼츠 지역 |
| `saved_shorts` | 저장한 쇼츠 |

---

## ✅ 동작 확인 방법

1. https://ai-viral-studio-pro.vercel.app 접속
2. **⚙️ 설정** → **Supabase DB** **● 연결됨** 확인
3. **📺 유튜브 쇼츠 실시간** → 카드 클릭 → 분석 실행
4. Supabase **Table Editor** → `analysis_history`에 데이터 저장 확인

---

## 🔄 재배포

```bash
git add .
git commit -m "Update app"
git push origin main
```

GitHub push 시 Vercel이 자동 재배포합니다.

---

## 📚 관련 문서

| 파일 | 내용 |
|------|------|
| `SETUP.md` | Supabase + Vercel 전체 설정 가이드 |
| `DEPLOY.md` | 배포 요약 |
| `supabase/migrations/001_initial_schema.sql` | DB 스키마 SQL |

---

## 📌 메모

- 배포 URL: **https://ai-viral-studio-pro.vercel.app**
- 캐시 문제 시: `?cachebust=숫자` 붙여서 접속
- YouTube 데이터가 0이면 `VITE_YOUTUBE_API_KEY` 환경 변수 확인 후 Redeploy
