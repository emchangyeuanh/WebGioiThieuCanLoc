# 🎵 Hướng Dẫn Sử Dụng Chức Năng Phát Nhạc

## ✅ Đã Hoàn Thành

Trang web đã được cập nhật để hỗ trợ phát nhạc MP3 khi nhấn "Nghe Ngay". Dưới đây là những thay đổi đã được thực hiện:

### 1. **Thêm Thư Mục Music**
- Tạo thư mục `vidam/music/` để lưu file MP3
- Đường dẫn: `c:\Users\NgMinhDuc\OneDrive\Desktop\stitch_can_loc_homeland_introduction_landing_page\vidam\music\`

### 2. **Cập Nhật HTML**
- Sửa nút "Nghe Ngay" (id: `music-play-btn`)
- Loại bỏ code lạ trong button
- Audio element đã được cấu hình đúng với id: `background-music`
- Đường dẫn file nhạc: `music/dan-ca.mp3`

### 3. **Cấu Hình Audio**
```html
<!-- Trong codevidam.html -->
<audio id="background-music" preload="metadata">
    <source src="music/dan-ca.mp3" type="audio/mpeg">
    <source src="music/dan-ca.ogg" type="audio/ogg">
    Trình duyệt của bạn không hỗ trợ thẻ audio.
</audio>
```

### 4. **Cập Nhật CSS**
- Thêm hiệu ứng animation cho nút "Nghe Ngay"
- Thêm hiệu ứng sóng âm thanh (sound-waves)
- Thêm hiệu ứng glow khi đang phát nhạc
- Thêm animation pulse-beat cho nút play
- Cấu hình mini player visualization

### 5. **JavaScript (Đã Có)**
- File `script.js` đã hỗ trợ phát nhạc
- Event handler cho nút "Nghe Ngay" đã được gắn
- Mini player hoạt động tự động khi nhạc phát

---

## 📁 Cách Thêm File MP3

### Bước 1: Chuẩn Bị File Nhạc
1. Chọn file nhạc dân ca Ví, Giặm của bạn
2. Định dạng: **MP3**
3. Kích thước tối ưu: **Dưới 10MB** (để tải nhanh)
4. Đặt tên file: **`dan-ca.mp3`** (quan trọng!)

### Bước 2: Thêm File Vào Thư Mục
**Option A - Sử dụng File Explorer:**
1. Mở File Explorer
2. Đi tới: `vidam\music\`
3. Copy file MP3 vào thư mục này
4. Đảm bảo tên file chính xác: `dan-ca.mp3`

**Option B - Sử dụng VS Code:**
1. Mở VS Code
2. Nhấn chuột phải vào thư mục `vidam/music/`
3. Chọn "Reveal in Explorer"
4. Copy/paste file MP3 vào

### Bước 3: Kiểm Tra
1. Mở file `codevidam.html` bằng trình duyệt
2. Nhấn nút "Nghe Ngay" (Nghe ngay)
3. Nhạc sẽ phát automaticalle

---

## 🎮 Chức Năng Người Dùng

### Khi Nhấn "Nghe Ngay":
✅ Hiệu ứng pulse trên nút play  
✅ Hiệu ứng sóng âm thanh xuất hiện  
✅ Thông báo "Đang phát: Dân ca Ví, Giặm Nghệ Tĩnh"  
✅ Mini player xuất hiện ở góc dưới phải  
✅ Visualizer âm thanh hoạt động động  

### Mini Player:
- ⏯️ Nút Play/Pause
- 🔊 Điều chỉnh âm lượng
- 📊 Thanh tiến độ nhạc
- ⏭️ Nút Skip
- 🔁 Nút Loop
- ⏱️ Hiển thị thời gian hiện tại / tổng thời gian
- ❌ Nút đóng

---

## 🔧 Cấu Hình Khác (Tuỳ Chọn)

### Thay Đổi Đường Dẫn File:
Nếu bạn muốn sử dụng tên file hoặc đường dẫn khác, chỉnh sửa trong `codevidam.html`:

```html
<!-- Dòng 44-46 -->
<audio id="background-music" preload="metadata">
    <source src="music/dan-ca.mp3" type="audio/mpeg">  <!-- Thay đổi đây -->
    <source src="music/dan-ca.ogg" type="audio/ogg">    <!-- Hoặc đây -->
</audio>
```

### Thay Đổi Âm Lượng Mặc Định:
Trong file `script.js`, tìm dòng:
```javascript
audio.volume = volumeSlider.value / 100;
```
Thay đổi giá trị mặc định ở `volumeSlider.value`

---

## ✨ Các Tính Năng Hiện Có

| Tính Năng | Trạng Thái |
|-----------|-----------|
| Phát nhạc MP3 | ✅ Hoàn thành |
| Nút Nghe Ngay | ✅ Hoàn thành |
| Mini Player | ✅ Hoàn thành |
| Visualizer | ✅ Hoàn thành |
| Điều chỉnh âm lượng | ✅ Hoàn thành |
| Thanh tiến độ | ✅ Hoàn thành |
| Hiệu ứng Animation | ✅ Hoàn thành |
| Thông báo | ✅ Hoàn thành |

---

## 🐛 Xử Lý Sự Cố

### Nhạc không phát:
1. ✅ Kiểm tra file MP3 có trong thư mục `vidam/music/`
2. ✅ Tên file đúng là `dan-ca.mp3`
3. ✅ File không bị hỏng
4. ✅ Kiểm tra console browser (F12) xem có lỗi không

### Nút "Nghe Ngay" không hoạt động:
1. ✅ Kiểm tra `id="music-play-btn"` trong HTML
2. ✅ Kiểm tra file `script.js` đã được load
3. ✅ Làm tươi trang web (Ctrl+Shift+R hoặc Cmd+Shift+R)

### Mini Player không hiện:
1. ✅ Kiểm tra `id="mini-player"` trong HTML
2. ✅ Kiểm tra file CSS đã được load
3. ✅ Kiểm tra file `script.js` có đầy đủ event handler

---

## 📝 Tóm Tắt File Thay Đổi

| File | Thay Đổi |
|------|---------|
| `codevidam.html` | ✅ Sửa nút Nghe Ngay, cấu hình audio element |
| `styles.css` | ✅ Thêm CSS cho button, animation, visualizer |
| `script.js` | ✅ Không cần thay đổi (đã hỗ trợ) |
| `vidam/music/` | ✅ Thư mục mới được tạo |

---

## 🎯 Bước Tiếp Theo

1. **Copy file MP3** vào thư mục `vidam/music/` với tên `dan-ca.mp3`
2. **Kiểm tra** bằng cách mở `codevidam.html` trong trình duyệt
3. **Nhấn nút "Nghe Ngay"** để kiểm tra hoạt động

**Tất cả đã sẵn sàng! 🎉**

---

**Chú ý:** Trang web sử dụng HTML5 Audio API nên hoạt động trên tất cả các trình duyệt hiện đại (Chrome, Firefox, Safari, Edge).
