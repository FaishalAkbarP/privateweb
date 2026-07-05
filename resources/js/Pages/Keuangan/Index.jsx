import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const emptyForm = {
    id: null,
    tipe: 'pengeluaran',
    kategori_keuangan_id: '',
    nominal: '',
    tanggal: new Date().toISOString().slice(0, 10),
    keterangan: '',
};

const emptyKategoriForm = { nama: '', tipe: 'pengeluaran' };

function formatRupiah(angka) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(angka || 0);
}

export default function Index({ transaksis, kategoris, ringkasan, filterBulan }) {
    const [showForm, setShowForm] = useState(false);
    const [showKategoriForm, setShowKategoriForm] = useState(false);
    const { data, setData, post, put, reset, processing, errors } = useForm(emptyForm);
    const kategoriForm = useForm(emptyKategoriForm);

    const bukaFormTambah = () => { reset(); setShowForm(true); };

    const bukaFormEdit = (item) => {
        setData({
            id: item.id,
            tipe: item.tipe,
            kategori_keuangan_id: item.kategori_keuangan_id,
            nominal: item.nominal,
            tanggal: item.tanggal,
            keterangan: item.keterangan ?? '',
        });
        setShowForm(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.id) {
            put(`/keuangan/${data.id}`, { onSuccess: () => { reset(); setShowForm(false); } });
        } else {
            post('/keuangan', { onSuccess: () => { reset(); setShowForm(false); } });
        }
    };

    const hapus = (id) => {
        if (confirm('Hapus transaksi ini?')) router.delete(`/keuangan/${id}`);
    };

    const submitKategori = (e) => {
        e.preventDefault();
        kategoriForm.post('/keuangan/kategori', {
            onSuccess: () => { kategoriForm.reset(); setShowKategoriForm(false); },
        });
    };

    const ubahFilterBulan = (val) => {
        router.get('/keuangan', val ? { bulan: val } : {}, { preserveState: true });
    };

    const kategoriTerfilter = kategoris.filter((k) => k.tipe === data.tipe);

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
                <h2 className="text-xl font-bold text-slate-800">Keuangan</h2>
                <div className="flex gap-2 items-center">
                    <input type="month" value={filterBulan ?? ''} onChange={(e) => ubahFilterBulan(e.target.value)} className="border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                    <button onClick={() => setShowKategoriForm(true)} className="px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-md hover:bg-slate-300">
                        + Kategori
                    </button>
                    <button onClick={bukaFormTambah} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                        + Transaksi
                    </button>
                </div>
            </div>

            {/* Ringkasan */}
            <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-3">
                    <p className="text-xs text-emerald-700">Total Pemasukan</p>
                    <p className="font-semibold text-emerald-800">{formatRupiah(ringkasan.total_pemasukan)}</p>
                </div>
                <div className="bg-red-50 border border-red-100 rounded-lg p-3">
                    <p className="text-xs text-red-700">Total Pengeluaran</p>
                    <p className="font-semibold text-red-800">{formatRupiah(ringkasan.total_pengeluaran)}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3">
                    <p className="text-xs text-indigo-700">Saldo</p>
                    <p className="font-semibold text-indigo-800">{formatRupiah(ringkasan.saldo)}</p>
                </div>
            </div>

            {/* Riwayat */}
            <div className="bg-white border border-slate-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                    <thead className="bg-slate-50 text-slate-500 text-left">
                        <tr>
                            <th className="px-3 py-2">Tanggal</th>
                            <th className="px-3 py-2">Kategori</th>
                            <th className="px-3 py-2">Keterangan</th>
                            <th className="px-3 py-2 text-right">Nominal</th>
                            <th className="px-3 py-2"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {transaksis.map((t) => (
                            <tr key={t.id} className="border-t border-slate-100">
                                <td className="px-3 py-2">{t.tanggal}</td>
                                <td className="px-3 py-2">{t.kategori?.nama}</td>
                                <td className="px-3 py-2 text-slate-500">{t.keterangan}</td>
                                <td className={`px-3 py-2 text-right font-medium ${t.tipe === 'pemasukan' ? 'text-emerald-700' : 'text-red-700'}`}>
                                    {t.tipe === 'pemasukan' ? '+' : '-'} {formatRupiah(t.nominal)}
                                </td>
                                <td className="px-3 py-2 text-right whitespace-nowrap">
                                    <button onClick={() => bukaFormEdit(t)} className="text-indigo-600 hover:underline mr-2">Ubah</button>
                                    <button onClick={() => hapus(t.id)} className="text-red-600 hover:underline">Hapus</button>
                                </td>
                            </tr>
                        ))}
                        {transaksis.length === 0 && (
                            <tr><td colSpan={5} className="px-3 py-4 text-center text-slate-400 italic">Belum ada transaksi.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Form transaksi */}
            {showForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-20">
                    <form onSubmit={submit} className="bg-white rounded-lg p-5 w-full max-w-md space-y-3 shadow-xl">
                        <h3 className="font-semibold text-slate-800">{data.id ? 'Ubah Transaksi' : 'Tambah Transaksi'}</h3>

                        <div>
                            <label className="text-sm text-slate-600">Tipe</label>
                            <select value={data.tipe} onChange={(e) => setData((prev) => ({ ...prev, tipe: e.target.value, kategori_keuangan_id: '' }))} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm">
                                <option value="pemasukan">Pemasukan</option>
                                <option value="pengeluaran">Pengeluaran</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Kategori</label>
                            <select value={data.kategori_keuangan_id} onChange={(e) => setData('kategori_keuangan_id', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm">
                                <option value="">-- Pilih kategori --</option>
                                {kategoriTerfilter.map((k) => <option key={k.id} value={k.id}>{k.nama}</option>)}
                            </select>
                            {errors.kategori_keuangan_id && <p className="text-xs text-red-500">{errors.kategori_keuangan_id}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Nominal (Rp)</label>
                            <input type="number" min="0" value={data.nominal} onChange={(e) => setData('nominal', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            {errors.nominal && <p className="text-xs text-red-500">{errors.nominal}</p>}
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Tanggal</label>
                            <input type="date" value={data.tanggal} onChange={(e) => setData('tanggal', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Keterangan</label>
                            <input value={data.keterangan} onChange={(e) => setData('keterangan', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-3 py-1.5 text-sm text-slate-600">Batal</button>
                            <button type="submit" disabled={processing} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Simpan</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Form kategori */}
            {showKategoriForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-20">
                    <form onSubmit={submitKategori} className="bg-white rounded-lg p-5 w-full max-w-sm space-y-3 shadow-xl">
                        <h3 className="font-semibold text-slate-800">Tambah Kategori</h3>
                        <div>
                            <label className="text-sm text-slate-600">Nama Kategori</label>
                            <input value={kategoriForm.data.nama} onChange={(e) => kategoriForm.setData('nama', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" placeholder="Mis. Gaji, Makan, Transportasi" />
                        </div>
                        <div>
                            <label className="text-sm text-slate-600">Tipe</label>
                            <select value={kategoriForm.data.tipe} onChange={(e) => kategoriForm.setData('tipe', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm">
                                <option value="pemasukan">Pemasukan</option>
                                <option value="pengeluaran">Pengeluaran</option>
                            </select>
                        </div>
                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => setShowKategoriForm(false)} className="px-3 py-1.5 text-sm text-slate-600">Batal</button>
                            <button type="submit" className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Simpan</button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}
