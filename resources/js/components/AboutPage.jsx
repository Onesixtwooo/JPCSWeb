import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCursor from './CustomCursor';
import './AboutPage.css';

export default function AboutPage() {
  const [about, setAbout] = useState({});
  const [officers, setOfficers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get('/api/about'),
      axios.get('/api/officers')
    ])
      .then(([aboutRes, officersRes]) => {
        setAbout(aboutRes.data);
        const sorted = (officersRes.data || []).sort((a, b) => a.order - b.order);
        setOfficers(sorted);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!loading) {
      const hash = window.location.hash;
      if (hash) {
        const id = hash.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
          setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
          }, 150);
        }
      }
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="aboutpage__loading">
        <div className="aboutpage__spinner" />
      </div>
    );
  }

  return (
    <div className="aboutpage">
      <CustomCursor />
      {/* Navigation Bar */}
      <nav className="aboutpage__nav">
        <div className="aboutpage__nav-inner container">
          <a href="/" className="aboutpage__nav-brand">
            {about.brand_logo ? (
              <img src={about.brand_logo} alt="Logo" className="aboutpage__nav-logo" />
            ) : (
              <div className="aboutpage__nav-logo-fallback">
                {(about.brand_name || 'JPCS').split('-')[0]}
              </div>
            )}
            <div className="aboutpage__nav-text">
              <span className="aboutpage__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
              <span className="aboutpage__nav-sub">{about.brand_subtext || ''}</span>
            </div>
          </a>
          <a href="/" className="aboutpage__back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="aboutpage__hero">
        <div className="aboutpage__hero-bg" />
        <div className="aboutpage__hero-content container">
          <span className="aboutpage__hero-tag">About Us</span>
          <h1 className="aboutpage__hero-title">{about.about_title || 'About Our Organization'}</h1>
          <p className="aboutpage__hero-desc">{about.about_description || ''}</p>
        </div>
        <div className="aboutpage__hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="var(--bg-primary)" />
          </svg>
        </div>
      </section>

      {/* History Section */}
      {about.about_history && (
        <section className="aboutpage__section container">
          <div className="aboutpage__section-header">
            <span className="aboutpage__section-icon">📜</span>
            <h2 className="aboutpage__section-title">Our History</h2>
          </div>
          <div className="aboutpage__history-card">
            <div className="aboutpage__history-accent" />
            <p className="aboutpage__history-text">{about.about_history}</p>
          </div>
        </section>
      )}

      {/* Mission & Vision */}
      <section className="aboutpage__section container">
        <div className="aboutpage__section-header">
          <span className="aboutpage__section-icon">🎯</span>
          <h2 className="aboutpage__section-title">Mission & Vision</h2>
        </div>
        <div className="aboutpage__mv-grid">
          <div className="aboutpage__mv-card aboutpage__mv-card--mission">
            <div className="aboutpage__mv-badge">Mission</div>
            <p>{about.about_mission || 'Our mission statement.'}</p>
          </div>
          <div className="aboutpage__mv-card aboutpage__mv-card--vision">
            <div className="aboutpage__mv-badge">Vision</div>
            <p>{about.about_vision || 'Our vision statement.'}</p>
          </div>
        </div>
      </section>



      {/* Organizational Structure */}
      <section id="org-structure" className="aboutpage__org">
        <div className="aboutpage__org-grid-bg" />
        <div className="container">
          <div className="aboutpage__section-header" style={{ marginBottom: '56px' }}>
            <span className="aboutpage__section-icon">🏛️</span>
            <h2 className="aboutpage__section-title">Organizational Structure</h2>
            <p className="aboutpage__section-sub">Meet the dedicated officers leading our chapter</p>
          </div>

          {/* Tiered hierarchy */}
          {(() => {
            const AVATAR_COLORS = [
              '#ec4899', '#f97316', '#84cc16', '#06b6d4', '#a78bfa',
              '#f43f5e', '#eab308', '#22c55e', '#3b82f6', '#e879f9',
              '#fb923c', '#34d399', '#60a5fa', '#c084fc', '#fbbf24'
            ];
            const tiers = [];
            const sorted = [...officers];

            if (sorted.length > 0) tiers.push([sorted[0]]);
            if (sorted.length > 2) tiers.push(sorted.slice(1, 3));
            else if (sorted.length === 2) tiers.push([sorted[1]]);
            if (sorted.length > 3) {
              const remaining = sorted.slice(3);
              for (let i = 0; i < remaining.length; i += 3) {
                tiers.push(remaining.slice(i, i + 3));
              }
            }

            let repTitleShown = false;

            return tiers.map((tier, tierIdx) => {
              const hasRep = tier.some(o => o.name.toLowerCase().includes('representative'));
              const showRepTitle = hasRep && !repTitleShown;
              if (showRepTitle) repTitleShown = true;

              return (
                <div key={tierIdx}>
                  {showRepTitle && (
                    <div className="aboutpage__org-divider">
                      <div className="aboutpage__org-divider-line" />
                      <span className="aboutpage__org-divider-text">Year Level Representatives</span>
                      <div className="aboutpage__org-divider-line" />
                    </div>
                  )}
                  <div className="aboutpage__org-tier">
                    {tierIdx > 0 && !showRepTitle && <div className="aboutpage__org-connector" />}
                    <div className={`aboutpage__org-row ${tier.length === 1 ? 'aboutpage__org-row--single' : ''}`}>
                      {tier.map((o, oIdx) => {
                        const colorIdx = (officers.indexOf(o)) % AVATAR_COLORS.length;
                        const bgColor = AVATAR_COLORS[colorIdx];
                        const initials = (o.officer_name || o.name)
                          .split(' ')
                          .filter(w => w.length > 0)
                          .map(w => w[0])
                          .slice(0, 2)
                          .join('')
                          .toUpperCase();

                        return (
                          <div key={o.id} className={`aboutpage__org-card ${tierIdx === 0 ? 'aboutpage__org-card--leader' : ''}`}>
                            <div className="aboutpage__org-avatar" style={{ background: bgColor }}>
                              <span>{initials}</span>
                            </div>
                            <span className="aboutpage__org-role">{o.name}</span>
                            {o.officer_name && (
                              <span className="aboutpage__org-name">{o.officer_name}</span>
                            )}
                            {o.year_level && (
                              <span className="aboutpage__org-detail">{o.year_level}</span>
                            )}
                            {o.motto && (
                              <span className="aboutpage__org-motto">"{o.motto}"</span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            });
          })()}
        </div>
      </section>

      {/* Footer */}
      <footer className="aboutpage__footer">
        <p>© {new Date().getFullYear()} {about.brand_name || 'JPCS-OLSHCo'}. All rights reserved.</p>
      </footer>
    </div>
  );
}
