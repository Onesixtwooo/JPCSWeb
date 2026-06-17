import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);

  // Settings states
  const [address, setAddress] = useState("Our Lady of the Sacred Heart College\nGuimaras, Philippines");
  const [contactEmail, setContactEmail] = useState("jpcs.olshco@example.edu.ph");
  const [hours, setHours] = useState("Mon – Fri: 8:00 AM – 5:00 PM\nDuring school days only");
  const [fb, setFb] = useState("@JPCS.OLSHCo on Facebook");
  const [ig, setIg] = useState("@jpcs_olshco on Instagram");

  useEffect(() => {
    axios.get('/api/contact-settings')
      .then(res => {
        if (res.data.contact_address) setAddress(res.data.contact_address);
        if (res.data.contact_email) setContactEmail(res.data.contact_email);
        if (res.data.contact_hours) setHours(res.data.contact_hours);
        if (res.data.contact_fb) setFb(res.data.contact_fb);
        if (res.data.contact_ig) setIg(res.data.contact_ig);
      })
      .catch(() => {});
  }, []);

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    axios.post('/api/contact-messages', form)
      .then(res => {
        if (res.data.success) {
          setSent(true);
          setTimeout(() => setSent(false), 4000);
          setForm({ name: '', email: '', subject: '', message: '' });
        }
      })
      .catch(() => {});
  };

  return (
    <section id="contact" className="contact">
      <div className="contact__top-wave" />
      <div className="container">
        <div className="contact__header">
          <span className="section-tag" style={{ background: 'rgba(255,255,255,0.15)', color: 'var(--green-200)', borderColor: 'rgba(255,255,255,0.2)' }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            Contact Us
          </span>
          <h2 className="section-title" style={{ color: 'white' }}>Get In Touch</h2>
          <p className="section-sub" style={{ color: 'rgba(255,255,255,0.7)', margin: '0 auto' }}>
            Have questions, suggestions, or want to collaborate? We'd love to hear from you!
          </p>
        </div>

        <div className="contact__layout">
          {/* Info */}
          <div className="contact__info">
            <div className="contact__info-item">
              <div className="contact__info-icon">📍</div>
              <div>
                <h4>Find Us</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{address}</p>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">📧</div>
              <div>
                <h4>Email Us</h4>
                <p>{contactEmail}</p>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">📘</div>
              <div>
                <h4>Follow Us</h4>
                <p>{fb}<br/>{ig}</p>
              </div>
            </div>
            <div className="contact__info-item">
              <div className="contact__info-icon">🕐</div>
              <div>
                <h4>Office Hours</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{hours}</p>
              </div>
            </div>

            {/* Social links */}
            <div className="contact__socials">
              {fb && (
                <a
                  href={fb.match(/facebook\.com/) ? (fb.startsWith('http') ? fb : `https://${fb}`) : `https://facebook.com/${fb.replace(/^@/, '')}`}
                  className="contact__social-btn"
                  title="Facebook"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>f</span>
                </a>
              )}
              {ig && (
                <a
                  href={ig.match(/instagram\.com/) ? (ig.startsWith('http') ? ig : `https://${ig}`) : `https://instagram.com/${ig.replace(/^@/, '').split(' ')[0]}`}
                  className="contact__social-btn"
                  title="Instagram"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>◎</span>
                </a>
              )}
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="contact__social-btn"
                  title="Email"
                >
                  <span>✉</span>
                </a>
              )}
            </div>
          </div>

          {/* Form */}
          <form className="contact__form" onSubmit={handleSubmit}>
            {sent && (
              <div className="contact__success">
                ✅ Message sent! We'll get back to you soon.
              </div>
            )}
            <div className="contact__form-row">
              <div className="contact__field">
                <label htmlFor="name">Full Name</label>
                <input id="name" name="name" type="text" required placeholder="Juan dela Cruz"
                  value={form.name} onChange={handleChange} />
              </div>
              <div className="contact__field">
                <label htmlFor="email">Email Address</label>
                <input id="email" name="email" type="email" required placeholder="juan@email.com"
                  value={form.email} onChange={handleChange} />
              </div>
            </div>
            <div className="contact__field">
              <label htmlFor="subject">Subject</label>
              <select id="subject" name="subject" required value={form.subject} onChange={handleChange}>
                <option value="">Select a topic...</option>
                <option>Membership Inquiry</option>
                <option>Event Partnership</option>
                <option>Sponsorship</option>
                <option>General Question</option>
                <option>Other</option>
              </select>
            </div>
            <div className="contact__field">
              <label htmlFor="message">Message</label>
              <textarea id="message" name="message" required rows={5}
                placeholder="Write your message here..."
                value={form.message} onChange={handleChange} />
            </div>
            <button type="submit" className="btn-primary contact__submit">
              Send Message
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
