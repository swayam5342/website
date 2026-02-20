
import React, { useEffect } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Layout } from './src/components/Layout';
import { Home } from './src/pages/Home';
import { AboutPage } from './src/pages/AboutPage';
import { Projects } from './src/pages/Projects';
import { ProjectDetail } from './src/pages/ProjectDetail';
import { Certificates } from './src/pages/Certificates';
import { CertificateDetail } from './src/pages/CertificateDetail';
import { Resume } from './src/pages/Resume';
import './index.css';




const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App: React.FC = () => {
  return (
    <Router>
      <ScrollToTop />
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/certificates" element={<Certificates />} />
          <Route path="/certificates/:id" element={<CertificateDetail />} />
          <Route path="/resume" element={<Resume />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;
