/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send, User, Leaf, MessageSquare } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import socket from '@/lib/socket';

export default function ChatPage() {
    const [chats, setChats] = useState<any[]>([]);
    const [activeChat, setActiveChat] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { user, isAuthenticated, isLoading: authLoading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading) {
            if (!isAuthenticated) router.push('/login');
            else {
                fetchChats();
                // Setup socket
                socket.auth = { token: localStorage.getItem('token') };
                socket.connect();
                socket.on('receive_message', (message: any) => {
                    setMessages(prev => [...prev, message]);
                    scrollToBottom();
                });

                return () => {
                    socket.disconnect();
                    socket.off('receive_message');
                }
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, authLoading, router]);

    const fetchChats = async () => {
        try {
            const response = await api.get('/chat');
            setChats(response.data);
            if (response.data.length > 0) {
                selectChat(response.data[0]);
            }
        } catch {
            console.error('Failed to load chats');
        } finally {
            setIsLoading(false);
        }
    };
    const selectChat = async (chat: any) => {
        setActiveChat(chat);
        socket.emit('join_chat', chat.id);
        try {
            const response = await api.get(`/chat/${chat.id}/messages`);
            setMessages(response.data);
            setTimeout(scrollToBottom, 100);
        } catch {
            console.error('Failed to load messages');
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || !activeChat) return;

        try {
            const response = await api.post(`/chat/${activeChat.id}/messages`, {
                content: newMessage
            });
            // The socket event `receive_message` will likely receive the echo
            // But we can optimistically append or rely on socket depending on backend implementation
            setMessages(prev => [...prev, response.data]);
            setNewMessage('');
            setTimeout(scrollToBottom, 100);
        } catch {
            console.error('Failed to send message');
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    if (isLoading || authLoading) {
        return (
            <div className="d-flex justify-center p-24">
                <Leaf className="logo-icon animate-pulse" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="chat-container animate-fade-in mx-auto w-full max-w-6xl p-8 d-flex flex-col" style={{ height: 'calc(100vh - 80px)' }}>
            <h1 className="heading-2 my-6">Messages</h1>

            <div className="glass-card d-flex flex-1 overflow-hidden min-h-0">

                {/* Sidebar */}
                <div className="d-flex flex-col border-r" style={{ width: '300px', backgroundColor: 'rgba(0,0,0,0.2)' }}>
                    <div className="p-6 border-b">
                        <h2 className="text-xl font-bold">Conversations</h2>
                    </div>
                    <div className="overflow-y-auto flex-1">
                        {chats.map(chat => {
                            const otherUser = user?.role === 'CUSTOMER' ? chat.product?.farmer : chat.customer;
                            const isActive = activeChat?.id === chat.id;

                            return (
                                <div
                                    key={chat.id}
                                    onClick={() => selectChat(chat)}
                                    className="p-4 px-6 cursor-pointer border-b"
                                    style={{
                                        backgroundColor: isActive ? 'rgba(16, 185, 129, 0.1)' : 'transparent',
                                        borderLeft: isActive ? '3px solid var(--primary-color)' : '3px solid transparent',
                                        transition: 'all var(--transition-fast)'
                                    }}
                                >
                                    <div className="d-flex items-center gap-3">
                                        <div className="avatar-placeholder d-flex items-center justify-center flex-shrink-0" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-color)', color: 'var(--primary-color)' }}>
                                            <User size={20} />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="font-bold text-main whitespace-nowrap overflow-hidden text-ellipsis">
                                                {otherUser?.name || 'Unknown User'}
                                            </p>
                                            <p className="text-xs text-primary whitespace-nowrap overflow-hidden text-ellipsis">
                                                {chat.product?.name}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                        {chats.length === 0 && (
                            <div className="p-8 text-center text-muted">
                                No conversations yet.
                            </div>
                        )}
                    </div>
                </div>

                {/* Chat Area */}
                {activeChat ? (
                    <div className="flex-1 d-flex flex-col relative">
                        {/* Chat Header */}
                        <div className="p-6 border-b d-flex items-center gap-3" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            <div className="avatar-placeholder d-flex items-center justify-center" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--surface-color)', color: 'var(--primary-color)' }}>
                                <User size={20} />
                            </div>
                            <div>
                                <h3 className="font-bold text-main">
                                    {user?.role === 'CUSTOMER' ? activeChat.product?.farmer?.name : activeChat.customer?.name}
                                </h3>
                                <p className="text-sm text-muted">Regarding: {activeChat.product?.name}</p>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 p-6 overflow-y-auto d-flex flex-col gap-4">
                            {messages.map((msg, i) => {
                                const isMine = msg.senderId === user?.id;
                                return (
                                    <div key={msg.id || i} className={`d-flex ${isMine ? 'justify-end' : 'justify-start'}`}>
                                        <div className="p-3 px-4 rounded-xl shadow-lg" style={{
                                            maxWidth: '70%',
                                            borderRadius: isMine ? '16px 16px 0 16px' : '16px 16px 16px 0',
                                            backgroundColor: isMine ? 'var(--primary-color)' : 'var(--surface-color)',
                                            color: isMine ? '#fff' : 'var(--text-main)',
                                            border: isMine ? 'none' : '1px solid var(--border-color)',
                                        }}>
                                            <p className="leading-normal">{msg.content}</p>
                                            <span className={`text-xs opacity-70 block mt-1 ${isMine ? 'text-right' : 'text-left'}`}>
                                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input Form */}
                        <div className="p-6 border-t" style={{ backgroundColor: 'rgba(255,255,255,0.02)' }}>
                            <form onSubmit={handleSendMessage} className="d-flex gap-4">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={e => setNewMessage(e.target.value)}
                                    className="input-field rounded-full px-6 flex-1"
                                    placeholder="Type a message..."
                                    title="Message input"
                                />
                                <button
                                    type="submit"
                                    className="btn-primary flex-shrink-0 d-flex items-center justify-center p-0"
                                    style={{ borderRadius: '50%', width: '50px', height: '50px' }}
                                    disabled={!newMessage.trim()}
                                    title="Send Message"
                                >
                                    <Send size={20} className="ml-[-2px] mt-[2px]" />
                                </button>
                            </form>
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 d-flex items-center justify-center flex-col gap-4 text-muted">
                        <MessageSquare size={48} className="opacity-50" />
                        <p>Select a conversation to start messaging</p>
                    </div>
                )}

            </div>
        </div>
    );
}
