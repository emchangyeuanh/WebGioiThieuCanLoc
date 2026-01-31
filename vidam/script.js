// JavaScript for Can Loc Heritage Page with Music Player

// Music Player Class
class MusicPlayer {
    constructor() {
        this.audio = document.getElementById('background-music');
        this.musicToggle = document.getElementById('music-toggle');
        this.musicIcon = document.getElementById('music-icon');
        this.heroPlayBtn = document.getElementById('hero-play-btn');
        this.miniPlayer = document.getElementById('mini-music-player');
        this.closePlayerBtn = document.getElementById('close-player');
        this.visualizer = document.getElementById('music-visualizer');
        this.audioItems = document.querySelectorAll('.audio-item');
        
        this.isPlaying = false;
        this.userInteracted = false;
        this.currentAudio = null;
        
        this.init();
    }
    
    init() {
        // Set volume
        this.audio.volume = 0.4;
        
        // Bind events
        this.bindEvents();
        
        // Auto-play on user interaction
        this.enableAutoPlay();
        
        // Check for existing playing state
        this.checkPlayingState();
    }
    
    bindEvents() {
        // Music toggle button
        if (this.musicToggle) {
            this.musicToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                this.togglePlay();
            });
        }
        
        // Hero play button
        if (this.heroPlayBtn) {
            this.heroPlayBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.playWithEffects();
            });
        }
        
        // Close mini player
        if (this.closePlayerBtn) {
            this.closePlayerBtn.addEventListener('click', () => {
                this.hideMiniPlayer();
            });
        }
        
        // Audio items in library
        this.audioItems.forEach(item => {
            const playBtn = item.querySelector('.audio-play-btn');
            if (playBtn) {
                playBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    this.playAudioItem(item);
                });
            }
        });
        
        // Audio ended event
        this.audio.addEventListener('ended', () => {
            this.isPlaying = false;
            this.updateUI();
            this.hideMiniPlayer();
        });
        
        // Audio canplay event
        this.audio.addEventListener('canplay', () => {
            this.showNotification('Nhạc đã sẵn sàng!', 'success');
        });
        
        // Audio error event
        this.audio.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            this.showNotification('Không thể tải nhạc. Vui lòng kiểm tra đường dẫn!', 'error');
        });
        
        // Show mini player when audio plays
        this.audio.addEventListener('play', () => {
            this.showMiniPlayer();
            this.updateVisualizer(true);
        });
        
        this.audio.addEventListener('pause', () => {
            this.updateVisualizer(false);
        });
    }
    
    enableAutoPlay() {
        // Allow autoplay after user interaction
        const enablePlay = () => {
            this.userInteracted = true;
            document.removeEventListener('click', enablePlay);
            document.removeEventListener('keydown', enablePlay);
            document.removeEventListener('touchstart', enablePlay);
        };
        
        document.addEventListener('click', enablePlay);
        document.addEventListener('keydown', enablePlay);
        document.addEventListener('touchstart', enablePlay);
    }
    
    checkPlayingState() {
        // Check if music was playing before refresh (optional)
        const wasPlaying = localStorage.getItem('musicPlaying') === 'true';
        if (wasPlaying && this.userInteracted) {
            this.togglePlay();
        }
    }
    
    togglePlay() {
        if (this.isPlaying) {
            this.pause();
        } else {
            this.play();
        }
    }
    
    play() {
        if (!this.userInteracted) {
            this.showNotification('Nhấn Play để nghe nhạc nền dân ca', 'info');
            return;
        }
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise.then(() => {
                this.isPlaying = true;
                this.updateUI();
                localStorage.setItem('musicPlaying', 'true');
                this.showNotification('Đang phát nhạc nền dân ca', 'success');
            }).catch(error => {
                console.error('Playback failed:', error);
                this.showNotification('Nhấn Play để nghe nhạc nền', 'info');
            });
        }
    }
    
    pause() {
        this.audio.pause();
        this.isPlaying = false;
        this.updateUI();
        localStorage.setItem('musicPlaying', 'false');
        this.showNotification('Nhạc nền đã tạm dừng', 'warning');
    }
    
    playWithEffects() {
        // Add beat animation
        this.heroPlayBtn.classList.add('beat-animation');
        setTimeout(() => {
            this.heroPlayBtn.classList.remove('beat-animation');
        }, 600);
        
        // Add wave effect
        this.heroPlayBtn.classList.add('wave-effect');
        setTimeout(() => {
            this.heroPlayBtn.classList.remove('wave-effect');
        }, 2000);
        
        // Play music
        this.play();
        
        // Scroll to audio library
        setTimeout(() => {
            const audioSection = document.querySelector('section.py-24.bg-white');
            if (audioSection) {
                audioSection.scrollIntoView({ behavior: 'smooth' });
            }
        }, 1000);
    }
    
    playAudioItem(item) {
        const audioSrc = item.getAttribute('data-audio');
        const title = item.getAttribute('data-title');
        
        // Remove playing class from all items
        this.audioItems.forEach(i => i.classList.remove('playing'));
        
        // Add playing class to current item
        item.classList.add('playing');
        
        // Change audio source
        this.audio.src = audioSrc;
        
        // Play audio
        this.play();
        
        // Update mini player info
        this.updateMiniPlayerInfo(title);
        
        // Show notification
        this.showNotification(`Đang phát: ${title}`, 'success');
    }
    
    updateUI() {
        if (this.isPlaying) {
            this.musicIcon.classList.remove('fa-play');
            this.musicIcon.classList.add('fa-pause');
            this.musicToggle.classList.add('music-playing-glow');
        } else {
            this.musicIcon.classList.remove('fa-pause');
            this.musicIcon.classList.add('fa-play');
            this.musicToggle.classList.remove('music-playing-glow');
        }
    }
    
    updateVisualizer(playing) {
        const bars = this.visualizer.querySelectorAll('.visualizer-bar');
        
        if (playing) {
            bars.forEach(bar => {
                bar.style.animationPlayState = 'running';
            });
        } else {
            bars.forEach(bar => {
                bar.style.animationPlayState = 'paused';
            });
        }
    }
    
    showMiniPlayer() {
        this.miniPlayer.classList.remove('translate-y-full');
    }
    
    hideMiniPlayer() {
        this.miniPlayer.classList.add('translate-y-full');
        this.pause();
    }
    
    updateMiniPlayerInfo(title) {
        const titleElement = this.miniPlayer.querySelector('.text-xs.font-bold');
        if (titleElement && title) {
            titleElement.textContent = `Đang phát: ${title}`;
        }
    }
    
    showNotification(message, type = 'info') {
        const toast = document.getElementById('notification-toast');
        
        // Remove existing toast
        if (toast) {
            toast.remove();
        }
        
        // Create new toast
        const newToast = document.createElement('div');
        newToast.id = 'notification-toast';
        newToast.className = `notification-toast ${type}`;
        newToast.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fa-solid ${this.getIconForType(type)}"></i>
                <div>
                    <p class="font-bold">${message}</p>
                    <p class="text-xs opacity-90">${this.getTimeString()}</p>
                </div>
            </div>
        `;
        
        document.body.appendChild(newToast);
        
        // Show toast
        setTimeout(() => {
            newToast.classList.add('show');
        }, 10);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            newToast.classList.remove('show');
            setTimeout(() => {
                if (newToast.parentNode) {
                    newToast.parentNode.removeChild(newToast);
                }
            }, 400);
        }, 3000);
    }
    
    getIconForType(type) {
        switch(type) {
            case 'success': return 'fa-circle-check';
            case 'error': return 'fa-circle-exclamation';
            case 'warning': return 'fa-triangle-exclamation';
            default: return 'fa-circle-info';
        }
    }
    
    getTimeString() {
        const now = new Date();
        return now.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
    }
}

// Existing functions from your code
// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// Dark mode toggle
function toggleDarkMode() {
    const html = document.documentElement;
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
}

// Load theme preference
function loadThemePreference() {
    const theme = localStorage.getItem('theme') || 'light';
    const html = document.documentElement;
    
    if (theme === 'dark') {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    // Load theme
    loadThemePreference();
    
    // Initialize music player
    const musicPlayer = new MusicPlayer();
    
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const elements = document.querySelectorAll('section, .card, h2, h3');
    elements.forEach(el => {
        observer.observe(el);
    });
    
    // Navigation explore button
    const navExploreBtn = document.getElementById('nav-explore-btn');
    if (navExploreBtn) {
        navExploreBtn.addEventListener('click', function(e) {
            // Kiểm tra xem link có trỏ tới trang khác không
            const href = this.getAttribute('href');
            if (href && (href.includes('.html') || href.includes('/'))) {
                // Để link hoạt động bình thường
                return true;
            }
            e.preventDefault();
            const introduction = document.querySelector('section.py-24');
            if (introduction) {
                introduction.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
});

// Export functions for external use
window.canLocHeritage = {
    toggleDarkMode
};

// JavaScript for Can Loc Heritage Page - Music Player

document.addEventListener('DOMContentLoaded', function() {
    // ========== MUSIC PLAYER ==========
    const audio = document.getElementById('background-music');
    const playBtn = document.getElementById('music-play-btn');
    const musicIcon = document.getElementById('music-icon');
    const musicText = document.getElementById('music-text');
    const soundWaves = document.getElementById('sound-waves');
    const musicNotification = document.getElementById('music-notification');
    
    // Mini player elements
    const miniPlayer = document.getElementById('mini-player');
    const closePlayerBtn = document.getElementById('close-player');
    const playPauseMiniBtn = document.getElementById('play-pause-mini');
    const playPauseIconMini = document.getElementById('play-pause-icon-mini');
    const currentTimeEl = document.getElementById('current-time');
    const totalTimeEl = document.getElementById('total-time');
    const progressBar = document.getElementById('progress-bar');
    const volumeToggle = document.getElementById('volume-toggle');
    const volumeIcon = document.getElementById('volume-icon');
    const volumeSliderContainer = document.getElementById('volume-slider-container');
    const volumeSlider = document.getElementById('volume-slider');
    const prevTrackBtn = document.getElementById('prev-track');
    const nextTrackBtn = document.getElementById('next-track');
    const loopToggle = document.getElementById('loop-toggle');
    const loopIcon = document.getElementById('loop-icon');
    const visualizerContainer = document.getElementById('visualizer-container');
    const loadingSpinner = document.getElementById('loading-spinner');
    
    let isPlaying = false;
    let isMuted = false;
    let isLooping = false;
    let visualizerBars = [];
    
    // Khởi tạo visualizer
    function initVisualizer() {
        visualizerContainer.innerHTML = '';
        visualizerBars = [];
        
        for (let i = 0; i < 30; i++) {
            const bar = document.createElement('div');
            bar.className = 'visualizer-bar';
            bar.style.height = '2px';
            bar.style.opacity = '0.5';
            visualizerContainer.appendChild(bar);
            visualizerBars.push(bar);
        }
    }
    
    // Cập nhật visualizer
    function updateVisualizer() {
        if (!isPlaying) {
            visualizerBars.forEach(bar => {
                bar.style.height = '2px';
                bar.style.opacity = '0.3';
            });
            return;
        }
        
        visualizerBars.forEach((bar, index) => {
            // Tạo hiệu ứng sóng với random height
            const time = Date.now() / 1000;
            const wave = Math.sin(time * 2 + index * 0.3) * 0.5 + 0.5;
            const randomFactor = Math.random() * 0.3;
            const height = 2 + (wave * randomFactor * 18); // 2px đến 20px
            
            bar.style.height = `${height}px`;
            bar.style.opacity = 0.3 + wave * 0.7;
            
            // Gradient màu theo height
            const gradient = `linear-gradient(to top, 
                hsl(${45}, 70%, ${40 + wave * 30}%), 
                hsl(${0}, 85%, ${50 + wave * 20}%))`;
            bar.style.background = gradient;
        });
        
        if (isPlaying) {
            requestAnimationFrame(updateVisualizer);
        }
    }
    
    // Định dạng thời gian
    function formatTime(seconds) {
        if (isNaN(seconds)) return '0:00';
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
    
    // Cập nhật progress
    function updateProgress() {
        if (audio.duration) {
            const progressPercent = (audio.currentTime / audio.duration) * 100;
            progressBar.style.width = `${progressPercent}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
        }
    }
    
    // Xử lý sự kiện audio
    audio.addEventListener('loadedmetadata', function() {
        totalTimeEl.textContent = formatTime(audio.duration);
    });
    
    audio.addEventListener('timeupdate', updateProgress);
    
    audio.addEventListener('play', function() {
        isPlaying = true;
        playBtn.classList.add('playing');
        musicIcon.textContent = 'pause_circle';
        playPauseIconMini.className = 'fa-solid fa-pause';
        musicNotification.style.opacity = '1';
        miniPlayer.classList.add('visible');
        updateVisualizer();
        
        // Pause video nếu đang phát
        const mainVideoPlayer = document.getElementById('main-video-player');
        if (mainVideoPlayer && !mainVideoPlayer.paused) {
            mainVideoPlayer.pause();
        }
        
        // Hiệu ứng thông báo
        setTimeout(() => {
            musicNotification.style.opacity = '0';
        }, 3000);
    });
    
    audio.addEventListener('pause', function() {
        isPlaying = false;
        playBtn.classList.remove('playing');
        musicIcon.textContent = 'play_circle';
        playPauseIconMini.className = 'fa-solid fa-play';
    });
    
    audio.addEventListener('waiting', function() {
        loadingSpinner.classList.remove('hidden');
    });
    
    audio.addEventListener('canplay', function() {
        loadingSpinner.classList.add('hidden');
    });
    
    audio.addEventListener('ended', function() {
        if (isLooping) {
            audio.currentTime = 0;
            audio.play();
        } else {
            isPlaying = false;
            playBtn.classList.remove('playing');
            musicIcon.textContent = 'play_circle';
            playPauseIconMini.className = 'fa-solid fa-play';
        }
    });
    
    // Sự kiện click nút Nghe Ngay
    playBtn.addEventListener('click', function() {
        if (audio.paused) {
            audio.play().catch(error => {
                console.log('Audio play failed:', error);
                // Fallback: yêu cầu người dùng tương tác
                if (error.name === 'NotAllowedError') {
                    alert('Vui lòng nhấp vào trang web trước khi nghe nhạc');
                }
            });
        } else {
            audio.pause();
        }
    });
    
    // Sự kiện mini player
    if (playPauseMiniBtn) {
        playPauseMiniBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (audio.paused) {
                audio.play();
            } else {
                audio.pause();
            }
        });
    }
    
    if (closePlayerBtn) {
        closePlayerBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            miniPlayer.classList.remove('visible');
            audio.pause();
        });
    }
    
    // Volume control
    if (volumeToggle) {
        volumeToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (isMuted) {
                audio.muted = false;
                volumeIcon.className = 'fa-solid fa-volume-high';
                isMuted = false;
            } else {
                audio.muted = true;
                volumeIcon.className = 'fa-solid fa-volume-xmark';
                isMuted = true;
            }
        });
    }
    
    if (volumeSlider) {
        volumeSlider.addEventListener('input', function(e) {
            e.preventDefault();
            e.stopPropagation();
            audio.volume = this.value / 100;
            
            // Cập nhật icon volume
            if (this.value == 0) {
                volumeIcon.className = 'fa-solid fa-volume-xmark';
            } else if (this.value < 50) {
                volumeIcon.className = 'fa-solid fa-volume-low';
            } else {
                volumeIcon.className = 'fa-solid fa-volume-high';
            }
        });
    }
    
    // Click để show/hide volume slider
    let volumeSliderVisible = false;
    if (volumeToggle) {
        volumeToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            volumeSliderVisible = !volumeSliderVisible;
            if (volumeSliderVisible && volumeSliderContainer) {
                volumeSliderContainer.classList.remove('hidden');
            } else if (volumeSliderContainer) {
                volumeSliderContainer.classList.add('hidden');
            }
        });
    }
    
    // Click ngoài để hide volume slider
    document.addEventListener('click', function(e) {
        if (volumeSliderContainer && !volumeSliderContainer.contains(e.target)) {
            volumeSliderContainer.classList.add('hidden');
            volumeSliderVisible = false;
        }
    });
    
    // Loop toggle
    if (loopToggle) {
        loopToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            isLooping = !isLooping;
            audio.loop = isLooping;
            loopToggle.classList.toggle('active', isLooping);
            
            // Hiệu ứng feedback
            if (isLooping && loopIcon) {
                loopIcon.style.transform = 'rotate(360deg)';
                setTimeout(() => {
                    loopIcon.style.transform = 'rotate(0deg)';
                }, 300);
            }
        });
    }
    
    // Click progress bar để seek
    if (progressBar && progressBar.parentElement) {
        progressBar.parentElement.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            const rect = this.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            audio.currentTime = percent * audio.duration;
        });
    }
    
    // Previous/Next track
    if (prevTrackBtn) {
        prevTrackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            audio.currentTime = 0;
            if (!isPlaying) {
                audio.play();
            }
        });
    }
    
    if (nextTrackBtn) {
        nextTrackBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            if (audio.duration) {
                audio.currentTime = Math.max(0, audio.duration - 1);
            }
        });
    }
    
    // Khởi tạo visualizer
    initVisualizer();
    
    // Set volume ban đầu
    audio.volume = volumeSlider.value / 100;
    
    // ========== CÁC CHỨC NĂNG KHÁC (giữ nguyên từ code cũ) ==========
    
    // Smooth scroll functionality
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Dark mode toggle
    function toggleDarkMode() {
        const html = document.documentElement;
        if (html.classList.contains('dark')) {
            html.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        } else {
            html.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        }
    }
    
    // Load theme preference
    function loadThemePreference() {
        const theme = localStorage.getItem('theme') || 'light';
        const html = document.documentElement;
        
        if (theme === 'dark') {
            html.classList.add('dark');
        } else {
            html.classList.remove('dark');
        }
    }
    
    // Initialize theme on page load
    loadThemePreference();
    
    // Carousel functionality for events
    class EventCarousel {
        constructor() {
            this.currentIndex = 0;
            this.items = document.querySelectorAll('.event-card');
            this.init();
        }
        
        init() {
            const prevBtn = document.querySelector('.carousel-prev');
            const nextBtn = document.querySelector('.carousel-next');
            
            if (prevBtn) {
                prevBtn.addEventListener('click', () => this.prev());
            }
            if (nextBtn) {
                nextBtn.addEventListener('click', () => this.next());
            }
        }
        
        next() {
            if (this.items.length > 0) {
                this.currentIndex = (this.currentIndex + 1) % this.items.length;
                this.updateCarousel();
            }
        }
        
        prev() {
            if (this.items.length > 0) {
                this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
                this.updateCarousel();
            }
        }
        
        updateCarousel() {
            console.log('Carousel index:', this.currentIndex);
        }
    }
    
    // Initialize carousel
    new EventCarousel();
    
    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observe elements with fade-in class
    const elements = document.querySelectorAll('section, .card, h2, h3');
    elements.forEach(el => {
        observer.observe(el);
    });
    
    // Utility function for smooth animations
    function animateCounter(element, target, duration = 2000) {
        const start = 0;
        const startTime = performance.now();
        
        const animate = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const current = Math.floor(start + (target - start) * progress);
            
            element.textContent = current.toLocaleString();
            
            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
    
    // Export functions for external use
    window.canLocHeritage = {
        toggleDarkMode,
        animateCounter
    };
    
    console.log('Music player initialized successfully!');
});