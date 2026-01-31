class Chatbox {
    constructor() {
        this.args = {
            openButton: document.querySelector('.chatbox__button'),
            chatBox: document.querySelector('.chatbox__support'),
            sendButton: document.querySelector('.send__button'),
            inputField: document.querySelector('.chatbox__footer input')
        }

        // State mở rộng
        this.state = {
            isOpen: false,
            isMinimized: false,
            isMaximized: false,
            isClosed: false,
            isDragging: false,
            isTyping: false, // Thêm trạng thái typing
            dragOffset: { x: 0, y: 0 },
            newMessages: 0,
            messages: [],
            typingSpeed: 20 // Tốc độ mặc định (ms)
        };

        this.init();
    }

    init() {
        this.display();
        this.createControlElements();
        this.bindControlEvents();
        this.setupAutoScroll();
        this.setupResize();
        this.setupDrag();
        this.setupButtonDrag();
        this.setupTypingStyles();
        this.loadMessagesFromStorage();
    }

    createControlElements() {
        // Tạo badge thông báo
        const badge = document.createElement('div');
        badge.className = 'notification-badge';
        badge.style.display = 'none';
        this.args.openButton.appendChild(badge);

        // Tạo nút scroll to bottom nếu chưa có
        let scrollBtn = document.querySelector('.scroll-to-bottom');
        if (!scrollBtn) {
            scrollBtn = document.createElement('button');
            scrollBtn.className = 'scroll-to-bottom';
            scrollBtn.innerHTML = '<i class="fas fa-chevron-down"></i>';
            scrollBtn.title = 'Cuộn xuống dưới cùng';
            this.args.chatBox.appendChild(scrollBtn);
        }

        // Tạo resize handle nếu chưa có
        let resizeHandle = document.querySelector('.resize-handle');
        if (!resizeHandle) {
            resizeHandle = document.createElement('div');
            resizeHandle.className = 'resize-handle';
            this.args.chatBox.appendChild(resizeHandle);
        }

        // Tạo window state indicator nếu chưa có
        let windowState = document.querySelector('.window-state');
        if (!windowState) {
            windowState = document.createElement('div');
            windowState.className = 'window-state';
            document.querySelector('.chatbox__header').appendChild(windowState);
        }
    }

    setupTypingStyles() {
        // Thêm CSS cho hiệu ứng typing
        const style = document.createElement('style');
        style.textContent = `
            @keyframes blink {
                0%, 100% { opacity: 1; }
                50% { opacity: 0; }
            }
            
            .typing-cursor {
                display: inline-block;
                width: 8px;
                height: 16px;
                background-color: currentColor;
                margin-left: 2px;
                vertical-align: text-bottom;
                animation: blink 1s infinite;
            }
            
            .typing-indicator {
                background: #f0f0f0;
                padding: 12px 18px;
                border-radius: 20px;
                display: flex;
                align-items: center;
                gap: 4px;
                align-self: flex-start;
                margin-bottom: 10px;
                max-width: 60px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.05);
            }
            
            .typing-indicator span {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background: #666;
                display: inline-block;
                animation: typingBounce 1.4s infinite ease-in-out both;
            }
            
            .typing-indicator span:nth-child(1) {
                animation-delay: -0.32s;
            }
            
            .typing-indicator span:nth-child(2) {
                animation-delay: -0.16s;
            }
            
            @keyframes typingBounce {
                0%, 80%, 100% { 
                    transform: scale(0);
                    opacity: 0.5;
                }
                40% { 
                    transform: scale(1);
                    opacity: 1;
                }
            }
            
            .messages__item.typing-complete {
                animation: messageComplete 0.3s ease;
            }
            
            @keyframes messageComplete {
                0% { transform: translateY(2px); }
                100% { transform: translateY(0); }
            }
            
            @keyframes badgePulse {
                0% { transform: scale(1); }
                50% { transform: scale(1.2); }
                100% { transform: scale(1); }
            }
            
            .new-notification {
                animation: badgePulse 0.5s ease;
            }
            
            /* Hiệu ứng khi đang typing */
            .typing-active {
                position: relative;
            }
            
            .typing-active::after {
                content: '|';
                animation: blink 1s infinite;
                position: absolute;
                right: -5px;
            }
        `;
        document.head.appendChild(style);
    }

    display() {
        const { openButton, chatBox, sendButton, inputField } = this.args;

        openButton.addEventListener('click', () => this.toggle());

        sendButton.addEventListener('click', () => this.onSendButton());

        inputField.addEventListener('keyup', ({ key }) => {
            if (key === 'Enter') {
                this.onSendButton();
            }
        });
    }

    bindControlEvents() {
        // Nút thu nhỏ
        const minimizeBtn = document.querySelector('.minimize-btn');
        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMinimize();
            });
        }

        // Nút phóng to
        const maximizeBtn = document.querySelector('.maximize-btn');
        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMaximize();
            });
        }

        // Nút đóng
        const closeBtn = document.querySelector('.close-btn');
        if (closeBtn) {
            closeBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.close();
            });
        }

        // Nút scroll to bottom
        const scrollBtn = document.querySelector('.scroll-to-bottom');
        if (scrollBtn) {
            scrollBtn.addEventListener('click', () => {
                this.scrollToBottom();
            });
        }

        // Click ra ngoài để thu nhỏ
        document.addEventListener('click', (e) => {
            const chatbox = document.querySelector('.chatbox');
            const openButton = document.querySelector('.chatbox__button');
            
            if (!chatbox.contains(e.target) && !openButton.contains(e.target) && this.state.isOpen) {
                this.minimize();
            }
        });
    }

    setupAutoScroll() {
        const messagesContainer = document.querySelector('.chatbox__messages');
        const scrollBtn = document.querySelector('.scroll-to-bottom');

        if (!messagesContainer || !scrollBtn) return;

        messagesContainer.addEventListener('scroll', () => {
            const isAtBottom = 
                messagesContainer.scrollHeight - messagesContainer.scrollTop <= 
                messagesContainer.clientHeight + 100;
            
            if (isAtBottom) {
                scrollBtn.classList.remove('visible');
            } else {
                scrollBtn.classList.add('visible');
            }
        });
    }

    setupResize() {
        const resizeHandle = document.querySelector('.resize-handle');
        if (!resizeHandle) return;

        resizeHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            const chatboxSupport = this.args.chatBox;
            const startX = e.clientX;
            const startY = e.clientY;
            const startWidth = parseInt(getComputedStyle(chatboxSupport).width, 10);
            const startHeight = parseInt(getComputedStyle(chatboxSupport).height, 10);
            
            const doResize = (e) => {
                const width = startWidth + (e.clientX - startX);
                const height = startHeight + (e.clientY - startY);
                
                chatboxSupport.style.width = `${Math.max(300, width)}px`;
                chatboxSupport.style.height = `${Math.max(400, height)}px`;
            };
            
            const stopResize = () => {
                document.removeEventListener('mousemove', doResize);
                document.removeEventListener('mouseup', stopResize);
            };
            
            document.addEventListener('mousemove', doResize);
            document.addEventListener('mouseup', stopResize);
        });
    }

    setupDrag() {
        const header = document.querySelector('.chatbox__header');
        const dragarea = document.querySelector('.chatbox__header-dragarea');
        const chatbox = document.querySelector('.chatbox');
        
        if (!header || !chatbox) return;
        
        // Nếu không có dragarea, attach vào header
        const dragElement = dragarea || header;
        
        dragElement.addEventListener('mousedown', (e) => {
            // Đảm bảo không drag khi click vào buttons
            if (e.target.closest('.control-btn')) return;
            
            this.startDragging(e);
        });
        
        document.addEventListener('mousemove', (e) => {
            if (this.state.isDragging) {
                this.drag(e);
            }
        });
        
        document.addEventListener('mouseup', () => {
            this.stopDragging();
        });
    }

    startDragging(e) {
        const chatbox = document.querySelector('.chatbox');
        const rect = chatbox.getBoundingClientRect();
        
        this.state.isDragging = true;
        this.state.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
        
        chatbox.classList.add('dragging');
    }

    drag(e) {
        if (!this.state.isDragging) return;
        
        const chatbox = document.querySelector('.chatbox');
        
        let x = e.clientX - this.state.dragOffset.x;
        let y = e.clientY - this.state.dragOffset.y;
        
        // Giới hạn trong viewport
        const maxX = window.innerWidth - chatbox.offsetWidth;
        const maxY = window.innerHeight - chatbox.offsetHeight;
        
        x = Math.max(0, Math.min(x, maxX));
        y = Math.max(0, Math.min(y, maxY));
        
        chatbox.style.left = `${x}px`;
        chatbox.style.top = `${y}px`;
        chatbox.style.right = 'auto';
        chatbox.style.bottom = 'auto';
        chatbox.style.transform = 'none';
    }

    stopDragging() {
        this.state.isDragging = false;
        document.querySelector('.chatbox')?.classList.remove('dragging');
    }

    setupButtonDrag() {
        const chatboxButton = document.querySelector('.chatbox__button');
        const chatbox = document.querySelector('.chatbox');
        
        if (!chatboxButton || !chatbox) return;
        
        let isButtonDragging = false;
        let buttonDragOffset = { x: 0, y: 0 };
        
        chatboxButton.addEventListener('mousedown', (e) => {
            // Chỉ drag nếu không click vào button
            if (e.target.closest('button')) {
                e.preventDefault();
                isButtonDragging = true;
                
                const rect = chatbox.getBoundingClientRect();
                buttonDragOffset = {
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                };
                
                chatbox.style.cursor = 'grabbing';
            }
        });
        
        document.addEventListener('mousemove', (e) => {
            if (!isButtonDragging) return;
            
            let x = e.clientX - buttonDragOffset.x;
            let y = e.clientY - buttonDragOffset.y;
            
            // Giới hạn trong viewport
            const maxX = window.innerWidth - chatbox.offsetWidth;
            const maxY = window.innerHeight - chatbox.offsetHeight;
            
            x = Math.max(0, Math.min(x, maxX));
            y = Math.max(0, Math.min(y, maxY));
            
            chatbox.style.left = `${x}px`;
            chatbox.style.top = `${y}px`;
            chatbox.style.right = 'auto';
            chatbox.style.bottom = 'auto';
            chatbox.style.transform = 'none';
        });
        
        document.addEventListener('mouseup', () => {
            isButtonDragging = false;
            chatbox.style.cursor = 'auto';
        });
    }

    toggle() {
        const chatbox = document.querySelector('.chatbox');
        const chatboxSupport = this.args.chatBox;
        
        if (this.state.isClosed) {
            this.state.isClosed = false;
            chatbox.classList.remove('chatbox--closed');
        }
        
        if (this.state.isMinimized) {
            this.state.isMinimized = false;
            chatbox.classList.remove('chatbox--minimized');
        }
        
        if (this.state.isMaximized) {
            this.state.isMaximized = false;
            chatbox.classList.remove('chatbox--maximized');
        }
        
        this.state.isOpen = !this.state.isOpen;
        chatboxSupport.classList.toggle('chatbox--active', this.state.isOpen);
        
        if (this.state.isOpen) {
            this.scrollToBottom();
            this.state.newMessages = 0;
            this.updateNotificationBadge();
            
            // Focus vào input field
            setTimeout(() => {
                this.args.inputField.focus();
            }, 300);
        }
    }

    toggleMinimize() {
        const chatbox = document.querySelector('.chatbox');
        this.state.isMinimized = !this.state.isMinimized;
        
        chatbox.classList.toggle('chatbox--minimized', this.state.isMinimized);
        
        if (this.state.isMinimized) {
            this.state.isMaximized = false;
            chatbox.classList.remove('chatbox--maximized');
            
            if (this.state.isOpen) {
                this.state.isOpen = false;
                this.args.chatBox.classList.remove('chatbox--active');
            }
            
            this.showWindowState('Đã thu nhỏ');
        }
    }

    toggleMaximize() {
        const chatbox = document.querySelector('.chatbox');
        const chatboxSupport = this.args.chatBox;
        
        this.state.isMaximized = !this.state.isMaximized;
        
        chatbox.classList.toggle('chatbox--maximized', this.state.isMaximized);
        
        if (this.state.isMaximized) {
            this.state.isMinimized = false;
            chatbox.classList.remove('chatbox--minimized');
            chatboxSupport.style.width = '90vw';
            chatboxSupport.style.height = '90vh';
            
            // Mở chatbox nếu đang đóng
            if (!this.state.isOpen) {
                this.state.isOpen = true;
                chatboxSupport.classList.add('chatbox--active');
            }
            
            this.showWindowState('Đã phóng to');
        } else {
            chatboxSupport.style.width = '';
            chatboxSupport.style.height = '';
        }
        
        this.scrollToBottom();
    }

    close() {
        const chatbox = document.querySelector('.chatbox');
        const chatboxSupport = this.args.chatBox;
        
        this.state.isClosed = true;
        this.state.isOpen = false;
        this.state.isMinimized = false;
        this.state.isMaximized = false;
        
        chatbox.classList.add('chatbox--closed');
        chatbox.classList.remove('chatbox--minimized', 'chatbox--maximized');
        chatboxSupport.classList.remove('chatbox--active');
        
        this.showWindowState('Đã đóng chatbox');
    }

    minimize() {
        if (!this.state.isOpen || this.state.isMinimized) return;
        
        const chatbox = document.querySelector('.chatbox');
        this.state.isMinimized = true;
        chatbox.classList.add('chatbox--minimized');
        
        this.state.isOpen = false;
        this.args.chatBox.classList.remove('chatbox--active');
    }

    onSendButton() {
        const textField = this.args.inputField;
        let text = textField.value.trim();
        
        if (text === "") {
            return;
        }

        // Thêm tin nhắn người dùng (không có hiệu ứng typing)
        this.addMessage(text, false);

        // Gửi request đến server Flask
        fetch('http://localhost:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(r => r.json())
        .then(r => {
            // Thêm tin nhắn bot với hiệu ứng typing
            this.addMessage(r.answer, true, true);
            textField.value = '';
            
            // Focus lại input field
            setTimeout(() => {
                textField.focus();
            }, 100);
        })
        .catch((error) => {
            console.error('Error:', error);
            // Hiển thị thông báo lỗi với hiệu ứng typing
            this.addMessage("Xin lỗi, đã có lỗi xảy ra. Vui lòng thử lại sau.", true, true);
            textField.value = '';
        });
    }

    addMessage(message, isBot = false, animateTyping = false, typingSpeed = null) {
        // Nếu đang typing, không cho phép thêm tin nhắn mới
        if (this.state.isTyping) {
            console.log('Đang typing, chờ hoàn thành...');
            return;
        }

        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) {
            this.updateChatText();
            return;
        }

        // Tạo phần tử tin nhắn mới
        const messageDiv = document.createElement('div');
        const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        messageDiv.className = `messages__item ${isBot ? 'messages__item--visitor' : 'messages__item--operator'}`;
        
        // Nếu là tin nhắn bot và có yêu cầu hiệu ứng typing
        if (isBot && animateTyping) {
            this.state.isTyping = true;
            
            // Hiển thị typing indicator trước
            this.showTypingIndicator();
            
            // Sử dụng typingSpeed được truyền vào hoặc mặc định
            const speed = typingSpeed || this.state.typingSpeed;
            
            // Hiển thị tin nhắn với hiệu ứng từng chữ một
            setTimeout(() => {
                this.hideTypingIndicator();
                this.typeWriterEffect(messageDiv, message, time, isBot, speed);
            }, 800); // Delay trước khi bắt đầu typing
        } else {
            // Hiển thị tin nhắn bình thường
            messageDiv.innerHTML = `
                ${this.escapeHtml(message)}
                <span class="message__time">${time}</span>
            `;
            
            // Thêm hiệu ứng xuất hiện
            messageDiv.classList.add('new-message');
            
            // Thêm vào container
            messagesContainer.appendChild(messageDiv);
            
            // Cuộn xuống
            this.scrollToBottom();
        }

        // Thêm vào state messages
        this.state.messages.push({
            name: isBot ? "Bi Biết Tuốt" : "User",
            message: message,
            time: time
        });

        // Lưu vào localStorage
        this.saveMessagesToStorage();

        // Cập nhật thông báo nếu chatbox đang đóng/thu nhỏ
        if (!this.state.isOpen || this.state.isMinimized) {
            this.state.newMessages++;
            this.updateNotificationBadge();
        }
    }

    // Hiệu ứng đánh máy - từng ký tự
    typeWriterEffect(messageDiv, message, time, isBot, speed) {
        const messagesContainer = document.querySelector('.messages-container');
        let i = 0;
        
        // Thêm div rỗng vào container trước
        messageDiv.innerHTML = `<span class="message__time" style="opacity: 0">${time}</span>`;
        messageDiv.classList.add('typing-active');
        messagesContainer.appendChild(messageDiv);
        
        // Escape HTML để hiển thị đúng
        const escapedMessage = this.escapeHtml(message);
        
        // Bắt đầu hiệu ứng
        const typeWriter = () => {
            if (i < escapedMessage.length) {
                // Kiểm tra ký tự đặc biệt
                const char = escapedMessage.charAt(i);
                
                // Xóa thời gian tạm thời, thêm ký tự, rồi thêm thời gian lại
                messageDiv.innerHTML = messageDiv.innerHTML.replace(
                    `<span class="message__time" style="opacity: 0">${time}</span>`, 
                    ''
                );
                
                messageDiv.innerHTML += char;
                messageDiv.innerHTML += `<span class="message__time" style="opacity: 0">${time}</span>`;
                
                i++;
                
                // Cuộn xuống mỗi khi có ký tự mới
                this.scrollToBottom();
                
                // Tiếp tục gõ với tốc độ ngẫu nhiên để tự nhiên hơn
                const randomSpeed = speed + Math.random() * 10 - 5;
                setTimeout(typeWriter, Math.max(10, randomSpeed));
            } else {
                // Hoàn thành typing
                this.state.isTyping = false;
                
                // Xóa cursor và hiển thị thời gian
                messageDiv.classList.remove('typing-active');
                messageDiv.innerHTML = messageDiv.innerHTML.replace(
                    `<span class="message__time" style="opacity: 0">${time}</span>`, 
                    ''
                );
                messageDiv.innerHTML += `<span class="message__time">${time}</span>`;
                
                // Thêm hiệu ứng hoàn thành
                messageDiv.classList.add('typing-complete');
                messageDiv.classList.add('new-message');
                
                // Cuộn xuống lần cuối
                this.scrollToBottom();
                
                // Bật lại input field
                this.args.inputField.disabled = false;
            }
        };
        
        // Tắt input field trong khi typing
        this.args.inputField.disabled = true;
        
        // Bắt đầu typing
        typeWriter();
    }

    // Escape HTML để hiển thị đúng
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // Hiển thị indicator đang gõ
    showTypingIndicator() {
        const messagesContainer = document.querySelector('.messages-container');
        
        // Kiểm tra nếu đã có typing indicator
        if (document.getElementById('typing-indicator')) {
            return;
        }
        
        const typingDiv = document.createElement('div');
        typingDiv.className = 'typing-indicator';
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
        
        messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
    }

    // Ẩn indicator đang gõ
    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typing-indicator');
        if (typingIndicator) {
            // Thêm hiệu ứng fade out trước khi xóa
            typingIndicator.style.opacity = '0';
            typingIndicator.style.transition = 'opacity 0.3s ease';
            
            setTimeout(() => {
                typingIndicator.remove();
            }, 300);
        }
    }

    updateChatText() {
        const messagesContainer = document.querySelector('.messages-container');
        if (!messagesContainer) return;

        let html = '';
        this.state.messages.forEach(function(item) {
            const escapedMessage = item.message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            
            if (item.name === "Bi Biết Tuốt") {
                html += `<div class="messages__item messages__item--visitor">
                    ${escapedMessage}
                    <span class="message__time">${item.time}</span>
                </div>`;
            } else {
                html += `<div class="messages__item messages__item--operator">
                    ${escapedMessage}
                    <span class="message__time">${item.time}</span>
                </div>`;
            }
        });

        messagesContainer.innerHTML = html;
        this.scrollToBottom();
    }

    scrollToBottom() {
        const messagesContainer = document.querySelector('.chatbox__messages');
        if (!messagesContainer) return;

        // Sử dụng requestAnimationFrame để đảm bảo DOM đã cập nhật
        requestAnimationFrame(() => {
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
            
            // Ẩn nút scroll to bottom
            const scrollBtn = document.querySelector('.scroll-to-bottom');
            if (scrollBtn) {
                scrollBtn.classList.remove('visible');
            }
        });
    }

    updateNotificationBadge() {
        const badge = document.querySelector('.notification-badge');
        const openButton = this.args.openButton;
        
        if (this.state.newMessages > 0) {
            if (badge) {
                badge.textContent = this.state.newMessages > 9 ? '9+' : this.state.newMessages;
                badge.style.display = 'flex';
                
                // Thêm animation cho badge mới
                badge.classList.add('new-notification');
                setTimeout(() => {
                    badge.classList.remove('new-notification');
                }, 500);
            }
        } else if (badge) {
            badge.style.display = 'none';
        }
    }

    showWindowState(text) {
        const stateIndicator = document.querySelector('.window-state');
        if (!stateIndicator) return;

        stateIndicator.textContent = text;
        stateIndicator.classList.add('show');

        setTimeout(() => {
            stateIndicator.classList.remove('show');
        }, 2000);
    }

    // Phương thức để thay đổi tốc độ typing
    setTypingSpeed(speed) {
        this.state.typingSpeed = Math.max(10, speed); // Tối thiểu 10ms
    }

    // Lưu tin nhắn vào localStorage
    saveMessagesToStorage() {
        try {
            localStorage.setItem('chatbot_messages', JSON.stringify(this.state.messages));
        } catch (error) {
            console.warn('Không thể lưu tin nhắn vào localStorage:', error);
        }
    }

    // Tải tin nhắn từ localStorage
    loadMessagesFromStorage() {
        try {
            const savedMessages = localStorage.getItem('chatbot_messages');
            if (savedMessages) {
                this.state.messages = JSON.parse(savedMessages);
                this.updateChatText();
            }
        } catch (error) {
            console.warn('Không thể tải tin nhắn từ localStorage:', error);
        }
    }

    // Xóa lịch sử trò chuyện
    clearChatHistory() {
        this.state.messages = [];
        localStorage.removeItem('chatbot_messages');
        const messagesContainer = document.querySelector('.messages-container');
        if (messagesContainer) {
            messagesContainer.innerHTML = '';
        }
    }
}

// Khởi tạo chatbox khi trang tải xong
document.addEventListener('DOMContentLoaded', () => {
    const chatbox = new Chatbox();
    window.chatbox = chatbox; // Để có thể truy cập từ console nếu cần

    // Thêm tin nhắn chào mừng ban đầu với hiệu ứng typing
    setTimeout(() => {
        const welcomeMessage = "Xin chào! Tôi là 'Bi Biết Tuốt' - trợ lý ảo của huyện Can Lộc. Tôi có thể giúp gì cho bạn về Can Lộc?";
        chatbox.addMessage(welcomeMessage, true, true);
    }, 1500);
});

// Xử lý responsive khi resize window
window.addEventListener('resize', () => {
    const chatbox = document.querySelector('.chatbox');
    const chatboxSupport = document.querySelector('.chatbox__support');
    
    if (!chatbox || !chatboxSupport) return;
    
    // Đảm bảo chatbox không vượt ra ngoài màn hình khi resize
    const rect = chatbox.getBoundingClientRect();
    
    if (rect.right > window.innerWidth) {
        chatbox.style.left = `${window.innerWidth - chatbox.offsetWidth}px`;
    }
    
    if (rect.bottom > window.innerHeight) {
        chatbox.style.top = `${window.innerHeight - chatbox.offsetHeight}px`;
    }
    
    // Nếu đang ở chế độ mobile và maximized
    if (window.innerWidth <= 768 && chatbox.classList.contains('chatbox--maximized')) {
        chatboxSupport.style.width = '100%';
        chatboxSupport.style.height = '100%';
    }
});

// Thêm tính năng skip typing (nhấn Ctrl để skip)
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && window.chatbox && window.chatbox.state.isTyping) {
        // Tìm tất cả các tin nhắn đang typing và hoàn thành ngay
        const typingMessages = document.querySelectorAll('.typing-active');
        typingMessages.forEach(msg => {
            msg.classList.remove('typing-active');
            const timeSpan = msg.querySelector('span[style*="opacity: 0"]');
            if (timeSpan) {
                timeSpan.style.opacity = '1';
            }
        });
        
        // Reset typing state
        window.chatbox.state.isTyping = false;
        window.chatbox.args.inputField.disabled = false;
        
        // Ẩn typing indicator nếu có
        window.chatbox.hideTypingIndicator();
    }
});
