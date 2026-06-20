import React, { useState, useEffect } from 'react';
import './Footer.css';

const LINKS = {
  'Quick Links': [
    { label: 'Home',    href: '#hero' },
    { label: 'About',   href: '#about' },
    { label: 'Events',  href: '#events' },
    { label: 'News',    href: '#news' },
    { label: 'Others',  href: '#others' },
    { label: 'Contact', href: '#contact' },
  ],
  'Organization': [
    { label: 'Membership',     href: '#' },
    { label: 'Our Officers',   href: '#' },
    { label: 'Chapter History',href: '#' },
    { label: 'Achievements',   href: '#' },
  ],
  'Connect': [
    { label: 'Facebook Page',  href: '#' },
    { label: 'Instagram',      href: '#' },
    { label: 'GitHub',         href: '#' },
    { label: 'Email Us',       href: '#' },
  ],
};

const scroll = href => document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });

export default function Footer({ brandName, brandLogo }) {
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setImgError(false);
  }, [brandLogo]);

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__top">
          {/* Brand */}
          <div className="footer__brand">
            {/* School Logo & Link (OLSHCo) at the top */}
            <div className="footer__school">
              <a href="https://olshco.lamparasystem.com/" target="_blank" rel="noopener noreferrer" className="footer__school-link">
                <img src="/images/olshco.png" alt="OLSHCo Logo" className="footer__school-logo" />
                <span className="footer__school-name">Our Lady of the Sacred Heart College of Guimba, Inc.</span>
              </a>
            </div>

            {/* JPCS Logo & Info at the bottom */}
            <div className="footer__jpcs-section">
              <div className="footer__brand-logos">
                {brandLogo && !imgError ? (
                  <img src={brandLogo} alt="Logo" className="footer__logo-img" onError={() => setImgError(true)} />
                ) : (
                  <div className="footer__brand-circle jpcs">{brandName ? brandName.split('-')[0] : 'JPCS'}</div>
                )}
              </div>
              <h3 className="footer__brand-name">{brandName || 'JPCS-OLSHCo'}</h3>
              <p className="footer__brand-desc">
                Junior Philippine Computer Society — {brandName ? brandName.split('-')[1] || 'OLSHCo' : 'OLSHCo'} Chapter
              </p>
              <p className="footer__motto">"Ex fide ad futurum"</p>
              <p className="footer__tagline">Build Dreams, Code Future.</p>
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([col, items]) => (
            <div key={col} className="footer__col">
              <h5 className="footer__col-title">{col}</h5>
              <ul className="footer__col-links">
                {items.map(l => (
                  <li key={l.label}>
                    <a href={l.href}
                      onClick={l.href.startsWith('#') ? e => { e.preventDefault(); scroll(l.href); } : undefined}>
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="footer__bottom">
          <p>© {new Date().getFullYear()} JPCS-OLSHCo. All rights reserved.</p>
          <p>Made with 💚 by JPCS-OLSHCo Web Team</p>
        </div>
      </div>
    </footer>
  );
}
