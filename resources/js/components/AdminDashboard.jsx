import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import './AdminDashboard.css';

const renderTeamIcon = (iconName) => {
  switch (iconName) {
    case 'code-laptop':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="8" y1="21" x2="16" y2="21"></line>
          <line x1="12" y1="17" x2="12" y2="21"></line>
          <path d="m10 8-2 2 2 2M14 8l2 2-2 2"></path>
        </svg>
      );
    case 'shield-lock':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
          <rect x="9" y="11" width="6" height="5" rx="1"></rect>
          <path d="M10.5 11V9a1.5 1.5 0 0 1 3 0v2"></path>
        </svg>
      );
    case 'magic-wand':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="m15 4-2 2M19.07 4.93l-1.41 1.41M20 9h-2M19.07 13.07l-1.41-1.41M15 14l-2-2M2 22l9-9M19 2l-3 3 1.5 1.5L20.5 5 19 2z"></path>
        </svg>
      );
    case 'server-racks':
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
          <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
          <line x1="6" y1="6" x2="6.01" y2="6"></line>
          <line x1="6" y1="18" x2="6.01" y2="18"></line>
          <line x1="20" y1="6" x2="20" y2="6"></line>
          <line x1="20" y1="18" x2="20" y2="18"></line>
        </svg>
      );
    default:
      return (
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
        </svg>
      );
  }
};

const formatDateToHuman = (dateStr) => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1;
    const day = parseInt(parts[2], 10);
    const date = new Date(year, month, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  }
  
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatDateToISO = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return '';
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
};

export default function AdminDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null represents checking
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  

  // Sidebar navigation state
  const [activeTab, setActiveTab] = useState('messages');

  // Core Data States
  const [messages, setMessages] = useState([]);
  const [aboutSettings, setAboutSettings] = useState({
    about_title: '',
    about_description: '',
    about_history: '',
    about_stat_members: '',
    about_stat_events: '',
    about_mission: '',
    about_vision: '',
    brand_name: '',
    brand_subtext: '',
    brand_logo: '',
    about_img_main: '',
    about_img_sub: '',
    about_img_main_caption: '',
    about_img_sub_caption: ''
  });
  const [pillars, setPillars] = useState([]);
  const [officers, setOfficers] = useState([]);
  const [teams, setTeams] = useState([]);
  const [events, setEvents] = useState([]);
  const [news, setNews] = useState([]);
  const [faqs, setFaqs] = useState([]);
  const [eventsSettings, setEventsSettings] = useState({
    events_title: '',
    events_description: ''
  });
  const [contactSettings, setContactSettings] = useState({
    contact_address: '',
    contact_email: '',
    contact_hours: '',
    contact_fb: '',
    contact_ig: ''
  });
  const [heroSettings, setHeroSettings] = useState({
    hero_title_options_count: '3',
    hero_title_line1_1: '',
    hero_title_accent_1: '',
    hero_title_line2_1: '',
    hero_title_line1_2: '',
    hero_title_accent_2: '',
    hero_title_line2_2: '',
    hero_title_line1_3: '',
    hero_title_accent_3: '',
    hero_title_line2_3: '',
    hero_tagline: '',
    hero_motto: ''
  });

  // Modal / Form Edit States
  const [editItem, setEditItem] = useState(null); // holds item being edited
  const [modalType, setModalType] = useState(''); // 'pillar', 'officer', 'team', 'event', 'news'
  const [isNew, setIsNew] = useState(false);

  // Checks authentication on mount
  useEffect(() => {
    axios.get('/api/auth/check')
      .then(res => {
        setIsAuthenticated(res.data.authenticated);
        if (!res.data.authenticated) {
          window.location.href = '/login';
        }
      })
      .catch(() => {
        setIsAuthenticated(false);
        window.location.href = '/login';
      });
  }, []);

  // Fetch data depending on active tab when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (activeTab === 'messages') {
      axios.get('/api/contact-messages').then(res => setMessages(res.data));
    } else if (activeTab === 'about') {
      axios.get('/api/about').then(res => setAboutSettings(res.data));
      axios.get('/api/pillars').then(res => setPillars(res.data));
      axios.get('/api/contact-settings').then(res => setContactSettings(res.data));
      axios.get('/api/faqs').then(res => setFaqs(res.data));
    } else if (activeTab === 'hero') {
      axios.get('/api/hero-settings').then(res => setHeroSettings(res.data));
    } else if (activeTab === 'officers') {
      axios.get('/api/officers').then(res => setOfficers(res.data));
    } else if (activeTab === 'teams') {
      axios.get('/api/teams').then(res => setTeams(res.data));
    } else if (activeTab === 'events') {
      axios.get('/api/events').then(res => setEvents(res.data));
      axios.get('/api/events-settings').then(res => setEventsSettings(res.data));
    } else if (activeTab === 'news') {
      axios.get('/api/news').then(res => setNews(res.data));
    }
  }, [isAuthenticated, activeTab]);

  // Logout handler
  const handleLogout = () => {
    axios.post('/api/logout').then(() => {
      setIsAuthenticated(false);
      window.location.href = '/login';
    });
  };

  // Helper flash success message
  const flashSuccess = (msg) => {
    setSuccess(msg);
    setTimeout(() => setSuccess(''), 4000);
  };

  // Delete message handler
  const handleDeleteMessage = (id) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    axios.delete(`/api/contact-messages/${id}`)
      .then(() => {
        setMessages(messages.filter(m => m.id !== id));
        flashSuccess('Message deleted.');
      });
  };

  // Save About settings handler
  const handleSaveAbout = (e) => {
    e.preventDefault();
    setLoading(true);
    axios.post('/api/about', aboutSettings)
      .then(() => {
        flashSuccess('About settings saved.');
        Swal.fire({
          title: 'Success!',
          text: 'About information saved successfully!',
          icon: 'success',
          confirmButtonColor: '#15803d',
        });
      })
      .catch(() => setError('Failed to update About settings.'))
      .finally(() => setLoading(false));
  };

  const handleSaveHero = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    axios.post('/api/hero-settings', heroSettings)
      .then(() => {
        flashSuccess('Hero settings saved.');
        Swal.fire({
          title: 'Success!',
          text: 'Hero banner details saved successfully!',
          icon: 'success',
          confirmButtonColor: '#15803d',
        });
      })
      .catch(() => setError('Failed to update Hero settings.'))
      .finally(() => setLoading(false));
  };

  const handleDeleteOption = (idx) => {
    const count = parseInt(heroSettings.hero_title_options_count || '3', 10);
    if (count <= 1) {
      Swal.fire({
        title: 'Error!',
        text: 'You must keep at least one Hero Title option.',
        icon: 'error',
        confirmButtonColor: '#15803d',
      });
      return;
    }
    
    let newSettings = { ...heroSettings };
    
    if (idx === 1) {
      newSettings.hero_title_line1_1 = newSettings.hero_title_line1_2 || '';
      newSettings.hero_title_accent_1 = newSettings.hero_title_accent_2 || '';
      newSettings.hero_title_line2_1 = newSettings.hero_title_line2_2 || '';
      
      newSettings.hero_title_line1_2 = newSettings.hero_title_line1_3 || '';
      newSettings.hero_title_accent_2 = newSettings.hero_title_accent_3 || '';
      newSettings.hero_title_line2_2 = newSettings.hero_title_line2_3 || '';
      
      newSettings.hero_title_line1_3 = '';
      newSettings.hero_title_accent_3 = '';
      newSettings.hero_title_line2_3 = '';
    } else if (idx === 2) {
      newSettings.hero_title_line1_2 = newSettings.hero_title_line1_3 || '';
      newSettings.hero_title_accent_2 = newSettings.hero_title_accent_3 || '';
      newSettings.hero_title_line2_2 = newSettings.hero_title_line2_3 || '';
      
      newSettings.hero_title_line1_3 = '';
      newSettings.hero_title_accent_3 = '';
      newSettings.hero_title_line2_3 = '';
    } else if (idx === 3) {
      newSettings.hero_title_line1_3 = '';
      newSettings.hero_title_accent_3 = '';
      newSettings.hero_title_line2_3 = '';
    }
    
    newSettings.hero_title_options_count = String(count - 1);
    setHeroSettings(newSettings);
  };

  const handleAddOption = () => {
    const count = parseInt(heroSettings.hero_title_options_count || '3', 10);
    if (count >= 3) {
      Swal.fire({
        title: 'Error!',
        text: 'You can have a maximum of 3 Hero Title options.',
        icon: 'error',
        confirmButtonColor: '#15803d',
      });
      return;
    }
    
    let newSettings = { ...heroSettings };
    const nextIdx = count + 1;
    
    if (nextIdx === 2) {
      newSettings.hero_title_line1_2 = '';
      newSettings.hero_title_accent_2 = '';
      newSettings.hero_title_line2_2 = '';
    } else if (nextIdx === 3) {
      newSettings.hero_title_line1_3 = '';
      newSettings.hero_title_accent_3 = '';
      newSettings.hero_title_line2_3 = '';
    }
    
    newSettings.hero_title_options_count = String(nextIdx);
    setHeroSettings(newSettings);
  };

  const handleSaveEventsSettings = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    axios.post('/api/events-settings', eventsSettings)
      .then(() => {
        flashSuccess('Events section details saved.');
        Swal.fire({
          title: 'Success!',
          text: 'Events section details saved successfully!',
          icon: 'success',
          confirmButtonColor: '#15803d',
        });
      })
      .catch(() => setError('Failed to update Events section settings.'))
      .finally(() => setLoading(false));
  };

  const handleLogoFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setError('File size must be less than 2MB.');
      return;
    }

    const formData = new FormData();
    formData.append('logo', file);

    setLoading(true);
    setError('');
    axios.post('/api/about/upload-logo', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(res => {
      if (res.data.success) {
        setAboutSettings(prev => ({ ...prev, brand_logo: res.data.path }));
        flashSuccess('Logo uploaded successfully.');
      } else {
        setError(res.data.message || 'Failed to upload logo.');
      }
    })
    .catch(err => {
      setError(err.response?.data?.message || 'Failed to upload logo.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  const handleRemoveLogo = () => {
    setAboutSettings(prev => ({ ...prev, brand_logo: '' }));
    flashSuccess('Logo removed. Save settings to apply.');
  };

  const handleAboutImageChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File size must be less than 5MB.');
      return;
    }

    const formData = new FormData();
    formData.append('image', file);

    setLoading(true);
    setError('');
    axios.post('/api/about/upload-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    .then(res => {
      if (res.data.success) {
        const newPath = res.data.path;
        // Update local state first, then auto-save so public page reflects immediately
        setAboutSettings(prev => {
          const updated = { ...prev, [field]: newPath };
          // Auto-save in background — no manual "Save" needed for image changes
          axios.post('/api/about', updated)
            .then(() => flashSuccess('Image saved and applied to the public site! ✅'))
            .catch(() => setError('Image uploaded but failed to save settings.'));
          return updated;
        });
      } else {
        setError(res.data.message || 'Failed to upload image.');
      }
    })
    .catch(err => {
      setError(err.response?.data?.message || 'Failed to upload image.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  // CRUD Save handler (for pillars, officers, teams, events, news)
  const handleSaveCRUD = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    let endpoint = modalType === 'news' ? '/api/news' : `/api/${modalType}s`;
    let method = isNew ? 'post' : 'put';
    if (!isNew) endpoint += `/${editItem.id}`;

    // Fix duties and functions if string for team edit
    let payload = { ...editItem };
    if (modalType === 'team') {
      if (typeof payload.duties === 'string') {
        payload.duties = payload.duties.split('\n').filter(l => l.trim() !== '');
      }
      if (typeof payload.functions === 'string') {
        payload.functions = payload.functions.split('\n').filter(l => l.trim() !== '');
      }
    }

    axios[method](endpoint, payload)
      .then(res => {
        flashSuccess(`${modalType.toUpperCase()} saved successfully.`);
        setEditItem(null);
        
        // Refresh local listings
        if (modalType === 'pillar') {
          axios.get('/api/pillars').then(res => setPillars(res.data));
        } else if (modalType === 'officer') {
          axios.get('/api/officers').then(res => setOfficers(res.data));
        } else if (modalType === 'team') {
          axios.get('/api/teams').then(res => setTeams(res.data));
        } else if (modalType === 'event') {
          axios.get('/api/events').then(res => setEvents(res.data));
        } else if (modalType === 'news') {
          axios.get('/api/news').then(res => setNews(res.data));
        } else if (modalType === 'faq') {
          axios.get('/api/faqs').then(res => setFaqs(res.data));
        }
      })
      .catch(err => {
        setError(err.response?.data?.message || 'Action failed.');
      })
      .finally(() => setLoading(false));
  };

  const handleDeleteCRUD = (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type}?`)) return;
    const endpoint = type === 'news' ? `/api/news/${id}` : `/api/${type}s/${id}`;
    axios.delete(endpoint)
      .then(() => {
        flashSuccess(`${type} deleted successfully.`);
        if (type === 'pillar') setPillars(pillars.filter(x => x.id !== id));
        if (type === 'officer') setOfficers(officers.filter(x => x.id !== id));
        if (type === 'team') setTeams(teams.filter(x => x.id !== id));
        if (type === 'event') setEvents(events.filter(x => x.id !== id));
        if (type === 'news') setNews(news.filter(x => x.id !== id));
        if (type === 'faq') setFaqs(faqs.filter(x => x.id !== id));
      });
  };

  // Render Loading / Redirecting view
  if (isAuthenticated === null || !isAuthenticated) {
    return (
      <div className="admin-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  // Render main admin portal
  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <span className="brand-logo">JPCS</span>
          <div>
            <h3>JPCS Portal</h3>
            <span>OLSHCo Chapter</span>
          </div>
        </div>
        <nav className="sidebar-nav">
          <button className={`nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            ✉️ Inbox Messages
          </button>
          <button className={`nav-item ${activeTab === 'about' ? 'active' : ''}`} onClick={() => setActiveTab('about')}>
            📝 About Section
          </button>
          <button className={`nav-item ${activeTab === 'hero' ? 'active' : ''}`} onClick={() => setActiveTab('hero')}>
            🚀 Hero Section
          </button>
          <button className={`nav-item ${activeTab === 'officers' ? 'active' : ''}`} onClick={() => setActiveTab('officers')}>
            👥 Officers List
          </button>
          <button className={`nav-item ${activeTab === 'teams' ? 'active' : ''}`} onClick={() => setActiveTab('teams')}>
            💻 Specialized Teams
          </button>
          <button className={`nav-item ${activeTab === 'events' ? 'active' : ''}`} onClick={() => setActiveTab('events')}>
            📅 Events Manager
          </button>
          <button className={`nav-item ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>
            📰 News Manager
          </button>
        </nav>
        <div className="sidebar-footer">
          <button className="btn-logout" onClick={handleLogout}>Log Out 🚪</button>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="admin-main">
        <header className="admin-header">
          <h2>Dashboard Control Panel</h2>
          <span className="admin-user-tag">Welcome, Admin</span>
        </header>

        {success && <div className="admin-success-toast">{success}</div>}

        <div className="admin-content-area">
          {/* TAB: Messages Inbox */}
          {activeTab === 'messages' && (
            <div className="panel-card">
              <h3>User Submissions & Messages</h3>
              <p className="panel-desc">Review inquiries submitted via the Contact form.</p>
              
              <div className="messages-list">
                {messages.length === 0 ? (
                  <p className="empty-message">No messages received yet.</p>
                ) : (
                  messages.map(m => (
                    <div key={m.id} className="message-item">
                      <div className="message-item-header">
                        <h4>{m.subject}</h4>
                        <button className="btn-delete-msg" onClick={() => handleDeleteMessage(m.id)}>Delete</button>
                      </div>
                      <div className="message-meta">
                        <span><strong>From:</strong> {m.name} ({m.email})</span>
                        <span><strong>Submitted:</strong> {new Date(m.created_at).toLocaleString()}</span>
                      </div>
                      <p className="message-body">{m.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: About Section */}
          {activeTab === 'about' && (
            <div className="panel-layout">
              {/* Settings Form */}
              <div className="panel-card">
                <h3>Edit About Details</h3>
                <form onSubmit={handleSaveAbout} className="admin-form">
                  {error && <div className="admin-error-box">{error}</div>}
                  <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <h4 style={{ color: 'var(--green-900)', marginBottom: '12px' }}>Organization Branding</h4>
                    <div className="form-row">
                      <div className="form-group">
                        <label>Brand Name</label>
                        <input type="text" value={aboutSettings.brand_name || ''} onChange={e => setAboutSettings({...aboutSettings, brand_name: e.target.value})} required />
                      </div>
                      <div className="form-group">
                        <label>Brand Tagline/Subtext</label>
                        <input type="text" value={aboutSettings.brand_subtext || ''} onChange={e => setAboutSettings({...aboutSettings, brand_subtext: e.target.value})} required />
                      </div>
                    </div>
                    <div className="form-row" style={{ alignItems: 'center', gap: '24px' }}>
                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Brand Logo Image</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="brand-logo-file-input" 
                            onChange={handleLogoFileChange}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor="brand-logo-file-input" 
                            style={{
                              padding: '10px 18px',
                              background: 'var(--admin-primary-light)',
                              color: 'white',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              display: 'inline-block',
                              border: 'none',
                              textAlign: 'center'
                            }}
                          >
                            📁 Select File
                          </label>
                          {aboutSettings.brand_logo && (
                            <button
                              type="button"
                              onClick={handleRemoveLogo}
                              style={{
                                padding: '10px 18px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              ❌ Remove Logo
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', margin: '6px 0 0' }}>
                          Choose an image file (PNG, JPG, SVG, WebP) up to 2MB.
                        </p>
                      </div>
                      <div className="form-group" style={{ width: '120px', flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', marginBottom: '6px' }}>Logo Preview</label>
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '50%',
                          border: '2px dashed #cbd5e1',
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)'
                        }}>
                          {aboutSettings.brand_logo ? (
                            <img src={aboutSettings.brand_logo} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : (
                            <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--admin-primary-light)' }}>
                              {aboutSettings.brand_name ? aboutSettings.brand_name.split('-')[0] : 'JPCS'}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  <div style={{ borderBottom: '1px solid var(--gray-200)', paddingBottom: '16px', marginBottom: '16px' }}>
                    <h4 style={{ color: 'var(--green-900)', marginBottom: '12px' }}>About Section Illustrations</h4>
                    <div className="form-row" style={{ alignItems: 'flex-start', gap: '24px' }}>
                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Main Group Photo</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="about-img-main-input" 
                            onChange={(e) => handleAboutImageChange(e, 'about_img_main')}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor="about-img-main-input" 
                            style={{
                              padding: '10px 18px',
                              background: 'var(--admin-primary-light)',
                              color: 'white',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              display: 'inline-block',
                              border: 'none',
                              textAlign: 'center'
                            }}
                          >
                            📁 Select Main Image
                          </label>
                          {(aboutSettings.about_img_main && aboutSettings.about_img_main !== '/images/about_group.png') && (
                            <button
                              type="button"
                              onClick={() => setAboutSettings(prev => ({ ...prev, about_img_main: '/images/about_group.png' }))}
                              style={{
                                padding: '10px 18px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              ❌ Remove
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', margin: '6px 0 0' }}>
                          Choose an image file (PNG, JPG, WebP) up to 5MB.
                        </p>
                        <div style={{
                          marginTop: '12px',
                          width: '180px',
                          height: '110px',
                          borderRadius: '8px',
                          border: '2px dashed #cbd5e1',
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          position: 'relative'
                        }}>
                          {aboutSettings.about_img_main ? (
                            <>
                              <img src={aboutSettings.about_img_main} alt="Main Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              {aboutSettings.about_img_main === '/images/about_group.png' && (
                                <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.6rem', borderRadius: '4px', padding: '1px 5px' }}>Default</span>
                              )}
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No main image</span>
                          )}
                        </div>
                        {/* Caption for Main Image */}
                        <div style={{ marginTop: '10px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--admin-text-light)', display: 'block', marginBottom: '4px' }}>
                            📝 Image Caption <span style={{ fontWeight: 400, color: '#94a3b8' }}>(shown in lightbox)</span>
                          </label>
                          <input
                            type="text"
                            value={aboutSettings.about_img_main_caption || ''}
                            onChange={e => setAboutSettings({ ...aboutSettings, about_img_main_caption: e.target.value })}
                            placeholder="e.g. JPCS-OLSHCo members during the 2024 General Assembly"
                            maxLength={200}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              color: 'var(--admin-text)',
                              background: '#f8fafc',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '4px 0 0' }}>{(aboutSettings.about_img_main_caption || '').length}/200 characters</p>
                        </div>
                      </div>

                      <div className="form-group" style={{ flex: '1' }}>
                        <label>Secondary Lab Photo</label>
                        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '4px' }}>
                          <input 
                            type="file" 
                            accept="image/*" 
                            id="about-img-sub-input" 
                            onChange={(e) => handleAboutImageChange(e, 'about_img_sub')}
                            style={{ display: 'none' }}
                          />
                          <label 
                            htmlFor="about-img-sub-input" 
                            style={{
                              padding: '10px 18px',
                              background: 'var(--admin-primary-light)',
                              color: 'white',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: '0.85rem',
                              transition: 'all 0.2s ease',
                              display: 'inline-block',
                              border: 'none',
                              textAlign: 'center'
                            }}
                          >
                            📁 Select Sub Image
                          </label>
                          {(aboutSettings.about_img_sub && aboutSettings.about_img_sub !== '/images/about_lab.png') && (
                            <button
                              type="button"
                              onClick={() => setAboutSettings(prev => ({ ...prev, about_img_sub: '/images/about_lab.png' }))}
                              style={{
                                padding: '10px 18px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.85rem',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              ❌ Remove
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: '0.75rem', color: 'var(--admin-text-light)', margin: '6px 0 0' }}>
                          Choose an image file (PNG, JPG, WebP) up to 5MB.
                        </p>
                        <div style={{
                          marginTop: '12px',
                          width: '180px',
                          height: '110px',
                          borderRadius: '8px',
                          border: '2px dashed #cbd5e1',
                          background: '#f8fafc',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          overflow: 'hidden',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                          position: 'relative'
                        }}>
                          {aboutSettings.about_img_sub ? (
                            <>
                              <img src={aboutSettings.about_img_sub} alt="Sub Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              {aboutSettings.about_img_sub === '/images/about_lab.png' && (
                                <span style={{ position: 'absolute', bottom: 4, left: 4, background: 'rgba(0,0,0,0.5)', color: '#fff', fontSize: '0.6rem', borderRadius: '4px', padding: '1px 5px' }}>Default</span>
                              )}
                            </>
                          ) : (
                            <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>No sub image</span>
                          )}
                        </div>
                        {/* Caption for Sub Image */}
                        <div style={{ marginTop: '10px' }}>
                          <label style={{ fontSize: '0.78rem', color: 'var(--admin-text-light)', display: 'block', marginBottom: '4px' }}>
                            📝 Image Caption <span style={{ fontWeight: 400, color: '#94a3b8' }}>(shown in lightbox)</span>
                          </label>
                          <input
                            type="text"
                            value={aboutSettings.about_img_sub_caption || ''}
                            onChange={e => setAboutSettings({ ...aboutSettings, about_img_sub_caption: e.target.value })}
                            placeholder="e.g. Students during a hands-on coding lab session"
                            maxLength={200}
                            style={{
                              width: '100%',
                              padding: '8px 12px',
                              border: '1px solid #e2e8f0',
                              borderRadius: '6px',
                              fontSize: '0.85rem',
                              color: 'var(--admin-text)',
                              background: '#f8fafc',
                              outline: 'none',
                              boxSizing: 'border-box'
                            }}
                          />
                          <p style={{ fontSize: '0.7rem', color: '#94a3b8', margin: '4px 0 0' }}>{(aboutSettings.about_img_sub_caption || '').length}/200 characters</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Main About Title</label>
                    <input type="text" value={aboutSettings.about_title} onChange={e => setAboutSettings({...aboutSettings, about_title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>About Description</label>
                    <textarea rows={4} value={aboutSettings.about_description} onChange={e => setAboutSettings({...aboutSettings, about_description: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Organization History <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Shown on About Page)</span></label>
                    <textarea rows={5} value={aboutSettings.about_history || ''} onChange={e => setAboutSettings({...aboutSettings, about_history: e.target.value})} placeholder="Tell the story of your organization's founding and journey..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Stat count: Active Members</label>
                      <input type="text" value={aboutSettings.about_stat_members} onChange={e => setAboutSettings({...aboutSettings, about_stat_members: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Stat count: Annual Events</label>
                      <input type="text" value={aboutSettings.about_stat_events} onChange={e => setAboutSettings({...aboutSettings, about_stat_events: e.target.value})} required />
                    </div>
                  </div>
                  <button type="submit" className="btn-save-settings">Save About Information</button>
                </form>
              </div>

              {/* Mission & Vision Card */}
              <div className="panel-card">
                <h3>Edit Mission & Vision</h3>
                <p className="panel-desc">Manage the organization's core mission and vision statements.</p>
                <form onSubmit={handleSaveAbout} className="admin-form">
                  {error && <div className="admin-error-box">{error}</div>}
                  <div className="form-group">
                    <label>Mission Statement</label>
                    <textarea rows={3} value={aboutSettings.about_mission} onChange={e => setAboutSettings({...aboutSettings, about_mission: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Vision Statement</label>
                    <textarea rows={3} value={aboutSettings.about_vision} onChange={e => setAboutSettings({...aboutSettings, about_vision: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn-save-settings">Save Mission & Vision</button>
                </form>
              </div>

              {/* Pillars CRUD */}
              <div className="panel-card">
                <div className="panel-header-crud">
                  <h3>Pillars of the Chapter</h3>
                  <button className="btn-add-crud" onClick={() => {
                    setEditItem({ icon: '💡', title: '', desc: '' });
                    setModalType('pillar');
                    setIsNew(true);
                  }}>+ Add Pillar</button>
                </div>
                <div className="crud-list">
                  {pillars.map(p => (
                    <div key={p.id} className="crud-item">
                      <div className="crud-item-content">
                        <span className="crud-item-icon">{p.icon}</span>
                        <div>
                          <h4>{p.title}</h4>
                          <p>{p.desc}</p>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({ ...p });
                          setModalType('pillar');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('pillar', p.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* FAQ CRUD */}
              <div className="panel-card">
                <div className="panel-header-crud">
                  <h3>Frequently Asked Questions (FAQs)</h3>
                  <button className="btn-add-crud" onClick={() => {
                    setEditItem({ question: '', answer: '', order: faqs.length + 1 });
                    setModalType('faq');
                    setIsNew(true);
                  }}>+ Add FAQ</button>
                </div>
                <div className="crud-list">
                  {faqs.map(f => (
                    <div key={f.id} className="crud-item">
                      <div className="crud-item-content">
                        <div className="officer-order-num">{f.order}</div>
                        <div>
                          <h4>{f.question}</h4>
                          <p>{f.answer}</p>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({ ...f });
                          setModalType('faq');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('faq', f.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Settings */}
              <div className="panel-card">
                <h3>Contact Information</h3>
                <p className="panel-desc">Manage the contact details displayed on the public Contact section.</p>
                <form onSubmit={(e) => {
                  e.preventDefault();
                  setLoading(true);
                  axios.post('/api/contact-settings', contactSettings)
                    .then(() => flashSuccess('Contact settings saved.'))
                    .catch(() => setError('Failed to update contact settings.'))
                    .finally(() => setLoading(false));
                }} className="admin-form">
                  <div className="form-group">
                    <label>Office Address</label>
                    <input type="text" value={contactSettings.contact_address || ''} onChange={e => setContactSettings({...contactSettings, contact_address: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address</label>
                      <input type="email" value={contactSettings.contact_email || ''} onChange={e => setContactSettings({...contactSettings, contact_email: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Office Hours</label>
                      <input type="text" value={contactSettings.contact_hours || ''} onChange={e => setContactSettings({...contactSettings, contact_hours: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Facebook Handle</label>
                      <input type="text" value={contactSettings.contact_fb || ''} onChange={e => setContactSettings({...contactSettings, contact_fb: e.target.value})} required placeholder="@JPCS.OLSHCo on Facebook" />
                    </div>
                    <div className="form-group">
                      <label>Instagram Handle</label>
                      <input type="text" value={contactSettings.contact_ig || ''} onChange={e => setContactSettings({...contactSettings, contact_ig: e.target.value})} required placeholder="@jpcs_olshco on Instagram" />
                    </div>
                  </div>
                  <button type="submit" className="btn-save-settings">Save Contact Information</button>
                </form>
              </div>
            </div>
          )}

          {/* TAB: Hero Section */}
          {activeTab === 'hero' && (
            <div className="panel-card">
              <h3>Edit Hero Banner Details</h3>
              <p className="panel-desc">Manage the main headings, tagline, and motto displayed in the home hero banner. You can save up to 3 hero title sets, which will transition on the landing page.</p>
              <form onSubmit={handleSaveHero} className="admin-form">
                {error && <div className="admin-error-box">{error}</div>}
                
                {Array.from({ length: parseInt(heroSettings.hero_title_options_count || '3', 10) }).map((_, i) => {
                  const idx = i + 1;
                  const count = parseInt(heroSettings.hero_title_options_count || '3', 10);
                  return (
                    <fieldset key={idx} style={{ border: '1px solid var(--gray-200)', borderRadius: '8px', padding: '16px', marginBottom: '20px', position: 'relative' }}>
                      <legend style={{ padding: '0 8px', fontWeight: 'bold', color: 'var(--green-800)' }}>Hero Title Option {idx}</legend>
                      
                      {count > 1 && (
                        <button 
                          type="button" 
                          onClick={() => handleDeleteOption(idx)} 
                          style={{
                            position: 'absolute',
                            top: '-12px',
                            right: '16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            padding: '4px 10px',
                            fontSize: '0.75rem',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.15)'
                          }}
                        >
                          Remove Option
                        </button>
                      )}

                      <div className="form-group">
                        <label>Hero Title (Line 1)</label>
                        <input 
                          type="text" 
                          value={heroSettings[`hero_title_line1_${idx}`] || ''} 
                          onChange={e => setHeroSettings({...heroSettings, [`hero_title_line1_${idx}`]: e.target.value})} 
                          required 
                          placeholder={idx === 1 ? "Creating" : idx === 2 ? "Empowering" : "Engineering"} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Hero Title Accent (Highlighted Green Text)</label>
                        <input 
                          type="text" 
                          value={heroSettings[`hero_title_accent_${idx}`] || ''} 
                          onChange={e => setHeroSettings({...heroSettings, [`hero_title_accent_${idx}`]: e.target.value})} 
                          required 
                          placeholder={idx === 1 ? "Infinite" : idx === 2 ? " Tech" : " Our"} 
                        />
                      </div>
                      <div className="form-group">
                        <label>Hero Title (Line 2)</label>
                        <input 
                          type="text" 
                          value={heroSettings[`hero_title_line2_${idx}`] || ''} 
                          onChange={e => setHeroSettings({...heroSettings, [`hero_title_line2_${idx}`]: e.target.value})} 
                          required 
                          placeholder={idx === 1 ? "Possibilities" : idx === 2 ? " Leaders" : " Future"} 
                        />
                      </div>
                    </fieldset>
                  );
                })}

                {parseInt(heroSettings.hero_title_options_count || '3', 10) < 3 && (
                  <div style={{ marginBottom: '25px', textAlign: 'left' }}>
                    <button 
                      type="button" 
                      onClick={handleAddOption}
                      style={{
                        background: '#15803d',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '10px 18px',
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        fontWeight: '600',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'background 0.2s',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                      }}
                      onMouseOver={e => e.currentTarget.style.background = '#166534'}
                      onMouseOut={e => e.currentTarget.style.background = '#15803d'}
                    >
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
                      Add Title Option ({heroSettings.hero_title_options_count || '3'}/3)
                    </button>
                  </div>
                )}

                <div className="form-group">
                  <label>Hero Tagline</label>
                  <input 
                    type="text" 
                    value={heroSettings.hero_tagline || ''} 
                    onChange={e => setHeroSettings({...heroSettings, hero_tagline: e.target.value})} 
                    required 
                    placeholder="Build Dreams. Code Futures." 
                  />
                </div>
                <div className="form-group">
                  <label>Hero Motto</label>
                  <input 
                    type="text" 
                    value={heroSettings.hero_motto || ''} 
                    onChange={e => setHeroSettings({...heroSettings, hero_motto: e.target.value})} 
                    required 
                    placeholder="Ex Fide, Ad Futurum!" 
                  />
                </div>
                <button type="submit" className="btn-save-settings">Save Hero Details</button>
              </form>
            </div>
          )}

          {/* TAB: Officers */}
          {activeTab === 'officers' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>Chapter Officers</h3>
                <button className="btn-add-crud" onClick={() => {
                  setEditItem({ name: '', title: '', officer_name: '', year_level: '', motto: '', order: officers.length + 1 });
                  setModalType('officer');
                  setIsNew(true);
                }}>+ Add Officer</button>
              </div>
              <div className="crud-list">
                {officers.map(o => (
                  <div key={o.id} className="crud-item">
                    <div className="crud-item-content">
                      <div className="officer-order-num">{o.order}</div>
                      <div>
                        <h4>{o.name}{o.officer_name ? <span style={{ fontWeight: 500, color: 'var(--admin-text-light)', marginLeft: '8px' }}>— {o.officer_name}</span> : null}</h4>
                        <p>{o.year_level || ''}</p>
                        {o.motto && <p style={{ fontSize: '0.78rem', fontStyle: 'italic', color: '#94a3b8', marginTop: '2px' }}>"{o.motto}"</p>}
                      </div>
                    </div>
                    <div className="crud-item-actions">
                      <button className="btn-edit" onClick={() => {
                        setEditItem({ ...o });
                        setModalType('officer');
                        setIsNew(false);
                      }}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteCRUD('officer', o.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Teams */}
          {activeTab === 'teams' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>Specialized Teams</h3>
                <button className="btn-add-crud" onClick={() => {
                  setEditItem({ name: '', tagline: '', icon: '', duties: '', functions: '' });
                  setModalType('team');
                  setIsNew(true);
                }}>+ Add Team</button>
              </div>
              <div className="crud-list">
                {teams.map(t => (
                  <div key={t.id} className="crud-item crud-item--vertical">
                    <div className="crud-item-top">
                      <div className="crud-item-content">
                        <span className="crud-item-icon" style={{ color: '#15803d' }}>
                          {t.icon && t.icon.startsWith('/') ? (
                            <img src={t.icon} alt={t.name} style={{ width: '36px', height: '36px', objectFit: 'cover', borderRadius: '6px' }} />
                          ) : (
                            renderTeamIcon(t.icon)
                          )}
                        </span>
                        <div>
                          <h4>{t.name}</h4>
                          <span className="team-tagline-sub">{t.tagline}</span>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({
                            ...t,
                            duties: Array.isArray(t.duties) ? t.duties.join('\n') : '',
                            functions: Array.isArray(t.functions) ? t.functions.join('\n') : '',
                          });
                          setModalType('team');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('team', t.id)}>Delete</button>
                      </div>
                    </div>
                    <div className="team-lists-preview">
                      <div>
                        <strong>Duties:</strong>
                        <ul>
                          {Array.isArray(t.duties) && t.duties.map((d, i) => <li key={i}>{d}</li>)}
                        </ul>
                      </div>
                      <div>
                        <strong>Functions:</strong>
                        <ul>
                          {Array.isArray(t.functions) && t.functions.map((f, i) => <li key={i}>{f}</li>)}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB: Events */}
          {activeTab === 'events' && (
            <div className="panel-layout">
              {/* Events Section Header Settings */}
              <div className="panel-card">
                <h3>Edit Events Section Details</h3>
                <p className="panel-desc">Manage the section title and description displayed in the public Events page.</p>
                <form onSubmit={handleSaveEventsSettings} className="admin-form">
                  <div className="form-group">
                    <label>Events Section Title</label>
                    <input type="text" value={eventsSettings.events_title} onChange={e => setEventsSettings({...eventsSettings, events_title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Events Section Description</label>
                    <textarea rows={2} value={eventsSettings.events_description} onChange={e => setEventsSettings({...eventsSettings, events_description: e.target.value})} required />
                  </div>
                  <button type="submit" className="btn-save-settings">Save Events Details</button>
                </form>
              </div>

              {/* Events Manager CRUD */}
              <div className="panel-card">
                <div className="panel-header-crud">
                  <h3>Events Manager</h3>
                  <button className="btn-add-crud" onClick={() => {
                    setEditItem({
                      category: 'Workshop',
                      date: '',
                      title: '',
                      desc: '',
                      icon: '💻',
                      tag: 'Upcoming',
                      tagType: 'upcoming',
                      slots: '50 slots',
                      time: '',
                      venue: '',
                      image: ''
                    });
                    setModalType('event');
                    setIsNew(true);
                  }}>+ Add Event</button>
                </div>
                <div className="crud-list">
                  {events.map(ev => (
                    <div key={ev.id} className="crud-item">
                      <div className="crud-item-content">
                        <span className="crud-item-icon">{ev.icon}</span>
                        <div>
                          <h4>{ev.title}</h4>
                          <p className="item-secondary-meta">Category: {ev.category} | Date: {ev.date} | Venue: {ev.venue}</p>
                          <p className="item-body-preview">{ev.desc}</p>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({ ...ev });
                          setModalType('event');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('event', ev.id)}>Delete</button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: News */}
          {activeTab === 'news' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>News & Articles</h3>
                <button className="btn-add-crud" onClick={() => {
                  setEditItem({
                    category: 'Announcement',
                    date: '',
                    title: '',
                    excerpt: '',
                    content: '',
                    readTime: '3 min read',
                    featured: false,
                    emoji: '📣',
                    images: []
                  });
                  setModalType('news');
                  setIsNew(true);
                }}>+ Add News</button>
              </div>
              <div className="crud-list">
                {news.map(n => (
                  <div key={n.id} className="crud-item">
                    <div className="crud-item-content">
                      <span className="crud-item-icon">{n.emoji}</span>
                      <div>
                        <h4>{n.title} {n.featured && <span className="featured-pill">Featured</span>}</h4>
                        <p className="item-secondary-meta">Category: {n.category} | Date: {n.date} | Read time: {n.readTime}</p>
                        <p className="item-body-preview">{n.excerpt}</p>
                      </div>
                    </div>
                    <div className="crud-item-actions">
                      <button className="btn-edit" onClick={() => {
                        setEditItem({ ...n, content: n.content || '', images: n.images || [] });
                        setModalType('news');
                        setIsNew(false);
                      }}>Edit</button>
                      <button className="btn-delete" onClick={() => handleDeleteCRUD('news', n.id)}>Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* CRUD Edit Dialog Modal */}
      {editItem && (
        <div className="admin-modal-overlay">
          <div className="admin-modal-box">
            <h3>{isNew ? 'Create New' : 'Edit'} {modalType.toUpperCase()}</h3>
            <form onSubmit={handleSaveCRUD} className="admin-form">
              {error && <div className="admin-error-box">{error}</div>}

              {/* PILLAR FIELDS */}
              {modalType === 'pillar' && (
                <>
                  <div className="form-group">
                    <label>Pillar Icon (Emoji or Char)</label>
                    <input type="text" value={editItem.icon} onChange={e => setEditItem({...editItem, icon: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} value={editItem.desc} onChange={e => setEditItem({...editItem, desc: e.target.value})} required />
                  </div>
                </>
              )}

              {/* OFFICER FIELDS */}
              {modalType === 'officer' && (
                <>
                  <div className="form-group">
                    <label>Position / Role (e.g., President)</label>
                    <input type="text" value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Officer's Name <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                      <input type="text" value={editItem.officer_name || ''} onChange={e => setEditItem({...editItem, officer_name: e.target.value})} placeholder="e.g., Juan dela Cruz" />
                    </div>
                    <div className="form-group">
                      <label>Year Level <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                      <input type="text" value={editItem.year_level || ''} onChange={e => setEditItem({...editItem, year_level: e.target.value})} placeholder="e.g., 3rd Year BSIT" />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Motto <span style={{ fontWeight: 400, color: '#94a3b8' }}>(Optional)</span></label>
                    <input type="text" value={editItem.motto || ''} onChange={e => setEditItem({...editItem, motto: e.target.value})} placeholder="e.g., Lead with integrity" />
                  </div>
                  <div className="form-group">
                    <label>Sort Order Index</label>
                    <input type="number" value={editItem.order} onChange={e => setEditItem({...editItem, order: parseInt(e.target.value) || 0})} required />
                  </div>
                </>
              )}

              {/* TEAM FIELDS */}
              {modalType === 'team' && (
                <>
                  <div className="form-group">
                    <label>Team Name</label>
                    <input type="text" value={editItem.name} onChange={e => setEditItem({...editItem, name: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Tagline</label>
                    <input type="text" value={editItem.tagline} onChange={e => setEditItem({...editItem, tagline: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group" style={{ flex: 1 }}>
                      <label>Team Logo Image</label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (!file) return;
                            if (file.size > 2 * 1024 * 1024) {
                              setError('File size must be less than 2MB.');
                              return;
                            }
                            const formData = new FormData();
                            formData.append('logo', file);
                            setLoading(true);
                            setError('');
                            axios.post('/api/teams/upload-logo', formData, {
                              headers: { 'Content-Type': 'multipart/form-data' }
                            })
                            .then(res => {
                              if (res.data.success) {
                                setEditItem(prev => ({ ...prev, icon: res.data.path }));
                                flashSuccess('Team logo uploaded.');
                              }
                            })
                            .catch(err => setError(err.response?.data?.message || 'Upload failed.'))
                            .finally(() => setLoading(false));
                          }}
                          style={{ fontSize: '0.85rem' }}
                        />
                        {editItem.icon && editItem.icon.startsWith('/') && (
                          <button
                            type="button"
                            onClick={() => setEditItem(prev => ({ ...prev, icon: '' }))}
                            style={{
                              padding: '6px 12px',
                              background: '#fef2f2',
                              color: '#dc2626',
                              border: '1px solid #fca5a5',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            ❌ Remove
                          </button>
                        )}
                      </div>
                      <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)', margin: '4px 0 0' }}>
                        PNG, JPG, SVG, WebP up to 2MB.
                      </p>
                    </div>
                    <div className="form-group" style={{ width: '100px', flex: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', marginBottom: '6px' }}>Preview</label>
                      <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '10px',
                        border: '2px dashed #cbd5e1',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden'
                      }}>
                        {editItem.icon && editItem.icon.startsWith('/') ? (
                          <img src={editItem.icon} alt="Logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8' }}>No logo</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Duties & Responsibilities (One duty per line)</label>
                    <textarea rows={4} value={editItem.duties} onChange={e => setEditItem({...editItem, duties: e.target.value})} required placeholder="Line 1 duty&#13;Line 2 duty" />
                  </div>
                  <div className="form-group">
                    <label>Departmental Functions (One function per line)</label>
                    <textarea rows={4} value={editItem.functions} onChange={e => setEditItem({...editItem, functions: e.target.value})} required placeholder="Line 1 function&#13;Line 2 function" />
                  </div>
                </>
              )}

              {/* EVENT FIELDS */}
              {modalType === 'event' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} required>
                        <option>Workshop</option>
                        <option>Seminar</option>
                        <option>Competition</option>
                        <option>Social</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Event Icon (Emoji)</label>
                      <input type="text" value={editItem.icon} onChange={e => setEditItem({...editItem, icon: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Event Title</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} value={editItem.desc} onChange={e => setEditItem({...editItem, desc: e.target.value})} required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Event Date (e.g., Jul 12, 2026)</label>
                      <input type="text" value={editItem.date} onChange={e => setEditItem({...editItem, date: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Event Time (e.g., 9:00 AM – 4:00 PM)</label>
                      <input type="text" value={editItem.time} onChange={e => setEditItem({...editItem, time: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Slots (e.g., 50 slots, Open to all)</label>
                      <input type="text" value={editItem.slots} onChange={e => setEditItem({...editItem, slots: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Venue (e.g., IT Laboratory 1)</label>
                      <input type="text" value={editItem.venue} onChange={e => setEditItem({...editItem, venue: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Status Tag Text (e.g., Upcoming, Registration Open)</label>
                      <input type="text" value={editItem.tag} onChange={e => setEditItem({...editItem, tag: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Status Color Type</label>
                      <select value={editItem.tagType} onChange={e => setEditItem({...editItem, tagType: e.target.value})} required>
                        <option value="upcoming">Upcoming (Green)</option>
                        <option value="open">Registration Open (Blue)</option>
                        <option value="done">Completed (Gray)</option>
                      </select>
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Event Poster Image</label>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="file"
                            accept="image/png,image/jpeg,image/jpg,image/svg+xml,image/webp,image/gif"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                setError('File size must be less than 5MB.');
                                return;
                              }
                              const formData = new FormData();
                              formData.append('poster', file);
                              setLoading(true);
                              setError('');
                              axios.post('/api/events/upload-poster', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              })
                              .then(res => {
                                if (res.data.success) {
                                  setEditItem(prev => ({ ...prev, image: res.data.path }));
                                  flashSuccess('Poster uploaded.');
                                }
                              })
                              .catch(err => setError(err.response?.data?.message || 'Upload failed.'))
                              .finally(() => setLoading(false));
                            }}
                            style={{ fontSize: '0.85rem' }}
                          />
                          {editItem.image && (
                            <button
                              type="button"
                              onClick={() => setEditItem(prev => ({ ...prev, image: '' }))}
                              style={{
                                padding: '6px 12px',
                                background: '#fef2f2',
                                color: '#dc2626',
                                border: '1px solid #fca5a5',
                                borderRadius: '6px',
                                cursor: 'pointer',
                                fontWeight: '700',
                                fontSize: '0.75rem',
                                whiteSpace: 'nowrap'
                              }}
                            >
                              ❌ Remove
                            </button>
                          )}
                        </div>
                        <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)', margin: '4px 0 0' }}>
                          PNG, JPG, SVG, WebP up to 5MB. Optional.
                        </p>
                      </div>
                      <div style={{
                        width: '120px',
                        minHeight: '80px',
                        borderRadius: '10px',
                        border: '2px dashed #cbd5e1',
                        background: '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {editItem.image ? (
                          <img src={editItem.image} alt="Poster" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} />
                        ) : (
                          <span style={{ fontSize: '0.65rem', fontWeight: 'bold', color: '#94a3b8', textAlign: 'center', padding: '8px' }}>No poster</span>
                        )}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* NEWS FIELDS */}
              {modalType === 'news' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Category</label>
                      <select value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} required>
                        <option>Announcement</option>
                        <option>Partnership</option>
                        <option>Academic</option>
                        <option>Community</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Article Emoji</label>
                      <input type="text" value={editItem.emoji} onChange={e => setEditItem({...editItem, emoji: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Article Title</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Excerpt / Summary</label>
                    <textarea rows={3} value={editItem.excerpt} onChange={e => setEditItem({...editItem, excerpt: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Article Images (Max 5 images)</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '8px', marginTop: '4px' }}>
                      {(editItem.images || []).map((imgUrl, idx) => (
                        <div key={idx} style={{ position: 'relative', width: '80px', height: '80px', borderRadius: '8px', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                          <img src={imgUrl} alt={`news-${idx}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedImages = editItem.images.filter((_, i) => i !== idx);
                              setEditItem({ ...editItem, images: updatedImages });
                            }}
                            style={{
                              position: 'absolute',
                              top: '2px',
                              right: '2px',
                              width: '20px',
                              height: '20px',
                              borderRadius: '50%',
                              background: 'rgba(220, 38, 38, 0.85)',
                              color: 'white',
                              border: 'none',
                              fontSize: '10px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold'
                            }}
                          >
                            ×
                          </button>
                        </div>
                      ))}
                      {(editItem.images || []).length < 5 && (
                        <div style={{
                          width: '80px',
                          height: '80px',
                          borderRadius: '8px',
                          border: '2px dashed #cbd5e1',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          background: '#f8fafc',
                          position: 'relative',
                          cursor: 'pointer'
                        }}>
                          <span style={{ fontSize: '24px', color: '#94a3b8' }}>+</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                              const file = e.target.files[0];
                              if (!file) return;
                              if (file.size > 5 * 1024 * 1024) {
                                setError('File size must be less than 5MB.');
                                return;
                              }
                              const formData = new FormData();
                              formData.append('image', file);
                              setLoading(true);
                              setError('');
                              axios.post('/api/news/upload-image', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              })
                              .then(res => {
                                if (res.data.success) {
                                  const currentImages = editItem.images || [];
                                  setEditItem({ ...editItem, images: [...currentImages, res.data.path] });
                                  flashSuccess('Image uploaded.');
                                }
                              })
                              .catch(err => setError(err.response?.data?.message || 'Upload failed.'))
                              .finally(() => setLoading(false));
                            }}
                            style={{
                              position: 'absolute',
                              inset: 0,
                              opacity: 0,
                              cursor: 'pointer'
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <p style={{ fontSize: '0.72rem', color: 'var(--admin-text-light)', margin: 0 }}>
                      PNG, JPG, WebP up to 5MB. Optional.
                    </p>
                  </div>
                  <div className="form-group">
                    <label>Full Article Content</label>
                    <textarea rows={8} value={editItem.content || ''} onChange={e => setEditItem({...editItem, content: e.target.value})} required placeholder="Write the full article body here..." />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date (e.g., June 10, 2026)</label>
                      <input 
                        type="date" 
                        value={formatDateToISO(editItem.date)} 
                        onChange={e => setEditItem({...editItem, date: formatDateToHuman(e.target.value)})} 
                        required 
                      />
                    </div>
                    <div className="form-group">
                      <label>Read Time Tag (e.g., 3 min read)</label>
                      <input type="text" value={editItem.readTime} onChange={e => setEditItem({...editItem, readTime: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group form-group--checkbox">
                    <input type="checkbox" id="featured" checked={editItem.featured} onChange={e => setEditItem({...editItem, featured: e.target.checked})} />
                    <label htmlFor="featured">Feature this article at the top of the news section</label>
                  </div>
                </>
              )}

              {/* FAQ FIELDS */}
              {modalType === 'faq' && (
                <>
                  <div className="form-group">
                    <label>Question</label>
                    <input type="text" value={editItem.question} onChange={e => setEditItem({...editItem, question: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Answer</label>
                    <textarea rows={4} value={editItem.answer} onChange={e => setEditItem({...editItem, answer: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Sort Order Index</label>
                    <input type="number" value={editItem.order} onChange={e => setEditItem({...editItem, order: parseInt(e.target.value) || 0})} required />
                  </div>
                </>
              )}

              <div className="modal-actions">
                <button type="submit" disabled={loading} className="btn-modal-save">
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" className="btn-modal-cancel" onClick={() => setEditItem(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
