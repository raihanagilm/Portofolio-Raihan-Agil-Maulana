import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { PublicPortfolioPage } from './pages/PublicPortfolioPage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProjectsPage } from './pages/ProjectsPage';
import { ExperiencesPage } from './pages/ExperiencesPage';
import { SkillsPage } from './pages/SkillsPage';
import { EducationPage } from './pages/EducationPage';
import { MessagesPage } from './pages/MessagesPage';

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Portfolio Visitor Route */}
          <Route path="/" element={<PublicPortfolioPage />} />
          
          {/* Auth Login Route */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Admin CMS Dashboard Routes */}
          <Route path="/admin" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/admin/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/admin/projects" element={<Layout><ProjectsPage /></Layout>} />
          <Route path="/admin/experiences" element={<Layout><ExperiencesPage /></Layout>} />
          <Route path="/admin/skills" element={<Layout><SkillsPage /></Layout>} />
          <Route path="/admin/education" element={<Layout><EducationPage /></Layout>} />
          <Route path="/admin/messages" element={<Layout><MessagesPage /></Layout>} />
          
          {/* Fallback Legacy Admin Routes */}
          <Route path="/dashboard" element={<Layout><DashboardPage /></Layout>} />
          <Route path="/profile" element={<Layout><ProfilePage /></Layout>} />
          <Route path="/projects" element={<Layout><ProjectsPage /></Layout>} />
          <Route path="/experiences" element={<Layout><ExperiencesPage /></Layout>} />
          <Route path="/skills" element={<Layout><SkillsPage /></Layout>} />
          <Route path="/education" element={<Layout><EducationPage /></Layout>} />
          <Route path="/messages" element={<Layout><MessagesPage /></Layout>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
