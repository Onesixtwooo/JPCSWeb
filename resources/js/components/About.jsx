import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import CanvasLines from './CanvasLines';
import './About.css';

const PILLARS = [
  {
    icon: '💡',
    title: 'Innovation',
    desc: 'We foster a culture of creativity, encouraging members to think beyond boundaries and develop groundbreaking solutions.',
  },
  {
    icon: '🤝',
    title: 'Collaboration',
    desc: 'Teamwork is at our core. We build bridges between students, faculty, and industry professionals.',
  },
  {
    icon: '📚',
    title: 'Excellence',
    desc: 'We commit to academic and technical excellence, empowering our members with skills that matter.',
  },
  {
    icon: '🌱',
    title: 'Growth',
    desc: 'Personal and professional development through workshops, seminars, and hands-on projects.',
  },
];

const OFFICERS = [
  { name: 'President',        title: 'Chapter Head' },
  { name: 'Vice President',   title: 'Internal Affairs' },
  { name: 'Secretary',        title: 'Documentation' },
  { name: 'Treasurer',        title: 'Finance & Budget' },
  { name: 'Auditor',          title: 'Compliance' },
  { name: 'PRO',              title: 'Public Relations' },
];

function AnimatedCounter({ value }) {
  const [count, setCount] = useState(0);
  const [suffix, setSuffix] = useState('');

  useEffect(() => {
    const match = String(value).match(/^(\d+)(.*)$/);
    if (!match) {
      setCount(value);
      setSuffix('');
      return;
    }

    const target = parseInt(match[1], 10);
    const suf = match[2] || '';
    setSuffix(suf);

    const duration = 1500; // 1.5 seconds animation duration
    const startTime = performance.now();

    let animId;
    const updateCount = (now) => {
      const progress = Math.min((now - startTime) / duration, 1);
      // Quadratic ease out
      const easeProgress = progress * (2 - progress);
      const current = Math.floor(easeProgress * target);
      setCount(current);

      if (progress < 1) {
        animId = requestAnimationFrame(updateCount);
      }
    };

    animId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animId);
  }, [value]);

  return <>{count}{suffix}</>;
}

export default function About() {
  const [title, setTitle] = useState('A COMMUNITY OF INNOVATORS');
  const [description, setDescription] = useState('The Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) is the premier student-led technology organization in Our Lady of the Sacred Heart College. We are dedicated to nurturing the potential of every ICT student, providing them with the resources, mentorship, and community needed to excel in the digital age.');
  const [statMembers, setStatMembers] = useState('100+');
  const [statEvents, setStatEvents] = useState('20+');
  const [mission, setMission] = useState('To develop the skills, values, and professional competence of our members as future computer science and IT professionals who will contribute meaningfully to the national and global technological advancement.');
  const [vision, setVision] = useState('To be the leading student organization in OLSHCo that produces competent, ethical, and innovative technology professionals guided by the values of faith, excellence, and service.');
  const [imgMain, setImgMain] = useState('/images/about_group.png');
  const [imgSub, setImgSub] = useState('/images/about_lab.png');
  const [imgMainCaption, setImgMainCaption] = useState('');
  const [imgSubCaption, setImgSubCaption] = useState('');
  const [lightbox, setLightbox] = useState(null); // { src, alt, caption }
  const [pillarsList, setPillarsList] = useState(PILLARS);
  const [officersList, setOfficersList] = useState(OFFICERS);

  useEffect(() => {
    axios.get('/api/about')
      .then(res => {
        if (res.data.about_title) setTitle(res.data.about_title);
        if (res.data.about_description) setDescription(res.data.about_description);
        if (res.data.about_stat_members) setStatMembers(res.data.about_stat_members);
        if (res.data.about_stat_events) setStatEvents(res.data.about_stat_events);
        if (res.data.about_mission) setMission(res.data.about_mission);
        if (res.data.about_vision) setVision(res.data.about_vision);
        if (res.data.about_img_main) setImgMain(res.data.about_img_main);
        if (res.data.about_img_sub) setImgSub(res.data.about_img_sub);
        if (res.data.about_img_main_caption) setImgMainCaption(res.data.about_img_main_caption);
        if (res.data.about_img_sub_caption) setImgSubCaption(res.data.about_img_sub_caption);
      })
      .catch(() => {});

    axios.get('/api/pillars')
      .then(res => {
        if (res.data && res.data.length > 0) setPillarsList(res.data);
      })
      .catch(() => {});

    axios.get('/api/officers')
      .then(res => {
        let list = res.data || [];
        list.sort((a, b) => a.order - b.order);

        if (list.length > 0) {
          setOfficersList(list.slice(0, 3));
        } else {
          setOfficersList(OFFICERS.slice(0, 3));
        }
      })
      .catch(() => {});
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') setLightbox(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  return (
    <>
    <section id="about" className="about">
      <CanvasLines />
      <div className="container">
        {/* Main Grid: Info + Images */}
        <div className="about__main-grid">
          {/* Left Column: Details & Stats */}
          <div className="about__info-col">
            <span className="section-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z"/></svg>
              About the Chapter
            </span>
            <h2 className="about__main-title">{title}</h2>
            <p className="about__description">{description}</p>
            
            {/* Stats Cards */}
            <div className="about__stats-cards">
              <div className="about__stat-card about__stat-card--green-dark">
                <span className="about__stat-number">
                  <AnimatedCounter value={statMembers} />
                </span>
                <span className="about__stat-label">ACTIVE MEMBERS</span>
              </div>
              <div className="about__stat-card about__stat-card--green-light">
                <span className="about__stat-number">
                  <AnimatedCounter value={statEvents} />
                </span>
                <span className="about__stat-label">ANNUAL EVENTS</span>
              </div>
            </div>
          </div>

          {/* Right Column: Overlapping Images */}
          <div className="about__images-col">
            <div className="about__image-container">
              <img
                src={imgMain}
                alt="JPCS OLSHCo Members"
                className="about__img-main about__img-clickable"
                onClick={() => setLightbox({ src: imgMain, alt: 'JPCS OLSHCo Members', caption: imgMainCaption })}
                title="Click to enlarge"
              />
              <img
                src={imgSub}
                alt="Coding Class Laboratory"
                className="about__img-sub about__img-clickable"
                onClick={() => setLightbox({ src: imgSub, alt: 'Coding Class Laboratory', caption: imgSubCaption })}
                title="Click to enlarge"
              />
            </div>
          </div>
        </div>

        {/* Mission & Vision */}
        <div className="about__mv">
          <div className="about__mv-card about__mv-card--mission">
            <div className="about__mv-icon">🎯</div>
            <h3>Our Mission</h3>
            <p>{mission}</p>
          </div>
          <div className="about__mv-card about__mv-card--vision">
            <div className="about__mv-icon">🔭</div>
            <h3>Our Vision</h3>
            <p>{vision}</p>
          </div>
        </div>

        {/* Pillars */}
        <div className="about__pillars">
          {pillarsList.map(p => (
            <div key={p.title} className="about__pillar">
              <div className="about__pillar-icon">{p.icon}</div>
              <h4 className="about__pillar-title">{p.title}</h4>
              <p className="about__pillar-desc">{p.desc}</p>
            </div>
          ))}
        </div>

        {/* Officers Placeholder */}
        <div className="about__officers">
          <h3 className="about__officers-title">Chapter Officers</h3>
          <div className="about__officers-grid">
            {officersList.map((o, idx) => (
              <div key={o.id ? `db-${o.id}` : `fallback-${idx}`} className="about__officer-card">
                <div className="about__officer-avatar">
                  <span>{(o.officer_name || o.name).charAt(0)}</span>
                </div>
                {o.officer_name && <span className="about__officer-name">{o.officer_name}</span>}
                <span className="about__officer-role">{o.name}</span>
                <span className="about__officer-desc">{o.year_level || ''}</span>
                {o.motto && <span className="about__officer-motto">"{o.motto}"</span>}
              </div>
            ))}
          </div>
          <div className="about__view-all-container">
            <a href="/about#org-structure" className="about__view-all-link">
              View All Officers & Organizational Structure
              <svg style={{ marginLeft: '6px' }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>

      {/* Lightbox — portaled to document.body to escape stacking contexts */}
      {lightbox && ReactDOM.createPortal(
        <div
          className="about__lightbox-backdrop"
          onClick={() => setLightbox(null)}
          role="dialog"
          aria-modal="true"
          aria-label="Image preview"
        >
          <div className="about__lightbox-inner" onClick={e => e.stopPropagation()}>
            <button
              className="about__lightbox-close"
              onClick={() => setLightbox(null)}
              aria-label="Close image preview"
            >
              ✕
            </button>
            <img src={lightbox.src} alt={lightbox.alt} className="about__lightbox-img" />
            {lightbox.caption && (
              <p className="about__lightbox-caption">{lightbox.caption}</p>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
