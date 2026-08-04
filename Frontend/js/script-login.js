document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const otpInputs = document.querySelectorAll('.otp-input');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });

                const res = await response.json();
                if (response.ok && res.success) {
                    showAlert('Login berhasil! Mengalihkan...', 'success');
                    setTimeout(() => {
                        window.location.href = res.redirect || '/dashboard/';
                    }, 600);
                } else {
                    showAlert(res.message || 'Login gagal. Periksa kembali kredensial Anda.', 'danger');
                }
            } catch (err) {
                showAlert('Terjadi kesalahan jaringan.', 'danger');
            }
        });
    }

    // Auto focus next OTP input box
    otpInputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value.length === 1 && index < otpInputs.length - 1) {
                otpInputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                otpInputs[index - 1].focus();
            }
        });
    });
});

function togglePassword() {
    const pwd = document.getElementById('password');
    const icon = document.getElementById('passwordIcon');
    if (pwd.type === 'password') {
        pwd.type = 'text';
        icon.textContent = 'visibility_off';
    } else {
        pwd.type = 'password';
        icon.textContent = 'visibility';
    }
}

function toggleEmergency() {
    const section = document.getElementById('emergencySection');
    const chevron = document.getElementById('emergencyChevron');
    section.classList.toggle('hidden');
    if (section.classList.contains('hidden')) {
        chevron.style.transform = 'rotate(0deg)';
    } else {
        chevron.style.transform = 'rotate(180deg)';
    }
}

async function requestOtp() {
    const btn = document.getElementById('requestOtpBtn');
    btn.disabled = true;
    btn.innerText = 'Mengirim OTP...';

    try {
        const response = await fetch('/request-emergency-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        });

        const res = await response.json();
        if (response.ok && res.success) {
            showAlert(res.message, 'success');
            document.getElementById('otpFormArea').classList.remove('hidden');
            btn.innerText = 'OTP Terkirim (Cek Email)';
        } else {
            showAlert(res.message, 'warning');
            btn.disabled = false;
            btn.innerText = 'Minta Kode OTP Ke Email';
        }
    } catch (err) {
        showAlert('Gagal menghubungi server.', 'danger');
        btn.disabled = false;
        btn.innerText = 'Minta Kode OTP Ke Email';
    }
}

async function verifyOtp() {
    const inputs = document.querySelectorAll('.otp-input');
    let otp = '';
    inputs.forEach(i => otp += i.value.trim());

    if (otp.length !== 6) {
        showAlert('Masukkan 6 digit kode OTP secara lengkap.', 'warning');
        return;
    }

    try {
        const response = await fetch('/verify-emergency-otp', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ otp })
        });

        const res = await response.json();
        if (response.ok && res.success) {
            showAlert('Verifikasi OTP berhasil! Mengalihkan...', 'success');
            setTimeout(() => {
                window.location.href = res.redirect || '/dashboard/';
            }, 600);
        } else {
            showAlert(res.message || 'OTP salah atau telah kadaluarsa.', 'danger');
        }
    } catch (err) {
        showAlert('Terjadi kesalahan jaringan.', 'danger');
    }
}

function showAlert(message, type = 'info') {
    const alertBox = document.getElementById('alertBox');
    if (!alertBox) return;

    alertBox.classList.remove('hidden', 'bg-green-100', 'text-green-900', 'border-green-600',
        'bg-red-100', 'text-red-900', 'border-red-600', 'bg-yellow-100', 'text-yellow-900', 'border-yellow-600');

    if (type === 'success') {
        alertBox.classList.add('bg-green-100', 'text-green-900', 'border-green-600');
    } else if (type === 'danger') {
        alertBox.classList.add('bg-red-100', 'text-red-900', 'border-red-600');
    } else if (type === 'warning') {
        alertBox.classList.add('bg-yellow-100', 'text-yellow-900', 'border-yellow-600');
    }

    alertBox.innerText = message;
}