import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../services/firebase';
import Card from '../components/Card';
import { User, LogOut, Mail, Shield } from 'lucide-react';

const Profile = () => {
    const { currentUser, logout } = useAuth();

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-5xl font-black uppercase mb-1">Profile</h1>
                <p className="font-bold text-gray-600">Your personal space</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <Card className="border-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-24 bg-app-yellow border-b-4 border-black"></div>

                    <div className="relative mt-8 mb-6">
                        <div className="w-32 h-32 bg-white border-4 border-black rounded-full mx-auto flex items-center justify-center shadow-neobrutalism">
                            <User size={64} strokeWidth={1.5} />
                        </div>
                        <div className="absolute top-0 right-1/2 translate-x-16 translate-y-20">
                            <div className="bg-app-blue text-white px-3 py-1 border-2 border-black font-black text-xs shadow-sm rotate-12">
                                {currentUser?.role || 'USER'}
                            </div>
                        </div>
                    </div>

                    <h2 className="text-3xl font-black mb-2">{currentUser?.name || currentUser?.displayName || 'Student'}</h2>

                    <div className="flex items-center justify-center gap-2 text-gray-500 font-bold mb-8">
                        <Mail size={18} />
                        <p>{currentUser?.email}</p>
                    </div>

                    <div className="space-y-4 text-left p-4">
                        <div className="border-t-2 border-black pt-4">
                            <h3 className="font-black text-lg mb-2 flex items-center gap-2">
                                <Shield size={20} /> Account Details
                            </h3>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-bold text-gray-500">Member Since</p>
                                    <p className="font-bold">{currentUser?.createdAt ? new Date(currentUser.createdAt).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-500">User ID</p>
                                    <p className="font-mono text-xs overflow-hidden text-ellipsis">{currentUser?.uid}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={logout}
                        className="w-full bg-app-pink text-white font-black py-4 mt-6 border-2 border-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center justify-center gap-2"
                    >
                        <LogOut size={20} /> LOGOUT
                    </button>
                </Card>
            </div>
        </div>
    );
};

export default Profile;
