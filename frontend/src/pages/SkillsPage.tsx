import React, { useState } from 'react';
import { mockSkills } from '../data/mockData';
import type { Skill } from '../types';

export const SkillsPage: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>(mockSkills);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [level, setLevel] = useState(80);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    const newSkill: Skill = {
      id: String(Date.now()),
      name,
      category,
      level,
    };

    setSkills([...skills, newSkill]);
    setName('');
  };

  const categories = Array.from(new Set(skills.map((s) => s.category)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-on-background">Manajemen Keahlian</h1>
        <p className="text-sm text-secondary">Kelola daftar kemampuan teknis dan profisiensi Anda.</p>
      </div>

      {/* Input Skill Form matching Stitch Screen 3 */}
      <form onSubmit={handleAdd} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
        <h3 className="text-base font-bold text-on-background">Tambah Keahlian Baru</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Nama Keahlian</label>
            <input
              type="text"
              required
              placeholder="Contoh: React Native"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Kategori</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-10 px-3 bg-surface-bright border border-outline-variant rounded-lg text-sm input-focus-ring"
            >
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="DevOps & Tools">DevOps & Tools</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-on-surface mb-1">Tingkat Profisiensi ({level}%)</label>
            <input
              type="range"
              min={10}
              max={100}
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
              className="w-full h-10 accent-primary"
            />
          </div>
        </div>

        <button type="submit" className="px-6 py-2 bg-primary text-on-primary font-semibold rounded-xl text-sm hover:opacity-90">
          Simpan Keahlian
        </button>
      </form>

      {/* Categorized Skill List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {categories.map((cat) => (
          <div key={cat} className="bg-surface-container-lowest p-6 rounded-2xl border border-outline-variant shadow-xs space-y-4">
            <h3 className="font-bold text-base text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-lg">code</span>
              <span>{cat}</span>
            </h3>

            <div className="space-y-3">
              {skills
                .filter((s) => s.category === cat)
                .map((skill) => (
                  <div key={skill.id} className="space-y-1">
                    <div className="flex justify-between text-xs font-semibold">
                      <span>{skill.name}</span>
                      <span className="text-secondary">{skill.level}%</span>
                    </div>
                    <div className="w-full h-2 bg-surface-container-high rounded-full overflow-hidden">
                      <div style={{ width: `${skill.level}%` }} className="h-full bg-primary-container rounded-full" />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
