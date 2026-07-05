<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Jadwal extends Model
{
    use HasFactory;

    protected $fillable = [
        'hari',
        'judul',
        'jam_mulai',
        'jam_selesai',
        'deskripsi',
        'olahraga_id',
    ];

    public function olahraga(): BelongsTo
    {
        return $this->belongsTo(Olahraga::class);
    }
}
