/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, Calendar, ShoppingBag, ShieldCheck, Settings, 
  Mail, ClipboardList, RefreshCw, AlertTriangle, Check, X,
  FileText, Plus, Trash2, Edit, Save, DollarSign, Users, Package,
  Camera, Image, UploadCloud, Copy, Download
} from 'lucide-react';
import { Product, Booking, Order, StoreSettings, Message, AuditLog, MediaPhoto, BlogPost } from '../types';

interface AdminDashboardProps {
  adminToken: string;
  onLogout: () => void;
}

export default function AdminDashboard({ adminToken, onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'stats' | 'bookings' | 'orders' | 'orders-report' | 'products' | 'photos' | 'settings' | 'inbox' | 'audit' | 'blogs'>('stats');
  const [loading, setLoading] = useState(false);
  
  // Order Report filter states
  const [reportSearch, setReportSearch] = useState('');
  const [reportStatusFilter, setReportStatusFilter] = useState<'all' | 'pending' | 'processing' | 'shipped' | 'completed'>('all');
  const [reportPaymentFilter, setReportPaymentFilter] = useState<'all' | 'paid' | 'pending'>('all');
  const [reportSortBy, setReportSortBy] = useState<'date-new' | 'date-old' | 'total-high' | 'total-low'>('date-new');
  
  // Dashboard states
  const [stats, setStats] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);

  // Editing state trackers
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPhoto, setEditingPhoto] = useState<MediaPhoto | null>(null);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);

  // New photo form state
  const [newPhotoTitle, setNewPhotoTitle] = useState('');
  const [newPhotoDesc, setNewPhotoDesc] = useState('');
  const [newPhotoCat, setNewPhotoCat] = useState('CCTV');
  const [newPhotoUrl, setNewPhotoUrl] = useState('');
  const [newPhotoFile, setNewPhotoFile] = useState<File | null>(null);
  const [newPhotoBase64, setNewPhotoBase64] = useState('');
  const [uploadProgress, setUploadProgress] = useState(false);

  // New product form state
  const [newProdName, setNewProdName] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdCat, setNewProdCat] = useState('CCTV');
  const [newProdPrice, setNewProdPrice] = useState('');
  const [newProdOrigPrice, setNewProdOrigPrice] = useState('');
  const [newProdStock, setNewProdStock] = useState('');
  const [newProdImage, setNewProdImage] = useState('');
  const [newProdTags, setNewProdTags] = useState('');

  // New blog form state
  const [newBlogTitle, setNewBlogTitle] = useState('');
  const [newBlogContent, setNewBlogContent] = useState('');
  const [newBlogCat, setNewBlogCat] = useState('CCTV');
  const [newBlogImage, setNewBlogImage] = useState('');
  const [newBlogExcerpt, setNewBlogExcerpt] = useState('');

  // Settings form state
  const [setShopName, setSetShopName] = useState('');
  const [setPhone, setSetPhone] = useState('');
  const [setEmail, setSetEmail] = useState('');
  const [setLocation, setSetLocation] = useState('');
  const [setTillNumber, setSetTillNumber] = useState('');
  const [setSeoTitle, setSetSeoTitle] = useState('');
  const [setSeoDesc, setSetSeoDesc] = useState('');

  // Refresh helper
  const fetchData = async () => {
    setLoading(true);
    try {
      const headers = { 'Authorization': `Bearer ${adminToken}` };
      
      const [rStats, rBookings, rOrders, rProducts, rMessages, rLogs, rSettings, rPhotos, rBlogs] = await Promise.all([
        fetch('/api/v1/admin/stats', { headers }).then(r => r.json()),
        fetch('/api/v1/bookings', { headers }).then(r => r.json()),
        fetch('/api/v1/orders', { headers }).then(r => r.json()),
        fetch('/api/v1/products').then(r => r.json()),
        fetch('/api/v1/messages', { headers }).then(r => r.json()),
        fetch('/api/v1/audit-logs', { headers }).then(r => r.json()),
        fetch('/api/v1/settings').then(r => r.json()),
        fetch('/api/v1/media').then(r => r.json()),
        fetch('/api/v1/blogs').then(r => r.json())
      ]);

      setStats(rStats);
      setBookings(rBookings);
      setOrders(rOrders);
      setProducts(rProducts);
      setMessages(rMessages);
      setAuditLogs(rLogs);
      setSettings(rSettings);
      setPhotos(rPhotos || []);
      setBlogs(rBlogs || []);

      // Prepopulate settings form
      if (rSettings) {
        setSetShopName(rSettings.shopName || '');
        setSetPhone(rSettings.phone || '');
        setSetEmail(rSettings.email || '');
        setSetLocation(rSettings.location || '');
        setSetTillNumber(rSettings.mpesaTillNumber || '');
        setSetSeoTitle(rSettings.seoTitle || '');
        setSetSeoDesc(rSettings.seoDescription || '');
      }
    } catch (err) {
      console.error('Failed to pull admin records:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [adminToken]);

  // Operations handlers
  const handleUpdateBooking = async (id: string, payload: Partial<Booking>) => {
    try {
      const res = await fetch(`/api/v1/bookings/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateOrder = async (id: string, payload: Partial<Order>) => {
    try {
      const res = await fetch(`/api/v1/orders/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleMessage = async (id: string, currentStatus: 'unread' | 'read') => {
    try {
      const res = await fetch(`/api/v1/messages/${id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({ status: currentStatus === 'unread' ? 'read' : 'unread' })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName || !newProdPrice || !newProdStock) {
      alert('Please fill out Product Name, Price, and Stock level.');
      return;
    }
    
    try {
      const url = editingProduct ? `/api/v1/products/${editingProduct.id}` : '/api/v1/products';
      const method = editingProduct ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          name: newProdName,
          description: newProdDesc,
          category: newProdCat,
          price: Number(newProdPrice),
          originalPrice: newProdOrigPrice ? Number(newProdOrigPrice) : undefined,
          stock: Number(newProdStock),
          image: newProdImage,
          tags: newProdTags.split(',').map(t => t.trim()).filter(Boolean)
        })
      });

      if (res.ok) {
        alert(editingProduct ? 'Product updated successfully!' : 'Product models cataloged successfully!');
        setNewProdName('');
        setNewProdDesc('');
        setNewProdCat('CCTV');
        setNewProdPrice('');
        setNewProdOrigPrice('');
        setNewProdStock('');
        setNewProdImage('');
        setNewProdTags('');
        setEditingProduct(null);
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to remove this product from your inventory catalog?')) return;
    try {
      const res = await fetch(`/api/v1/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddPhotoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPhotoTitle) {
      alert('Please enter a photo title.');
      return;
    }

    setUploadProgress(true);
    try {
      const payload: any = {
        title: newPhotoTitle,
        description: newPhotoDesc,
        category: newPhotoCat,
      };

      if (newPhotoBase64) {
        payload.data = newPhotoBase64;
        payload.name = newPhotoFile?.name;
      } else if (newPhotoUrl) {
        payload.url = newPhotoUrl;
      } else if (editingPhoto) {
        payload.url = editingPhoto.url;
      } else {
        alert('Please drag & drop / choose a photo file to upload or enter a web image URL.');
        setUploadProgress(false);
        return;
      }

      const url = editingPhoto ? `/api/v1/media/${editingPhoto.id}` : '/api/v1/media';
      const method = editingPhoto ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        alert(editingPhoto ? 'Photo updated successfully!' : 'Photo added to media gallery successfully!');
        setNewPhotoTitle('');
        setNewPhotoDesc('');
        setNewPhotoCat('CCTV');
        setNewPhotoUrl('');
        setNewPhotoFile(null);
        setNewPhotoBase64('');
        setEditingPhoto(null);
        await fetchData();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Unknown error'}`);
      }
    } catch (err: any) {
      console.error(err);
      alert(`Failed: ${err.message}`);
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDeletePhoto = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this photo from your website media gallery?')) return;
    try {
      const res = await fetch(`/api/v1/media/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        await fetchData();
      } else {
        alert('Failed to delete photo from gallery.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddBlogSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBlogTitle || !newBlogContent) {
      alert('Please fill out blog Title and Content.');
      return;
    }

    try {
      const url = editingBlog ? `/api/v1/blogs/${editingBlog.id}` : '/api/v1/blogs';
      const method = editingBlog ? 'PUT' : 'POST';
      
      const res = await fetch(url, {
        method,
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          title: newBlogTitle,
          content: newBlogContent,
          excerpt: newBlogExcerpt || newBlogContent.substring(0, 150) + '...',
          category: newBlogCat,
          image: newBlogImage || 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?auto=format&fit=crop&q=80&w=800',
        })
      });

      if (res.ok) {
        alert(editingBlog ? 'Blog post updated successfully!' : 'Blog post published successfully!');
        setNewBlogTitle('');
        setNewBlogContent('');
        setNewBlogCat('CCTV');
        setNewBlogImage('');
        setNewBlogExcerpt('');
        setEditingBlog(null);
        await fetchData();
      } else {
        const errData = await res.json();
        alert(`Error: ${errData.error || 'Unknown error'}`);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteBlog = async (id: string) => {
    if (!confirm('Are you absolutely sure you want to permanently delete this blog post?')) return;
    try {
      const res = await fetch(`/api/v1/blogs/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.ok) {
        alert('Blog post deleted.');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setNewPhotoFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setNewPhotoBase64(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/settings', {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${adminToken}`
        },
        body: JSON.stringify({
          shopName: setShopName,
          phone: setPhone,
          email: setEmail,
          location: setLocation,
          mpesaTillNumber: setTillNumber,
          seoTitle: setSeoTitle,
          seoDescription: setSeoDesc
        })
      });
      if (res.ok) {
        alert('Business configurations and SEO settings updated securely!');
        await fetchData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-4 sm:px-6 lg:px-8 font-sans" id="admin-panel-container">
      <div className="max-w-7xl mx-auto">
        
        {/* Dashboard Header */}
        <div className="bg-slate-900 rounded-2xl p-6 sm:p-8 text-white mb-8 shadow-lg flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-500" />
              <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono">Central Administration Console</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight mt-1">SmartTech Management Portal</h1>
            <p className="text-xs text-slate-400 mt-1">Configure catalogs, verify repairs schedule, trace incoming M-Pesa push flows, and audit logs.</p>
          </div>
          <button 
            onClick={fetchData} 
            disabled={loading}
            className="flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-all border border-slate-700"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh Records
          </button>
        </div>

        {/* Multi-Tab Navigation Panel */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-6">
          {[
            { id: 'stats', label: 'Overview Metrics', icon: TrendingUp },
            { id: 'bookings', label: 'Service Bookings', icon: Calendar },
            { id: 'orders', label: 'E-Commerce Orders', icon: ShoppingBag },
            { id: 'orders-report', label: 'Orders Ledger Report', icon: FileText },
            { id: 'products', label: 'Products CMS', icon: Package },
            { id: 'photos', label: 'Photos & Media', icon: Camera },
            { id: 'blogs', label: 'Blogs CMS', icon: FileText },
            { id: 'inbox', label: 'Customer Inbox', icon: Mail },
            { id: 'settings', label: 'Settings CMS', icon: Settings },
            { id: 'audit', label: 'Audit Log Ledger', icon: ClipboardList }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors border ${
                  activeTab === tab.id 
                    ? 'bg-slate-950 text-white border-slate-950' 
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
                id={`dashboard-tab-${tab.id}`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Dashboard Content Panel */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 sm:p-8" id="admin-view-body">
          {loading && !stats && (
            <div className="h-64 flex flex-col items-center justify-center text-slate-400">
              <RefreshCw className="w-8 h-8 animate-spin mb-2" />
              <p className="text-sm font-medium">Bootstrapping database collections...</p>
            </div>
          )}

          {/* ==================================== */}
          {/* OVERVIEW STATS TAB */}
          {/* ==================================== */}
          {activeTab === 'stats' && stats && (
            <div className="space-y-8" id="stats-tab-content">
              
              {/* KPI Cards */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Total Store Sales</span>
                    <DollarSign className="w-4 h-4 text-emerald-600" />
                  </div>
                  <h3 className="text-xl font-mono font-bold text-slate-900 mt-2">KES {stats.totalRevenue.toLocaleString()}</h3>
                  <span className="text-[10px] text-emerald-600 font-bold block mt-1">STK Push Cleared</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Pending Bookings</span>
                    <Calendar className="w-4 h-4 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-mono font-bold text-slate-900 mt-2">{stats.pendingBookingsCount} / {stats.totalBookings}</h3>
                  <span className="text-[10px] text-amber-600 font-bold block mt-1">Requires Confirmation</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Incoming Orders</span>
                    <ShoppingBag className="w-4 h-4 text-sky-500" />
                  </div>
                  <h3 className="text-xl font-mono font-bold text-slate-900 mt-2">{stats.pendingOrdersCount} / {stats.totalOrders}</h3>
                  <span className="text-[10px] text-sky-600 font-bold block mt-1">Pending Dispatch</span>
                </div>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <div className="flex justify-between items-start">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Client Enquiries</span>
                    <Mail className="w-4 h-4 text-rose-500" />
                  </div>
                  <h3 className="text-xl font-mono font-bold text-slate-900 mt-2">{stats.unreadMessagesCount} unread</h3>
                  <span className="text-[10px] text-slate-400 block mt-1">Total messages: {messages.length}</span>
                </div>
              </div>

              {/* Graphical Visualizations via standard inline custom SVGs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Custom SVG Sales chart */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Financial Earnings Flow</h4>
                  <div className="relative h-48 w-full border-b border-slate-200">
                    {/* SVG Chart */}
                    <svg className="w-full h-full" viewBox="0 0 400 150">
                      {/* Grid Lines */}
                      <line x1="0" y1="30" x2="400" y2="30" stroke="#f1f5f9" strokeDasharray="4" />
                      <line x1="0" y1="75" x2="400" y2="75" stroke="#f1f5f9" strokeDasharray="4" />
                      <line x1="0" y1="120" x2="400" y2="120" stroke="#f1f5f9" strokeDasharray="4" />
                      
                      {/* Spline area */}
                      <path 
                        d="M0 130 Q 80 90, 160 110 T 320 40 T 400 20 L 400 150 L 0 150 Z" 
                        fill="url(#salesGrad)" 
                        opacity="0.15" 
                      />
                      {/* Line curve */}
                      <path 
                        d="M0 130 Q 80 90, 160 110 T 320 40 T 400 20" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="3" 
                      />
                      
                      {/* Dots on peak peaks */}
                      <circle cx="160" cy="110" r="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />
                      <circle cx="320" cy="40" r="4" fill="#1e293b" stroke="#f59e0b" strokeWidth="2" />

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#ffffff" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 mt-2">
                    <span>May Week 1</span>
                    <span>May Week 2</span>
                    <span>June Week 1</span>
                    <span>June Week 2</span>
                    <span>July Today</span>
                  </div>
                </div>

                {/* Performance circular meters */}
                <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Service Audits and Stock Warnings</h4>
                  
                  <div className="space-y-4">
                    {/* Progress Bar 1 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Service Completion Rate</span>
                        <span className="font-mono font-bold text-emerald-600">92%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
                      </div>
                    </div>

                    {/* Progress Bar 2 */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span className="font-semibold text-slate-700">Parts Inventory Stock Density</span>
                        <span className="font-mono font-bold text-amber-500">76%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div className="bg-amber-500 h-full rounded-full" style={{ width: '76%' }} />
                      </div>
                    </div>

                    {/* Low Stock Warning Panel */}
                    {stats.lowStockCount > 0 && (
                      <div className="bg-rose-50 border border-rose-100 rounded-xl p-3 flex gap-2.5 items-start mt-4 animate-pulse">
                        <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <h5 className="text-xs font-bold text-rose-800 uppercase">Attention Required ({stats.lowStockCount} items)</h5>
                          <p className="text-[10px] text-rose-600 leading-relaxed mt-0.5">
                            Certain product models or spare replacement parts have dipped below critical thresholds (5 units). Reorder mainboards/backlights immediately to avoid service dispatch disruptions.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Mini Logs view */}
              <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4">Latest Operations Feed</h4>
                <div className="space-y-3">
                  {auditLogs.slice(0, 5).map(log => (
                    <div key={log.id} className="flex gap-4 items-center justify-between text-xs py-2 border-b border-slate-50 last:border-0">
                      <div className="flex gap-2 items-center min-w-0">
                        <span className="bg-slate-100 text-slate-800 font-bold px-2 py-0.5 rounded text-[9px] uppercase tracking-wide">
                          {log.action}
                        </span>
                        <p className="text-slate-600 truncate">{log.details}</p>
                      </div>
                      <span className="text-[10px] text-slate-400 whitespace-nowrap font-mono">{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================================== */}
          {/* BOOKINGS TABLE TAB */}
          {/* ==================================== */}
          {activeTab === 'bookings' && (
            <div className="space-y-4" id="bookings-tab-content">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Repair & Installation Job Sheets</h3>
                <span className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-bold">Total: {bookings.length} Jobs</span>
              </div>

              {bookings.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Calendar className="w-12 h-12 mb-2" />
                  <p className="text-sm font-medium">No bookings cataloged yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-3">Client details</th>
                        <th className="p-3">Requested service</th>
                        <th className="p-3">Date & Time</th>
                        <th className="p-3">Financials</th>
                        <th className="p-3">Job Status</th>
                        <th className="p-3 text-right">Perform actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-slate-50/50">
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{b.customerName}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{b.customerPhone}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{b.address}</p>
                          </td>
                          <td className="p-3">
                            <span className="font-semibold text-slate-800">{b.serviceName}</span>
                            {b.notes && <p className="text-[10px] text-slate-400 italic mt-0.5 truncate max-w-xs">"{b.notes}"</p>}
                          </td>
                          <td className="p-3 font-mono text-slate-700">
                            <p className="font-semibold">{b.date}</p>
                            <p className="text-[10px] text-slate-500">{b.time}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 font-mono">KES {b.amount.toLocaleString()}</p>
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              b.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {b.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                              b.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              b.status === 'confirmed' ? 'bg-sky-100 text-sky-800' :
                              b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {b.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {b.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateBooking(b.id, { status: 'confirmed' })}
                                className="bg-sky-600 hover:bg-sky-700 text-white p-1 rounded transition-colors"
                                title="Confirm Job Schedule"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {b.status !== 'completed' && b.status !== 'cancelled' && (
                              <button 
                                onClick={() => handleUpdateBooking(b.id, { status: 'completed', paymentStatus: 'paid' })}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white p-1 rounded transition-colors"
                                title="Mark Finished & Paid"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {b.paymentStatus === 'pending' && (
                              <button 
                                onClick={() => handleUpdateBooking(b.id, { paymentStatus: 'paid' })}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 px-2 py-1 rounded text-[10px] font-bold transition-colors"
                              >
                                Mark Paid
                              </button>
                            )}
                            {b.status !== 'cancelled' && b.status !== 'completed' && (
                              <button 
                                onClick={() => handleUpdateBooking(b.id, { status: 'cancelled' })}
                                className="bg-rose-100 hover:bg-rose-200 text-rose-600 p-1 rounded transition-colors"
                                title="Cancel Repair Request"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* ORDERS TABLE TAB */}
          {/* ==================================== */}
          {activeTab === 'orders' && (
            <div className="space-y-4" id="orders-tab-content">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Shopping Checkout Logs</h3>
                <span className="text-xs bg-slate-100 text-slate-800 px-3 py-1 rounded-full font-bold">Total: {orders.length} Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <ShoppingBag className="w-12 h-12 mb-2" />
                  <p className="text-sm font-medium">No shopping checkouts recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                        <th className="p-3">Order Code</th>
                        <th className="p-3">Buyer Profile</th>
                        <th className="p-3">Purchased Items</th>
                        <th className="p-3">Financial Total</th>
                        <th className="p-3">Status</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {orders.map(o => (
                        <tr key={o.id} className="hover:bg-slate-50/50">
                          <td className="p-3 font-mono font-bold text-slate-900">
                            {o.id}
                            <p className="text-[9px] text-slate-400 font-normal">{new Date(o.createdAt).toLocaleDateString()}</p>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900">{o.customerName}</p>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">{o.customerPhone}</p>
                            <p className="text-[10px] text-slate-400 truncate max-w-xs">{o.address}</p>
                          </td>
                          <td className="p-3">
                            <div className="space-y-1">
                              {o.items.map((item, idx) => (
                                <div key={idx} className="text-[11px] text-slate-700 flex gap-2">
                                  <span className="font-bold font-mono text-slate-500">x{item.quantity}</span>
                                  <span className="truncate max-w-xs">{item.name}</span>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className="p-3">
                            <p className="font-bold text-slate-900 font-mono">KES {o.total.toLocaleString()}</p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">{o.paymentMethod}</p>
                            <span className={`inline-block text-[9px] font-bold px-2 py-0.5 rounded-full uppercase ${
                              o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {o.paymentStatus}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                              o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                              o.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                              o.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                              'bg-amber-100 text-amber-800'
                            }`}>
                              {o.status}
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 whitespace-nowrap">
                            {o.paymentStatus === 'pending' && o.paymentMethod === 'mpesa' && (
                              <button 
                                onClick={async () => {
                                  try {
                                    await fetch(`/api/v1/orders/${o.id}/simulate-mpesa-callback`, { method: 'POST' });
                                    await fetchData();
                                  } catch (e) { console.error(e); }
                                }}
                                className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-[10px] font-bold px-2 py-1 rounded transition-colors"
                              >
                                Approve MPesa
                              </button>
                            )}
                            {o.status === 'pending' && (
                              <button 
                                onClick={() => handleUpdateOrder(o.id, { status: 'processing' })}
                                className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                              >
                                Process Order
                              </button>
                            )}
                            {o.status === 'processing' && (
                              <button 
                                onClick={() => handleUpdateOrder(o.id, { status: 'shipped' })}
                                className="bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                              >
                                Dispatch Box
                              </button>
                            )}
                            {o.status === 'shipped' && (
                              <button 
                                onClick={() => handleUpdateOrder(o.id, { status: 'completed', paymentStatus: 'paid' })}
                                className="bg-emerald-600 hover:bg-emerald-700 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors"
                              >
                                Complete Order
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* ORDERS REPORT & CSV EXPORT TAB */}
          {/* ==================================== */}
          {activeTab === 'orders-report' && (() => {
            const displayOrders = (() => {
              let result = [...orders];
              if (reportSearch.trim()) {
                const q = reportSearch.toLowerCase().trim();
                result = result.filter(o => 
                  o.id.toLowerCase().includes(q) ||
                  o.customerName.toLowerCase().includes(q) ||
                  o.customerEmail.toLowerCase().includes(q) ||
                  o.customerPhone.toLowerCase().includes(q) ||
                  o.address.toLowerCase().includes(q) ||
                  o.items.some(item => item.name.toLowerCase().includes(q))
                );
              }
              if (reportStatusFilter !== 'all') {
                result = result.filter(o => o.status === reportStatusFilter);
              }
              if (reportPaymentFilter !== 'all') {
                result = result.filter(o => o.paymentStatus === reportPaymentFilter);
              }
              result.sort((a, b) => {
                if (reportSortBy === 'date-new') {
                  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
                } else if (reportSortBy === 'date-old') {
                  return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
                } else if (reportSortBy === 'total-high') {
                  return b.total - a.total;
                } else if (reportSortBy === 'total-low') {
                  return a.total - b.total;
                }
                return 0;
              });
              return result;
            })();

            const totalFilteredValue = displayOrders.reduce((sum, o) => sum + o.total, 0);
            const paidFilteredCount = displayOrders.filter(o => o.paymentStatus === 'paid').length;
            const pendingFilteredCount = displayOrders.filter(o => o.paymentStatus === 'pending').length;

            const triggerCsvExport = () => {
              if (displayOrders.length === 0) {
                alert("No order records match the selected filters to export.");
                return;
              }

              const headers = [
                'Order ID',
                'Timestamp',
                'Customer Name',
                'Customer Email',
                'Customer Phone',
                'Delivery Address',
                'Items Purchased',
                'Grand Total (KES)',
                'Payment Method',
                'Payment Status',
                'Order Status'
              ];

              const csvContent = [
                headers.join(','),
                ...displayOrders.map(o => {
                  const itemsSummary = o.items.map(item => `${item.name} (x${item.quantity})`).join(' | ');
                  return [
                    `"${o.id}"`,
                    `"${new Date(o.createdAt).toLocaleString()}"`,
                    `"${o.customerName.replace(/"/g, '""')}"`,
                    `"${o.customerEmail.replace(/"/g, '""')}"`,
                    `"${o.customerPhone.replace(/"/g, '""')}"`,
                    `"${o.address.replace(/"/g, '""')}"`,
                    `"${itemsSummary.replace(/"/g, '""')}"`,
                    o.total,
                    `"${o.paymentMethod.toUpperCase()}"`,
                    `"${o.paymentStatus.toUpperCase()}"`,
                    `"${o.status.toUpperCase()}"`
                  ].join(',');
                })
              ].join('\n');

              const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
              const url = URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.setAttribute('href', url);
              link.setAttribute('download', `SmartTech_Orders_Ledger_${new Date().toISOString().slice(0, 10)}.csv`);
              link.style.visibility = 'hidden';
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            };

            return (
              <div className="space-y-6" id="orders-report-tab-content">
                
                {/* Header section with export trigger */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                      <FileText className="w-5 h-5 text-amber-500" />
                      Complete Orders Ledger Report
                    </h3>
                    <p className="text-xs text-slate-500 mt-1">
                      Perform granular searches, apply custom filtering, and export filtered results to CSV for external spreadsheets.
                    </p>
                  </div>
                  
                  <button
                    onClick={triggerCsvExport}
                    className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-sm hover:scale-[1.02] cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    Export Ledger to CSV
                  </button>
                </div>

                {/* KPI Metrics Dashboard based on filtered results */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Filtered Orders Count</span>
                    <h4 className="text-xl font-mono font-bold text-slate-900 mt-1">{displayOrders.length} / {orders.length}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Matching current filters</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Filtered Revenue Volume</span>
                    <h4 className="text-xl font-mono font-bold text-emerald-600 mt-1">KES {totalFilteredValue.toLocaleString()}</h4>
                    <p className="text-[10px] text-slate-400 mt-0.5">Sum of visible rows</p>
                  </div>

                  <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Receipt Status Breakdown</span>
                    <h4 className="text-sm font-bold text-slate-900 mt-1">
                      <span className="text-emerald-600">{paidFilteredCount} Paid</span>
                      <span className="text-slate-400 mx-2">|</span>
                      <span className="text-amber-500">{pendingFilteredCount} Pending</span>
                    </h4>
                    <p className="text-[10px] text-slate-400 mt-1">Across matched checkouts</p>
                  </div>
                </div>

                {/* Filters & Control Toolbar */}
                <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                  {/* Search filter */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Granular Search Query</label>
                    <div className="relative">
                      <input 
                        type="text" 
                        value={reportSearch}
                        onChange={(e) => setReportSearch(e.target.value)}
                        placeholder="Search Name, Phone, ID or Part..."
                        className="w-full text-xs bg-white border border-slate-200 rounded-lg pl-3 pr-8 py-2 text-slate-800 focus:outline-none focus:border-slate-400"
                      />
                      {reportSearch && (
                        <button 
                          onClick={() => setReportSearch('')}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs font-bold"
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Order Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Order Dispatch Status</label>
                    <select
                      value={reportStatusFilter}
                      onChange={(e) => setReportStatusFilter(e.target.value as any)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-2 text-slate-800 focus:outline-none"
                    >
                      <option value="all">Show All Dispatches</option>
                      <option value="pending">Pending Processing</option>
                      <option value="processing">Processing In-progress</option>
                      <option value="shipped">Shipped / Dispatched</option>
                      <option value="completed">Completed / Handed over</option>
                    </select>
                  </div>

                  {/* Payment Status */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Payment Settlement</label>
                    <select
                      value={reportPaymentFilter}
                      onChange={(e) => setReportPaymentFilter(e.target.value as any)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-2 text-slate-800 focus:outline-none"
                    >
                      <option value="all">Show All Payments</option>
                      <option value="paid">Settled / Paid</option>
                      <option value="pending">Unpaid / Pending</option>
                    </select>
                  </div>

                  {/* Sorting criteria */}
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Sort Sequence</label>
                    <select
                      value={reportSortBy}
                      onChange={(e) => setReportSortBy(e.target.value as any)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-2 py-2 text-slate-800 focus:outline-none"
                    >
                      <option value="date-new">Timestamp (Newest first)</option>
                      <option value="date-old">Timestamp (Oldest first)</option>
                      <option value="total-high">Total Cost (Highest first)</option>
                      <option value="total-low">Total Cost (Lowest first)</option>
                    </select>
                  </div>
                </div>

                {/* Output Data Table */}
                {displayOrders.length === 0 ? (
                  <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
                    <ShoppingBag className="w-12 h-12 mx-auto text-slate-300 mb-2" />
                    <p className="text-xs font-bold">No order records matched your filter settings.</p>
                    <p className="text-[10px] mt-1">Try modifying your search text or clearing the status select dropdowns.</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                    <table className="w-full text-left text-xs border-collapse font-sans">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                          <th className="p-3">Order Details</th>
                          <th className="p-3">Buyer / Shipping Profile</th>
                          <th className="p-3">Items Purchased</th>
                          <th className="p-3">Financial Settlement</th>
                          <th className="p-3">Dispatch Status</th>
                          <th className="p-3 text-right">Ledger Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {displayOrders.map(o => (
                          <tr key={o.id} className="hover:bg-slate-50/50">
                            {/* Order ID & Timestamp */}
                            <td className="p-3">
                              <p className="font-mono font-black text-slate-900">{o.id}</p>
                              <p className="text-[10px] text-slate-500 mt-1 font-mono">
                                {new Date(o.createdAt).toLocaleDateString()}
                              </p>
                              <p className="text-[9px] text-slate-400 font-mono">
                                {new Date(o.createdAt).toLocaleTimeString()}
                              </p>
                            </td>

                            {/* Customer Profile info */}
                            <td className="p-3">
                              <p className="font-bold text-slate-900">{o.customerName}</p>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{o.customerPhone}</p>
                              {o.customerEmail && <p className="text-[10px] text-slate-400">{o.customerEmail}</p>}
                              <p className="text-[10px] text-slate-500 max-w-xs mt-1 leading-relaxed truncate" title={o.address}>
                                {o.address}
                              </p>
                            </td>

                            {/* Ordered Items list */}
                            <td className="p-3">
                              <div className="space-y-1.5">
                                {o.items.map((item, index) => (
                                  <div key={index} className="text-[11px] text-slate-700 flex items-start gap-1">
                                    <span className="font-bold font-mono text-slate-500 bg-slate-100 px-1 py-0.5 rounded text-[9px] shrink-0">
                                      x{item.quantity}
                                    </span>
                                    <div className="min-w-0">
                                      <p className="font-medium truncate max-w-[200px]" title={item.name}>{item.name}</p>
                                      <p className="text-[9px] text-slate-400 font-mono">@ KES {item.price.toLocaleString()}</p>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </td>

                            {/* Pricing total & Payment Status */}
                            <td className="p-3">
                              <p className="font-mono font-bold text-sm text-slate-900">KES {o.total.toLocaleString()}</p>
                              <div className="flex flex-col gap-1 mt-1">
                                <span className="text-[9px] text-slate-500 uppercase tracking-wider font-semibold font-mono">
                                  Method: {o.paymentMethod.toUpperCase()}
                                </span>
                                <div>
                                  <span className={`inline-block text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${
                                    o.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                    {o.paymentStatus}
                                  </span>
                                </div>
                              </div>
                            </td>

                            {/* Dispatch status column */}
                            <td className="p-3">
                              <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-lg uppercase tracking-wide ${
                                o.status === 'completed' ? 'bg-emerald-100 text-emerald-800' :
                                o.status === 'shipped' ? 'bg-sky-100 text-sky-800' :
                                o.status === 'processing' ? 'bg-purple-100 text-purple-800' :
                                'bg-amber-100 text-amber-800'
                              }`}>
                                {o.status}
                              </span>
                            </td>

                            {/* Direct Action Shortcuts inside Report */}
                            <td className="p-3 text-right space-y-1">
                              <div className="flex flex-col gap-1 items-end">
                                {o.paymentStatus === 'pending' && (
                                  <button 
                                    onClick={() => handleUpdateOrder(o.id, { paymentStatus: 'paid' })}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] font-bold px-2 py-1 rounded transition-colors w-24 text-center cursor-pointer"
                                  >
                                    Set as Paid
                                  </button>
                                )}
                                {o.status === 'pending' && (
                                  <button 
                                    onClick={() => handleUpdateOrder(o.id, { status: 'processing' })}
                                    className="bg-purple-600 hover:bg-purple-700 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors w-24 text-center cursor-pointer"
                                  >
                                    Set Processing
                                  </button>
                                )}
                                {o.status === 'processing' && (
                                  <button 
                                    onClick={() => handleUpdateOrder(o.id, { status: 'shipped' })}
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors w-24 text-center cursor-pointer"
                                  >
                                    Ship Package
                                  </button>
                                )}
                                {o.status === 'shipped' && (
                                  <button 
                                    onClick={() => handleUpdateOrder(o.id, { status: 'completed' })}
                                    className="bg-slate-900 hover:bg-slate-950 text-white px-2 py-1 rounded text-[10px] font-bold transition-colors w-24 text-center cursor-pointer"
                                  >
                                    Set Complete
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

              </div>
            );
          })()}

          {/* ==================================== */}
          {/* PRODUCTS CMS TAB */}
          {/* ==================================== */}
          {activeTab === 'products' && (
            <div className="space-y-8" id="products-tab-content">
              
              {/* Form to add/edit a catalog item */}
              <form onSubmit={handleAddProductSubmit} className="bg-slate-50 border border-slate-100 p-5 rounded-2xl space-y-4">
                <div className="flex gap-2 items-center border-b border-slate-200 pb-2 mb-2">
                  {editingProduct ? <Edit className="w-5 h-5 text-amber-500" /> : <Plus className="w-5 h-5 text-amber-500" />}
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">
                    {editingProduct ? `Edit Catalog Item: ${editingProduct.name}` : 'Catalog New Product / Replacement Spare Part'}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Product Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Samsung Backlight Strip 32'" 
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Product Category *</label>
                    <select 
                      value={newProdCat}
                      onChange={(e) => setNewProdCat(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800"
                    >
                      <option value="CCTV">CCTV</option>
                      <option value="TV">TV</option>
                      <option value="Solar">Solar</option>
                      <option value="Air Condition">Air Condition</option>
                      <option value="Fridge">Fridge</option>
                      <option value="Phone">Phone</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Tags (comma separated)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. tv repair, led strip, genuine" 
                      value={newProdTags}
                      onChange={(e) => setNewProdTags(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Price (KES) *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 3500" 
                      value={newProdPrice}
                      onChange={(e) => setNewProdPrice(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Original Price (optional KES)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 4500" 
                      value={newProdOrigPrice}
                      onChange={(e) => setNewProdOrigPrice(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Units Stock *</label>
                    <input 
                      type="number" 
                      required
                      placeholder="e.g. 15" 
                      value={newProdStock}
                      onChange={(e) => setNewProdStock(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Image Link (URL)</label>
                    <input 
                      type="text" 
                      placeholder="https://..." 
                      value={newProdImage}
                      onChange={(e) => setNewProdImage(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Detailed Product Description</label>
                  <textarea 
                    rows={3}
                    placeholder="Enter detailed specification notes, hardware compatibility rules, or bundle items included..." 
                    value={newProdDesc}
                    onChange={(e) => setNewProdDesc(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none"
                  />
                </div>

                <div className="flex gap-2">
                  <button 
                    type="submit" 
                    className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                  >
                    {editingProduct ? 'Save Product Changes' : 'Confirm and Add to Inventory Catalog'}
                  </button>
                  {editingProduct && (
                    <button
                      type="button"
                      onClick={() => {
                        setEditingProduct(null);
                        setNewProdName('');
                        setNewProdDesc('');
                        setNewProdCat('CCTV');
                        setNewProdPrice('');
                        setNewProdOrigPrice('');
                        setNewProdStock('');
                        setNewProdImage('');
                        setNewProdTags('');
                      }}
                      className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-4 py-2.5 rounded-lg transition-colors"
                    >
                      Cancel Edit
                    </button>
                  )}
                </div>
              </form>

              {/* Active inventory items list */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Active Catalog Products</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {products.map(p => (
                    <div key={p.id} className="bg-white border border-slate-100 rounded-xl p-4 flex gap-4 items-center shadow-sm">
                      <img 
                        src={p.image} 
                        alt={p.name} 
                        className="w-16 h-16 object-cover rounded-lg bg-slate-100" 
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                          {p.category}
                        </span>
                        <h5 className="text-xs font-bold text-slate-900 truncate mt-1">{p.name}</h5>
                        <p className="text-[11px] font-mono text-slate-500 mt-0.5">
                          KES {p.price.toLocaleString()} 
                          {p.originalPrice && <span className="line-through text-slate-300 ml-1">KES {p.originalPrice.toLocaleString()}</span>}
                        </p>
                        <p className={`text-[10px] font-bold mt-1 ${p.stock < 5 ? 'text-rose-600' : 'text-slate-500'}`}>
                          In Stock: {p.stock} units
                        </p>
                      </div>
                      <div className="flex gap-1">
                        <button 
                          type="button"
                          onClick={() => {
                            setEditingProduct(p);
                            setNewProdName(p.name);
                            setNewProdDesc(p.description);
                            setNewProdCat(p.category);
                            setNewProdPrice(p.price.toString());
                            setNewProdOrigPrice(p.originalPrice ? p.originalPrice.toString() : '');
                            setNewProdStock(p.stock.toString());
                            setNewProdImage(p.image);
                            setNewProdTags(p.tags.join(', '));
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          className="text-amber-600 hover:bg-amber-50 p-2 rounded-full transition-colors shrink-0"
                          title="Edit Catalog Item"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteProduct(p.id)}
                          className="text-rose-600 hover:bg-rose-50 p-2 rounded-full transition-colors shrink-0"
                          title="Delete Catalog Item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ==================================== */}
          {/* CUSTOMER INBOX TAB */}
          {/* ==================================== */}
          {activeTab === 'inbox' && (
            <div className="space-y-4" id="inbox-tab-content">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-2">Customer General Messages</h3>

              {messages.length === 0 ? (
                <div className="h-64 flex flex-col items-center justify-center text-slate-400">
                  <Mail className="w-12 h-12 mb-2" />
                  <p className="text-sm font-medium">Your contact inbox is currently empty.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`border rounded-2xl p-5 shadow-sm transition-all ${
                        msg.status === 'unread' ? 'border-amber-300 bg-amber-50/20' : 'border-slate-100 bg-white'
                      }`}
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 border-b border-slate-100 pb-3 mb-3">
                        <div>
                          <div className="flex gap-2 items-center">
                            <h4 className="text-xs font-bold text-slate-900">{msg.name}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
                              msg.status === 'unread' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
                            }`}>
                              {msg.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-slate-500 font-mono mt-1">
                            <span>Phone: {msg.phone}</span>
                            {msg.email && <span>Email: {msg.email}</span>}
                          </div>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">{new Date(msg.createdAt).toLocaleString()}</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-800">Subject: {msg.subject}</p>
                        <p className="text-xs text-slate-600 leading-relaxed italic">"{msg.message}"</p>
                      </div>

                      <div className="flex justify-end gap-2 mt-4">
                        <button
                          onClick={() => handleToggleMessage(msg.id, msg.status)}
                          className="text-xs font-semibold px-3 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors"
                        >
                          Mark as {msg.status === 'unread' ? 'Read' : 'Unread'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ==================================== */}
          {/* PHOTOS & MEDIA CMS TAB */}
          {/* ==================================== */}
          {activeTab === 'photos' && (
            <div id="photos-tab-content" className="space-y-6">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Website Photo & Media Gallery CMS</h3>
                  <p className="text-xs text-slate-500 mt-1">Directly manage physical photo files on your website server. Copy public links or inject them through code.</p>
                </div>
                <div className="text-[11px] font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded">
                  {photos.length} Total Registered Photos
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Upload Form */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm h-fit">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    {editingPhoto ? <Edit className="w-4 h-4 text-amber-500" /> : <UploadCloud className="w-4 h-4 text-emerald-500" />}
                    {editingPhoto ? `Edit Photo: ${editingPhoto.title}` : 'Upload / Register New Photo'}
                  </h4>

                  <form onSubmit={handleAddPhotoSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Photo Title *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. CCTV Camera Installation at Office"
                        value={newPhotoTitle}
                        onChange={(e) => setNewPhotoTitle(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Description / Caption</label>
                      <textarea 
                        rows={2}
                        placeholder="e.g. Completed a 16-channel IP camera deployment with high definition night vision..."
                        value={newPhotoDesc}
                        onChange={(e) => setNewPhotoDesc(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white animate-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Display Category *</label>
                      <select 
                        value={newPhotoCat}
                        onChange={(e) => setNewPhotoCat(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      >
                        <option value="CCTV">CCTV</option>
                        <option value="TV">TV</option>
                        <option value="Solar">Solar</option>
                        <option value="Air Condition">Air Condition</option>
                        <option value="Fridge">Fridge</option>
                        <option value="Phone">Phone</option>
                      </select>
                    </div>

                    {/* Method Toggle: File Upload vs URL */}
                    <div className="border-t border-slate-100 pt-3 space-y-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Select Source Method</span>
                      
                      <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-lg">
                        <button
                          type="button"
                          onClick={() => { setNewPhotoUrl(''); setNewPhotoFile(null); setNewPhotoBase64(''); }}
                          className={`text-[10px] py-1.5 rounded font-bold transition-all ${!newPhotoUrl ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                        >
                          Server Upload (Local File)
                        </button>
                        <button
                          type="button"
                          onClick={() => { setNewPhotoFile(null); setNewPhotoBase64(''); setNewPhotoUrl('https://'); }}
                          className={`text-[10px] py-1.5 rounded font-bold transition-all ${newPhotoUrl ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500'}`}
                        >
                          Web URL link
                        </button>
                      </div>

                      {!newPhotoUrl ? (
                        /* File Upload Field */
                        <div className="space-y-2">
                          <div className="border-2 border-dashed border-slate-200 rounded-xl p-4 text-center hover:bg-slate-50 transition-colors cursor-pointer relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleFileChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                            <div className="flex flex-col items-center justify-center gap-1">
                              <Camera className="w-5 h-5 text-slate-400" />
                              <span className="text-xs font-bold text-slate-700">
                                {newPhotoFile ? newPhotoFile.name : "Choose an image file"}
                              </span>
                              <span className="text-[9px] text-slate-400">
                                {newPhotoFile ? `${(newPhotoFile.size / 1024 / 1024).toFixed(2)} MB` : "PNG, JPG, WEBP, GIF (Max 10MB)"}
                              </span>
                            </div>
                          </div>
                          {newPhotoBase64 && (
                            <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                              <img src={newPhotoBase64} alt="Upload Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              <button
                                type="button"
                                onClick={() => { setNewPhotoFile(null); setNewPhotoBase64(''); }}
                                className="absolute top-1.5 right-1.5 bg-red-500 hover:bg-red-600 text-white p-1 rounded-full shadow transition-colors"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>
                      ) : (
                        /* Web Image URL Field */
                        <div className="space-y-2">
                          <input 
                            type="text" 
                            required
                            placeholder="https://images.unsplash.com/photo-..."
                            value={newPhotoUrl}
                            onChange={(e) => setNewPhotoUrl(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                          />
                          {newPhotoUrl && newPhotoUrl.startsWith('http') && (
                            <div className="relative rounded-lg overflow-hidden border border-slate-200 aspect-video bg-slate-50">
                              <img src={newPhotoUrl} alt="URL Preview" className="w-full h-full object-cover" onError={(e) => { (e.target as any).src = 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?auto=format&fit=crop&q=80&w=800'; }} referrerPolicy="no-referrer" />
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        type="submit"
                        disabled={uploadProgress}
                        className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        {uploadProgress ? (
                          <>
                            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            Saving changes...
                          </>
                        ) : (
                          <>
                            {editingPhoto ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                            {editingPhoto ? 'Save Photo Changes' : 'Upload & Publish Photo'}
                          </>
                        )}
                      </button>

                      {editingPhoto && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingPhoto(null);
                            setNewPhotoTitle('');
                            setNewPhotoDesc('');
                            setNewPhotoCat('CCTV');
                            setNewPhotoUrl('');
                            setNewPhotoFile(null);
                            setNewPhotoBase64('');
                          }}
                          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 2. Photo Gallery Grid */}
                <div className="lg:col-span-2 space-y-4">
                  <div className="flex justify-between items-center">
                    <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                      <Image className="w-4 h-4 text-emerald-500" />
                      Active Media Catalog
                    </h4>
                  </div>

                  {photos.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
                      <Camera className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-xs font-bold">No custom media photos registered yet.</p>
                      <p className="text-[10px] mt-1">Upload files or register URLs using the left column.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {photos.map(photo => (
                        <div key={photo.id} className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-sm flex flex-col group">
                          {/* Photo display */}
                          <div className="relative aspect-video bg-slate-50 overflow-hidden border-b border-slate-100">
                            <img 
                              src={photo.url} 
                              alt={photo.title} 
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-2 left-2">
                              <span className="bg-slate-900/90 text-amber-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800/50 backdrop-blur-sm">
                                {photo.category}
                              </span>
                            </div>
                          </div>

                          {/* Info section */}
                          <div className="p-3.5 flex-1 flex flex-col justify-between">
                            <div className="space-y-1">
                              <h5 className="text-xs font-bold text-slate-800 line-clamp-1">{photo.title}</h5>
                              <p className="text-[11px] text-slate-500 line-clamp-2 min-h-[32px]">
                                {photo.description || 'No custom description provided.'}
                              </p>
                              <div className="text-[10px] text-slate-400 font-mono pt-1">
                                Registered: {new Date(photo.uploadedAt).toLocaleDateString()}
                              </div>
                            </div>

                            {/* CMS Action Buttons */}
                            <div className="flex gap-2 mt-3.5 pt-3.5 border-t border-slate-100">
                              <button
                                type="button"
                                onClick={() => {
                                  const fullUrl = photo.url.startsWith('/') ? window.location.origin + photo.url : photo.url;
                                  navigator.clipboard.writeText(fullUrl);
                                  alert('Public photo URL copied to clipboard!');
                                }}
                                className="flex-1 flex items-center justify-center gap-1 bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] font-bold py-1.5 px-2 rounded-lg border border-slate-200 transition-colors"
                              >
                                <Copy className="w-3 h-3 text-slate-500" />
                                Copy Link
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingPhoto(photo);
                                  setNewPhotoTitle(photo.title);
                                  setNewPhotoDesc(photo.description);
                                  setNewPhotoCat(photo.category);
                                  setNewPhotoUrl(photo.url.startsWith('http') ? photo.url : '');
                                  window.scrollTo({ top: 0, behavior: 'smooth' });
                                }}
                                className="flex items-center justify-center bg-amber-50 hover:bg-amber-100 text-amber-700 p-1.5 rounded-lg border border-amber-100 transition-colors"
                                title="Edit Photo"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeletePhoto(photo.id)}
                                className="flex items-center justify-center bg-red-50 hover:bg-red-100 text-red-600 p-1.5 rounded-lg border border-red-100 transition-colors"
                                title="Delete Photo"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* SETTINGS CMS TAB */}
          {/* ==================================== */}
          {activeTab === 'settings' && settings && (
            <div id="settings-tab-content">
              <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl">
                <div className="border-b border-slate-100 pb-3">
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Business Settings & SEO Optimization</h3>
                  <p className="text-xs text-slate-500 mt-1">Adjust contact cards, MPesa till setups, and public search description snippets.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Store Public Name</label>
                    <input 
                      type="text" 
                      value={setShopName}
                      onChange={(e) => setSetShopName(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Phone Contact Number</label>
                    <input 
                      type="text" 
                      value={setPhone}
                      onChange={(e) => setSetPhone(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Business Email Address</label>
                    <input 
                      type="email" 
                      value={setEmail}
                      onChange={(e) => setSetEmail(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Safaricom MPesa Till/Shortcode</label>
                    <input 
                      type="text" 
                      value={setTillNumber}
                      onChange={(e) => setSetTillNumber(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Physical Location Address</label>
                  <input 
                    type="text" 
                    value={setLocation}
                    onChange={(e) => setSetLocation(e.target.value)}
                    className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                  />
                </div>

                <div className="border-t border-slate-100 pt-4 space-y-4">
                  <span className="text-[11px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Google SEO Meta Tags Settings</span>
                  
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Homepage Meta Title</label>
                    <input 
                      type="text" 
                      value={setSeoTitle}
                      onChange={(e) => setSetSeoTitle(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Homepage Meta Description</label>
                    <textarea 
                      rows={3}
                      value={setSeoDesc}
                      onChange={(e) => setSetSeoDesc(e.target.value)}
                      className="w-full text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none animate-none"
                    />
                  </div>
                </div>

                <button 
                  type="submit"
                  className="bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs px-6 py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Save Settings Securely
                </button>
              </form>
            </div>
          )}

          {/* ==================================== */}
          {/* AUDIT LOG LEDGER TAB */}
          {/* ==================================== */}
          {activeTab === 'audit' && (
            <div className="space-y-4" id="audit-tab-content">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">System Security Audit Trail</h3>
                <span className="text-[10px] bg-slate-950 text-amber-500 font-mono font-bold px-2.5 py-1 rounded border border-slate-800">OWASP Compliant Logger</span>
              </div>

              <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100 text-slate-500 font-bold uppercase tracking-wider">
                      <th className="p-3">Log timestamp</th>
                      <th className="p-3">Security Action</th>
                      <th className="p-3">Audit Details</th>
                      <th className="p-3">Triggered by</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-mono text-[11px] text-slate-600">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3 whitespace-nowrap text-slate-400">
                          {new Date(log.timestamp).toLocaleString()}
                        </td>
                        <td className="p-3">
                          <span className="bg-slate-900 text-amber-500 font-bold px-2 py-0.5 rounded text-[10px] uppercase tracking-wide">
                            {log.action}
                          </span>
                        </td>
                        <td className="p-3 text-slate-800 font-semibold">{log.details}</td>
                        <td className="p-3 font-semibold text-slate-900">{log.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ==================================== */}
          {/* BLOGS CMS TAB */}
          {/* ==================================== */}
          {activeTab === 'blogs' && (
            <div className="space-y-8" id="blogs-tab-content">
              <div className="border-b border-slate-100 pb-3 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Website Blog & Articles CMS</h3>
                  <p className="text-xs text-slate-500 mt-1">Publish informative articles, technical guides, or CCTV project announcements.</p>
                </div>
                <div className="text-[11px] font-bold text-slate-500 font-mono bg-slate-100 px-2.5 py-1 rounded">
                  {blogs.length} Total Articles
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 1. Add / Edit Blog Form */}
                <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm h-fit">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
                    {editingBlog ? <Edit className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-emerald-500" />}
                    {editingBlog ? `Edit Post: ${editingBlog.title}` : 'Publish New Article'}
                  </h4>

                  <form onSubmit={handleAddBlogSubmit} className="space-y-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Article Title *</label>
                      <input 
                        type="text" 
                        required
                        placeholder="e.g. Benefits of IP vs Analog CCTV"
                        value={newBlogTitle}
                        onChange={(e) => setNewBlogTitle(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Category *</label>
                      <select 
                        value={newBlogCat}
                        onChange={(e) => setNewBlogCat(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      >
                        <option value="CCTV">CCTV</option>
                        <option value="TV Repair">TV Repair</option>
                        <option value="Solar Installations">Solar Installations</option>
                        <option value="Electronics News">Electronics News</option>
                        <option value="Smart Home">Smart Home</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Cover Image Link (URL)</label>
                      <input 
                        type="text" 
                        placeholder="https://images.unsplash.com/photo-..."
                        value={newBlogImage}
                        onChange={(e) => setNewBlogImage(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Excerpt / Brief Summary</label>
                      <input 
                        type="text" 
                        placeholder="Brief 1-sentence teaser summarizing the article..."
                        value={newBlogExcerpt}
                        onChange={(e) => setNewBlogExcerpt(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Article Body Content *</label>
                      <textarea 
                        rows={10}
                        required
                        placeholder="Write your article body content here (Supports text / descriptive blocks)..."
                        value={newBlogContent}
                        onChange={(e) => setNewBlogContent(e.target.value)}
                        className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 focus:outline-none focus:bg-white font-sans"
                      />
                    </div>

                    <div className="flex flex-col gap-2">
                      <button 
                        type="submit"
                        className="w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2 shadow"
                      >
                        {editingBlog ? <Edit className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                        {editingBlog ? 'Save Article Changes' : 'Publish Article'}
                      </button>

                      {editingBlog && (
                        <button
                          type="button"
                          onClick={() => {
                            setEditingBlog(null);
                            setNewBlogTitle('');
                            setNewBlogContent('');
                            setNewBlogCat('CCTV');
                            setNewBlogImage('');
                            setNewBlogExcerpt('');
                          }}
                          className="w-full bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>
                  </form>
                </div>

                {/* 2. Active Blogs List */}
                <div className="lg:col-span-2 space-y-4">
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-500" />
                    Published Articles
                  </h4>

                  {blogs.length === 0 ? (
                    <div className="bg-white border border-slate-100 rounded-2xl p-12 text-center text-slate-400">
                      <FileText className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-xs font-bold">No blog posts published yet.</p>
                      <p className="text-[10px] mt-1">Create your first article using the left column form.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {blogs.map(post => (
                        <div key={post.id} className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row gap-4 items-start md:items-center">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full md:w-24 h-24 object-cover rounded-xl bg-slate-100" 
                            referrerPolicy="no-referrer"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-[9px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-bold uppercase tracking-wide">
                              {post.category}
                            </span>
                            <h5 className="text-xs font-bold text-slate-900 mt-1">{post.title}</h5>
                            <p className="text-[11px] text-slate-500 line-clamp-2 mt-1">{post.excerpt}</p>
                            <div className="text-[10px] text-slate-400 font-mono mt-1">
                              Published: {new Date(post.publishedAt || '').toLocaleDateString()}
                            </div>
                          </div>
                          <div className="flex gap-2 self-end md:self-center shrink-0">
                            <button
                              type="button"
                              onClick={() => {
                                setEditingBlog(post);
                                setNewBlogTitle(post.title);
                                setNewBlogContent(post.content);
                                setNewBlogCat(post.category);
                                setNewBlogImage(post.image);
                                setNewBlogExcerpt(post.excerpt);
                                window.scrollTo({ top: 0, behavior: 'smooth' });
                              }}
                              className="text-amber-600 hover:bg-amber-50 p-2 border border-slate-100 rounded-full transition-colors"
                              title="Edit Article"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteBlog(post.id)}
                              className="text-rose-600 hover:bg-rose-50 p-2 border border-slate-100 rounded-full transition-colors"
                              title="Delete Article"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
