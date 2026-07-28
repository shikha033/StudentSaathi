

import { useState, useEffect, useRef } from 'react';
import { Search, X, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function SearchBar({ onSelectDocument }) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const containerRef = useRef(null);

    // Debounced search — waits 300ms after the user stops typing
    useEffect(() => {
        if (!query.trim()) {
            setResults([]);
            setOpen(false);
            return;
        }

        setLoading(true);
        const timer = setTimeout(async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/documents/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(Array.isArray(data) ? data : []);
                setOpen(true);
            } catch (err) {
                console.error('Search failed:', err);
                setResults([]);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (containerRef.current && !containerRef.current.contains(e.target)) {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSelect = (id) => {
        onSelectDocument(id);
        setQuery('');
        setResults([]);
        setOpen(false);
    };

    return (
        <div ref={containerRef} className="relative w-full max-w-md">
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400" />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onFocus={() => query && setOpen(true)}
                    placeholder="Search documents, schemes, certificates..."
                    className="w-full pl-9 pr-9 py-2.5 rounded-full border border-blue-100 bg-blue-50/60 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:bg-white transition-colors"
                />
                {loading ? (
                    <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-400 animate-spin" />
                ) : query ? (
                    <button
                        onClick={() => { setQuery(''); setResults([]); setOpen(false); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X className="w-4 h-4" />
                    </button>
                ) : null}
            </div>

            {open && (
                <div className="absolute mt-2 w-full bg-white rounded-2xl shadow-2xl border border-blue-100 overflow-hidden z-50 max-h-80 overflow-y-auto">
                    {results.length === 0 && !loading ? (
                        <p className="p-4 text-sm text-gray-500">No matches for "{query}"</p>
                    ) : (
                        results.map((r) => (
                            <button
                                key={r._id}
                                onClick={() => handleSelect(r._id)}
                                className="w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors border-b border-blue-50 last:border-0"
                            >
                                <p className="text-sm font-semibold text-gray-800">{r.title}</p>
                                <p className="text-xs text-blue-500">{r.category}</p>
                            </button>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
