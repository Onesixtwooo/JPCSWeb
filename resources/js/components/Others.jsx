import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasLines from './CanvasLines';
import './Others.css';

const RESOURCES = [
  { icon: '📁', title: 'Member Resources', desc: 'Access templates, study materials, past projects, and exclusive learning resources curated for JPCS members.', link: '/resources', external: false },
  { icon: '🌐', title: 'JPCS National Portal', desc: 'Stay connected with the national JPCS organization and access nationwide programs, scholarships, and competitions.', link: 'https://philippinecomputersociety.org/jpcs-2/', external: true },
  { icon: '💼', title: 'Career Board', desc: 'Explore internship and job opportunities shared exclusively for JPCS-OLSHCo members from our industry partners.', link: '/career', external: false },
];

const FAQS = [
  {
    q: 'Who can join JPCS-OLSHCo?',
    a: 'Any currently enrolled student of OLSHCo taking IT, CS, or related programs is eligible to join the chapter.',
  },
  {
    q: 'How do I become a member?',
    a: 'Fill out our membership form during the enrollment period. A small annual membership fee applies to cover chapter activities.',
  },
  {
    q: 'What are the benefits of joining?',
    a: 'Members gain access to workshops, competitions, industry connections, scholarships, certificates, and a network of tech professionals.',
  },
  {
    q: 'Does JPCS-OLSHCo offer certificates?',
    a: 'Yes! Participants of our events and workshops receive certificates of participation. Officers and active members receive leadership certificates.',
  },
];

function FaqItem({ q, a }) {
  const [open, setOpen] = React.useState(false);
  return (
    <div className={`faq-item ${open ? 'faq-item--open' : ''}`} onClick={() => setOpen(p => !p)}>
      <div className="faq-item__question">
        <span>{q}</span>
        <svg className="faq-item__arrow" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
      {open && <p className="faq-item__answer">{a}</p>}
    </div>
  );
}

export default function Others() {
  const [faqs, setFaqs] = useState([]);

  useEffect(() => {
    axios.get('/api/faqs')
      .then(res => {
        setFaqs(res.data);
      })
      .catch(err => {
        console.error('Failed to fetch FAQs:', err);
      });
  }, []);

  return (
    <section id="others" className="others">
      <CanvasLines />
      <div className="container">
        {/* Resources */}
        <div className="others__resources">
          <div className="others__block-header">
            <span className="section-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              Resources
            </span>
            <h2 className="section-title">Explore More</h2>
            <p className="section-sub">Everything you need as part of the JPCS-OLSHCo community.</p>
          </div>
          <div className="others__resource-grid">
            {RESOURCES.map(r => (
              <a
                key={r.title}
                href={r.link}
                className="resource-card"
                {...(r.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
              >
                <div className="resource-card__icon">{r.icon}</div>
                <div className="resource-card__body">
                  <h4 className="resource-card__title">{r.title}</h4>
                  <p className="resource-card__desc">{r.desc}</p>
                </div>
                <div className="resource-card__arrow">→</div>
              </a>
            ))}
          </div>
        </div>

        {/* FAQ */}
        <div className="others__faq">
          <div className="others__faq-left">
            <span className="section-tag">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm2.07-7.75l-.9.92C13.45 12.9 13 13.5 13 15h-2v-.5c0-1.1.45-2.1 1.17-2.83l1.24-1.26c.37-.36.59-.86.59-1.41 0-1.1-.9-2-2-2s-2 .9-2 2H8c0-2.21 1.79-4 4-4s4 1.79 4 4c0 .88-.36 1.68-.93 2.25z"/></svg>
              FAQs
            </span>
            <h2 className="section-title">Frequently Asked<br/>Questions</h2>
            <p className="section-sub">Got questions? We have answers. If you can't find what you're looking for, reach out to us directly.</p>
            <a href="#contact" className="btn-primary" style={{ marginTop: 24, display: 'inline-flex' }}
              onClick={e => { e.preventDefault(); document.querySelector('#contact')?.scrollIntoView({ behavior: 'smooth' }); }}>
              Ask Us Directly →
            </a>
          </div>
          <div className="others__faq-right">
            {(faqs.length > 0 ? faqs : FAQS).map((f, i) => (
              <FaqItem key={f.id || i} q={f.question || f.q} a={f.answer || f.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
