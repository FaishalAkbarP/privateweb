<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('jadwals', function (Blueprint $table) {
            $table->id();
            // Senin, Selasa, Rabu, Kamis, Jumat, Sabtu, Minggu
            $table->enum('hari', ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu']);
            $table->string('judul'); // nama kegiatan, misal "Latihan Dada" atau "Kuliah Basis Data"
            $table->time('jam_mulai');
            $table->time('jam_selesai')->nullable();
            $table->text('deskripsi')->nullable();
            // Referensi opsional ke master data olahraga.
            // Jika kegiatan ini adalah sesi olahraga, jadwal mengacu ke data master,
            // sehingga perubahan pada data olahraga otomatis terlihat di jadwal ini.
            $table->foreignId('olahraga_id')->nullable()->constrained('olahragas')->nullOnDelete();
            $table->timestamps();

            $table->index(['hari']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('jadwals');
    }
};
