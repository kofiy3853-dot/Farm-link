/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/no-unescaped-entities */
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Package, Edit, Trash2, Leaf, Wallet, ArrowDownRight, ArrowUpRight, ShieldCheck, Landmark, CloudRain, Sun, Wind, Thermometer, Bot, AlertTriangle, Send, Users, MapPin, TrendingUp } from 'lucide-react';
import api from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast, { Toaster } from 'react-hot-toast';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell } from 'recharts';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#8b5cf6', '#ef4444', '#64748b'];

export default function DashboardPage() {
    const [products, setProducts] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        name: '', price: '', description: '', category: 'VEGETABLES',
        region: 'Greater Accra', availableQuantity: 10, minOrderQuantity: 1,
        qualityGrade: 'Standard', isOrganic: false, harvestDate: new Date().toISOString().split('T')[0]
    });
    
    // Video File State
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('INVENTORY');

    // Helper for resolving Cloudinary DNS issues via Next.js rewrites
    const getProxiedUrl = (url?: string) => {
        if (!url) return '';
        return url.replace('https://res.cloudinary.com', '/media');
    };

    // Edit Product State
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [editingProductId, setEditingProductId] = useState<string | null>(null);

    // V2 Image Management State
    type ImageItem = { id: string; type: 'existing' | 'new'; url: string; file?: File };
    const [imageItems, setImageItems] = useState<ImageItem[]>([]);
    const [previewImage, setPreviewImage] = useState<string | null>(null);

    const closeModal = () => {
        setIsModalOpen(false);
        setIsEditModalOpen(false);
        setEditingProductId(null);
        setImageItems([]);
        setVideoFile(null);
        setFormData({
            name: '', price: '', description: '', category: 'VEGETABLES',
            region: 'Greater Accra', availableQuantity: 10, minOrderQuantity: 1,
            qualityGrade: 'Standard', isOrganic: false, harvestDate: new Date().toISOString().split('T')[0]
        });
    };

    const [profileData, setProfileData] = useState({
        farmName: '', farmSize: '', experienceYears: '', district: ''
    });
    const [isSavingProfile, setIsSavingProfile] = useState(false);
    const [analytics, setAnalytics] = useState<any>(null);
    const [wallet, setWallet] = useState<any>(null);
    const [withdrawAmount, setWithdrawAmount] = useState('');
    const [momoNumber, setMomoNumber] = useState('');
    const [isWithdrawing, setIsWithdrawing] = useState(false);
    const [chatInput, setChatInput] = useState('');
    const [chatMessages, setChatMessages] = useState([
        { role: 'assistant', text: 'Hello! I am ASK FARM AI, your AI Agri-Advisor. How can I help optimize your farm yields today?' }
    ]);
    const [communityChatInput, setCommunityChatInput] = useState('');
    const [communityMessages, setCommunityMessages] = useState([
        { id: 1, sender: 'Kofi (Techiman Co-op)', text: 'Anyone harvesting maize next week? We can pool transport to Accra to save on logistics.', time: '10:30 AM', isMe: false },
        { id: 2, sender: 'Ama Farms', text: 'Yes, I expect to harvest about 5 MT. Let us coordinate.', time: '10:45 AM', isMe: false }
    ]);

    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            router.push('/login');
        } else if (user?.role !== 'FARMER') {
            router.push('/marketplace');
        } else {
            fetchMyProducts();
            if (user) {
                setProfileData({
                    farmName: user.farmName || '',
                    farmSize: user.farmSize?.toString() || '',
                    experienceYears: user.experienceYears?.toString() || '',
                    district: user.district || ''
                });
                fetchAnalytics();
                fetchWallet();
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isAuthenticated, user, router]);

    const fetchAnalytics = async () => {
        try {
            const res = await api.get('/users/analytics/farmer');
            setAnalytics(res.data);
        } catch (error: any) {
            console.error('Analytics Error:', error);
            if (!error.response && error.code === 'ERR_NETWORK') {
                toast.error("Analytics server unreachable. Check your connection or API URL.");
            }
        }
    };

    const fetchWallet = async () => {
        try {
            const res = await api.get('/wallet');
            setWallet(res.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleWithdraw = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsWithdrawing(true);
        try {
            const res = await api.post('/wallet/withdraw', {
                amount: parseFloat(withdrawAmount),
                reference: momoNumber,
                type: 'WITHDRAWAL'
            });
            toast.success('Withdrawal requested successfully! Processing via MoMo.');
            setWallet(res.data.wallet); // Update wallet balance 
            setWithdrawAmount('');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to process withdrawal');
        } finally {
            setIsWithdrawing(false);
        }
    };

    const handleSendChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (!chatInput.trim()) return;

        const newMsgs = [...chatMessages, { role: 'user', text: chatInput }];
        setChatMessages(newMsgs);
        setChatInput('');

        setTimeout(() => {
            setChatMessages([...newMsgs, { role: 'assistant', text: "Based on current satellite and market data, it looks like local demand for your last harvested crop is rising by 12% this week. I'd advise holding your \"Grade A\" stock for another 4 days for optimal pricing. (ASK FARM AI Mock Analysis)" }]);
        }, 1200);
    };

    const handleSendCommunityChat = (e: React.FormEvent) => {
        e.preventDefault();
        if (communityChatInput.trim()) {
            const newMsg = {
                id: Date.now(),
                sender: profileData.farmName || 'Me',
                text: communityChatInput,
                time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                isMe: true
            };
            setCommunityMessages([...communityMessages, newMsg]);
            setCommunityChatInput('');
        }
    };

    const compressImage = (file: File): Promise<File> => {
        return new Promise((resolve) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    let width = img.width;
                    let height = img.height;
                    const max_size = 1200;
                    if (width > height) {
                        if (width > max_size) { height *= max_size / width; width = max_size; }
                    } else {
                        if (height > max_size) { width *= max_size / height; height = max_size; }
                    }
                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext('2d');
                    ctx?.drawImage(img, 0, 0, width, height);
                    canvas.toBlob((blob) => {
                        if (blob) resolve(new File([blob], file.name.replace(/\.[^/.]+$/, "") + ".jpg", { type: 'image/jpeg' }));
                        else resolve(file);
                    }, 'image/jpeg', 0.8);
                };
            };
        });
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const remaining = 10 - imageItems.length;
            if (remaining <= 0) { toast.error("Max 10 images reached"); return; }

            const filesToProcess = files.slice(0, remaining);
            if (files.length > remaining) toast.error(`Only ${remaining} more images allowed.`);

            for (const file of filesToProcess) {
                const compressed = await compressImage(file);
                setImageItems(prev => [...prev, {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'new',
                    url: URL.createObjectURL(compressed),
                    file: compressed
                }]);
            }
        }
    };

    const moveImage = (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= imageItems.length) return;
        const items = [...imageItems];
        [items[index], items[newIndex]] = [items[newIndex], items[index]];
        setImageItems(items);
    };

    const setPrimaryImage = (index: number) => {
        const items = [...imageItems];
        const [target] = items.splice(index, 1);
        items.unshift(target);
        setImageItems(items);
    };

    const removeImage = (id: string) => setImageItems(imageItems.filter(i => i.id !== id));

    const fetchMyProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data.filter((p: any) => p.farmerId === user?.id));
        } catch {
            toast.error('Failed to load products');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCreateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageItems.length === 0) {
            toast.error("At least one image is required!");
            return;
        }

        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('price', formData.price.toString());
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('region', formData.region);
            submitData.append('availableQuantity', formData.availableQuantity.toString());
            submitData.append('minOrderQuantity', formData.minOrderQuantity.toString());
            submitData.append('qualityGrade', formData.qualityGrade);
            submitData.append('isOrganic', formData.isOrganic.toString());
            submitData.append('harvestDate', formData.harvestDate);

            imageItems.forEach(item => {
                if (item.file) submitData.append('images', item.file);
            });
            if (videoFile) submitData.append('video', videoFile);

            const response = await api.post('/products', submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProducts([...products, response.data]);
            toast.success('Product added successfully!');
            closeModal();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to create product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = (product: any) => {
        setEditingProductId(product.id);
        const existing: ImageItem[] = (product.imageUrls || []).map((url: string) => ({
            id: url,
            type: 'existing',
            url: url
        }));
        setImageItems(existing);
        setFormData({
            name: product.name,
            price: product.price.toString(),
            description: product.description || '',
            category: product.category,
            region: product.region,
            availableQuantity: product.availableQuantity,
            minOrderQuantity: product.minOrderQuantity,
            qualityGrade: product.qualityGrade,
            isOrganic: product.isOrganic,
            harvestDate: new Date(product.harvestDate).toISOString().split('T')[0]
        });
        setIsEditModalOpen(true);
    };

    const handleUpdateProduct = async (e: React.FormEvent) => {
        e.preventDefault();
        if (imageItems.length === 0) {
            toast.error("Product must have at least one image!");
            return;
        }
        setIsSubmitting(true);
        try {
            const submitData = new FormData();
            submitData.append('name', formData.name);
            submitData.append('price', formData.price.toString());
            submitData.append('description', formData.description);
            submitData.append('category', formData.category);
            submitData.append('region', formData.region);
            submitData.append('availableQuantity', formData.availableQuantity.toString());
            submitData.append('minOrderQuantity', formData.minOrderQuantity.toString());
            submitData.append('qualityGrade', formData.qualityGrade);
            submitData.append('isOrganic', formData.isOrganic.toString());
            submitData.append('harvestDate', formData.harvestDate);

            const existingUrls = imageItems.filter(i => i.type === 'existing').map(i => i.url);
            submitData.append('imageOrder', JSON.stringify(existingUrls));

            imageItems.forEach(item => {
                if (item.type === 'new' && item.file) {
                    submitData.append('images', item.file);
                }
            });

            if (videoFile) submitData.append('video', videoFile);

            const response = await api.put(`/products/${editingProductId}`, submitData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setProducts(products.map(p => p.id === editingProductId ? response.data : p));
            toast.success('Product updated successfully!');
            closeModal();
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update product');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this product?")) return;
        try {
            await api.delete(`/products/${id}`);
            setProducts(products.filter(p => p.id !== id));
            toast.success("Product deleted successfully");
        } catch {
            toast.error("Failed to delete product");
        }
    };

    const handleSaveProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSavingProfile(true);
        try {
            const res = await api.put('/users/profile', profileData);
            toast.success("Farm Profile updated successfully!");
            useAuthStore.getState().login(res.data, localStorage.getItem('token') || '');
        } catch (error: any) {
            toast.error(error.response?.data?.error || 'Failed to update profile');
        } finally {
            setIsSavingProfile(false);
        }
    };

    const toggleSoldOut = async (productId: string, currentStatus: boolean) => {
        try {
            const res = await api.put(`/products/${productId}`, { isSoldOut: !currentStatus });
            setProducts(products.map(p => p.id === productId ? { ...p, isSoldOut: res.data.isSoldOut } : p));
            toast.success(`Marked as ${!currentStatus ? 'Sold Out' : 'Available'}`);
        } catch {
            toast.error('Failed to update stock status');
        }
    };

    if (isLoading) {
        return (
            <div className="d-flex justify-center p-24">
                <Leaf className="logo-icon animate-pulse" size={40} color="var(--primary-color)" />
            </div>
        );
    }

    return (
        <div className="mx-auto w-full max-w-7xl px-8 py-8 animate-fade-in" style={{ padding: '2rem clamp(2rem, 5vw, 6rem)' }}>
            <Toaster position="top-right" toastOptions={{ style: { background: '#1e2522', color: '#fff' } }} />

            <div className="d-flex justify-between items-start mb-12 flex-wrap gap-4">
                <div>
                    <h1 className="heading-2 d-flex items-center gap-3">
                        Farmer Dashboard
                        {user?.isVerified && <span className="px-2 py-1 bg-green-10 text-primary rounded-full text-[10px] font-bold border border-green-30 align-middle">KYC VERIFIED</span>}
                    </h1>
                    <p className="text-muted mt-2">Manage your premium inventory and track your sales analytics.</p>
                </div>
                <button className="btn-primary d-flex gap-2" onClick={() => setIsModalOpen(true)}>
                    <Plus size={20} />
                    <span>Upload V2 Listing</span>
                </button>
            </div>

            {/* FARMER ANALYTICS WIDGETS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <div className="glass-card p-6" style={{ background: 'linear-gradient(145deg, rgba(16,185,129,0.05), rgba(16,185,129,0.01))' }}>
                    <p className="text-xs text-muted uppercase font-bold mb-2">Total Revenue</p>
                    <p className="text-3xl font-extrabold text-main leading-none">{analytics?.totalRevenue ? `GHS ${(analytics.totalRevenue).toLocaleString()}` : 'GHS 0'}</p>
                </div>
                <div className="glass-card p-6">
                    <p className="text-xs text-muted uppercase font-bold mb-2">Completed Orders</p>
                    <p className="text-3xl font-extrabold text-main leading-none">{analytics?.completedOrders || 0}</p>
                </div>
                <div className="glass-card p-6">
                    <p className="text-xs text-muted uppercase font-bold mb-2">Active Orders</p>
                    <p className="text-3xl font-extrabold text-main leading-none">{analytics?.activeOrders || 0}</p>
                </div>
                <div className="glass-card p-6">
                    <p className="text-xs text-muted uppercase font-bold mb-2">Pending Orders</p>
                    <p className="text-3xl font-extrabold text-amber-500 leading-none">{analytics?.pendingOrders || 0}</p>
                </div>
            </div>

            <nav className="hide-scrollbar d-flex gap-4 mb-8 border-b border-white-10 pb-4 overflow-x-auto whitespace-nowrap">
                {[
                    { id: 'INVENTORY', label: 'Inventory Management' },
                    { id: 'PROFILE', label: 'Farm Profile & Settings' },
                    { id: 'ANALYTICS', label: 'Sales Analytics' },
                    { id: 'FINANCE', label: 'Wallet & Finance' },
                    { id: 'ADVISORY', label: 'Weather & AI Advisory' },
                    { id: 'INSIGHTS', label: 'Market Insights' },
                    { id: 'COMMUNITY', label: 'Community Hub' }
                ].map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`bg-transparent border-none cursor-pointer text-lg font-medium transition-all ${activeTab === tab.id ? 'text-primary font-bold' : 'text-muted hover:text-white'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>

            {activeTab === 'PROFILE' && (
                <div className="glass-card p-8 max-w-3xl animate-fade-in">
                    <h3 className="heading-2 text-2xl mb-6 d-flex items-center gap-3">
                        Farm Profile Verification Settings
                    </h3>
                    <form onSubmit={handleSaveProfile} className="d-flex flex-col gap-6">
                        <div className="d-flex flex-col gap-2">
                            <label htmlFor="farm-name" className="text-sm font-medium">Registered Farm / Cooperative Name</label>
                            <input 
                                id="farm-name"
                                type="text" 
                                className="input-field" 
                                value={profileData.farmName} 
                                onChange={e => setProfileData({ ...profileData, farmName: e.target.value })} 
                                placeholder="e.g. Abena Farms Ltd"
                                title="Farm Name"
                            />
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="d-flex flex-col gap-2">
                                <label htmlFor="farm-size" className="text-sm font-medium">Farm Size (Acres)</label>
                                <input 
                                    id="farm-size"
                                    type="number" 
                                    className="input-field" 
                                    value={profileData.farmSize} 
                                    onChange={e => setProfileData({ ...profileData, farmSize: e.target.value })} 
                                    placeholder="e.g. 50"
                                    title="Farm Size in Acres"
                                />
                            </div>
                            <div className="d-flex flex-col gap-2">
                                <label htmlFor="experience" className="text-sm font-medium">Years of Experience</label>
                                <input 
                                    id="experience"
                                    type="number" 
                                    className="input-field" 
                                    value={profileData.experienceYears} 
                                    onChange={e => setProfileData({ ...profileData, experienceYears: e.target.value })} 
                                    placeholder="e.g. 10"
                                    title="Years of Experience"
                                />
                            </div>
                        </div>
                        <div className="d-flex flex-col gap-2">
                            <label htmlFor="district" className="text-sm font-medium">Operating District / City</label>
                            <input 
                                id="district"
                                type="text" 
                                className="input-field" 
                                value={profileData.district} 
                                onChange={e => setProfileData({ ...profileData, district: e.target.value })} 
                                placeholder="e.g. Techiman North"
                                title="Operating District"
                            />
                        </div>
                        <button type="submit" className="btn-primary self-start px-8 py-3" disabled={isSavingProfile}>
                            {isSavingProfile ? 'Saving...' : 'Save Public Profile'}
                        </button>
                    </form>
                </div>
            )}

            {activeTab === 'INVENTORY' && (
                <div className="glass-card p-8 animate-fade-in">
                    <h3 className="heading-2 text-2xl mb-6 d-flex items-center gap-3">
                        <Package size={24} color="var(--primary-color)" />
                        Your Products
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left min-w-[600px] border-collapse">
                            <thead>
                                <tr className="border-b border-white-10 text-muted">
                                    <th className="p-4 font-medium">Commodity</th>
                                    <th className="p-4 font-medium">Price/MT</th>
                                    <th className="p-4 font-medium">Grade/Harvest</th>
                                    <th className="p-4 font-medium">Region</th>
                                    <th className="p-4 font-medium">Avail Qty</th>
                                    <th className="p-4 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map(product => (
                                    <tr key={product.id} className="border-b border-white-5 hover:bg-white-5 transition-all">
                                        <td className="p-4 font-medium">
                                            {product.name}
                                            {product.isOrganic && <span className="ml-2 px-2 py-1 bg-green-500 text-white rounded text-[10px] font-bold">ORGANIC</span>}
                                            {product.isSoldOut && <span className="ml-2 px-2 py-1 bg-red-500 text-white rounded text-[10px] font-bold">SOLD OUT</span>}
                                        </td>
                                        <td className="p-4 text-primary font-bold">GHS {product.price.toLocaleString()}</td>
                                        <td className="p-4">
                                            <div className="text-sm text-main font-medium">{product.qualityGrade || 'Standard'}</div>
                                            <div className="text-xs text-muted">{new Date(product.harvestDate).toLocaleDateString()}</div>
                                        </td>
                                        <td className="p-4 text-muted">{product.region}</td>
                                        <td className="p-4 text-main">{product.availableQuantity} MT</td>
                                        <td className="p-4 text-right">
                                            <div className="d-flex gap-3 justify-end items-center">
                                                <button 
                                                    onClick={() => toggleSoldOut(product.id, product.isSoldOut)} 
                                                    className="text-xs bg-transparent border border-white-20 px-2 py-1 rounded cursor-pointer text-muted hover:text-white"
                                                    title={product.isSoldOut ? 'Mark Available' : 'Mark Sold Out'}
                                                >
                                                    {product.isSoldOut ? 'Mark Available' : 'Mark Sold Out'}
                                                </button>
                                                <button onClick={() => handleEditClick(product)} className="bg-transparent border-none cursor-pointer text-muted hover:text-primary" title="Edit Product">
                                                    <Edit size={18} />
                                                </button>
                                                <button onClick={() => handleDeleteProduct(product.id)} className="bg-transparent border-none cursor-pointer text-red-500" title="Delete Product">
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                                {products.length === 0 && (
                                    <tr>
                                        <td colSpan={6} className="p-12 text-center text-muted">
                                            You haven't listed any products yet.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {activeTab === 'ANALYTICS' && analytics && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-card p-8 h-[400px] d-flex flex-col">
                        <h3 className="heading-2 text-xl mb-6">30-Day Revenue Trend</h3>
                        <div className="flex-1 min-h-0">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={analytics.revenueTrend} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis
                                        dataKey="date"
                                        stroke="var(--text-muted)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => {
                                            const d = new Date(val);
                                            return `${d.getMonth() + 1}/${d.getDate()}`;
                                        }}
                                    />
                                    <YAxis
                                        stroke="var(--text-muted)"
                                        fontSize={12}
                                        tickLine={false}
                                        axisLine={false}
                                        tickFormatter={(val) => `GH₵${val}`}
                                    />
                                    <Tooltip
                                        contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                        itemStyle={{ color: '#fff' }}
                                        formatter={(value: any) => [`GH₵${parseFloat(value).toFixed(2)}`, 'Revenue']}
                                    />
                                    <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="glass-card p-8 h-[400px] d-flex flex-col">
                        <h3 className="heading-2 text-xl mb-6">Top Buying Regions</h3>
                        <div className="flex-1 min-h-0 d-flex items-center justify-center">
                            {analytics.topRegions && analytics.topRegions.length > 0 ? (
                                <ResponsiveContainer width="100%" height="100%">
                                    <RechartsPieChart>
                                        <Pie
                                            data={analytics.topRegions}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={80}
                                            outerRadius={120}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${((percent || 0) * 100).toFixed(0)}%`}
                                        >
                                            {analytics.topRegions.map((entry: any, index: number) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip
                                            contentStyle={{ backgroundColor: 'var(--bg-dark)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                                            itemStyle={{ color: '#fff' }}
                                            formatter={(value: any) => [`${value} Orders`, 'Volume']}
                                        />
                                    </RechartsPieChart>
                                </ResponsiveContainer>
                            ) : (
                                <div className="text-muted text-center">No regional transaction data available yet.</div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'FINANCE' && wallet && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 animate-fade-in">
                    <div className="d-flex flex-col gap-6">
                        <div className="glass-card p-8" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.1) 0%, rgba(16,185,129,0.02) 100%)' }}>
                            <div className="d-flex items-center gap-3 mb-6">
                                <Wallet color="var(--primary-color)" size={24} />
                                <h3 className="heading-2 text-xl m-0">Available Balance</h3>
                            </div>
                            <h1 className="text-5xl font-extrabold text-main mb-2">
                                GH₵ {wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </h1>
                            <p className="text-muted text-sm">
                                Pending Escrow: GH₵ {wallet.escrowBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                            </p>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="heading-2 text-lg mb-4">Withdraw to MTN MoMo</h3>
                            <form onSubmit={handleWithdraw} className="d-flex flex-col gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="momo-number" className="text-sm">Phone Number (MTN)</label>
                                    <input 
                                        id="momo-number"
                                        type="text" 
                                        className="input-field" 
                                        placeholder="024 123 4567" 
                                        value={momoNumber} 
                                        onChange={e => setMomoNumber(e.target.value)} 
                                        required 
                                        title="MTN MoMo Number"
                                    />
                                </div>
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="withdraw-amount" className="text-sm">Amount (GH₵)</label>
                                    <input 
                                        id="withdraw-amount"
                                        type="number" 
                                        className="input-field" 
                                        placeholder="Enter amount..." 
                                        value={withdrawAmount} 
                                        onChange={e => setWithdrawAmount(e.target.value)} 
                                        max={wallet.balance} 
                                        required 
                                        title="Withdrawal Amount"
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full" disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) > wallet.balance}>
                                    {isWithdrawing ? 'Processing...' : 'Withdraw Funds'}
                                </button>
                            </form>
                        </div>

                        <div className="glass-card p-8">
                            <h3 className="heading-2 text-lg mb-4">Financial Services</h3>
                            <div className="d-flex flex-col gap-4">
                                <button className="btn-outline d-flex items-center justify-center gap-2 py-3" onClick={() => toast.success('Loan application submitted for review.')} title="Apply for Agri-Loan">
                                    <Landmark size={18} /> Apply for Agri-Loan
                                </button>
                                <button className="btn-outline d-flex items-center justify-center gap-2 py-3" style={{ borderColor: 'rgba(16, 185, 129, 0.3)', color: '#10b981' }} onClick={() => toast.success('Insurance enrollment request sent.')} title="Enroll in Crop Insurance">
                                    <ShieldCheck size={18} /> Enroll in Crop Insurance
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8">
                        <h3 className="heading-2 text-xl mb-6">Transaction History</h3>
                        <div className="d-flex flex-col gap-4">
                            {wallet.transactions && wallet.transactions.length > 0 ? (
                                wallet.transactions.map((tx: any) => (
                                    <div key={tx.id} className="d-flex justify-between items-center p-4 border border-white-5 rounded-lg bg-black-20">
                                        <div className="d-flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full d-flex items-center justify-center ${tx.type === 'DEPOSIT' || tx.type === 'ESCROW_RELEASE' ? 'bg-green-10' : 'bg-red-10'}`}>
                                                {tx.type === 'DEPOSIT' || tx.type === 'ESCROW_RELEASE' ? <ArrowDownRight color="#10b981" /> : <ArrowUpRight color="#ef4444" />}
                                            </div>
                                            <div>
                                                <p className="font-bold text-main mb-1">{tx.description || tx.type.replace('_', ' ')}</p>
                                                <p className="text-[10px] text-muted" suppressHydrationWarning>
                                                    {new Date(tx.createdAt).toLocaleDateString()} • {tx.status}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className={`font-bold ${tx.type === 'DEPOSIT' || tx.type === 'ESCROW_RELEASE' ? 'text-primary' : 'text-main'}`}>
                                                {tx.type === 'DEPOSIT' || tx.type === 'ESCROW_RELEASE' ? '+' : '-'} GH₵ {tx.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                            </p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center text-muted">
                                    No transactions recorded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'ADVISORY' && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-8 animate-fade-in">
                    {/* WEATHER PANEL */}
                    <div className="d-flex flex-col gap-6">
                        <div className="glass-card p-8" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.02) 100%)' }}>
                            <div className="d-flex items-center justify-between mb-6">
                                <div className="d-flex items-center gap-3">
                                    <CloudRain color="#3b82f6" size={24} />
                                    <h3 className="heading-2 text-xl m-0">Local Weather</h3>
                                </div>
                                <span className="text-sm text-muted">{profileData.district || 'Your District'}</span>
                            </div>

                            <div className="d-flex items-center gap-6 mb-8">
                                <Sun color="#f59e0b" size={48} />
                                <div>
                                    <h1 className="text-5xl font-extrabold text-main leading-none">32°C</h1>
                                    <p className="text-amber-500 font-bold">Sunny & Dry</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white-5 pt-6">
                                <div className="d-flex items-center gap-2">
                                    <CloudRain size={16} color="#3b82f6" />
                                    <span className="text-sm text-muted">0% Rain</span>
                                </div>
                                <div className="d-flex items-center gap-2">
                                    <Wind size={16} color="#a8a29e" />
                                    <span className="text-sm text-muted">12 km/h</span>
                                </div>
                                <div className="d-flex items-center gap-2">
                                    <Thermometer size={16} color="#ef4444" />
                                    <span className="text-sm text-muted">High: 34°C</span>
                                </div>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-l-4 border-red-500 bg-red-500/5">
                            <div className="d-flex items-center gap-2 mb-2 text-red-500 font-bold">
                                <AlertTriangle size={18} /> Extreme Heat Alert
                            </div>
                            <p className="text-sm text-muted leading-relaxed">
                                Extended dry spell expected over the next 5 days. Consider increasing irrigation frequency for vulnerable crops.
                            </p>
                        </div>
                    </div>

                    {/* ASK FARM AI CHAT */}
                    <div className="glass-card d-flex flex-col h-[600px] overflow-hidden">
                        <div className="p-6 border-b border-white-5 d-flex items-center gap-3 bg-black-20">
                            <div className="w-10 h-10 rounded-full d-flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--primary-color), #0ea5e9)' }}>
                                <Bot color="#fff" size={20} />
                            </div>
                            <div>
                                <h3 className="heading-2 text-lg m-0">ASK FARM AI Advisory</h3>
                                <p className="text-[10px] text-primary font-bold">● Online & Ready</p>
                            </div>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto d-flex flex-col gap-4">
                            {chatMessages.map((msg, index) => (
                                <div key={index} className={`d-flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-4 rounded-xl text-sm leading-relaxed ${msg.role === 'user' ? 'bg-primary text-white rounded-br-none' : 'bg-white-5 text-main rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-top border-white-5 bg-black-20">
                            <form onSubmit={handleSendChat} className="d-flex gap-2">
                                <input
                                    id="ai-chat-input"
                                    type="text"
                                    className="input-field flex-1 rounded-full px-6"
                                    placeholder="Ask about crop health, market prices..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    title="AI Chat Input"
                                />
                                <button type="submit" disabled={!chatInput.trim()} className={`w-12 h-12 rounded-full border-none d-flex items-center justify-center transition-all ${chatInput.trim() ? 'bg-primary cursor-pointer text-white' : 'bg-white-10 cursor-not-allowed text-white'}`} title="Send Message">
                                    <Send size={18} className="ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'INSIGHTS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fade-in">
                    <div className="glass-card p-8 d-flex flex-col gap-6">
                        <h3 className="heading-2 text-xl d-flex items-center gap-3 m-0">
                            <TrendingUp color="var(--primary-color)" size={24} /> 30-Day Price Trends (National)
                        </h3>
                        <div className="p-6 bg-black-20 rounded-xl">
                            <div className="d-flex justify-between items-center mb-4 pb-4 border-b border-white-5">
                                <div>
                                    <h4 className="font-bold text-main mb-1">Maize (White)</h4>
                                    <p className="text-xs text-primary">+ 4.2% this month</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-lg text-main">GHS 2,400 / MT</p>
                                </div>
                            </div>
                            <div className="d-flex justify-between items-center mb-4 pb-4 border-b border-white-5">
                                <div>
                                    <h4 className="font-bold text-main mb-1">Tomatoes</h4>
                                    <p className="text-xs text-red-500">- 2.1% this month</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-lg text-main">GHS 1,850 / MT</p>
                                </div>
                            </div>
                            <div className="d-flex justify-between items-center">
                                <div>
                                    <h4 className="font-bold text-main mb-1">Cassava</h4>
                                    <p className="text-xs text-primary">+ 1.5% this month</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-extrabold text-lg text-main">GHS 900 / MT</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="glass-card p-8 d-flex flex-col gap-6">
                        <h3 className="heading-2 text-xl d-flex items-center gap-3 m-0">
                            <MapPin color="#3b82f6" size={24} /> Regional Shortage Alerts
                        </h3>
                        <div className="d-flex flex-col gap-4">
                            <div className="p-4 rounded-lg bg-blue-500/10 border-l-4 border-blue-500">
                                <h4 className="font-bold text-blue-500 mb-1">Greater Accra</h4>
                                <p className="text-sm text-muted">High demand for <strong>Plantains</strong> reported due to recent supply chain disruptions. Expected premium markup: ~15%.</p>
                            </div>
                            <div className="p-4 rounded-lg bg-orange-500/10 border-l-4 border-orange-500">
                                <h4 className="font-bold text-orange-500 mb-1">Ashanti Region</h4>
                                <p className="text-sm text-muted">Moderate shortage of <strong>Onions</strong>. Cooperative purchasing is occurring at slightly elevated rates.</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'COMMUNITY' && (
                <div className="grid grid-cols-1 lg:grid-cols-[1fr_3fr] gap-8 animate-fade-in min-h-[600px]">
                    <div className="glass-card p-6 d-flex flex-col gap-4">
                        <h3 className="heading-2 text-lg m-0 d-flex items-center gap-2">
                            <Users size={20} color="var(--primary-color)" /> Hubs
                        </h3>
                        <button className="bg-primary/10 border border-primary text-left p-4 rounded-lg text-main cursor-pointer" title="Switch to Regional Cooperative Hub">
                            <div className="font-bold">Regional Cooperative</div>
                            <div className="text-[10px] text-primary">{profileData.district || 'General'} Area</div>
                        </button>
                        <button className="bg-transparent border border-white-5 text-left p-4 rounded-lg text-muted cursor-pointer hover:bg-white-5" title="Switch to Announcements Hub">
                            <div className="font-bold">Platform Announcements</div>
                            <div className="text-[10px]">FarmLink Admin</div>
                        </button>
                    </div>

                    <div className="glass-card d-flex flex-col h-full overflow-hidden">
                        <div className="p-6 border-b border-white-5 bg-black-20">
                            <h3 className="heading-2 text-xl m-0">Regional Cooperative Chat</h3>
                            <p className="text-muted text-sm">Discuss pricing, coordinate transport, and share localized knowledge.</p>
                        </div>

                        <div className="flex-1 p-6 overflow-y-auto d-flex flex-col gap-4">
                            {communityMessages.map((msg) => (
                                <div key={msg.id} className={`d-flex flex-col ${msg.isMe ? 'items-end' : 'items-start'}`}>
                                    <div className="text-[10px] text-muted mb-1 px-1">
                                        {msg.sender} • {msg.time}
                                    </div>
                                    <div className={`max-w-[75%] p-4 rounded-xl text-sm leading-relaxed border ${msg.isMe ? 'bg-primary/20 text-primary border-primary/30 rounded-br-none' : 'bg-white-5 text-main border-white-10 rounded-bl-none'}`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-6 border-top border-white-5 bg-black-20">
                            <form onSubmit={handleSendCommunityChat} className="d-flex gap-2">
                                <input
                                    id="community-chat-input"
                                    type="text"
                                    className="input-field flex-1 rounded-full px-6"
                                    placeholder="Message the cooperative..."
                                    value={communityChatInput}
                                    onChange={e => setCommunityChatInput(e.target.value)}
                                    title="Community Chat Input"
                                />
                                <button type="submit" disabled={!communityChatInput.trim()} className={`w-12 h-12 rounded-full border-none d-flex items-center justify-center transition-all ${communityChatInput.trim() ? 'bg-primary cursor-pointer text-white' : 'bg-white-10 cursor-not-allowed text-white'}`} title="Send Message">
                                    <Send size={18} className="ml-1" />
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Add/Edit Product Modal */}
            {(isModalOpen || isEditModalOpen) && (
                <div className="fixed inset-0 z-[2000] d-flex items-center justify-center p-4 bg-black-70 backdrop-blur-sm shadow-xl">
                    <div className="glass-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-8 bg-surface-dark animate-fade-in relative">
                        <button onClick={closeModal} className="absolute top-4 right-4 bg-transparent border-none text-muted hover:text-white cursor-pointer text-2xl" title="Close Modal">×</button>
                        <h2 className="heading-2 text-2xl mb-8">{isEditModalOpen ? 'Edit Product' : 'Add New Product'}</h2>

                        <form onSubmit={isEditModalOpen ? handleUpdateProduct : handleCreateProduct} className="d-flex flex-col gap-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2 col-span-full">
                                    <label className="text-sm">Product Media (Max 10 Images, 1 Video)</label>
                                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mt-2 p-4 rounded-xl border-dashed border border-white-10 bg-white-5">
                                        {imageItems.map((item, idx) => (
                                            <div key={item.id} className={`relative aspect-square rounded-lg overflow-hidden border cursor-zoom-in ${idx === 0 ? 'border-primary' : 'border-white-10'}`} onClick={() => setPreviewImage(item.url)}>
                                                <img src={getProxiedUrl(item.url)} alt={`Product Preview ${idx + 1}`} className="w-full h-full object-cover" />
                                                {idx === 0 && <div className="absolute top-1 left-1 bg-primary text-white text-[8px] px-1 rounded font-extrabold uppercase">PRIMARY</div>}
                                                <div className="absolute inset-0 bg-black-40 opacity-0 hover:opacity-100 transition-all d-flex flex-col items-center justify-center gap-2">
                                                    <div className="d-flex gap-1">
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(idx, 'up'); }} disabled={idx === 0} className="w-6 h-6 bg-white text-black border-none rounded text-xs cursor-pointer">↑</button>
                                                        <button type="button" onClick={(e) => { e.stopPropagation(); moveImage(idx, 'down'); }} disabled={idx === imageItems.length - 1} className="w-6 h-6 bg-white text-black border-none rounded text-xs cursor-pointer">↓</button>
                                                    </div>
                                                    <button type="button" title="Set as Primary" onClick={(e) => { e.stopPropagation(); setPrimaryImage(idx); }} className="px-2 py-1 bg-primary text-white text-[8px] font-bold border-none rounded cursor-pointer">⭐ PRIMARY</button>
                                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(item.id); }} className="px-2 py-1 bg-red-500 text-white text-[8px] font-bold border-none rounded cursor-pointer">REMOVE</button>
                                                </div>
                                            </div>
                                        ))}
                                        {imageItems.length < 10 && (
                                            <label className="d-flex flex-col items-center justify-center aspect-square bg-white-5 rounded-lg border-dashed border border-white-20 cursor-pointer hover:bg-white-10">
                                                <span className="text-2xl text-primary">+</span>
                                                <span className="text-[10px] text-muted">Add Image</span>
                                                <input
                                                    type="file"
                                                    accept="image/jpeg, image/png, image/webp"
                                                    multiple
                                                    className="hidden"
                                                    onChange={handleImageChange}
                                                    title="Upload Product Images"
                                                />
                                            </label>
                                        )}
                                    </div>
                                    <p className="text-[10px] text-muted mt-2">Drag or use arrows to reorder. First image is used as primary. Max 2MB per image (Auto-compressed).</p>
                                </div>
                                <div className="d-flex flex-col gap-2 col-span-full">
                                    <label htmlFor="product-video" className="text-sm">Video Showcase (Optional)</label>
                                    <input
                                        id="product-video"
                                        type="file"
                                        accept="video/mp4, video/webm, video/quicktime"
                                        className="input-field p-2"
                                        onChange={e => e.target.files && setVideoFile(e.target.files[0])}
                                        title="Upload Product Video"
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-col gap-2">
                                <label htmlFor="product-name" className="text-sm">Product Name</label>
                                <input
                                    id="product-name"
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    title="Product Name"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="product-price" className="text-sm d-flex justify-between">
                                        Price per MT (GHS)
                                        <span className="text-[10px] text-primary">🤖 AI Fair Price: ~2,400 GHS</span>
                                    </label>
                                    <input
                                        id="product-price"
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.price}
                                        onChange={e => setFormData({ ...formData, price: e.target.value })}
                                        title="Price per Metric Ton"
                                    />
                                </div>
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="product-quantity" className="text-sm">Available Quantity (MT)</label>
                                    <input
                                        id="product-quantity"
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.availableQuantity}
                                        onChange={e => setFormData({ ...formData, availableQuantity: parseInt(e.target.value) || 0 })}
                                        title="Available Quantity"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="min-order" className="text-sm">Minimum Order (MT)</label>
                                    <input
                                        id="min-order"
                                        type="number"
                                        required
                                        className="input-field"
                                        value={formData.minOrderQuantity}
                                        onChange={e => setFormData({ ...formData, minOrderQuantity: parseInt(e.target.value) || 0 })}
                                        title="Minimum Order Quantity"
                                    />
                                </div>
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="harvest-date" className="text-sm">Harvest Date</label>
                                    <input
                                        id="harvest-date"
                                        type="date"
                                        required
                                        className="input-field"
                                        value={formData.harvestDate}
                                        onChange={e => setFormData({ ...formData, harvestDate: e.target.value })}
                                        title="Harvest Date"
                                    />
                                </div>
                            </div>
                            <div className="d-flex flex-col gap-2">
                                <label htmlFor="product-desc" className="text-sm">Description</label>
                                <textarea
                                    id="product-desc"
                                    className="input-field resize-y"
                                    rows={4}
                                    value={formData.description}
                                    onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    title="Product Description"
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="product-category" className="text-sm">Category</label>
                                    <select
                                        id="product-category"
                                        className="input-field"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                        title="Product Category"
                                    >
                                        <option value="VEGETABLES">Vegetables</option>
                                        <option value="FRUITS">Fruits</option>
                                        <option value="DAIRY">Dairy</option>
                                        <option value="MEAT">Meat</option>
                                        <option value="GRAINS">Grains</option>
                                        <option value="OTHER">Other</option>
                                    </select>
                                </div>
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="product-region" className="text-sm">Source Region</label>
                                    <select
                                        id="product-region"
                                        className="input-field"
                                        value={formData.region}
                                        onChange={e => setFormData({ ...formData, region: e.target.value })}
                                        title="Source Region"
                                    >
                                        <option value="Greater Accra">Greater Accra</option>
                                        <option value="Ashanti Region">Ashanti Region</option>
                                        <option value="Northern Region">Northern Region</option>
                                        <option value="Volta Region">Volta Region</option>
                                        <option value="Brong Ahafo Region">Brong Ahafo Region</option>
                                    </select>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="d-flex flex-col gap-2">
                                    <label htmlFor="quality-grade" className="text-sm">Quality Grade</label>
                                    <select
                                        id="quality-grade"
                                        className="input-field"
                                        value={formData.qualityGrade}
                                        onChange={e => setFormData({ ...formData, qualityGrade: e.target.value })}
                                        title="Quality Grade"
                                    >
                                        <option value="Premium">Premium</option>
                                        <option value="Grade A">Grade A</option>
                                        <option value="Grade B">Grade B</option>
                                        <option value="Standard">Standard</option>
                                    </select>
                                </div>
                                <div className="d-flex items-center pt-6">
                                    <label htmlFor="is-organic" className="d-flex items-center gap-2 cursor-pointer m-0">
                                        <input
                                            id="is-organic"
                                            type="checkbox"
                                            checked={formData.isOrganic}
                                            onChange={e => setFormData({ ...formData, isOrganic: e.target.checked })}
                                            className="w-4 h-4"
                                            title="Is Certified Organic"
                                        />
                                        <span className="text-sm">Certified Organic</span>
                                    </label>
                                </div>
                            </div>

                            <div className="d-flex gap-4 mt-6">
                                <button type="button" className="btn-outline flex-1 py-3" onClick={closeModal}>Cancel</button>
                                <button type="submit" className="btn-primary flex-1 py-3" disabled={isSubmitting}>
                                    {isSubmitting ? 'Saving...' : (isEditModalOpen ? 'Update Listing' : 'Upload V2 Listing')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            {/* IMAGE LIGHTBOX PREVIEW */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black-90 z-[3000] d-flex items-center justify-center cursor-zoom-out backdrop-blur-lg animate-fade-in"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="relative max-w-[90vw] max-h-[90vh]" onClick={e => e.stopPropagation()}>
                        <img src={getProxiedUrl(previewImage || '')} alt="Lightbox Preview" className="max-w-full max-h-[90vh] rounded-xl shadow-2xl object-contain" />
                        <button
                            className="absolute -top-12 -right-12 bg-transparent border-none text-white text-4xl cursor-pointer"
                            onClick={() => setPreviewImage(null)}
                            title="Close Preview"
                        >
                            ×
                        </button>
                        <p className="absolute -bottom-12 left-0 right-0 text-center text-white-60 text-sm">Click anywhere outside to close</p>
                    </div>
                </div>
            )}
        </div>
    );
}
