// smooth-scroll.js - Tính năng cuộn trang mượt mà cho Chùa Hương Tích

document.addEventListener('DOMContentLoaded', function() {
    const header = document.querySelector('header');
    let lastScrollTop = 0;

    // 1. Smooth scroll cho navigation links
    const navLinks = document.querySelectorAll('header nav a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
            
            // Thêm hiệu ứng active
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        });
    });

    // 2. Header hide/show khi cuộn
    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        // Ẩn/hiện header khi cuộn
        if (header) {
            if (scrollTop > lastScrollTop && scrollTop > 100) {
                header.style.transform = 'translateY(-100%)';
                header.style.transition = 'transform 0.3s ease-in-out';
            } else {
                header.style.transform = 'translateY(0)';
                header.style.transition = 'transform 0.3s ease-in-out';
            }
        }
        
        // Highlight section hiện tại
        const sections = document.querySelectorAll('section[id]');
        const headerHeight = header ? header.offsetHeight : 0;
        
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollTop >= (sectionTop - headerHeight - 100)) {
                current = section.getAttribute('id');
            }
        });
        
        // Update active state
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
        
        lastScrollTop = scrollTop;
    });

    // 3. Hàm cuộn mượt đến section
    function scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            const headerHeight = header ? header.offsetHeight : 0;
            const targetPosition = section.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    }

    // 4. Fade-in effect cho các phần tử khi scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
            }
        });
    }, observerOptions);

    // Quan sát các phần tử có thể fade-in
    document.querySelectorAll('section > div').forEach(el => {
        observer.observe(el);
    });

    // 5. Thêm nút scroll-up
    const backToTopBtn = document.querySelector('.back-to-top');
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Hiển thị/ẩn nút back-to-top
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });
    }

    // 6. Parallax effect cho hero section
    const heroSection = document.querySelector('section.min-h-[90vh]');
    if (heroSection) {
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            heroSection.style.backgroundPosition = `center ${scrolled * 0.5}px`;
        });
    }

    // 7. Link cuộn cho footer
    const footerLinks = document.querySelectorAll('footer a[href^="#"]');
    footerLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            scrollToSection(targetId);
        });
    });
});

// CSS cho fade-in effect
const style = document.createElement('style');
style.textContent = `
    section > div {
        opacity: 0;
        transform: translateY(20px);
        transition: opacity 0.6s ease-out, transform 0.6s ease-out;
    }
    
    section > div.fade-in-visible {
        opacity: 1;
        transform: translateY(0);
    }

    header {
        transition: transform 0.3s ease-in-out;
    }

    /* Active nav link */
    header nav a.active {
        color: #c62828;
        font-weight: 600;
    }

    header nav a.active::after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 20px;
        height: 2px;
        background-color: #c62828;
        border-radius: 1px;
    }
`;
document.head.appendChild(style);
