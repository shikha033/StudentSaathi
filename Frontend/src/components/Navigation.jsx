// src/components/Navigation.jsx

import { useState } from 'react';
import logoImage from '../assets/newlogo.png';
import SearchBar from './SearchBar';
import { Menu, X } from 'lucide-react';

const navItems = [
    { label: 'Home', slug: 'home' },
    { label: 'Documents', slug: 'documents' },
    { label: 'Certificates', slug: 'certificates' },
    { label: 'Schemes', slug: 'schemes' },
    { label: 'Skills', slug: 'skills' },
    { label: 'Academic', slug: 'academic' },
    { label: 'Helplines', slug: 'helplines' }
];

export default function Navigation({ onSelectDocument }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <nav className="bg-white/90 backdrop-blur-md border-b border-blue-100 sticky top-16 z-40 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-wrap items-center justify-between gap-3 py-3 md:h-20 md:py-0">
                    {/* Logo */}
                    <div className="flex-shrink-0">
                        <img
                            src={logoImage}
                            alt="StudentSathi Logo"
                            className="h-11 md:h-14 w-auto"
                        />
                    </div>

                    {/* Search bar */}
                    <div className="order-3 w-full md:order-none md:w-auto md:flex-1 md:px-6 flex justify-center">
                        <SearchBar onSelectDocument={onSelectDocument} />
                    </div>

                    {/* Desktop Navigation Links */}
                    <div className="hidden lg:flex items-center gap-1 flex-shrink-0">
                        {navItems.map(({ label, slug }) => (
                            <a
                                key={slug}
                                href={`#${slug}`}
                                className="px-3 py-2 rounded-full text-blue-900 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                {label}
                            </a>
                        ))}
                    </div>

                    {/* Mobile menu toggle */}
                    <button
                        onClick={() => setMobileOpen(o => !o)}
                        className="lg:hidden flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full text-blue-700 hover:bg-blue-50"
                        aria-label="Toggle navigation menu"
                    >
                        {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                    </button>
                </div>

                {/* Mobile menu panel */}
                {mobileOpen && (
                    <div className="lg:hidden pb-4 flex flex-col gap-1 border-t border-blue-100 pt-3">
                        {navItems.map(({ label, slug }) => (
                            <a
                                key={slug}
                                href={`#${slug}`}
                                onClick={() => setMobileOpen(false)}
                                className="px-3 py-2 rounded-lg text-blue-900 hover:text-blue-600 hover:bg-blue-50 transition-colors text-sm font-medium"
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        </nav>
    );
}
