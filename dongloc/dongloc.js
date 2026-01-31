/* ========== DONGLOC JAVASCRIPT FILE ========== */

// ========== MODAL 1: 1964 ==========
function openModal1964() {
    const modal = document.getElementById('modal1964');
    modal.classList.remove('hidden', 'closing');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
}

function closeModal1964() {
    const modal = document.getElementById('modal1964');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// MODAL 2: 1965-1968
function openModal1968() {
    const modal = document.getElementById('modal1968');
    modal.classList.remove('hidden', 'closing');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
}

function closeModal1968() {
    const modal = document.getElementById('modal1968');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// MODAL 3: 24/7/1968
function openModal1968_07_24() {
    const modal = document.getElementById('modal1968_07_24');
    modal.classList.remove('hidden', 'closing');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
}

function closeModal1968_07_24() {
    const modal = document.getElementById('modal1968_07_24');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// MODAL 4: 1990
function openModal1990() {
    const modal = document.getElementById('modal1990');
    modal.classList.remove('hidden', 'closing');
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    modal.scrollTop = 0;
}

function closeModal1990() {
    const modal = document.getElementById('modal1990');
    if (modal.classList.contains('show')) {
        modal.classList.remove('show');
        modal.classList.add('closing');
        setTimeout(() => {
            modal.classList.add('hidden');
            modal.classList.remove('closing');
            document.body.style.overflow = 'auto';
        }, 300);
    }
}

// Close modal when pressing ESC
document.addEventListener('keydown', function(event) {
    if (event.key === 'Escape') {
        const openModals = document.querySelectorAll('.modal-overlay.show');
        openModals.forEach(modal => {
            const modalId = modal.id;
            if (modalId.includes('1964')) closeModal1964();
            else if (modalId.includes('1968_07')) closeModal1968_07_24();
            else if (modalId.includes('1968')) closeModal1968();
            else if (modalId.includes('1990')) closeModal1990();
        });
    }
});

// Close modal when clicking outside
document.addEventListener('click', function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        const modal = event.target;
        const modalId = modal.id;
        if (modalId.includes('1964')) closeModal1964();
        else if (modalId.includes('1968_07')) closeModal1968_07_24();
        else if (modalId.includes('1968')) closeModal1968();
        else if (modalId.includes('1990')) closeModal1990();
    }
});

// PROFILE CAROUSEL CLASS
class ProfileCarousel {
    constructor() {
        this.container = document.getElementById('profileCarousel');
        this.prevBtn = document.getElementById('profilePrev');
        this.nextBtn = document.getElementById('profileNext');
        this.currentIndex = 0;
        this.totalItems = 10;
        this.isAnimating = false;
        this.animationDuration = 600;
        this.itemsPerView = 4;
        
        if (this.container && this.prevBtn && this.nextBtn) {
            this.init();
        }
    }
    
    init() {
        this.attachEventListeners();
    }
    
    attachEventListeners() {
        this.prevBtn.addEventListener('click', () => this.slidePrev());
        this.nextBtn.addEventListener('click', () => this.slideNext());
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.slidePrev();
            if (e.key === 'ArrowRight') this.slideNext();
        });
    }
    
    slideNext() {
        if (this.isAnimating) return;
        this.currentIndex++;
        if (this.currentIndex > this.totalItems - this.itemsPerView) {
            this.currentIndex = 0;
        }
        this.updateCarousel();
    }
    
    slidePrev() {
        if (this.isAnimating) return;
        this.currentIndex--;
        if (this.currentIndex < 0) {
            this.currentIndex = this.totalItems - this.itemsPerView;
        }
        this.updateCarousel();
    }
    
    updateCarousel() {
        this.isAnimating = true;
        const offset = -this.currentIndex * 25;
        this.container.style.transform = `translateX(${offset}%)`;
        
        this.prevBtn.style.pointerEvents = 'none';
        this.nextBtn.style.pointerEvents = 'none';
        
        setTimeout(() => {
            this.isAnimating = false;
            this.prevBtn.style.pointerEvents = 'auto';
            this.nextBtn.style.pointerEvents = 'auto';
        }, this.animationDuration);
    }
}

// Initialize carousel when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new ProfileCarousel();
    });
} else {
    new ProfileCarousel();
}

/* ========== PROFESSIONAL HERO ANIMATIONS ========== */

// Parallax effect on scroll
const heroBgImage = document.querySelector('.hero-bg-image');
if (heroBgImage) {
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroSection = document.querySelector('section:first-of-type');
        
        // Only apply parallax while in hero section
        if (scrollY < window.innerHeight) {
            heroBgImage.style.transform = `translateY(${scrollY * 0.5}px) scale(1.05)`;
        }
    }, { passive: true });
}

// Intersection Observer for fade-in animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'none';
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Add subtle mouse move effect to hero
document.addEventListener('mousemove', (e) => {
    const heroBg = document.querySelector('.hero-bg-image');
    if (heroBg && window.scrollY < window.innerHeight / 2) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        heroBg.style.transform = `translateY(${window.scrollY * 0.5 + moveY}px) scale(1.05) translateX(${moveX}px)`;
    }
}, { passive: true });
