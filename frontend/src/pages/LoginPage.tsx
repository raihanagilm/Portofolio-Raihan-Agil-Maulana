import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [requiresOtp, setRequiresOtp] = useState(false);
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Harap isi email dan kata sandi');
      return;
    }
    setError('');
    setLoading(true);

    // Simulated API call or real FastAPI request
    setTimeout(() => {
      setLoading(false);
      setRequiresOtp(true); // Trigger 6-digit OTP modal matching Stitch design screen 5
    }, 800);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otpCode.join('');
    if (code.length < 6) {
      setError('Kode OTP harus 6 digit');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      login('mock_jwt_token_raihan_agil_maulana');
      navigate('/');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface-container-lowest border border-outline-variant rounded-2xl p-6 sm:p-8 login-card-shadow transition-soft">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-on-background mb-1">Manajemen Portofolio</h1>
          <p className="text-sm text-secondary">
            {requiresOtp
              ? 'Masukkan 6-digit kode OTP yang dikirim ke email Anda.'
              : 'Silakan masuk untuk mengelola portofolio aset Anda secara aman.'}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-error-container text-error text-sm text-center">
            {error}
          </div>
        )}

        {!requiresOtp ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-on-surface mb-1">Username atau Email</label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="raihan@example.com"
                className="w-full h-11 px-4 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring transition-soft"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-semibold text-on-surface">Kata Sandi</label>
                <a href="#" className="text-xs font-semibold text-primary hover:underline">
                  Lupa Kata Sandi?
                </a>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 px-4 pr-10 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring transition-soft"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined text-lg">
                    {showPassword ? 'visibility_off' : 'visibility'}
                  </span>
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <span className="animate-spin material-symbols-outlined text-lg">sync</span>
              ) : (
                'Masuk Ke Dashboard'
              )}
            </button>
          </form>
        ) : (
          /* OTP 6-Digit Verification Modal/Form */
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div className="flex justify-center gap-2">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-${idx}`}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  className="w-11 h-12 text-center text-xl font-bold bg-surface-bright border border-outline-variant rounded-lg input-focus-ring"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-primary text-on-primary font-semibold rounded-lg shadow-sm hover:opacity-90 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <span className="animate-spin material-symbols-outlined text-lg">sync</span>
              ) : (
                'Verifikasi Kode OTP'
              )}
            </button>

            <div className="text-center">
              <button
                type="button"
                onClick={() => setRequiresOtp(false)}
                className="text-xs text-secondary hover:text-primary font-medium"
              >
                ← Kembali ke formulir login
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
