<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Olahraga extends Model
{
    use HasFactory;

    protected $fillable = [
        'nama_latihan',
        'jumlah_set',
        'repetisi',
        'durasi_menit',
        'catatan',
    ];

    /**
     * Semua jadwal yang mengacu ke data olahraga ini.
     * Karena relasi ini, perubahan pada data master (set/repetisi/durasi)
     * otomatis terlihat di semua jadwal yang menggunakannya.
     */
    public function jadwals(): HasMany
    {
        return $this->hasMany(Jadwal::class);
    }
}
