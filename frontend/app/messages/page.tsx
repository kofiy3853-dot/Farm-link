/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { Send, ArrowLeft, ShieldCheck, User as Store, FileText, CheckCircle, XCircle } from 'lucide-react';

import toast, { Toaster } from 'react-hot-toast';
import io, { Socket } from 'socket.io-client';

import { Suspense } from 'react';

function NegotiationChannel() {
    const searchParams = useSearchParams();
    const productId = searchParams.get('productId');
    const supplierId = searchParams.get('supplierId');
    const router = useRouter();

    const { user, isAuthenticated } = useAuthStore();
    const [messages, setMessages] = useState<any[]>([]);
    const [inputText, setInputText] = useState('');
    const [chatRoom, setChatRoom] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [socket, setSocket] = useState<Socket | null>(null);

    // Negotiation State
    const [showOfferPanel, setShowOfferPanel] = useState(false);
    const [offerPrice, setOfferPrice] = useState('');
    const [offerQty, setOfferQty] = useState('');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
            return;
        }

        // Initialize socket and chat
        const newSocket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:5000', {
            query: { userId: user?.id }
        });
        setSocket(newSocket);

        // Fetch or create chat room
        const initChat = async () => {
            try {
                // Mock endpoint to get or create chat for negotiation
                // Example: /chats/negotiate?productId=X&supplierId=Y
                // For now, we simulate a room ID based on users
                const roomId = `neg-${productId}-${user?.id}-${supplierId}`;
                setChatRoom(roomId);

                // Load past messages
                // const res = await api.get(`/chats/${roomId}/messages`);
                // setMessages(res.data);

                // Add initial context message if coming fresh
                if (productId) {
                    setMessages([{
                        id: 'system-1',
                        senderId: 'SYSTEM',
                        content: `Negotiation Channel Opened for Product ID: ${productId}. Awaiting initial quote or offer.`,
                        type: 'TEXT',
                        createdAt: new Date().toISOString()
                    }]);
                }

                newSocket.emit('join-room', roomId);

            } catch {
                toast.error('Failed to connect to secure chat');
            }
        };

        if (productId) initChat();

        newSocket.on('receive-message', (newMessage) => {
            setMessages(prev => [...prev, newMessage]);
            scrollToBottom();
        });

        return () => {
            newSocket.disconnect();
        };
        
    }, [isAuthenticated, productId, router, supplierId, user?.id]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = () => {
        if (!inputText.trim() || !socket || !chatRoom) return;

        const newMsg = {
            id: Date.now().toString(),
            chatId: chatRoom,
            senderId: user?.id,
            content: inputText,
            type: 'TEXT',
            createdAt: new Date().toISOString()
        };

        socket.emit('send-message', { roomId: chatRoom, message: newMsg });
        setMessages(prev => [...prev, newMsg]);
        setInputText('');
    };

    const handleSendOffer = () => {
        if (!offerPrice || !offerQty || !socket || !chatRoom) return;

        const newMsg = {
            id: Date.now().toString(),
            chatId: chatRoom,
            senderId: user?.id,
            content: `I am proposing a bulk counter-offer of ${offerQty} MT at ${offerPrice} GHS/MT.`,
            type: 'OFFER',
            offerPrice: parseFloat(offerPrice),
            offerQuantity: parseInt(offerQty),
            isAccepted: null,
            createdAt: new Date().toISOString()
        };

        socket.emit('send-message', { roomId: chatRoom, message: newMsg });
        setMessages(prev => [...prev, newMsg]);
        setShowOfferPanel(false);
        setOfferPrice('');
        setOfferQty('');
    };

    const handleAcceptOffer = (msgId: string) => {
        // Here we would api.post(`/messages/${msgId}/accept`)
        // And emit a 'CONTRACT' message

        const contractMsg = {
            // eslint-disable-next-line react-hooks/purity
            id: Date.now().toString(),
            chatId: chatRoom,
            senderId: user?.id,
            content: `Offer Accepted. generating Digital Agreement...`,
            type: 'CONTRACT',
            createdAt: new Date().toISOString()
        };

        setMessages(prev => prev.map(m => m.id === msgId ? { ...m, isAccepted: true } : m));
        socket?.emit('send-message', { roomId: chatRoom, message: contractMsg });
        setMessages(prev => [...prev, contractMsg]);
        toast.success("Digital Agreement generated!");
    };

    if (!isAuthenticated) return null;

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <button onClick={() => router.back()} className="btn-outline" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ArrowLeft size={16} /> Back
                </button>
                <h1 className="heading-2" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={24} color="var(--primary-color)" />
                    Secure Negotiation Hub
                </h1>
            </div>

            <div className="glass-card" style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', padding: 0 }}>

                {/* Chat Header */}
                <div style={{ padding: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'rgba(0,0,0,0.3)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Store size={24} color="white" />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-main)' }}>Supplier ID: {supplierId?.substring(0, 6) || 'N/A'}</h3>
                            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981' }} /> Online
                            </span>
                        </div>
                    </div>
                </div>

                {/* Message List */}
                <div style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {messages.map((msg, index) => {
                        const isMe = msg.senderId === user?.id;
                        const isSystem = msg.senderId === 'SYSTEM';

                        if (isSystem) {
                            return (
                                <div key={msg.id || index} style={{ textAlign: 'center', margin: '1rem 0' }}>
                                    <span style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', color: '#60a5fa', padding: '6px 16px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 600 }}>
                                        {msg.content}
                                    </span>
                                </div>
                            );
                        }

                        if (msg.type === 'OFFER') {
                            return (
                                <div key={msg.id || index} style={{ alignSelf: isMe ? 'flex-end' : 'flex-start', maxWidth: '80%', width: '400px' }}>
                                    <div style={{ backgroundColor: isMe ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', border: `1px solid ${isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.1)'}`, padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-main)', fontWeight: 600 }}>
                                            <FileText size={18} color="var(--primary-color)" /> Official Counter-Offer
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px' }}>
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Quantity</p>
                                                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>{msg.offerQuantity} MT</p>
                                            </div>
                                            <div>
                                                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Unit Price</p>
                                                <p style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--primary-color)', margin: 0 }}>{msg.offerPrice} GHS</p>
                                            </div>
                                        </div>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{msg.content}</p>

                                        {msg.isAccepted === true ? (
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', padding: '10px', backgroundColor: 'rgba(16, 185, 129, 0.1)', borderRadius: '8px', fontWeight: 600 }}>
                                                <CheckCircle size={18} /> Offer Accepted
                                            </div>
                                        ) : !isMe && msg.isAccepted !== false ? (
                                            <div style={{ display: 'flex', gap: '1rem' }}>
                                                <button onClick={() => handleAcceptOffer(msg.id)} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Accept Offer</button>
                                                <button className="btn-outline" style={{ flex: 1, padding: '10px' }}>Decline</button>
                                            </div>
                                        ) : (
                                            <div style={{ textAlign: 'center', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                                                Awaiting Response...
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        }

                        if (msg.type === 'CONTRACT') {
                            return (
                                <div key={msg.id || index} style={{ alignSelf: 'center', width: '100%', maxWidth: '600px', margin: '1rem 0' }}>
                                    <div style={{ backgroundColor: 'rgba(59, 130, 246, 0.1)', border: '1px solid #3b82f6', borderRadius: '12px', padding: '1.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
                                            <ShieldCheck size={40} color="#3b82f6" />
                                        </div>
                                        <h3 style={{ color: '#60a5fa', margin: '0 0 0.5rem 0' }}>Digital Agreement Confirmed</h3>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                            Both parties have agreed to the terms. A smart-contract hash has been generated.
                                        </p>
                                        <button className="btn-primary" onClick={() => router.push('/buyer-dashboard')} style={{ backgroundColor: '#2563eb', border: 'none' }}>
                                            Proceed to Checkout
                                        </button>
                                    </div>
                                </div>
                            );
                        }

                        // Standard TEXT message
                        return (
                            <div key={msg.id || index} style={{
                                alignSelf: isMe ? 'flex-end' : 'flex-start',
                                maxWidth: '70%',
                                backgroundColor: isMe ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
                                color: isMe ? 'white' : 'var(--text-main)',
                                padding: '1rem 1.25rem',
                                borderRadius: '16px',
                                borderBottomRightRadius: isMe ? '4px' : '16px',
                                borderBottomLeftRadius: isMe ? '16px' : '4px',
                            }}>
                                {msg.content}
                            </div>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </div>

                {/* Offer Panel Toggle */}
                {showOfferPanel && (
                    <div style={{ padding: '1.5rem', backgroundColor: 'rgba(16, 185, 129, 0.05)', borderTop: '1px solid rgba(16, 185, 129, 0.2)', display: 'flex', gap: '1rem', alignItems: 'flex-end' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Counter-Offer Price (GHS/MT)</label>
                            <input type="number" value={offerPrice} onChange={(e) => setOfferPrice(e.target.value)} className="input-field" placeholder="e.g. 1400" />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Bulk Quantity (MT)</label>
                            <input type="number" value={offerQty} onChange={(e) => setOfferQty(e.target.value)} className="input-field" placeholder="e.g. 150" />
                        </div>
                        <button onClick={handleSendOffer} className="btn-primary" style={{ padding: '0.9rem 1.5rem' }}>Submit Offer</button>
                        <button onClick={() => setShowOfferPanel(false)} aria-label="Close offer panel" title="Close offer panel" style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '0.9rem' }}>
                            <XCircle size={20} />
                        </button>
                    </div>
                )}

                {/* Chat Input */}
                <div style={{ padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', backgroundColor: 'var(--bg-dark)', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <button onClick={() => setShowOfferPanel(!showOfferPanel)} className="btn-outline" style={{ padding: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'rgba(255,255,255,0.1)' }}>
                        <FileText size={18} /> Make Offer
                    </button>
                    <input
                        type="text"
                        className="input-field"
                        placeholder="Type a message to negotiate..."
                        value={inputText}
                        onChange={(e) => setInputText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                        style={{ flex: 1 }}
                    />
                    <button onClick={handleSendMessage} aria-label="Send message" title="Send message" className="btn-primary" style={{ width: '50px', height: '50px', borderRadius: '50%', padding: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <Send size={20} />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function MessagesNegotiationPage() {
    return (
        <Suspense fallback={<div style={{ padding: '6rem', textAlign: 'center', color: 'var(--primary-color)' }}>Loading Negotiation Hub...</div>}>
            <NegotiationChannel />
        </Suspense>
    );
}
