// smooth-scroll.js
// Tính năng cuộn trang mượt mà và tương tác cho trang web Can Lộc Homeland

document.addEventListener('DOMContentLoaded', function() {
    // Biến toàn cục
    let showAllLandmarks = false;
    let isDraggingPersonalities = false;
    let startX = 0;
    let scrollLeft = 0;

    // 1. Xử lý nút "Bắt đầu hành trình" trong Hero Section
    const heroButton = document.getElementById('hero-explore-btn');
    if (heroButton) {
        heroButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('introduction', true);
        });
    }

    // 2. Xử lý nút "Khám phá ngay" trong navigation
    const navButton = document.getElementById('nav-explore-btn');
    if (navButton) {
        navButton.addEventListener('click', function(e) {
            // Kiểm tra xem link có trỏ tới trang khác không
            const href = this.getAttribute('href');
            if (href && (href.includes('.html') || href.includes('/'))) {
                // Để link hoạt động bình thường
                return true;
            }
            e.preventDefault();
            scrollToSection('introduction', false);
        });
    }

    // 3. Xử lý nút "Tìm hiểu lịch sử"
    const historyButton = document.getElementById('hero-history-btn');
    if (historyButton) {
        historyButton.addEventListener('click', function(e) {
            e.preventDefault();
            scrollToSection('landmarks', true);
        });
    }

    // 4. Xử lý tất cả các liên kết navigation
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId, true);
            
            // Thêm lớp active cho liên kết được click
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 5. Xử lý nút "Xem thêm/Thu gọn địa danh"
    const toggleLandmarksBtn = document.getElementById('toggle-landmarks');
    if (toggleLandmarksBtn) {
        toggleLandmarksBtn.addEventListener('click', function(e) {
            e.preventDefault();
            toggleLandmarks();
        });
    }

    // 6. Xử lý các liên kết "Khám phá chi tiết"
    document.addEventListener('click', function(e) {
        if (e.target.closest('.explore-link')) {
            e.preventDefault();
            const link = e.target.closest('.explore-link');
            
            // Tìm phần tử cha chứa tiêu đề
            const cardTitle = link.closest('.group').querySelector('h3');
            if (cardTitle) {
                // Tạo thông báo
                showNotification(`Đang tải thông tin chi tiết về: ${cardTitle.textContent}`);
            }
            
            // Mô phỏng tải dữ liệu
            setTimeout(() => {
                showNotification('Tính năng đang được phát triển. Vui lòng quay lại sau!', 'info');
            }, 800);
        }
    });

    // 7. Xử lý nút "Đăng ký ngay" trong newsletter
    const subscribeButton = document.getElementById('subscribe-btn');
    if (subscribeButton) {
        const emailInput = document.getElementById('newsletter-email');
        
        subscribeButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (emailInput && emailInput.value.trim() === '') {
                showNotification('Vui lòng nhập địa chỉ email!', 'error');
                emailInput.focus();
                return;
            }
            
            if (emailInput && !isValidEmail(emailInput.value)) {
                showNotification('Vui lòng nhập email hợp lệ!', 'error');
                emailInput.focus();
                return;
            }
            
            // Mô phỏng đăng ký thành công
            showNotification('Đăng ký thành công! Cảm ơn bạn đã quan tâm đến Can Lộc.', 'success');
            emailInput.value = '';
        });
    }

    // 8. Xử lý cuộn ngang cho danh nhân
    const personalitiesScroll = document.getElementById('personalities-scroll');
    const scrollLeftBtn = document.getElementById('scroll-left');
    const scrollRightBtn = document.getElementById('scroll-right');
    
    if (personalitiesScroll) {
        // Cập nhật nút scroll khi scroll container được scroll
        personalitiesScroll.addEventListener('scroll', function() {
            updateScrollButtons();
        });
        
        // Xử lý nút scroll left
        if (scrollLeftBtn) {
            scrollLeftBtn.addEventListener('click', function(e) {
                e.preventDefault();
                scrollPersonalities(-300);
            });
        }
        
        // Xử lý nút scroll right
        if (scrollRightBtn) {
            scrollRightBtn.addEventListener('click', function(e) {
                e.preventDefault();
                scrollPersonalities(300);
            });
        }
        
        // Kéo thả trên desktop
        personalitiesScroll.addEventListener('mousedown', function(e) {
            isDraggingPersonalities = true;
            startX = e.pageX - personalitiesScroll.offsetLeft;
            scrollLeft = personalitiesScroll.scrollLeft;
            personalitiesScroll.style.cursor = 'grabbing';
            personalitiesScroll.style.scrollBehavior = 'auto';
        });
        
        personalitiesScroll.addEventListener('mousemove', function(e) {
            if (!isDraggingPersonalities) return;
            e.preventDefault();
            const x = e.pageX - personalitiesScroll.offsetLeft;
            const walk = (x - startX) * 2; // Tốc độ kéo
            personalitiesScroll.scrollLeft = scrollLeft - walk;
        });
        
        personalitiesScroll.addEventListener('mouseup', function() {
            isDraggingPersonalities = false;
            personalitiesScroll.style.cursor = 'grab';
            personalitiesScroll.style.scrollBehavior = 'smooth';
        });
        
        personalitiesScroll.addEventListener('mouseleave', function() {
            isDraggingPersonalities = false;
            personalitiesScroll.style.cursor = 'grab';
        });
        
        // Touch/swipe trên mobile
        personalitiesScroll.addEventListener('touchstart', function(e) {
            startX = e.touches[0].pageX;
            scrollLeft = personalitiesScroll.scrollLeft;
            personalitiesScroll.style.scrollBehavior = 'auto';
        });
        
        personalitiesScroll.addEventListener('touchmove', function(e) {
            if (!startX) return;
            const x = e.touches[0].pageX;
            const walk = (x - startX);
            personalitiesScroll.scrollLeft = scrollLeft - walk;
        });
        
        personalitiesScroll.addEventListener('touchend', function() {
            startX = null;
            personalitiesScroll.style.scrollBehavior = 'smooth';
            updateScrollButtons();
        });
        
        // Khởi tạo nút scroll
        updateScrollButtons();
    }

    // 9. Thêm hiệu ứng khi cuộn trang
    let lastScrollTop = 0;
    const header = document.querySelector('header');
    const backToTopBtn = document.querySelector('.back-to-top');
    
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ẩn/hiện header khi cuộn
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            header.style.transform = 'translateY(-100%)';
        } else {
            header.style.transform = 'translateY(0)';
        }
        
        // Hiển thị/ẩn nút back to top
        if (backToTopBtn) {
            if (scrollTop > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        }
        
        lastScrollTop = scrollTop;
        
        // Thêm lớp active cho navigation links khi cuộn
        const sections = document.querySelectorAll('section[id]');
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const headerHeight = header.offsetHeight;
            
            if (scrollTop >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // 10. Xử lý nút Back to Top
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 11. Xử lý footer links
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId, true);
        });
    });

    // ========== HÀM HỖ TRỢ ==========

    // Hàm cuộn đến section
    function scrollToSection(sectionId, highlight = false) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = document.querySelector('header').offsetHeight;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
            
            // Thêm hiệu ứng highlight nếu được yêu cầu
            if (highlight) {
                section.classList.add('highlight-section');
                setTimeout(() => {
                    section.classList.remove('highlight-section');
                }, 1500);
            }
        }
    }

    // Hàm toggle hiển thị địa danh
    function toggleLandmarks() {
        const container = document.getElementById('landmarks-container');
        const additional = document.getElementById('additional-landmarks');
        const toggleBtn = document.getElementById('toggle-landmarks');
        
        if (!container || !additional || !toggleBtn) return;
        
        showAllLandmarks = !showAllLandmarks;
        
        if (showAllLandmarks) {
            // Hiển thị thêm địa danh
            const newLandmarks = additional.innerHTML;
            container.insertAdjacentHTML('beforeend', newLandmarks);
            
            // Cập nhật nút
            toggleBtn.innerHTML = `
                <span>Thu gọn địa danh</span>
                <i class="fa-solid fa-caret-up"></i>
            `;
            
            // Thêm animation cho các địa danh mới
            const allLandmarks = container.querySelectorAll('.group');
            allLandmarks.forEach((item, index) => {
                if (index >= 3) { // Chỉ các item mới
                    item.style.animationDelay = `${(index - 3) * 0.1}s`;
                    item.classList.add('landmark-fade-in');
                }
            });
            
            // Cuộn đến phần mới được thêm vào
            setTimeout(() => {
                const newSection = container.lastElementChild;
                if (newSection) {
                    newSection.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }
            }, 300);
        } else {
            // Ẩn bớt địa danh (chỉ giữ lại 3 cái đầu)
            const allLandmarks = container.querySelectorAll('.group');
            if (allLandmarks.length > 3) {
                for (let i = allLandmarks.length - 1; i >= 3; i--) {
                    container.removeChild(allLandmarks[i]);
                }
            }
            
            // Cập nhật nút
            toggleBtn.innerHTML = `
                <span>Xem thêm địa danh</span>
                <i class="fa-solid fa-caret-down"></i>
            `;
            
            // Cuộn lên đầu phần địa danh
            setTimeout(() => {
                container.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }, 100);
        }
    }

    // Hàm cuộn ngang danh nhân
    function scrollPersonalities(amount) {
        if (personalitiesScroll) {
            personalitiesScroll.scrollBy({
                left: amount,
                behavior: 'smooth'
            });
        }
    }

    // Hàm cập nhật nút scroll
    function updateScrollButtons() {
        if (!personalitiesScroll || !scrollLeftBtn || !scrollRightBtn) return;
        
        const scrollableWidth = personalitiesScroll.scrollWidth - personalitiesScroll.clientWidth;
        
        // Cập nhật nút left
        if (personalitiesScroll.scrollLeft <= 10) {
            scrollLeftBtn.style.opacity = '0.3';
            scrollLeftBtn.style.pointerEvents = 'none';
        } else {
            scrollLeftBtn.style.opacity = '1';
            scrollLeftBtn.style.pointerEvents = 'all';
        }
        
        // Cập nhật nút right
        if (personalitiesScroll.scrollLeft >= scrollableWidth - 10) {
            scrollRightBtn.style.opacity = '0.3';
            scrollRightBtn.style.pointerEvents = 'none';
        } else {
            scrollRightBtn.style.opacity = '1';
            scrollRightBtn.style.pointerEvents = 'all';
        }
    }

    // Hàm hiển thị thông báo
    function showNotification(message, type = 'success') {
        // Kiểm tra xem đã có notification nào chưa
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Tạo thông báo
        const notification = document.createElement('div');
        notification.className = `fixed top-6 right-6 z-50 px-6 py-4 rounded-xl shadow-2xl transform transition-all duration-500 translate-x-full notification ${type}`;
        notification.textContent = message;
        
        // Thêm vào DOM
        document.body.appendChild(notification);
        
        // Hiển thị thông báo
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
            notification.classList.add('translate-x-0');
        }, 10);
        
        // Tự động ẩn sau 4 giây
        setTimeout(() => {
            notification.classList.remove('translate-x-0');
            notification.classList.add('translate-x-full');
            
            // Xóa khỏi DOM sau khi animation kết thúc
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 500);
        }, 4000);
        
        // Cho phép đóng thủ công
        notification.addEventListener('click', function() {
            this.classList.remove('translate-x-0');
            this.classList.add('translate-x-full');
            
            setTimeout(() => {
                if (this.parentNode) {
                    this.parentNode.removeChild(this);
                }
            }, 500);
        });
    }

    // Hàm kiểm tra email hợp lệ
    function isValidEmail(email) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email.toLowerCase());
    }
});