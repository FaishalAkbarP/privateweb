<?php

namespace App\Http\Controllers;

use App\Models\Olahraga;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OlahragaController extends Controller
{
    public function index()
    {
        return Inertia::render('Olahraga/Index', [
            'daftarOlahraga' => Olahraga::withCount('jadwals')->orderBy('nama_latihan')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'nama_latihan' => 'required|string|max:255',
            'jumlah_set' => 'required|integer|min:0',
            'repetisi' => 'required|integer|min:0',
            'durasi_menit' => 'nullable|integer|min:0',
            'catatan' => 'nullable|string',
        ]);

        Olahraga::create($data);

        return redirect()->back()->with('success', 'Data olahraga berhasil ditambahkan.');
    }

    public function update(Request $request, Olahraga $olahraga)
    {
        $data = $request->validate([
            'nama_latihan' => 'required|string|max:255',
            'jumlah_set' => 'required|integer|min:0',
            'repetisi' => 'required|integer|min:0',
            'durasi_menit' => 'nullable|integer|min:0',
            'catatan' => 'nullable|string',
        ]);

        // Karena Jadwal mengacu ke olahraga_id, perubahan ini otomatis
        // tercermin di semua jadwal yang menggunakan data ini (tidak perlu update manual).
        $olahraga->update($data);

        return redirect()->back()->with('success', 'Data olahraga berhasil diperbarui.');
    }

    public function destroy(Olahraga $olahraga)
    {
        $olahraga->delete(); // jadwal terkait tidak ikut terhapus, olahraga_id akan null (lihat migration)

        return redirect()->back()->with('success', 'Data olahraga berhasil dihapus.');
    }
}
