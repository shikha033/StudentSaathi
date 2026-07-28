import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '../config';

export default function Chatbot() {
    const [open, setOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'model', text: "Hi! I'm your StudentSaathi assistant. Ask me about documents, certificates, schemes, or anything student-related." }
    ]);
    const [input, setInput] = useState('');
    const [sending, setSending] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, open]);

    const sendMessage = async (e) => {
        e.preventDefault();
        const text = input.trim();
        if (!text || sending) return;

        const nextMessages = [...messages, { role: 'user', text }];
        setMessages(nextMessages);
        setInput('');
        setSending(true);

        try {
            const response = await fetch(`${API_BASE_URL}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    message: text,
                    // Send prior turns (excluding the greeting) so the bot has some memory
                    history: nextMessages.slice(1, -1).map(m => ({ role: m.role, text: m.text }))
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setMessages(prev => [...prev, { role: 'model', text: data.msg || 'Something went wrong. Please try again.' }]);
            } else {
                setMessages(prev => [...prev, { role: 'model', text: data.reply }]);
            }
        } catch (err) {
            setMessages(prev => [...prev, { role: 'model', text: "I couldn't reach the server. Please check your connection and try again." }]);
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            {/* Floating toggle button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] text-white shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
                aria-label="Open chatbot"
            >
                {open ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
            </button>

            {/* Chat window */}
            {open && (
                <div className="fixed bottom-24 right-6 z-50 w-[22rem] max-w-[90vw] h-[28rem] max-h-[70vh] bg-white rounded-3xl shadow-2xl border border-blue-100 flex flex-col overflow-hidden">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white px-4 py-3 flex items-center gap-2">
                        <Sparkles className="w-5 h-5" />
                        <div>
                            <p className="font-semibold text-sm leading-tight">StudentSaathi Assistant</p>
                            <p className="text-xs text-white/80 leading-tight">Powered by Gemini</p>
                        </div>
                    </div>

                    {/* Messages */}
                    <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3 bg-blue-50/40">
                        {messages.map((m, i) => (
                            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div
                                    className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm whitespace-pre-wrap ${
                                        m.role === 'user'
                                            ? 'bg-gradient-to-r from-[var(--brand-blue)] to-[var(--brand-navy)] text-white rounded-br-sm'
                                            : 'bg-white text-gray-700 border border-blue-100 rounded-bl-sm'
                                    }`}
                                >
                                    {m.text}
                                </div>
                            </div>
                        ))}

                        {sending && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-blue-100 rounded-2xl rounded-bl-sm px-4 py-3 flex gap-1">
                                    <span className="w-2 h-2 rounded-full bg-blue-400 typing-dot" style={{ animationDelay: '0s' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-400 typing-dot" style={{ animationDelay: '0.2s' }}></span>
                                    <span className="w-2 h-2 rounded-full bg-blue-400 typing-dot" style={{ animationDelay: '0.4s' }}></span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <form onSubmit={sendMessage} className="p-3 border-t border-blue-100 flex gap-2 bg-white">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask a question..."
                            className="flex-1 px-3 py-2 rounded-full border border-blue-100 bg-blue-50/60 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                        <button
                            type="submit"
                            disabled={sending || !input.trim()}
                            className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-[var(--brand-blue)] to-[var(--brand-navy)] text-white flex items-center justify-center disabled:opacity-50"
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" />
                        </button>
                    </form>
                </div>
            )}
        </>
    );
}
