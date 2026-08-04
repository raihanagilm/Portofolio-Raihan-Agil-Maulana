/**
 * SCRIPT DASHBOARD - Logic Khusus Dashboard
 * Hanya digunakan di base.html (dashboard)
 */

/**
 * Animasi bar chart saat halaman dimuat
 */
function initChartAnimation() {
    const bars = document.querySelectorAll('.chart-bar');
    if (bars.length === 0) return;

    bars.forEach(bar => {
        const finalHeight = bar.style.getPropertyValue('--height') || bar.style.height;
        bar.style.height = '0%';

        setTimeout(() => {
            bar.style.height = finalHeight;
        }, 300);
    });
}

// ================================
// INISIALISASI DASHBOARD
// ================================
document.addEventListener('DOMContentLoaded', () => {
    // Inisialisasi khusus dashboard
    initChartAnimation();
});