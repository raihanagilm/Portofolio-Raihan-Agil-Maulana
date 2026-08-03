export interface Profile {
  id: string;
  full_name: string;
  title: string;
  bio: string;
  phone: string;
  email: string;
  location: string;
  website: string;
  github: string;
  linkedin: string;
  instagram: string;
  twitter: string;
  avatar_url: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  tech_stack: string[];
  image_url: string;
  demo_url?: string;
  repo_url?: string;
  start_date?: string;
  end_date?: string;
  is_featured: boolean;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  location?: string;
  company_logo_url?: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon_url?: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field_of_study: string;
  start_date: string;
  end_date: string;
  is_current: boolean;
  gpa?: string;
  description?: string;
  logo_url?: string;
}

export interface Message {
  id: string;
  sender_name: string;
  sender_email: string;
  subject: string;
  message: string;
  is_read: boolean;
  created_at: string;
}
