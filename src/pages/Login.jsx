import React, { useState, useEffect } from 'react';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get currentUser from context

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await signInWithEmailAndPassword(auth, email, password);
            // Navigation handled by useEffect
        } catch (err) {
            setError('Failed to login. Please check your credentials.');
        }
    };

    const handleGoogleLogin = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
            // Navigation handled by useEffect
        } catch (err) {
            setError('Failed to sign in with Google. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-app-yellow flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-2 italic">LOGIN</h1>
                <p className="font-bold text-gray-600 mb-8">Welcome back to StudySpace!</p>

                {error && (
                    <div className="bg-app-pink border-2 border-black p-3 mb-6 font-bold text-white shadow-neobrutalism">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase">Email</label>
                        <input
                            type="email"
                            className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:shadow-neobrutalism transition-all bg-app-offwhite"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block font-bold mb-2 uppercase">Password</label>
                        <input
                            type="password"
                            className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:shadow-neobrutalism transition-all bg-app-offwhite"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        className="w-full bg-white text-black font-black py-4 border-2 border-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2 mb-4"
                    >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        SIGN IN WITH GOOGLE
                    </button>

                    <button
                        type="submit"
                        className="w-full bg-app-blue text-white font-black py-4 border-2 border-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        LOG IN
                    </button>
                </form>

                <p className="mt-8 text-center font-bold">
                    Don't have an account? <Link to="/signup" className="text-app-purple underline decoration-2 underline-offset-4 hover:text-black">Sign Up</Link>
                </p>
            </Card>
        </div>
    );
};

export default Login;
