import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { label: 'Beranda', icon: 'home', path: '/' },
    { label: 'Profil', icon: 'person', path: '/profile' },
    { label: 'Proyek', icon: 'folder', path: '/projects' },
    { label: 'Pengalaman', icon: 'work', path: '/experiences' },
    { label: 'Keahlian', icon: 'psychology', path: '/skills' },
    { label: 'Pendidikan', icon: 'school', path: '/education' },
    { label: 'Pesan', icon: 'mail', path: '/messages' },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen flex bg-background text-on-background">
      {/* Desktop Sidebar (md+) */}
      <aside className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 bg-surface-container-lowest border-r border-outline-variant p-4 z-40">
        <div className="mb-6 px-2">
          <h1 className="text-xl font-bold text-primary">Portfolio Manager</h1>
          <p className="text-xs text-secondary font-medium">Enterprise Tier</p>
        </div>

        <nav className="flex-1 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-container text-on-primary shadow-sm'
                    : 'text-secondary hover:bg-surface-container-high hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Footer / Account */}
        <div className="pt-4 border-t border-outline-variant">
          {isAuthenticated ? (
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-error hover:bg-error-container/20 transition-all"
            >
              <span className="material-symbols-outlined">logout</span>
              <span>Keluar</span>
            </button>
          ) : (
            <NavLink
              to="/login"
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-primary hover:bg-primary-fixed/30 transition-all"
            >
              <span className="material-symbols-outlined">login</span>
              <span>Masuk Admin</span>
            </NavLink>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 md:ml-64 pb-20 md:pb-6 min-h-screen flex flex-col">
        {/* Top Header Mobile */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 bg-surface-container-lowest border-b border-outline-variant sticky top-0 z-30">
          <span className="font-bold text-primary text-lg">Portfolio Manager</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-secondary hover:text-on-surface focus:outline-none"
          >
            <span className="material-symbols-outlined">{mobileMenuOpen ? 'close' : 'menu'}</span>
          </button>
        </header>

        {/* Mobile Menu Overlay Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex justify-end">
            <div className="w-64 bg-surface-container-lowest h-full p-4 flex flex-col space-y-2 shadow-2xl">
              <div className="flex justify-between items-center mb-4">
                <span className="font-bold text-primary">Navigasi</span>
                <button onClick={() => setMobileMenuOpen(false)} className="p-1">
                  <span className="material-symbols-outlined">close</span>
                </button>
              </div>
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium ${
                      isActive ? 'bg-primary-container text-on-primary' : 'text-secondary'
                    }`
                  }
                >
                  <span className="material-symbols-outlined">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        {/* Dynamic Page Content */}
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>

        {/* Mobile Bottom Navigation Bar (Mobile First Design) */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant flex justify-around py-2 px-1 z-30 shadow-lg">
          {navItems.slice(0, 5).map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-[10px] font-medium py-1 px-2 rounded-lg transition-colors ${
                  isActive ? 'text-primary' : 'text-secondary hover:text-on-surface'
                }`
              }
            >
              <span className="material-symbols-outlined text-xl">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  );
};
