<?php

namespace App\Providers;

use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        $models = [
            \App\Models\User::class,
            \App\Models\Pillar::class,
            \App\Models\Officer::class,
            \App\Models\Team::class,
            \App\Models\Event::class,
            \App\Models\NewsItem::class,
            \App\Models\Faq::class,
            \App\Models\StudentResource::class,
            \App\Models\CareerPath::class,
            \App\Models\AlumniTestimonial::class,
        ];

        foreach ($models as $modelClass) {
            $modelClass::created(function ($model) {
                $this->logModelActivity($model, 'created');
            });

            $modelClass::updated(function ($model) {
                $this->logModelActivity($model, 'updated');
            });

            $modelClass::deleted(function ($model) {
                $this->logModelActivity($model, 'deleted');
            });
        }
    }

    private function logModelActivity($model, string $event)
    {
        try {
            $modelName = class_basename($model);
            $identifier = $model->name ?? $model->title ?? $model->question ?? $model->email ?? ('ID: ' . $model->id);
            
            // Generate action key: e.g. "create_news_item"
            $snakeModelName = strtolower(preg_replace('/(?<!^)[A-Z]/', '_$0', $modelName));
            
            // Map created -> create, updated -> update, deleted -> delete for consistency
            $actionVerb = match ($event) {
                'created' => 'create',
                'updated' => 'update',
                'deleted' => 'delete',
                default => $event
            };
            
            $actionType = "{$actionVerb}_{$snakeModelName}";
            $description = ucfirst($actionVerb) . "d {$modelName}: '{$identifier}'";

            \App\Models\AuditLog::create([
                'user_id' => \Illuminate\Support\Facades\Auth::id(),
                'email' => \Illuminate\Support\Facades\Auth::check() ? \Illuminate\Support\Facades\Auth::user()->email : 'system',
                'action' => $actionType,
                'description' => $description,
                'ip_address' => request()->ip(),
                'user_agent' => request()->userAgent(),
            ]);
        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error("Failed to log model activity: " . $e->getMessage());
        }
    }
}
