import { useState } from 'react';
import { Mail, Lock, User, UserCheck } from 'lucide-react';
import logoImage from '../assets/newlogo.png';
import { API_BASE_URL } from '../config';
import AnimatedBackground from './AnimatedBackground';

export default function Register({ onLogin, onSuccess }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            return setError('Passwords do not match');
        }

        if (password.length < 6) {
            return setError('Password must be at least 6 characters');
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('userToken', data.token);
                localStorage.setItem('userName', data.name);
                onSuccess(data.token, data.name);
            } else {
                setError(data.message || data.msg || 'Registration failed. Please try a different email.');
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

                {/* Register Form */}
                <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border-2 border-white">
                    <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] mb-6">Create Account</h2>

                    {/* Error Display */}
                    {error && (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-4 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label htmlFor="name" className="block text-gray-700 mb-2 font-medium">
                                Full Name
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brand-blue)] w-5 h-5" />
                                <input
                                    id="name"
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent bg-blue-50/50"
                                    placeholder="Enter your full name"
                                    required
                                />
                            </div>
                        </div>

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
                                    placeholder="Min. 6 characters"
                                    required
                                />
                            </div>
                        </div>

                        {/* Confirm Password Field */}
                        <div>
                            <label htmlFor="confirm-password" className="block text-gray-700 mb-2 font-medium">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--brand-blue)] w-5 h-5" />
                                <input
                                    id="confirm-password"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-blue-200 focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)] focus:border-transparent bg-blue-50/50"
                                    placeholder="Re-enter password"
                                    required
                                />
                            </div>
                        </div>

                        {/* Register Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-3 rounded-2xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading ? 'Processing...' : (
                                <><UserCheck className="w-5 h-5" /> Register Account</>
                            )}
                        </button>
                    </form>

                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center">
                            <span className="bg-white px-4 text-gray-500 text-sm">Already a User?</span>
                        </div>
                    </div>

                    {/* Login Button */}
                    <button
                        onClick={onLogin}
                        className="w-full bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white py-3 rounded-2xl hover:brightness-110 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                    >
                        <Lock className="w-5 h-5" /> Log In
                    </button>
                </div>
            </div>
        </div>
    );
}
