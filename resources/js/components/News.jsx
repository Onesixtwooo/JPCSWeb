import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasLines from './CanvasLines';
import './News.css';

const DEFAULT_NEWS = [
  {
    id: 1,
    category: 'Announcement',
    date: 'June 10, 2026',
    title: 'JPCS-OLSHCo Wins Regional Programming Contest',
    excerpt: 'Our team brought home the gold at the Regional JPCS Programming Challenge, besting 25 teams from across the region in algorithmic problem-solving.',
    readTime: '3 min read',
    featured: true,
    emoji: '🏅',
  },
  {
    id: 2,
    category: 'Partnership',
    date: 'June 4, 2026',
    title: 'New Industry Partnership with TechCorp Philippines',
    excerpt: 'JPCS-OLSHCo signs MOU with TechCorp Philippines to provide internship and job placement opportunities for graduating members.',
    readTime: '2 min read',
    featured: false,
    emoji: '🤝',
  },
  {
    id: 3,
    category: 'Academic',
    date: 'May 28, 2026',
    title: 'Scholarship Program Now Open for IT Students',
    excerpt: 'The chapter has partnered with three local tech companies to offer merit-based scholarships for outstanding IT and CS students.',
    readTime: '4 min read',
    featured: false,
    emoji: '🎓',
  },
  {
    id: 4,
    category: 'Community',
    date: 'May 20, 2026',
    title: 'Tech for Good: Free Coding Classes for Public School Students',
    excerpt: 'JPCS-OLSHCo members volunteer as instructors in a community outreach program teaching basic coding to public school students.',
    readTime: '3 min read',
    featured: false,
    emoji: '🌍',
  },
  {
    id: 5,
    category: 'Announcement',
    date: 'May 15, 2026',
    title: 'New Executive Board Elected for A.Y. 2026–2027',
    excerpt: 'The chapter proudly welcomes its newly elected set of officers who will lead the organization for the upcoming academic year.',
    readTime: '2 min read',
    featured: false,
    emoji: '📣',
  },
];

const CAT_COLORS = {
  Announcement: { bg: 'rgba(34,132,59,0.1)',  color: 'var(--green-700)' },
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

export default function News() {
  const [newsList, setNewsList] = useState(null);

  useEffect(() => {
    axios.get('/api/news')
      .then(res => {
        setNewsList(res.data || []);
      })
      .catch(() => {
        setNewsList([]);
      });
  }, []);

  const isLoading = newsList === null;
  const hasNews = !isLoading && newsList.length > 0;
  
  const featured = hasNews 
    ? (newsList.find(n => n.featured) || newsList[0])
    : null;
  const rest = hasNews
    ? newsList.filter(n => n.id !== featured.id)
    : [];
  const visibleRest = rest.slice(0, 3);

  return (
    <section id="news" className="news">
      <CanvasLines />
      <div className="container">
        <div className="news__header">
          <span className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 3H4v10c0 2.21 1.79 4 4 4h6c2.21 0 4-1.79 4-4v-3h2c1.11 0 2-.89 2-2V5c0-1.11-.89-2-2-2zm0 5h-2V5h2v3zM4 19h16v2H4z"/></svg>
            News & Updates
          </span>
          <h2 className="section-title">Stay in the Loop</h2>
          <p className="section-sub">
            Latest announcements, achievements, and stories from the JPCS-OLSHCo community.
          </p>
        </div>

        {isLoading ? (
          <div className="news__loading">
            <div className="news__loading-spinner" />
            <p>Loading news...</p>
          </div>
        ) : !hasNews ? (
          <div className="news__empty">
            <div className="news__empty-icon">📰</div>
            <p className="news__empty-text">No news articles for now, stay updated on our official channels</p>
          </div>
        ) : (
          <>
            {/* Featured + sidebar */}
            <div className="news__layout">
              {/* Featured article */}
              {featured && (
                <article className="news-featured">
                  <div className="news-featured__badge">{featured.emoji} Featured</div>
                  <div className="news-featured__meta">
                    <span className="news-cat">{featured.category}</span>
                    <span className="news-date">{featured.date}</span>
                    <span className="news-read">{featured.readTime}</span>
                  </div>
                  <h2 className="news-featured__title">
                    <a href={`/news/${slugify(featured.title)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                      {featured.title}
                    </a>
                  </h2>
                  <p className="news-featured__excerpt">{featured.excerpt}</p>
                  <a href={`/news/${slugify(featured.title)}`} className="news-featured__btn">
                    Read Full Article
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </a>
                </article>
              )}

              {/* Sidebar articles */}
              <div className="news__sidebar">
                {visibleRest.map(n => (
                  <article 
                    key={n.id} 
                    className="news-card"
                    onClick={() => window.location.href = `/news/${slugify(n.title)}`}
                  >
                    <div className="news-card__emoji">{n.emoji}</div>
                    <div className="news-card__content">
                      <div className="news-card__meta">
                        <span className="news-cat" style={CAT_COLORS[n.category]}>{n.category}</span>
                        <span className="news-date">{n.date}</span>
                      </div>
                      <h3 className="news-card__title">
                        <a href={`/news/${slugify(n.title)}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                          {n.title}
                        </a>
                      </h3>
                      <p className="news-card__excerpt">{n.excerpt}</p>
                      <a href={`/news/${slugify(n.title)}`} className="news-card__link">Read more →</a>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {newsList.length > 4 && (
              <div className="news__more-container">
                <a href="/news" className="news__see-more-btn">
                  See More Updates
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </a>
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
