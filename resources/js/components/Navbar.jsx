import React, { useState, useEffect, useRef } from 'react';
import './Navbar.css';

const NAV_LINKS = [
  { label: 'Home',   href: '#hero' },
  { label: 'About',  href: '/about' },
  { label: 'Events', href: '#events' },
  { label: 'News',   href: '/news' },
  { label: 'Others', href: '#others' },
  { label: 'Contact',href: '#contact' },
];

export default function Navbar({ brandName, brandSubtext, brandLogo }) {
  const [scrolled, setScrolled]     = useState(false);
  const [active,   setActive]       = useState('');
  const [menuOpen, setMenuOpen]     = useState(false);
  const [imgError, setImgError]     = useState(false);
  const navRef                      = useRef(null);

  useEffect(() => {
    setImgError(false);
  }, [brandLogo]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close on click outside
  useEffect(() => {
    const onClick = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('touchstart', onClick);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('touchstart', onClick);
    };
  }, []);

  // Lock body scroll when menu is open on mobile
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [menuOpen]);

  const handleNav = (href) => {
    setActive(href);
    setMenuOpen(false);
    if (href.startsWith('/')) {
      window.location.href = href;
    } else {
      document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header ref={navRef} className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
      <div className="navbar__inner container">
        {/* Logo */}
        <div className="navbar__brand" onClick={() => handleNav('#hero')}>
          <div className="navbar__logos">
            {brandLogo && !imgError ? (
              <img src={brandLogo} alt="Logo" className="navbar__logo-img" onError={() => setImgError(true)} />
            ) : (
              <div className="navbar__logo-fallback">
                <span className="navbar__logo-circle jpcs-c">{brandName ? brandName.split('-')[0] : 'JPCS'}</span>
              </div>
            )}
          </div>
          <div className="navbar__brand-text">
            <span className="navbar__brand-name">{brandName}</span>
            <span className="navbar__brand-sub">{brandSubtext}</span>
          </div>
        </div>

        {/* Desktop nav */}
        <nav className="navbar__links">
          {NAV_LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className={`navbar__link ${active === l.href ? 'navbar__link--active' : ''}`}
              onClick={e => { e.preventDefault(); handleNav(l.href); }}
            >
              {l.label}
            </a>
          ))}
          <a href="#contact" className="btn-primary navbar__cta" onClick={e => { e.preventDefault(); handleNav('#contact'); }}>
            Join Us
          </a>
        </nav>

        {/* Hamburger */}
        <button className={`navbar__hamburger ${menuOpen ? 'open' : ''}`} onClick={() => setMenuOpen(p => !p)} aria-label="Toggle menu">
          <span /><span /><span />
        </button>
      </div>

      {/* Mobile drawer */}
      <div className={`navbar__drawer ${menuOpen ? 'navbar__drawer--open' : ''}`}>
        {NAV_LINKS.map(l => (
          <a key={l.href} href={l.href} className="navbar__drawer-link"
            onClick={e => { e.preventDefault(); handleNav(l.href); }}>
            {l.label}
          </a>
        ))}
        <a href="#contact" className="btn-primary" style={{ alignSelf: 'flex-start', marginTop: 8 }}
          onClick={e => { e.preventDefault(); handleNav('#contact'); }}>
          Join Us →
        </a>
      </div>
    </header>
  );
}
