# Website Giới Thiệu Cần Lộc - BiBietTuot Chatbot

Trang web giới thiệu du lịch, văn hóa và lịch sử Cần Lộc, Hà Tĩnh với chatbot AI tích hợp sẵn.

## 🎯 Tính Năng

- **Website tĩnh**: 11 trang web HTML/CSS/JS với thiết kế đẹp mắt
- **Chatbot AI**: Tích hợp chatbot BiBietTuot trả lời hỏi đáp tiếng Việt
- **Flask Backend**: API REST server để xử lý request từ chatbot
- **Deep Learning**: Sử dụng PyTorch cho NLP inference
- **Dễ tùy chỉnh**: Thêm Q&A mới vào file intents.json
- **Dark Mode**: Hỗ trợ chế độ tối cho website

## 📁 Cấu Trúc Thư Mục

```
WebGioiThieuCanLoc/
├── chatbot-deployment/          # Thư mục chính của chatbot
│   ├── app.py                   # Flask server
│   ├── chat.py                  # Logic chatbot
│   ├── model.py                 # Neural network model
│   ├── train.py                 # Script training
│   ├── intents.json             # Q&A database (46 intents)
│   ├── data.pth                 # Trained model weights
│   ├── requirements_fixed.txt    # Dependencies
│   ├── venv/                    # Virtual environment
│   ├── templates/               # HTML templates
│   └── static/                  # CSS, JS files
├── homepage/                    # Trang chủ + các trang con
├── dongloc/                     # Trang Đông Lộc
├── dulich/                      # Trang Du Lịch
├── huongtich/                   # Trang Hương Tích
├── cudo/                        # Trang Cù Đông
├── nhatho/                      # Trang Nhà Thờ
├── mocbantruongluu/             # Trang Mộc Bàn Trường Lưu
├── vidam/                       # Trang Vi Dạm
├── shared/                      # Shared CSS, JS cho chatbot
├── RUN_CHATBOT.ps1              # PowerShell launcher
├── Start_Chatbot.bat            # Batch launcher
├── TRAIN_CHATBOT.ps1            # Training launcher
└── README.md                    # File này

```

## 🚀 Cài Đặt & Chạy

### Yêu Cầu
- Python 3.10 trở lên
- Windows 10/11 hoặc Linux/Mac
- Git
- 500MB dung lượng ổ cứng

### Bước 1: Clone Repository
```bash
git clone https://github.com/emchangyeuanh/WebGioiThieuCanLoc.git
cd WebGioiThieuCanLoc
```

### Bước 2: Thiết Lập Virtual Environment
```bash
cd chatbot-deployment
python -m venv venv
```

### Bước 3: Kích Hoạt Virtual Environment

**Windows (PowerShell):**
```bash
.\venv\Scripts\Activate.ps1
```

**Windows (Command Prompt):**
```bash
.\venv\Scripts\activate.bat
```

**Linux/Mac:**
```bash
source venv/bin/activate
```

### Bước 4: Cài Đặt Dependencies
```bash
pip install -r requirements_fixed.txt
```

### Bước 5: Chạy Chatbot Server

**Cách 1: Chạy Script (Dễ Nhất - Windows)**
```bash
cd ..
.\Start_Chatbot.bat
```

**Cách 2: Chạy PowerShell (Windows)**
```bash
.\RUN_CHATBOT.ps1
```

**Cách 3: Chạy Trực Tiếp (Tất Cả OS)**
```bash
cd chatbot-deployment
python app.py
```

**Cách 4: Chạy với Gunicorn (Production)**
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### 🎉 Kết Quả
- Server chạy trên: `http://localhost:5000`
- Hoặc trên IP của bạn: `http://[your-ip]:5000`

## 💬 Sử Dụng Chatbot

### Hỏi Chatbot
1. Mở website: `http://localhost:5000`
2. Click vào chatbot widget (góc phải dưới)
3. Gõ câu hỏi tiếng Việt

### Ví Dụ Câu Hỏi
- "Cần Lộc ở đâu?"
- "Có gì nổi tiếng ở Cần Lộc?"
- "Hương Tích ở đâu?"
- "Làm sao đi du lịch Cần Lộc?"

## ⚙️ Tùy Chỉnh Chatbot

### Thêm Q&A Mới (Không Cần Retrain)

1. Mở file: `chatbot-deployment/intents.json`
2. Thêm intent mới vào cuối:
```json
{
  "tag": "ten-intent",
  "patterns": [
    "Câu hỏi 1",
    "Câu hỏi 2",
    "Câu hỏi 3"
  ],
  "responses": [
    "Trả lời 1",
    "Trả lời 2"
  ]
}
```
3. Lưu file
4. Restart chatbot server

### Retrain Model (Sau Nhiều Thay Đổi)

**Windows:**
```bash
.\Train_Chatbot.bat
```

**PowerShell:**
```bash
.\TRAIN_CHATBOT.ps1
```

**Thủ Công:**
```bash
cd chatbot-deployment
python train.py
```

## 📦 Cấu Thành Chính

### Chatbot Backend
- **app.py**: Flask server với 2 endpoints:
  - `GET /` - Trả về HTML website
  - `POST /predict` - API nhận câu hỏi, trả lời từ chatbot

- **chat.py**: Logic xử lý:
  - Tokenize câu hỏi
  - Tính bag-of-words
  - Inference model
  - Trả lời từ intents.json

- **model.py**: Neural network:
  - Input layer: 346 neurons
  - Hidden layer: 8 neurons
  - Output layer: 35 neurons (số lượng intents)

- **intents.json**: Database Q&A:
  - 46 intents
  - ~497 dòng
  - Toàn bộ tiếng Việt

### Website Frontend
- **11 trang HTML**: Giới thiệu các địa điểm tại Cần Lộc
- **Chatbot Widget**: Tích hợp vào mỗi trang
- **Responsive Design**: Tương thích mobile, tablet, desktop
- **Dark Mode**: Tính năng chế độ tối

## 🔧 Troubleshooting

### Chatbot không hoạt động
1. Kiểm tra Python: `python --version`
2. Kiểm tra venv: `pip list` (phải có Flask, torch, nltk)
3. Kiểm tra files: `data.pth`, `intents.json`, `chat.py`
4. Xem error log khi chạy `python app.py`

### Port 5000 đã được sử dụng
```bash
# Tìm process dùng port 5000
netstat -ano | findstr :5000

# Hoặc chạy trên port khác
python app.py --port 8000
```

### Virtual environment không hoạt động
```bash
# Xóa venv cũ
rmdir venv /s /q

# Tạo lại
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements_fixed.txt
```

### Model weights không tìm thấy
Đảm bảo `data.pth` nằm trong `chatbot-deployment/`

## 🚀 Deployment

### Deploy Trên Server (Linux/Ubuntu)
```bash
# Cài Python 3.10+
sudo apt update
sudo apt install python3.10 python3.10-venv python3-pip

# Clone repo
git clone https://github.com/emchangyeuanh/WebGioiThieuCanLoc.git
cd WebGioiThieuCanLoc/chatbot-deployment

# Setup venv
python3.10 -m venv venv
source venv/bin/activate
pip install -r requirements_fixed.txt

# Chạy với Gunicorn
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Deploy Với Nginx (Reverse Proxy)
```bash
# Cài Nginx
sudo apt install nginx

# Config /etc/nginx/sites-available/default
upstream chatbot_server {
    server 127.0.0.1:5000;
}

server {
    listen 80 default_server;
    server_name _;
    
    location / {
        proxy_pass http://chatbot_server;
    }
}

# Restart Nginx
sudo systemctl restart nginx
```

## 📝 Dependencies

Xem `chatbot-deployment/requirements_fixed.txt`:
- Flask==3.1.2
- torch>=2.0.0
- nltk>=3.8.0
- numpy>=1.24.0
- scikit-learn>=1.3.0
- pandas>=2.0.0
- ...và nhiều package khác

## 👨‍💻 Tác Giả & Liên Hệ

- **GitHub**: [emchangyeuanh](https://github.com/emchangyeuanh)
- **Repository**: [WebGioiThieuCanLoc](https://github.com/emchangyeuanh/WebGioiThieuCanLoc)

## 📄 Giấy Phép

Dự án này không có giấy phép cụ thể. Vui lòng liên hệ tác giả để xin phép sử dụng.

## 🎓 Ghi Chú Phát Triển

- ✅ Chatbot training hoàn thành (model weights đã lưu)
- ✅ Website tích hợp với API server
- ✅ Hỗ trợ dark mode
- ✅ Virtual environment setup tự động
- 🔄 Có thể thêm tính năng: Admin panel, Database persistent storage, Multi-language support

---

**Mời bạn khám phá Can Lộc qua chatbot BiBietTuot! 🌍**
