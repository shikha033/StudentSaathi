// import { useState } from 'react';
// import logoImage from 'figma:asset/810552ca9745b6a88ade1563b20f7b74c876dbea.png';
// import { Mail, Lock, UserCircle } from 'lucide-react';

// interface LoginPageProps {
//   onLogin: () => void;
//   onGuestLogin: () => void;
// }

// export default function LoginPage({ onLogin, onGuestLogin }: LoginPageProps) {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onLogin();
//   };

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center p-4 relative overflow-hidden">
//       {/* Animated background circles */}
//       <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
//       <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
//       <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

//       <div className="w-full max-w-md relative z-10">
//         {/* Logo and Title */}
//         <div className="text-center mb-8">
//           <div className="bg-white rounded-3xl p-4 inline-block mb-4 shadow-2xl">
//             <img 
//               src={logoImage} 
//               alt="StudentSathi Logo" 
//               className="w-48 h-auto mx-auto"
//             />
//           </div>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white">
//           <h2 className="text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">Welcome Back</h2>
          
//           <form onSubmit={handleSubmit} className="space-y-5">
//             <div>
//               <label htmlFor="email" className="block text-gray-700 mb-2">
//                 Email Address
//               </label>
//               <div className="relative">
//                 <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
//                 <input
//                   id="email"
//                   type="email"
//                   value={email}
//                   onChange={(e) => setEmail(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-blue-50/50"
//                   placeholder="Enter your email"
//                   required
//                 />
//               </div>
//             </div>

//             <div>
//               <label htmlFor="password" className="block text-gray-700 mb-2">
//                 Password
//               </label>
//               <div className="relative">
//                 <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
//                 <input
//                   id="password"
//                   type="password"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-blue-50/50"
//                   placeholder="Enter your password"
//                   required
//                 />
//               </div>
//             </div>

//             <button
//               type="submit"
//               className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
//             >
//               Login
//             </button>
//           </form>

//           <div className="relative my-6">
//             <div className="absolute inset-0 flex items-center">
//               <div className="w-full border-t border-gray-300"></div>
//             </div>
//             <div className="relative flex justify-center">
//               <span className="bg-white px-4 text-gray-500">or</span>
//             </div>
//           </div>

//           <button
//             onClick={onGuestLogin}
//             className="w-full bg-gradient-to-r from-green-500 to-teal-500 text-white py-3 rounded-xl hover:from-green-600 hover:to-teal-600 transition-all shadow-lg hover:shadow-xl transform hover:scale-105 flex items-center justify-center gap-2"
//           >
//             <UserCircle className="w-5 h-5" />
//             Continue as Guest
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }


//2nd--


import React, { useState } from 'react';
// 🚨 FIX: Using a standard relative path for the logo. UPDATE THIS PATH!
//import logoImage from 'figma:asset/810552ca9745b6a88ade1563b20f7b74c876dbea.png';
import logoImage from '../assets/newlogo.png'; 
import { Mail, Lock, UserPlus } from 'lucide-react';

interface LoginProps {
    onRegister: () => void; // Function to switch to the register page
    onSuccess: (token: string, name: string) => void; // Function to handle successful login
}

const API_BASE_URL = 'http://localhost:5000/api/auth/login';

export default function LoginPage({ onRegister, onSuccess }: LoginProps) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                // Successful login
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userName', data.name);
                onSuccess(data.token, data.name);
            } else {
                // Handle API error
                setError(data.message || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Could not connect to the server or database.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-500 via-indigo-600 to-cyan-500 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated background circles */}
            <div className="absolute top-20 left-20 w-64 h-64 bg-yellow-300 rounded-full opacity-20 blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-green-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute top-1/2 left-1/2 w-80 h-80 bg-orange-300 rounded-full opacity-20 blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>

            <div className="w-full max-w-md relative z-10">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-3xl p-4 inline-block mb-4 shadow-2xl">
                        <img 
                            src={logoImage} 
                            alt="StudentSathi Logo" 
                            className="w-48 h-auto mx-auto"
                        />
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white">
                    <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-600 mb-6">Welcome Back</h2>
                    
                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email Field */}
                        <div>
                            <label htmlFor="email" className="block text-gray-700 mb-2 font-medium">
                                Email Address
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-blue-50/50"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password Field */}
                        <div>
                            <label htmlFor="password" className="block text-gray-700 mb-2 font-medium">
                                Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-blue-50/50"
                                    placeholder="********"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-100 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Authenticating...' : 'Log In'}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-gray-500 text-sm">New User?</span>
                        </div>
                    </div>

                    {/* Register Button */}
                    {/* Register Button (NEW code matching the blue/cyan Login button) */}
                    <button
                        onClick={onRegister}
                        // Changed classes to match the blue/cyan gradient used for the Login button
                        className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-xl hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-xl transform hover:scale-100 flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}

