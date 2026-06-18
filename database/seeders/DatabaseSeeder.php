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
            'about_stat_members' => '200+',
            'about_stat_events' => '10+',
            'about_mission' => 'To develop the skills, values, and professional competence of our members as future computer science and IT professionals who will contribute meaningfully to the national and global technological advancement.',
            'about_vision' => 'To be the leading student organization in OLSHCo that produces competent, ethical, and innovative technology professionals guided by the values of faith, excellence, and service.',
            'contact_address' => 'Our Lady of the Sacred Heart College, Guimba, Nueva Ecija',
            'contact_email' => 'jpcsolshco@gmail.com',
            'contact_hours' => "Mon – Fri: 8:00 AM – 5:00 PM\nDuring school days only",
            'contact_fb' => '@JPCS.OLSHCo',
            'contact_ig' => '@jpcs_olshco',     
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

       
        
    }
}
