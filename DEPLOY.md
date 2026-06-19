# Streamlit Community Cloud 배포 가이드

**Streamlit Community Cloud** (share.streamlit.io) 에 배포하는 방법입니다.

> React 앱을 `app.py` + `static/` 폴더로 감싸서 Streamlit Cloud에서 실행합니다.

---

## 1. 로컬 빌드 (최초 1회 + 코드 변경 시)

```bash
npm install
npm run build:streamlit
```

`static/` 폴더가 생성됩니다. **이 폴더를 GitHub에 함께 push** 해야 합니다.

```bash
git add static app.py requirements.txt .streamlit
git commit -m "Update Streamlit build"
git push origin main
```

---

## 2. Streamlit Cloud 배포

1. https://share.streamlit.io 접속
2. **Continue with GitHub** 로그인
3. **Create app** 클릭
4. 설정 입력:

| 항목 | 값 |
|------|-----|
| Repository | `haseonho8342/ai-viral-studio-pro` |
| Branch | `main` |
| Main file path | `streamlit_app.py` 또는 `app.py` |
| App URL | 원하는 이름 (예: `ai-viral-studio`) |

5. **Advanced settings → Secrets** 에 아래 형식 입력:

```toml
VITE_YOUTUBE_API_KEY = "본인_YouTube_API_키"
VITE_GEMINI_API_KEY = "본인_Gemini_API_키"
```

6. **Deploy** 클릭

배포 URL 예시: `https://ai-viral-studio.streamlit.app`

---

## 3. 코드 수정 후 재배포

```bash
# 1. React 코드 수정
npm run build:streamlit

# 2. GitHub push
git add .
git commit -m "Update app"
git push
```

Streamlit Cloud가 자동으로 재배포합니다.

---

## 주의사항

- **무료 플랜**: GitHub **Public** 저장소만 지원
- **API 키**: Streamlit Secrets에 저장 (GitHub에 올리지 않음)
- **슬립 모드**: 12시간 미사용 시 앱이 잠들 수 있음 → 첫 방문 시 깨우기 버튼 표시
- Streamlit 정적 파일 경로는 `/app/static/` 입니다 (`/-/static/` 아님)

---

## 로컬 Streamlit 테스트

```bash
pip install -r requirements.txt
npm run build:streamlit

# .streamlit/secrets.toml 생성 (로컬용, Git 제외)
# VITE_YOUTUBE_API_KEY = "..."
# VITE_GEMINI_API_KEY = "..."

streamlit run app.py
```
