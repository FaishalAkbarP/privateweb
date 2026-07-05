import { Link, usePage } from '@inertiajs/react';

export default function AppLayout({ children }) {
    const { url } = usePage();
    const nav = [
        { href: '/jadwal', label: 'Jadwal Harian' },
        { href: '/olahraga', label: 'Data Olahraga' },
        { href: '/keuangan', label: 'Keuangan' },
    ];

    return (
        <div className="min-h-screen bg-slate-50">
            <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <h1 className="text-lg font-semibold text-slate-800">Manajemen Pribadi</h1>
                    <nav className="flex gap-1">
                        {nav.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`px-3 py-1.5 rounded-md text-sm font-medium transition ${
                                    url.startsWith(item.href)
                                        ? 'bg-indigo-600 text-white'
                                        : 'text-slate-600 hover:bg-slate-100'
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                </div>
            </header>
            <main className="max-w-5xl mx-auto px-4 py-6">{children}</main>
        </div>
    );
}
