<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('olahragas', function (Blueprint $table) {
            $table->id();
            $table->string('nama_latihan');
            $table->unsignedInteger('jumlah_set')->default(0);
            $table->unsignedInteger('repetisi')->default(0);
            $table->unsignedInteger('durasi_menit')->nullable(); // untuk latihan berbasis waktu (mis. plank, lari)
            $table->text('catatan')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('olahragas');
    }
};
