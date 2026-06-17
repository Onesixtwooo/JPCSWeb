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
    return view('welcome');
});

Route::get('/about', function () {
    return view('welcome');
});

Route::get('/news', function () {
    return view('welcome');
});

Route::get('/news/{id}', function () {
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

    Route::post('/api/faqs', [AdminController::class, 'createFaq']);
    Route::put('/api/faqs/{id}', [AdminController::class, 'updateFaq']);
    Route::delete('/api/faqs/{id}', [AdminController::class, 'deleteFaq']);
});
