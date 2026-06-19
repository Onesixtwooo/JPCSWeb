<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\AuditLog;
use App\Models\Setting;
use App\Models\Pillar;
use App\Models\Officer;
use App\Models\Team;
use App\Models\Event;
use App\Models\NewsItem;
use App\Models\ContactMessage;
use App\Models\ContactMessageReply;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    private function logActivity(string $action, string $description, ?string $email = null, ?int $userId = null)
    {
        try {
            AuditLog::create([
                'user_id' => $userId ?? (Auth::check() ? Auth::id() : null),
                'email' => $email ?? (Auth::check() ? Auth::user()->email : 'system'),
                'action' => $action,
                'description' => $description,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to log activity: " . $e->getMessage());
        }
    }
    // 1. Authentication
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, true)) {
            $request->session()->regenerate();

            // Log successful attempt
            $this->logActivity('login_success', 'User logged in successfully.', Auth::user()->email, Auth::id());

            return response()->json([
                'success' => true,
                'message' => 'Logged in successfully',
                'user' => Auth::user(),
            ]);
        }

        // Log failed attempt
        $user = User::where('email', $request->email)->first();
        $this->logActivity('login_failed', 'Failed login attempt.', $request->email, $user ? $user->id : null);

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password credentials.',
        ], 401);
    }

    public function logout(Request $request)
    {
        $email = Auth::user() ? Auth::user()->email : null;
        $userId = Auth::id();

        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        if ($email) {
            $this->logActivity('logout_success', 'User logged out successfully.', $email, $userId);
        }

        return response()->json([
            'success' => true,
            'message' => 'Logged out successfully',
        ]);
    }

    public function authCheck()
    {
        return response()->json([
            'authenticated' => Auth::check(),
            'user' => Auth::user(),
        ]);
    }

    // 2. Settings (About & Contact text keys)
    public function getAbout()
    {
        $keys = [
            'about_title',
            'about_description',
            'about_history',
            'about_stat_members',
            'about_stat_events',
            'about_mission',
            'about_vision',
            'brand_name',
            'brand_subtext',
            'brand_logo',
            'about_img_main',
            'about_img_sub',
            'about_img_main_caption',
            'about_img_sub_caption'
        ];
        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');

        if (!isset($settings['brand_name'])) {
            $settings['brand_name'] = 'JPCS-OLSHCo';
        }
        if (!isset($settings['brand_subtext'])) {
            $settings['brand_subtext'] = 'Philippine Computer Society Jr.';
        }
        if (!isset($settings['brand_logo'])) {
            $settings['brand_logo'] = '/images/jpcs-logo.png';
        }
        if (empty($settings['about_img_main'])) {
            $settings['about_img_main'] = '/images/about_group.png';
        }
        if (empty($settings['about_img_sub'])) {
            $settings['about_img_sub'] = '/images/about_lab.png';
        }

        return response()->json($settings);
    }

    public function updateAbout(Request $request)
    {
        $data = $request->validate([
            'about_title' => 'required|string',
            'about_description' => 'required|string',
            'about_history' => 'nullable|string',
            'about_stat_members' => 'required|string',
            'about_stat_events' => 'required|string',
            'about_mission' => 'required|string',
            'about_vision' => 'required|string',
            'brand_name' => 'required|string',
            'brand_subtext' => 'required|string',
            'brand_logo' => 'nullable|string',
            'about_img_main' => 'nullable|string',
            'about_img_sub' => 'nullable|string',
            'about_img_main_caption' => 'nullable|string|max:200',
            'about_img_sub_caption' => 'nullable|string|max:200',
        ]);

        foreach ($data as $key => $value) {
            // For image fields, if the value is empty/null, store the default path
            if ($key === 'about_img_main' && empty($value)) {
                $value = '/images/about_group.png';
            }
            if ($key === 'about_img_sub' && empty($value)) {
                $value = '/images/about_lab.png';
            }
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->logActivity('update_about', 'Updated About & Brand Settings.');

        return response()->json(['success' => true, 'message' => 'About settings updated.']);
    }

    public function getContactSettings()
    {
        $keys = [
            'contact_address',
            'contact_email',
            'contact_hours',
            'contact_fb',
            'contact_ig',
        ];
        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        return response()->json($settings);
    }

    public function updateContactSettings(Request $request)
    {
        $data = $request->validate([
            'contact_address' => 'required|string',
            'contact_email' => 'required|email',
            'contact_hours' => 'required|string',
            'contact_fb' => 'required|string',
            'contact_ig' => 'required|string',
        ]);

        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->logActivity('update_contact', 'Updated Contact Settings.');

        return response()->json(['success' => true, 'message' => 'Contact settings updated.']);
    }

    // 3. Pillars CRUD
    public function getPillars()
    {
        return response()->json(Pillar::all());
    }

    public function createPillar(Request $request)
    {
        $data = $request->validate([
            'icon' => 'required|string',
            'title' => 'required|string',
            'desc' => 'required|string',
        ]);
        $pillar = Pillar::create($data);
        return response()->json(['success' => true, 'pillar' => $pillar]);
    }

    public function updatePillar(Request $request, $id)
    {
        $pillar = Pillar::findOrFail($id);
        $data = $request->validate([
            'icon' => 'required|string',
            'title' => 'required|string',
            'desc' => 'required|string',
        ]);
        $pillar->update($data);
        return response()->json(['success' => true, 'pillar' => $pillar]);
    }

    public function deletePillar($id)
    {
        Pillar::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 4. Officers CRUD
    public function getOfficers()
    {
        return response()->json(Officer::orderBy('order', 'asc')->get());
    }

    public function createOfficer(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'title' => 'nullable|string',
            'officer_name' => 'nullable|string',
            'year_level' => 'nullable|string',
            'motto' => 'nullable|string',
            'order' => 'required|integer',
        ]);
        $data['title'] = $data['title'] ?? '';
        $officer = Officer::create($data);
        return response()->json(['success' => true, 'officer' => $officer]);
    }

    public function updateOfficer(Request $request, $id)
    {
        $officer = Officer::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string',
            'title' => 'nullable|string',
            'officer_name' => 'nullable|string',
            'year_level' => 'nullable|string',
            'motto' => 'nullable|string',
            'order' => 'required|integer',
        ]);
        $data['title'] = $data['title'] ?? '';
        $officer->update($data);
        return response()->json(['success' => true, 'officer' => $officer]);
    }

    public function deleteOfficer($id)
    {
        Officer::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 5. Teams CRUD
    public function getTeams()
    {
        return response()->json(Team::all());
    }

    public function createTeam(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'tagline' => 'required|string',
            'icon' => 'nullable|string',
            'duties' => 'required|array',
            'functions' => 'required|array',
        ]);
        $team = Team::create($data);
        return response()->json(['success' => true, 'team' => $team]);
    }

    public function updateTeam(Request $request, $id)
    {
        $team = Team::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string',
            'tagline' => 'required|string',
            'icon' => 'nullable|string',
            'duties' => 'required|array',
            'functions' => 'required|array',
        ]);
        $team->update($data);
        return response()->json(['success' => true, 'team' => $team]);
    }

    public function deleteTeam($id)
    {
        Team::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 6. Events CRUD
    public function getEvents()
    {
        return response()->json(Event::all());
    }

    public function createEvent(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string',
            'date' => 'required|string',
            'title' => 'required|string',
            'desc' => 'required|string',
            'icon' => 'required|string',
            'tag' => 'required|string',
            'tagType' => 'required|string',
            'slots' => 'required|string',
            'time' => 'required|string',
            'venue' => 'required|string',
            'image' => 'nullable|string',
        ]);
        $event = Event::create($data);
        return response()->json(['success' => true, 'event' => $event]);
    }

    public function updateEvent(Request $request, $id)
    {
        $event = Event::findOrFail($id);
        $data = $request->validate([
            'category' => 'required|string',
            'date' => 'required|string',
            'title' => 'required|string',
            'desc' => 'required|string',
            'icon' => 'required|string',
            'tag' => 'required|string',
            'tagType' => 'required|string',
            'slots' => 'required|string',
            'time' => 'required|string',
            'venue' => 'required|string',
            'image' => 'nullable|string',
        ]);
        $event->update($data);
        return response()->json(['success' => true, 'event' => $event]);
    }

    public function deleteEvent($id)
    {
        Event::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function getEventsSettings()
    {
        $keys = [
            'events_title',
            'events_description',
        ];
        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        if (!isset($settings['events_title'])) {
            $settings['events_title'] = 'Upcoming & Past Events';
        }
        if (!isset($settings['events_description'])) {
            $settings['events_description'] = 'Stay updated with all JPCS-OLSHCo activities — from technical workshops to social gatherings.';
        }
        return response()->json($settings);
    }

    public function updateEventsSettings(Request $request)
    {
        $data = $request->validate([
            'events_title' => 'required|string',
            'events_description' => 'required|string',
        ]);
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $this->logActivity('update_events_settings', 'Updated Events section details.');

        return response()->json(['success' => true, 'message' => 'Events settings updated.']);
    }

    public function getHeroSettings()
    {
        $keys = [
            'hero_title_line1_1', 'hero_title_accent_1', 'hero_title_line2_1',
            'hero_title_line1_2', 'hero_title_accent_2', 'hero_title_line2_2',
            'hero_title_line1_3', 'hero_title_accent_3', 'hero_title_line2_3',
            'hero_title_options_count',
            'hero_tagline',
            'hero_motto',
        ];
        $settings = Setting::whereIn('key', $keys)->pluck('value', 'key');
        
        // Defaults for Option 1
        if (!isset($settings['hero_title_line1_1'])) {
            $settings['hero_title_line1_1'] = 'Creating';
        }
        if (!isset($settings['hero_title_accent_1'])) {
            $settings['hero_title_accent_1'] = 'Infinite';
        }
        if (!isset($settings['hero_title_line2_1'])) {
            $settings['hero_title_line2_1'] = 'Possibilities';
        }
        
        // Defaults for Option 2
        if (!isset($settings['hero_title_line1_2'])) {
            $settings['hero_title_line1_2'] = 'Empowering';
        }
        if (!isset($settings['hero_title_accent_2'])) {
            $settings['hero_title_accent_2'] = ' Tech';
        }
        if (!isset($settings['hero_title_line2_2'])) {
            $settings['hero_title_line2_2'] = ' Leaders';
        }
        
        // Defaults for Option 3
        if (!isset($settings['hero_title_line1_3'])) {
            $settings['hero_title_line1_3'] = 'Engineering';
        }
        if (!isset($settings['hero_title_accent_3'])) {
            $settings['hero_title_accent_3'] = ' Our';
        }
        if (!isset($settings['hero_title_line2_3'])) {
            $settings['hero_title_line2_3'] = ' Future';
        }

        if (!isset($settings['hero_title_options_count'])) {
            $settings['hero_title_options_count'] = '3';
        }
        
        if (!isset($settings['hero_tagline'])) {
            $settings['hero_tagline'] = 'Build Dreams. Code Futures.';
        }
        if (!isset($settings['hero_motto'])) {
            $settings['hero_motto'] = 'Ex Fide, Ad Futurum!';
        }
        
        return response()->json($settings);
    }

    public function updateHeroSettings(Request $request)
    {
        $data = $request->validate([
            'hero_title_line1_1' => 'required|string',
            'hero_title_accent_1' => 'required|string',
            'hero_title_line2_1' => 'required|string',
            'hero_title_line1_2' => 'nullable|string',
            'hero_title_accent_2' => 'nullable|string',
            'hero_title_line2_2' => 'nullable|string',
            'hero_title_line1_3' => 'nullable|string',
            'hero_title_accent_3' => 'nullable|string',
            'hero_title_line2_3' => 'nullable|string',
            'hero_title_options_count' => 'required|string',
            'hero_tagline' => 'required|string',
            'hero_motto' => 'required|string',
        ]);
        
        foreach ($data as $key => $value) {
            Setting::updateOrCreate(['key' => $key], ['value' => $value ?? '']);
        }

        $this->logActivity('update_hero', 'Updated Hero Section Settings.');
        
        return response()->json(['success' => true, 'message' => 'Hero settings updated.']);
    }

    // 7. News CRUD
    public function getNews()
    {
        return response()->json(NewsItem::all());
    }

    public function getNewsItem($id)
    {
        if (is_numeric($id)) {
            $news = NewsItem::find($id);
            if ($news) {
                return response()->json($news);
            }
        }

        // Custom slugify matching the JS frontend slugify() exactly:
        // toLowerCase → replace [^a-z0-9]+ with '-' → trim leading/trailing '-'
        $slugify = function (string $text): string {
            $text = mb_strtolower($text, 'UTF-8');
            $text = preg_replace('/[^a-z0-9]+/', '-', $text);
            return trim($text, '-');
        };

        $newsItems = NewsItem::all();
        foreach ($newsItems as $item) {
            if ($slugify($item->title) === $id) {
                return response()->json($item);
            }
        }

        abort(404, 'News article not found');
    }

    public function createNews(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string',
            'date' => 'required|string',
            'title' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'nullable|string',
            'readTime' => 'required|string',
            'featured' => 'required|boolean',
            'emoji' => 'required|string',
            'images' => 'nullable|array',
        ]);
        $news = NewsItem::create($data);
        return response()->json(['success' => true, 'news' => $news]);
    }

    public function updateNews(Request $request, $id)
    {
        $news = NewsItem::findOrFail($id);
        $data = $request->validate([
            'category' => 'required|string',
            'date' => 'required|string',
            'title' => 'required|string',
            'excerpt' => 'required|string',
            'content' => 'nullable|string',
            'readTime' => 'required|string',
            'featured' => 'required|boolean',
            'emoji' => 'required|string',
            'images' => 'nullable|array',
        ]);
        $news->update($data);
        return response()->json(['success' => true, 'news' => $news]);
    }

    public function deleteNews($id)
    {
        NewsItem::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 8. Contact Messages Submission & View
    public function submitContactMessage(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'subject' => 'required|string|max:255',
            'message' => 'required|string',
        ]);

        $msg = ContactMessage::create($data);
        return response()->json(['success' => true, 'message' => 'Message submitted successfully', 'contact' => $msg]);
    }

    public function getContactMessages()
    {
        return response()->json(ContactMessage::with('replies')->orderBy('created_at', 'desc')->get());
    }

    public function replyContactMessage(Request $request, $id)
    {
        $message = ContactMessage::findOrFail($id);

        $data = $request->validate([
            'subject' => 'required|string|max:255',
            'reply_body' => 'required|string',
        ]);

        // 1. Save to database
        $reply = ContactMessageReply::create([
            'contact_message_id' => $message->id,
            'subject' => $data['subject'],
            'reply_body' => $data['reply_body'],
        ]);

        // 2. Send email to original sender
        try {
            \Illuminate\Support\Facades\Mail::raw($data['reply_body'], function ($mail) use ($message, $data) {
                $mail->to($message->email)
                     ->subject($data['subject']);
            });
            $emailSent = true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send reply email to {$message->email}: " . $e->getMessage());
            $emailSent = false;
        }

        return response()->json([
            'success' => true,
            'reply' => $reply,
            'email_sent' => $emailSent
        ]);
    }

    public function deleteContactMessage($id)
    {
        ContactMessage::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function uploadLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'logo_' . time() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function uploadAboutImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'about_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            $file->move(public_path('images'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function uploadTeamLogo(Request $request)
    {
        $request->validate([
            'logo' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:2048',
        ]);

        if ($request->hasFile('logo')) {
            $file = $request->file('logo');
            $filename = 'team_' . time() . '.' . $file->getClientOriginalExtension();
            if (!file_exists(public_path('images/teams'))) {
                mkdir(public_path('images/teams'), 0755, true);
            }
            $file->move(public_path('images/teams'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/teams/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function uploadPillarLottie(Request $request)
    {
        $request->validate([
            'lottie' => 'required|file|max:5120',
        ]);

        if ($request->hasFile('lottie')) {
            $file = $request->file('lottie');
            $extension = strtolower($file->getClientOriginalExtension());
            if (!in_array($extension, ['json', 'lottie'])) {
                return response()->json(['success' => false, 'message' => 'The file must be a .json or .lottie file.'], 422);
            }

            $originalName = pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME);
            $cleanedName = preg_replace('/[^A-Za-z0-9_\- ]/', '', $originalName);
            $filename = $cleanedName . '_' . time() . '.' . $extension;

            if (!file_exists(public_path('images/lottie'))) {
                mkdir(public_path('images/lottie'), 0755, true);
            }
            $file->move(public_path('images/lottie'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/lottie/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function uploadEventPoster(Request $request)
    {
        $request->validate([
            'poster' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('poster')) {
            $file = $request->file('poster');
            $filename = 'event_' . time() . '.' . $file->getClientOriginalExtension();
            if (!file_exists(public_path('images/events'))) {
                mkdir(public_path('images/events'), 0755, true);
            }
            $file->move(public_path('images/events'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/events/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function uploadNewsImage(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'news_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            if (!file_exists(public_path('images/news'))) {
                mkdir(public_path('images/news'), 0755, true);
            }
            $file->move(public_path('images/news'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/news/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    // 9. FAQ CRUD
    public function getFaqs()
    {
        return response()->json(Faq::orderBy('order', 'asc')->get());
    }

    public function createFaq(Request $request)
    {
        $data = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'order' => 'required|integer',
        ]);
        $faq = Faq::create($data);
        return response()->json(['success' => true, 'faq' => $faq]);
    }

    public function updateFaq(Request $request, $id)
    {
        $faq = Faq::findOrFail($id);
        $data = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'order' => 'required|integer',
        ]);
        $faq->update($data);
        return response()->json(['success' => true, 'faq' => $faq]);
    }

    public function deleteFaq($id)
    {
        Faq::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 10. Student Resources CRUD
    public function getStudentResources()
    {
        return response()->json(\App\Models\StudentResource::orderBy('order', 'asc')->get());
    }

    public function createStudentResource(Request $request)
    {
        $data = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'date_modified' => 'required|string',
            'download_link_1' => 'required|string',
            'download_link_2' => 'nullable|string',
            'order' => 'required|integer',
        ]);
        $sr = \App\Models\StudentResource::create($data);
        return response()->json(['success' => true, 'resource' => $sr]);
    }

    public function updateStudentResource(Request $request, $id)
    {
        $sr = \App\Models\StudentResource::findOrFail($id);
        $data = $request->validate([
            'category' => 'required|string',
            'title' => 'required|string',
            'description' => 'nullable|string',
            'date_modified' => 'required|string',
            'download_link_1' => 'required|string',
            'download_link_2' => 'nullable|string',
            'order' => 'required|integer',
        ]);
        $sr->update($data);
        return response()->json(['success' => true, 'resource' => $sr]);
    }

    public function deleteStudentResource($id)
    {
        \App\Models\StudentResource::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 11. Career Paths CRUD
    public function getCareerPaths()
    {
        return response()->json(\App\Models\CareerPath::orderBy('order', 'asc')->get());
    }

    public function createCareerPath(Request $request)
    {
        $data = $request->validate([
            'icon' => 'required|string',
            'title' => 'required|string',
            'tags' => 'required|array',
            'desc' => 'required|string',
            'skills' => 'required|array',
            'outlook' => 'required|string',
            'salary' => 'required|string',
            'color' => 'required|string',
            'order' => 'required|integer',
        ]);
        $cp = \App\Models\CareerPath::create($data);
        return response()->json(['success' => true, 'career_path' => $cp]);
    }

    public function updateCareerPath(Request $request, $id)
    {
        $cp = \App\Models\CareerPath::findOrFail($id);
        $data = $request->validate([
            'icon' => 'required|string',
            'title' => 'required|string',
            'tags' => 'required|array',
            'desc' => 'required|string',
            'skills' => 'required|array',
            'outlook' => 'required|string',
            'salary' => 'required|string',
            'color' => 'required|string',
            'order' => 'required|integer',
        ]);
        $cp->update($data);
        return response()->json(['success' => true, 'career_path' => $cp]);
    }

    public function deleteCareerPath($id)
    {
        \App\Models\CareerPath::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    // 12. Alumni Testimonials CRUD
    public function uploadAlumniAvatar(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,svg,webp|max:5120',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $filename = 'alumni_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
            if (!file_exists(public_path('images/alumni'))) {
                mkdir(public_path('images/alumni'), 0755, true);
            }
            $file->move(public_path('images/alumni'), $filename);

            return response()->json([
                'success' => true,
                'path' => '/images/alumni/' . $filename
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded.'], 400);
    }

    public function getAlumniTestimonials()
    {
        return response()->json(\App\Models\AlumniTestimonial::orderBy('order', 'asc')->get());
    }

    public function createAlumniTestimonial(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string',
            'role' => 'required|string',
            'company' => 'required|string',
            'year' => 'required|string',
            'quote' => 'required|string',
            'avatar' => 'nullable|string',
            'image' => 'nullable|string',
            'color' => 'required|string',
            'order' => 'required|integer',
        ]);
        $at = \App\Models\AlumniTestimonial::create($data);
        return response()->json(['success' => true, 'alumni_testimonial' => $at]);
    }

    public function updateAlumniTestimonial(Request $request, $id)
    {
        $at = \App\Models\AlumniTestimonial::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string',
            'role' => 'required|string',
            'company' => 'required|string',
            'year' => 'required|string',
            'quote' => 'required|string',
            'avatar' => 'nullable|string',
            'image' => 'nullable|string',
            'color' => 'required|string',
            'order' => 'required|integer',
        ]);
        $at->update($data);
        return response()->json(['success' => true, 'alumni_testimonial' => $at]);
    }

    public function deleteAlumniTestimonial($id)
    {
        \App\Models\AlumniTestimonial::findOrFail($id)->delete();
        return response()->json(['success' => true]);
    }

    public function getAlumniShareLink()
    {
        $setting = \App\Models\Setting::where('key', 'alumni_share_story_link')->first();
        return response()->json([
            'link' => $setting ? $setting->value : '/#contact'
        ]);
    }

    public function updateAlumniShareLink(Request $request)
    {
        $request->validate([
            'link' => 'nullable|string',
        ]);
        
        $link = $request->input('link', '/#contact');
        if (empty($link)) {
            $link = '/#contact';
        }

        \App\Models\Setting::updateOrCreate(
            ['key' => 'alumni_share_story_link'],
            ['value' => $link]
        );

        $this->logActivity('update_alumni_link', "Updated Alumni share story link to: '{$link}'");

        return response()->json(['success' => true, 'link' => $link]);
    }

    public function getSmtpSettings()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $envPath = base_path('.env');
        $settings = [
            'mail_mailer' => env('MAIL_MAILER', 'log'),
            'mail_host' => env('MAIL_HOST', '127.0.0.1'),
            'mail_port' => env('MAIL_PORT', '2525'),
            'mail_username' => env('MAIL_USERNAME', ''),
            'mail_password' => env('MAIL_PASSWORD', ''),
            'mail_encryption' => env('MAIL_ENCRYPTION', ''),
            'mail_from_address' => env('MAIL_FROM_ADDRESS', 'hello@example.com'),
            'mail_from_name' => env('MAIL_FROM_NAME', ''),
        ];

        if (file_exists($envPath)) {
            $content = file_get_contents($envPath);
            $lines = explode("\n", $content);
            foreach ($lines as $line) {
                $line = trim($line);
                if (empty($line) || str_starts_with($line, '#')) {
                    continue;
                }
                if (str_contains($line, '=')) {
                    list($key, $value) = explode('=', $line, 2);
                    $key = trim($key);
                    $value = trim($value, " '\"\t\n\r\0\x0B");
                    
                    switch ($key) {
                        case 'MAIL_MAILER':
                            $settings['mail_mailer'] = $value;
                            break;
                        case 'MAIL_HOST':
                            $settings['mail_host'] = $value;
                            break;
                        case 'MAIL_PORT':
                            $settings['mail_port'] = $value;
                            break;
                        case 'MAIL_USERNAME':
                            $settings['mail_username'] = $value === 'null' ? '' : $value;
                            break;
                        case 'MAIL_PASSWORD':
                            $settings['mail_password'] = $value === 'null' ? '' : $value;
                            break;
                        case 'MAIL_ENCRYPTION':
                            $settings['mail_encryption'] = $value === 'null' ? '' : $value;
                            break;
                        case 'MAIL_FROM_ADDRESS':
                            $settings['mail_from_address'] = $value;
                            break;
                        case 'MAIL_FROM_NAME':
                            $settings['mail_from_name'] = $value;
                            break;
                    }
                }
            }
        }

        return response()->json($settings);
    }

    public function updateSmtpSettings(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $data = $request->validate([
            'mail_mailer' => 'required|string|in:smtp,log',
            'mail_host' => 'required|string',
            'mail_port' => 'required|integer',
            'mail_username' => 'nullable|string',
            'mail_password' => 'nullable|string',
            'mail_encryption' => 'nullable|string',
            'mail_from_address' => 'required|string',
            'mail_from_name' => 'required|string',
        ]);

        $envPath = base_path('.env');
        if (!file_exists($envPath)) {
            return response()->json(['success' => false, 'message' => '.env file not found.'], 500);
        }

        $content = file_get_contents($envPath);

        $replacements = [
            'MAIL_MAILER' => $data['mail_mailer'],
            'MAIL_HOST' => '"' . $data['mail_host'] . '"',
            'MAIL_PORT' => $data['mail_port'],
            'MAIL_USERNAME' => $data['mail_username'] ? '"' . $data['mail_username'] . '"' : 'null',
            'MAIL_PASSWORD' => $data['mail_password'] ? '"' . $data['mail_password'] . '"' : 'null',
            'MAIL_ENCRYPTION' => $data['mail_encryption'] ? '"' . $data['mail_encryption'] . '"' : 'null',
            'MAIL_FROM_ADDRESS' => '"' . $data['mail_from_address'] . '"',
            'MAIL_FROM_NAME' => '"' . $data['mail_from_name'] . '"',
        ];

        foreach ($replacements as $key => $val) {
            $pattern = "/^{$key}=.*/m";
            if (preg_match($pattern, $content)) {
                $content = preg_replace($pattern, "{$key}={$val}", $content);
            } else {
                $content .= "\n{$key}={$val}";
            }
        }

        file_put_contents($envPath, $content);

        $this->logActivity('update_smtp', 'Updated SMTP/ENV configurations.');

        try {
            \Illuminate\Support\Facades\Artisan::call('config:clear');
        } catch (\Exception $e) {
            // ignore
        }

        return response()->json(['success' => true]);
    }

    // 14. User Management CRUD
    public function getUsers()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }
        return response()->json(User::orderBy('name', 'asc')->get(['id', 'name', 'email', 'role', 'created_at']));
    }

    public function createUser(Request $request)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email',
            'role' => 'required|string|in:admin,editor',
        ]);

        $plainPassword = \Illuminate\Support\Str::random(12);

        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($plainPassword),
            'role' => $data['role'],
        ]);

        $loginUrl = url('/login');
        $name = htmlspecialchars($user->name);
        $email = htmlspecialchars($user->email);
        $role = htmlspecialchars($user->role);
        $escapedPassword = htmlspecialchars($plainPassword);

        $htmlBody = '
<div style="font-family: \'Inter\', -apple-system, BlinkMacSystemFont, \'Segoe UI\', Roboto, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; border-radius: 12px; background-color: #ffffff;">
    <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 1.5rem; font-weight: 800; color: #15803d; background-color: #f0fdf4; padding: 8px 16px; border-radius: 8px; display: inline-block; letter-spacing: 0.05em; border: 1.5px solid rgba(21,128,61,0.2);">JPCS PORTAL</span>
    </div>
    <h2 style="color: #0f172a; font-size: 1.25rem; font-weight: 800; margin-top: 0; margin-bottom: 16px;">Welcome to the JPCS Control Panel</h2>
    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">Hello <strong>' . $name . '</strong>,</p>
    <p style="color: #475569; font-size: 0.95rem; line-height: 1.6; margin-bottom: 20px;">An administrator has created an account for you with the role of <strong style="text-transform: uppercase; color: #15803d;">' . $role . '</strong>.</p>
    
    <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 18px; margin-bottom: 24px;">
        <p style="margin-top: 0; margin-bottom: 10px; font-size: 0.85rem; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.05em;">Your Credentials</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 0.95rem;">
            <tr>
                <td style="padding: 6px 0; color: #64748b; width: 120px;">Email:</td>
                <td style="padding: 6px 0; color: #0f172a; font-weight: 600;">' . $email . '</td>
            </tr>
            <tr>
                <td style="padding: 6px 0; color: #64748b;">Password:</td>
                <td style="padding: 6px 0; color: #052e16; font-weight: 700; font-family: monospace; font-size: 1.1rem; background-color: #f0fdf4; padding: 2px 8px; border-radius: 4px; display: inline-block;">' . $escapedPassword . '</td>
            </tr>
        </table>
    </div>

    <div style="text-align: center; margin-bottom: 24px;">
        <a href="' . $loginUrl . '" style="background-color: #15803d; color: #ffffff; padding: 12px 28px; text-decoration: none; border-radius: 6px; font-weight: 700; font-size: 0.9rem; display: inline-block; transition: background-color 0.2s;">Access Control Panel</a>
    </div>

    <p style="color: #ef4444; font-size: 0.82rem; line-height: 1.5; margin-bottom: 20px; font-weight: 600; padding: 8px 12px; background-color: #fef2f2; border-radius: 6px; border: 1px solid #fca5a5;">⚠️ Important: For security, please log in and update your password immediately from your account profile settings.</p>

    <hr style="border: 0; border-top: 1px solid #e2e8f0; margin-bottom: 20px;">
    
    <p style="color: #94a3b8; font-size: 0.78rem; text-align: center; margin: 0;">Junior Philippine Computer Society OLSHCo Chapter</p>
    <p style="color: #94a3b8; font-size: 0.78rem; text-align: center; margin-top: 4px;">This is an automated system notification. Please do not reply directly to this email.</p>
</div>
';

        $emailSent = false;
        try {
            \Illuminate\Support\Facades\Mail::html($htmlBody, function ($mail) use ($user) {
                $mail->to($user->email)
                     ->subject('Welcome to JPCS Portal - Your New Admin/Editor Account');
            });
            $emailSent = true;
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::warning("Failed to send welcome email to {$user->email}: " . $e->getMessage());
        }

        return response()->json([
            'success' => true, 
            'user' => $user, 
            'email_sent' => $emailSent
        ]);
    }

    public function updateUser(Request $request, $id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $user = User::findOrFail($id);
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'password' => 'nullable|string|min:6',
            'role' => 'required|string|in:admin,editor',
        ]);

        // Safety check for demotion
        if ($user->role === 'admin' && $data['role'] === 'editor') {
            $adminCount = User::where('role', 'admin')->count();
            if ($user->id === Auth::id()) {
                return response()->json([
                    'success' => false,
                    'message' => 'You cannot demote your own account to editor.'
                ], 422);
            }
            if ($adminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot demote the last admin user in the system to editor.'
                ], 422);
            }
        }

        $updateData = [
            'name' => $data['name'],
            'email' => $data['email'],
            'role' => $data['role'],
        ];

        if (!empty($data['password'])) {
            $updateData['password'] = Hash::make($data['password']);
        }

        $user->update($updateData);
        return response()->json(['success' => true, 'user' => $user]);
    }

    public function deleteUser($id)
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $user = User::findOrFail($id);

        if ($user->id === Auth::id()) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own admin account.'
            ], 422);
        }

        // Count current admins (only block if we are deleting an admin and they are the last one)
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json([
                    'success' => false,
                    'message' => 'Cannot delete the last admin user in the system.'
                ], 422);
            }
        }

        $user->delete();
        return response()->json(['success' => true]);
    }

    public function getLoginLogs()
    {
        if (Auth::user()->role !== 'admin') {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized. Only administrators can perform this action.'
            ], 403);
        }

        $logs = AuditLog::with('user:id,name')->orderBy('created_at', 'desc')->get();
        return response()->json($logs);
    }
}
