@echo off
title Cherkaoui Portfolio Server
echo ========================================================
echo Starting Cherkaoui Portfolio on http://localhost:8000
echo Press Ctrl+C in this window to stop the server anytime.
echo ========================================================
start http://localhost:8000
python -m http.server 8000 --bind 127.0.0.1
pause
