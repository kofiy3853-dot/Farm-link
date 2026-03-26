/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect } from 'react';
import { BellRing, MessageSquare, Send, Users, Megaphone } from 'lucide-react';
import api from '@/lib/api';
import toast from 'react-hot-toast';

export default function AdminCommunicationsPage() {
    const [commData, setCommData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [announcementText, setAnnouncementText] = useState('');
    const [isSending, setIsSending] = useState(false);

    useEffect(() => {
        fetchCommData();
    }, []);

    const fetchCommData = async () => {
        try {
            const response = await api.get('/admin/communications');
            setCommData(response.data);
        } catch {
            console.error('Failed to fetch communications stats');
            toast.error('Failed to load communication node');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSendAnnouncement = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!announcementText.trim()) return;

        setIsSending(true);
        try {
            await api.post('/admin/communications/announce', { message: announcementText });
            toast.success('Global announcement broadcasted successfully!');
            setAnnouncementText('');
            fetchCommData(); // Refresh the list
        } catch {
            toast.error('Failed to send broadcast');
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '6rem' }}>
                <div className="logo-icon animate-pulse" style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--primary-color)' }}></div>
            </div>
        );
    }

    if (!commData) return null;

    const { stats, topCommunicators } = commData;

    return (
        <div className="animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto', width: '100%' }}>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '3rem' }}>
                <BellRing size={36} color="var(--primary-color)" />
                <div>
                    <h1 className="heading-2">Global Communications</h1>
                    <p className="text-muted" style={{ marginTop: '0.25rem' }}>Broadcast announcements and monitor platform messaging activity.</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #3b82f6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '12px', color: '#3b82f6' }}>
                        <MessageSquare size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Active Chat Threads</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.activeChats.toLocaleString()}</h3>
                    </div>
                </div>

                <div className="glass-card" style={{ padding: '2rem', display: 'flex', alignItems: 'center', gap: '1.5rem', borderLeft: '4px solid #8b5cf6' }}>
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(139, 92, 246, 0.1)', borderRadius: '12px', color: '#8b5cf6' }}>
                        <Users size={28} />
                    </div>
                    <div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Messages Sent (7 Days)</p>
                        <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-main)' }}>{stats.messagesLast7Days.toLocaleString()}</h3>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Broadcast Hub */}
                <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <Megaphone size={20} color="var(--primary-color)" /> System Broadcast
                    </h3>

                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', lineHeight: 1.6 }}>
                        Send an immediate push notification and alert to ALL registered users on the platform. Use this for major platform updates, maintenance windows, or emergency alerts.
                    </p>

                    <form onSubmit={handleSendAnnouncement} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', flex: 1 }}>
                        <textarea
                            value={announcementText}
                            onChange={(e) => setAnnouncementText(e.target.value)}
                            placeholder="Type your system-wide announcement here..."
                            style={{
                                width: '100%',
                                minHeight: '150px',
                                padding: '1rem',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid var(--border-color)',
                                borderRadius: '8px',
                                color: 'var(--text-main)',
                                fontSize: '0.95rem',
                                resize: 'vertical',
                                flex: 1
                            }}
                            required
                        />
                        <button
                            type="submit"
                            disabled={isSending || !announcementText.trim()}
                            style={{
                                alignSelf: 'flex-end',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                padding: '0.75rem 1.5rem',
                                backgroundColor: 'var(--primary-color)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '0.95rem',
                                fontWeight: 600,
                                cursor: isSending || !announcementText.trim() ? 'not-allowed' : 'pointer',
                                opacity: isSending || !announcementText.trim() ? 0.7 : 1,
                                transition: 'all 0.2s',
                            }}
                            className="hover:shadow-md"
                        >
                            {isSending ? (
                                <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTop: '2px solid white', borderRadius: '50%' }} className="animate-spin" />
                            ) : (
                                <Send size={18} />
                            )}
                            {isSending ? 'Broadcasting...' : 'Broadcast to All Users'}
                        </button>
                    </form>
                </div>

                {/* Top Communicators */}
                <div className="glass-card" style={{ padding: '2rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <MessageSquare size={20} color="#3b82f6" /> Most Active Users (by Volume)
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {topCommunicators.map((user: any, index: number) => (
                            <div key={user.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'var(--primary-light)', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.9rem' }}>
                                        #{index + 1}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>{user.name}</p>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{user.email}</span>
                                            <span style={{ fontSize: '0.7rem', fontWeight: 600, padding: '2px 6px', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.1)', color: 'var(--text-muted)' }}>{user.role}</span>
                                        </div>
                                    </div>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--primary-color)' }}>{user._count.messages}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Messages</p>
                                </div>
                            </div>
                        ))}
                        {topCommunicators.length === 0 && (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No messaging activity recorded yet.</div>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
