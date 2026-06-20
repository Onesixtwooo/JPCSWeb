import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCursor from './components/CustomCursor';
import Navbar  from './components/Navbar';
import Hero    from './components/Hero';
import About   from './components/About';
import Events  from './components/Events';
import News    from './components/News';
import Others  from './components/Others';
import Teams   from './components/Teams';
import Contact from './components/Contact';
import Footer  from './components/Footer';

export default function LandingPage() {
  const [brandSettings, setBrandSettings] = useState({
    brand_name: 'JPCS-OLSHCo',
    brand_subtext: 'Philippine Computer Society Jr.',
    brand_logo: ''
  });
  const [heroSettings, setHeroSettings] = useState({
    hero_title_options_count: '3',
    hero_title_line1_1: 'Creating',
    hero_title_accent_1: 'Infinite',
    hero_title_line2_1: 'Possibilities',
    hero_title_line1_2: 'Empowering',
    hero_title_accent_2: ' Tech',
    hero_title_line2_2: ' Leaders',
    hero_title_line1_3: 'Engineering',
    hero_title_accent_3: ' Our',
    hero_title_line2_3: ' Future',
    hero_tagline: 'Build Dreams. Code Futures.',
    hero_motto: 'Ex Fide, Ad Futurum!'
  });

  useEffect(() => {
    axios.get('/api/about')
      .then(res => {
        setBrandSettings({
          brand_name: res.data.brand_name || 'JPCS-OLSHCo',
          brand_subtext: res.data.brand_subtext || 'Philippine Computer Society Jr.',
          brand_logo: res.data.brand_logo || '/images/jpcs-logo.png'
        });
      })
      .catch(() => {});

    axios.get('/api/hero-settings')
      .then(res => {
        setHeroSettings({
          hero_title_options_count: res.data.hero_title_options_count || '3',
          hero_title_line1_1: res.data.hero_title_line1_1 || 'Creating',
          hero_title_accent_1: res.data.hero_title_accent_1 || 'Infinite',
          hero_title_line2_1: res.data.hero_title_line2_1 || 'Possibilities',
          hero_title_line1_2: res.data.hero_title_line1_2 || 'Empowering',
          hero_title_accent_2: res.data.hero_title_accent_2 || ' Tech',
          hero_title_line2_2: res.data.hero_title_line2_2 || ' Leaders',
          hero_title_line1_3: res.data.hero_title_line1_3 || 'Engineering',
          hero_title_accent_3: res.data.hero_title_accent_3 || ' Our',
          hero_title_line2_3: res.data.hero_title_line2_3 || ' Future',
          hero_tagline: res.data.hero_tagline || 'Build Dreams. Code Futures.',
          hero_motto: res.data.hero_motto || 'Ex Fide, Ad Futurum!'
        });
      })
      .catch(() => {});
  }, []);

  return (
    <>
      <CustomCursor />
      <Navbar brandName={brandSettings.brand_name} brandSubtext={brandSettings.brand_subtext} brandLogo={brandSettings.brand_logo} />
      <main>
        <Hero 
          brandName={brandSettings.brand_name} 
          brandSubtext={brandSettings.brand_subtext} 
          brandLogo={brandSettings.brand_logo} 
          heroSettings={heroSettings}
        />
        <About   />
        <Teams   />
        <Events  />
        <News    />
        <Others  />
        <Contact />
      </main>
      <Footer brandName={brandSettings.brand_name} brandLogo={brandSettings.brand_logo} />
    </>
  );
}
