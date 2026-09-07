@echo off
title FarmDirect - Live Website Launcher & Deployer
echo ======================================================================
echo           🌾 FarmDirect - SIH Live Website Options
echo ======================================================================
echo 1. Open Website Directly in Chrome/Edge (Instant)
echo 2. Start Local Live HTTP Server (http://localhost:3000)
echo 3. Deploy Live to the Internet for SIH Jury (Free Vercel Link)
echo ======================================================================
set /p opt="Choose an option (1, 2, or 3): "

if "%opt%"=="1" (
    start "" index.html
    echo Website opened in your browser!
)

if "%opt%"=="2" (
    echo Starting HTTP Server at http://localhost:3000 ...
    start "" http://localhost:3000
    python -m http.server 3000
)

if "%opt%"=="3" (
    echo Deploying to Vercel for a public live URL...
    npx vercel --prod
)

pause
