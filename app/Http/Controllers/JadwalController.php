<?php

namespace App\Http\Controllers;

use App\Models\Jadwal;
use App\Models\Olahraga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class JadwalController extends Controller
{
    private array $urutanHari = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

    public function index(Request $request)
    {
        $jadwals = Jadwal::with('olahraga')
            ->orderBy('jam_mulai')
            ->get()
            ->groupBy('hari');

        // Pastikan semua hari selalu muncul walau kosong, dan urut Senin-Minggu
        $terkelompok = [];
        foreach ($this->urutanHari as $hari) {
            $terkelompok[$hari] = $jadwals->get($hari, collect())->values();
        }

        return Inertia::render('Jadwal/Index', [
            'jadwalPerHari' => $terkelompok,
            'daftarOlahraga' => Olahraga::orderBy('nama_latihan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'judul' => 'required|string|max:255',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i|after:jam_mulai',
            'deskripsi' => 'nullable|string',
            'olahraga_id' => 'nullable|exists:olahragas,id',
        ]);

        Jadwal::create($data);

        return redirect()->back()->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function update(Request $request, Jadwal $jadwal)
    {
        $data = $request->validate([
            'hari' => 'required|in:Senin,Selasa,Rabu,Kamis,Jumat,Sabtu,Minggu',
            'judul' => 'required|string|max:255',
            'jam_mulai' => 'required|date_format:H:i',
            'jam_selesai' => 'nullable|date_format:H:i|after:jam_mulai',
            'deskripsi' => 'nullable|string',
            'olahraga_id' => 'nullable|exists:olahragas,id',
        ]);

        $jadwal->update($data);

        return redirect()->back()->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Jadwal $jadwal)
    {
        $jadwal->delete();

        return redirect()->back()->with('success', 'Jadwal berhasil dihapus.');
    }
}
