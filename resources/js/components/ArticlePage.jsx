import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ArticlePage.css';

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

export default function ArticlePage({ articleId }) {
  const [about, setAbout] = useState({});
  const [article, setArticle] = useState(null);
  const [recentNews, setRecentNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(false);
    
    Promise.all([
      axios.get('/api/about'),
      axios.get(`/api/news/${articleId}`),
      axios.get('/api/news')
    ])
      .then(([aboutRes, articleRes, newsListRes]) => {
        setAbout(aboutRes.data);
        setArticle(articleRes.data);
        
        // Filter out current article and show up to 3 other news articles
        const currentArticleId = articleRes.data?.id;
        const otherNews = (newsListRes.data || [])
          .filter(n => n.id !== currentArticleId)
          .slice(0, 3);
        setRecentNews(otherNews);
      })
      .catch((err) => {
        console.error("Error fetching article details:", err);
        setError(true);
      })
      .finally(() => {
        setLoading(false);
        window.scrollTo(0, 0);
      });
  }, [articleId]);

  if (loading) {
    return (
      <div className="article-page__loading">
        <div className="article-page__spinner" />
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="article-page article-page--error">
        {/* Navigation Bar */}
        <nav className="article-page__nav">
          <div className="article-page__nav-inner container">
            <a href="/" className="article-page__nav-brand">
              {about.brand_logo ? (
                <img src={about.brand_logo} alt="Logo" className="article-page__nav-logo" />
              ) : (
                <div className="article-page__nav-logo-fallback">
                  {(about.brand_name || 'JPCS').split('-')[0]}
                </div>
              )}
              <div className="article-page__nav-text">
                <span className="article-page__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
                <span className="article-page__nav-sub">{about.brand_subtext || ''}</span>
              </div>
            </a>
            <a href="/news" className="article-page__back-btn">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
              Back to News
            </a>
          </div>
        </nav>

        <div className="article-page__error-content container">
          <span className="article-page__error-icon">⚠️</span>
          <h2>Article Not Found</h2>
          <p>The news article you are looking for does not exist or may have been deleted.</p>
          <a href="/news" className="btn-primary" style={{ marginTop: '20px' }}>
            Return to News Feed
          </a>
        </div>

        <footer className="article-page__footer">
          <p>© {new Date().getFullYear()} {about.brand_name || 'JPCS-OLSHCo'}. All rights reserved.</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="article-page">
      {/* Navigation Bar */}
      <nav className="article-page__nav">
        <div className="article-page__nav-inner container">
          <a href="/" className="article-page__nav-brand">
            {about.brand_logo ? (
              <img src={about.brand_logo} alt="Logo" className="article-page__nav-logo" />
            ) : (
              <div className="article-page__nav-logo-fallback">
                {(about.brand_name || 'JPCS').split('-')[0]}
              </div>
            )}
            <div className="article-page__nav-text">
              <span className="article-page__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
              <span className="article-page__nav-sub">{about.brand_subtext || ''}</span>
            </div>
          </a>
          <a href="/news" className="article-page__back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to News
          </a>
        </div>
      </nav>

      {/* Article Header Hero */}
      <header className="article-page__hero">
        <div className="article-page__hero-bg" />
        <div className="article-page__hero-content container">
          <div className="article-page__hero-meta">
            <span className="article-page__cat" style={CAT_COLORS[article.category] || {}}>{article.category}</span>
            <span className="article-page__date">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              {article.date}
            </span>
            {article.readTime && <span className="article-page__read">{article.readTime}</span>}
          </div>
          <h1 className="article-page__title">
            <span className="article-page__emoji">{article.emoji || '📰'}</span>
            {article.title}
          </h1>
        </div>
        <div className="article-page__hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#f8faf9" />
          </svg>
        </div>
      </header>

      {/* Article Content Section */}
      <section className="article-page__content-sec container">
        <div className="article-page__layout">
          {/* Main Body Card */}
          <article className="article-page__main-card">
            <p className="article-page__excerpt">{article.excerpt}</p>
            <div className="article-page__divider" />
            {article.images && article.images.length > 0 && (
              <div className="article-page__gallery">
                {article.images.length === 1 ? (
                  <div className="article-page__single-image">
                    <img src={article.images[0]} alt="Article Header Cover" />
                  </div>
                ) : (
                  <div className="article-page__grid-gallery">
                    {article.images.map((imgUrl, idx) => (
                      <div key={idx} className="article-page__gallery-item">
                        <a href={imgUrl} target="_blank" rel="noreferrer">
                          <img src={imgUrl} alt={`Article attachment ${idx + 1}`} />
                        </a>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            <div className="article-page__body-text">
              {article.content ? (
                article.content
              ) : (
                <p style={{ fontStyle: 'italic', color: 'var(--gray-400)' }}>
                  This article has no content body written yet. Check back soon for updates!
                </p>
              )}
            </div>
          </article>

          {/* Social Share / Meta Sidebar */}
          <aside className="article-page__sidebar">
            <div className="article-page__sidebar-card">
              <h3>Share Article</h3>
              <div className="article-page__share-buttons">
                <button className="share-btn share-btn--copy" onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Link copied to clipboard!");
                }}>
                  🔗 Copy Link
                </button>
                <a 
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="share-btn share-btn--fb"
                >
                  🔵 Facebook
                </a>
              </div>
            </div>

            <div className="article-page__sidebar-card article-page__sidebar-card--brand">
              <div className="brand-logo-circle">
                {about.brand_logo ? (
                  <img src={about.brand_logo} alt="Logo" />
                ) : (
                  <span>JPCS</span>
                )}
              </div>
              <h4>{about.brand_name || 'JPCS-OLSHCo'}</h4>
              <p>{about.about_description ? about.about_description.slice(0, 100) + '...' : ''}</p>
              <a href="/about" className="learn-more-link">Learn About Us →</a>
            </div>
          </aside>
        </div>
      </section>

      {/* More Updates Section */}
      {recentNews.length > 0 && (
        <section className="article-page__more-news container">
          <div className="more-news__header">
            <h2>More News & Updates</h2>
            <a href="/news" className="more-news__view-all">View All Articles →</a>
          </div>
          <div className="more-news__grid">
            {recentNews.map(n => (
              <a href={`/news/${slugify(n.title)}`} key={n.id} className="more-news__card-link">
                <div className="more-news__card">
                  <span className="more-news__card-emoji">{n.emoji || '📰'}</span>
                  <div className="more-news__card-body">
                    <div className="more-news__card-meta">
                      <span className="more-news__card-cat" style={CAT_COLORS[n.category] || {}}>{n.category}</span>
                      <span className="more-news__card-date">{n.date}</span>
                    </div>
                    <h4>{n.title}</h4>
                    <p>{n.excerpt}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      <footer className="article-page__footer">
        <p>© {new Date().getFullYear()} {about.brand_name || 'JPCS-OLSHCo'}. All rights reserved.</p>
      </footer>
    </div>
  );
}
