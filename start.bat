@echo off
cd /d "%~dp0"

where node >nul 2>&1
if %errorlevel% neq 0 (
  echo [ERROR] Node.js가 설치되어 있지 않습니다.
  echo https://nodejs.org 에서 LTS 버전을 설치한 후 다시 실행하세요.
  pause
  exit /b 1
)

if not exist "node_modules" (
  echo 의존성 패키지를 설치하는 중...
  call npm install
)

echo.
echo AI Viral Studio PRO 개발 서버를 시작합니다...
echo 브라우저에서 http://localhost:3000 을 열어주세요.
echo 종료하려면 Ctrl+C 를 누르세요.
echo.

call npm run dev
