import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import LandingPage from './LandingPage';
import AboutPage from './components/AboutPage';
import NewsPage from './components/NewsPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ArticlePage from './components/ArticlePage';
import CareerPage from './components/CareerPage';
import MemberResourcesPage from './components/MemberResourcesPage';

const el = document.getElementById('app');
if (el) {
  const path = window.location.pathname;
  const isAdmin = path.startsWith('/admin');
  const isLogin = path === '/login';
  const isAbout = path === '/about';
  const isNews = path === '/news';
  const isNewsDetail = path.startsWith('/news/') && path.split('/')[2];
  const isCareer = path === '/career' || path.startsWith('/career/alumni/');
  const isResources = path === '/resources';

  if (isLogin) {
    createRoot(el).render(<Login />);
  } else if (isAdmin) {
    createRoot(el).render(<AdminDashboard />);
  } else if (isAbout) {
    createRoot(el).render(<AboutPage />);
  } else if (isNews) {
    createRoot(el).render(<NewsPage />);
  } else if (isNewsDetail) {
    const articleId = path.split('/')[2];
    createRoot(el).render(<ArticlePage articleId={articleId} />);
  } else if (isCareer) {
    createRoot(el).render(<CareerPage />);
  } else if (isResources) {
    createRoot(el).render(<MemberResourcesPage />);
  } else {
    createRoot(el).render(<LandingPage />);
  }
}
