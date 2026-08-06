-- Schema Creation
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS emergency_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(120) NOT NULL,
    otp_code VARCHAR(6) NOT NULL,
    requested_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    is_used BOOLEAN DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS visitor_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ip_address VARCHAR(45),
    user_agent VARCHAR(255),
    path VARCHAR(100) DEFAULT '/',
    visited_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS profiles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL DEFAULT 'Full Name',
    title VARCHAR(150) DEFAULT 'Full-Stack Developer & UI/UX Designer',
    bio TEXT,
    avatar_url VARCHAR(255) DEFAULT '',
    resume_url VARCHAR(255) DEFAULT '',
    github VARCHAR(150) DEFAULT '',
    linkedin VARCHAR(150) DEFAULT '',
    instagram VARCHAR(150) DEFAULT '',
    facebook VARCHAR(150) DEFAULT '',
    twitter VARCHAR(150) DEFAULT '',
    youtube VARCHAR(150) DEFAULT '',
    website VARCHAR(150) DEFAULT '',
    email VARCHAR(120) DEFAULT 'admin@example.com',
    phone VARCHAR(30) DEFAULT '+62 800-000-0000',
    location VARCHAR(100) DEFAULT 'City, Country'
);

CREATE TABLE IF NOT EXISTS experiences (
    id INT AUTO_INCREMENT PRIMARY KEY,
    company VARCHAR(100) NOT NULL,
    position VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'Kerja',
    period VARCHAR(50) NOT NULL,
    description TEXT,
    order_index INT DEFAULT 0,
    is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS educations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    institution VARCHAR(120) NOT NULL,
    degree VARCHAR(100) NOT NULL,
    major VARCHAR(100),
    period VARCHAR(50) NOT NULL,
    description TEXT,
    type VARCHAR(20) DEFAULT 'education',
    credential_url VARCHAR(255) DEFAULT '',
    is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS skills (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(80) NOT NULL,
    category VARCHAR(50) DEFAULT 'Technical',
    proficiency INT DEFAULT 85,
    icon VARCHAR(50) DEFAULT 'code',
    is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    content TEXT,
    image_url VARCHAR(255),
    demo_url VARCHAR(255),
    github_url VARCHAR(255),
    category VARCHAR(50) DEFAULT 'Web App',
    tags VARCHAR(200) DEFAULT 'Flask, Tailwind, MySQL',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_visible BOOLEAN DEFAULT TRUE
);

CREATE TABLE IF NOT EXISTS project_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    project_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (project_id) REFERENCES projects (id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    sender_name VARCHAR(100) NOT NULL,
    sender_email VARCHAR(120) NOT NULL,
    subject VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    is_read BOOLEAN DEFAULT FALSE
);

-- Migrations (if tables already exist but missing these columns)
-- Run these one by one manually if you encounter errors during ALTER
-- ALTER TABLE profiles ADD COLUMN instagram VARCHAR(150) DEFAULT '';
-- ALTER TABLE skills ADD COLUMN is_visible BOOLEAN DEFAULT 1;
-- ALTER TABLE experiences ADD COLUMN category VARCHAR(50) DEFAULT 'Kerja';
-- ALTER TABLE experiences ADD COLUMN is_visible BOOLEAN DEFAULT 1;
ALTER TABLE educations
ADD COLUMN credential_url VARCHAR(255) DEFAULT '';
-- ALTER TABLE projects ADD COLUMN is_visible BOOLEAN DEFAULT 1;
ALTER TABLE projects ADD COLUMN content TEXT;

ALTER TABLE projects ADD COLUMN projects_images VARCHAR(255);

-- Seed Data

-- 1. Insert Admin (password: 123456, using pbkdf2:sha256 hash)
INSERT IGNORE INTO
    users (email, password_hash, role)
VALUES (
        'admin@example.com',
        'scrypt:32768:8:1$C6Z2K4Vb$4a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b',
        'admin'
    );

-- 2. Insert Profile
INSERT INTO
    profiles (
        full_name,
        title,
        bio,
        email,
        phone,
        location,
        github,
        linkedin
    )
SELECT 'Full Name', 'Full-Stack Developer & Tech Enthusiast', 'Passionate developer creating aesthetic, performant, and cardboard-craft inspired digital experiences.', 'admin@example.com', '+62 800-000-0000', 'City, Country', '', ''
WHERE
    NOT EXISTS (
        SELECT id
        FROM profiles
    );

-- 3. Insert Skills
INSERT INTO
    skills (
        name,
        category,
        proficiency,
        icon
    )
SELECT 'Python & Flask', 'Backend', 92, 'code'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    )
UNION ALL
SELECT 'Tailwind CSS', 'Frontend', 95, 'style'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    )
UNION ALL
SELECT 'JavaScript (ES6+)', 'Frontend', 88, 'javascript'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    )
UNION ALL
SELECT 'MySQL / TiDB', 'Database', 85, 'database'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    )
UNION ALL
SELECT 'Cloudinary API', 'Media', 80, 'cloud_upload'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    )
UNION ALL
SELECT 'Resend Email API', 'Services', 85, 'mail'
WHERE
    NOT EXISTS (
        SELECT id
        FROM skills
    );

-- 4. Insert Experiences
INSERT INTO
    experiences (
        company,
        position,
        period,
        description,
        order_index
    )
SELECT 'PT. Solusi Digital Kreatif', 'Senior Full-Stack Engineer', '2024 - Sekarang', 'Mengembangkan aplikasi web bertema custom, arsitektur microservices, dan integrasi API payment & mailing.', 1
WHERE
    NOT EXISTS (
        SELECT id
        FROM experiences
    )
UNION ALL
SELECT 'Tech Studio Indonesia', 'Frontend Developer', '2022 - 2024', 'Membangun UI/UX mobile-first modern berstandar tinggi dengan penekanan pada estetika visual & responsivitas.', 2
WHERE
    NOT EXISTS (
        SELECT id
        FROM experiences
    );

-- 5. Insert Projects
INSERT INTO
    projects (
        title,
        description,
        category,
        tags,
        demo_url,
        github_url
    )
SELECT 'Cardboard Portfolio Manager', 'Sistem manajemen portofolio interaktif bertema serat kardus dengan otentikasi OTP darurat dan integrasi Cloudinary.', 'Web App', 'Flask, Tailwind, MySQL, Resend', '#', '#'
WHERE
    NOT EXISTS (
        SELECT id
        FROM projects
    );