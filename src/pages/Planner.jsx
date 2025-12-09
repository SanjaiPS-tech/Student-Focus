import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs, deleteDoc, doc, updateDoc, orderBy } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { Plus, Trash2, CheckCircle, Calendar, Circle } from 'lucide-react';
import { format } from 'date-fns';

const Planner = () => {
    const [tasks, setTasks] = useState([]);
    const { currentUser } = useAuth();
    const [newTask, setNewTask] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        if (currentUser) {
            fetchTasks();
        }
    }, [currentUser]);

    const fetchTasks = async () => {
        try {
            const q = query(
                collection(db, "tasks"),
                where("userId", "==", currentUser.uid),
                orderBy("dueDate", "asc")
            );
            const querySnapshot = await getDocs(q);
            const tasksData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setTasks(tasksData);
        } catch (error) {
            console.error("Error fetching tasks:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddTask = async (e) => {
        e.preventDefault();
        if (!newTask.trim()) return;

        try {
            const newTaskObj = {
                userId: currentUser.uid,
                title: newTask,
                dueDate: dueDate || new Date().toISOString().split('T')[0],
                status: 'pending',
                createdAt: new Date().toISOString()
            };
            const docRef = await addDoc(collection(db, "tasks"), newTaskObj);
            setTasks([...tasks, { id: docRef.id, ...newTaskObj }].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)));
            setNewTask('');
            setDueDate('');
            setShowForm(false);
        } catch (error) {
            alert("Failed to add task");
        }
    };

    const toggleStatus = async (id, currentStatus) => {
        const newStatus = currentStatus === 'pending' ? 'completed' : 'pending';
        try {
            await updateDoc(doc(db, "tasks", id), { status: newStatus });
            setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
        } catch (error) {
            console.error("Error updating status", error);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Delete this task?")) {
            await deleteDoc(doc(db, "tasks", id));
            setTasks(tasks.filter(t => t.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-5xl font-black uppercase mb-1">Smart Planner</h1>
                    <p className="font-bold text-gray-600">AI-powered task management</p>
                </div>
                <button
                    onClick={() => setShowForm(!showForm)}
                    className="bg-app-blue text-white border-2 border-black font-black px-6 py-3 shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2"
                >
                    <Plus size={20} /> {showForm ? 'CANCEL' : 'NEW TASK'}
                </button>
            </div>

            {showForm && (
                <Card className="mb-8 border-4 animate-in fade-in slide-in-from-top-4 duration-300">
                    <form onSubmit={handleAddTask} className="flex gap-4 items-end">
                        <div className="flex-1">
                            <label className="font-bold text-xs uppercase mb-1 block">Task Title</label>
                            <input
                                type="text"
                                value={newTask}
                                onChange={(e) => setNewTask(e.target.value)}
                                className="w-full p-3 border-2 border-black font-bold"
                                placeholder="Study for math exam..."
                                autoFocus
                            />
                        </div>
                        <div className="w-48">
                            <label className="font-bold text-xs uppercase mb-1 block">Due Date</label>
                            <input
                                type="date"
                                value={dueDate}
                                onChange={(e) => setDueDate(e.target.value)}
                                className="w-full p-3 border-2 border-black font-bold"
                            />
                        </div>
                        <button type="submit" className="bg-app-yellow px-6 py-3 border-2 border-black font-black shadow-neobrutalism hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all">
                            ADD
                        </button>
                    </form>
                </Card>
            )}

            <div className="bg-white border-4 border-black p-2 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] min-h-[400px]">
                {tasks.length === 0 && !loading ? (
                    <div className="h-full flex flex-col items-center justify-center py-20">
                        <h2 className="text-2xl font-black text-gray-300 uppercase">No Tasks Yet</h2>
                        <p className="font-bold text-gray-400">Create your first task!</p>
                    </div>
                ) : (
                    <div className="space-y-4 p-4">
                        {tasks.map(task => (
                            <div key={task.id} className={`flex items-center gap-4 p-4 border-2 border-black transition-all ${task.status === 'completed' ? 'bg-gray-100 opacity-60' : 'bg-white hover:shadow-neobrutalism'}`}>
                                <button onClick={() => toggleStatus(task.id, task.status)}>
                                    {task.status === 'completed' ? <CheckCircle className="text-green-500" size={24} /> : <Circle className="text-gray-400" size={24} />}
                                </button>
                                <div className="flex-1">
                                    <h3 className={`font-black text-lg ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</h3>
                                    <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                                        <Calendar size={12} /> {format(new Date(task.dueDate), 'MMM d, yyyy')}
                                    </p>
                                </div>
                                <button onClick={() => handleDelete(task.id)} className="text-app-pink hover:bg-app-pink hover:text-white p-2 border-2 border-transparent hover:border-black transition-all">
                                    <Trash2 size={20} />
                                </button>
                            </div>
                        ))}
                    </div>
                )
                }
            </div >

        </div >
    );
};

export default Planner;
