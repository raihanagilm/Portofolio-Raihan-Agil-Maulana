/**
 * Manajemen Portofolio - Login Page
 * JavaScript untuk Login dengan tema kardus
 */

/**
 * Toggle visibility password
 * Mengubah tipe input antara password dan text
 */
function togglePassword() {
    const input = document.getElementById('password');
    const icon = document.getElementById('passwordIcon');

    if (input.type === 'password') {
        input.type = 'text';
        icon.innerText = 'visibility_off';
    } else {
        input.type = 'password';
        icon.innerText = 'visibility';
    }
}

/**
 * Toggle tampilan section emergency login
 * Menampilkan/menyembunyikan form OTP darurat
 */
function toggleEmergency() {
    const section = document.getElementById('emergencySection');
    const chevron = document.getElementById('emergencyChevron');
    const button = document.querySelector('[aria-controls="emergencySection"]');

    const isHidden = section.classList.contains('hidden');
    section.classList.toggle('hidden');
    chevron.style.transform = isHidden ? 'rotate(180deg)' : 'rotate(0deg)';
    button.setAttribute('aria-expanded', isHidden);
}

/**
 * Auto-focus untuk input OTP 6 digit
 * Pindah focus otomatis ke input berikutnya saat user mengetik
 */
const inputs = document.querySelectorAll('#emergencySection input[type="text"]');
inputs.forEach((input, index) => {
    // Pindah ke input berikutnya saat satu karakter diketik
    input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
            inputs[index + 1].focus();
        }
    });

    // Pindah ke input sebelumnya saat backspace pada input kosong
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && !e.target.value && index > 0) {
            inputs[index - 1].focus();
        }
    });
});

/**
 * Form submission dengan loading indicator
 * Menampilkan spinner saat form disubmit untuk UX yang lebih baik
 */
document.getElementById('loginForm').addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const originalText = btn.innerText;

    // Tampilkan loading spinner
    btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-xl">progress_activity</span>`;
    btn.disabled = true;

    // Simulasi delay (ganti dengan API call sebenarnya)
    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.disabled = false;
    }, 1500);
});