// Dark Mode Fixed Script
(function() {
    const htmlElement = document.documentElement;
    
    // Initialize dark mode as fixed
    function initDarkMode() {
        htmlElement.classList.remove('light');
        htmlElement.classList.add('dark');
        localStorage.setItem('darkMode', 'enabled');
    }
    
    // Initialize on DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initDarkMode);
    } else {
        initDarkMode();
    }
    
    // Expose functions globally
    window.darkMode = {
        isEnabled: () => htmlElement.classList.contains('dark')
    };
})();
