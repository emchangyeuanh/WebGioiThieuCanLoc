# 🤖 CHATBOT "BI BIẾT TUỐT" - CAN LỘC

## ✅ HOÀN THÀNH

✨ Chatbot đã được **kích hoạt** trên trang web `dulich.html`
✨ Chatbot đã được **train** với 10+ chủ đề về Can Lộc
✨ Mô hình Neural Network đã sẵn sàng trả lời

---

## 🚀 CÁCH SỬ DỤNG

### **Bước 1: Chạy Flask Server**

Mở PowerShell/CMD tại thư mục `chatbot-deployment`:

```bash
python app.py
```

Hoặc double-click file `run_chatbot.bat`

**Kết quả**: Server chạy tại `http://localhost:5000`

### **Bước 2: Mở Website**

Mở file `homepage/dulich.html` trong trình duyệt

### **Bước 3: Sử dụng Chatbot**

- Kích nút 💬 ở góc dưới phải
- Gõ câu hỏi → Nhấn Enter hoặc kích nút gửi
- Chatbot trả lời ngay lập tức! 

---

## 🎓 CÂUHỎI CÓ THỂ HỎI

```
✅ "Xin chào" / "Chào Bi"
✅ "Can lộc là gì?"
✅ "Địa điểm du lịch Can lộc?"
✅ "Ngã ba Đồng Lộc?"
✅ "Đặc sản Can lộc?"
✅ "6 xã Can lộc?"
✅ "Ẩm thực Can lộc?"
✅ "Làng nghề Can lộc?"
✅ "Đường đi đến Can lộc?"
✅ "Văn hóa Can lộc?"
```

---

## 📂 FILE LIÊN QUAN

| File | Mô tả |
|------|-------|
| `app.py` | Flask server (chạy cái này) |
| `chat.py` | Logic xử lý câu hỏi |
| `model.py` | Kiến trúc Neural Network |
| `data.pth` | Model đã train |
| `intents.json` | Dữ liệu train |
| `KÍCH_HOẠT_CHATBOT.md` | Hướng dẫn chi tiết |
| `test_chatbot.py` | Test chatbot trực tiếp |

---

## ❌ GẶP LỖI?

### **Port 5000 bị chiếm**
Sửa file `app.py`, dòng cuối:
```python
app.run(host='0.0.0.0', port=5001, debug=True)  # Thay 5000 → 5001
```

### **Module Flask không có**
```bash
pip install flask flask-cors
```

### **Chatbot không trả lời**
- Kiểm tra Flask server có chạy không
- Console trình duyệt (F12) có lỗi gì không

---

## 📱 TEST NGAY

**Không muốn chạy Flask?** Chạy test trực tiếp:

```bash
cd chatbot-deployment
python test_chatbot.py
```

Gõ câu hỏi trong console để test model!

---

## 📊 THÔNG TIN MƠDELEL

- **Tên**: Bi Biết Tuốt 🤖
- **Loại**: Neural Network (PyTorch)
- **Ngôn ngữ**: Tiếng Việt
- **Confidence threshold**: 75%
- **Số intent**: 10

---

**✨ Chatbot đã sẵn sàng! Bắt đầu sử dụng ngay! 🚀**
