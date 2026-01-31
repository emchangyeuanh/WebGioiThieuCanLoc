/**
 * Media Manager - Đơn giản
 * 
 * Logic:
 * - Click "Nghe ngay" → Phát nhạc + Hiển thị mini player
 * - Click bất kỳ nơi nào khác → Dừng nhạc
 */

document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('background-music');
    const miniPlayer = document.getElementById('mini-player');
    const playBtn = document.getElementById('music-play-btn');
    
    if (!audio || !miniPlayer || !playBtn) {
        console.warn('⚠️ Audio elements not found');
        return;
    }

    // Audio control button IDs (không dừng nhạc khi click)
    const audioControlIds = [
        'music-play-btn',
        'play-pause-mini',
        'prev-track',
        'next-track',
        'volume-toggle',
        'volume-slider',
        'loop-toggle',
        'close-player',
        'progress-bar',
        'current-time',
        'total-time'
    ];

    // Lắng nghe click trên toàn bộ document
    document.addEventListener('click', (e) => {
        const target = e.target;
        
        // Kiểm tra xem click có phải trên audio control không
        let isAudioControl = false;
        
        for (const id of audioControlIds) {
            const element = document.getElementById(id);
            if (element && (target === element || element.contains(target))) {
                isAudioControl = true;
                break;
            }
        }

        // Nếu click trên mini-player container hoặc children của nó, không dừng
        if (miniPlayer && (target === miniPlayer || miniPlayer.contains(target))) {
            isAudioControl = true;
        }

        // Nếu KHÔNG phải click trên audio control → Dừng nhạc
        if (!isAudioControl && !audio.paused) {
            console.log('⏹️ Clicked outside audio controls - stopping audio');
            audio.pause();
            miniPlayer.classList.remove('visible');
        }
    });

    // Cũng dừng khi click trên video items hoặc video player
    const videoItems = document.querySelectorAll('.video-item');
    videoItems.forEach(item => {
        item.addEventListener('click', (e) => {
            if (!audio.paused) {
                console.log('🎬 Video item clicked - stopping audio');
                audio.pause();
                miniPlayer.classList.remove('visible');
            }
        });
    });

    // Lắng nghe click trên video player
    const videoPlayer = document.getElementById('main-video-player');
    if (videoPlayer && videoPlayer.parentElement) {
        videoPlayer.parentElement.addEventListener('click', (e) => {
            if (!audio.paused) {
                console.log('🎬 Video player clicked - stopping audio');
                audio.pause();
                miniPlayer.classList.remove('visible');
            }
        });
    }

    console.log('✅ Media Manager initialized - Click anywhere to stop audio');
});
