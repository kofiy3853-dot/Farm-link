/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState, useEffect, useRef } from 'react';
import { Bell } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<any[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const { isAuthenticated } = useAuthStore();
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await api.get('/notifications');
                setNotifications(response.data?.data || response.data || []);
            } catch (error) {
                console.error('Failed to fetch notifications:', error);
            }
        };

        if (isAuthenticated) {
            fetchNotifications();
        }
    }, [isAuthenticated]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);



    const markAsRead = async (id: string) => {
        try {
            await api.put(`/notifications/${id}/read`);
            setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
        } catch (error) {
            console.error('Failed to mark notification as read:', error);
        }
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (!isAuthenticated) return null;

    return (
        <div style={{ position: 'relative' }} ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="btn-outline"
                style={{ padding: '8px', position: 'relative', border: 'none', background: 'transparent' }}
            >
                <Bell size={20} />
                {unreadCount > 0 && (
                    <span style={{
                        position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#ef4444',
                        color: 'white',
                        fontSize: '0.65rem',
                        fontWeight: 'bold',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="glass-card animate-fade-in" style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '0.5rem',
                    width: '320px',
                    padding: '1rem',
                    zIndex: 100,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem',
                    maxHeight: '400px',
                    overflowY: 'auto'
                }}>
                    <h4 style={{ fontWeight: 600, borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>Notifications</h4>

                    {notifications.length === 0 ? (
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>No notifications yet.</p>
                    ) : (
                        notifications.map(notification => (
                            <div
                                key={notification.id}
                                onClick={() => !notification.isRead && markAsRead(notification.id)}
                                style={{
                                    padding: '0.75rem',
                                    borderRadius: '8px',
                                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(16, 185, 129, 0.1)',
                                    cursor: notification.isRead ? 'default' : 'pointer',
                                    transition: 'background-color 0.2s',
                                    border: notification.isRead ? '1px solid transparent' : '1px solid rgba(16, 185, 129, 0.2)'
                                }}
                            >
                                <p style={{ fontSize: '0.875rem', color: notification.isRead ? 'var(--text-muted)' : 'var(--text-main)', marginBottom: '0.25rem' }}>
                                    {notification.message}
                                </p>
                                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                                    {new Date(notification.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    );
}
