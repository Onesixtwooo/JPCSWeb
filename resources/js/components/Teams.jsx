import { useEffect, useState } from 'react';
import axios from 'axios';
import './Teams.css';

const DEFAULT_TEAMS = [
  {
    name: 'JPCS Versions',
    tagline: 'Web & Systems Engineering Team',
    icon: 'code-laptop',
    duties: [
      'Design, construct, and maintain the department’s official web portals and system infrastructures.',
      'Build customized software utilities and manage centralized databases for student organization activities.'
    ],
    functions: [
      'Conduct bootcamps on full-stack web technologies (e.g., React, Laravel, Node.js, and databases).',
      'Provide developer environments, coordinate code repositories (GitHub), and lead dev initiatives.'
    ]
  },
  {
    name: 'Cyber Crusaders',
    tagline: 'Cybersecurity & Infrastructure Defense',
    icon: 'shield-lock',
    duties: [
      'Promote secure computing practices, network defense knowledge, and ethical guidelines in IT.',
      'Assess infrastructure vulnerabilities, manage credentials security, and prevent data leakage.'
    ],
    functions: [
      'Host hands-on Capture The Flag (CTF) challenges and cybersecurity war-games for members.',
      'Organize instructional seminars regarding firewall setup, database encryption, and system hardening.'
    ]
  },
  {
    name: 'Pixel Wizards',
    tagline: 'Multimedia Design & Digital Brand Team',
    icon: 'magic-wand',
    duties: [
      'Create high-quality social graphics, official posters, banners, and digital flyers for events.',
      'Document all organization activities through high-quality photography and promotional videos.'
    ],
    functions: [
      'Establish and safeguard the visual guidelines, typography, color assets, and branding elements.',
      'Collaborate with developers to deliver optimized graphic assets, assets resizing, and UI layouts.'
    ]
  },
  {
    name: 'JPCS SysOps',
    tagline: 'IT Operations & Infrastructure Support',
    icon: 'server-racks',
    duties: [
      'Maintain the computer science laboratories, network devices, and shared local servers.',
      'Perform hardware diagnostics, install required operating systems, and handle licensing software.'
    ],
    functions: [
      'Provide operational support, cabling setups, and machine allocations for lab exams and seminars.',
      'Regulate secure lab schedules, local active directories, and credentials registry for student users.'
    ]
  }
];

const renderIcon = (iconName) => {
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

export default function Teams() {
  const [teamsList, setTeamsList] = useState(DEFAULT_TEAMS);

  useEffect(() => {
    axios.get('/api/teams')
      .then(res => {
        if (res.data && res.data.length > 0) setTeamsList(res.data);
      })
      .catch(() => {});
  }, []);

  return (
    <section id="teams" className="teams-section">
      <div className="container">
        <div className="teams-section__title-container">
          <span className="teams-section__subtitle">Unleash Your Potential</span>
          <h2 className="teams-section__title">JPCS Departments & Teams</h2>
        </div>

        <div className="teams-section__grid">
          {teamsList.map((team, idx) => {
            const words = team.name.split(' ');
            const titleLine1 = words[0] || '';
            const titleLine2 = words.slice(1).join(' ') || '';

            return (
              <div key={idx} className="team-card-enverga">
                <div className="team-card-enverga__header">
                  <div className="team-card-enverga__icon-wrapper">
                    {team.icon && team.icon.startsWith('/') ? (
                      <img src={team.icon} alt={team.name} style={{ width: '28px', height: '28px', objectFit: 'cover', borderRadius: '4px' }} />
                    ) : (
                      renderIcon(team.icon)
                    )}
                  </div>
                  <div className="team-card-enverga__title">
                    <span>{titleLine1}</span>
                    <span>{titleLine2}</span>
                    <span className="team-card-enverga__tagline">{team.tagline}</span>
                  </div>
                </div>
                
                <hr className="team-card-enverga__divider" />

                <div className="team-card-enverga__content">
                  <div className="team-card-enverga__subgroup">
                    <h4 className="team-card-enverga__subgroup-title">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                      </svg>
                      Duties
                    </h4>
                    <ul className="team-card-enverga__list">
                      {Array.isArray(team.duties) && team.duties.map((duty, dIdx) => (
                        <li key={dIdx}>{duty}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="team-card-enverga__subgroup">
                    <h4 className="team-card-enverga__subgroup-title">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      Functions
                    </h4>
                    <ul className="team-card-enverga__list">
                      {Array.isArray(team.functions) && team.functions.map((fn, fIdx) => (
                        <li key={fIdx}>{fn}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
