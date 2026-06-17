import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CanvasLines from './CanvasLines';
import './Events.css';

const CATEGORIES = ['All', 'Workshop', 'Seminar', 'Competition', 'Social'];

const DEFAULT_EVENTS = [
  {
    id: 1,
    category: 'Workshop',
    date: 'Jul 12, 2026',
    title: 'Web Development Bootcamp',
    desc: "A hands-on 2-day bootcamp covering HTML, CSS, JavaScript, and React fundamentals for aspiring web developers.",
    icon: '💻',
    tag: 'Upcoming',
    tagType: 'upcoming',
    slots: '50 slots',
    time: '8:00 AM – 5:00 PM',
    venue: 'IT Laboratory 1',
    image: '/images/event_web_dev.png',
  },
  {
    id: 2,
    category: 'Competition',
    date: 'Jul 25, 2026',
    title: 'CodeJam 2026',
    desc: "Annual programming competition testing algorithmic thinking, problem-solving, and coding speed under time pressure.",
    icon: '🏆',
    tag: 'Registration Open',
    tagType: 'open',
    slots: '30 teams',
    time: '9:00 AM – 4:00 PM',
    venue: 'Main Auditorium',
    image: '/images/event_codejam.png',
  },
  {
    id: 3,
    category: 'Seminar',
    date: 'Aug 5, 2026',
    title: 'AI & Machine Learning Talk',
    desc: "Industry professionals share insights on the latest trends in Artificial Intelligence and its real-world applications.",
    icon: '🤖',
    tag: 'Upcoming',
    tagType: 'upcoming',
    slots: 'Open to all',
    time: '1:00 PM – 5:00 PM',
    venue: 'College AVR',
  },
  {
    id: 4,
    category: 'Social',
    date: 'Aug 20, 2026',
    title: 'JPCS Foundation Day',
    desc: "Celebrate our chapter's anniversary with games, recognition ceremonies, and fellowship with fellow tech enthusiasts.",
    icon: '🎉',
    tag: 'Upcoming',
    tagType: 'upcoming',
    slots: 'Members only',
    time: '3:00 PM – 9:00 PM',
    venue: 'School Grounds',
    image: '/images/event_foundation.png',
  },
  {
    id: 5,
    category: 'Workshop',
    date: 'Jun 10, 2026',
    title: 'Git & GitHub Masterclass',
    desc: "Learn version control best practices using Git and GitHub — an essential skill for every developer.",
    icon: '⚙️',
    tag: 'Completed',
    tagType: 'done',
    slots: '40 slots',
    time: '1:00 PM – 4:00 PM',
    venue: 'IT Laboratory 2',
  },
  {
    id: 6,
    category: 'Seminar',
    date: 'May 28, 2026',
    title: 'Cybersecurity Awareness Week',
    desc: "A week-long awareness campaign featuring talks, quizzes, and demonstrations about staying safe online.",
    icon: '🔒',
    tag: 'Completed',
    tagType: 'done',
    slots: 'Open to all',
    time: 'All Day',
    venue: 'Various Venues',
  },
];

export default function Events() {
  const [active, setActive] = useState('All');
  const [eventsList, setEventsList] = useState(null);
  const [eventsSettings, setEventsSettings] = useState({
    events_title: 'Upcoming & Past Events',
    events_description: 'Stay updated with all JPCS-OLSHCo activities — from technical workshops to social gatherings.'
  });

  useEffect(() => {
    axios.get('/api/events')
      .then(res => {
        setEventsList(res.data || []);
      })
      .catch(() => {
        setEventsList([]);
      });

    axios.get('/api/events-settings')
      .then(res => {
        if (res.data) setEventsSettings(res.data);
      })
      .catch(() => {});
  }, []);

  const isLoading = eventsList === null;
  const filtered = isLoading
    ? []
    : (active === 'All'
      ? eventsList
      : eventsList.filter(e => e.category === active));

  // Repeat events list dynamically so it always exceeds viewport width,
  // then clone it once more to create a seamless infinite scrolling loop.
  let repeatedEvents = [...filtered];
  if (filtered.length > 0) {
    while (repeatedEvents.length < 8) {
      repeatedEvents = [...repeatedEvents, ...filtered];
    }
  }
  const doubledEvents = [...repeatedEvents, ...repeatedEvents];

  return (
    <section id="events" className="events">
      <CanvasLines />
      <div className="events__bg-shape" />
      <div className="container">
        <div className="events__header">
          <span className="section-tag">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <path d="M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z"/>
            </svg>
            Events
          </span>
          <h2 className="section-title">{eventsSettings.events_title}</h2>
          <p className="section-sub">
            {eventsSettings.events_description}
          </p>
        </div>

        {/* Filter */}
        <div className="events__filter">
          {CATEGORIES.map(c => (
            <button
              key={c}
              className={`events__filter-btn ${active === c ? 'events__filter-btn--active' : ''}`}
              onClick={() => setActive(c)}
            >
              {c}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="events__loading">
            <div className="events__loading-spinner" />
            <p>Loading events...</p>
          </div>
        ) : eventsList.length === 0 ? (
          <div className="events__empty">
            <div className="events__empty-icon">📅</div>
            <p className="events__empty-text">No events for now, stay updated on our official channels</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="events__empty">
            <div className="events__empty-icon">🔍</div>
            <p className="events__empty-text">No {active.toLowerCase()} events for now, stay updated on our official channels</p>
          </div>
        ) : (
          /* Marquee Container */
          <div className="events__marquee-container">
            <div className="events__marquee-track">
              {doubledEvents.map((ev, idx) => {
                const hasImage = !!ev.image;
                return (
                  <div key={`${ev.id}-${idx}`} className={`event-card ${hasImage ? 'event-card--has-image' : ''}`}>
                    {hasImage && (
                      <div className="event-card__poster">
                        <img src={ev.image} alt={ev.title} className="event-card__poster-img" />
                      </div>
                    )}
                    <div className={hasImage ? 'event-card__inner-content' : ''}>
                      <div className="event-card__top">
                        <div className="event-card__icon">{ev.icon}</div>
                        <span className={`event-card__tag event-card__tag--${ev.tagType}`}>{ev.tag}</span>
                      </div>
                      <div className="event-card__body">
                        <p className="event-card__cat">{ev.category}</p>
                        <h3 className="event-card__title">{ev.title}</h3>
                        <p className="event-card__desc">{ev.desc}</p>
                      </div>
                      <div className="event-card__meta">
                        <div className="event-card__meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {ev.date}
                        </div>
                        <div className="event-card__meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10"/>
                            <polyline points="12 6 12 12 16 14"/>
                          </svg>
                          {ev.time}
                        </div>
                        <div className="event-card__meta-item">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                            <circle cx="12" cy="10" r="3"/>
                          </svg>
                          {ev.venue}
                        </div>
                      </div>
                      <div className="event-card__footer">
                        <span className="event-card__slots">
                          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                            <circle cx="9" cy="7" r="4"/>
                            <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                            <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                          </svg>
                          {ev.slots}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
