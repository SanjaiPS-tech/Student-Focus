import React, { useState, useEffect } from 'react';
import { db } from '../services/firebase';
import { collection, addDoc, query, where, getDocs, onSnapshot, orderBy, updateDoc, arrayUnion, doc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import Card from '../components/Card';
import { Users, UserPlus, MessageCircle, Send } from 'lucide-react';

const StudyRooms = () => {
    const [rooms, setRooms] = useState([]);
    const [activeRoom, setActiveRoom] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [newRoomName, setNewRoomName] = useState('');
    const [showCreate, setShowCreate] = useState(false);
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const q = query(collection(db, "rooms"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const roomsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setRooms(roomsData);
            setLoading(false);
        });
        return unsubscribe;
    }, []);

    useEffect(() => {
        if (activeRoom) {
            const q = query(collection(db, "rooms", activeRoom.id, "messages"), orderBy("timestamp", "asc"));
            const unsubscribe = onSnapshot(q, (snapshot) => {
                setMessages(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
            });
            return unsubscribe;
        }
    }, [activeRoom]);

    const createRoom = async (e) => {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        try {
            await addDoc(collection(db, "rooms"), {
                name: newRoomName,
                subject: 'General',
                members: [currentUser.uid],
                createdBy: currentUser.uid,
                createdAt: new Date().toISOString()
            });
            setNewRoomName('');
            setShowCreate(false);
        } catch (error) {
            console.error("Error creating room", error);
        }
    };

    const joinRoom = async (room) => {
        if (!room.members.includes(currentUser.uid)) {
            await updateDoc(doc(db, "rooms", room.id), {
                members: arrayUnion(currentUser.uid)
            });
        }
        setActiveRoom(room);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeRoom) return;

        await addDoc(collection(db, "rooms", activeRoom.id, "messages"), {
            text: newMessage,
            userId: currentUser.uid,
            userName: currentUser.name || "User",
            timestamp: new Date().toISOString()
        });
        setNewMessage('');
    };

    return (
        <div className="h-[calc(100vh-100px)] flex flex-col">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-5xl font-black uppercase mb-1">Study Rooms</h1>
                    <p className="font-bold text-gray-600">Collaborate with friends in real-time</p>
                </div>
                <button
                    onClick={() => setShowCreate(!showCreate)}
                    className="bg-app-purple text-white border-2 border-black font-black px-6 py-3 shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                >
                    + CREATE ROOM
                </button>
            </div>

            {showCreate && (
                <Card className="mb-6 border-4">
                    <form onSubmit={createRoom} className="flex gap-4">
                        <input
                            className="flex-1 p-3 border-2 border-black font-bold"
                            placeholder="Room Name (e.g. Math Study Group)"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                        />
                        <button className="bg-app-yellow border-2 border-black font-black px-6 shadow-neobrutalism">CREATE</button>
                    </form>
                </Card>
            )}

            {!activeRoom ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <Card variant="purple" className="border-4 text-white text-center">
                            <Users size={32} className="mx-auto mb-2" />
                            <h2 className="text-4xl font-black">{rooms.length}</h2>
                            <p className="font-bold uppercase text-xs">Active Rooms</p>
                        </Card>
                        <Card variant="yellow" className="border-4 text-center">
                            <h2 className="text-4xl font-black">{rooms.filter(r => r.members?.includes(currentUser.uid)).length}</h2>
                            <p className="font-bold uppercase text-xs">Your Rooms</p>
                        </Card>
                        <Card variant="pink" className="border-4 text-white text-center">
                            <h2 className="text-4xl font-black">{rooms.reduce((acc, r) => acc + (r.members?.length || 0), 0)}</h2>
                            <p className="font-bold uppercase text-xs">Total Members</p>
                        </Card>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pb-6">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white border-4 border-black p-6 shadow-neobrutalism hover:translate-y-[-4px] transition-all relative">
                                <div className="absolute top-4 right-4 bg-black text-white px-2 py-1 text-xs font-bold uppercase">{room.subject}</div>
                                <h3 className="text-xl font-black mb-2 pr-12">{room.name}</h3>
                                <p className="text-sm font-bold text-gray-500 mb-6">{room.members?.length || 0} members</p>
                                <button
                                    onClick={() => joinRoom(room)}
                                    className="w-full bg-app-yellow border-2 border-black font-black py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center justify-center gap-2"
                                >
                                    <UserPlus size={18} /> JOIN ROOM
                                </button>
                            </div>
                        ))}
                    </div>
                </>
            ) : (
                <div className="flex-1 flex gap-6 h-full overflow-hidden">
                    {/* Chat Area */}
                    <div className="flex-1 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col">
                        <div className="bg-black text-white p-4 flex justify-between items-center border-b-4 border-black">
                            <h2 className="font-black text-xl">{activeRoom.name}</h2>
                            <button onClick={() => setActiveRoom(null)} className="text-xs font-bold bg-app-pink px-2 py-1 border border-white">LEAVE ROOM</button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-app-offwhite">
                            {messages.map(msg => (
                                <div key={msg.id} className={`flex flex-col ${msg.userId === currentUser.uid ? 'items-end' : 'items-start'}`}>
                                    <div className={`max-w-[80%] p-3 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)] ${msg.userId === currentUser.uid ? 'bg-app-blue text-white' : 'bg-white'}`}>
                                        <p className="text-xs font-bold opacity-70 mb-1">{msg.userName}</p>
                                        <p className="font-medium">{msg.text}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <form onSubmit={sendMessage} className="p-4 border-t-4 border-black bg-white flex gap-2">
                            <input
                                className="flex-1 p-3 border-2 border-black font-bold focus:shadow-neobrutalism transition-all outline-none"
                                placeholder="Type a message..."
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                            />
                            <button className="bg-app-green bg-app-yellow border-2 border-black p-3 shadow-neobrutalism hover:shadow-none transition-all">
                                <Send size={24} />
                            </button>
                        </form>
                    </div>
                </div >
            )}
        </div >
    );
};

export default StudyRooms;
