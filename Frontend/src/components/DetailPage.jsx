import { useState, useEffect } from 'react';
import { ArrowLeft, Clock, DollarSign, FileText } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function DetailPage({ documentId, onBack }) {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // --- DATA FETCHING LOGIC ---
    useEffect(() => {
        const fetchDocument = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/documents/${documentId}`);

                if (!response.ok) {
                    throw new Error('Failed to fetch document details');
                }

                const data = await response.json();
                setDocument(data);

            } catch (err) {
                console.error("Error fetching document:", err);
                setError("Could not load document details. Please ensure the backend is running.");
            } finally {
                setLoading(false);
            }
        };

        fetchDocument();
    }, [documentId]);

    // Function to safely render steps by splitting by '→'
    const renderSteps = (stepsString) => {
        if (!stepsString) return <li>Steps are not yet available for this document.</li>;

        return stepsString.split('→').map((step, index) => (
            <li key={index} className="mb-3 pl-6 relative before:content-[''] before:absolute before:left-0 before:top-2 before:w-3 before:h-3 before:bg-blue-500 before:rounded-full before:shadow-md">
                {step.trim()}
            </li>
        ));
    };

  

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center text-blue-600 text-lg">
                Loading Document Guide...
            </div>
        );
    }

    if (error || !document) {
        return (
            <div className="min-h-screen text-center p-12 text-red-600">
                <h2 className="text-xl font-bold">{error ? "Connection/Fetch Error" : "Document Not Found"}</h2>
                <p>{error || "The requested document could not be found."}</p>
                <button onClick={onBack} className="mt-4 text-blue-600 hover:underline">
                    Go Back
                </button>
            </div>
        );
    }

  

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50">
            {/* Header */}
            <nav className="bg-white border-b border-blue-100 sticky top-16 z-40 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <button
                            onClick={onBack}
                            className="flex items-center gap-2 text-blue-600 hover:text-[var(--brand-navy)] transition-colors font-medium"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span>Back to Home</span>
                        </button>
                        <div className="text-xl font-bold text-[var(--brand-navy)]">Student Saathi</div>
                    </div>
                </div>
            </nav>

            {/* Content Container */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

                {/* Category & Title */}
                <div className="mb-6">
                    <span className="inline-block bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white px-4 py-2 rounded-full text-sm font-semibold">
                        {document.category}
                    </span>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
                    {document.document_name}
                </h1>
                <p className="text-lg text-gray-600 mb-8 border-b pb-6">
                    {document.description}
                </p>

                {/* KEY INFO BADGES */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 p-4 bg-white rounded-xl shadow-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                        <DollarSign className="w-6 h-6 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-500">Application Fee</p>
                            <p className="font-semibold text-gray-800">{document.application_fee || 'Not Applicable'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Clock className="w-6 h-6 text-indigo-500" />
                        <div>
                            <p className="text-sm text-gray-500">Processing Time</p>
                            <p className="font-semibold text-gray-800">{document.processing_time || 'Varies'}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <FileText className="w-6 h-6 text-yellow-600" />
                        <div>
                            <p className="text-sm text-gray-500">Eligibility</p>
                            <p className="font-semibold text-gray-800">{document.eligibility || 'Check Official Site'}</p>
                        </div>
                    </div>
                </div>

                {/* 1. REQUIRED DOCUMENTS SECTION - supports colon sub-lists */}
                <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-3">
                        Required Documents
                    </h2>
                    {document.required_documents.length > 0 ? (
                        <ul className="list-disc space-y-2 pl-5 text-gray-700">
                            {document.required_documents.map((doc, index) => (
                                <li key={index} className="text-base">
                                    {doc.includes(':') ? (
                                        <>
                                            <span className="font-semibold text-gray-800">{doc.split(':')[0]}:</span>
                                            <ul className="list-[circle] space-y-1 pl-6 text-gray-600">
                                                {doc.split(':')[1].split(',').map((item, subIndex) => (
                                                    <li key={subIndex} className='text-sm'>{item.trim()}</li>
                                                ))}
                                            </ul>
                                        </>
                                    ) : (
                                        doc
                                    )}
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No specific documents listed. Please check the official guide.</p>
                    )}
                </div>

                {/* 2. STEP-BY-STEP GUIDE */}
                <div className="bg-white p-8 rounded-xl shadow-lg mb-12">
                    <h2 className="text-2xl font-bold text-blue-600 mb-6 border-b pb-3">
                        Step-by-Step Application Guide
                    </h2>
                    <ol className="text-gray-700 space-y-3">
                        {renderSteps(document.steps)}
                    </ol>
                </div>

                {/* 3. OFFICIAL LINKS */}
                <div className="p-8 bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] rounded-xl shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">
                        Official Links & Resources
                    </h2>
                    <div className="flex flex-wrap gap-4">
                        {document.official_links.map((link, index) => (
                            <a
                                key={index}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="bg-white text-blue-600 font-semibold py-3 px-6 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
                            >
                                {link.name}
                            </a>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
