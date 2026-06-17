<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Setting;
use App\Models\Pillar;
use App\Models\Officer;
use App\Models\Team;
use App\Models\Event;
use App\Models\NewsItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Admin User
        User::updateOrCreate(
            ['email' => 'admin@jpcs.org'],
            [
                'name' => 'JPCS Administrator',
                'password' => Hash::make('JPCS@On3S1xTw0'),
            ]
        );

        // 2. Settings (About, Stats, Contact)
        $settings = [
            'about_title' => 'A COMMUNITY OF INNOVATORS',
            'about_description' => 'The Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) is the premier student-led technology organization in Our Lady of the Sacred Heart College. We are dedicated to nurturing the potential of every ICT student, providing them with the resources, mentorship, and community needed to excel in the digital age.',
            'about_stat_members' => '100+',
            'about_stat_events' => '20+',
            'about_mission' => 'To develop the skills, values, and professional competence of our members as future computer science and IT professionals who will contribute meaningfully to the national and global technological advancement.',
            'about_vision' => 'To be the leading student organization in OLSHCo that produces competent, ethical, and innovative technology professionals guided by the values of faith, excellence, and service.',
            'contact_address' => 'Our Lady of the Sacred Heart College, Guimba, Philippines',
            'contact_email' => 'jpcs.olshco@example.edu.ph',
            'contact_hours' => "Mon – Fri: 8:00 AM – 5:00 PM\nDuring school days only",
            'contact_fb' => '@JPCS.OLSHCo on Facebook',
            'contact_ig' => '@jpcs_olshco on Instagram',
            'brand_name' => 'JPCS-OLSHCo',
            'brand_subtext' => 'Junior Philippine Computer Society',
            'brand_logo' => '/images/logo_1781582032.jpg',
            'events_title' => 'Upcoming & Past Events',
            'events_description' => 'Stay updated with all JPCS-OLSHCo activities — from technical workshops to social gatherings.',
            'hero_title_line1_1' => 'Creating',
            'hero_title_accent_1' => 'Infinite',
            'hero_title_line2_1' => 'Possibilities',
            'hero_title_line1_2' => 'Empowering',
            'hero_title_accent_2' => ' Tech',
            'hero_title_line2_2' => ' Leaders',
            'hero_title_line1_3' => 'Engineering',
            'hero_title_accent_3' => ' Our',
            'hero_title_line2_3' => ' Future',
            'hero_tagline' => 'Build Dreams. Code Futures.',
            'hero_motto' => 'Ex Fide, Ad Futurum!',
        ];

        foreach ($settings as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        // 3. Pillars
        Pillar::truncate();
        $pillars = [
            [
                'icon' => '💡',
                'title' => 'Innovation',
                'desc' => 'We foster a culture of creativity, encouraging members to think beyond boundaries and develop groundbreaking solutions.'
            ],
            [
                'icon' => '🤝',
                'title' => 'Collaboration',
                'desc' => 'Teamwork is at our core. We build bridges between students, faculty, and industry professionals.'
            ],
            [
                'icon' => '📚',
                'title' => 'Excellence',
                'desc' => 'We commit to academic and technical excellence, empowering our members with skills that matter.'
            ],
            [
                'icon' => '🌱',
                'title' => 'Growth',
                'desc' => 'Personal and professional development through workshops, seminars, and hands-on projects.'
            ]
        ];
        foreach ($pillars as $p) {
            Pillar::create($p);
        }

        // 3.5. FAQs
        \App\Models\Faq::truncate();
        $faqs = [
            [
                'question' => 'Who can join JPCS-OLSHCo?',
                'answer' => 'Any currently enrolled student of OLSHCo taking IT, CS, or related programs is eligible to join the chapter.',
                'order' => 1
            ],
            [
                'question' => 'How do I become a member?',
                'answer' => 'Fill out our membership form during the enrollment period. A small annual membership fee applies to cover chapter activities.',
                'order' => 2
            ],
            [
                'question' => 'What are the benefits of joining?',
                'answer' => 'Members gain access to workshops, competitions, industry connections, scholarships, certificates, and a network of tech professionals.',
                'order' => 3
            ],
            [
                'question' => 'Does JPCS-OLSHCo offer certificates?',
                'answer' => 'Yes! Participants of our events and workshops receive certificates of participation. Officers and active members receive leadership certificates.',
                'order' => 4
            ]
        ];
        foreach ($faqs as $f) {
            \App\Models\Faq::create($f);
        }

        // 4. Officers
        Officer::truncate();
        $officers = [
    ['name' => 'President', 'title' => 'Chapter Head', 'order' => 1],
    ['name' => 'Vice President for Internal Affairs', 'title' => 'Internal Affairs', 'order' => 2],
    ['name' => 'Vice President for External Affairs', 'title' => 'External Affairs', 'order' => 3],
    ['name' => 'Secretary', 'title' => 'Documentation', 'order' => 4],
    ['name' => 'Treasurer', 'title' => 'Finance & Budget', 'order' => 5],
    ['name' => 'Auditor', 'title' => 'Compliance & Audit', 'order' => 6],
    ['name' => 'Senior Public Relations Officer', 'title' => 'Public Relations (Sr.)', 'order' => 7],
    ['name' => 'Junior Public Relations Officer', 'title' => 'Public Relations (Jr.)', 'order' => 8],
    ['name' => 'Director for Membership', 'title' => 'Membership & Growth', 'order' => 9],
    ['name' => 'Director for Special Projects (Tech)', 'title' => 'Special Projects - Tech', 'order' => 10],
    ['name' => 'Director for Special Projects (Dev)', 'title' => 'Special Projects - Dev', 'order' => 11],
    ['name' => 'Director for Special Projects (Tech-Dev)', 'title' => 'Special Projects - Tech-Dev', 'order' => 12],
    ['name' => '2nd Year Representative (2A)', 'title' => 'Section 2A Representative', 'order' => 13],
    ['name' => '2nd Year Representative (2B)', 'title' => 'Section 2B Representative', 'order' => 14],
    ['name' => '3rd Year Representative (3A)', 'title' => 'Section 3A Representative', 'order' => 15],
    ['name' => '3rd Year Representative (3B)', 'title' => 'Section 3B Representative', 'order' => 16],
    ['name' => '4th Year Representative (4A)', 'title' => 'Section 4A Representative', 'order' => 17],
    ['name' => '4th Year Representative (4B)', 'title' => 'Section 4B Representative', 'order' => 18],
];
        foreach ($officers as $o) {
            Officer::create($o);
        }

        // 5. Teams
        Team::truncate();
        $teams = [
        [
    'name' => 'JPCS Versions',
    'tagline' => 'The Official Musical & Performing Arts Unit',
    'icon' => 'music-note', // or 'guitar', 'music' depending on your icon pack
    'duties' => [
        'Provide live musical entertainment, thematic soundtracks, and cultural performances for official department events.',
        'Compose, arrange, and perform original or covered musical pieces that elevate the energy and engagement of the student body.'
    ],
    'functions' => [
        'Lead the stage production, audio setups, and musical performances for flagship events like Plug-IT and JPCS Boot Up.',
        'Conduct jam sessions, musical workshops, and talent auditions to foster creative expression and artistic growth within the IT community.'
    ]
        ],
            [
                'name' => 'Cyber Crusaders',
                'tagline' => 'Cybersecurity & Infrastructure Defense',
                'icon' => 'shield-lock',
                'duties' => [
                    'Promote secure computing practices, network defense knowledge, and ethical guidelines in IT.',
                    'Assess infrastructure vulnerabilities, manage credentials security, and prevent data leakage.'
                ],
                'functions' => [
                    'Host hands-on Capture The Flag (CTF) challenges and cybersecurity war-games for members.',
                    'Organize instructional seminars regarding firewall setup, database encryption, and system hardening.'
                ]
            ],
            [
                'name' => 'Pixel Wizards',
                'tagline' => 'Multimedia Design & Digital Brand Team',
                'icon' => 'magic-wand',
                'duties' => [
                    'Create high-quality social graphics, official posters, banners, and digital flyers for events.',
                    'Document all organization activities through high-quality photography and promotional videos.'
                ],
                'functions' => [
                    'Establish and safeguard the visual guidelines, typography, color assets, and branding elements.',
                    'Collaborate with developers to deliver optimized graphic assets, assets resizing, and UI layouts.'
                ]
            ],
            [
                'name' => 'JPCS SysOps',
                'tagline' => 'IT Operations & Infrastructure Support',
                'icon' => 'server-racks',
                'duties' => [
                    'Maintain the computer science laboratories, network devices, and shared local servers.',
                    'Perform hardware diagnostics, install required operating systems, and handle licensing software.'
                ],
                'functions' => [
                    'Provide operational support, cabling setups, and machine allocations for lab exams and seminars.',
                    'Regulate secure lab schedules, local active directories, and credentials registry for student users.'
                ]
            ]
        ];
        foreach ($teams as $t) {
            Team::create($t);
        }

        // 6. Events
        Event::truncate();
        $events = [
            [
                'category' => 'Workshop',
                'date' => 'Jul 12, 2026',
                'title' => 'Web Development Bootcamp',
                'desc' => "A hands-on 2-day bootcamp covering HTML, CSS, JavaScript, and React fundamentals for aspiring web developers.",
                'icon' => '💻',
                'tag' => 'Upcoming',
                'tagType' => 'upcoming',
                'slots' => '50 slots',
                'time' => '8:00 AM – 5:00 PM',
                'venue' => 'IT Laboratory 1',
                'image' => '/images/event_web_dev.png',
            ],
            [
                'category' => 'Competition',
                'date' => 'Jul 25, 2026',
                'title' => 'CodeJam 2026',
                'desc' => "Annual programming competition testing algorithmic thinking, problem-solving, and coding speed under time pressure.",
                'icon' => '🏆',
                'tag' => 'Registration Open',
                'tagType' => 'open',
                'slots' => '30 teams',
                'time' => '9:00 AM – 4:00 PM',
                'venue' => 'Main Auditorium',
                'image' => '/images/event_codejam.png',
            ],
            [
                'category' => 'Seminar',
                'date' => 'Aug 5, 2026',
                'title' => 'AI & Machine Learning Talk',
                'desc' => "Industry professionals share insights on the latest trends in Artificial Intelligence and its real-world applications.",
                'icon' => '🤖',
                'tag' => 'Upcoming',
                'tagType' => 'upcoming',
                'slots' => 'Open to all',
                'time' => '1:00 PM – 5:00 PM',
                'venue' => 'College AVR',
                'image' => null,
            ],
            [
                'category' => 'Social',
                'date' => 'Aug 20, 2026',
                'title' => 'JPCS Foundation Day',
                'desc' => "Celebrate our chapter's anniversary with games, recognition ceremonies, and fellowship with fellow tech enthusiasts.",
                'icon' => '🎉',
                'tag' => 'Upcoming',
                'tagType' => 'upcoming',
                'slots' => 'Members only',
                'time' => '3:00 PM – 9:00 PM',
                'venue' => 'School Grounds',
                'image' => '/images/event_foundation.png',
            ],
            [
                'category' => 'Workshop',
                'date' => 'Jun 10, 2026',
                'title' => 'Git & GitHub Masterclass',
                'desc' => "Learn version control best practices using Git and GitHub — an essential skill for every developer.",
                'icon' => '⚙️',
                'tag' => 'Completed',
                'tagType' => 'done',
                'slots' => '40 slots',
                'time' => '1:00 PM – 4:00 PM',
                'venue' => 'IT Laboratory 2',
                'image' => null,
            ],
            [
                'category' => 'Seminar',
                'date' => 'May 28, 2026',
                'title' => 'Cybersecurity Awareness Week',
                'desc' => "A week-long awareness campaign featuring talks, quizzes, and demonstrations about staying safe online.",
                'icon' => '🔒',
                'tag' => 'Completed',
                'tagType' => 'done',
                'slots' => 'Open to all',
                'time' => 'All Day',
                'venue' => 'Various Venues',
                'image' => null,
            ],
        ];
        foreach ($events as $e) {
            Event::create($e);
        }

        // 7. News Items
        NewsItem::truncate();
        $news = [
            [
                'category' => 'Announcement',
                'date' => 'June 10, 2026',
                'title' => 'JPCS-OLSHCo Wins Regional Programming Contest',
                'excerpt' => 'Our team brought home the gold at the Regional JPCS Programming Challenge, besting 25 teams from across the region in algorithmic problem-solving.',
                'content' => "In an outstanding display of technical expertise and problem-solving prowess, the Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) programming team brought home the gold at the recently concluded Regional JPCS Programming Challenge.\n\nThe event, which gathered 25 competitive teams from various colleges and universities across the region, tested participants on complex algorithms, data structures, and raw coding speed under strict time limits.\n\nOur winning team, composed of brilliant BSIT students, successfully solved 8 out of 10 highly challenging programming problems in record time, securing a clean victory. The team leads credited their success to months of rigorous training, late-night code reviews, and the supportive environment fostered by the JPCS-OLSHCo community.\n\n\"This victory is a testament to the hard work and dedication of our members,\" said the JPCS President. \"It proves that OLSHCo students are fully equipped with world-class programming skills that can compete at the highest level.\"\n\nWe extend our warmest congratulations to our programming champions! You have made the entire OLSHCo community proud. Keep coding the future!",
                'readTime' => '3 min read',
                'featured' => true,
                'emoji' => '🏅',
            ],
            [
                'category' => 'Partnership',
                'date' => 'June 4, 2026',
                'title' => 'New Industry Partnership with TechCorp Philippines',
                'excerpt' => 'JPCS-OLSHCo signs MOU with TechCorp Philippines to provide internship and job placement opportunities for graduating members.',
                'content' => "Bridging the gap between academe and industry, the Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) has officially signed a Memorandum of Understanding (MOU) with TechCorp Philippines, one of the country's leading technology services firms.\n\nThis strategic partnership aims to provide graduating JPCS-OLSHCo members with direct pathways to high-quality internships, professional mentorship programs, and exclusive job placement opportunities. Through this agreement, TechCorp Philippines will also conduct annual technical seminars, career readiness workshops, and coding bootcamps specifically tailored for OLSHCo IT and CS students.\n\n\"We are thrilled to partner with JPCS-OLSHCo,\" stated the HR Director of TechCorp. \"We have consistently observed the high caliber of IT graduates coming from OLSHCo, and we want to cultivate this local talent pool, preparing them for the demands of the modern global tech industry.\"\n\nThis MOU marks a significant milestone in our organization's history, strengthening our commitment to providing students with opportunities that matter for their professional growth.",
                'readTime' => '2 min read',
                'featured' => false,
                'emoji' => '🤝',
            ],
            [
                'category' => 'Academic',
                'date' => 'May 28, 2026',
                'title' => 'Scholarship Program Now Open for IT Students',
                'excerpt' => 'The chapter has partnered with three local tech companies to offer merit-based scholarships for outstanding IT and CS students.',
                'content' => "Great news for aspiring tech leaders! The Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) is proud to announce that the applications for the newly established Tech Merit Scholarship Program are now officially open.\n\nIn partnership with three local technology companies, the chapter has secured full and partial tuition assistance, along with monthly stipends, for outstanding IT and Computer Science students who demonstrate exceptional academic performance and active participation in community tech initiatives.\n\nTo be eligible, applicants must be active members of JPCS-OLSHCo, maintain a minimum GWA of 1.75, and demonstrate a strong commitment to pursuing a career in technology. The scholarship package also includes guaranteed internships and potential immediate employment upon graduation.\n\n\"Our goal is to ensure that financial constraints do not hinder the education of talented tech students,\" said the JPCS Treasurer. \"We thank our industry sponsors for making this possible.\"\n\nInterested applicants can download the application forms from the JPCS Portal and submit their requirements to the JPCS office on or before July 15, 2026.",
                'readTime' => '4 min read',
                'featured' => false,
                'emoji' => '🎓',
            ],
            [
                'category' => 'Community',
                'date' => 'May 20, 2026',
                'title' => 'Tech for Good: Free Coding Classes for Public School Students',
                'excerpt' => 'JPCS-OLSHCo members volunteer as instructors in a community outreach program teaching basic coding to public school students.',
                'content' => "Believing that technology education should be accessible to everyone, the Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) recently launched its signature community outreach program, \"Tech for Good.\"\n\nOver the course of three weekends, more than 15 JPCS student-volunteers served as coding instructors for over 40 grade-school students from local public schools. The program introduced the children to visual programming concepts using Scratch, basic HTML/CSS web design, and digital literacy safety tips.\n\nThe outreach program aimed to ignite interest in computer science at an early age and empower young minds with digital tools. The classes were filled with excitement, collaborative projects, and interactive quizzes that left the young students eager to learn more.\n\n\"It is incredibly rewarding to see the children's faces light up when their code works,\" shared a JPCS student volunteer. \"Giving back to the community and teaching what we love is a wonderful experience.\"\n\nJPCS-OLSHCo plans to run the \"Tech for Good\" program bi-annually, expanding to more public schools in the future.",
                'readTime' => '3 min read',
                'featured' => false,
                'emoji' => '🌍',
            ],
            [
                'category' => 'Announcement',
                'date' => 'May 15, 2026',
                'title' => 'New Executive Board Elected for A.Y. 2026–2027',
                'excerpt' => 'The chapter proudly welcomes its newly elected set of officers who will lead the organization for the upcoming academic year.',
                'content' => "The Junior Philippine Computer Society Our Lady of the Sacred Heart College Chapter (JPCS-OLSHCo) is proud to announce the official election results for the Executive Board for the Academic Year 2026–2027.\n\nAfter a week of campaigning and a highly participated online voting process, the student body has chosen its new set of leaders. The newly elected officers are dedicated, passionate individuals ready to steer the chapter toward new heights of innovation, collaboration, and community service.\n\nThe new board has already drafted an ambitious action plan, including advanced dev bootcamps, cybersecurity seminars, programming hackathons, and expanded industry partnerships.\n\nWe congratulate our new officers and wish them the best of luck in their leadership journey. Let us support them as we work together to build dreams and code the future!",
                'readTime' => '2 min read',
                'featured' => false,
                'emoji' => '📣',
            ]
        ];
        foreach ($news as $n) {
            NewsItem::create($n);
        }
    }
}
