<?php

namespace App\Http\Controllers;

use App\Models\KategoriKeuangan;
use App\Models\Transaksi;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TransaksiController extends Controller
{
    public function index(Request $request)
    {
        $query = Transaksi::with('kategori')->orderByDesc('tanggal')->orderByDesc('id');

        if ($request->filled('bulan')) {
            // format bulan: YYYY-MM
            $query->whereRaw("DATE_FORMAT(tanggal, '%Y-%m') = ?", [$request->input('bulan')]);
        }

        $transaksis = $query->get();

        $filterBulan = fn ($q) => $q->when($request->filled('bulan'), fn ($q2) => $q2->whereRaw("DATE_FORMAT(tanggal, '%Y-%m') = ?", [$request->input('bulan')]));

        $totalPemasukan = $filterBulan(Transaksi::query())->where('tipe', 'pemasukan')->sum('nominal');
        $totalPengeluaran = $filterBulan(Transaksi::query())->where('tipe', 'pengeluaran')->sum('nominal');

        return Inertia::render('Keuangan/Index', [
            'transaksis' => $transaksis,
            'kategoris' => KategoriKeuangan::orderBy('nama')->get(),
            'ringkasan' => [
                'total_pemasukan' => (float) $totalPemasukan,
                'total_pengeluaran' => (float) $totalPengeluaran,
                'saldo' => (float) $totalPemasukan - (float) $totalPengeluaran,
            ],
            'filterBulan' => $request->input('bulan'),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'kategori_keuangan_id' => 'required|exists:kategori_keuangans,id',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        Transaksi::create($data);

        return redirect()->back()->with('success', 'Transaksi berhasil dicatat.');
    }

    public function update(Request $request, Transaksi $transaksi)
    {
        $data = $request->validate([
            'tipe' => 'required|in:pemasukan,pengeluaran',
            'kategori_keuangan_id' => 'required|exists:kategori_keuangans,id',
            'nominal' => 'required|numeric|min:0',
            'tanggal' => 'required|date',
            'keterangan' => 'nullable|string|max:255',
        ]);

        $transaksi->update($data);

        return redirect()->back()->with('success', 'Transaksi berhasil diperbarui.');
    }

    public function destroy(Transaksi $transaksi)
    {
        $transaksi->delete();

        return redirect()->back()->with('success', 'Transaksi berhasil dihapus.');
    }
}
