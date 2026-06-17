import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './NewsPage.css';

const CAT_COLORS = {
  Announcement: { bg: 'rgba(34,132,59,0.1)',  color: '#15803d' },
  Partnership:  { bg: 'rgba(59,130,246,0.1)', color: '#1d4ed8' },
  Academic:     { bg: 'rgba(244,196,48,0.12)', color: '#92400e' },
  Community:    { bg: 'rgba(168,85,247,0.1)', color: '#7e22ce' },
};

const slugify = (text) => {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')     // Replace non-alphanumeric characters with a single hyphen
    .replace(/^-+/, '')              // Trim hyphen from start
    .replace(/-+$/, '');             // Trim hyphen from end
};

export default function NewsPage() {
  const [about, setAbout] = useState({});
  const [newsList, setNewsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

  useEffect(() => {
    Promise.all([
      axios.get('/api/about'),
      axios.get('/api/news')
    ])
      .then(([aboutRes, newsRes]) => {
        setAbout(aboutRes.data);
        setNewsList(newsRes.data || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="newspage__loading">
        <div className="newspage__spinner" />
      </div>
    );
  }

  const categories = ['All', ...new Set(newsList.map(n => n.category).filter(Boolean))];
  const filtered = activeFilter === 'All' ? newsList : newsList.filter(n => n.category === activeFilter);
  const featured = filtered.find(n => n.featured) || filtered[0];
  const rest = featured ? filtered.filter(n => n.id !== featured.id) : [];

  return (
    <div className="newspage">
      {/* Navigation Bar */}
      <nav className="newspage__nav">
        <div className="newspage__nav-inner container">
          <a href="/" className="newspage__nav-brand">
            {about.brand_logo ? (
              <img src={about.brand_logo} alt="Logo" className="newspage__nav-logo" />
            ) : (
              <div className="newspage__nav-logo-fallback">
                {(about.brand_name || 'JPCS').split('-')[0]}
              </div>
            )}
            <div className="newspage__nav-text">
              <span className="newspage__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
              <span className="newspage__nav-sub">{about.brand_subtext || ''}</span>
            </div>
          </a>
          <a href="/" className="newspage__back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="newspage__hero">
        <div className="newspage__hero-bg" />
        <div className="newspage__hero-content container">
          <span className="newspage__hero-tag">📰 News & Updates</span>
          <h1 className="newspage__hero-title">Stay in the Loop</h1>
          <p className="newspage__hero-desc">Latest announcements, achievements, and stories from the {about.brand_name || 'JPCS-OLSHCo'} community.</p>
        </div>
        <div className="newspage__hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#f8faf9" />
          </svg>
        </div>
      </section>

      {/* Filter */}
      <section className="newspage__content container">
        <div className="newspage__filter">
          {categories.map(c => (
            <button
              key={c}
              className={`newspage__filter-btn ${activeFilter === c ? 'newspage__filter-btn--active' : ''}`}
              onClick={() => setActiveFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="newspage__empty">
            <span>📭</span>
            <p>No articles found in this category.</p>
          </div>
        ) : (
          <>
            {/* Featured Article */}
            {featured && (
              <article className="newspage__featured">
                <div className="newspage__featured-badge">{featured.emoji || '📣'} Featured</div>
                <div className="newspage__featured-meta">
                  <span className="newspage__cat" style={CAT_COLORS[featured.category] || {}}>{featured.category}</span>
                  <span className="newspage__date">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {featured.date}
                  </span>
                  {featured.readTime && <span className="newspage__read">{featured.readTime}</span>}
                </div>
                <h2 className="newspage__featured-title">
                  <a href={`/news/${slugify(featured.title)}`} className="newspage__featured-title-link">{featured.title}</a>
                </h2>
                <p className="newspage__featured-excerpt">{featured.excerpt}</p>
                <div style={{ marginTop: '1.5rem' }}>
                  <a href={`/news/${slugify(featured.title)}`} className="newspage__featured-read-btn">
                    Read Full Article
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ marginLeft: '6px' }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </div>
              </article>
            )}

            {/* Articles Grid */}
            {rest.length > 0 && (
              <div className="newspage__grid">
                {rest.map(n => (
                  <a href={`/news/${slugify(n.title)}`} key={n.id} className="newspage__card-link">
                    <article className="newspage__card">
                      <div className="newspage__card-emoji">{n.emoji || '📰'}</div>
                      <div className="newspage__card-body">
                        <div className="newspage__card-meta">
                          <span className="newspage__cat" style={CAT_COLORS[n.category] || {}}>{n.category}</span>
                          <span className="newspage__date">{n.date}</span>
                        </div>
                        <h3 className="newspage__card-title">{n.title}</h3>
                        <p className="newspage__card-excerpt">{n.excerpt}</p>
                        {n.readTime && <span className="newspage__card-read">{n.readTime}</span>}
                      </div>
                    </article>
                  </a>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* Footer */}
      <footer className="newspage__footer">
        <p>© {new Date().getFullYear()} {about.brand_name || 'JPCS-OLSHCo'}. All rights reserved.</p>
      </footer>
    </div>
  );
}
