<?php

use App\Http\Controllers\JadwalController;
use App\Http\Controllers\KategoriKeuanganController;
use App\Http\Controllers\OlahragaController;
use App\Http\Controllers\TransaksiController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return redirect()->route('jadwal.index');
});

// ===== Jadwal Harian =====
Route::get('/jadwal', [JadwalController::class, 'index'])->name('jadwal.index');
Route::post('/jadwal', [JadwalController::class, 'store'])->name('jadwal.store');
Route::put('/jadwal/{jadwal}', [JadwalController::class, 'update'])->name('jadwal.update');
Route::delete('/jadwal/{jadwal}', [JadwalController::class, 'destroy'])->name('jadwal.destroy');

// ===== Master Data Olahraga =====
Route::get('/olahraga', [OlahragaController::class, 'index'])->name('olahraga.index');
Route::post('/olahraga', [OlahragaController::class, 'store'])->name('olahraga.store');
Route::put('/olahraga/{olahraga}', [OlahragaController::class, 'update'])->name('olahraga.update');
Route::delete('/olahraga/{olahraga}', [OlahragaController::class, 'destroy'])->name('olahraga.destroy');

// ===== Keuangan =====
Route::get('/keuangan', [TransaksiController::class, 'index'])->name('keuangan.index');
Route::post('/keuangan', [TransaksiController::class, 'store'])->name('keuangan.store');
Route::put('/keuangan/{transaksi}', [TransaksiController::class, 'update'])->name('keuangan.update');
Route::delete('/keuangan/{transaksi}', [TransaksiController::class, 'destroy'])->name('keuangan.destroy');

Route::post('/keuangan/kategori', [KategoriKeuanganController::class, 'store'])->name('keuangan.kategori.store');
Route::put('/keuangan/kategori/{kategoriKeuangan}', [KategoriKeuanganController::class, 'update'])->name('keuangan.kategori.update');
Route::delete('/keuangan/kategori/{kategoriKeuangan}', [KategoriKeuanganController::class, 'destroy'])->name('keuangan.kategori.destroy');
