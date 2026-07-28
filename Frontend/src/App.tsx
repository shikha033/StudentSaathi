// import { useState } from 'react';
// import LoginPage from './components/LoginPage';
// import Homepage from './components/Homepage';
// import DetailPage from './components/DetailPage';

// export default function App() {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [selectedCard, setSelectedCard] = useState<{ title: string; category: string } | null>(null);

//   const handleLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleGuestLogin = () => {
//     setIsLoggedIn(true);
//   };

//   const handleCardClick = (title: string, category: string) => {
//     setSelectedCard({ title, category });
//   };

//   const handleBackToHome = () => {
//     setSelectedCard(null);
//   };

//   return (
//     <div className="min-h-screen bg-white">
//       {!isLoggedIn ? (
//         <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
//       ) : selectedCard ? (
//         <DetailPage 
//           title={selectedCard.title} 
//           category={selectedCard.category}
//           onBack={handleBackToHome}
//         />
//       ) : (
//         <Homepage onCardClick={handleCardClick} />
//       )}
//     </div>
//   );
// }
// src/App.tsx

// import { useState } from 'react';
// import LoginPage from './components/LoginPage';
// import Homepage from './components/Homepage';
// import DetailPage from './components/DetailPage';

// export default function App() {
//     const [isLoggedIn, setIsLoggedIn] = useState(false);
    
//     // Stores the MongoDB ID of the document currently being viewed.
//     const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);

//     const handleLogin = () => {
//         setIsLoggedIn(true);
//     };

//     const handleGuestLogin = () => {
//         setIsLoggedIn(true);
//     };

//     // Accepts the MongoDB ID from the Homepage component.
//     const handleCardClick = (documentId: string) => {
//         setSelectedDocumentId(documentId);
//     };

//     const handleBackToHome = () => {
//         // Resets the state to null to display the Homepage.
//         setSelectedDocumentId(null);
//     };

//     return (
//         <div className="min-h-screen bg-white">
//             {!isLoggedIn ? (
//                 <LoginPage onLogin={handleLogin} onGuestLogin={handleGuestLogin} />
//             ) : selectedDocumentId ? (
//                 // Pass the documentId to the DetailPage for fetching.
//                 <DetailPage 
//                     documentId={selectedDocumentId} 
//                     onBack={handleBackToHome}
//                 />
//             ) : (
//                 // Pass the updated click handler to the Homepage.
//                 <Homepage onCardClick={handleCardClick} />
//             )}
//         </div>
//     );
// }



//3rd---
import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import DetailPage from './components/DetailPage';

import Login from './components/LoginPage';       
import Register from './components/Register'; 
import { LogOut, User } from 'lucide-react';

// Define the three states for authentication flow
type AuthMode = 'login' | 'register' | 'app';

function App() {
    // State to track which view to show: 'login', 'register', or 'app' (main content)
    const [currentMode, setCurrentMode] = useState<AuthMode>('login'); 
    const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userName, setUserName] = useState('');

    // Check for existing token on mount (initial load)
    useEffect(() => {
        const token = localStorage.getItem('userToken');
        const name = localStorage.getItem('userName');
        if (token && name) {
            // User found a valid token and name, log them in automatically
            setIsLoggedIn(true);
            setUserName(name);
            setCurrentMode('app');
        } else {
            // No token found, default to the login view
            setCurrentMode('login'); 
        }
    }, []);

    // Function called by Login/Register upon successful authentication
    const handleLoginSuccess = (token: string, name: string) => {
        setIsLoggedIn(true);
        setUserName(name);
        setCurrentMode('app');
        // Token and name are already stored in localStorage by Login/Register components
    };

    const handleLogout = () => {
        localStorage.removeItem('userToken');
        localStorage.removeItem('userName');
        setIsLoggedIn(false);
        setUserName('');
        setSelectedDocumentId(null);
        setCurrentMode('login'); // Redirect to login page after logging out
    };

    const handleSelectDocument = (id: string) => {
        setSelectedDocumentId(id);
    };

    const handleBackToHome = () => {
        setSelectedDocumentId(null);
    };
    
    // --- Render Logic based on Authentication State ---
    
    // 1. Render Login/Register Forms if NOT logged in
    if (!isLoggedIn) {
        if (currentMode === 'register') {
            // Show Register component, pass props to switch to login or handle success
            return <Register onLogin={() => setCurrentMode('login')} onSuccess={handleLoginSuccess} />;
        }
        // Default to login mode
        // Show Login component, pass props to switch to register or handle success
        return <Login onRegister={() => setCurrentMode('register')} onSuccess={handleLoginSuccess} />;
    }

    // 2. Render Main Application if LOGGED IN
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation/Header Bar for Logged In User */}
            <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
                    <div className="text-2xl font-bold text-blue-600">Student Saathi</div>
                    
                    <div className="flex items-center space-x-4">
                        <span className="text-gray-700 flex items-center">
                            <User className="w-5 h-5 mr-2 text-indigo-500" />
                            Hello, {userName}
                        </span>
                        <button
                            onClick={handleLogout}
                            className="flex items-center text-red-600 hover:text-red-800 transition-colors font-medium border border-red-600 px-3 py-1 rounded-md"
                        >
                            <LogOut className="w-4 h-4 mr-1" />
                            Logout
                        </button>
                    </div>
                </div>
            </header>
            
            <main>
                {/* Switch between DetailPage and HomePage */}
                {selectedDocumentId ? (
                    <DetailPage documentId={selectedDocumentId} onBack={handleBackToHome} />
                ) : (
                    <HomePage onSelectDocument={handleSelectDocument} />
                )}
            </main>
        </div>
    );
}

export default App;