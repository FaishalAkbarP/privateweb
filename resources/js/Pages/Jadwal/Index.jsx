import { useState } from 'react';
import { useForm, router } from '@inertiajs/react';
import AppLayout from '@/Layouts/AppLayout';

const HARI_LIST = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'];

const emptyForm = {
    id: null,
    hari: 'Senin',
    judul: '',
    jam_mulai: '',
    jam_selesai: '',
    deskripsi: '',
    olahraga_id: '',
};

export default function Index({ jadwalPerHari, daftarOlahraga }) {
    const [hariAktif, setHariAktif] = useState('Senin');
    const [showForm, setShowForm] = useState(false);
    const { data, setData, post, put, reset, processing, errors } = useForm(emptyForm);

    const bukaFormTambah = (hari) => {
        reset();
        setData((prev) => ({ ...prev, hari }));
        setShowForm(true);
    };

    const bukaFormEdit = (item) => {
        setData({
            id: item.id,
            hari: item.hari,
            judul: item.judul,
            jam_mulai: item.jam_mulai?.slice(0, 5) ?? '',
            jam_selesai: item.jam_selesai?.slice(0, 5) ?? '',
            deskripsi: item.deskripsi ?? '',
            olahraga_id: item.olahraga_id ?? '',
        });
        setShowForm(true);
    };

    const submit = (e) => {
        e.preventDefault();
        if (data.id) {
            put(`/jadwal/${data.id}`, { onSuccess: () => { reset(); setShowForm(false); } });
        } else {
            post('/jadwal', { onSuccess: () => { reset(); setShowForm(false); } });
        }
    };

    const hapus = (id) => {
        if (confirm('Hapus jadwal ini?')) {
            router.delete(`/jadwal/${id}`);
        }
    };

    const itemHariIni = jadwalPerHari[hariAktif] ?? [];

    return (
        <AppLayout>
            <h2 className="text-xl font-bold text-slate-800 mb-4">Jadwal Harian</h2>

            {/* Tab hari */}
            <div className="flex flex-wrap gap-1 mb-4 border-b border-slate-200">
                {HARI_LIST.map((hari) => (
                    <button
                        key={hari}
                        onClick={() => setHariAktif(hari)}
                        className={`px-3 py-2 text-sm font-medium border-b-2 -mb-px ${
                            hariAktif === hari
                                ? 'border-indigo-600 text-indigo-600'
                                : 'border-transparent text-slate-500 hover:text-slate-700'
                        }`}
                    >
                        {hari}
                        <span className="ml-1 text-xs text-slate-400">({(jadwalPerHari[hari] ?? []).length})</span>
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mb-3">
                <h3 className="font-semibold text-slate-700">Jadwal hari {hariAktif}</h3>
                <button
                    onClick={() => bukaFormTambah(hariAktif)}
                    className="px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                >
                    + Tambah Jadwal
                </button>
            </div>

            <div className="space-y-2">
                {itemHariIni.length === 0 && (
                    <p className="text-sm text-slate-400 italic">Belum ada jadwal untuk hari ini.</p>
                )}
                {itemHariIni.map((item) => (
                    <div key={item.id} className="bg-white border border-slate-200 rounded-lg p-3 flex justify-between items-start">
                        <div>
                            <p className="font-medium text-slate-800">
                                {item.jam_mulai?.slice(0, 5)}
                                {item.jam_selesai ? ` - ${item.jam_selesai.slice(0, 5)}` : ''} · {item.judul}
                            </p>
                            {item.olahraga && (
                                <p className="text-xs text-emerald-700 bg-emerald-50 inline-block px-2 py-0.5 rounded mt-1">
                                    Olahraga: {item.olahraga.nama_latihan} — {item.olahraga.jumlah_set} set x {item.olahraga.repetisi} rep
                                    {item.olahraga.durasi_menit ? `, ${item.olahraga.durasi_menit} menit` : ''}
                                </p>
                            )}
                            {item.deskripsi && <p className="text-sm text-slate-500 mt-1">{item.deskripsi}</p>}
                        </div>
                        <div className="flex gap-2 shrink-0">
                            <button onClick={() => bukaFormEdit(item)} className="text-sm text-indigo-600 hover:underline">Ubah</button>
                            <button onClick={() => hapus(item.id)} className="text-sm text-red-600 hover:underline">Hapus</button>
                        </div>
                    </div>
                ))}
            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-20">
                    <form onSubmit={submit} className="bg-white rounded-lg p-5 w-full max-w-md space-y-3 shadow-xl">
                        <h3 className="font-semibold text-slate-800">{data.id ? 'Ubah Jadwal' : 'Tambah Jadwal'}</h3>

                        <div>
                            <label className="text-sm text-slate-600">Hari</label>
                            <select value={data.hari} onChange={(e) => setData('hari', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm">
                                {HARI_LIST.map((h) => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Judul Kegiatan</label>
                            <input value={data.judul} onChange={(e) => setData('judul', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" placeholder="Mis. Latihan Dada / Kuliah Basis Data" />
                            {errors.judul && <p className="text-xs text-red-500">{errors.judul}</p>}
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                            <div>
                                <label className="text-sm text-slate-600">Jam Mulai</label>
                                <input type="time" value={data.jam_mulai} onChange={(e) => setData('jam_mulai', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                                {errors.jam_mulai && <p className="text-xs text-red-500">{errors.jam_mulai}</p>}
                            </div>
                            <div>
                                <label className="text-sm text-slate-600">Jam Selesai</label>
                                <input type="time" value={data.jam_selesai} onChange={(e) => setData('jam_selesai', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" />
                            </div>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Referensi Data Olahraga (opsional)</label>
                            <select value={data.olahraga_id} onChange={(e) => setData('olahraga_id', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm">
                                <option value="">-- Bukan sesi olahraga --</option>
                                {daftarOlahraga.map((o) => (
                                    <option key={o.id} value={o.id}>{o.nama_latihan} ({o.jumlah_set}x{o.repetisi})</option>
                                ))}
                            </select>
                            <p className="text-xs text-slate-400 mt-1">Jika dipilih, detail set/repetisi/durasi otomatis mengikuti data master dan akan ikut berubah jika data master diubah.</p>
                        </div>

                        <div>
                            <label className="text-sm text-slate-600">Catatan</label>
                            <textarea value={data.deskripsi} onChange={(e) => setData('deskripsi', e.target.value)} className="w-full border border-slate-300 rounded-md px-2 py-1.5 text-sm" rows={2} />
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
