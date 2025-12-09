import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { generateStudyNotes } from '../services/gemini';
import Card from '../components/Card';
import { Plus, Search, Trash2, BookOpen } from 'lucide-react';
import { format } from 'date-fns';

const Notes = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [generating, setGenerating] = useState(false);
    const [notes, setNotes] = useState([]);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (currentUser) {
            fetchNotes();
        }
    }, [currentUser]);

    const fetchNotes = async () => {
        try {
            const q = query(
                collection(db, "notes"),
                where("userId", "==", currentUser.uid),
                orderBy("createdAt", "desc")
            );
            const querySnapshot = await getDocs(q);
            const notesData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setNotes(notesData);
        } catch (error) {
            console.error("Error fetching notes:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setGenerating(true);
        try {
            const aiData = await generateStudyNotes(searchQuery);
            const newNote = {
                userId: currentUser.uid,
                title: aiData.title,
                content: aiData,
                createdAt: new Date().toISOString()
            };

            const docRef = await addDoc(collection(db, "notes"), newNote);
            setNotes([{ id: docRef.id, ...newNote }, ...notes]);
            setSearchQuery('');
        } catch (error) {
            alert("Failed to generate notes. Please try again.");
        } finally {
            setGenerating(false);
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this note?")) {
            await deleteDoc(doc(db, "notes", id));
            setNotes(notes.filter(note => note.id !== id));
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-5xl font-black uppercase mb-1">AI Notes</h1>
                    <p className="font-bold text-gray-600">Transform text into study materials</p>
                </div>
                <button className="bg-app-yellow border-2 border-black font-black px-6 py-3 shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
                    <Plus size={20} /> NEW NOTE
                </button>
            </div>

            <Card className="mb-8 border-4 transform rotate-[0.5deg]">
                <div className="flex items-center gap-2 mb-2 text-app-purple font-black">
                    <BookOpen size={24} />
                    <h3>NATURAL LANGUAGE SEARCH</h3>
                </div>
                <form onSubmit={handleSearch} className="flex gap-4">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            placeholder="Ask anything... e.g., 'notes about photosynthesis' or 'what did I study about World War 2?'"
                            className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:shadow-neobrutalism transition-all pr-12"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={generating}
                        className="bg-app-purple text-white px-8 font-black border-2 border-black shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] disabled:opacity-50"
                    >
                        {generating ? 'GENERATING...' : 'SEARCH'}
                    </button>
                </form>
                <p className="mt-2 text-xs font-bold text-gray-500 flex items-center gap-1">
                    💡 Use natural language! Ask questions or describe what you're looking for.
                </p>
            </Card>

            {notes.length === 0 && !loading ? (
                <div className="bg-white border-2 border-black p-12 text-center shadow-neobrutalism">
                    <h2 className="text-2xl font-black text-gray-300">NO NOTES YET</h2>
                    <p className="font-bold text-gray-400">Create your first AI-powered note!</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {notes.map(note => (
                        <Card key={note.id} className="relative group hover:z-10 transition-all hover:scale-[1.02]">
                            <button
                                onClick={() => handleDelete(note.id)}
                                className="absolute top-4 right-4 text-app-pink opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 />
                            </button>
                            <h3 className="text-2xl font-black mb-2">{note.title}</h3>
                            <p className="text-xs font-bold text-gray-500 mb-4">
                                {format(new Date(note.createdAt), 'MMM d, yyyy • h:mm a')}
                            </p>
                            <div className="bg-app-offwhite border-2 border-black p-4 mb-4">
                                <p className="font-bold italic text-sm mb-2 opacity-80">SUMMARY</p>
                                <p>{note.content.summary}</p>
                            </div>
                            <ul className="list-disc pl-5 space-y-1 font-medium">
                                {note.content.points.slice(0, 3).map((point, i) => (
                                    <li key={i}>{point}</li>
                                ))}
                            </ul>
                            {note.content.points.length > 3 && (
                                <p className="text-sm font-bold text-app-blue mt-2">
                                    + {note.content.points.length - 3} more points
                                </p>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Notes;
