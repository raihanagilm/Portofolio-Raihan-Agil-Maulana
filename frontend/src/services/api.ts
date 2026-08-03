import type { Profile, Project, Experience, Skill, Education, Message } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

// Initial Mock Data (Default Raihan Agil Maulana)
export const initialProfile: Profile = {
  id: 'raihan-agil-maulana',
  full_name: 'Raihan Agil Maulana',
  title: 'Full Stack & Cloud Engineer',
  bio: 'Passionate Software Engineer specializing in building scalable web applications, RESTful APIs with FastAPI & Node.js, modern React interfaces, and cloud database integrations using Supabase & PostgreSQL.',
  phone: '+62 812-3456-7890',
  email: 'raihanagilm@gmail.com',
  location: 'Indonesia',
  website: 'https://portofolio-raihan-agil-maulana.vercel.app',
  github: 'https://github.com/raihanagilm',
  linkedin: 'https://linkedin.com/in/raihan-agil-maulana',
  instagram: 'https://instagram.com/raihanagil',
  twitter: 'https://twitter.com/raihanagil',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
};

export const initialProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Management Portofolio Platform',
    description: 'Sistem manajemen portofolio interaktif berbasis Fullstack (FastAPI & React) lengkap dengan fitur autentikasi JWT, verifikasi OTP 6-digit, manajemen proyek, pengalaman, pendidikan, serta integrasi kirim pesan notifikasi Resend & Supabase.',
    tech_stack: ['FastAPI', 'React', 'TypeScript', 'Tailwind CSS', 'Supabase', 'Resend'],
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
    demo_url: 'https://portofolio-raihan-agil-maulana.vercel.app',
    repo_url: 'https://github.com/raihanagilm/Portofolio-Raihan-Agil-Maulana',
    start_date: '2024-01',
    end_date: '2024-03',
    is_featured: true,
  },
  {
    id: 'proj-2',
    title: 'Enterprise Analytics Dashboard',
    description: 'Dashboard analitik data bisnis real-time untuk memantau performa penjualan, grafik transaksi harian, dan metrik operasional perusahaan dengan animasi interaktif.',
    tech_stack: ['React', 'TypeScript', 'Recharts', 'Tailwind CSS', 'PostgreSQL'],
    image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    demo_url: 'https://example.com/demo-analytics',
    repo_url: 'https://github.com/raihanagilm/analytics-dashboard',
    start_date: '2023-08',
    end_date: '2023-11',
    is_featured: true,
  },
  {
    id: 'proj-3',
    title: 'Smart E-Commerce Mobile Web App',
    description: 'Aplikasi web toko online pintar dengan keranjang belanja, checkout transaksi otomatis, integrasi payment gateway, dan manajemen inventaris produk.',
    tech_stack: ['Next.js', 'Tailwind CSS', 'Stripe', 'Node.js', 'MongoDB'],
    image_url: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=800&q=80',
    demo_url: 'https://example.com/demo-ecommerce',
    repo_url: 'https://github.com/raihanagilm/smart-ecommerce',
    start_date: '2023-03',
    end_date: '2023-07',
    is_featured: false,
  },
];

export const initialExperiences: Experience[] = [
  {
    id: 'exp-1',
    company: 'Tech Innovators Indonesia',
    position: 'Senior Fullstack Developer',
    description: 'Memimpin tim pengembang dalam membangun arsitektur microservices berbasis Python FastAPI dan frontend SPA dengan React & TypeScript.',
    start_date: '2023-01',
    end_date: 'Present',
    is_current: true,
    location: 'Jakarta, Indonesia',
    company_logo_url: 'https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=120&q=80',
  },
  {
    id: 'exp-2',
    company: 'Digital Creative Studio',
    position: 'Frontend Web Developer',
    description: 'Mengembangkan antarmuka pengguna responsif dan interaktif menggunakan React, Redux Toolkit, dan Tailwind CSS untuk berbagai klien perusahaan.',
    start_date: '2021-06',
    end_date: '2022-12',
    is_current: false,
    location: 'Bandung, Indonesia',
    company_logo_url: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=120&q=80',
  },
];

export const initialSkills: Skill[] = [
  { id: 'sk-1', name: 'React.js / Next.js', category: 'Frontend', level: 92 },
  { id: 'sk-2', name: 'TypeScript', category: 'Frontend', level: 90 },
  { id: 'sk-3', name: 'Tailwind CSS', category: 'Frontend', level: 95 },
  { id: 'sk-4', name: 'Python / FastAPI', category: 'Backend', level: 88 },
  { id: 'sk-5', name: 'Node.js / Express', category: 'Backend', level: 85 },
  { id: 'sk-6', name: 'PostgreSQL & Supabase', category: 'Database', level: 87 },
  { id: 'sk-7', name: 'Docker & CI/CD', category: 'Tools', level: 80 },
  { id: 'sk-8', name: 'Git & GitHub Workflow', category: 'Tools', level: 92 },
];

export const initialEducation: Education[] = [
  {
    id: 'edu-1',
    institution: 'Universitas Informatika Indonesia',
    degree: 'Sarjana Komputer (S.Kom)',
    field_of_study: 'Teknik Informatika / Ilmu Komputer',
    start_date: '2019',
    end_date: '2023',
    is_current: false,
    gpa: '3.85 / 4.00',
    description: 'Lulus dengan predikat Cumlaude. Aktif dalam organisasi mahasiswa pemrograman dan riset AI/Web Technology.',
    logo_url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=120&q=80',
  },
];

export const initialMessages: Message[] = [
  {
    id: 'msg-1',
    sender_name: 'Budi Pratama',
    sender_email: 'budi@example.com',
    subject: 'Penawaran Kerjasama Proyek Web App',
    message: 'Halo Raihan, kami sangat tertarik dengan portofolio Anda dan bermaksud menawarkan proyek pengembangan web portal untuk perusahaan kami.',
    is_read: false,
    created_at: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
];

// Helper Fetch API dengan Fallback ke Local Storage / Mock
const fetchWithFallback = async <T>(endpoint: string, fallbackData: T): Promise<T> => {
  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn(`Gagal terhubung ke API backend (${endpoint}), menggunakan fallback local data.`, err);
  }
  return fallbackData;
};

export const apiService = {
  // Profile
  getProfile: async (): Promise<Profile> => {
    return fetchWithFallback<Profile>('/profile', initialProfile);
  },

  // Projects
  getProjects: async (): Promise<Project[]> => {
    return fetchWithFallback<Project[]>('/projects', initialProjects);
  },

  // Experiences
  getExperiences: async (): Promise<Experience[]> => {
    return fetchWithFallback<Experience[]>('/experiences', initialExperiences);
  },

  // Skills
  getSkills: async (): Promise<Skill[]> => {
    return fetchWithFallback<Skill[]>('/skills', initialSkills);
  },

  // Education
  getEducation: async (): Promise<Education[]> => {
    return fetchWithFallback<Education[]>('/education', initialEducation);
  },

  // Send Message
  sendMessage: async (payload: { sender_name: string; sender_email: string; subject: string; message: string }) => {
    try {
      const res = await fetch(`${API_BASE_URL}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('Backend API offline, menyimpan pesan di lokal.', e);
    }
    return { id: `msg-${Date.now()}`, ...payload, is_read: false, created_at: new Date().toISOString() };
  },
};
