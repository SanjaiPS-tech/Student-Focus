import React, { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import { useNavigate, Link } from 'react-router-dom';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const { currentUser } = useAuth(); // Get currentUser from context

    // Redirect if already logged in
    useEffect(() => {
        if (currentUser) {
            navigate('/');
        }
    }, [currentUser, navigate]);

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            await setDoc(doc(db, "users", userCredential.user.uid), {
                name: name,
                email: email,
                role: 'USER',
                createdAt: new Date().toISOString()
            });
            // Navigation handled by useEffect
        } catch (err) {
            setError('Failed to create account. ' + err.message);
        }
    };

    return (
        <div className="min-h-screen bg-app-pink flex items-center justify-center p-4">
            <Card className="w-full max-w-md border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h1 className="text-4xl font-black mb-2 italic">SIGN UP</h1>
                <p className="font-bold text-gray-600 mb-8">Join the StudySpace community!</p>

                {error && (
                    <div className="bg-app-yellow border-2 border-black p-3 mb-6 font-bold text-black shadow-neobrutalism">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-6">
                    <div>
                        <label className="block font-bold mb-2 uppercase">Full Name</label>
                        <input
                            type="text"
                            className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:shadow-neobrutalism transition-all bg-app-offwhite"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>
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
                        type="submit"
                        className="w-full bg-black text-white font-black py-4 border-2 border-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(255,255,255,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                    >
                        CREATE ACCOUNT
                    </button>
                </form>

                <p className="mt-8 text-center font-bold">
                    Already have an account? <Link to="/login" className="text-app-blue underline decoration-2 underline-offset-4 hover:text-black">Log In</Link>
                </p>
            </Card>
        </div>
    );
};

export default Signup;
