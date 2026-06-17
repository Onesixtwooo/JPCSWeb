<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('officers', function (Blueprint $table) {
            $table->string('officer_name')->nullable()->after('title');
            $table->string('year_level')->nullable()->after('officer_name');
            $table->string('motto')->nullable()->after('year_level');
        });
    }

    public function down(): void
    {
        Schema::table('officers', function (Blueprint $table) {
            $table->dropColumn(['officer_name', 'year_level', 'motto']);
        });
    }
};
