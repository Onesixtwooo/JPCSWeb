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
  const [resources, setResources] = useState([]);
  const [careerPaths, setCareerPaths] = useState([]);
  const [alumniTestimonials, setAlumniTestimonials] = useState([]);
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

  const [newsSearch, setNewsSearch] = useState('');
  const [newsSort, setNewsSort] = useState('date-desc');

  const [eventsSearch, setEventsSearch] = useState('');
  const [eventsSort, setEventsSort] = useState('date-desc');

  const [officersSearch, setOfficersSearch] = useState('');

  const [resourcesSearch, setResourcesSearch] = useState('');

  const [careersSearch, setCareersSearch] = useState('');
  const [careersSort, setCareersSort] = useState('order-asc');

  const [alumniSearch, setAlumniSearch] = useState('');
  const [alumniSort, setAlumniSort] = useState('order-asc');
  const [alumniShareLink, setAlumniShareLink] = useState('/#contact');

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
    } else if (activeTab === 'resources') {
      axios.get('/api/student-resources').then(res => setResources(res.data));
    } else if (activeTab === 'careers') {
      axios.get('/api/career-paths').then(res => setCareerPaths(res.data));
    } else if (activeTab === 'alumni') {
      axios.get('/api/alumni-testimonials').then(res => setAlumniTestimonials(res.data));
      axios.get('/api/alumni-share-link').then(res => setAlumniShareLink(res.data.link));
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

  const getFilteredNews = () => {
    let result = [...news];

    // 1. Search Filter
    if (newsSearch.trim() !== '') {
      const q = newsSearch.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(q)) ||
        (item.content && item.content.toLowerCase().includes(q))
      );
    }

    // 2. Sorting
    result.sort((a, b) => {
      if (newsSort === 'date-desc') {
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      }
      if (newsSort === 'date-asc') {
        return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
      }
      if (newsSort === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (newsSort === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      if (newsSort === 'featured-first') {
        return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
      }
      return 0;
    });

    return result;
  };

  const getFilteredEvents = () => {
    let result = [...events];

    // 1. Search Filter
    if (eventsSearch.trim() !== '') {
      const q = eventsSearch.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.venue && item.venue.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q))
      );
    }

    // 2. Sorting
    result.sort((a, b) => {
      if (eventsSort === 'date-desc') {
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date);
      }
      if (eventsSort === 'date-asc') {
        return new Date(a.created_at || a.date) - new Date(b.created_at || b.date);
      }
      if (eventsSort === 'title-asc') {
        return (a.title || '').localeCompare(b.title || '');
      }
      if (eventsSort === 'title-desc') {
        return (b.title || '').localeCompare(a.title || '');
      }
      return 0;
    });

    return result;
  };

  const getFilteredOfficers = () => {
    let result = [...officers];
    if (officersSearch.trim() !== '') {
      const q = officersSearch.toLowerCase();
      result = result.filter(item => 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.officer_name && item.officer_name.toLowerCase().includes(q)) ||
        (item.year_level && item.year_level.toLowerCase().includes(q)) ||
        (item.motto && item.motto.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const getFilteredResources = () => {
    let result = [...resources];
    if (resourcesSearch.trim() !== '') {
      const q = resourcesSearch.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.category && item.category.toLowerCase().includes(q)) ||
        (item.description && item.description.toLowerCase().includes(q))
      );
    }
    return result;
  };

  const getFilteredCareers = () => {
    let result = [...careerPaths];
    if (careersSearch.trim() !== '') {
      const q = careersSearch.toLowerCase();
      result = result.filter(item => 
        (item.title && item.title.toLowerCase().includes(q)) ||
        (item.outlook && item.outlook.toLowerCase().includes(q)) ||
        (item.salary && item.salary.toLowerCase().includes(q)) ||
        (item.desc && item.desc.toLowerCase().includes(q)) ||
        (Array.isArray(item.tags) && item.tags.some(t => t.toLowerCase().includes(q))) ||
        (Array.isArray(item.skills) && item.skills.some(s => s.toLowerCase().includes(q)))
      );
    }
    result.sort((a, b) => {
      if (careersSort === 'order-asc') return (a.order || 0) - (b.order || 0);
      if (careersSort === 'order-desc') return (b.order || 0) - (a.order || 0);
      if (careersSort === 'title-asc') return (a.title || '').localeCompare(b.title || '');
      if (careersSort === 'title-desc') return (b.title || '').localeCompare(a.title || '');
      return 0;
    });
    return result;
  };

  const getFilteredAlumni = () => {
    let result = [...alumniTestimonials];
    if (alumniSearch.trim() !== '') {
      const q = alumniSearch.toLowerCase();
      result = result.filter(item => 
        (item.name && item.name.toLowerCase().includes(q)) ||
        (item.role && item.role.toLowerCase().includes(q)) ||
        (item.company && item.company.toLowerCase().includes(q)) ||
        (item.year && item.year.toLowerCase().includes(q)) ||
        (item.quote && item.quote.toLowerCase().includes(q))
      );
    }
    result.sort((a, b) => {
      if (alumniSort === 'order-asc') return (a.order || 0) - (b.order || 0);
      if (alumniSort === 'order-desc') return (b.order || 0) - (a.order || 0);
      if (alumniSort === 'name-asc') return (a.name || '').localeCompare(b.name || '');
      if (alumniSort === 'name-desc') return (b.name || '').localeCompare(a.name || '');
      if (alumniSort === 'year-desc') return (b.year || '').localeCompare(a.year || '');
      return 0;
    });
    return result;
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
    if (modalType === 'career-path') {
      if (typeof payload.tags === 'string') {
        payload.tags = payload.tags.split(',').map(t => t.trim()).filter(t => t !== '');
      }
      if (typeof payload.skills === 'string') {
        payload.skills = payload.skills.split(',').map(s => s.trim()).filter(s => s !== '');
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
        } else if (modalType === 'student-resource') {
          axios.get('/api/student-resources').then(res => setResources(res.data));
        } else if (modalType === 'career-path') {
          axios.get('/api/career-paths').then(res => setCareerPaths(res.data));
        } else if (modalType === 'alumni-testimonial') {
          axios.get('/api/alumni-testimonials').then(res => setAlumniTestimonials(res.data));
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
        if (type === 'student-resource') setResources(resources.filter(x => x.id !== id));
        if (type === 'career-path') setCareerPaths(careerPaths.filter(x => x.id !== id));
        if (type === 'alumni-testimonial') setAlumniTestimonials(alumniTestimonials.filter(x => x.id !== id));
      });
  };

  const handleSaveAlumniShareLink = (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    axios.post('/api/alumni-share-link', { link: alumniShareLink })
      .then(res => {
        setAlumniShareLink(res.data.link);
        flashSuccess('Alumni share link updated successfully.');
        Swal.fire({
          title: 'Success!',
          text: 'Alumni share link updated successfully!',
          icon: 'success',
          confirmButtonColor: '#15803d',
        });
      })
      .catch(() => setError('Failed to update alumni share link.'))
      .finally(() => setLoading(false));
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
          <button className={`nav-item ${activeTab === 'resources' ? 'active' : ''}`} onClick={() => setActiveTab('resources')}>
            📁 Student Resources
          </button>
          <button className={`nav-item ${activeTab === 'careers' ? 'active' : ''}`} onClick={() => setActiveTab('careers')}>
            💼 Career Board
          </button>
          <button className={`nav-item ${activeTab === 'alumni' ? 'active' : ''}`} onClick={() => setActiveTab('alumni')}>
            🎓 Alumni Board
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

              {/* Search Bar */}
              <div style={{
                marginBottom: '20px',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search officers by role, name, year, motto..."
                  value={officersSearch}
                  onChange={e => setOfficersSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s'
                  }}
                />
                {officersSearch && (
                  <button
                    onClick={() => setOfficersSearch('')}
                    style={{
                      position: 'absolute',
                      right: '28px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#64748b',
                      padding: 0
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>

              <div className="crud-list">
                {getFilteredOfficers().length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                    No officers match your search criteria.
                  </p>
                ) : (
                  getFilteredOfficers().map(o => (
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
                  ))
                )}
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

                {/* Search & Sort Controls Bar */}
                <div style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  background: '#f8fafc',
                  padding: '16px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  alignItems: 'center'
                }}>
                  <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                    <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                    <input
                      type="text"
                      placeholder="Search events by title, category, venue..."
                      value={eventsSearch}
                      onChange={e => setEventsSearch(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px 10px 36px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        fontFamily: 'inherit',
                        outline: 'none',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                        transition: 'border-color 0.2s'
                      }}
                    />
                    {eventsSearch && (
                      <button
                        onClick={() => setEventsSearch('')}
                        style={{
                          position: 'absolute',
                          right: '12px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          border: 'none',
                          background: 'transparent',
                          cursor: 'pointer',
                          fontSize: '0.85rem',
                          color: '#64748b',
                          padding: 0
                        }}
                      >
                        ❌
                      </button>
                    )}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', whiteSpace: 'nowrap' }}>Sort By:</label>
                    <select
                      value={eventsSort}
                      onChange={e => setEventsSort(e.target.value)}
                      style={{
                        padding: '10px 14px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        fontSize: '0.9rem',
                        background: 'white',
                        fontFamily: 'inherit',
                        outline: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="date-desc">Newest First</option>
                      <option value="date-asc">Oldest First</option>
                      <option value="title-asc">Title A-Z</option>
                      <option value="title-desc">Title Z-A</option>
                    </select>
                  </div>
                </div>

                <div className="crud-list">
                  {getFilteredEvents().length === 0 ? (
                    <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                      No events match your search criteria.
                    </p>
                  ) : (
                    getFilteredEvents().map(ev => (
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
                    ))
                  )}
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

              {/* Search & Sort Controls Bar */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search by title, category, content..."
                    value={newsSearch}
                    onChange={e => setNewsSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {newsSearch && (
                    <button
                      onClick={() => setNewsSearch('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        padding: 0
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', whiteSpace: 'nowrap' }}>Sort By:</label>
                  <select
                    value={newsSort}
                    onChange={e => setNewsSort(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      background: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="date-desc">Newest First</option>
                    <option value="date-asc">Oldest First</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                    <option value="featured-first">Featured First</option>
                  </select>
                </div>
              </div>

              <div className="crud-list">
                {getFilteredNews().length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                    No news articles match your search criteria.
                  </p>
                ) : (
                  getFilteredNews().map(n => (
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
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: Student Resources */}
          {activeTab === 'resources' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>Student & Member Resources</h3>
                <button className="btn-add-crud" onClick={() => {
                  setEditItem({
                    category: 'Academic Templates',
                    title: '',
                    description: '',
                    date_modified: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
                    download_link_1: '',
                    download_link_2: '',
                    order: resources.length + 1
                  });
                  setModalType('student-resource');
                  setIsNew(true);
                }}>+ Add Resource</button>
              </div>

              {/* Search Bar */}
              <div style={{
                marginBottom: '20px',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                position: 'relative'
              }}>
                <span style={{ position: 'absolute', left: '28px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                <input
                  type="text"
                  placeholder="Search resources by title, category, description..."
                  value={resourcesSearch}
                  onChange={e => setResourcesSearch(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px 10px 36px',
                    borderRadius: '6px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                    transition: 'border-color 0.2s'
                  }}
                />
                {resourcesSearch && (
                  <button
                    onClick={() => setResourcesSearch('')}
                    style={{
                      position: 'absolute',
                      right: '28px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      fontSize: '0.85rem',
                      color: '#64748b',
                      padding: 0
                    }}
                  >
                    ❌
                  </button>
                )}
              </div>

              <div className="crud-list">
                {getFilteredResources().length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                    No resources match your search criteria.
                  </p>
                ) : (
                  getFilteredResources().map(r => (
                    <div key={r.id} className="crud-item">
                      <div className="crud-item-content">
                        <span className="crud-item-icon">📁</span>
                        <div>
                          <h4>{r.title}</h4>
                          <p className="item-secondary-meta">Category: {r.category} | Modified: {r.date_modified} | Order: {r.order}</p>
                          <p className="item-body-preview">{r.description}</p>
                          <div style={{ marginTop: '8px', display: 'flex', gap: '8px' }}>
                            <a href={r.download_link_1} target="_blank" rel="noopener noreferrer" className="badge-meta" style={{ textDecoration: 'none', background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>Download Link 1 🔗</a>
                            {r.download_link_2 && (
                              <a href={r.download_link_2} target="_blank" rel="noopener noreferrer" className="badge-meta" style={{ textDecoration: 'none', background: '#fef3c7', color: '#d97706', fontSize: '0.75rem', padding: '4px 8px', borderRadius: '4px' }}>Download Link 2 🔗</a>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({ ...r, description: r.description || '', download_link_2: r.download_link_2 || '' });
                          setModalType('student-resource');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('student-resource', r.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: Career Board */}
          {activeTab === 'careers' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>IT Career Paths</h3>
                <button className="btn-add-crud" onClick={() => {
                  setEditItem({
                    icon: '💻',
                    title: '',
                    tags: '',
                    desc: '',
                    skills: '',
                    outlook: 'High Demand',
                    salary: '',
                    color: '#4f46e5',
                    order: careerPaths.length + 1
                  });
                  setModalType('career-path');
                  setIsNew(true);
                }}>+ Add Career Path</button>
              </div>
              <p className="panel-desc" style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem', marginBottom: '16px' }}>Manage the IT career paths displayed on the public career page.</p>

              {/* Search & Sort Controls Bar */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search careers by title, outlook, tags, description..."
                    value={careersSearch}
                    onChange={e => setCareersSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {careersSearch && (
                    <button
                      onClick={() => setCareersSearch('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        padding: 0
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', whiteSpace: 'nowrap' }}>Sort By:</label>
                  <select
                    value={careersSort}
                    onChange={e => setCareersSort(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      background: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="order-asc">Default Order (Low to High)</option>
                    <option value="order-desc">Default Order (High to Low)</option>
                    <option value="title-asc">Title A-Z</option>
                    <option value="title-desc">Title Z-A</option>
                  </select>
                </div>
              </div>

              <div className="crud-list">
                {getFilteredCareers().length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                    No career paths match your search criteria.
                  </p>
                ) : (
                  getFilteredCareers().map(c => (
                    <div key={c.id} className="crud-item">
                      <div className="crud-item-content">
                        <span className="crud-item-icon" style={{ background: c.color + '1a', color: c.color, width: '48px', height: '48px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '8px', fontSize: '1.5rem', flexShrink: 0 }}>
                          {c.icon}
                        </span>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0' }}>{c.title}</h4>
                          <p className="item-secondary-meta" style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                            Outlook: <strong>{c.outlook}</strong> | Salary: <strong>{c.salary}</strong> | Order: {c.order}
                          </p>
                          <p className="item-body-preview" style={{ margin: 0, fontSize: '0.85rem' }}>{c.desc}</p>
                          <div style={{ display: 'flex', gap: '6px', marginTop: '8px', flexWrap: 'wrap' }}>
                            {(Array.isArray(c.tags) ? c.tags : []).map(t => (
                              <span key={t} className="badge-meta" style={{ background: '#e2e8f0', color: '#475569', fontSize: '0.7rem', padding: '2px 6px', borderRadius: '4px' }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({
                            ...c,
                            tags: Array.isArray(c.tags) ? c.tags.join(', ') : c.tags,
                            skills: Array.isArray(c.skills) ? c.skills.join(', ') : c.skills
                          });
                          setModalType('career-path');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('career-path', c.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB: Alumni Board */}
          {activeTab === 'alumni' && (
            <div className="panel-card">
              <div className="panel-header-crud">
                <h3>Alumni Testimonials</h3>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
                  <form onSubmit={handleSaveAlumniShareLink} style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f1f5f9', padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
                    <label style={{ fontSize: '0.78rem', fontWeight: '600', color: '#475569', whiteSpace: 'nowrap', margin: 0, textTransform: 'none' }}>Share Link:</label>
                    <input
                      type="text"
                      placeholder="e.g. /#contact or Google Form URL"
                      value={alumniShareLink}
                      onChange={e => setAlumniShareLink(e.target.value)}
                      style={{
                        padding: '6px 10px',
                        border: '1px solid #cbd5e1',
                        borderRadius: '4px',
                        fontSize: '0.82rem',
                        outline: 'none',
                        width: '240px',
                        fontFamily: 'inherit',
                        background: 'white'
                      }}
                    />
                    <button type="submit" className="btn-edit" style={{ padding: '6px 12px', whiteSpace: 'nowrap', margin: 0, height: '34px', display: 'flex', alignItems: 'center' }}>Save Link</button>
                  </form>
                  <button className="btn-add-crud" onClick={() => {
                    setEditItem({
                      name: '',
                      role: '',
                      company: '',
                      year: '',
                      quote: '',
                      avatar: '',
                      image: '',
                      color: '#0891b2',
                      order: alumniTestimonials.length + 1
                    });
                    setModalType('alumni-testimonial');
                    setIsNew(true);
                  }}>+ Add Alumni Story</button>
                </div>
              </div>
              <p className="panel-desc" style={{ color: 'var(--admin-text-light)', fontSize: '0.85rem', marginBottom: '16px' }}>Manage alumni success stories and testimonials featured on the career page.</p>

              {/* Search & Sort Controls Bar */}
              <div style={{
                display: 'flex',
                gap: '16px',
                marginBottom: '20px',
                flexWrap: 'wrap',
                background: '#f8fafc',
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #e2e8f0',
                alignItems: 'center'
              }}>
                <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}>🔍</span>
                  <input
                    type="text"
                    placeholder="Search alumni by name, role, company, quote..."
                    value={alumniSearch}
                    onChange={e => setAlumniSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 12px 10px 36px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      fontFamily: 'inherit',
                      outline: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.02)',
                      transition: 'border-color 0.2s'
                    }}
                  />
                  {alumniSearch && (
                    <button
                      onClick={() => setAlumniSearch('')}
                      style={{
                        position: 'absolute',
                        right: '12px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        border: 'none',
                        background: 'transparent',
                        cursor: 'pointer',
                        fontSize: '0.85rem',
                        color: '#64748b',
                        padding: 0
                      }}
                    >
                      ❌
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <label style={{ fontSize: '0.85rem', fontWeight: 'bold', color: '#475569', whiteSpace: 'nowrap' }}>Sort By:</label>
                  <select
                    value={alumniSort}
                    onChange={e => setAlumniSort(e.target.value)}
                    style={{
                      padding: '10px 14px',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1',
                      fontSize: '0.9rem',
                      background: 'white',
                      fontFamily: 'inherit',
                      outline: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    <option value="order-asc">Default Order (Low to High)</option>
                    <option value="order-desc">Default Order (High to Low)</option>
                    <option value="name-asc">Name A-Z</option>
                    <option value="name-desc">Name Z-A</option>
                    <option value="year-desc">Year (Newest to Oldest)</option>
                  </select>
                </div>
              </div>

              <div className="crud-list">
                {getFilteredAlumni().length === 0 ? (
                  <p className="empty-message" style={{ textAlign: 'center', color: '#64748b', padding: '24px', width: '100%' }}>
                    No alumni stories match your search criteria.
                  </p>
                ) : (
                  getFilteredAlumni().map(a => (
                    <div key={a.id} className="crud-item">
                      <div className="crud-item-content">
                        <span className="crud-item-icon" style={{ background: a.color, color: '#fff', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', fontSize: '1rem', fontWeight: 'bold', flexShrink: 0, overflow: 'hidden' }}>
                          {a.image ? (
                            <img src={a.image} alt={a.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          ) : a.avatar ? (
                            a.avatar
                          ) : (
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: '20px', height: '20px', opacity: 0.9 }}>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                          )}
                        </span>
                        <div>
                          <h4 style={{ margin: '0 0 4px 0' }}>{a.name} <span style={{ fontSize: '0.8rem', color: 'var(--admin-text-light)', fontWeight: 400 }}>({a.year})</span></h4>
                          <p className="item-secondary-meta" style={{ margin: '0 0 6px 0', fontSize: '0.8rem', color: 'var(--admin-text-light)' }}>
                            Role: <strong>{a.role}</strong> at <strong>{a.company}</strong> | Order: {a.order}
                          </p>
                          <p className="item-body-preview" style={{ margin: 0, fontSize: '0.85rem', fontStyle: 'italic', color: '#475569' }}>"{a.quote}"</p>
                        </div>
                      </div>
                      <div className="crud-item-actions">
                        <button className="btn-edit" onClick={() => {
                          setEditItem({ ...a });
                          setModalType('alumni-testimonial');
                          setIsNew(false);
                        }}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteCRUD('alumni-testimonial', a.id)}>Delete</button>
                      </div>
                    </div>
                  ))
                )}
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

              {/* STUDENT RESOURCE FIELDS */}
              {modalType === 'student-resource' && (
                <>
                  <div className="form-group">
                    <label>Category</label>
                    <select value={editItem.category} onChange={e => setEditItem({...editItem, category: e.target.value})} required style={{ width: '100%' }}>
                      <option>Academic Templates</option>
                      <option>Class & Study Tools</option>
                      <option>Official Forms</option>
                      <option>Cheat Sheets & Guides</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Title</label>
                    <input type="text" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} value={editItem.description || ''} onChange={e => setEditItem({...editItem, description: e.target.value})} />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Date Modified (e.g., Jun. 12, 2026)</label>
                      <input type="text" value={editItem.date_modified} onChange={e => setEditItem({...editItem, date_modified: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Sort Order Index</label>
                      <input type="number" value={editItem.order} onChange={e => setEditItem({...editItem, order: parseInt(e.target.value) || 0})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Primary Download Link (Google Drive / Docs URL)</label>
                    <input type="url" value={editItem.download_link_1} onChange={e => setEditItem({...editItem, download_link_1: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Secondary Download Link (Optional Mirror URL)</label>
                    <input type="url" value={editItem.download_link_2 || ''} onChange={e => setEditItem({...editItem, download_link_2: e.target.value})} />
                  </div>
                </>
              )}

              {/* CAREER PATH FIELDS */}
              {modalType === 'career-path' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Career Title</label>
                      <input type="text" value={editItem.title || ''} onChange={e => setEditItem({...editItem, title: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ maxWidth: '100px' }}>
                      <label>Icon Emoji</label>
                      <input type="text" value={editItem.icon || ''} onChange={e => setEditItem({...editItem, icon: e.target.value})} required style={{ textAlign: 'center', fontSize: '1.25rem' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Tags (Comma-separated, e.g., Backend, Frontend, Full-Stack)</label>
                    <input type="text" value={editItem.tags || ''} onChange={e => setEditItem({...editItem, tags: e.target.value})} placeholder="Backend, Full-Stack" required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea rows={3} value={editItem.desc || ''} onChange={e => setEditItem({...editItem, desc: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Key Skills to Learn (Comma-separated, e.g., Data Structures, Algorithms, APIs)</label>
                    <input type="text" value={editItem.skills || ''} onChange={e => setEditItem({...editItem, skills: e.target.value})} placeholder="Data Structures, Algorithms, APIs" required />
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Demand Outlook</label>
                      <select value={editItem.outlook || 'High Demand'} onChange={e => setEditItem({...editItem, outlook: e.target.value})} required>
                        <option>High Demand</option>
                        <option>Very High Demand</option>
                        <option>Growing Fast</option>
                        <option>Explosive Growth</option>
                        <option>Critical Need</option>
                        <option>Steady Demand</option>
                        <option>Steady Growth</option>
                        <option>Stable</option>
                        <option>Stable Demand</option>
                        <option>Growing</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Salary Range (e.g., ₱40k–₱120k/mo)</label>
                      <input type="text" value={editItem.salary || ''} onChange={e => setEditItem({...editItem, salary: e.target.value})} placeholder="₱40k–₱120k/mo" required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Accent Color (Hex code)</label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input type="color" value={editItem.color || '#4f46e5'} onChange={e => setEditItem({...editItem, color: e.target.value})} style={{ width: '40px', padding: 0, border: 'none', height: '40px', borderRadius: '4px', cursor: 'pointer' }} />
                        <input type="text" value={editItem.color || ''} onChange={e => setEditItem({...editItem, color: e.target.value})} placeholder="#4f46e5" required style={{ flex: 1 }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Sort Order Index</label>
                      <input type="number" value={editItem.order} onChange={e => setEditItem({...editItem, order: parseInt(e.target.value) || 0})} required />
                    </div>
                  </div>
                </>
              )}

              {/* ALUMNI TESTIMONIAL FIELDS */}
              {modalType === 'alumni-testimonial' && (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Alumnus Name</label>
                      <input type="text" value={editItem.name || ''} onChange={e => setEditItem({...editItem, name: e.target.value})} required />
                    </div>
                    <div className="form-group" style={{ maxWidth: '100px' }}>
                      <label>Avatar Initials</label>
                      <input type="text" value={editItem.avatar || ''} onChange={e => setEditItem({...editItem, avatar: e.target.value})} placeholder="e.g. MS" maxLength={3} style={{ textAlign: 'center', fontWeight: 'bold' }} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Alumnus Profile Photo (Optional Image)</label>
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
                              formData.append('image', file);
                              setLoading(true);
                              setError('');
                              axios.post('/api/alumni-testimonials/upload-avatar', formData, {
                                headers: { 'Content-Type': 'multipart/form-data' }
                              })
                              .then(res => {
                                if (res.data.success) {
                                  setEditItem(prev => ({ ...prev, image: res.data.path }));
                                  flashSuccess('Avatar image uploaded.');
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
                        width: '48px',
                        height: '48px',
                        borderRadius: '50%',
                        border: '2px dashed #cbd5e1',
                        background: editItem.color || '#f8fafc',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        overflow: 'hidden',
                        flexShrink: 0
                      }}>
                        {editItem.image ? (
                          <img src={editItem.image} alt="Avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <span style={{ fontSize: '0.8rem', fontWeight: 'bold', color: 'white' }}>
                            {editItem.avatar || '?'}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Job Role (e.g. UX/UI Designer)</label>
                      <input type="text" value={editItem.role || ''} onChange={e => setEditItem({...editItem, role: e.target.value})} required />
                    </div>
                    <div className="form-group">
                      <label>Company (e.g. GCash)</label>
                      <input type="text" value={editItem.company || ''} onChange={e => setEditItem({...editItem, company: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Course & Graduation Year (e.g. BSIT 2022)</label>
                      <input type="text" value={editItem.year || ''} onChange={e => setEditItem({...editItem, year: e.target.value})} placeholder="BSIT 2022" required />
                    </div>
                    <div className="form-group">
                      <label>Sort Order Index</label>
                      <input type="number" value={editItem.order} onChange={e => setEditItem({...editItem, order: parseInt(e.target.value) || 0})} required />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Quote / Testimonial</label>
                    <textarea rows={4} value={editItem.quote || ''} onChange={e => setEditItem({...editItem, quote: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Theme Color (Hex code)</label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input type="color" value={editItem.color || '#0891b2'} onChange={e => setEditItem({...editItem, color: e.target.value})} style={{ width: '40px', padding: 0, border: 'none', height: '40px', borderRadius: '4px', cursor: 'pointer' }} />
                      <input type="text" value={editItem.color || ''} onChange={e => setEditItem({...editItem, color: e.target.value})} placeholder="#0891b2" required style={{ flex: 1 }} />
                    </div>
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
