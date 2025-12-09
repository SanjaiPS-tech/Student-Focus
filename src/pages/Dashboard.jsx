import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../services/firebase';
import { collection, query, where, getDocs, orderBy, limit } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import Card from '../components/Card';
import { Clock, FileText, CheckCircle, ArrowRight, Play, MessageSquare, Plus } from 'lucide-react';

const Dashboard = () => {
    const { currentUser } = useAuth();
    const [stats, setStats] = useState({ focusTime: 0, notesCount: 0, completedTasks: 0 });
    const [recentNotes, setRecentNotes] = useState([]);
    const [upcomingTasks, setUpcomingTasks] = useState([]);

    useEffect(() => {
        if (currentUser) {
            fetchDashboardData();
        }
    }, [currentUser]);

    const fetchDashboardData = async () => {
        try {
            // Notes
            const notesQ = query(collection(db, "notes"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"), limit(2));
            const notesSnap = await getDocs(notesQ);
            setRecentNotes(notesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));

            const allNotesQ = query(collection(db, "notes"), where("userId", "==", currentUser.uid));
            const allNotesSnap = await getDocs(allNotesQ);
            const notesCount = allNotesSnap.size;

            // Focus Sessions
            const focusQ = query(collection(db, "focusSessions"), where("userId", "==", currentUser.uid));
            const focusSnap = await getDocs(focusQ);
            let totalFocus = 0;
            focusSnap.forEach(doc => { totalFocus += doc.data().duration || 0; });

            // Tasks (Placeholder since Planner isn't built yet)
            // For now, assume 0 completed tasks

            setStats({
                focusTime: Math.round(totalFocus / 60), // Convert seconds to minutes
                notesCount,
                completedTasks: 0
            });

        } catch (error) {
            console.error("Error fetching dashboard:", error);
        }
    };

    return (
        <div>
            <div className="mb-8">
                <h1 className="text-5xl font-black uppercase mb-1">Dashboard</h1>
                <p className="font-bold text-gray-600">Your productivity at a glance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card variant="blue" className="border-4 transform rotate-[-1deg] text-white">
                    <div className="flex items-start gap-4">
                        <div className="bg-white text-black p-3 border-2 border-black">
                            <Clock size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-bold text-sm opacity-90 uppercase">Focus Time</p>
                            <h2 className="text-5xl font-black">{stats.focusTime}</h2>
                            <p className="font-bold text-sm">minutes</p>
                        </div>
                    </div>
                </Card>
                <Card variant="yellow" className="border-4 transform rotate-[1deg]">
                    <div className="flex items-start gap-4">
                        <div className="bg-black text-app-yellow p-3 border-2 border-black">
                            <FileText size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-bold text-sm opacity-80 uppercase">Notes</p>
                            <h2 className="text-5xl font-black">{stats.notesCount}</h2>
                            <p className="font-bold text-sm">created</p>
                        </div>
                    </div>
                </Card>
                <Card variant="pink" className="border-4 transform rotate-[-1deg] text-white">
                    <div className="flex items-start gap-4">
                        <div className="bg-white text-black p-3 border-2 border-black">
                            <CheckCircle size={32} strokeWidth={2.5} />
                        </div>
                        <div>
                            <p className="font-bold text-sm opacity-90 uppercase">Completed</p>
                            <h2 className="text-5xl font-black">{stats.completedTasks}</h2>
                            <p className="font-bold text-sm">tasks</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Upcoming Tasks */}
                <div className="bg-white border-4 border-black p-6 shadow-neobrutalism">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase">Upcoming Tasks</h3>
                        <button className="bg-app-yellow px-4 py-2 border-2 border-black font-bold text-sm shadow-sm hover:shadow-none transition-all">
                            VIEW ALL
                        </button>
                    </div>
                    {upcomingTasks.length === 0 ? (
                        <p className="font-bold text-gray-400">No tasks yet. Create one!</p>
                    ) : (
                        <ul>{/* Map tasks later */}</ul>
                    )}
                </div>

                {/* Recent Notes */}
                <div className="bg-white border-4 border-black p-6 shadow-neobrutalism">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-2xl font-black uppercase">Recent Notes</h3>
                        <Link to="/notes" className="bg-app-blue text-white px-4 py-2 border-2 border-black font-bold text-sm shadow-sm hover:shadow-none transition-all flex items-center gap-1">
                            <Plus size={16} /> NEW NOTE
                        </Link>
                    </div>
                    {recentNotes.length === 0 ? (
                        <p className="font-bold text-gray-400">No notes yet. Create one!</p>
                    ) : (
                        <div className="space-y-4">
                            {recentNotes.map(note => (
                                <div key={note.id} className="border-2 border-black p-3 bg-app-offwhite">
                                    <h4 className="font-bold text-lg leading-tight">{note.title}</h4>
                                    <p className="text-xs text-gray-500 mt-1 truncate">{note.content.summary}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-black p-6 border-4 border-black rounded-sm">
                <h3 className="text-app-yellow font-black text-xl mb-4 uppercase">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Link to="/notes" className="bg-app-yellow py-4 text-center font-black text-lg border-2 border-white hover:bg-white hover:border-app-yellow transition-colors flex items-center justify-center gap-2">
                        ✏️ NEW NOTE
                    </Link>
                    <Link to="/focus" className="bg-app-blue text-white py-4 text-center font-black text-lg border-2 border-white hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                        ⏱️ START FOCUS
                    </Link>
                    <Link to="/ask-ai" className="bg-app-pink text-white py-4 text-center font-black text-lg border-2 border-white hover:bg-white hover:text-black transition-colors flex items-center justify-center gap-2">
                        🤖 ASK AI
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
