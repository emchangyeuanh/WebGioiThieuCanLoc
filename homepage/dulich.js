// ========== DATA & CONFIGURATION ==========
const tourPrices = {
    'chua-huong-tinh': { base: 1500000, standard: 1, premium: 1.3, vip: 1.6 },
    'nga-ba-dong-loc': { base: 2000000, standard: 1, premium: 1.25, vip: 1.5 },
    'moc-ban-truong-luu': { base: 2500000, standard: 1, premium: 1.2, vip: 1.45 },
};

const tourNames = {
    'chua-huong-tinh': 'Tour Chùa Hương Tĩnh - Tâm Linh Thiêng Liêng',
    'nga-ba-dong-loc': 'Tour Ngã Ba Đồng Lộc - Di Tích Lịch Sử',
    'moc-ban-truong-luu': 'Tour Mộc Bản Trường Lưu - Làng Truyền Thống',
};

const tourTypeNames = {
    'standard': 'Tiêu Chuẩn',
    'premium': 'Cao Cấp',
    'vip': 'VIP'
};

const destinationOptions = [
    { value: 'chua-huong-tinh', label: 'Chùa Hương Tĩnh - Tâm Linh Thiêng Liêng' },
    { value: 'nga-ba-dong-loc', label: 'Ngã Ba Đồng Lộc - Di Tích Lịch Sử' },
    { value: 'moc-ban-truong-luu', label: 'Mộc Bản Trường Lưu - Làng Truyền Thống' }
];

// ========== DOM ELEMENTS ==========
let form, fullNameInput, phoneInput, emailInput, numberOfPeopleInput, tourTypeRadios;
let submitBtn, alertContainer, totalPriceDisplay, header;
let segmentButtons, segmentsList, numberOfSegmentsDisplay;

// ========== INITIALIZATION ==========
document.addEventListener('DOMContentLoaded', function() {
    initializeDOMElements();
    setupEventListeners();
    initializeSegments();
    loadSurveyData();
    setupBackToTopButton();
    setupPriceSummarySticky();
    updateBookingHistory();
    
    // Set minimum date to today
    const today = new Date().toISOString().split('T')[0];
    const departureDateInput = document.getElementById('departureDate');
    if (departureDateInput) departureDateInput.min = today;
    
    // Initialize price display
    calculatePrice();
});

function initializeDOMElements() {
    form = document.getElementById('bookingForm');
    fullNameInput = document.getElementById('fullName');
    phoneInput = document.getElementById('phone');
    emailInput = document.getElementById('email');
    numberOfPeopleInput = document.getElementById('numberOfPeople');
    tourTypeRadios = document.querySelectorAll('input[name="tourType"]');
    submitBtn = document.getElementById('submitBtn');
    alertContainer = document.getElementById('alertContainer');
    totalPriceDisplay = document.getElementById('totalPrice');
    header = document.getElementById('header');
    segmentButtons = document.querySelectorAll('.segment-btn');
    segmentsList = document.getElementById('segmentsList');
}

function setupEventListeners() {
    // Price calculation triggers
    numberOfPeopleInput.addEventListener('input', calculatePrice);
    tourTypeRadios.forEach(radio => radio.addEventListener('change', calculatePrice));

    // Form submission
    form.addEventListener('submit', handleFormSubmit);

    // Download and new booking buttons
    const downloadBtn = document.getElementById('downloadBtn');
    const newBookingBtn = document.getElementById('newBookingBtn');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadInvoice);
    if (newBookingBtn) newBookingBtn.addEventListener('click', startNewBooking);

    // Header scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Real-time validation
    fullNameInput.addEventListener('blur', () => validateField(fullNameInput));
    phoneInput.addEventListener('blur', () => validateField(phoneInput));
    emailInput.addEventListener('blur', () => validateField(emailInput));
    numberOfPeopleInput.addEventListener('change', () => validateField(numberOfPeopleInput));
}

// ========== SEGMENT MANAGEMENT ==========
function initializeSegments() {
    segmentButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const numSegments = parseInt(btn.dataset.segments);
            changeNumberOfSegments(numSegments);
            
            // Update active button
            segmentButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });

    // Initialize with 1 segment
    changeNumberOfSegments(1);
}

function changeNumberOfSegments(numSegments) {
    segmentsList.innerHTML = '';
    
    for (let i = 1; i <= numSegments; i++) {
        const segmentDiv = document.createElement('div');
        segmentDiv.className = 'segment-item';
        segmentDiv.setAttribute('data-segment', i);
        
        segmentDiv.innerHTML = `
            <div class="segment-number">${i}</div>
            <select class="segment-select destination-select" data-segment="${i}" required>
                <option value="">-- Chọn điểm đến --</option>
                ${destinationOptions.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}
            </select>
            ${numSegments > 1 ? `
                <button type="button" class="segment-remove" onclick="removeSegment(${i})">
                    <i class="fas fa-trash"></i> Xóa
                </button>
            ` : ''}
        `;
        
        segmentsList.appendChild(segmentDiv);
        
        // Add event listener for price calculation
        const select = segmentDiv.querySelector('.destination-select');
        select.addEventListener('change', calculatePrice);
    }
    
    // Recalculate price
    calculatePrice();
}

function removeSegment(segmentNum) {
    const segment = document.querySelector(`[data-segment="${segmentNum}"]`);
    if (segment) {
        segment.remove();
        calculatePrice();
    }
}

// ========== FORM VALIDATION ==========
function validateField(field) {
    const parent = field.parentElement;
    let errorElement = parent.querySelector('.error-text');
    
    if (!errorElement) {
        errorElement = document.createElement('small');
        errorElement.className = 'error-text text-red-500 text-xs mt-1';
        parent.appendChild(errorElement);
    }
    
    let isValid = true;
    let errorMessage = '';

    if (field.hasAttribute('required') && !field.value.trim()) {
        isValid = false;
        errorMessage = 'Trường này không được để trống';
    } else if (field.id === 'phone') {
        const phoneRegex = /^[0-9]{10,11}$/;
        if (field.value && !phoneRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Số điện thoại không hợp lệ (10-11 chữ số)';
        }
    } else if (field.id === 'email' && field.value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(field.value)) {
            isValid = false;
            errorMessage = 'Email không hợp lệ';
        }
    } else if (field.id === 'numberOfPeople') {
        if (parseInt(field.value) < 1) {
            isValid = false;
            errorMessage = 'Số lượng người tối thiểu là 1';
        }
    }

    if (isValid) {
        field.classList.remove('error');
        errorElement.textContent = '';
    } else {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
    }

    return isValid;
}

function validateSegments() {
    const selects = document.querySelectorAll('.destination-select');
    let allValid = true;
    
    selects.forEach(select => {
        if (!select.value) {
            allValid = false;
            select.classList.add('error');
        } else {
            select.classList.remove('error');
        }
    });
    
    return allValid;
}

function validateForm() {
    const fieldsToValidate = [
        fullNameInput,
        phoneInput,
        emailInput,
        numberOfPeopleInput
    ];

    let allValid = true;
    fieldsToValidate.forEach(field => {
        if (!validateField(field)) {
            allValid = false;
        }
    });
    
    // Also validate segments
    if (!validateSegments()) {
        allValid = false;
    }

    return allValid;
}

// ========== PRICE CALCULATION ==========
function calculatePrice() {
    const numberOfPeople = parseInt(numberOfPeopleInput.value) || 1;
    const tourType = document.querySelector('input[name="tourType"]:checked').value;
    const selects = document.querySelectorAll('.destination-select');
    
    let totalPrice = 0;
    let basePrice = 0;

    // Update displays
    document.getElementById('quantityDisplay').textContent = numberOfPeople + ' người';
    document.getElementById('typeDisplay').textContent = tourTypeNames[tourType];

    // Calculate price for each segment
    selects.forEach(select => {
        const destination = select.value;
        if (destination && tourPrices[destination]) {
            const pricing = tourPrices[destination];
            basePrice += pricing.base;
            const multiplier = pricing[tourType] || 1;
            totalPrice += pricing.base * multiplier * numberOfPeople;
        }
    });

    // Update displays with formatting
    if (basePrice > 0) {
        document.getElementById('basePriceDisplay').textContent = formatCurrency(basePrice);
    } else {
        document.getElementById('basePriceDisplay').textContent = '0 VNĐ';
    }
    
    totalPriceDisplay.textContent = formatCurrency(totalPrice);

    // Animate price update
    totalPriceDisplay.parentElement.classList.add('animate-bounce-slight');
    setTimeout(() => {
        totalPriceDisplay.parentElement.classList.remove('animate-bounce-slight');
    }, 600);
}

function formatCurrency(value) {
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
}

// ========== FORM SUBMISSION ==========
function handleFormSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
        showModal({
            type: 'error',
            title: 'Kiểm Tra Lại Thông Tin',
            message: 'Vui lòng điền đầy đủ các thông tin bắt buộc.',
            errors: getValidationErrors()
        });
        return;
    }

    submitBtn.disabled = true;
    submitBtn.classList.add('btn-loading');

    setTimeout(() => {
        const selects = document.querySelectorAll('.destination-select');
        const destinations = [];
        selects.forEach(select => {
            if (select.value) {
                destinations.push(select.value);
            }
        });

        const bookingData = {
            id: Date.now(),
            fullName: fullNameInput.value,
            phone: phoneInput.value,
            email: emailInput.value,
            destinations: destinations,
            numberOfPeople: numberOfPeopleInput.value,
            tourType: document.querySelector('input[name="tourType"]:checked').value,
            totalPrice: parseInt(totalPriceDisplay.textContent.replace(/[^\d]/g, '')),
            bookingDate: new Date().toLocaleString('vi-VN')
        };

        let bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
        bookings.unshift(bookingData);
        localStorage.setItem('bookings', JSON.stringify(bookings));

        showModal({
            type: 'success',
            title: 'Đặt Tour Thành Công!',
            message: 'Đặt tour thành công! Chúng tôi sẽ liên hệ với bạn sớm nhất.',
            bookingData: bookingData,
            onClose: () => {
                displayConfirmation(bookingData);
                startNewBooking();
            }
        });

        submitBtn.disabled = false;
        submitBtn.classList.remove('btn-loading');
    }, 1500);
}

function getValidationErrors() {
    const errors = [];
    
    if (!fullNameInput.value.trim()) {
        errors.push('Họ và tên không được để trống');
    }
    if (!phoneInput.value.trim()) {
        errors.push('Số điện thoại không được để trống');
    } else if (!/^[0-9]{10,11}$/.test(phoneInput.value)) {
        errors.push('Số điện thoại không hợp lệ (10-11 chữ số)');
    }
    if (!numberOfPeopleInput.value || parseInt(numberOfPeopleInput.value) < 1) {
        errors.push('Số lượng người phải lớn hơn 0');
    }
    
    const selects = document.querySelectorAll('.destination-select');
    let hasDestination = false;
    selects.forEach(select => {
        if (select.value) hasDestination = true;
    });
    if (!hasDestination) {
        errors.push('Vui lòng chọn ít nhất một địa điểm du lịch');
    }
    
    return errors;
}

// ========== MODAL NOTIFICATION ==========
function showModal(config) {
    const overlay = document.getElementById('modalOverlay');
    const modalContent = document.getElementById('modalContent');
    const modalIcon = document.getElementById('modalIcon');
    const modalTitle = document.getElementById('modalTitle');
    const modalMessage = document.getElementById('modalMessage');
    const modalDetails = document.getElementById('modalDetails');
    const errorList = document.getElementById('errorList');
    const errorListItems = document.getElementById('errorListItems');
    const primaryBtn = document.getElementById('modalPrimaryBtn');
    const secondaryBtn = document.getElementById('modalSecondaryBtn');

    modalDetails.innerHTML = '';
    errorListItems.innerHTML = '';
    errorList.style.display = 'none';
    secondaryBtn.style.display = 'none';

    modalContent.className = `modal-content ${config.type}`;
    modalTitle.textContent = config.title;
    modalMessage.textContent = config.message;

    if (config.type === 'success') {
        modalIcon.className = 'modal-icon success';
        modalIcon.innerHTML = '<i class="fas fa-check-circle"></i>';
        primaryBtn.textContent = '✓ Tuyệt Vời';

        if (config.bookingData) {
            const bookingData = config.bookingData;
            const destinationsList = bookingData.destinations.map(d => tourNames[d]).join(', ');
            const detailsHTML = `
                <div class="modal-details-item">
                    <span class="modal-details-label">Khách hàng:</span>
                    <span class="modal-details-value">${bookingData.fullName}</span>
                </div>
                <div class="modal-details-item">
                    <span class="modal-details-label">Số điện thoại:</span>
                    <span class="modal-details-value">${bookingData.phone}</span>
                </div>
                <div class="modal-details-item">
                    <span class="modal-details-label">Chặng du lịch:</span>
                    <span class="modal-details-value">${destinationsList}</span>
                </div>
                <div class="modal-details-item">
                    <span class="modal-details-label">Số người:</span>
                    <span class="modal-details-value">${bookingData.numberOfPeople}</span>
                </div>
                <div class="modal-details-item">
                    <span class="modal-details-label">Loại tour:</span>
                    <span class="modal-details-value">${tourTypeNames[bookingData.tourType]}</span>
                </div>
                <div class="modal-details-item">
                    <span class="modal-details-label">Tổng tiền:</span>
                    <span class="modal-details-value">${formatCurrency(bookingData.totalPrice)}</span>
                </div>
            `;
            modalDetails.innerHTML = detailsHTML;
        }
    } else if (config.type === 'error') {
        modalIcon.className = 'modal-icon error';
        modalIcon.innerHTML = '<i class="fas fa-exclamation-circle"></i>';
        primaryBtn.textContent = '✓ Đã Hiểu';

        if (config.errors && config.errors.length > 0) {
            errorList.style.display = 'block';
            let errorHTML = '';
            config.errors.forEach(error => {
                errorHTML += `<li>${error}</li>`;
            });
            errorListItems.innerHTML = errorHTML;
        }
    }

    overlay.classList.add('show');

    const closeModal = () => {
        overlay.classList.remove('show');
        if (config.onClose && typeof config.onClose === 'function') {
            config.onClose();
        }
    };

    primaryBtn.onclick = closeModal;
    secondaryBtn.onclick = closeModal;
}

// ========== CONFIRMATION & HISTORY ==========
function displayConfirmation(bookingData) {
    document.querySelector('.form-container').classList.add('hidden');
    document.getElementById('confirmationSection').classList.remove('hidden');

    const destinationsList = bookingData.destinations.map(d => tourNames[d]).join(', ');
    const confirmationHTML = `
        <div class="confirmation-item">
            <label>Họ và Tên</label>
            <p>${bookingData.fullName}</p>
        </div>
        <div class="confirmation-item">
            <label>Số Điện Thoại</label>
            <p>${bookingData.phone}</p>
        </div>
        <div class="confirmation-item">
            <label>Email</label>
            <p>${bookingData.email || 'N/A'}</p>
        </div>
        <div class="confirmation-item">
            <label>Chặng Du Lịch</label>
            <p>${destinationsList}</p>
        </div>
        <div class="confirmation-item">
            <label>Số Người</label>
            <p>${bookingData.numberOfPeople} người</p>
        </div>
        <div class="confirmation-item">
            <label>Loại Tour</label>
            <p>${tourTypeNames[bookingData.tourType]}</p>
        </div>
        <div class="confirmation-item">
            <label>Tổng Tiền</label>
            <p class="text-primary font-bold text-lg">${formatCurrency(bookingData.totalPrice)}</p>
        </div>
    `;

    document.getElementById('confirmationDetails').innerHTML = confirmationHTML;
    updateBookingHistory();

    setTimeout(() => {
        document.getElementById('confirmationSection').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

function updateBookingHistory() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    const bookingHistory = document.getElementById('bookingHistory');
    let historyHTML = '';

    if (bookings.length === 0) {
        bookingHistory.innerHTML = '<p class="text-gray-500 dark:text-gray-400">Chưa có lịch sử đặt tour</p>';
        return;
    }

    bookings.slice(0, 3).forEach((booking, index) => {
        const destinationsList = booking.destinations.map(d => tourNames[d]).join(', ');
        historyHTML += `
            <div class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover-lift">
                <div class="flex justify-between items-start">
                    <div>
                        <h4 class="font-bold text-primary">${destinationsList}</h4>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Khách: ${booking.fullName}</p>
                        <p class="text-sm text-gray-600 dark:text-gray-400">Loại: ${tourTypeNames[booking.tourType]}</p>
                    </div>
                    <div class="text-right">
                        <p class="font-bold text-secondary">${formatCurrency(booking.totalPrice)}</p>
                        <p class="text-xs text-gray-500 dark:text-gray-400">${booking.bookingDate}</p>
                    </div>
                </div>
            </div>
        `;
    });

    bookingHistory.innerHTML = historyHTML;
}

function downloadInvoice() {
    const bookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    if (bookings.length === 0) return;

    const booking = bookings[0];
    const destinationsList = booking.destinations.map(d => tourNames[d]).join('\n• ');
    
    const invoiceText = `
╔════════════════════════════════════════╗
║        HÓA ĐƠN ĐẶT TOUR DU LỊCH       ║
║         CAN LỘC TOUR 2026            ║
╚════════════════════════════════════════╝

Mã đơn: ${booking.id}
Ngày đặt: ${booking.bookingDate}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

THÔNG TIN KHÁCH HÀNG:
Họ và tên: ${booking.fullName}
Số điện thoại: ${booking.phone}
Email: ${booking.email || 'Không có'}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

CHI TIẾT TOUR:
Chặng du lịch:
• ${destinationsList}

Loại tour: ${tourTypeNames[booking.tourType]}
Số lượng: ${booking.numberOfPeople} người
Số chặng: ${booking.destinations.length} chặng

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

BẢNG GIÁ:
Tổng tiền: ${formatCurrency(booking.totalPrice)}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✓ Thanh toán: Chờ xác nhận
✓ Trạng thái: Đã nhận yêu cầu
✓ Hỗ trợ: 24/7 - 0123456789

Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
    `;

    const blob = new Blob([invoiceText], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `hoa-don-${booking.id}.txt`;
    link.click();
}

function startNewBooking() {
    form.reset();
    
    document.querySelectorAll('input.error, select.error').forEach(el => {
        el.classList.remove('error');
        const errorElement = el.parentElement.querySelector('.error-text');
        if (errorElement) errorElement.textContent = '';
    });

    document.querySelector('.form-container').classList.remove('hidden');
    document.getElementById('confirmationSection').classList.add('hidden');

    document.getElementById('standard').checked = true;
    initializeSegments();
    calculatePrice();

    form.scrollIntoView({ behavior: 'smooth' });
}

// ========== SURVEY DATA HANDLING ==========
function loadSurveyData() {
    const surveyData = JSON.parse(sessionStorage.getItem('surveyData') || '{}');
    const urlParams = new URLSearchParams(window.location.search);
    const isSurvey = urlParams.get('survey');

    if (isSurvey && surveyData.name) {
        if (fullNameInput) fullNameInput.value = surveyData.name || '';
        if (phoneInput) phoneInput.value = surveyData.phone || '';
        if (emailInput) emailInput.value = surveyData.email || '';

        showWelcomeAlert(surveyData);
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function showWelcomeAlert(data) {
    if (!alertContainer) return;

    const interests = {
        'cultural': 'Du lịch văn hóa',
        'nature': 'Du lịch thiên nhiên',
        'adventure': 'Du lịch mạo hiểm',
        'spiritual': 'Du lịch tâm linh'
    };

    const timings = {
        '1-month': 'trong 1 tháng tới',
        '3-months': 'trong 3 tháng tới',
        '6-months': 'trong 6 tháng tới',
        'later': 'sau 6 tháng'
    };

    const accommodations = {
        'luxury-hotel': 'Khách sạn sang trọng',
        'boutique': 'Khách sạn boutique',
        'homestay': 'Nhà nghỉ/Homestay',
        'resort': 'Resort & Spa'
    };

    const alertHTML = `
        <div class="bg-primary/10 dark:bg-primary/5 border-2 border-primary dark:border-primary/50 rounded-lg p-6 relative">
            <button onclick="this.parentElement.style.display='none'" class="absolute top-3 right-3 text-primary hover:text-primary-dark dark:text-primary-light">
                <i class="fas fa-times text-xl"></i>
            </button>
            <div class="flex items-start gap-4">
                <div class="text-primary dark:text-primary-light text-3xl flex-shrink-0">
                    <i class="fas fa-check-circle"></i>
                </div>
                <div class="flex-1">
                    <h3 class="text-lg font-bold text-primary dark:text-primary-light mb-2">Chào mừng ${data.name}! 👋</h3>
                    <p class="text-gray-700 dark:text-gray-300 mb-3">Chúng tôi đã nhận được phản hồi của bạn:</p>
                    <ul class="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                        <li><strong>Loại du lịch:</strong> ${interests[data.q1] || data.q1}</li>
                        <li><strong>Thời gian:</strong> ${timings[data.q2] || data.q2}</li>
                        <li><strong>Lưu trú:</strong> ${accommodations[data.q3] || data.q3}</li>
                    </ul>
                    <p class="text-sm text-primary dark:text-primary-light font-semibold mt-3">
                        <i class="fas fa-arrow-right mr-2"></i>Các tour phù hợp với nhu cầu của bạn đã được lọc sẵn
                    </p>
                </div>
            </div>
        </div>
    `;

    alertContainer.innerHTML = alertHTML;

    setTimeout(() => {
        document.querySelector('.form-container').scrollIntoView({ behavior: 'smooth' });
    }, 500);
}

// ========== THEME TOGGLE ==========
function setupThemeToggle() {
    const themeToggle = document.getElementById('nav-theme-toggle');
    if (!themeToggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'dark') {
        document.documentElement.classList.add('dark');
    }

    themeToggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
}

// ========== BACK TO TOP BUTTON ==========
function setupBackToTopButton() {
    const backToTopBtn = document.getElementById('backToTopBtn');
    if (!backToTopBtn) return;

    // Show/hide button on scroll
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    }

    // Initial check
    toggleBackToTop();
    
    // Throttle scroll event
    let isScrolling;
    window.addEventListener('scroll', () => {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(() => {
            toggleBackToTop();
        }, 66); // ~15fps
    });

    // Scroll to top smoothly
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Prevent text selection on mobile
    backToTopBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
    }, { passive: false });
}

// ========== UPDATE PRICE SUMMARY POSITIONING ==========
function setupPriceSummarySticky() {
    const priceSummary = document.getElementById('priceSummary');
    if (!priceSummary) return;

    function updateStickyBehavior() {
        // Kiểm tra nếu màn hình đủ rộng
        if (window.innerWidth >= 768) {
            // Thiết lập sticky với offset chính xác
            const headerHeight = header ? header.offsetHeight : 80;
            priceSummary.style.position = 'sticky';
            priceSummary.style.top = `${headerHeight + 20}px`;
            priceSummary.style.height = 'fit-content';
            priceSummary.style.maxHeight = `calc(100vh - ${headerHeight + 40}px)`;
            priceSummary.style.overflowY = 'auto';
        } else {
            // Trên mobile: tắt sticky
            priceSummary.style.position = 'static';
            priceSummary.style.top = 'auto';
            priceSummary.style.height = 'auto';
            priceSummary.style.maxHeight = 'none';
            priceSummary.style.overflowY = 'visible';
        }
    }

    // Initial setup
    updateStickyBehavior();
    
    // Update on resize
    window.addEventListener('resize', updateStickyBehavior);
    
    // Update on scroll để đảm bảo vị trí chính xác
    window.addEventListener('scroll', () => {
        if (window.innerWidth >= 768 && header) {
            // Cập nhật vị trí top dựa trên chiều cao header
            const headerHeight = header.offsetHeight;
            priceSummary.style.top = `${headerHeight + 20}px`;
        }
    });

    // Đảm bảo CSS scrollbar được áp dụng
    const style = document.createElement('style');
    style.textContent = `
        .price-summary-sticky::-webkit-scrollbar {
            width: 6px;
        }
        .price-summary-sticky::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.05);
            border-radius: 3px;
        }
        .price-summary-sticky::-webkit-scrollbar-thumb {
            background: rgba(198, 40, 40, 0.3);
            border-radius: 3px;
            transition: background 0.3s ease;
        }
        .price-summary-sticky::-webkit-scrollbar-thumb:hover {
            background: rgba(198, 40, 40, 0.6);
        }
    `;
    document.head.appendChild(style);
}