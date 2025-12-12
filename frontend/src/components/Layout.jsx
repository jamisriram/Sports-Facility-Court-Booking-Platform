import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
    const location = useLocation();
    const isAdmin = location.pathname.startsWith('/admin');

    const navigation = isAdmin ? [
        { name: 'Dashboard', path: '/admin' },
        { name: 'Courts', path: '/admin/courts' },
        { name: 'Coaches', path: '/admin/coaches' },
        { name: 'Equipment', path: '/admin/equipment' },
        { name: 'Pricing Rules', path: '/admin/pricing-rules' },
        { name: 'Bookings', path: '/admin/bookings' },
    ] : [
        { name: 'Book Court', path: '/' },
        { name: 'My Bookings', path: '/my-bookings' },
    ];

    return (
        <div className="min-h-screen">
            {/* Header */}
            <header className="glass-dark border-b border-white/10 sticky top-0 z-40">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <Link to={isAdmin ? '/admin' : '/'} className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-500 rounded-lg flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <div>
                                <h1 className="text-xl font-bold text-white">Sports Facility</h1>
                                <p className="text-xs text-white/60">{isAdmin ? 'Admin Panel' : 'Court Booking'}</p>
                            </div>
                        </Link>

                        <nav className="hidden md:flex items-center gap-2">
                            {navigation.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`px-4 py-2 rounded-lg transition-all duration-200 ${location.pathname === item.path
                                            ? 'bg-white/20 text-white font-semibold'
                                            : 'text-white/70 hover:text-white hover:bg-white/10'
                                        }`}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </nav>

                        <div className="flex items-center gap-2">
                            <Link
                                to={isAdmin ? '/' : '/admin'}
                                className="px-4 py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm transition-all"
                            >
                                {isAdmin ? 'User View' : 'Admin Panel'}
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
                {children}
            </main>

            {/* Footer */}
            <footer className="glass-dark border-t border-white/10 mt-auto">
                <div className="container mx-auto px-4 py-6">
                    <p className="text-center text-white/60 text-sm">
                        © 2024 Sports Facility Booking Platform. All rights reserved.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
