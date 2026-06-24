<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AdminController;

// Page rendering routes
Route::get('/', function () {
    return view('welcome');
});

Route::get('/admin/{any?}', function () {
    return view('welcome');
})->where('any', '.*');

Route::get('/login', function () {
    if (\Illuminate\Support\Facades\Auth::check()) {
        return redirect('/admin');
    }
    return view('welcome');
});

Route::get('/about', function () {
    return view('welcome');
});

Route::get('/news', function () {
    return view('welcome');
});

Route::get('/news/{id}', function ($id) {
    $article = null;

    if (is_numeric($id)) {
        $article = \App\Models\NewsItem::find($id);
    } else {
        $slugify = function (string $title): string {
            $title = mb_strtolower($title, 'UTF-8');
            return trim(preg_replace('/[^a-z0-9]+/', '-', $title), '-');
        };

        $article = \App\Models\NewsItem::all()->first(
            fn (\App\Models\NewsItem $item) => $slugify($item->title) === $id
        );
    }

    if (!$article) {
        return view('welcome');
    }

    $images = $article->images ?: [];
    $image = $images[0] ?? \App\Models\Setting::where('key', 'brand_logo')->value('value');

    return view('welcome', [
        'shareMeta' => [
            'title' => $article->title,
            'description' => $article->excerpt,
            'image' => $image ? url($image) : null,
            'url' => url()->current(),
            'type' => 'article',
        ],
    ]);
});

Route::get('/career', function () {
    return view('welcome');
});

Route::get('/resources', function () {
    return view('welcome');
});

// Public API routes
Route::post('/api/contact-messages', [AdminController::class, 'submitContactMessage']);
Route::get('/api/about', [AdminController::class, 'getAbout']);
Route::get('/api/hero-settings', [AdminController::class, 'getHeroSettings']);
Route::get('/api/contact-settings', [AdminController::class, 'getContactSettings']);
Route::get('/api/pillars', [AdminController::class, 'getPillars']);
Route::get('/api/officers', [AdminController::class, 'getOfficers']);
Route::get('/api/teams', [AdminController::class, 'getTeams']);
Route::get('/api/events', [AdminController::class, 'getEvents']);
Route::get('/api/events-settings', [AdminController::class, 'getEventsSettings']);
Route::get('/api/news', [AdminController::class, 'getNews']);
Route::get('/api/news/{id}', [AdminController::class, 'getNewsItem']);
Route::get('/api/faqs', [AdminController::class, 'getFaqs']);
Route::get('/api/student-resources', [AdminController::class, 'getStudentResources']);
Route::get('/api/career-paths', [AdminController::class, 'getCareerPaths']);
Route::get('/api/alumni-testimonials', [AdminController::class, 'getAlumniTestimonials']);
Route::get('/api/alumni-share-link', [AdminController::class, 'getAlumniShareLink']);

// Auth management
Route::post('/api/login', [AdminController::class, 'login']);
Route::post('/api/logout', [AdminController::class, 'logout']);
Route::get('/api/auth/check', [AdminController::class, 'authCheck']);

// Protected Admin API routes
Route::middleware('auth')->group(function () {
    Route::post('/api/about', [AdminController::class, 'updateAbout']);
    Route::post('/api/hero-settings', [AdminController::class, 'updateHeroSettings']);
    Route::post('/api/about/upload-logo', [AdminController::class, 'uploadLogo']);
    Route::post('/api/about/upload-image', [AdminController::class, 'uploadAboutImage']);
    Route::post('/api/contact-settings', [AdminController::class, 'updateContactSettings']);

    Route::post('/api/pillars/upload-lottie', [AdminController::class, 'uploadPillarLottie']);
    Route::post('/api/pillars', [AdminController::class, 'createPillar']);
    Route::put('/api/pillars/{id}', [AdminController::class, 'updatePillar']);
    Route::delete('/api/pillars/{id}', [AdminController::class, 'deletePillar']);

    Route::post('/api/officers', [AdminController::class, 'createOfficer']);
    Route::put('/api/officers/{id}', [AdminController::class, 'updateOfficer']);
    Route::delete('/api/officers/{id}', [AdminController::class, 'deleteOfficer']);

    Route::post('/api/teams', [AdminController::class, 'createTeam']);
    Route::put('/api/teams/{id}', [AdminController::class, 'updateTeam']);
    Route::delete('/api/teams/{id}', [AdminController::class, 'deleteTeam']);
    Route::post('/api/teams/upload-logo', [AdminController::class, 'uploadTeamLogo']);

    Route::post('/api/events', [AdminController::class, 'createEvent']);
    Route::put('/api/events/{id}', [AdminController::class, 'updateEvent']);
    Route::delete('/api/events/{id}', [AdminController::class, 'deleteEvent']);
    Route::post('/api/events/upload-poster', [AdminController::class, 'uploadEventPoster']);
    Route::post('/api/events-settings', [AdminController::class, 'updateEventsSettings']);

    Route::post('/api/news', [AdminController::class, 'createNews']);
    Route::put('/api/news/{id}', [AdminController::class, 'updateNews']);
    Route::delete('/api/news/{id}', [AdminController::class, 'deleteNews']);
    Route::post('/api/news/upload-image', [AdminController::class, 'uploadNewsImage']);

    Route::get('/api/contact-messages', [AdminController::class, 'getContactMessages']);
    Route::delete('/api/contact-messages/{id}', [AdminController::class, 'deleteContactMessage']);
    Route::post('/api/contact-messages/{id}/reply', [AdminController::class, 'replyContactMessage']);

    Route::post('/api/faqs', [AdminController::class, 'createFaq']);
    Route::put('/api/faqs/{id}', [AdminController::class, 'updateFaq']);
    Route::delete('/api/faqs/{id}', [AdminController::class, 'deleteFaq']);

    Route::post('/api/student-resources', [AdminController::class, 'createStudentResource']);
    Route::put('/api/student-resources/{id}', [AdminController::class, 'updateStudentResource']);
    Route::delete('/api/student-resources/{id}', [AdminController::class, 'deleteStudentResource']);

    Route::post('/api/career-paths', [AdminController::class, 'createCareerPath']);
    Route::put('/api/career-paths/{id}', [AdminController::class, 'updateCareerPath']);
    Route::delete('/api/career-paths/{id}', [AdminController::class, 'deleteCareerPath']);

    Route::post('/api/alumni-testimonials', [AdminController::class, 'createAlumniTestimonial']);
    Route::put('/api/alumni-testimonials/{id}', [AdminController::class, 'updateAlumniTestimonial']);
    Route::delete('/api/alumni-testimonials/{id}', [AdminController::class, 'deleteAlumniTestimonial']);
    Route::post('/api/alumni-testimonials/upload-avatar', [AdminController::class, 'uploadAlumniAvatar']);
    Route::post('/api/alumni-share-link', [AdminController::class, 'updateAlumniShareLink']);
    
    // SMTP Credentials / ENV Settings
    Route::get('/api/smtp-settings', [AdminController::class, 'getSmtpSettings']);
    Route::post('/api/smtp-settings', [AdminController::class, 'updateSmtpSettings']);

    // User Management CRUD
    Route::get('/api/users', [AdminController::class, 'getUsers']);
    Route::post('/api/users', [AdminController::class, 'createUser']);
    Route::put('/api/users/{id}', [AdminController::class, 'updateUser']);
    Route::delete('/api/users/{id}', [AdminController::class, 'deleteUser']);

    // Audit Login Logs
    Route::get('/api/audit-logs', [AdminController::class, 'getLoginLogs']);
});
