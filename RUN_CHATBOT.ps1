# Launcher Chatbot từ folder gốc Website_Gioi_Thieu_Can_Loc
# PowerShell Version (Chạy tốt hơn trên Windows 10+)

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Chatbot BiBietTuot - Launcher" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Lấy thư mục hiện tại
$ROOT_DIR = Split-Path -Parent $MyInvocation.MyCommand.Path
$CHATBOT_DIR = Join-Path $ROOT_DIR "chatbot-deployment"

# Kiểm tra folder chatbot-deployment tồn tại
if (-not (Test-Path $CHATBOT_DIR)) {
    Write-Host "[ERROR] Khong tim thay folder chatbot-deployment" -ForegroundColor Red
    Write-Host "Kiem tra duong dan: $CHATBOT_DIR" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}

# Chuyển vào folder chatbot-deployment
Set-Location $CHATBOT_DIR
if (-not $?) {
    Write-Host "[ERROR] Khong the vao folder chatbot-deployment" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}

Write-Host "[INFO] Chuyen vao folder: $CHATBOT_DIR" -ForegroundColor Yellow
Write-Host ""

# Kiểm tra Python
$pythonVersion = python --version 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Python khong duoc cai dat hoac khong o trong PATH" -ForegroundColor Red
    Write-Host "Vui long cai dat Python 3.9+ tu https://www.python.org/" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}
Write-Host "[SUCCESS] Python available: $pythonVersion" -ForegroundColor Green
Write-Host ""

# Kiểm tra virtual environment
if (-not (Test-Path "venv")) {
    Write-Host "[INFO] Virtual environment khong tim thay, dang tao..." -ForegroundColor Yellow
    python -m venv venv
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Khong the tao virtual environment" -ForegroundColor Red
        Read-Host "Nhan Enter de dong cua so nay"
        exit 1
    }
    Write-Host "[SUCCESS] Virtual environment tao thanh cong" -ForegroundColor Green
    Write-Host ""
}

# Activate virtual environment
& "venv\Scripts\Activate.ps1"
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERROR] Khong the activate virtual environment" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}
Write-Host "[SUCCESS] Virtual environment activated" -ForegroundColor Green
Write-Host ""

# Kiểm tra requirements
$REQUIREMENTS = "requirements.txt"
if (Test-Path "requirements_fixed.txt") {
    $REQUIREMENTS = "requirements_fixed.txt"
}

# Cài đặt dependencies nếu cần
Write-Host "[INFO] Kiem tra va cai dat dependencies..." -ForegroundColor Yellow
Write-Host "[INFO] Dieu nay co the mat 2-5 phut lan dau tien..." -ForegroundColor Yellow
Write-Host ""

pip install -r $REQUIREMENTS
if ($LASTEXITCODE -ne 0) {
    Write-Host ""
    Write-Host "[ERROR] Khong the cai dat dependencies" -ForegroundColor Red
    Write-Host "Vui long kiem tra internet hoac xem loi phia tren" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}
Write-Host ""
Write-Host "[SUCCESS] Dependencies da cai dat xong" -ForegroundColor Green
Write-Host ""

# Kiểm tra file model
if (-not (Test-Path "data.pth")) {
    Write-Host "[ERROR] File data.pth (model) khong tim thay" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}

if (-not (Test-Path "intents.json")) {
    Write-Host "[ERROR] File intents.json khong tim thay" -ForegroundColor Red
    Read-Host "Nhan Enter de dong cua so nay"
    exit 1
}

Write-Host "[SUCCESS] Model files found" -ForegroundColor Green
Write-Host ""

# Chạy Flask app
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  Khoi dong Chatbot Server..." -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "[INFO] Server se chay tai: http://localhost:5000" -ForegroundColor Yellow
Write-Host "[INFO] Nhan Ctrl+C de thoat" -ForegroundColor Yellow
Write-Host ""
Write-Host "Dang khoi dong... (cho 2-3 giay)" -ForegroundColor Yellow
Write-Host ""

Start-Sleep -Seconds 2

python app.py

Write-Host ""
Write-Host "[ERROR] Server bi dung hoat dong" -ForegroundColor Red
Read-Host "Nhan Enter de dong cua so nay"
