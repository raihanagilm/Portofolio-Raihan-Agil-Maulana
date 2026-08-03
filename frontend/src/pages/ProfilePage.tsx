import React, { useState } from 'react';
import { mockProfile } from '../data/mockData';
import type { Profile } from '../types';

export const ProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<Profile>(mockProfile);
  const [editing, setEditing] = useState(false);
  const [message, setMessage] = useState('');

  const [visibility, setVisibility] = useState({
    email: true,
    phone: true,
    location: true,
    github: true,
    linkedin: true,
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(false);
    setMessage('Profil berhasil diperbarui!');
    setTimeout(() => setMessage(''), 3000);
  };

  const toggleVisibility = (key: keyof typeof visibility) => {
    setVisibility((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Manajemen Profil</h1>
          <p className="text-sm text-secondary">Kelola informasi pribadi dan kontol visibilitas publik Anda.</p>
        </div>
        <button
          onClick={() => setEditing(!editing)}
          className="px-4 py-2 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-xs hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{editing ? 'close' : 'edit'}</span>
          <span>{editing ? 'Batal' : 'Edit Profil'}</span>
        </button>
      </div>

      {message && (
        <div className="p-3 bg-emerald-50 text-emerald-700 text-sm rounded-xl border border-emerald-200">
          {message}
        </div>
      )}

      {/* Main Profile Card */}
      <div className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              src={profile.avatar_url}
              alt={profile.full_name}
              className="w-28 h-28 rounded-full object-cover border-4 border-primary-fixed"
            />
            {editing && (
              <label className="absolute bottom-0 right-0 p-2 bg-primary text-on-primary rounded-full cursor-pointer shadow-md hover:scale-105 transition-all">
                <span className="material-symbols-outlined text-sm">photo_camera</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            )}
          </div>

          <div className="text-center sm:text-left space-y-1">
            <h2 className="text-xl font-bold text-on-background">{profile.full_name}</h2>
            <p className="text-sm font-semibold text-primary">{profile.title}</p>
            <p className="text-xs text-secondary max-w-xl leading-relaxed">{profile.bio}</p>
          </div>
        </div>

        {/* Profile Details or Edit Form */}
        {!editing ? (
          <div className="space-y-6 pt-4 border-t border-outline-variant">
            <h3 className="text-sm font-bold text-on-background uppercase tracking-wider">Kontak & Media Sosial</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">mail</span>
                  <span>{profile.email}</span>
                </div>
                <button onClick={() => toggleVisibility('email')} className="text-xs text-secondary hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    {visibility.email ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">call</span>
                  <span>{profile.phone}</span>
                </div>
                <button onClick={() => toggleVisibility('phone')} className="text-xs text-secondary hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    {visibility.phone ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">location_on</span>
                  <span>{profile.location}</span>
                </div>
                <button onClick={() => toggleVisibility('location')} className="text-xs text-secondary hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    {visibility.location ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-container-low border border-outline-variant/60">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-secondary">code</span>
                  <a href={profile.github} target="_blank" rel="noreferrer" className="text-primary hover:underline truncate">
                    {profile.github}
                  </a>
                </div>
                <button onClick={() => toggleVisibility('github')} className="text-xs text-secondary hover:text-primary">
                  <span className="material-symbols-outlined text-base">
                    {visibility.github ? 'visibility' : 'visibility_off'}
                  </span>
                </button>
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4 pt-4 border-t border-outline-variant">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  value={profile.full_name}
                  onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-on-surface mb-1">Gelar / Posisi</label>
                <input
                  type="text"
                  value={profile.title}
                  onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                  className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Bio Singkat</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                className="w-full p-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl text-sm shadow-xs hover:opacity-90 transition-all"
            >
              Simpan Perubahan
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
