@echo off
REM Train Chatbot BiBietTuot

cd /d "%~dp0"
powershell -NoExit -Command "Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process -Force; & '.\TRAIN_CHATBOT.ps1'"
