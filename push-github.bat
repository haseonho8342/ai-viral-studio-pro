@echo off
chcp 65001 >nul
set PATH=C:\Program Files\Git\bin;C:\Program Files\GitHub CLI;%PATH%
cd /d "%~dp0"

echo ========================================
echo  AI Viral Studio PRO - GitHub Upload
echo ========================================
echo.

gh auth status >nul 2>&1
if errorlevel 1 (
    echo [1/3] GitHub 로그인이 필요합니다.
    echo       브라우저가 열리면 GitHub 계정으로 인증해 주세요.
    echo.
    gh auth login --hostname github.com --git-protocol https --web
    if errorlevel 1 (
        echo 로그인 실패. 다시 시도해 주세요.
        pause
        exit /b 1
    )
)

echo.
echo [2/3] GitHub 저장소 생성 및 연결...
gh repo create ai-viral-studio-pro --public --source=. --remote=origin --push
if errorlevel 1 (
    echo.
    echo 저장소가 이미 있거나 이름이 중복될 수 있습니다.
    echo 원격 저장소만 연결 후 push 시도...
    git remote remove origin 2>nul
    set /p REPO_URL=GitHub 저장소 URL 입력 (예: https://github.com/아이디/ai-viral-studio-pro.git): 
    git remote add origin %REPO_URL%
    git push -u origin main
)

echo.
echo [3/3] 완료!
gh repo view --web 2>nul
pause
