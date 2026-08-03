import type { Profile, Project, Experience, Skill, Education, Message } from '../types';

export const mockProfile: Profile = {
  id: 'raihan-agil-maulana',
  full_name: 'Raihan Agil Maulana',
  title: 'Full-Stack Developer & Software Engineer',
  bio: 'Pengembang perangkat lunak berpengalaman membangun sistem web modern, responsif, dan scalable dengan React, Python FastAPI, dan Supabase.',
  phone: '+62 812-3456-7890',
  email: 'raihanagilmaulana@gmail.com',
  location: 'Jakarta, Indonesia',
  website: 'https://raihanagil.dev',
  github: 'https://github.com/raihanagilm',
  linkedin: 'https://linkedin.com/in/raihanagil',
  instagram: 'https://instagram.com/raihanagil',
  twitter: 'https://twitter.com/raihanagil',
  avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400'
};

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'IntervU AI - Platform Simulasi Wawancara',
    description: 'Aplikasi berbasis web AI untuk latihan dan simulasi wawancara kerja interaktif secara real-time dengan umpan balik otomatis.',
    tech_stack: ['React', 'TypeScript', 'FastAPI', 'Supabase', 'OpenAI'],
    image_url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=800',
    demo_url: 'https://intervu-ai.example.com',
    repo_url: 'https://github.com/raihanagilm/intervu-ai',
    start_date: '2024-01',
    end_date: '2024-06',
    is_featured: true
  },
  {
    id: '2',
    title: 'Kinetic Trust - Enterprise Portfolio Manager',
    description: 'Sistem manajemen portofolio terpadu dengan autentikasi multi-metode OTP 6-digit dan visualisasi grafik performa.',
    tech_stack: ['React', 'TailwindCSS', 'Python', 'FastAPI', 'Resend'],
    image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
    demo_url: 'https://kinetictrust.example.com',
    repo_url: 'https://github.com/raihanagilm/kinetic-trust',
    start_date: '2024-05',
    end_date: 'Sekarang',
    is_featured: true
  }
];

export const mockExperiences: Experience[] = [
  {
    id: '1',
    company: 'Tech Innovators Indonesia',
    position: 'Senior Full-Stack Engineer',
    description: 'Memimpin tim pengembang dalam merancang arsitektur microservices dan frontend dashboard berbasis React & FastAPI.',
    start_date: 'Januari 2023',
    end_date: 'Sekarang',
    is_current: true,
    location: 'Jakarta, Indonesia'
  },
  {
    id: '2',
    company: 'Global Digital Labs',
    position: 'Frontend Developer',
    description: 'Mengembangkan antarmuka pengguna responsif dan interaktif menggunakan React, TypeScript, dan Tailwind CSS.',
    start_date: 'Juni 2021',
    end_date: 'Desember 2022',
    is_current: false,
    location: 'Bandung, Indonesia'
  }
];

export const mockSkills: Skill[] = [
  { id: '1', name: 'React.js', category: 'Frontend', level: 90 },
  { id: '2', name: 'TypeScript', category: 'Frontend', level: 85 },
  { id: '3', name: 'Python (FastAPI)', category: 'Backend', level: 88 },
  { id: '4', name: 'PostgreSQL / Supabase', category: 'Database', level: 82 },
  { id: '5', name: 'Docker & Git', category: 'DevOps & Tools', level: 80 }
];

export const mockEducation: Education[] = [
  {
    id: '1',
    institution: 'Universitas Al-Azhar Indonesia',
    degree: 'Sarjana Komputer (S.Kom)',
    field_of_study: 'Teknik Informatika',
    start_date: '2020',
    end_date: '2024',
    is_current: false,
    gpa: '3.85 / 4.00',
    description: 'Fokus penelitian pada Artificial Intelligence, Web Application Architecture, dan Cloud Engineering.'
  }
];

export const mockMessages: Message[] = [
  {
    id: '1',
    sender_name: 'Budi Santoso',
    sender_email: 'budi@company.com',
    subject: 'Tawaran Proyek Web Development',
    message: 'Halo Raihan, kami tertarik untuk merekrut Anda sebagai Lead Developer dalam proyek baru kami. Bisakah kita berdiskusi lebih lanjut?',
    is_read: false,
    created_at: '2026-08-02T10:30:00Z'
  },
  {
    id: '2',
    sender_name: 'Siti Aminah',
    sender_email: 'siti@recruiter.id',
    subject: 'Undangan Wawancara Kerja',
    message: 'Selamat pagi Mas Raihan, profil Anda sangat cocok untuk posisi Senior Backend Engineer di perusahaan kami.',
    is_read: true,
    created_at: '2026-08-01T14:15:00Z'
  }
];
