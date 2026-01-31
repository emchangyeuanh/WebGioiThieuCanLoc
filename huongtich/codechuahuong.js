/* ========== MODAL FUNCTIONALITY ========== */
(function() {
    // Modal 1: Nguồn gốc Hoàng gia
    const originModal = document.getElementById('originModal');
    const modalClose = document.getElementById('modalClose');
    const modalTrigger = document.querySelector('[data-modal="origin-modal"]');
    
    function openModal(modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    
    function closeModal(modal) {
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    }
    
    // Mở modal Nguồn gốc Hoàng gia
    if (modalTrigger) {
        modalTrigger.addEventListener('click', function() {
            openModal(originModal);
        });
    }
    
    // Đóng modal Nguồn gốc Hoàng gia
    if (modalClose) {
        modalClose.addEventListener('click', function() {
            closeModal(originModal);
        });
    }
    
    // Đóng modal khi click ngoài (Nguồn gốc)
    originModal.addEventListener('click', function(event) {
        if (event.target === originModal) {
            closeModal(originModal);
        }
    });
    
    // Modal 2: 99 Đỉnh
    const mountainModal = document.getElementById('mountainModal');
    const mountainModalClose = document.getElementById('mountainModalClose');
    const mountainTrigger = document.querySelector('[data-modal="mountain-modal"]');
    
    // Mở modal 99 Đỉnh
    if (mountainTrigger) {
        mountainTrigger.addEventListener('click', function() {
            openModal(mountainModal);
        });
    }
    
    // Đóng modal 99 Đỉnh
    if (mountainModalClose) {
        mountainModalClose.addEventListener('click', function() {
            closeModal(mountainModal);
        });
    }
    
    // Đóng modal khi click ngoài (99 Đỉnh)
    mountainModal.addEventListener('click', function(event) {
        if (event.target === mountainModal) {
            closeModal(mountainModal);
        }
    });
    
    // Modal 3: Map Modal
    const mapModal = document.getElementById('mapModal');
    const mapModalClose = document.getElementById('mapModalClose');
    const mapModalTrigger = document.querySelector('[data-modal="map-modal"]');
    
    // Mở map modal
    if (mapModalTrigger) {
        mapModalTrigger.addEventListener('click', function() {
            openModal(mapModal);
        });
    }
    
    // Đóng map modal
    if (mapModalClose) {
        mapModalClose.addEventListener('click', function() {
            closeModal(mapModal);
        });
    }
    
    // Đóng map modal khi click ngoài
    mapModal.addEventListener('click', function(event) {
        if (event.target === mapModal) {
            closeModal(mapModal);
        }
    });
    
    // ========== GALLERY EXPAND FEATURE ==========
    const viewAllPhotosBtn = document.getElementById('viewAllPhotosBtn');
    const galleryItems = document.querySelectorAll('.gallery-item');
    let isExpanded = false;
    
    if (viewAllPhotosBtn) {
        viewAllPhotosBtn.addEventListener('click', function() {
            isExpanded = !isExpanded;
            galleryItems.forEach(item => {
                if (isExpanded) {
                    item.classList.add('show');
                } else {
                    item.classList.remove('show');
                }
            });
        });
    }
    
    // ========== LIGHTBOX GALLERY FEATURE ==========
    const lightboxModal = document.getElementById('lightboxModal');
    const lightboxImage = document.getElementById('lightboxImage');
    const lightboxCaption = document.getElementById('lightboxCaption');
    const lightboxClose = document.getElementById('lightboxClose');
    const lightboxPrev = document.getElementById('lightboxPrev');
    const lightboxNext = document.getElementById('lightboxNext');
    const galleryImages = document.querySelectorAll('img[data-gallery="architecture"]');
    let currentImageIndex = 0;
    let galleryImageArray = Array.from(galleryImages);
    
    function updateLightboxImage(index) {
        if (index >= 0 && index < galleryImageArray.length) {
            currentImageIndex = index;
            const img = galleryImageArray[index];
            lightboxImage.src = img.src;
            lightboxCaption.textContent = img.alt || '';
        }
    }
    
    galleryImages.forEach((img, index) => {
        img.addEventListener('click', function() {
            openModal(lightboxModal);
            updateLightboxImage(index);
        });
    });
    
    if (lightboxClose) {
        lightboxClose.addEventListener('click', function() {
            closeModal(lightboxModal);
        });
    }
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            let newIndex = currentImageIndex - 1;
            if (newIndex < 0) newIndex = galleryImageArray.length - 1;
            updateLightboxImage(newIndex);
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            let newIndex = currentImageIndex + 1;
            if (newIndex >= galleryImageArray.length) newIndex = 0;
            updateLightboxImage(newIndex);
        });
    }
    
    lightboxModal.addEventListener('click', function(event) {
        if (event.target === lightboxModal) {
            closeModal(lightboxModal);
        }
    });
    
    // ========== GALLERY FESTIVAL IMAGES LIGHTBOX ==========
    const festivalGalleryImages = document.querySelectorAll('.gallery-image');
    let festivalCurrentImageIndex = 0;
    let festivalImageArray = Array.from(festivalGalleryImages);
    
    function updateFestivalLightbox(index) {
        if (index >= 0 && index < festivalImageArray.length) {
            festivalCurrentImageIndex = index;
            const element = festivalImageArray[index];
            const imageSrc = element.getAttribute('data-image');
            const caption = element.getAttribute('data-caption');
            lightboxImage.src = imageSrc;
            lightboxCaption.textContent = caption || '';
        }
    }
    
    festivalGalleryImages.forEach((element, index) => {
        element.addEventListener('click', function(e) {
            e.stopPropagation();
            openModal(lightboxModal);
            updateFestivalLightbox(index);
        });
    });
    
    // Cập nhật xử lý nút prev/next cho festival images
    const originalLightboxPrevClick = lightboxPrev ? lightboxPrev.onclick : null;
    const originalLightboxNextClick = lightboxNext ? lightboxNext.onclick : null;
    
    if (lightboxPrev) {
        lightboxPrev.addEventListener('click', function() {
            if (festivalImageArray.length > 0) {
                let newIndex = festivalCurrentImageIndex - 1;
                if (newIndex < 0) newIndex = festivalImageArray.length - 1;
                updateFestivalLightbox(newIndex);
            } else if (galleryImageArray.length > 0) {
                let newIndex = currentImageIndex - 1;
                if (newIndex < 0) newIndex = galleryImageArray.length - 1;
                updateLightboxImage(newIndex);
            }
        });
    }
    
    if (lightboxNext) {
        lightboxNext.addEventListener('click', function() {
            if (festivalImageArray.length > 0) {
                let newIndex = festivalCurrentImageIndex + 1;
                if (newIndex >= festivalImageArray.length) newIndex = 0;
                updateFestivalLightbox(newIndex);
            } else if (galleryImageArray.length > 0) {
                let newIndex = currentImageIndex + 1;
                if (newIndex >= galleryImageArray.length) newIndex = 0;
                updateLightboxImage(newIndex);
            }
        });
    }
    
    // ========== CLOSE MODAL ON ESC KEY ==========
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
            closeModal(originModal);
            closeModal(mountainModal);
            closeModal(mapModal);
            closeModal(lightboxModal);
        }
    });
})();
