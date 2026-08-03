-- 1. Table Users (Authentication & Admin)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    otp_code TEXT,
    otp_expires_at TIMESTAMPTZ,
    reset_token TEXT,
    reset_token_expires_at TIMESTAMPTZ,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Table Profiles (Single Owner Profile)
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY DEFAULT 'raihan-agil-maulana',
    full_name TEXT NOT NULL DEFAULT 'Raihan Agil Maulana',
    title TEXT DEFAULT 'Full-Stack Developer & Software Engineer',
    bio TEXT DEFAULT 'Pengembang perangkat lunak passionate dengan spesialisasi dalam React, FastAPI, dan cloud backend solutions.',
    phone TEXT DEFAULT '+62 812-3456-7890',
    email TEXT DEFAULT 'raihan@example.com',
    location TEXT DEFAULT 'Jakarta, Indonesia',
    website TEXT DEFAULT 'https://raihanagil.dev',
    github TEXT DEFAULT 'https://github.com/raihanagilm',
    linkedin TEXT DEFAULT 'https://linkedin.com/in/raihanagil',
    instagram TEXT DEFAULT 'https://instagram.com/raihanagil',
    twitter TEXT DEFAULT 'https://twitter.com/raihanagil',
    avatar_url TEXT DEFAULT 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Table Projects
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    tech_stack TEXT[] DEFAULT '{}',
    image_url TEXT,
    demo_url TEXT,
    repo_url TEXT,
    start_date TEXT,
    end_date TEXT,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Table Experiences
CREATE TABLE IF NOT EXISTS experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    company TEXT NOT NULL,
    position TEXT NOT NULL,
    description TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    location TEXT,
    company_logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Table Skills
CREATE TABLE IF NOT EXISTS skills (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    category TEXT NOT NULL, -- e.g. Frontend, Backend, Database, DevOps, Tools
    level INTEGER DEFAULT 80, -- 0 to 100
    icon_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Table Education
CREATE TABLE IF NOT EXISTS education (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    institution TEXT NOT NULL,
    degree TEXT,
    field_of_study TEXT,
    start_date TEXT,
    end_date TEXT,
    is_current BOOLEAN DEFAULT false,
    gpa TEXT,
    description TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Table Messages
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sender_name TEXT NOT NULL,
    sender_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Seed Initial Default Profile
INSERT INTO profiles (id, full_name, title, bio, email)
VALUES ('raihan-agil-maulana', 'Raihan Agil Maulana', 'Full-Stack Software Engineer', 'Passionate developer creating high performance modern web applications.', 'raihan@example.com')
ON CONFLICT (id) DO NOTHING;
