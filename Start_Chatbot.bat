@echo off
REM Launcher đơn giản cho RUN_CHATBOT.ps1

cd /d "%~dp0"
powershell -NoExit -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; & '.\RUN_CHATBOT.ps1'"
