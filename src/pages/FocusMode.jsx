import React, { useState, useEffect, useRef } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { Play, Pause, RotateCw, Brain } from 'lucide-react';

const FocusMode = () => {
    const [timeLeft, setTimeLeft] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    const [sessionCount, setSessionCount] = useState(0);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const { currentUser } = useAuth();
    const timerRef = useRef(null);

    useEffect(() => {
        if (currentUser) {
            fetchFocusStats();
        }
    }, [currentUser]);

    const fetchFocusStats = async () => {
        // Simple stats fetching logic
        const q = query(collection(db, "focusSessions"), where("userId", "==", currentUser.uid));
        const snap = await getDocs(q);
        setSessionCount(snap.size);
        let total = 0;
        snap.forEach(d => total += d.data().duration);
        setTotalMinutes(Math.round(total / 60));
    };

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            clearInterval(timerRef.current);
            completeSession();
        }
        return () => clearInterval(timerRef.current);
    }, [isActive, timeLeft]);

    const toggleTimer = () => setIsActive(!isActive);

    const resetTimer = () => {
        setIsActive(false);
        setTimeLeft(25 * 60);
    };

    const completeSession = async () => {
        setIsActive(false);
        const audio = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');
        audio.play();
        alert("Focus session complete!");

        try {
            await addDoc(collection(db, "focusSessions"), {
                userId: currentUser.uid,
                duration: 25 * 60,
                completedAt: new Date().toISOString()
            });
            fetchFocusStats();
            setTimeLeft(25 * 60);
        } catch (error) {
            console.error("Error saving session", error);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="flex gap-8 h-[calc(100vh-100px)]">
            {/* Left Stats Column */}
            <div className="w-1/4 space-y-6">
                <Card variant="yellow" className="border-4 text-center py-8">
                    <p className="font-bold uppercase text-xs mb-2">Today's Sessions</p>
                    <h2 className="text-6xl font-black">{sessionCount}</h2>
                </Card>
                <Card variant="pink" className="border-4 text-center py-8 text-white">
                    <p className="font-bold uppercase text-xs mb-2">Total Focus</p>
                    <h2 className="text-6xl font-black">{totalMinutes} <span className="text-xl">min</span></h2>
                </Card>
                <Card variant="blue" className="border-4 text-center py-8 text-white">
                    <p className="font-bold uppercase text-xs mb-2">All Sessions</p>
                    <h2 className="text-6xl font-black">{sessionCount}</h2>
                </Card>
            </div>

            {/* Main Timer Area */}
            <div className="flex-1">
                <div className="text-center mb-12">
                    <h1 className="text-5xl font-black uppercase mb-2">Focus Mode</h1>
                    <p className="font-bold text-gray-600">Pomodoro technique for productivity</p>
                </div>

                <Card className="max-w-2xl mx-auto border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-12 text-center bg-white relative">
                    <div className="inline-block bg-app-pink text-white px-6 py-2 border-2 border-black font-black uppercase tracking-widest mb-12 transform -rotate-2">
                        <Brain className="inline-block mr-2" size={20} /> Focus Time
                    </div>

                    <div className="text-[10rem] leading-none font-black font-mono mb-12 tracking-tighter">
                        {formatTime(timeLeft)}
                    </div>

                    <div className="h-4 w-full border-4 border-black mb-12 bg-app-offwhite rounded-full overflow-hidden">
                        <div
                            className="h-full bg-black transition-all duration-1000 ease-linear"
                            style={{ width: `${((25 * 60 - timeLeft) / (25 * 60)) * 100}%` }}
                        ></div>
                    </div>

                    <div className="flex justify-center gap-6">
                        <button
                            onClick={toggleTimer}
                            className="bg-app-pink text-white text-xl font-black px-12 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-3"
                        >
                            {isActive ? <Pause size={28} fill="currentColor" /> : <Play size={28} fill="currentColor" />}
                            {isActive ? 'PAUSE' : 'START'}
                        </button>
                        <button
                            onClick={resetTimer}
                            className="bg-white text-black text-xl font-black px-8 py-4 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                            <RotateCw size={28} />
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default FocusMode;
