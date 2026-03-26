'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Leaf, Sparkles } from 'lucide-react';

export default function NanaAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'nana', content: string }[]>([
        { role: 'nana', content: "Hello! I'm ASK FARM AI, your AI farming assistant. How can I help you today?" }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            // Connect to the Nana local backend if available, or fallback to relative api
            const response = await fetch('http://nana.local:3001/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ message: userMessage }),
            }).catch(async () => {
                // Fallback if nana.local is not running
                return fetch('/api/insights/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: userMessage })
                });
            });

            if (!response.ok) throw new Error('Network response was not ok');

            const data = await response.json();
            setMessages(prev => [...prev, { role: 'nana', content: data.reply || data.response || "I received your message, but I'm having trouble processing it right now." }]);
        } catch (error) {
            console.error("Chat error:", error);
            setMessages(prev => [...prev, { role: 'nana', content: "Sorry, I'm currently offline or unreachable. Please check my connection." }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            {/* Chat Window */}
            {isOpen && (
                <div
                    className="glass-card animate-fade-in"
                    style={{
                        position: 'absolute',
                        bottom: '80px',
                        right: '0',
                        width: '380px',
                        height: '500px',
                        display: 'flex',
                        flexDirection: 'column',
                        overflow: 'hidden',
                        backgroundColor: 'rgba(13, 17, 16, 0.95)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4), 0 0 40px rgba(16, 185, 129, 0.1)',
                        borderRadius: '24px'
                    }}
                >
                    {/* Header */}
                    <div style={{
                        padding: '1.5rem',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        background: 'linear-gradient(to right, rgba(16, 185, 129, 0.1), transparent)'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                backgroundColor: 'var(--primary-color)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)'
                            }}>
                                <Sparkles size={20} color="white" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: 800, color: 'white', fontSize: '1.2rem', lineHeight: 1 }}>ASK FARM AI</span>
                                <span style={{ color: 'var(--primary-color)', fontSize: '0.75rem', fontWeight: 600 }}>FarmLink Assistant</span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            aria-label="Close Assistant"
                            title="Close Assistant"
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'padding: 4px' }}
                            className="hover:text-white transition-colors"
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Messages */}
                    <div style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }} className="hide-scroll">
                        {messages.map((msg, i) => (
                            <div key={i} style={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start',
                                gap: '8px'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                                    {msg.role === 'nana' && (
                                        <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                            <Leaf size={14} color="var(--primary-color)" />
                                        </div>
                                    )}
                                    <div style={{
                                        padding: '12px 16px',
                                        borderRadius: '16px',
                                        borderBottomLeftRadius: msg.role === 'nana' ? '4px' : '16px',
                                        borderBottomRightRadius: msg.role === 'user' ? '4px' : '16px',
                                        backgroundColor: msg.role === 'user' ? 'var(--primary-color)' : 'rgba(255, 255, 255, 0.05)',
                                        color: msg.role === 'user' ? 'white' : 'var(--text-main)',
                                        fontSize: '0.95rem',
                                        lineHeight: 1.5,
                                        border: msg.role === 'nana' ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                                        maxWidth: '85%'
                                    }}>
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isLoading && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <div style={{ width: '28px', height: '28px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <Sparkles size={14} color="var(--primary-color)" className="animate-spin" />
                                </div>
                                <div style={{ padding: '12px 16px', borderRadius: '16px', backgroundColor: 'rgba(255, 255, 255, 0.05)', display: 'flex', gap: '4px' }}>
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite' }} />
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.2s' }} />
                                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: 'var(--text-muted)', animation: 'pulse 1.5s infinite 0.4s' }} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255, 255, 255, 0.05)', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '4px 4px 4px 16px' }}>
                            <input
                                type="text"
                                value={input}
                                onChange={e => setInput(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleSend()}
                                placeholder="Ask FARM AI anything..."
                                style={{ flex: 1, background: 'transparent', border: 'none', color: 'white', outline: 'none', fontSize: '0.9rem' }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={!input.trim() || isLoading}
                                aria-label="Send message"
                                title="Send message"
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '16px',
                                    backgroundColor: input.trim() && !isLoading ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)',
                                    border: 'none',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    cursor: input.trim() && !isLoading ? 'pointer' : 'not-allowed',
                                    color: 'white',
                                    transition: 'background-color 0.2s'
                                }}
                            >
                                <Send size={16} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Floating Button */}
            {!isOpen && (
                <button
                    onClick={() => setIsOpen(true)}
                    className="assistant-fab animate-fade-in hover:scale-105"
                    aria-label="Open Assistant"
                    title="Open Assistant"
                >
                    <Bot size={32} color="white" />

                    {/* Notification Dot */}
                    <div className="assistant-fab-notification" />
                </button>
            )}
        </div>
    );
}
