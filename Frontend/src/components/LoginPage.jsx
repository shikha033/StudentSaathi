import { useState } from 'react';
import logoImage from '../assets/newlogo.png';
import { Mail, Lock, UserPlus } from 'lucide-react';
import { API_BASE_URL } from '../config';
import AnimatedBackground from './AnimatedBackground';

export default function LoginPage({ onRegister, onSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userName', data.name);
                onSuccess(data.token, data.name);
            } else {
                setError(data.message || data.msg || 'Login failed. Please check your credentials.');
            }
        } catch (err) {
            setError('Network error. Could not connect to the server or database.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4">
            <AnimatedBackground />

            <div className="w-full max-w-md relative z-10 animate-fade-in-up">
                {/* Logo and Title */}
                <div className="text-center mb-8">
                    <div className="bg-white rounded-3xl p-4 inline-block mb-4 shadow-2xl">
                        <img
                            src={logoImage}
                            alt="StudentSaathi Logo"
                            className="w-40 h-auto mx-auto"
                        />
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white">
                    <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] mb-6">Welcome Back</h2>

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
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brand-blue)] w-5 h-5" />
                                <input
                                    id="email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent bg-blue-50/50"
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
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brand-blue)] w-5 h-5" />
                                <input
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent bg-blue-50/50"
                                    placeholder="********"
                                    required
                                />
                            </div>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-3 rounded-2xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
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
                    <button
                        onClick={onRegister}
                        className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-3 rounded-2xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <UserPlus className="w-5 h-5" />
                        Create Account
                    </button>
                </div>
            </div>
        </div>
    );
}
