import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const emptyForm = {
    id: null,
    nama_latihan: '',
    jumlah_set: '',
    repetisi: '',
    durasi_menit: '',
    catatan: '',
};

export default function Index({ daftarOlahraga }) {
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, put, reset, processing, errors } = useForm(emptyForm);

    const bukaFormTambah = () => { reset(); setShowForm(true); };

    const bukaFormEdit = (item) => {
        setData({
            id: item.id,
            nama_latihan: item.nama_latihan,
            jumlah_set: item.jumlah_set,
            repetisi: item.repetisi,
            durasi_menit: item.durasi_menit ?? '',
            catatan: item.catatan ?? '',
        });
        setShowForm(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.id) {
            put(`/olahraga/${data.id}`, { onSuccess: () => { reset(); setShowForm(false); } });
        } else {
            post('/olahraga', { onSuccess: () => { reset(); setShowForm(false); } });
        }
    };

    const hapus = (id) => {
        if (confirm('Hapus data olahraga ini? Jadwal yang mengacu ke sini akan kehilangan referensinya.')) {
            router.delete(`/olahraga/${id}`);
        }
    };

    return (
        <AppLayout>
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-slate-800">Data Master Olahraga</h2>
                <button onClick={bukaFormTambah} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">
                    + Tambah Latihan
                </button>
            </div>
            <p className="text-sm text-slate-500 mb-4">
                Data di sini dipakai ulang oleh Jadwal Harian. Mengubah set/repetisi/durasi di sini akan otomatis memperbarui semua jadwal yang mereferensikannya.
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
                {daftarOlahraga.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="font-medium text-slate-800">{item.nama_latihan}</p>
                                <p className="text-sm text-slate-500">
                                    {item.jumlah_set} set x {item.repetisi} rep
                                    {item.durasi_menit ? ` · ${item.durasi_menit} menit` : ''}
                                </p>
                                {item.catatan && <p className="text-xs text-slate-400 mt-1">{item.catatan}</p>}
                                <p className="text-xs text-slate-400 mt-1">Dipakai di {item.jadwals_count} jadwal</p>
                            </div>
                            <div className="flex gap-2 shrink-0">
                                <button onClick={() => bukaFormEdit(item)} className="text-sm text-indigo-600 hover:underline">Ubah</button>
                                <button onClick={() => hapus(item.id)} className="text-sm text-red-600 hover:underline">Hapus</button>
                            </div>
                        </div>
                    </div>
                ))}
                {daftarOlahraga.length === 0 && <p className="text-sm text-slate-400 italic">Belum ada data olahraga.</p>}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-20">
                    <form onSubmit={submit} className="bg-white rounded-lg p-5 w-full max-w-md space-y-3 shadow-xl">
                        <h3 className="font-semibold text-slate-800">{data.id ? 'Ubah Latihan' : 'Tambah Latihan'}</h3>

                        <div>
                            <label className="text-sm text-slate-600">Nama Latihan</label>
                            <input value={data.nama_latihan} onChange={(e) => setData('nama_latihan', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            {errors.nama_latihan && <p className="text-xs text-red-500">{errors.nama_latihan}</p>}
                        </div>

                        <div className="grid grid-cols-3 gap-2">
                            <div>
                                <label className="text-sm text-slate-600">Set</label>
                                <input type="number" min="0" value={data.jumlah_set} onChange={(e) => setData('jumlah_set', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Repetisi</label>
                                <input type="number" min="0" value={data.repetisi} onChange={(e) => setData('repetisi', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Durasi (menit)</label>
                                <input type="number" min="0" value={data.durasi_menit} onChange={(e) => setData('durasi_menit', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Catatan</label>
                            <textarea value={data.catatan} onChange={(e) => setData('catatan', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" rows={2} />
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button type="button" onClick={() => { setShowForm(false); reset(); }} className="px-3 py-1.5 text-sm text-slate-600">Batal</button>
                            <button type="submit" disabled={processing} className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700">Simpan</button>
                        </div>
                    </form>
                </div>
            )}
        </AppLayout>
    );
}
