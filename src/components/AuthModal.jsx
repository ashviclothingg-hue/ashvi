import React, { useState, useEffect } from 'react';
import { Mail, Lock, User, Phone, X, LogIn } from 'lucide-react';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';

const AuthModal = ({ isOpen, onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Login State
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    // Signup State
    const [signupData, setSignupData] = useState({
        name: '',
        email: '',
        phone: '',
        password: ''
    });

    if (!isOpen) return null;

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await signInWithEmailAndPassword(auth, loginEmail, loginPassword);
            onClose(); // Close modal on success
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/invalid-credential') setError('Invalid email or password.');
            else setError('Login failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, signupData.email, signupData.password);
            const user = userCredential.user;
            await updateProfile(user, { displayName: signupData.name });
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                name: signupData.name,
                email: signupData.email,
                phone: signupData.phone,
                createdAt: new Date().toISOString()
            });
            onClose();
        } catch (err) {
            console.error(err);
            if (err.code === 'auth/email-already-in-use') setError('Email already registered.');
            else if (err.code === 'auth/weak-password') setError('Password too weak (min 6 chars).');
            else setError('Signup failed. Try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden relative">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <X size={24} />
                </button>

                <div className="p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            {isLogin ? 'Welcome Back' : 'Create Account'}
                        </h2>
                        <p className="text-gray-500 text-sm">
                            {isLogin ? 'Login to continue shopping' : 'Join us for exclusive collection'}
                        </p>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-500 text-sm p-3 rounded-lg mb-6 text-center">
                            {error}
                        </div>
                    )}

                    {isLogin ? (
                        /* LOGIN FORM */
                        <form onSubmit={handleLogin} className="space-y-4">
                            <div className="relative">
                                <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Email Address"
                                    value={loginEmail}
                                    onChange={(e) => setLoginEmail(e.target.value)}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Password"
                                    value={loginPassword}
                                    onChange={(e) => setLoginPassword(e.target.value)}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ashvi-dark text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-lg shadow-gray-200 disabled:bg-gray-400"
                            >
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                    ) : (
                        /* SIGNUP FORM */
                        <form onSubmit={handleSignup} className="space-y-4">
                            <div className="relative">
                                <User className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="text"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Full Name"
                                    value={signupData.name}
                                    onChange={(e) => setSignupData({ ...signupData, name: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Mail className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="email"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Email Address"
                                    value={signupData.email}
                                    onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Phone className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="tel"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Phone Number"
                                    value={signupData.phone}
                                    onChange={(e) => setSignupData({ ...signupData, phone: e.target.value })}
                                />
                            </div>
                            <div className="relative">
                                <Lock className="absolute top-3.5 left-3 text-gray-400" size={20} />
                                <input
                                    type="password"
                                    required
                                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-ashvi-pink/50 focus:border-ashvi-pink outline-none transition-all"
                                    placeholder="Password"
                                    value={signupData.password}
                                    onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-ashvi-pink text-white py-3 rounded-xl font-semibold hover:bg-rose-500 transition-colors shadow-lg shadow-rose-200 disabled:bg-rose-300"
                            >
                                {loading ? 'Creating Account...' : 'Create Account'}
                            </button>
                        </form>
                    )}

                    <div className="mt-6 text-center">
                        <p className="text-gray-600 text-sm">
                            {isLogin ? "Don't have an account? " : "Already have an account? "}
                            <button
                                onClick={() => { setIsLogin(!isLogin); setError(''); }}
                                className="font-bold text-indigo-600 hover:text-indigo-800 transition-colors"
                            >
                                {isLogin ? 'Sign Up' : 'Login'}
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthModal;
