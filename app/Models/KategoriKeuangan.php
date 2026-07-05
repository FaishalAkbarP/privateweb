<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class KategoriKeuangan extends Model
{
    use HasFactory;

    protected $fillable = ['nama', 'tipe'];

    public function transaksis(): HasMany
    {
        return $this->hasMany(Transaksi::class);
    }
}
