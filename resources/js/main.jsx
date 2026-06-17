import React from 'react';
import { createRoot } from 'react-dom/client';
import '../css/app.css';
import LandingPage from './LandingPage';
import AboutPage from './components/AboutPage';
import NewsPage from './components/NewsPage';
import AdminDashboard from './components/AdminDashboard';
import Login from './components/Login';
import ArticlePage from './components/ArticlePage';

const el = document.getElementById('app');
if (el) {
  const path = window.location.pathname;
  const isAdmin = path.startsWith('/admin');
  const isLogin = path === '/login';
  const isAbout = path === '/about';
  const isNews = path === '/news';
  const isNewsDetail = path.startsWith('/news/') && path.split('/')[2];

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
  } else {
    createRoot(el).render(<LandingPage />);
  }
}
