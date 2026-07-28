// src/App.jsx

import { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';
import Login from './components/LoginPage';
import Register from './components/Register';
import Chatbot from './components/Chatbot';
import { LogOut, User } from 'lucide-react';

function App() {

    const [currentMode, setCurrentMode] = useState('login');
    const [selectedDocumentId, setSelectedDocumentId] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const name = localStorage.getItem('userName');
        if (token && name) {
            setIsLoggedIn(true);
            setUserName(name);
            setCurrentMode('app');
        } else {
            setCurrentMode('login');
        }
    }, []);

    const handleLoginSuccess = (token, name) => {
        setIsLoggedIn(true);
        setUserName(name);
        setCurrentMode('app');
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName('');
        setSelectedDocumentId(null);
        setCurrentMode('login');
    };

    const handleSelectDocument = (id) => {
        setSelectedDocumentId(id);
    };

    const handleBackToHome = () => {
        setSelectedDocumentId(null);
    };

    
    if (!isLoggedIn) {
        if (currentMode === 'register') {
            return <Register onLogin={() => setCurrentMode('login')} onSuccess={handleLoginSuccess} />;
        }
        return <Login onRegister={() => setCurrentMode('register')} onSuccess={handleLoginSuccess} />;
    }


    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white/90 backdrop-blur-md shadow-sm border-b border-blue-100 sticky top-0 z-40">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="text-2xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)]">
                        Student Saathi
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="hidden sm:flex items-center gap-2 pl-1 pr-4 py-1 rounded-full bg-blue-50">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] text-white flex items-center justify-center text-sm font-semibold">
                                {userName?.charAt(0)?.toUpperCase() || <User className="w-4 h-4" />}
                            </div>
                            <span className="text-gray-700 text-sm font-medium">{userName}</span>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-1.5 text-red-600 hover:text-white hover:bg-red-600 transition-colors font-medium border border-red-200 hover:border-red-600 px-3.5 py-1.5 rounded-full text-sm"
                        >
                            <LogOut className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>

            <main>
                {selectedDocumentId ? (
                    <DetailPage documentId={selectedDocumentId} onBack={handleBackToHome} />
                ) : (
                    <HomePage onSelectDocument={handleSelectDocument} />
                )}
            </main>


            <Chatbot />
        </div>
    );
}

export default App;
