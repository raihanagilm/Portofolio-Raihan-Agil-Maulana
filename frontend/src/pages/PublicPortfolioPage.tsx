import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import type { Profile, Project, Experience, Skill, Education } from '../types';
import { apiService } from '../services/api';

const TYPING_TITLES = [
  'Full Stack Developer',
  'FastAPI & Python Engineer',
  'React & TypeScript Specialist',
  'Cloud & Supabase Architect',
];

/* ─── Small reusable atoms ──────────────────────────────── */
const SectionTag = ({ label }: { label: string }) => (
  <span className="section-tag">{label}</span>
);

const SocialLink = ({
  href,
  icon,
  label,
}: {
  href: string;
  icon: string;
  label: string;
}) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="flex items-center gap-2 text-sm font-medium text-muted hover:text-blue-600 transition-colors"
  >
    <span className="material-symbols-outlined text-base">{icon}</span>
    {label}
  </a>
);

/* ─── Main Component ────────────────────────────────────── */
export const PublicPortfolioPage: React.FC = () => {
  /* --- Data state --- */
  const [profile, setProfile]       = useState<Profile | null>(null);
  const [projects, setProjects]     = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [skills, setSkills]         = useState<Skill[]>([]);
  const [education, setEducation]   = useState<Education[]>([]);
  const [loading, setLoading]       = useState(true);

  /* --- UI state --- */
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [activeTech, setActiveTech]           = useState('Semua');
  const [activeCat, setActiveCat]             = useState('Semua');

  /* --- Typewriter --- */
  const [titleIdx, setTitleIdx]   = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting]   = useState(false);

  /* --- Contact form --- */
  const [form, setForm] = useState({
    name: '', email: '', subject: '', message: '',
  });
  const [submitting, setSubmitting]   = useState(false);
  const [successMsg, setSuccessMsg]   = useState('');
  const [errorMsg, setErrorMsg]       = useState('');

  /* --- Mobile nav --- */
  const [navOpen, setNavOpen] = useState(false);

  /* --- Skill progress bar animation --- */
  const skillsRef = useRef<HTMLDivElement>(null);
  const [skillsVisible, setSkillsVisible] = useState(false);

  /* ── Fetch data ── */
  useEffect(() => {
    (async () => {
      setLoading(true);
      const [p, pr, ex, sk, ed] = await Promise.all([
        apiService.getProfile(),
        apiService.getProjects(),
        apiService.getExperiences(),
        apiService.getSkills(),
        apiService.getEducation(),
      ]);
      setProfile(p); setProjects(pr); setExperiences(ex);
      setSkills(sk); setEducation(ed);
      setLoading(false);
    })();
  }, []);

  /* ── Typewriter ── */
  useEffect(() => {
    const full = TYPING_TITLES[titleIdx];
    let t: ReturnType<typeof setTimeout>;
    if (!deleting) {
      if (displayed.length < full.length) {
        t = setTimeout(() => setDisplayed(full.slice(0, displayed.length + 1)), 75);
      } else {
        t = setTimeout(() => setDeleting(true), 2200);
      }
    } else {
      if (displayed.length > 0) {
        t = setTimeout(() => setDisplayed(full.slice(0, displayed.length - 1)), 38);
      } else {
        setDeleting(false);
        setTitleIdx(i => (i + 1) % TYPING_TITLES.length);
      }
    }
    return () => clearTimeout(t);
  }, [displayed, deleting, titleIdx]);

  /* ── Skills visibility observer ── */
  useEffect(() => {
    if (!skillsRef.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setSkillsVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(skillsRef.current);
    return () => obs.disconnect();
  }, []);

  /* ── Helpers ── */
  const techOptions = ['Semua', ...Array.from(new Set(projects.flatMap(p => p.tech_stack ?? [])))];
  const catOptions  = ['Semua', ...Array.from(new Set(skills.map(s => s.category)))];

  const filteredProjects = activeTech === 'Semua'
    ? projects
    : projects.filter(p => p.tech_stack?.includes(activeTech));

  const filteredSkills = activeCat === 'Semua'
    ? skills
    : skills.filter(s => s.category === activeCat);

  /* ── Contact submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      setErrorMsg('Isi nama, email, dan pesan terlebih dahulu.');
      return;
    }
    setSubmitting(true); setErrorMsg(''); setSuccessMsg('');
    try {
      await apiService.sendMessage({
        sender_name: form.name, sender_email: form.email,
        subject: form.subject || 'Pesan dari Portofolio', message: form.message,
      });
      setSuccessMsg('Pesan berhasil dikirim! Raihan akan segera menghubungi Anda.');
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch {
      setErrorMsg('Gagal mengirim pesan, coba lagi.');
    } finally {
      setSubmitting(false);
    }
  };

  /* ─── Loading screen ─── */
  if (loading) return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-sm text-muted font-medium">Memuat portofolio…</p>
      </div>
    </div>
  );

  /* ─── NAV LINKS ─── */
  const navLinks = [
    { href: '#tentang', label: 'Tentang' },
    { href: '#proyek', label: 'Proyek' },
    { href: '#keahlian', label: 'Keahlian' },
    { href: '#pengalaman', label: 'Pengalaman' },
    { href: '#pendidikan', label: 'Pendidikan' },
    { href: '#kontak', label: 'Kontak' },
  ];

  return (
    <div className="min-h-screen bg-bg text-text">

      {/* ═══════════════════════════ NAVBAR ═══════════════════════════════ */}
      <header className="sticky top-0 z-50 bg-surface border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">

          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <div className="avatar-ring">
              <div className="w-8 h-8 bg-surface rounded-full flex items-center justify-center font-bold text-blue-600 text-sm">
                R
              </div>
            </div>
            <span className="font-bold text-base text-text">Raihan Agil M.</span>
          </a>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="nav-link">{l.label}</a>
            ))}
          </nav>

          {/* CTA + admin */}
          <div className="flex items-center gap-2">
            <a href="#kontak" className="hidden sm:flex btn-primary text-xs py-2 px-4">
              <span className="material-symbols-outlined text-sm">mail</span> Kontak
            </a>
            <Link
              to="/login"
              title="Admin"
              className="w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted hover:text-blue-600 hover:border-blue-300 transition-colors"
            >
              <span className="material-symbols-outlined text-lg">lock</span>
            </Link>
            {/* Hamburger */}
            <button
              onClick={() => setNavOpen(o => !o)}
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg border border-border text-muted"
            >
              <span className="material-symbols-outlined text-xl">{navOpen ? 'close' : 'menu'}</span>
            </button>
          </div>
        </div>

        {/* Mobile nav drawer */}
        {navOpen && (
          <div className="md:hidden border-t border-border bg-surface px-4 py-4 space-y-1">
            {navLinks.map(l => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setNavOpen(false)}
                className="block py-2.5 px-3 rounded-lg text-sm font-medium text-muted hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                {l.label}
              </a>
            ))}
            <a href="#kontak" onClick={() => setNavOpen(false)}
              className="block mt-2 btn-primary text-center text-xs justify-center">
              Kirim Pesan
            </a>
          </div>
        )}
      </header>

      {/* ══════════════════════════ HERO ══════════════════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 pt-14 pb-16">
        <div className="flex flex-col-reverse md:flex-row md:items-center gap-10">

          {/* Text */}
          <div className="flex-1 space-y-5">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-semibold text-green-700 font-mono">
                Tersedia untuk proyek baru
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold leading-tight">
              Halo, saya<br />
              <span className="text-grad">
                {profile?.full_name ?? 'Raihan Agil Maulana'}
              </span>
            </h1>

            {/* Typewriter */}
            <div className="h-8 flex items-center">
              <span className="font-mono text-base sm:text-lg font-semibold text-blue-600">
                {displayed}
                <span className="animate-blink ml-0.5 text-green-500">|</span>
              </span>
            </div>

            <p className="text-sm sm:text-base text-muted leading-relaxed max-w-lg">
              {profile?.bio ?? 'Software engineer berpengalaman dalam membangun aplikasi web modern yang skalabel, cepat, dan elegan.'}
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-3 pt-2">
              <a href="#proyek" className="btn-primary">
                <span className="material-symbols-outlined text-base">work</span>
                Lihat Proyek
              </a>
              {profile?.github && (
                <a href={profile.github} target="_blank" rel="noreferrer" className="btn-secondary">
                  <span className="material-symbols-outlined text-base">code</span>
                  GitHub
                </a>
              )}
            </div>

            {/* Quick contacts */}
            <div className="flex flex-wrap gap-4 pt-2">
              {profile?.linkedin && <SocialLink href={profile.linkedin} icon="link" label="LinkedIn" />}
              {profile?.email    && <SocialLink href={`mailto:${profile.email}`} icon="mail" label={profile.email} />}
              {profile?.location && (
                <span className="flex items-center gap-1 text-sm text-muted">
                  <span className="material-symbols-outlined text-base">location_on</span>
                  {profile.location}
                </span>
              )}
            </div>
          </div>

          {/* Avatar */}
          <div className="flex justify-center md:justify-end">
            <div className="avatar-ring w-fit" style={{padding: '3px'}}>
              <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-surface">
                <img
                  src={profile?.avatar_url ?? 'https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=400&q=80'}
                  alt={profile?.full_name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ STATS ═══════════════════════════════════ */}
      <section id="tentang" className="border-y border-border bg-surface">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: String(projects.length), label: 'Proyek', color: 'text-blue-600' },
              { value: String(experiences.length), label: 'Pengalaman', color: 'text-green-600' },
              { value: String(skills.length), label: 'Keahlian', color: 'text-blue-600' },
              { value: String(education.length), label: 'Pendidikan', color: 'text-green-600' },
            ].map((s) => (
              <div key={s.label} className="stat-card py-4 px-3">
                <p className={`text-2xl font-extrabold ${s.color}`}>{s.value}</p>
                <p className="text-[11px] text-muted mt-1 font-medium">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════ PROJECTS ════════════════════════════════ */}
      <section id="proyek" className="max-w-5xl mx-auto px-4 py-16 space-y-10">
        <div className="space-y-2">
          <SectionTag label="Portofolio Proyek" />
          <h2 className="text-2xl sm:text-3xl font-extrabold">Proyek Unggulan</h2>
          <p className="text-sm text-muted max-w-lg">
            Aplikasi dan sistem yang dibangun dengan pendekatan clean code, performa tinggi, dan UX terbaik.
          </p>
        </div>

        {/* Tech filter */}
        <div className="flex flex-wrap gap-2">
          {techOptions.map(t => (
            <button
              key={t}
              onClick={() => setActiveTech(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                activeTech === t
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-surface text-muted border-border hover:border-blue-400 hover:text-blue-600'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map(project => (
            <article
              key={project.id}
              onClick={() => setSelectedProject(project)}
              className="card overflow-hidden cursor-pointer group flex flex-col"
            >
              {/* Thumbnail */}
              <div className="relative h-32 bg-blue-50 overflow-hidden">
                <img
                  src={project.image_url || 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80'}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {project.is_featured && (
                  <span className="absolute top-3 left-3 tag-green text-[10px] px-2 py-0.5 rounded-md font-bold">
                    ⭐ Featured
                  </span>
                )}
              </div>

              {/* Body */}
              <div className="p-5 flex-1 flex flex-col gap-3">
                <h3 className="font-bold text-base leading-snug group-hover:text-blue-600 transition-colors">
                  {project.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed line-clamp-2 flex-1">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {project.tech_stack?.slice(0, 4).map((t, i) => (
                    <span key={i} className="tag">{t}</span>
                  ))}
                  {(project.tech_stack?.length ?? 0) > 4 && (
                    <span className="tag">+{(project.tech_stack?.length ?? 0) - 4}</span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-border">
                  <span className="text-xs font-semibold text-blue-600">Lihat Detail</span>
                  <span className="material-symbols-outlined text-sm text-blue-500 group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ════════════════════════ SKILLS ══════════════════════════════════ */}
      <section id="keahlian" className="bg-surface border-y border-border">
        <div className="max-w-5xl mx-auto px-4 py-16 space-y-10" ref={skillsRef}>
          <div className="space-y-2">
            <SectionTag label="Keahlian & Teknologi" />
            <h2 className="text-2xl sm:text-3xl font-extrabold">Tech Stack</h2>
            <p className="text-sm text-muted max-w-lg">
              Penguasaan teknologi yang mendukung kualitas dan efisiensi pengembangan perangkat lunak.
            </p>
          </div>

          {/* Category filter */}
          <div className="flex flex-wrap gap-2">
            {catOptions.map(c => (
              <button
                key={c}
                onClick={() => setActiveCat(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold font-mono transition-all border ${
                  activeCat === c
                    ? 'bg-green-500 text-white border-green-500'
                    : 'bg-bg text-muted border-border hover:border-green-400 hover:text-green-700'
                }`}
              >
                {c}
              </button>
            ))}
          </div>

          {/* Skill list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {filteredSkills.map(skill => (
              <div key={skill.id} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-semibold">{skill.name}</span>
                  <span className="font-mono text-xs text-muted">{skill.level}%</span>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: skillsVisible ? `${skill.level}%` : '0%' }}
                  />
                </div>
                <p className="text-[11px] font-mono text-muted">{skill.category}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════ EXPERIENCE + EDUCATION ══════════════════════ */}
      <section className="max-w-5xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

          {/* Experience */}
          <div id="pengalaman" className="space-y-8">
            <div className="space-y-2">
              <SectionTag label="Karir" />
              <h2 className="text-2xl font-extrabold">Pengalaman Kerja</h2>
            </div>

            <div className="relative pl-6">
              <div className="timeline-line" />
              <div className="space-y-6">
                {experiences.map(exp => (
                  <div key={exp.id} className="relative">
                    <div className="timeline-dot" />
                    <div className="card p-5 space-y-2">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <h3 className="font-bold text-sm leading-snug">{exp.position}</h3>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded-md font-bold ${
                          exp.is_current
                            ? 'bg-green-100 text-green-700'
                            : 'bg-blue-50 text-blue-700'
                        }`}>
                          {exp.is_current ? '● Present' : exp.end_date}
                        </span>
                      </div>
                      <p className="text-xs font-semibold text-blue-600">
                        {exp.company}{exp.location ? ` · ${exp.location}` : ''}
                      </p>
                      <p className="text-xs text-muted leading-relaxed">{exp.description}</p>
                      <p className="text-[10px] font-mono text-muted">{exp.start_date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Education */}
          <div id="pendidikan" className="space-y-8">
            <div className="space-y-2">
              <SectionTag label="Akademik" />
              <h2 className="text-2xl font-extrabold">Pendidikan</h2>
            </div>

            <div className="space-y-4">
              {education.map(edu => (
                <div key={edu.id} className="card p-5 space-y-2">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <h3 className="font-bold text-sm leading-snug">{edu.institution}</h3>
                    <span className="text-[10px] font-mono bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md">
                      {edu.start_date} – {edu.is_current ? 'Sekarang' : edu.end_date}
                    </span>
                  </div>
                  <p className="text-xs font-semibold text-green-700">
                    {edu.degree}{edu.field_of_study ? ` · ${edu.field_of_study}` : ''}
                  </p>
                  {edu.description && (
                    <p className="text-xs text-muted leading-relaxed">{edu.description}</p>
                  )}
                  {edu.gpa && (
                    <div className="flex items-center gap-2 pt-1 border-t border-border">
                      <span className="text-[11px] text-muted">IPK / GPA</span>
                      <span className="font-mono text-xs font-bold text-green-700">{edu.gpa}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════ CONTACT ═════════════════════════════════ */}
      <section id="kontak" className="bg-surface border-t border-border">
        <div className="max-w-2xl mx-auto px-4 py-16 space-y-8">
          <div className="text-center space-y-2">
            <SectionTag label="Hubungi Saya" />
            <h2 className="text-2xl sm:text-3xl font-extrabold">Mari Berkolaborasi</h2>
            <p className="text-sm text-muted max-w-md mx-auto">
              Punya proyek menarik atau ingin berdiskusi? Kirimkan pesan dan saya akan membalasnya secepatnya.
            </p>
          </div>

          {/* Info bar */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {profile?.email && (
              <a
                href={`mailto:${profile.email}`}
                className="flex items-center gap-3 p-4 rounded-card border border-border hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-blue-600 text-base">mail</span>
                </div>
                <div>
                  <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Email</p>
                  <p className="text-xs font-semibold truncate">{profile.email}</p>
                </div>
              </a>
            )}
            {profile?.location && (
              <div className="flex items-center gap-3 p-4 rounded-card border border-border">
                <div className="w-9 h-9 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="material-symbols-outlined text-green-600 text-base">location_on</span>
                </div>
                <div>
                  <p className="text-[10px] text-muted font-semibold uppercase tracking-wide">Lokasi</p>
                  <p className="text-xs font-semibold">{profile.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Form */}
          {successMsg && (
            <div className="p-4 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm font-medium">
              ✅ {successMsg}
            </div>
          )}
          {errorMsg && (
            <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm font-medium">
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text">Nama Lengkap *</label>
                <input
                  className="input-field"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-text">Alamat Email *</label>
                <input
                  type="email"
                  className="input-field"
                  placeholder="john@example.com"
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Subjek</label>
              <input
                className="input-field"
                placeholder="Diskusi Proyek Web / Penawaran Kerjasama"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-text">Pesan *</label>
              <textarea
                className="input-field resize-none"
                rows={5}
                placeholder="Ceritakan proyek atau kebutuhan Anda…"
                value={form.message}
                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="btn-primary w-full justify-center py-3.5 text-sm"
            >
              {submitting
                ? <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <><span className="material-symbols-outlined text-base">send</span> Kirim Pesan</>
              }
            </button>
          </form>
        </div>
      </section>

      {/* ════════════════════════ FOOTER ══════════════════════════════════ */}
      <footer className="border-t border-border bg-bg">
        <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted">
          <span>© {new Date().getFullYear()} Raihan Agil Maulana. All rights reserved.</span>
          <div className="flex items-center gap-4">
            {profile?.github   && <a href={profile.github}   target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">GitHub</a>}
            {profile?.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">LinkedIn</a>}
            {profile?.instagram && <a href={profile.instagram} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">Instagram</a>}
          </div>
        </div>
      </footer>

      {/* ════════════════════════ PROJECT MODAL ═══════════════════════════ */}
      {selectedProject && (
        <div className="modal-overlay" onClick={() => setSelectedProject(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            {/* Image */}
            <div className="h-40 sm:h-48 bg-blue-50 overflow-hidden rounded-t-[18px]">
              <img
                src={selectedProject.image_url || ''}
                alt={selectedProject.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="p-6 space-y-5">
              {/* Header */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="font-extrabold text-xl leading-snug">{selectedProject.title}</h3>
                  {selectedProject.start_date && (
                    <p className="text-xs font-mono text-muted mt-1">
                      {selectedProject.start_date} – {selectedProject.end_date || 'Sekarang'}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setSelectedProject(null)}
                  className="flex-shrink-0 w-8 h-8 rounded-full border border-border flex items-center justify-center text-muted hover:text-text hover:bg-bg transition-colors text-sm"
                >
                  ✕
                </button>
              </div>

              <p className="text-sm text-muted leading-relaxed">{selectedProject.description}</p>

              {/* Tech stack */}
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted mb-2">Tech Stack</p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedProject.tech_stack?.map((t, i) => (
                    <span key={i} className="tag">{t}</span>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-3 pt-2 border-t border-border">
                {selectedProject.demo_url && (
                  <a href={selectedProject.demo_url} target="_blank" rel="noreferrer" className="btn-primary text-xs py-2.5 px-5">
                    <span className="material-symbols-outlined text-sm">open_in_new</span> Live Demo
                  </a>
                )}
                {selectedProject.repo_url && (
                  <a href={selectedProject.repo_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2.5 px-5">
                    <span className="material-symbols-outlined text-sm">code</span> Source Code
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
