import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCursor from './CustomCursor';
import './MemberResourcesPage.css';

// SVGs for different file types to make the list look very clean and premium
const renderFileIcon = (title) => {
  const t = title.toLowerCase();
  if (t.includes('excel') || t.includes('tracker') || t.includes('calculator') || t.includes('dtr')) {
    // Excel Spreadsheet Icon
    return (
      <svg className="file-icon file-icon--excel" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="8" y1="13" x2="16" y2="13"></line>
        <line x1="8" y1="17" x2="16" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    );
  } else if (t.includes('letter') || t.includes('document') || t.includes('proposal') || t.includes('template')) {
    // Word Document Icon
    return (
      <svg className="file-icon file-icon--word" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <path d="M10 12h4"></path>
        <path d="M10 16h4"></path>
        <path d="M8 12h.01"></path>
        <path d="M8 16h.01"></path>
      </svg>
    );
  } else {
    // PDF or Generic Document Icon
    return (
      <svg className="file-icon file-icon--pdf" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
        <polyline points="14 2 14 8 20 8"></polyline>
        <line x1="16" y1="13" x2="8" y2="13"></line>
        <line x1="16" y1="17" x2="8" y2="17"></line>
        <polyline points="10 9 9 9 8 9"></polyline>
      </svg>
    );
  }
};

export default function MemberResourcesPage() {
  const [resources, setResources] = useState([]);
  const [filteredResources, setFilteredResources] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [about, setAbout] = useState({});

  useEffect(() => {
    // Fetch resource data and branding
    Promise.all([
      axios.get('/api/student-resources'),
      axios.get('/api/about')
    ])
      .then(([resData, resAbout]) => {
        setResources(resData.data);
        setAbout(resAbout.data);
      })
      .catch(err => {
        console.error('Error fetching resources:', err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // Update filteredResources whenever resources, activeCategory, or searchQuery changes
  useEffect(() => {
    let result = [...resources];
    if (activeCategory !== 'All') {
      result = result.filter(r => r.category === activeCategory);
    }
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      result = result.filter(r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.category && r.category.toLowerCase().includes(q)) ||
        (r.description && r.description.toLowerCase().includes(q))
      );
    }
    setFilteredResources(result);
  }, [resources, activeCategory, searchQuery]);

  const handleCategorySelect = (category) => {
    setActiveCategory(category);
  };

  const categories = [
    'All',
    'Academic Templates',
    'Class & Study Tools',
    'Official Forms',
    'Cheat Sheets & Guides'
  ];

  // Calculate statistics for the hero area
  const countByCategory = (cat) => resources.filter(r => r.category === cat).length;

  return (
    <div className="resourcespage">
      <CustomCursor />

      {/* ── Nav Bar ── */}
      <nav className="resourcespage__nav">
        <div className="resourcespage__nav-inner container">
          <a href="/" className="resourcespage__nav-brand">
            {about.brand_logo ? (
              <img src={about.brand_logo} alt="Logo" className="resourcespage__nav-logo-img" />
            ) : (
              <div className="resourcespage__nav-logo-fallback">JPCS</div>
            )}
            <div className="resourcespage__nav-text">
              <span className="resourcespage__nav-name">{about.brand_name || 'JPCS-OLSHCo'}</span>
              <span className="resourcespage__nav-sub">Student Portal</span>
            </div>
          </a>
          <div className="resourcespage__nav-links">
            <a href="/" className="resourcespage__nav-link">Home</a>
            <a href="/about" className="resourcespage__nav-link">About</a>
            <a href="/news" className="resourcespage__nav-link">News</a>
            <a href="/career" className="resourcespage__nav-link">Careers</a>
            <a href="/career#alumni" className="resourcespage__nav-link">Alumni</a>
          </div>
          <a href="/" className="resourcespage__back-btn">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
            Back to Home
          </a>
        </div>
      </nav>

      {/* ── Hero Banner ── */}
      <section className="resourcespage__hero">
        <div className="resourcespage__hero-particles">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="resourcespage__particle" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${4 + Math.random() * 4}s`,
            }} />
          ))}
        </div>
        <div className="resourcespage__hero-content container">
          <span className="resourcespage__hero-tag">📁 Download Hub</span>
          <h1 className="resourcespage__hero-title">
            Student & Member <span className="resourcespage__hero-accent">Resources</span>
          </h1>
          <p className="resourcespage__hero-desc">
            Equip yourself for academic success and professional growth. Download official letters,capstone guidelines, grade trackers, and reference sheets compiled by JPCS-OLSHCo.
          </p>
          
          <div className="resourcespage__hero-stats">
            <div className="resourcespage__hero-stat">
              <span className="resourcespage__hero-stat-num">{resources.length}</span>
              <span className="resourcespage__hero-stat-label">Total Files</span>
            </div>
            <div className="resourcespage__hero-stat">
              <span className="resourcespage__hero-stat-num">{countByCategory('Academic Templates')}</span>
              <span className="resourcespage__hero-stat-label">Templates</span>
            </div>
            <div className="resourcespage__hero-stat">
              <span className="resourcespage__hero-stat-num">{countByCategory('Class & Study Tools')}</span>
              <span className="resourcespage__hero-stat-label">Study Tools</span>
            </div>
            <div className="resourcespage__hero-stat">
              <span className="resourcespage__hero-stat-num">{countByCategory('Cheat Sheets & Guides')}</span>
              <span className="resourcespage__hero-stat-label">Cheat Sheets</span>
            </div>
          </div>
        </div>
        <div className="resourcespage__hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
            <path d="M0,60 C360,120 1080,0 1440,60 L1440,120 L0,120 Z" fill="#f8faf9" />
          </svg>
        </div>
      </section>

      {/* ── Main Content Section ── */}
      <section className="resourcespage__content container">
        {loading ? (
          <div className="resourcespage__loading">
            <div className="resourcespage__spinner"></div>
            <p>Loading files index...</p>
          </div>
        ) : (
          <div className="resourcespage__grid">
            
            {/* Sidebar Column */}
            <aside className="resourcespage__sidebar">
              <div className="resourcespage__sidebar-card">
                <h3 className="resourcespage__sidebar-title">Select Category</h3>
                <div className="resourcespage__category-list">
                  {categories.map(cat => (
                    <button
                      key={cat}
                      className={`resourcespage__category-btn ${activeCategory === cat ? 'active' : ''}`}
                      onClick={() => handleCategorySelect(cat)}
                    >
                      <span className="category-btn__dot"></span>
                      <span className="category-btn__label">{cat === 'All' ? 'All Resources' : cat}</span>
                      <span className="category-btn__count">
                        {cat === 'All' ? resources.length : countByCategory(cat)}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main File Table Column */}
            <div className="resourcespage__main">
              
              {/* Account Advisory Banner */}
              <div className="resourcespage__advisory">
                <div className="resourcespage__advisory-icon">💡</div>
                <div className="resourcespage__advisory-body">
                  <strong>Authorized Google Account Needed</strong>
                  <p>Please download files using your <code>@olshco.edu.ph</code> or school-authorized Google Account to access shared templates and sheets.</p>
                </div>
              </div>

              {/* Files Table Container */}
              <div className="resourcespage__table-card">
                <div className="resourcespage__table-header">
                  <div className="resourcespage__table-header-left">
                    <h3>Files List ({filteredResources.length})</h3>
                    <span className="active-category-pill">{activeCategory === 'All' ? 'All Resources' : activeCategory}</span>
                  </div>

                  {/* Search Bar Input */}
                  <div className="resourcespage__search-wrap">
                    <span className="resourcespage__search-icon">🔍</span>
                    <input
                      type="text"
                      className="resourcespage__search-input"
                      placeholder="Search files..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button className="resourcespage__search-clear" onClick={() => setSearchQuery('')}>
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {filteredResources.length === 0 ? (
                  <div className="resourcespage__empty">
                    <span>📂</span>
                    <p>{searchQuery.trim() !== '' ? 'No resources match your search criteria.' : 'No resources found in this category.'}</p>
                  </div>
                ) : (
                  <div className="resourcespage__table-responsive">
                    <table className="resourcespage__table">
                      <thead>
                        <tr>
                          <th>Filename</th>
                          <th className="hide-mobile">Date Modified</th>
                          <th className="text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredResources.map(res => (
                          <tr key={res.id} className="resourcespage__row">
                            <td className="resourcespage__td-filename">
                              <div className="file-info-cell">
                                <div className="file-icon-wrap">
                                  {renderFileIcon(res.title)}
                                </div>
                                <div className="file-text-wrap">
                                  <span className="file-title">{res.title}</span>
                                  {res.description && (
                                    <span className="file-desc">{res.description}</span>
                                  )}
                                </div>
                              </div>
                            </td>

                            <td className="resourcespage__td-date hide-mobile">
                              <span className="text-meta">{res.date_modified}</span>
                            </td>
                            <td className="resourcespage__td-actions text-right">
                              <div className="actions-cell">
                                <a
                                  href={res.download_link_1}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="download-btn download-btn--primary"
                                  title="Open primary download link"
                                >
                                  Download Link 1
                                </a>
                                {res.download_link_2 && (
                                  <a
                                    href={res.download_link_2}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="download-btn download-btn--secondary"
                                    title="Mirror download link"
                                  >
                                    Download Link 2
                                  </a>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

          </div>
        )}
      </section>

      {/* ── Footer ── */}
      <footer className="resourcespage__footer">
        <p>© {new Date().getFullYear()} {about.brand_name || 'JPCS-OLSHCo'}. All rights reserved. · <a href="/">Back to Home</a></p>
      </footer>
    </div>
  );
}
