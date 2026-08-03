import React, { useState } from 'react';
import { mockProjects } from '../data/mockData';
import type { Project } from '../types';

export const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>(mockProjects);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState<Partial<Project>>({
    title: '',
    description: '',
    tech_stack: [],
    demo_url: '',
    repo_url: '',
    is_featured: false,
  });

  const [techInput, setTechInput] = useState('');

  const handleAddTech = () => {
    if (techInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tech_stack: [...(prev.tech_stack || []), techInput.trim()],
      }));
      setTechInput('');
    }
  };

  const handleRemoveTech = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tech_stack: prev.tech_stack?.filter((_, i) => i !== index),
    }));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title) return;

    if (editingId) {
      setProjects((prev) =>
        prev.map((p) => (p.id === editingId ? ({ ...p, ...formData } as Project) : p))
      );
    } else {
      const newProj: Project = {
        id: String(Date.now()),
        title: formData.title || '',
        description: formData.description || '',
        tech_stack: formData.tech_stack || [],
        image_url: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800',
        demo_url: formData.demo_url,
        repo_url: formData.repo_url,
        is_featured: formData.is_featured || false,
      };
      setProjects([newProj, ...projects]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({ title: '', description: '', tech_stack: [], demo_url: '', repo_url: '', is_featured: false });
  };

  const handleDelete = (id: string) => {
    setProjects(projects.filter((p) => p.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-on-background">Manajemen Proyek</h1>
          <p className="text-sm text-secondary">Tambah, edit, dan kelola portofolio karya Anda.</p>
        </div>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ title: '', description: '', tech_stack: [], demo_url: '', repo_url: '', is_featured: false });
          }}
          className="px-4 py-2.5 bg-primary text-on-primary rounded-xl font-semibold text-sm shadow-xs hover:opacity-90 transition-all flex items-center gap-2"
        >
          <span className="material-symbols-outlined text-lg">{showForm ? 'close' : 'add'}</span>
          <span>{showForm ? 'Batal' : 'Tambah Proyek Baru'}</span>
        </button>
      </div>

      {/* Input Form matching Stitch Screen 1 */}
      {showForm && (
        <form onSubmit={handleSave} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-on-background">{editingId ? 'Edit Proyek' : 'Form Input Proyek Baru'}</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">Judul Proyek</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Contoh: IntervU AI App"
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-on-surface mb-1">URL Live Demo</label>
              <input
                type="text"
                value={formData.demo_url}
                onChange={(e) => setFormData({ ...formData, demo_url: e.target.value })}
                placeholder="https://..."
                className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Deskripsi Proyek</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Jelaskan fitur dan peran Anda..."
              className="w-full p-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
            />
          </div>

          {/* Tech Stack Chips Input */}
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Teknologi Digunakan (Tech Stack)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={techInput}
                onChange={(e) => setTechInput(e.target.value)}
                placeholder="Contoh: React, FastAPI"
                className="flex-1 h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
              />
              <button
                type="button"
                onClick={handleAddTech}
                className="px-4 h-10 bg-secondary-container text-on-secondary-container font-semibold rounded-lg text-xs hover:opacity-90"
              >
                Tambah
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tech_stack?.map((tech, idx) => (
                <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-surface-container-high text-xs font-medium rounded-full text-primary">
                  {tech}
                  <button type="button" onClick={() => handleRemoveTech(idx)} className="hover:text-error">
                    <span className="material-symbols-outlined text-xs">close</span>
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="pt-2 flex justify-end gap-3">
            <button
              type="submit"
              className="px-6 py-2.5 bg-primary text-on-primary font-semibold rounded-xl text-sm shadow-xs hover:opacity-90"
            >
              Simpan Proyek
            </button>
          </div>
        </form>
      )}

      {/* Projects Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-xs overflow-hidden flex flex-col justify-between">
            <div>
              <img src={project.image_url} alt={project.title} className="w-full h-44 object-cover" />
              <div className="p-5 space-y-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg text-on-background">{project.title}</h3>
                  {project.is_featured && (
                    <span className="px-2.5 py-0.5 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full">
                      Featured
                    </span>
                  )}
                </div>
                <p className="text-xs text-secondary leading-relaxed">{project.description}</p>
                
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {project.tech_stack.map((t, i) => (
                    <span key={i} className="px-2.5 py-0.5 bg-surface-container-low text-[11px] font-medium text-secondary rounded-md">
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-5 pt-0 flex justify-between items-center border-t border-outline-variant/40 mt-4">
              <div className="flex gap-3">
                {project.demo_url && (
                  <a href={project.demo_url} target="_blank" rel="noreferrer" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">open_in_new</span>
                    <span>Demo</span>
                  </a>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setEditingId(project.id);
                    setFormData(project);
                    setShowForm(true);
                  }}
                  className="p-1.5 text-secondary hover:text-primary"
                >
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => handleDelete(project.id)} className="p-1.5 text-secondary hover:text-error">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
