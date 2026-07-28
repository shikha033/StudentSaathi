

import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import SectionCard from './SectionCard';
import EmergencyCard from './EmergencyCard';
import Footer from './Footer';
import { API_BASE_URL } from '../config';
import { FileCheck2, LayoutGrid, Bot, ShieldCheck } from 'lucide-react';

export default function HomePage({ onSelectDocument }) {
    const [documents, setDocuments] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- API Fetching Logic ---
    useEffect(() => {
        const fetchDocuments = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/documents`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setDocuments(data);
            } catch (err) {
                console.error("Error fetching documents:", err);
                setError("Failed to load documents from server. Check backend connection.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocuments();
    }, []);

    // Static data for Emergency Contacts
    const emergencyContacts = [
        { title: 'Mental Health Helpline (KIRAN)', contact: '1800-599-0019', type: 'mental' },
        { title: "Women's Safety Helpline", contact: '181 / 1091', type: 'safety' },
        { title: 'Cybercrime Portal', contact: 'cybercrime.gov.in', type: 'cyber' },
        { title: 'Anti-Ragging Helpline', contact: '1800-180-5522', type: 'phone' }
    ];

    // --- Utility function to map category names to colors/styles ---
    const getCategoryStyles = (category) => {
        switch (category) {
            case 'ID & Document Help':
                return { from: 'from-blue-600', to: 'to-cyan-600' };
            case 'Certification Help Desk':
                return { from: 'from-teal-600', to: 'to-cyan-600' };
            case 'Government Schemes Hub':
                return { from: 'from-green-600', to: 'to-emerald-600' };
            case 'Skill & Internship Support':
                return { from: 'from-orange-600', to: 'to-yellow-600' };
            case 'APAAR ID & Academic Results':
                return { from: 'from-indigo-600', to: 'to-blue-600' };
            default:
                return { from: 'from-gray-500', to: 'to-gray-700' };
        }
    };

    // Define the order of the sections, each with a clean slug that matches
    // the Navigation links exactly.
    // 🐛 FIX: sections used to get their id from
    // `category.toLowerCase().replace(...)`, which turned "ID & Document Help"
    // into a mangled id like "id---document-help" — nothing in the nav bar
    // matched that, so clicking "Documents"/"Skills"/etc did nothing.
    const orderedCategories = [
        { name: 'ID & Document Help', slug: 'documents' },
        { name: 'Certification Help Desk', slug: 'certificates' },
        { name: 'Government Schemes Hub', slug: 'schemes' },
        { name: 'Skill & Internship Support', slug: 'skills' },
        { name: 'APAAR ID & Academic Results', slug: 'academic' }
    ];

    // --- RENDERING STATES ---
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-blue-600 text-lg">
                Loading Application Dashboard...
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen text-center p-12 text-red-600">
                <h2 className="text-xl font-bold">Connection Error:</h2>
                <p>{error}</p>
                <p className="mt-4 text-gray-700">
                    Please ensure your backend is running and reachable at{' '}
                    <code className="bg-gray-200 p-1 rounded">{API_BASE_URL}</code>.
                </p>
            </div>
        );
    }

    // Totals for the "Why StudentSaathi" strip, computed from real data so
    // they never go stale as you add more documents to the database.
    const totalGuides = Object.values(documents).reduce((sum, docs) => sum + docs.length, 0);
    const totalCategories = Object.keys(documents).length;

    const stats = [
        { icon: FileCheck2, value: `${totalGuides}+`, label: 'Step-by-step guides' },
        { icon: LayoutGrid, value: `${totalCategories}`, label: 'Categories covered' },
        { icon: Bot, value: 'AI', label: 'Assistant built in' },
        { icon: ShieldCheck, value: '24/7', label: 'Always accessible' },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
            <Navigation onSelectDocument={onSelectDocument} />
            <div id="home" className="scroll-mt-36">
                <HeroSection />
            </div>

            {/* Why StudentSaathi — trust/stats strip */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-10">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white rounded-3xl shadow-xl border border-blue-50 p-6 animate-fade-in-up">
                    {stats.map(({ icon: Icon, value, label }, i) => (
                        <div key={label} className="flex flex-col items-center text-center gap-2 px-2">
                            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] flex items-center justify-center">
                                <Icon className="w-6 h-6 text-white" />
                            </div>
                            <p className="text-2xl font-extrabold text-[var(--brand-navy)]">{value}</p>
                            <p className="text-sm text-gray-500">{label}</p>
                        </div>
                    ))}
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Dynamically render sections based on MongoDB data */}
                {orderedCategories.map(({ name: category, slug }) => {
                    const categoryDocs = documents[category];
                    if (!categoryDocs || categoryDocs.length === 0) return null;

                    const styles = getCategoryStyles(category);

                    return (
                        <section key={category} id={slug} className="mb-16 scroll-mt-36 animate-fade-in-up">
                            <div className="flex items-center gap-3 mb-6">
                                <div className={`w-1 h-8 bg-gradient-to-b ${styles.from} ${styles.to} rounded-full`}></div>
                                <h2 className={`text-transparent bg-clip-text bg-gradient-to-r ${styles.from} ${styles.to}`}>
                                    {category}
                                </h2>
                            </div>
                            <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                                {categoryDocs.map((doc) => (
                                    <SectionCard
                                        key={doc._id}
                                        title={doc.title}
                                        category="document"
                                        onClick={() => onSelectDocument(doc._id)}
                                    />
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* Section 6: Emergency Contact Numbers (Static) */}
                <section id="helplines" className="mb-16 scroll-mt-36 animate-fade-in-up">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="w-1 h-8 bg-gradient-to-b from-red-500 to-orange-500 rounded-full"></div>
                        <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-orange-600">Emergency Contact Numbers</h2>
                    </div>
                    <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-thin scrollbar-thumb-blue-300 scrollbar-track-blue-50">
                        {emergencyContacts.map((contact) => (
                            <EmergencyCard
                                key={contact.title}
                                title={contact.title}
                                contact={contact.contact}
                                type={contact.type}
                            />
                        ))}
                    </div>
                </section>
            </div>

            <Footer />
        </div>
    );
}
