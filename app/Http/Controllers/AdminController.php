<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\Setting;
use App\Models\Pillar;
use App\Models\Officer;
use App\Models\Team;
use App\Models\Event;
use App\Models\NewsItem;
use App\Models\ContactMessage;
use App\Models\Faq;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AdminController extends Controller
{
    // 1. Authentication
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::attempt($credentials, true)) {
            $request->session()->regenerate();
            return response()->json([
                'success' => true,
                'message' => 'Logged in successfully',
                'user' => Auth::user(),
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Invalid email or password credentials.',
        ], 401);
    }

    public function logout(Request $request)
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

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

        // Try finding by slugified title
        $newsItems = NewsItem::all();
        foreach ($newsItems as $item) {
            if (\Illuminate\Support\Str::slug($item->title) === $id) {
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
        return response()->json(ContactMessage::orderBy('created_at', 'desc')->get());
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
}
