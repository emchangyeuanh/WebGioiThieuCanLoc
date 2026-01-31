# Train lại Chatbot BiBietTuot (PowerShell)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Chatbot BiBietTuot - Train Model" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lấy thư mục hiện tại
$ROOT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$CHATBOT_DIR = Join-Path $ROOT_DIR "chatbot-deployment"

# Chuyển vào folder chatbot-deployment
Set-Location $CHATBOT_DIR

Write-Host "[INFO] Chuyen vao folder: $CHATBOT_DIR" -ForegroundColor Yellow
Write-Host ""

# Activate virtual environment
& "venv\Scripts\Activate.ps1"
Write-Host "[SUCCESS] Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Chạy train
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Dang train model..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Dieu nay co the mat 30-60 giay..." -ForegroundColor Yellow
Write-Host ""

python train.py

Write-Host ""
Write-Host "[SUCCESS] Train hoan thanh!" -ForegroundColor Green
Write-Host "[INFO] File data.pth da duoc cap nhat" -ForegroundColor Green
Write-Host ""
Read-Host "Nhan Enter de dong cua so nay"
