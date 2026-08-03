import React, { useState } from 'react';
import { mockEducation } from '../data/mockData';
import type { Education } from '../types';

export const EducationPage: React.FC = () => {
  const [educationList, setEducationList] = useState<Education[]>(mockEducation);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState<Partial<Education>>({
    institution: '',
    degree: '',
    field_of_study: '',
    start_date: '',
    end_date: '',
    gpa: '',
    description: '',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.institution) return;

    const newEdu: Education = {
      id: String(Date.now()),
      institution: formData.institution,
      degree: formData.degree || '',
      field_of_study: formData.field_of_study || '',
      start_date: formData.start_date || '2020',
      end_date: formData.end_date || '2024',
      is_current: false,
      gpa: formData.gpa,
      description: formData.description,
    };

    setEducationList([newEdu, ...educationList]);
    setShowForm(false);
    setFormData({ institution: '', degree: '', field_of_study: '', start_date: '', end_date: '', gpa: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Manajemen Pendidikan</h1>
          <p className="text-sm text-secondary">Kelola riwayat pendidikan formal dan sertifikasi Anda.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-xs hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
          <span>{showForm ? 'Batal' : 'Tambah Pendidikan'}</span>
        </button>
      </div>

      {/* Input Form matching Stitch Screen 4 */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-on-background">Form Input Pendidikan</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Institusi / Universitas</label>
              <input
                type="text"
                required
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Gelar / Degree</label>
              <input
                type="text"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder="Sarjana Komputer (S.Kom)"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Jurusan</label>
              <input
                type="text"
                value={formData.field_of_study}
                onChange={(e) => setFormData({ ...formData, field_of_study: e.target.value })}
                placeholder="Teknik Informatika"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Tahun Mulai - Selesai</label>
              <input
                type="text"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                placeholder="2020 - 2024"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">IPK / GPA</label>
              <input
                type="text"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: e.target.value })}
                placeholder="3.85 / 4.00"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl text-sm shadow-xs hover:opacity-90"
          >
            Simpan Pendidikan
          </button>
        </form>
      )}

      {/* Education Cards List */}
      <div className="space-y-4">
        {educationList.map((edu) => (
          <div key={edu.id} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs flex justify-between items-start">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">school</span>
                <h3 className="font-bold text-lg text-on-background">{edu.institution}</h3>
              </div>
              <p className="text-sm font-semibold text-primary">
                {edu.degree} — {edu.field_of_study}
              </p>
              <div className="flex gap-4 text-xs text-secondary">
                <span>Periode: {edu.start_date} - {edu.end_date}</span>
                {edu.gpa && <span>IPK: {edu.gpa}</span>}
              </div>
              {edu.description && <p className="text-xs text-on-surface leading-relaxed max-w-2xl">{edu.description}</p>}
            </div>

            <button
              onClick={() => setEducationList(educationList.filter((e) => e.id !== edu.id))}
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
