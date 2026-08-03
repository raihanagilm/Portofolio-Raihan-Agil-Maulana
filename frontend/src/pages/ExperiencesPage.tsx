import React, { useState } from 'react';
import { mockExperiences } from '../data/mockData';
import type { Experience } from '../types';

export const ExperiencesPage: React.FC = () => {
  const [experiences, setExperiences] = useState<Experience[]>(mockExperiences);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Experience>>({
    company: '',
    position: '',
    description: '',
    start_date: '',
    end_date: '',
    is_current: false,
    location: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.company || !formData.position) return;

    const newExp: Experience = {
      id: String(Date.now()),
      company: formData.company,
      position: formData.position,
      description: formData.description || '',
      start_date: formData.start_date || '2024',
      end_date: formData.is_current ? 'Sekarang' : formData.end_date || '2024',
      is_current: formData.is_current || false,
      location: formData.location,
    };

    setExperiences([newExp, ...experiences]);
    setShowForm(false);
    setFormData({ company: '', position: '', description: '', start_date: '', end_date: '', is_current: false, location: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Manajemen Pengalaman</h1>
          <p className="text-sm text-secondary">Kelola riwayat karir dan pengalaman profesional Anda.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-xs hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
          <span>{showForm ? 'Batal' : 'Tambah Pengalaman'}</span>
        </button>
      </div>

      {/* Input Form matching Stitch Screen 2 */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-on-background">Form Input Pengalaman Kerja</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Perusahaan / Organisasi</label>
              <input
                type="text"
                required
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Posisi / Jabatan</label>
              <input
                type="text"
                required
                value={formData.position}
                onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Tanggal Mulai</label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                placeholder="Januari 2023"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Tanggal Selesai</label>
              <input
                type="text"
                disabled={formData.is_current}
                value={formData.is_current ? 'Sekarang' : formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                placeholder="Desember 2024"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Deskripsi Peran & Pencapaian</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full p-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl text-sm shadow-xs hover:opacity-90"
          >
            Simpan Pengalaman
          </button>
        </form>
      )}

      {/* Experience Timeline / Cards List */}
      <div className="space-y-4">
        {experiences.map((exp) => (
          <div key={exp.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex flex-col sm:flex-row justify-between items-start gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">work</span>
                <h3 className="font-bold text-lg text-on-background">{exp.position}</h3>
                {exp.is_current && (
                  <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-bold rounded-full">
                    Aktif
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-primary">{exp.company}</p>
              <p className="text-xs text-secondary">{exp.start_date} — {exp.end_date}</p>
              <p className="text-xs text-on-surface leading-relaxed max-w-2xl">{exp.description}</p>
            </div>

            <button
              onClick={() => setExperiences(experiences.filter((e) => e.id !== exp.id))}
              className="p-2 text-secondary hover:text-error rounded-lg"
            >
              <span className="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
