import React, { useState } from 'react';
import { askAI } from '../services/gemini';
import Card from '../components/Card';
import { Send, Sparkles, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown'; // Use this if installed, otherwise text render

const AskAI = () => {
    const [question, setQuestion] = useState('');
    const [response, setResponse] = useState('');
    const [loading, setLoading] = useState(false);

    const handleAsk = async (e) => {
        e.preventDefault();
        if (!question.trim()) return;

        setLoading(true);
        setResponse('');
        try {
            const result = await askAI(question);
            setResponse(result);
        } catch (error) {
            setResponse("Sorry, I couldn't get an answer right now. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const suggestions = [
        { category: 'Science', text: 'Explain the theory of relativity simply' },
        { category: 'Math', text: 'How do I solve quadratic equations?' },
        { category: 'Literature', text: 'Summary of Hamlet by Shakespeare' },
        { category: 'History', text: 'Causes of the French Revolution' },
    ];

    return (
        <div className="max-w-4xl mx-auto h-[calc(100vh-100px)] flex flex-col">
            <div className="mb-8 text-center">
                <h1 className="text-5xl font-black uppercase mb-1">Ask AI</h1>
                <p className="font-bold text-gray-600">Your personal intelligent tutor</p>
            </div>

            <Card className="flex-1 flex flex-col border-4 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-0 overflow-hidden">
                <div className="flex-1 p-6 overflow-y-auto bg-app-offwhite">
                    {!response && !loading ? (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400">
                            <Sparkles size={48} className="mb-4 text-app-purple" />
                            <h3 className="text-2xl font-black uppercase mb-2">How can I help you learn?</h3>
                            <p className="font-bold">Select a topic below or type your own question.</p>

                            <div className="mt-8 grid grid-cols-2 gap-4 w-full max-w-lg">
                                {suggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setQuestion(s.text)}
                                        className="bg-white border-2 border-black p-4 text-left hover:bg-app-yellow hover:translate-x-[-2px] hover:translate-y-[-2px] hover:shadow-neobrutalism transition-all group"
                                    >
                                        <span className="block text-xs font-black uppercase opacity-60 mb-1 group-hover:opacity-100">{s.category}</span>
                                        <span className="font-bold text-sm">{s.text}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {/* User Question */}
                            <div className="flex justify-end">
                                <div className="bg-app-blue text-white p-4 border-2 border-black max-w-[80%] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.2)]">
                                    <p className="font-bold">{question}</p>
                                </div>
                            </div>

                            {/* AI Response */}
                            <div className="flex justify-start">
                                <div className="bg-white p-6 border-2 border-black max-w-[90%] shadow-neobrutalism">
                                    <div className="flex items-center gap-2 mb-3 text-app-purple font-black">
                                        <Sparkles size={20} /> AI ANSWER
                                    </div>
                                    {loading ? (
                                        <div className="animate-pulse space-y-2">
                                            <div className="h-4 bg-gray-200 w-3/4"></div>
                                            <div className="h-4 bg-gray-200 w-full"></div>
                                            <div className="h-4 bg-gray-200 w-5/6"></div>
                                        </div>
                                    ) : (
                                        <div className="prose prose-sm font-medium">
                                            {/* Simple rendering for now to avoid extra deps if markdown fail */}
                                            <pre className="whitespace-pre-wrap font-sans">{response}</pre>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 bg-white border-t-4 border-black">
                    <form onSubmit={handleAsk} className="relative">
                        <div className="absolute top-[-40px] left-0 bg-black text-white px-3 py-1 font-black text-xs uppercase transform -rotate-1">
                            Your Question
                        </div>
                        <textarea
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            placeholder="Ask about any topic..."
                            className="w-full p-4 border-2 border-black font-bold focus:outline-none focus:shadow-neobrutalism transition-all resize-none h-24"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    handleAsk(e);
                                }
                            }}
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute bottom-4 right-4 bg-app-purple text-white px-6 py-2 border-2 border-black font-black shadow-sm hover:shadow-neobrutalism hover:translate-x-[-2px] hover:translate-y-[-2px] transition-all flex items-center gap-2"
                        >
                            {loading ? 'THINKING...' : <>ASK AI <Send size={16} /></>}
                        </button>
                    </form>
                </div>
            </Card>
        </div>
    );
};

export default AskAI;
