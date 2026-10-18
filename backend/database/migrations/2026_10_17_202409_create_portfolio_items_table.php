<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('portfolio_items', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->string('category'); // graphic, webdev, smm, googleads, seo
            $table->string('category_label')->nullable();
            $table->string('metrics')->nullable();
            $table->text('desc');
            $table->json('tags')->nullable();
            $table->string('image')->nullable();
            $table->string('project_url')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('portfolio_items');
    }
};
