<?php

namespace App\Http\Controllers;

use App\Models\KategoriKeuangan;
use Illuminate\Http\Request;

class KategoriKeuanganController extends Controller
{
    public function store(Request $request)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:pemasukan,pengeluaran',
        ]);

        KategoriKeuangan::create($data);

        return redirect()->back()->with('success', 'Kategori berhasil ditambahkan.');
    }

    public function update(Request $request, KategoriKeuangan $kategoriKeuangan)
    {
        $data = $request->validate([
            'nama' => 'required|string|max:255',
            'tipe' => 'required|in:pemasukan,pengeluaran',
        ]);

        $kategoriKeuangan->update($data);

        return redirect()->back()->with('success', 'Kategori berhasil diperbarui.');
    }

    public function destroy(KategoriKeuangan $kategoriKeuangan)
    {
        $kategoriKeuangan->delete();

        return redirect()->back()->with('success', 'Kategori berhasil dihapus.');
    }
}
