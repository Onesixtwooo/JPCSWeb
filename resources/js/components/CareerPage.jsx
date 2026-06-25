import React, { useState, useEffect } from 'react';
import CustomCursor from './CustomCursor';
import './CareerPage.css';

const OUTLOOK_COLORS = {
  'High Demand':      { bg: '#dcfce7', color: '#15803d' },
  'Very High Demand': { bg: '#bbf7d0', color: '#166534' },
  'Growing Fast':     { bg: '#fef9c3', color: '#a16207' },
  'Explosive Growth': { bg: '#ede9fe', color: '#6d28d9' },
  'Critical Need':    { bg: '#fee2e2', color: '#b91c1c' },
  'Steady Demand':    { bg: '#e0f2fe', color: '#0369a1' },
  'Steady Growth':    { bg: '#d1fae5', color: '#065f46' },
  'Stable':           { bg: '#f1f5f9', color: '#475569' },
  'Stable Demand':    { bg: '#f1f5f9', color: '#475569' },
  'Growing':          { bg: '#fef3c7', color: '#92400e' },
};

const alumniSlug = (name) => encodeURIComponent(
  name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
);

export default function CareerPage() {
  const [about, setAbout] = useState({});
  const [careers, setCareers] = useState([]);
  const [alumni, setAlumni] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [expandedCard, setExpandedCard] = useState(null);
  const [currentAlumniPage, setCurrentAlumniPage] = useState(1);
  const [currentCareersPage, setCurrentCareersPage] = useState(1);
  const [shareLink, setShareLink] = useState('/#contact');
  const [copiedAlumnus, setCopiedAlumnus] = useState(null);

  const alumniPerPage = 9;
  const indexOfLastAlumnus = currentAlumniPage * alumniPerPage;
  const indexOfFirstAlumnus = indexOfLastAlumnus - alumniPerPage;
  const totalAlumniPages = Math.ceil(alumni.length / alumniPerPage);

  const FILTERS = ['All', 'Backend', 'Frontend', 'Full-Stack', 'Data', 'AI', 'Security', 'Design', 'Cloud', 'Mobile'];

  useEffect(() => {
    Promise.all([
      fetch('/api/career-paths').then(res => res.json()),
      fetch('/api/alumni-testimonials').then(res => res.json()),
      fetch('/api/alumni-share-link').then(res => res.json()),
      fetch('/api/about').then(res => res.json())
    ])
    .then(([careersData, alumniData, shareLinkData, aboutData]) => {
      setCareers(careersData);
      setAlumni(alumniData);
      if (shareLinkData && shareLinkData.link) {
        setShareLink(shareLinkData.link);
      }
      setAbout(aboutData || {});
      setLoading(false);
    })
    .catch(err => {
      console.error("Error loading career data:", err);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (loading) return;
    
    const hash = window.location.hash;
    if (hash === '#alumni') {
      setTimeout(() => {
        const element = document.getElementById('alumni');
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 300);
    }
  }, [loading]);

  useEffect(() => {
    if (loading || alumni.length === 0) return;
    
    const hash = window.location.hash;
    const pathParts = window.location.pathname.split('/').filter(Boolean);
    const alumniPathSlug = pathParts[0] === 'career' && pathParts[1] === 'alumni'
      ? pathParts[2]
      : null;
    const hashSlug = hash && hash.startsWith('#alumni-')
      ? hash.replace('#alumni-', '')
      : null;
    const slug = alumniPathSlug || hashSlug;

    if (slug) {
      const index = alumni.findIndex(a => 
        alumniSlug(a.name) === slug
      );
      if (index !== -1) {
        const page = Math.floor(index / alumniPerPage) + 1;
        setCurrentAlumniPage(page);
        
        setTimeout(() => {
          const cardId = `alumni-card-${slug}`;
          const element = document.getElementById(cardId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add('alumni-card--highlight');
            setTimeout(() => {
              element.classList.remove('alumni-card--highlight');
            }, 2000);
          }
        }, 400);
      }
    }
  }, [loading, alumni]);

  useEffect(() => {
    setCurrentCareersPage(1);
  }, [activeFilter]);

  const handleShare = (alumnus) => {
    const slug = alumniSlug(alumnus.name);
    const shareUrl = `${window.location.origin}/career/alumni/${slug}`;
    
    const shareData = {
      title: `${alumnus.name}'s Success Story - JPCS Career Board`,
      text: `Read about ${alumnus.name}, ${alumnus.role} at ${alumnus.company} on the JPCS Alumni Board.`,
      url: shareUrl
    };

    if (navigator.share) {
      navigator.share(shareData)
        .catch(err => {
          if (err.name !== 'AbortError') {
            console.error('Error sharing:', err);
          }
        });
    } else {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(shareUrl)
          .then(() => {
            setCopiedAlumnus(alumnus.name);
            setTimeout(() => setCopiedAlumnus(null), 2000);
          })
          .catch(err => {
            console.error('Failed to copy: ', err);
          });
      } else {
        const textArea = document.createElement("textarea");
        textArea.value = shareUrl;
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          setCopiedAlumnus(alumnus.name);
          setTimeout(() => setCopiedAlumnus(null), 2000);
        } catch (err) {
          console.error('Fallback copy failed: ', err);
        }
        document.body.removeChild(textArea);
      }
    }
  };

  const handleFbShare = (alumnus) => {
    const slug = alumniSlug(alumnus.name);
    const shareUrl = `${window.location.origin}/career/alumni/${slug}`;
    const fbShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
    window.open(fbShareUrl, '_blank', 'noopener,noreferrer,width=600,height=400');
  };



  const filtered = activeFilter === 'All'
    ? careers
    : careers.filter(c => c.tags && c.tags.includes(activeFilter));

  const careersPerPage = 9;
  const indexOfLastCareer = currentCareersPage * careersPerPage;
  const indexOfFirstCareer = indexOfLastCareer - careersPerPage;
  const totalCareersPages = Math.ceil(filtered.length / careersPerPage);
  const currentCareers = filtered.slice(indexOfFirstCareer, indexOfLastCareer);

  if (loading) {
    return (
      <div className="careerpage-loader-container">
        <div className="careerpage-loader"></div>
        <p className="careerpage-loader-text">LOADING CAREER DATA...</p>
      </div>
    );
  }

  return (
    <div className="careerpage">
      <CustomCursor />

      {/* ── Nav ── */}
      <nav className="careerpage__nav">
        <div className="careerpage__nav-inner container">
          <a href="/" className="careerpage__nav-brand">
            {about.brand_logo ? (
              <img src={about.brand_logo} alt="Logo" className="careerpage__nav-logo" style={{ objectFit: 'cover' }} />
            ) : (
              <div className="careerpage__nav-logo">
                {(about.brand_name || 'JPCS').split('-')[0]}
              </div>
            )}
            <div className="careerpage__nav-text">
              <span className="careerpage__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
              <span className="careerpage__nav-sub">Career Board</span>
            </div>
          </a>
          <div className="careerpage__nav-links">
            <a href="/" className="careerpage__nav-link">Home</a>
            <a href="/about" className="careerpage__nav-link">About</a>
            <a href="/news" className="careerpage__nav-link">News</a>
            <a href="#alumni" className="careerpage__nav-link" onClick={e => {
              e.preventDefault();
              document.getElementById('alumni')?.scrollIntoView({ behavior: 'smooth' });
            }}>Alumni</a>
          </div>
          <a href="/" className="careerpage__back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="careerpage__hero">
        <div className="careerpage__hero-particles">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="careerpage__particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="careerpage__hero-content container">
          <span className="careerpage__hero-tag">💼 Career Board</span>
          <h1 className="careerpage__hero-title">
            Your Future in <span className="careerpage__hero-accent">Information Technology</span>
          </h1>
          <p className="careerpage__hero-desc">
            Explore the wide range of careers waiting for you in IT — from building apps to securing networks and designing experiences. 
            Hear from JPCS-OLSHCo alumni who made it.
          </p>
          <div className="careerpage__hero-stats">
            <div className="careerpage__hero-stat">
              <span className="careerpage__hero-stat-num">{careers.length}</span>
              <span className="careerpage__hero-stat-label">IT Career Paths</span>
            </div>
            <div className="careerpage__hero-stat">
              <span className="careerpage__hero-stat-num">{alumni.length}</span>
              <span className="careerpage__hero-stat-label">Alumni Stories</span>
            </div>
            <div className="careerpage__hero-stat">
              <span className="careerpage__hero-stat-num">∞</span>
              <span className="careerpage__hero-stat-label">Possibilities</span>
            </div>
          </div>
        </div>
        <div className="careerpage__hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#f8faf9" />
          </svg>
        </div>
      </section>

      {/* ── Career Paths ── */}
      <section className="careerpage__careers">
        <div className="container">
          <div className="careerpage__section-header">
            <span className="careerpage__section-tag">🚀 Explore Paths</span>
            <h2 className="careerpage__section-title">IT Career Paths</h2>
            <p className="careerpage__section-sub">
              Every path in IT leads somewhere exciting. Find which one speaks to you.
            </p>
          </div>

          {/* Filter Pills */}
          <div className="careerpage__filters">
            {FILTERS.map(f => (
              <button
                key={f}
                className={`careerpage__filter-btn ${activeFilter === f ? 'active' : ''}`}
                onClick={() => setActiveFilter(f)}
              >
                {f}
              </button>
            ))}
          </div>

          {/* Career Grid */}
          <div className="careerpage__grid">
            {currentCareers.map((c, i) => (
              <div
                key={c.title}
                className={`career-card ${expandedCard === c.title ? 'career-card--expanded' : ''}`}
                style={{ '--accent': c.color }}
                onClick={() => setExpandedCard(expandedCard === c.title ? null : c.title)}
              >
                <div className="career-card__top">
                  <div className="career-card__icon-wrap">
                    <span className="career-card__icon">{c.icon}</span>
                  </div>
                  <div className="career-card__tags">
                    {c.tags.map(t => <span key={t} className="career-card__tag">{t}</span>)}
                  </div>
                </div>

                <h3 className="career-card__title">{c.title}</h3>
                <p className="career-card__desc">{c.desc}</p>

                <div className="career-card__meta">
                  <span className="career-card__outlook" style={OUTLOOK_COLORS[c.outlook] || {}}>
                    {c.outlook}
                  </span>
                  <span className="career-card__salary">💰 {c.salary}</span>
                </div>

                {expandedCard === c.title && (
                  <div className="career-card__skills">
                    <p className="career-card__skills-label">Key Skills to Learn:</p>
                    <div className="career-card__skill-list">
                      {c.skills.map(s => (
                        <span key={s} className="career-card__skill">{s}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="career-card__footer">
                  <span className="career-card__toggle">
                    {expandedCard === c.title ? '▲ Less info' : '▼ Key skills'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {totalCareersPages > 1 && (
            <div className="careerpage__pagination" style={{ marginTop: '40px' }}>
              <button
                disabled={currentCareersPage === 1}
                onClick={() => {
                  setCurrentCareersPage(p => Math.max(p - 1, 1));
                  document.querySelector('.careerpage__careers')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="careerpage__page-arrow"
              >
                ← Prev
              </button>
              {[...Array(totalCareersPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentCareersPage(pageNum);
                      document.querySelector('.careerpage__careers')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`careerpage__page-num ${currentCareersPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentCareersPage === totalCareersPages}
                onClick={() => {
                  setCurrentCareersPage(p => Math.min(p + 1, totalCareersPages));
                  document.querySelector('.careerpage__careers')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="careerpage__page-arrow"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ── Alumni Board ── */}
      <section id="alumni" className="careerpage__alumni">
        <div className="careerpage__alumni-bg" />
        <div className="container">
          <div className="careerpage__section-header">
            <span className="careerpage__section-tag" style={{ background: 'rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.9)', border: '1px solid rgba(255,255,255,0.2)' }}>
              🎓 Alumni Board
            </span>
            <h2 className="careerpage__section-title" style={{ color: 'white' }}>Hear From Our Alumni</h2>
            <p className="careerpage__section-sub" style={{ color: 'rgba(255,255,255,0.7)' }}>
              JPCS-OLSHCo graduates who turned their passion for tech into thriving careers.
            </p>
          </div>

          <div className="careerpage__alumni-grid">
            {alumni.slice(indexOfFirstAlumnus, indexOfLastAlumnus).map((a, i) => {
              if (a.image) {
                return (
                  <div 
                    id={`alumni-card-${alumniSlug(a.name)}`}
                    key={a.name} 
                    className="alumni-card alumni-card--photo" 
                    style={{ '--alumni-color': a.color }}
                  >
                    <div className="alumni-card__actions">
                      <button 
                        className="alumni-card__action-btn alumni-card__fb-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleFbShare(a);
                        }}
                        aria-label={`Share ${a.name}'s story on Facebook`}
                        title="Share on Facebook"
                      >
                        <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                        </svg>
                      </button>
                      <button 
                        className={`alumni-card__action-btn alumni-card__share-btn ${copiedAlumnus === a.name ? 'alumni-card__share-btn--copied' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShare(a);
                        }}
                        aria-label={`Share ${a.name}'s testimonial`}
                        title="Copy link"
                      >
                        {copiedAlumnus === a.name ? (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                            <polyline points="16 6 12 2 8 6" />
                            <line x1="12" y1="2" x2="12" y2="15" />
                          </svg>
                        )}
                        {copiedAlumnus === a.name && (
                          <span className="alumni-card__share-btn-tooltip">Copied!</span>
                        )}
                      </button>
                    </div>
                    <div className="alumni-card__photo-wrapper">
                      <img src={a.image} alt={a.name} className="alumni-card__photo" />
                    </div>
                    <div className="alumni-card__photo-quote" style={{ background: a.color || '#0891b2' }}>
                      <svg viewBox="0 0 24 24" fill="currentColor" width="14" height="14" style={{ color: 'white' }}>
                        <path d="M11.192 15.757c0-.962-.399-1.849-1.047-2.482.684-1.397 1.83-2.613 3.32-3.411l-.478-.857c-2.32 1.34-3.921 3.511-4.708 5.733-.203.576-.289 1.155-.289 1.706 0 1.947 1.488 3.27 3.202 3.27 1.707 0 3-.984 3-2.959zm8 0c0-.962-.399-1.849-1.046-2.482.684-1.397 1.83-2.613 3.32-3.411l-.478-.857c-2.321 1.34-3.922 3.511-4.709 5.733-.203.576-.289 1.155-.289 1.706 0 1.947 1.487 3.27 3.201 3.27 1.707 0 3.001-.984 3.001-2.959z"/>
                      </svg>
                    </div>
                    <div className="alumni-card__body">
                      <p className="alumni-card__quote-text">"{a.quote}"</p>
                      <div className="alumni-card__meta-info">
                        <h4 className="alumni-card__name-text">{a.name}</h4>
                        <p className="alumni-card__role-text">{a.role} · {a.company}</p>
                        <p className="alumni-card__year-text">{a.year}</p>
                      </div>
                    </div>
                  </div>
                );
              }

              return (
                <div 
                  id={`alumni-card-${alumniSlug(a.name)}`}
                  key={a.name} 
                  className="alumni-card" 
                  style={{ '--alumni-color': a.color }}
                >
                  <div className="alumni-card__actions">
                    <button 
                      className="alumni-card__action-btn alumni-card__fb-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleFbShare(a);
                      }}
                      aria-label={`Share ${a.name}'s story on Facebook`}
                      title="Share on Facebook"
                    >
                      <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    </button>
                    <button 
                      className={`alumni-card__action-btn alumni-card__share-btn ${copiedAlumnus === a.name ? 'alumni-card__share-btn--copied' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShare(a);
                      }}
                      aria-label={`Share ${a.name}'s testimonial`}
                      title="Copy link"
                    >
                      {copiedAlumnus === a.name ? (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="20 6 9 17 4 12" />
                        </svg>
                      ) : (
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
                          <polyline points="16 6 12 2 8 6" />
                          <line x1="12" y1="2" x2="12" y2="15" />
                        </svg>
                      )}
                      {copiedAlumnus === a.name && (
                        <span className="alumni-card__share-btn-tooltip">Copied!</span>
                      )}
                    </button>
                  </div>
                  <div className="alumni-card__quote-mark">"</div>
                  <p className="alumni-card__quote">{a.quote}</p>
                  <div className="alumni-card__footer">
                    <div className="alumni-card__avatar" style={{ background: a.color, overflow: 'hidden' }}>
                      {a.avatar ? (
                        a.avatar
                      ) : (
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '24px', height: '24px', opacity: 0.9 }}>
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                          <circle cx="12" cy="7" r="4" />
                        </svg>
                      )}
                    </div>
                    <div className="alumni-card__info">
                      <span className="alumni-card__name">{a.name}</span>
                      <span className="alumni-card__role">{a.role} · {a.company}</span>
                      <span className="alumni-card__year">{a.year}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {totalAlumniPages > 1 && (
            <div className="careerpage__pagination">
              <button
                disabled={currentAlumniPage === 1}
                onClick={() => {
                  setCurrentAlumniPage(p => Math.max(p - 1, 1));
                  document.querySelector('.careerpage__alumni')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="careerpage__page-arrow"
              >
                ← Prev
              </button>
              {[...Array(totalAlumniPages)].map((_, idx) => {
                const pageNum = idx + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => {
                      setCurrentAlumniPage(pageNum);
                      document.querySelector('.careerpage__alumni')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className={`careerpage__page-num ${currentAlumniPage === pageNum ? 'active' : ''}`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                disabled={currentAlumniPage === totalAlumniPages}
                onClick={() => {
                  setCurrentAlumniPage(p => Math.min(p + 1, totalAlumniPages));
                  document.querySelector('.careerpage__alumni')?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="careerpage__page-arrow"
              >
                Next →
              </button>
            </div>
          )}

          {/* CTA */}
          <div className="careerpage__alumni-cta">
            <div className="careerpage__alumni-cta-box">
              <span className="careerpage__alumni-cta-icon">🌟</span>
              <h3>Are you a JPCS-OLSHCo alumnus?</h3>
              <p>Share your story and inspire current students. Reach out to us to be featured on this board.</p>
              <a 
                href={shareLink} 
                className="careerpage__alumni-cta-btn"
                target={shareLink.startsWith('http') || shareLink.startsWith('//') ? '_blank' : undefined}
                rel={shareLink.startsWith('http') || shareLink.startsWith('//') ? 'noopener noreferrer' : undefined}
              >
                Share Your Story →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="careerpage__footer">
        <p>© {new Date().getFullYear()} JPCS-OLSHCo. All rights reserved. · <a href="/">Back to Home</a></p>
      </footer>
    </div>
  );
}
