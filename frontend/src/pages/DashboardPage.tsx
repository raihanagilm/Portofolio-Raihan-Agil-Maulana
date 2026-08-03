import React from 'react';
import { mockProjects, mockSkills, mockExperiences, mockMessages } from '../data/mockData';

export const DashboardPage: React.FC = () => {
  const unreadMessagesCount = mockMessages.filter((m) => !m.is_read).length;

  const stats = [
    { title: 'Total Proyek', count: mockProjects.length, icon: 'folder', color: 'bg-blue-50 text-blue-600' },
    { title: 'Pengalaman', count: mockExperiences.length, icon: 'work', color: 'bg-indigo-50 text-indigo-600' },
    { title: 'Keahlian Utama', count: mockSkills.length, icon: 'psychology', color: 'bg-emerald-50 text-emerald-600' },
    { title: 'Pesan Baru', count: unreadMessagesCount, icon: 'mail', color: 'bg-amber-50 text-amber-600' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-background">Ringkasan Portofolio</h1>
        <p className="text-sm text-secondary">Selamat datang kembali, Raihan Agil Maulana.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-surface-container-lowest p-4 rounded-xl border border-outline-variant shadow-xs flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>
              <span className="material-symbols-outlined text-2xl">{stat.icon}</span>
            </div>
            <div>
              <p className="text-xs font-medium text-secondary">{stat.title}</p>
              <h3 className="text-xl font-bold text-on-background">{stat.count}</h3>
            </div>
          </div>
        ))}
      </div>

      {/* Main Grid Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Chart Activity Bar (Stitch Desktop Nav matched) */}
        <div className="lg:col-span-2 bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-on-background">Aktivitas Portofolio</h2>
            <span className="text-xs font-semibold text-primary bg-primary-fixed/40 px-3 py-1 rounded-full">Bulan Ini</span>
          </div>
          <p className="text-xs text-secondary">Statistik interaksi pengunjung & perkembangan aset portofolio.</p>

          <div className="h-48 flex items-end justify-between gap-3 pt-6 px-2">
            {[40, 65, 30, 85, 95, 60, 75].map((height, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                <div
                  style={{ height: `${height}%` }}
                  className="w-full bg-primary-container rounded-t-md transition-all duration-500 hover:opacity-80"
                />
                <span className="text-[10px] text-secondary font-medium">Hari {idx + 1}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Unread Messages Quick Access */}
        <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-xs space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-on-background">Pesan Terbaru</h2>
            <span className="text-xs font-bold text-amber-600 bg-amber-50 px-2.5 py-0.5 rounded-full">
              {unreadMessagesCount} Belum Dibaca
            </span>
          </div>

          <div className="space-y-3">
            {mockMessages.map((msg) => (
              <div key={msg.id} className="p-3 rounded-lg bg-surface-container-low border border-outline-variant/60 hover:border-primary/50 transition-all">
                <div className="flex justify-between items-start mb-1">
                  <span className="text-xs font-bold text-on-background">{msg.sender_name}</span>
                  <span className="text-[10px] text-secondary">{new Date(msg.created_at).toLocaleDateString('id-ID')}</span>
                </div>
                <p className="text-xs font-medium text-primary line-clamp-1">{msg.subject}</p>
                <p className="text-xs text-secondary line-clamp-1 mt-0.5">{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
