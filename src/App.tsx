/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, Tv, Sun, Gauge, Smartphone, Wind, Phone, 
  Mail, MapPin, Calendar, Clock, ShoppingCart, ArrowRight, 
  Star, ChevronDown, Check, Sparkles, Filter, Search, ArrowUpDown, HelpCircle,
  RefreshCw, X, Camera
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import AdminDashboard from './components/AdminDashboard';
import { Product, Service, Booking, StoreSettings, FAQ, BlogPost, Testimonial, MediaPhoto } from './types';

export default function App() {
  // Navigation & View Router
  const [activeView, setActiveView] = useState<string>('home');
  const [loading, setLoading] = useState<boolean>(true);
  
  // Data State from backend APIs
  const [settings, setSettings] = useState<StoreSettings>({
    shopName: 'SmartTech Electronics',
    phone: '0708776967',
    email: 'gathonimash@gmail.com',
    location: 'Nairobi, Kenya',
    mpesaTillNumber: '4087769',
    seoTitle: 'SmartTech Electronics | Premium CCTV, Solar, & Electronics Repairs Nairobi',
    seoDescription: 'SmartTech Electronics offers premium, affordable CCTV camera installations, home/commercial solar panels & inverters, Smart LED TV backlight repairs, fridge/AC servicing, and certified electrical audits. Visit us or call 0708776967.',
    welcomeMessage: 'Welcome to SmartTech Electronics! Your trusted local expert in high-fidelity CCTV surveillance, eco-friendly solar setups, and premium appliance repairs.'
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [photos, setPhotos] = useState<MediaPhoto[]>([]);
  const [selectedCCTVPhoto, setSelectedCCTVPhoto] = useState<MediaPhoto | null>(null);
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [heroImageAlignment, setHeroImageAlignment] = useState<'left' | 'right'>('right');
  const [countdown, setCountdown] = useState({ hours: 4, minutes: 34, seconds: 12 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          return { hours: 4, minutes: 34, seconds: 12 }; // Loop back
        }
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Shopping Cart State
  const [cart, setCart] = useState<{ product: Product; quantity: number }[]>(() => {
    const saved = localStorage.getItem('smarttech_cart');
    return saved ? JSON.parse(saved) : [];
  });

  // Admin Session State
  const [adminToken, setAdminToken] = useState<string | null>(() => {
    return localStorage.getItem('smarttech_admin_token');
  });
  const [isAdminSecretUnlocked, setIsAdminSecretUnlocked] = useState<boolean>(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasSecretParam = params.get('portal') === 'gathoni_admin' || params.get('admin') === 'true' || (typeof window !== 'undefined' && window.location.hash === '#admin-portal');
    if (hasSecretParam) {
      localStorage.setItem('smarttech_admin_portal_unlocked', 'true');
      return true;
    }
    return localStorage.getItem('smarttech_admin_portal_unlocked') === 'true';
  });
  const [loginOpen, setLoginOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Shop Filters & Controls
  const [shopCategory, setShopCategory] = useState<string>('All');
  const [shopSearch, setShopSearch] = useState<string>('');
  const [shopSort, setShopSort] = useState<string>('rating');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Services Filters & Controls
  const [servicesSearch, setServicesSearch] = useState<string>('');
  const [servicesSort, setServicesSort] = useState<string>('default');
  const [selectedCompareIds, setSelectedCompareIds] = useState<string[]>([]);
  const [comparisonModalOpen, setComparisonModalOpen] = useState<boolean>(false);
  const [cartOpen, setCartOpen] = useState<boolean>(false);

  // Repair Booking Form State
  const [bookingServiceId, setBookingServiceId] = useState<string>('serv-cctv');
  const [bookingName, setBookingName] = useState<string>('');
  const [bookingEmail, setBookingEmail] = useState<string>('');
  const [bookingPhone, setBookingPhone] = useState<string>('');
  const [bookingDate, setBookingDate] = useState<string>('');
  const [bookingTime, setBookingTime] = useState<string>('09:00 AM');
  const [bookingAddress, setBookingAddress] = useState<string>('');
  const [bookingNotes, setBookingNotes] = useState<string>('');
  const [isSubmittingBooking, setIsSubmittingBooking] = useState<boolean>(false);
  const [bookingSuccessCard, setBookingSuccessCard] = useState<any>(null);

  // Checkout Success State
  const [checkoutSuccessOrder, setCheckoutSuccessOrder] = useState<any>(null);

  // Collapsible accordion FAQ states
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  // Helper to extract numeric starting price from priceRange
  const getServiceStartingPrice = (s: Service): number => {
    if (!s.priceRange) return 0;
    const parts = s.priceRange.split('-');
    const firstPart = parts[0] || '';
    const digits = firstPart.replace(/[^0-9]/g, '');
    const parsed = parseInt(digits, 10);
    return isNaN(parsed) ? 0 : parsed;
  };

  // Message Contact form state
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactSubject, setContactSubject] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactStatus, setContactStatus] = useState<string | null>(null);

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('smarttech_cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch initial store catalog data
  const loadStoreData = async () => {
    try {
      const [rSettings, rProducts, rServices, rBlogs, rFaqs, rTestimonials, rPhotos] = await Promise.all([
        fetch('/api/v1/settings').then(r => r.json()),
        fetch('/api/v1/products').then(r => r.json()),
        fetch('/api/v1/services').then(r => r.json()),
        fetch('/api/v1/blogs').then(r => r.json()),
        fetch('/api/v1/faqs').then(r => r.json()),
        fetch('/api/v1/testimonials').then(r => r.json()),
        fetch('/api/v1/media').then(r => r.json())
      ]);

      if (rSettings) setSettings(rSettings);
      if (rProducts) setProducts(rProducts);
      if (rServices) setServices(rServices);
      if (rBlogs) setBlogs(rBlogs);
      if (rFaqs) setFaqs(rFaqs);
      if (rTestimonials) setTestimonials(rTestimonials);
      if (rPhotos) setPhotos(rPhotos);
    } catch (err) {
      console.error('Failed to load initial server resources:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStoreData();
  }, []);

  // Listen for the secret query parameter or hash to unlock and activate the administrative portal
  useEffect(() => {
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const hasSecretParam = params.get('portal') === 'gathoni_admin' || params.get('admin') === 'true' || (typeof window !== 'undefined' && window.location.hash === '#admin-portal');
    if (hasSecretParam) {
      setIsAdminSecretUnlocked(true);
      localStorage.setItem('smarttech_admin_portal_unlocked', 'true');
      setActiveView('admin');
      if (!adminToken) {
        setLoginOpen(true);
      }
    }
  }, [adminToken]);

  // Auto-play the media showcase slideshow every 5 seconds
  useEffect(() => {
    if (!photos || photos.length <= 1) return;
    const interval = setInterval(() => {
      setActivePhotoIdx(prev => (prev + 1) % photos.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [photos]);

  // Sync shop list with search queries and category choices
  const syncProductsFiltered = async () => {
    try {
      let url = `/api/v1/products?sort=${shopSort}`;
      if (shopCategory !== 'All') url += `&category=${encodeURIComponent(shopCategory)}`;
      if (shopSearch) url += `&search=${encodeURIComponent(shopSearch)}`;
      
      const res = await fetch(url);
      const data = await res.json();
      setProducts(data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    syncProductsFiltered();
  }, [shopCategory, shopSearch, shopSort]);

  // Cart operations
  const addToCart = (product: Product) => {
    if (product.stock === 0) {
      alert('This product is currently out of stock.');
      return;
    }
    setCart(prev => {
      const idx = prev.findIndex(item => item.product.id === product.id);
      if (idx > -1) {
        const updatedQty = Math.min(product.stock, prev[idx].quantity + 1);
        const next = [...prev];
        next[idx] = { ...prev[idx], quantity: updatedQty };
        return next;
      } else {
        return [...prev, { product, quantity: 1 }];
      }
    });
    setCartOpen(true);
  };

  const updateCartQuantity = (id: string, qty: number) => {
    setCart(prev => prev.map(item => 
      item.product.id === id ? { ...item, quantity: Math.min(item.product.stock, qty) } : item
    ));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.product.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Admin auth
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    try {
      const res = await fetch('/api/v1/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        localStorage.setItem('smarttech_admin_token', data.token);
        setAdminToken(data.token);
        setLoginOpen(false);
        setUsername('');
        setPassword('');
        setActiveView('admin');
      } else {
        setLoginError(data.error || 'Invalid credentials.');
      }
    } catch (err) {
      setLoginError('Failed to establish server connection.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('smarttech_admin_token');
    setAdminToken(null);
    setActiveView('home');
  };

  // Repair scheduling booking submit
  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone || !bookingDate || !bookingAddress) {
      alert('Please fill out Name, Phone Number, Appointment Date, and Address.');
      return;
    }

    setIsSubmittingBooking(true);
    setBookingSuccessCard(null);

    const selectedService = services.find(s => s.id === bookingServiceId);
    const serviceName = selectedService ? selectedService.name : 'Custom Electronics Repair';
    
    try {
      const res = await fetch('/api/v1/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceId: bookingServiceId,
          serviceName,
          customerName: bookingName,
          customerEmail: bookingEmail,
          customerPhone: bookingPhone,
          date: bookingDate,
          time: bookingTime,
          address: bookingAddress,
          notes: bookingNotes,
          amount: selectedService ? (bookingServiceId === 'serv-tv' ? 3500 : bookingServiceId === 'serv-fridge' ? 4500 : 8000) : 5000
        })
      });
      
      const data = await res.json();
      if (res.ok) {
        setBookingSuccessCard(data);
        // Clear form
        setBookingName('');
        setBookingEmail('');
        setBookingPhone('');
        setBookingDate('');
        setBookingAddress('');
        setBookingNotes('');
      } else {
        alert(data.error || 'Failed to submit booking.');
      }
    } catch (err) {
      alert('Network failure occurred.');
    } finally {
      setIsSubmittingBooking(false);
    }
  };

  // Cart checkout order submit
  const handleCheckoutOrder = async (details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    paymentMethod: 'mpesa' | 'cash';
    paymentPhone: string;
  }) => {
    const total = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    const items = cart.map(item => ({
      productId: item.product.id,
      name: item.product.name,
      quantity: item.quantity,
      price: item.product.price,
      image: item.product.image
    }));

    const res = await fetch('/api/v1/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        items,
        customerName: details.name,
        customerEmail: details.email,
        customerPhone: details.phone,
        address: details.address,
        notes: details.notes,
        total,
        paymentMethod: details.paymentMethod,
        paymentPhone: details.paymentPhone
      })
    });

    const data = await res.json();
    if (res.ok) {
      setCheckoutSuccessOrder(data);
      clearCart();
    } else {
      alert(data.error || 'Checkout failed.');
    }
  };

  // Contact general message submit
  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName || !contactPhone || !contactMessage) {
      setContactStatus('Please complete Name, Phone and message details.');
      return;
    }

    setContactStatus(null);
    try {
      const res = await fetch('/api/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: contactName,
          email: contactEmail,
          phone: contactPhone,
          subject: contactSubject,
          message: contactMessage
        })
      });
      const data = await res.json();
      if (res.ok) {
        setContactStatus('Message received successfully! We will call you within 15 minutes.');
        setContactName('');
        setContactEmail('');
        setContactPhone('');
        setContactSubject('');
        setContactMessage('');
      } else {
        setContactStatus(data.error || 'Submission failed.');
      }
    } catch (e) {
      setContactStatus('Network failure occurred.');
    }
  };

  // Direct service selection keying helper
  const handleTriggerServiceBook = (id: string) => {
    setBookingServiceId(id);
    setActiveView('booking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Service icon picker helper
  const renderServiceIcon = (iconName: string) => {
    switch (iconName) {
      case 'Shield': return <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'Tv': return <Tv className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'Sun': return <Sun className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'Gauge': return <Gauge className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'Smartphone': return <Smartphone className="w-8 h-8 text-amber-500 shrink-0" />;
      case 'Wind': return <Wind className="w-8 h-8 text-amber-500 shrink-0" />;
      default: return <ShieldCheck className="w-8 h-8 text-amber-500 shrink-0" />;
    }
  };

  // Helper to generate formatted WhatsApp API URLs
  const getWhatsAppUrl = (text: string) => {
    let cleanPhone = settings.phone || '0708776967';
    cleanPhone = cleanPhone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '254' + cleanPhone.slice(1);
    } else if (!cleanPhone.startsWith('254') && cleanPhone.length === 9) {
      cleanPhone = '254' + cleanPhone;
    }
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  };

  // Helper to toggle a service inside the comparison selection
  const handleToggleCompare = (id: string) => {
    if (selectedCompareIds.includes(id)) {
      setSelectedCompareIds(prev => prev.filter(item => item !== id));
    } else {
      if (selectedCompareIds.length >= 2) {
        alert("You can select up to 2 services for side-by-side comparison. Deselect one first to add another.");
        return;
      }
      setSelectedCompareIds(prev => {
        const next = [...prev, id];
        if (next.length === 2) {
          setComparisonModalOpen(true);
        }
        return next;
      });
    }
  };

  // Filter and sort services
  const filteredAndSortedServices = services.filter(s => {
    const query = servicesSearch.toLowerCase().trim();
    if (!query) return true;
    return (
      s.name.toLowerCase().includes(query) ||
      s.description.toLowerCase().includes(query) ||
      s.keyBenefits.some(b => b.toLowerCase().includes(query)) ||
      s.process.some(p => p.toLowerCase().includes(query)) ||
      s.priceRange.toLowerCase().includes(query)
    );
  });

  if (servicesSort === 'price-asc') {
    filteredAndSortedServices.sort((a, b) => getServiceStartingPrice(a) - getServiceStartingPrice(b));
  } else if (servicesSort === 'price-desc') {
    filteredAndSortedServices.sort((a, b) => getServiceStartingPrice(b) - getServiceStartingPrice(a));
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans" id="app-root">
      
      {/* Dynamic Header Component */}
      <Navbar 
        settings={settings}
        activeView={activeView}
        setActiveView={setActiveView}
        cart={cart}
        updateCartQuantity={updateCartQuantity}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        adminToken={adminToken}
        onLogout={handleLogout}
        openLoginModal={() => setLoginOpen(true)}
        onCheckout={handleCheckoutOrder}
        checkoutSuccessOrder={checkoutSuccessOrder}
        setCheckoutSuccessOrder={setCheckoutSuccessOrder}
        cartOpen={cartOpen}
        setCartOpen={setCartOpen}
        shopSearch={shopSearch}
        setShopSearch={setShopSearch}
        isAdminSecretUnlocked={isAdminSecretUnlocked}
      />

      {/* Main Container Views Wrapper */}
      <main className="flex-grow">
        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-10 h-10 animate-spin text-amber-500 mb-2" />
            <p className="text-sm font-semibold uppercase tracking-wider font-mono">Initializing SmartTech Enterprise Workspace...</p>
          </div>
        ) : (
          <>
            {/* ==================================== */}
            {/* HOME VIEW */}
            {/* ==================================== */}
            {activeView === 'home' && (
              <div id="home-view" className="space-y-16 pb-20">
                
                {/* Modern Hero Section */}
                <section className="relative bg-white text-slate-950 py-10 sm:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-grid-pattern-light border-b border-slate-100" id="hero-banner">
                  {/* Subtle radial overlay for grid fading */}
                  <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_30%,#ffffff_90%] opacity-80 pointer-events-none" />
                  
                  {/* Visual ambient abstract bg */}
                  <div className="absolute inset-0 opacity-10 pointer-events-none">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-wine-500 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/3 right-1/4 w-96 h-96 bg-amber-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
                  </div>

                  {/* Main Grid: Split 7/5 on all screens including mobile for side-by-side photo action */}
                  <div className="max-w-7xl mx-auto grid grid-cols-12 gap-3 sm:gap-12 items-center relative z-10">
                    
                    {/* Text and Actions Column */}
                    <div className={`col-span-7 sm:col-span-7 lg:col-span-7 space-y-2.5 sm:space-y-7 ${heroImageAlignment === 'left' ? 'order-last' : 'order-first'}`}>
                      <div className="inline-flex items-center gap-1.5 bg-wine-50 border border-wine-100 rounded-full px-2 py-0.5 sm:px-4 sm:py-1.5 text-[8px] sm:text-[11px] text-wine-700 font-bold tracking-wider uppercase font-mono shadow-xs">
                        <Sparkles className="w-3 h-3 text-wine-600 animate-spin" style={{ animationDuration: '4s' }} />
                        Certified Workshop
                      </div>
                      
                      <h1 className="text-sm xs:text-lg sm:text-4xl lg:text-6xl font-extrabold tracking-tight text-slate-950 leading-tight font-display">
                        Don't Replace It. <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-wine-600 via-wine-700 to-wine-800">
                          Restore It Securely.
                        </span>
                      </h1>
                      
                      <p className="text-[9px] xs:text-[11px] sm:text-base text-slate-600 max-w-xl leading-relaxed">
                        {settings.welcomeMessage} We back our CCTV security packs, monocrystalline solar panels, and smart components with <strong>6-Month warrantied protection</strong>.
                      </p>
                      
                      {/* Call Actions */}
                      <div className="flex flex-col xs:flex-row gap-2 pt-1 sm:pt-4">
                        <button 
                          onClick={() => { setActiveView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-wine-900 hover:bg-wine-850 text-white font-extrabold px-2.5 py-1.5 sm:px-7 sm:py-4 rounded-lg sm:rounded-xl transition-all shadow-md text-[9px] sm:text-sm flex items-center justify-center gap-1 hover:scale-[1.02] cursor-pointer"
                        >
                          Browse Products <ArrowRight className="w-3 h-3 text-amber-500" />
                        </button>
                        <button 
                          onClick={() => { setActiveView('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold px-2.5 py-1.5 sm:px-7 sm:py-4 rounded-lg sm:rounded-xl transition-all border border-slate-200/50 text-[9px] sm:text-sm flex items-center justify-center hover:scale-[1.02] cursor-pointer"
                        >
                          Book Service
                        </button>
                      </div>

                      {/* Phone support callout row */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6 pt-2 sm:pt-6 text-[8px] sm:text-xs text-slate-500 border-t border-slate-100 max-w-lg">
                        <div className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-wine-600 shrink-0" />
                          <span>Call: <a href="tel:0708776967" className="font-bold text-slate-900 underline hover:text-wine-700">0708776967</a></span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-wine-600 shrink-0" />
                          <span className="truncate">{settings.email}</span>
                        </div>
                      </div>
                    </div>

                    {/* Image / Gallery Showcase Column */}
                    <div className={`col-span-5 sm:col-span-5 lg:col-span-5 relative ${heroImageAlignment === 'left' ? 'order-first' : 'order-last'}`} id="hero-media-showcase">
                      <div className="aspect-square bg-slate-950 rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-800 shadow-xl sm:shadow-2xl relative flex flex-col justify-between gradient-glow animate-fade-in group">
                        
                        {/* Title Floating Badge */}
                        <div className="absolute top-2 left-2 sm:top-4 sm:left-4 z-20 bg-wine-900/90 backdrop-blur-xs border border-amber-500/30 text-amber-400 font-black px-1.5 py-0.5 sm:px-3 sm:py-1.5 rounded-md sm:rounded-xl text-[6px] sm:text-[10px] shadow-lg font-mono tracking-wider uppercase">
                          GALLERY
                        </div>

                        {photos && photos.length > 0 ? (
                          <>
                            {/* Slideshow image */}
                            <img 
                              src={photos[activePhotoIdx % photos.length].url} 
                              alt={photos[activePhotoIdx % photos.length].title}
                              className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                              referrerPolicy="no-referrer"
                            />

                            {/* Bottom Dark Gradient Overlay */}
                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-2 sm:p-6 pt-6 sm:pt-16 flex flex-col justify-end z-10">
                              <span className="text-[6px] sm:text-[9px] font-mono font-bold text-amber-500 uppercase tracking-widest">
                                {photos[activePhotoIdx % photos.length].category}
                              </span>
                              <h3 className="text-[8px] sm:text-sm font-bold text-white mt-0.5 leading-tight font-display line-clamp-1">
                                {photos[activePhotoIdx % photos.length].title}
                              </h3>
                              {photos[activePhotoIdx % photos.length].description && (
                                <p className="text-[7px] sm:text-[11px] text-slate-300 mt-0.5 line-clamp-1 sm:line-clamp-2 leading-tight sm:leading-relaxed">
                                  {photos[activePhotoIdx % photos.length].description}
                                </p>
                              )}
                            </div>

                            {/* Slider Navigation Overlays */}
                            {photos.length > 1 && (
                              <div className="absolute inset-y-0 inset-x-1 sm:inset-x-2 flex justify-between items-center z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePhotoIdx(prev => (prev - 1 + photos.length) % photos.length);
                                  }}
                                  className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-slate-950/80 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 hover:text-amber-400 transition-all shadow-md text-[8px] sm:text-xs"
                                >
                                  ←
                                </button>
                                <button 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setActivePhotoIdx(prev => (prev + 1) % photos.length);
                                  }}
                                  className="w-5 h-5 sm:w-8 sm:h-8 rounded-full bg-slate-950/80 border border-slate-800 text-white flex items-center justify-center hover:bg-slate-900 hover:text-amber-400 transition-all shadow-md text-[8px] sm:text-xs"
                                >
                                  →
                                </button>
                              </div>
                            )}

                            {/* Mini indicators */}
                            <div className="absolute top-2 right-2 sm:top-4 sm:right-4 z-20 flex gap-0.5 sm:gap-1 bg-slate-950/60 backdrop-blur-xs px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full border border-slate-800/40">
                              {photos.slice(0, 5).map((_, i) => (
                                <span 
                                  key={i} 
                                  className={`w-1 h-1 rounded-full transition-all ${i === (activePhotoIdx % photos.length) ? 'bg-amber-400 w-2 sm:w-3' : 'bg-slate-500'}`}
                                />
                              ))}
                            </div>
                          </>
                        ) : (
                          <div className="flex-grow flex flex-col justify-center items-center text-center p-2 sm:p-8 space-y-1 sm:space-y-4">
                            <div className="w-8 h-8 sm:w-16 sm:h-16 rounded-full bg-wine-900/40 border border-wine-500/30 flex items-center justify-center mb-1">
                              <ShieldCheck className="w-4 h-4 sm:w-8 sm:h-8 text-amber-400" />
                            </div>
                            <h3 className="text-[10px] sm:text-lg font-bold text-white font-display">SmartTech Certification</h3>
                            <p className="text-[8px] sm:text-xs text-slate-300 max-w-xs leading-relaxed">
                              Configure and upload actual job-site photos from your Administrative CMS Panel.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </section>

                {/* Core Brand Value Props */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      { title: 'CCTV Surveillance Expert', desc: 'Secure offline 2TB DVR setup, dome configurations, and mobile app syncing.' },
                      { title: 'Solar Array Engineers', desc: 'Precise daily household load calculation, inverter coupling, and gel battery wiring.' },
                      { title: 'Fast Same-Day TV Fix', desc: 'Genuine backlight strip replacements, motherboard soldering, and power board swaps.' },
                      { title: 'Fridge & AC Home Service', desc: 'We weld pipeline micro-leaks and refill eco-friendly cooling gases in your home.' }
                    ].map((prop, idx) => (
                      <div key={idx} className="bg-white/80 backdrop-blur-md border border-slate-200/50 hover:border-amber-500/20 p-6 rounded-2xl shadow-xs hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                        <div className="bg-slate-950 text-amber-500 font-bold font-mono w-8 h-8 rounded-xl flex items-center justify-center text-xs mb-4 shadow-sm border border-slate-800/50 group-hover:scale-110 transition-transform">
                          0{idx+1}
                        </div>
                        <h4 className="text-sm font-bold text-slate-950 tracking-tight font-display">{prop.title}</h4>
                        <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{prop.desc}</p>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Services bento grid summary */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Certified Solutions</span>
                    <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-display">Our Precision Hardware Services</h2>
                    <p className="text-xs text-slate-500 max-w-xl mx-auto">We do not believe in temporary bandage repairs. We diagnose electrical root causes, optimize voltages, and utilize genuine spare components.</p>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-8">
                    {services.map((s, idx) => (
                      <motion.div 
                        key={s.id} 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-50px" }}
                        transition={{ duration: 0.5, delay: (idx % 3) * 0.1, ease: "easeOut" }}
                        className="bg-white border border-slate-100/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200/40 hover:-translate-y-1.5 transition-all duration-300 flex flex-col shadow-xs group"
                      >
                        <div className="relative h-32 sm:h-48 bg-slate-50 shrink-0 overflow-hidden">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute bottom-2 left-2 sm:bottom-4 sm:left-4 bg-wine-900/95 backdrop-blur-xs text-white px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg sm:rounded-xl text-[9px] sm:text-[11px] font-mono font-bold border border-wine-800 shadow-sm">
                            {s.priceRange}
                          </div>
                        </div>
                        <div className="p-3 sm:p-6 flex-grow flex flex-col justify-between">
                          <div className="space-y-1.5 sm:space-y-3">
                            <div className="flex gap-1.5 sm:gap-3 items-center">
                              {renderServiceIcon(s.icon)}
                              <h3 className="text-xs sm:text-base font-bold text-slate-950 tracking-tight font-display leading-snug truncate sm:whitespace-normal">{s.name}</h3>
                            </div>
                            <p className="text-[10px] sm:text-xs text-slate-500 leading-relaxed line-clamp-2">{s.description}</p>
                          </div>
                          
                          <div className="pt-3 sm:pt-6 flex flex-col sm:flex-row gap-1.5 sm:gap-3">
                            <button 
                              onClick={() => handleTriggerServiceBook(s.id)}
                              className="bg-wine-900 hover:bg-wine-850 text-white hover:text-amber-300 text-[10px] sm:text-xs font-bold px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all flex-grow shadow-sm hover:shadow-md cursor-pointer text-center"
                            >
                              Book Diagnostic
                            </button>
                            <button 
                              onClick={() => { setActiveView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                              className="bg-slate-50 hover:bg-slate-100 text-slate-700 text-[10px] sm:text-xs font-semibold px-2 sm:px-4 py-2 sm:py-2.5 rounded-lg sm:rounded-xl transition-all border border-slate-200/50 cursor-pointer text-center"
                            >
                              Process
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* About Our SmartTech Electronics Story */}
                <section className="bg-slate-950 text-white py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-900/60 relative overflow-hidden bg-grid-pattern">
                  {/* Subtle radial overlay for grid fading */}
                  <div className="absolute inset-0 bg-radial-[circle_at_center,transparent_40%,#020617_95%] opacity-90" />

                  <div className="max-w-4xl mx-auto space-y-8 text-center relative z-10 flex flex-col items-center justify-center">
                    <div className="space-y-6">
                      <span className="text-[11px] font-bold text-amber-500 uppercase tracking-widest font-mono block">Authenticity & Commitment</span>
                      <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-display">Nairobi's Trusted Hardware Workshop</h2>
                      <div className="text-sm text-slate-300 space-y-4 leading-relaxed font-sans max-w-2xl mx-auto">
                        <p>SmartTech Electronics is designed to address a growing problem: cheap, uncertified technicians using counterfeit replacement components that blow up your expensive televisions, solar setups, or refrigeration circuits within a month.</p>
                        <p>We source our replacement backlights directly from manufacturers featuring thick aluminum plates that disperse heat. Our hybrid solar installers are formal electrical commission certified, guaranteeing that battery terminal lugs are torqued down to standard values to prevent hazardous arcing.</p>
                        <p>We stand by our work. Every television backlight refit and refrigerator compressor relay replacement we execute comes pre-packaged with a **6-Month direct warranty catalog**.</p>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 sm:gap-6 border-t border-slate-900/80 pt-8 max-w-xl mx-auto">
                        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl">
                          <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-500">1,500+</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono font-bold">Restored</p>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl">
                          <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-500">850+</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono font-bold">CCTV Points</p>
                        </div>
                        <div className="bg-slate-900/40 border border-slate-900 p-4 rounded-2xl">
                          <p className="text-2xl sm:text-3xl font-mono font-bold text-amber-500">100%</p>
                          <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-wider font-mono font-bold">Genuine</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Featured Products / Parts Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-slate-100/80 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Shop Parts catalog</span>
                      <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-display mt-1">Featured Spares & CCTV Bundles</h2>
                    </div>
                    <button 
                      onClick={() => setActiveView('shop')}
                      className="text-xs font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      View All Products Catalog <ArrowRight className="w-4 h-4 animate-bounce-horizontal" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                    {products.slice(0, 4).map((p, idx) => {
                      const pctSaved = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                      return (
                        <motion.div 
                          key={p.id} 
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-50px" }}
                          transition={{ duration: 0.5, delay: (idx % 4) * 0.1, ease: "easeOut" }}
                          className="bg-white border border-slate-100/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-200/40 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group shadow-xs"
                        >
                          <div>
                            <div className="relative aspect-square bg-slate-50 border-b border-slate-100/80 overflow-hidden">
                              {p.originalPrice && (
                                <span className="absolute top-2 left-2 sm:top-3 sm:left-3 bg-wine-600 text-white font-bold text-[8px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg z-10 shadow-sm">
                                  Save {pctSaved}%
                                </span>
                              )}
                              {p.stock === 0 ? (
                                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-slate-950 text-white font-bold text-[8px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg z-10 border border-slate-800">
                                  Out of Stock
                                </span>
                              ) : p.stock < 5 ? (
                                <span className="absolute top-2 right-2 sm:top-3 sm:right-3 bg-rose-100 text-rose-700 font-bold text-[8px] sm:text-[9px] uppercase tracking-wider px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-md sm:rounded-lg z-10 animate-pulse">
                                  Low Stock
                                </span>
                              ) : null}

                              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                            </div>

                            <div className="p-3 sm:p-5 space-y-1 sm:space-y-1.5">
                              <span className="text-[8px] sm:text-[10px] text-slate-400 uppercase font-mono font-bold tracking-wider">{p.category}</span>
                              <h3 className="text-[11px] sm:text-xs font-bold text-slate-950 group-hover:text-wine-600 transition-colors leading-snug truncate font-sans">{p.name}</h3>
                              
                              <div className="flex items-center gap-1 text-amber-500 pt-0.5">
                                <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-amber-500" />
                                <span className="text-[10px] sm:text-xs font-bold text-slate-600">{p.rating}</span>
                              </div>
                            </div>
                          </div>

                          <div className="p-3 sm:p-5 pt-0 border-t border-slate-50 mt-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                            <div className="bg-wine-50/70 border border-wine-100/50 rounded-xl p-2.5 flex-grow flex items-center justify-between">
                              <div className="space-y-0.5">
                                <span className="text-[8px] uppercase font-mono tracking-wider font-black text-wine-700 block">Price</span>
                                <p className="text-xs sm:text-sm font-extrabold text-wine-900 font-mono">KES {p.price.toLocaleString()}</p>
                              </div>
                              {p.originalPrice && (
                                <div className="text-right">
                                  <span className="text-[8px] line-through text-slate-400 block font-mono">KES {p.originalPrice.toLocaleString()}</span>
                                  <span className="text-[8px] font-bold text-emerald-600 font-mono bg-emerald-50 px-1 py-0.5 rounded-sm">- {pctSaved}%</span>
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => addToCart(p)}
                              disabled={p.stock === 0}
                              className="bg-wine-900 hover:bg-wine-800 disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-all shadow-md border border-wine-800 cursor-pointer flex items-center justify-center gap-1.5 shrink-0"
                            >
                              <span>Buy Now</span>
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </section>

                {/* Dedicated CCTV Installations Previous Work Showcase */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8" id="cctv-gallery-showcase">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-end gap-4 border-b border-slate-100/80 pb-4">
                    <div>
                      <span className="text-[10px] font-bold text-wine-700 uppercase tracking-widest font-mono block">CCTV DEPLOYMENTS & PREVIOUS WORK</span>
                      <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-display mt-1">Featured CCTV Project Showcases</h2>
                      <p className="text-xs text-slate-500 mt-1">Browse actual high-definition job-site photos of our camera deployments, secure wiring layouts, and technical setups.</p>
                    </div>
                  </div>

                  {photos.filter(p => p.category === 'CCTV').length === 0 ? (
                    <div className="bg-slate-50 border border-slate-150/50 rounded-2xl p-12 text-center text-slate-400">
                      <Camera className="w-12 h-12 mx-auto text-slate-300 mb-3" />
                      <p className="text-xs font-bold text-slate-700">No CCTV project photos registered yet.</p>
                      <p className="text-[10px] mt-1 text-slate-400">Add project photos categorized as "CCTV" in the Admin Dashboard to display previous client work here.</p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {photos.filter(p => p.category === 'CCTV').map((photo, idx) => (
                        <motion.div
                          key={photo.id}
                          initial={{ opacity: 0, y: 20 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: idx * 0.05 }}
                          onClick={() => setSelectedCCTVPhoto(photo)}
                          className="bg-white border border-slate-100 rounded-2xl overflow-hidden shadow-xs hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col group cursor-pointer"
                        >
                          <div className="relative aspect-video overflow-hidden bg-slate-50">
                            <img
                              src={photo.url}
                              alt={photo.title}
                              className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                            <div className="absolute top-3 left-3">
                              <span className="bg-slate-950/90 text-amber-500 font-mono text-[9px] font-bold px-2 py-0.5 rounded border border-slate-800/50 backdrop-blur-xs">
                                CCTV WORK
                              </span>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col justify-between">
                            <div>
                              <h3 className="text-xs font-bold text-slate-900 group-hover:text-wine-600 transition-colors line-clamp-1">{photo.title}</h3>
                              {photo.description && (
                                <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">{photo.description}</p>
                              )}
                            </div>
                            <div className="text-[9px] text-slate-400 font-mono mt-3 pt-3 border-t border-slate-50 flex justify-between items-center">
                              <span>Professional Deployment</span>
                              <span>{new Date(photo.uploadedAt).toLocaleDateString()}</span>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </section>

                {/* Client Testimonials Section */}
                <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                  <div className="text-center space-y-1">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Endorsed by Customers</span>
                    <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight font-display">What Our Clients Are Saying</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {testimonials.map(t => (
                      <div key={t.id} className="bg-white border border-slate-100/85 p-6 sm:p-8 rounded-2xl shadow-xs hover:shadow-md hover:border-slate-200/40 transition-all duration-300 flex flex-col justify-between space-y-5">
                        <div className="space-y-4">
                          <div className="flex gap-1 text-amber-500">
                            {[...Array(t.rating)].map((_, i) => (
                              <Star key={i} className="w-4 h-4 fill-amber-500" />
                            ))}
                          </div>
                          <p className="text-xs text-slate-600 italic leading-relaxed font-sans">"{t.content}"</p>
                        </div>
                        
                        <div className="flex gap-3 items-center border-t border-slate-50 pt-5">
                          {t.avatar ? (
                            <img src={t.avatar} alt={t.name} className="w-11 h-11 object-cover rounded-full border border-slate-100 shadow-sm" referrerPolicy="no-referrer" />
                          ) : (
                            <div className="w-11 h-11 rounded-full bg-slate-900 text-amber-500 border border-slate-800 flex items-center justify-center font-bold text-xs uppercase shadow-xs shrink-0 font-mono">
                              {t.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                            </div>
                          )}
                          <div>
                            <h4 className="text-xs font-bold text-slate-950 font-display">{t.name}</h4>
                            <p className="text-[10px] text-slate-400 font-mono mt-0.5">{t.role}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {/* Urgent Quick Contact Form Panel */}
                <section className="max-w-4xl mx-auto px-4">
                  <div className="bg-slate-900 border border-slate-800/80 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-12 gap-8 items-center text-white relative overflow-hidden bg-grid-pattern shadow-xl">
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 opacity-90 z-0" />
                    
                    <div className="md:col-span-5 space-y-4 relative z-10">
                      <h3 className="text-xl font-bold text-white tracking-tight font-display">Need Urgent Assistance?</h3>
                      <p className="text-xs text-slate-300 leading-relaxed font-sans">
                        Have an emergency fridge blackout, or security camera going offline? Submit your details directly to our technician desk. We respond within **15 minutes**.
                      </p>
                      
                      <div className="space-y-2.5 text-xs text-slate-300">
                        <p className="flex items-center gap-2.5 font-semibold font-mono">
                          <Phone className="w-4 h-4 text-amber-500 shrink-0" />
                          Call/WhatsApp: 0708776967
                        </p>
                        <p className="flex items-center gap-2.5 font-mono">
                          <Mail className="w-4 h-4 text-amber-500 shrink-0" />
                          gathonimash@gmail.com
                        </p>
                      </div>
                    </div>

                    {/* Mini Contact Form */}
                    <form onSubmit={handleContactSubmit} className="md:col-span-7 bg-slate-950/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800/60 shadow-2xl space-y-4 relative z-10">
                      <div>
                        <input 
                          type="text" 
                          required
                          placeholder="Your Name *" 
                          value={contactName}
                          onChange={(e) => setContactName(e.target.value)}
                          className="w-full text-xs bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:bg-slate-900 transition-colors"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <input 
                          type="tel" 
                          required
                          placeholder="Phone Number *" 
                          value={contactPhone}
                          onChange={(e) => setContactPhone(e.target.value)}
                          className="w-full text-xs bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:bg-slate-900 transition-colors"
                        />
                        <input 
                          type="email" 
                          placeholder="Email (optional)" 
                          value={contactEmail}
                          onChange={(e) => setContactEmail(e.target.value)}
                          className="w-full text-xs bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:bg-slate-900 transition-colors"
                        />
                      </div>
                      <div>
                        <textarea 
                          rows={2}
                          required
                          placeholder="Describe appliance failure or camera symptoms..." 
                          value={contactMessage}
                          onChange={(e) => setContactMessage(e.target.value)}
                          className="w-full text-xs bg-slate-900/60 border border-slate-800 rounded-xl px-3.5 py-2.5 text-white placeholder-slate-500 focus:outline-none focus:border-amber-500/80 focus:bg-slate-900 transition-colors resize-none"
                        />
                      </div>
                      
                      <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3 rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer text-xs uppercase tracking-wider font-mono"
                      >
                        Submit Urgent Dispatch Alert
                      </button>
                      
                      {contactStatus && (
                        <p className="text-[11px] text-center text-amber-500 font-bold mt-2 font-mono">{contactStatus}</p>
                      )}
                    </form>
                  </div>
                </section>

                {/* Full CCTV Project Image Viewer Overlay Modal */}
                {selectedCCTVPhoto && (
                  <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 overflow-y-auto" onClick={() => setSelectedCCTVPhoto(null)}>
                    <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-2xl max-w-3xl w-full relative animate-fade-in" onClick={(e) => e.stopPropagation()}>
                      {/* Close button */}
                      <button 
                        onClick={() => setSelectedCCTVPhoto(null)}
                        className="absolute top-4 right-4 bg-slate-900/80 text-white hover:bg-slate-950 p-2 rounded-full shadow-lg transition-colors z-50 cursor-pointer"
                        title="Close Viewer"
                      >
                        <X className="w-5 h-5" />
                      </button>

                      {/* Photo high-definition */}
                      <div className="relative aspect-video bg-slate-50 border-b border-slate-100">
                        <img 
                          src={selectedCCTVPhoto.url} 
                          alt={selectedCCTVPhoto.title} 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>

                      {/* Detail card */}
                      <div className="p-6 sm:p-8 space-y-4">
                        <div className="flex flex-wrap gap-2 items-center justify-between border-b border-slate-100 pb-4">
                          <div>
                            <span className="bg-wine-50 text-wine-800 text-[10px] font-mono font-bold px-2.5 py-1 rounded-lg border border-wine-100">
                              CCTV SECURITY DEPLOYMENT
                            </span>
                            <h3 className="text-xl font-black text-slate-950 tracking-tight font-display mt-2">{selectedCCTVPhoto.title}</h3>
                          </div>
                          <div className="text-[10px] text-slate-500 font-mono">
                            Logged: {new Date(selectedCCTVPhoto.uploadedAt).toLocaleDateString()}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">Project Scope & Specifications</h4>
                          <p className="text-xs text-slate-700 leading-relaxed font-sans whitespace-pre-wrap">
                            {selectedCCTVPhoto.description || 'Our engineers deployed high-performance surveillance hardware tailored to the client site layout to ensure 100% blindspot elimination, full-duplex audio syncing, and secure remote mobile monitoring.'}
                          </p>
                        </div>

                        <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                          <div>
                            <h5 className="text-xs font-bold text-slate-800">Interested in a similar high-security CCTV setup?</h5>
                            <p className="text-[11px] text-slate-500 mt-0.5">Book a certified technician for a custom site survey & quotation.</p>
                          </div>
                          <button 
                            onClick={() => { setSelectedCCTVPhoto(null); setActiveView('booking'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                            className="bg-wine-900 hover:bg-wine-850 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all cursor-pointer shadow-md shrink-0 w-full sm:w-auto text-center"
                          >
                            Book Setup Survey
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              </div>
            )}

            {/* ==================================== */}
            {/* SERVICES VIEW */}
            {/* ==================================== */}
            {activeView === 'services' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10" id="services-view">
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Technical Specifications</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">Our Precision Hardware Services</h1>
                  <p className="text-xs text-slate-500 font-sans">We analyze electrical layouts, execute micro-soldering, clear blocked refrigeration thermal lines, and run certified safety audits.</p>
                </div>

                {/* Dedicated Search & Sort Bar */}
                <div className="max-w-2xl mx-auto bg-slate-50/60 border border-slate-150/60 rounded-2xl p-3 flex flex-col sm:flex-row items-center gap-3 shadow-xs" id="services-filter-controls">
                  <div className="relative flex-grow w-full">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search repair services (e.g., CCTV, solar, TV, fridge, aircon...)"
                      value={servicesSearch}
                      onChange={(e) => setServicesSearch(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs bg-white border border-slate-200/50 rounded-xl text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/5 transition-all font-semibold shadow-xs"
                    />
                    {servicesSearch && (
                      <button
                        type="button"
                        onClick={() => setServicesSearch('')}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
                        title="Clear search"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Price sorting selection dropdown */}
                  <div className="relative w-full sm:w-52 shrink-0">
                    <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <select
                      value={servicesSort}
                      onChange={(e) => setServicesSort(e.target.value)}
                      className="w-full pl-10 pr-8 py-2.5 text-xs bg-white border border-slate-200/50 rounded-xl text-slate-700 font-semibold focus:outline-none focus:border-amber-500/80 focus:ring-2 focus:ring-amber-500/5 shadow-xs cursor-pointer appearance-none"
                    >
                      <option value="default">Default Order</option>
                      <option value="price-asc">Price: Low to High</option>
                      <option value="price-desc">Price: High to Low</option>
                    </select>
                    <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                <div className="space-y-12">
                  {filteredAndSortedServices.length === 0 ? (
                    <div className="text-center py-16 px-6 bg-slate-50/60 rounded-3xl border border-slate-100/80 max-w-md mx-auto space-y-4 shadow-xs">
                      <div className="text-slate-300 flex justify-center">
                        <Search className="w-14 h-14 text-slate-300 stroke-[1.5]" />
                      </div>
                      <div className="space-y-1.5">
                        <h3 className="text-base font-bold text-slate-900 font-display">No Repair Services Found</h3>
                        <p className="text-xs text-slate-500 font-sans leading-relaxed">We couldn't find any electronics repair services matching <strong className="text-slate-700 font-semibold font-mono">"{servicesSearch}"</strong>.</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setServicesSearch('');
                          setServicesSort('default');
                        }}
                        className="bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        Reset Search & Sort
                      </button>
                    </div>
                  ) : (
                    filteredAndSortedServices.map((s, idx) => (
                      <div 
                        key={s.id} 
                        className="bg-white border border-slate-100/90 rounded-2xl p-6 sm:p-8 shadow-xs hover:shadow-lg hover:border-slate-200/40 transition-all duration-300 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center group"
                      >
                        {/* Image section */}
                        <div className="lg:col-span-5 h-64 sm:h-80 bg-slate-50 rounded-2xl overflow-hidden relative border border-slate-100/80 group shadow-xs">
                          <img src={s.image} alt={s.name} className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500" referrerPolicy="no-referrer" />
                          <div className="absolute inset-0 bg-slate-950/25 group-hover:opacity-10 transition-opacity duration-300" />
                          <div className="absolute top-4 left-4 bg-slate-950/90 backdrop-blur-xs text-white text-[11px] px-3.5 py-1.5 rounded-xl font-mono font-bold border border-slate-800/80">
                            {s.priceRange}
                          </div>
                        </div>

                        {/* Details section */}
                        <div className="lg:col-span-7 space-y-5">
                          <div className="flex gap-3 items-center">
                            {renderServiceIcon(s.icon)}
                            <div>
                              <h2 className="text-xl font-bold text-slate-950 tracking-tight font-display group-hover:text-amber-600 transition-colors">{s.name}</h2>
                              <p className="text-[10px] text-slate-400 font-mono mt-0.5">Estimated Duration: <strong className="text-slate-600">{s.estimatedTime}</strong></p>
                            </div>
                          </div>

                          <p className="text-xs text-slate-600 leading-relaxed font-sans">{s.description}</p>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
                            {/* Benefits */}
                            <div className="space-y-2.5">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-1.5 block">Key Performance Benefits</h4>
                              <ul className="space-y-1.5">
                                {s.keyBenefits.map((b, bIdx) => (
                                  <li key={bIdx} className="text-xs text-slate-700 flex gap-2 items-start font-sans">
                                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                                    <span>{b}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* Process */}
                            <div className="space-y-2.5">
                              <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-1.5 block">Our Procedural Process</h4>
                              <ol className="space-y-1.5 font-mono text-[11px] text-slate-600 list-decimal pl-4">
                                {s.process.map((step, sIdx) => (
                                  <li key={sIdx} className="pl-1">
                                    {step}
                                  </li>
                                ))}
                              </ol>
                            </div>
                          </div>

                          <div className="pt-5 border-t border-slate-100 flex flex-wrap gap-3">
                            <button 
                              onClick={() => handleTriggerServiceBook(s.id)}
                              className="bg-wine-900 hover:bg-wine-800 text-white font-bold text-xs px-5 py-3 rounded-xl transition-all shadow-md cursor-pointer flex items-center gap-2"
                            >
                              <Calendar className="w-4 h-4" />
                              Book Repair Service
                            </button>
                            <button 
                              onClick={() => handleToggleCompare(s.id)}
                              className={`px-5 py-3 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                                selectedCompareIds.includes(s.id)
                                  ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-sm font-extrabold'
                                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                              }`}
                            >
                              <span>{selectedCompareIds.includes(s.id) ? '✓ Added to Compare' : 'Select to Compare'}</span>
                            </button>
                            <a 
                              href={getWhatsAppUrl(`Hi SmartTech, I am interested in booking the "${s.name}" repair service. Can you please advise on pricing and availability?`)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center gap-1.5 cursor-pointer hover:shadow-md"
                            >
                              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.47 5.258 1.471 5.403 0 9.8-4.386 9.803-9.789.002-2.618-1.012-5.08-2.859-6.93C16.964 2.067 14.501 1.04 11.89 1.04c-5.398 0-9.794 4.387-9.797 9.789-.001 1.902.497 3.761 1.44 5.393L2.51 21.43l5.22-.136zM18.14 14.9c-.33-.165-1.956-.964-2.256-1.074-.3-.11-.52-.165-.74.165-.22.33-.85 1.074-1.04 1.294-.19.22-.38.24-.71.075-.33-.165-1.4-.515-2.664-1.64-1.05-.935-1.758-2.09-1.96-2.44-.2-.33-.025-.515.14-.68.15-.15.33-.38.495-.57.165-.19.22-.33.33-.55.11-.22.05-.41-.025-.57-.075-.165-.74-1.78-.1-2.41-.3-.72-.63-.72-.88-.72-.2-.01-.44-.01-.68-.01-.24 0-.63.09-.96.44-.33.35-1.27 1.24-1.27 3.03s1.3 3.52 1.48 3.76c.18.24 2.55 3.9 6.19 5.48.86.38 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 1.956-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38z"/>
                              </svg>
                              <span>WhatsApp</span>
                            </a>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Floating Comparison Tray */}
                {selectedCompareIds.length > 0 && (
                  <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-full max-w-2xl px-4 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="bg-slate-950 border border-slate-800 text-white rounded-2xl shadow-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="bg-amber-500/10 text-amber-500 p-2 rounded-xl border border-amber-500/20">
                          <RefreshCw className="w-5 h-5 animate-spin-slow text-amber-500" />
                        </div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-white tracking-tight">⚖️ Service Repair Comparison</h4>
                          <p className="text-[10px] sm:text-[11px] text-slate-400 font-sans">
                            {selectedCompareIds.length === 1 
                              ? "Select 1 more repair service to run side-by-side comparison analysis."
                              : "2 repair services selected! Open comparative benefits analysis now."}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
                        <button
                          onClick={() => setSelectedCompareIds([])}
                          className="text-xs text-slate-400 hover:text-white px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Clear
                        </button>
                        <button
                          disabled={selectedCompareIds.length < 2}
                          onClick={() => setComparisonModalOpen(true)}
                          className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed text-slate-950 font-bold text-xs px-4.5 py-2.5 rounded-xl transition-all flex items-center gap-1.5 cursor-pointer shadow-md shadow-amber-500/10"
                        >
                          <span>Compare Now</span>
                          <span className="bg-slate-950 text-white text-[9px] w-4 h-4 rounded-full flex items-center justify-center font-black">
                            {selectedCompareIds.length}
                          </span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comparison Modal Overlay */}
                {comparisonModalOpen && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="comparison-modal">
                    {/* Backdrop */}
                    <div 
                      className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm" 
                      onClick={() => setComparisonModalOpen(false)} 
                    />
                    
                    {/* Modal Container */}
                    <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-4xl w-full relative z-10 overflow-hidden flex flex-col my-8">
                      
                      {/* Header */}
                      <div className="px-6 py-5 border-b border-slate-150 bg-slate-50 flex justify-between items-center">
                        <div className="flex items-center gap-2.5">
                          <div className="bg-wine-900 text-amber-400 p-2 rounded-xl">
                            <RefreshCw className="w-5 h-5" />
                          </div>
                          <div>
                            <h3 className="text-base font-extrabold text-slate-950 font-display">Side-by-Side Repair Analysis</h3>
                            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono font-bold">Compare key benefits, price levels, and speed</p>
                          </div>
                        </div>
                        <button 
                          onClick={() => setComparisonModalOpen(false)}
                          className="text-slate-400 hover:text-slate-950 p-1.5 hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
                        >
                          <X className="w-5.5 h-5.5" />
                        </button>
                      </div>

                      {/* Comparison Grid */}
                      <div className="p-6 overflow-y-auto max-h-[70vh]">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 divide-y md:divide-y-0 md:divide-x divide-slate-150">
                          {services
                            .filter(s => selectedCompareIds.includes(s.id))
                            .map((s, idx) => (
                              <div key={s.id} className={`space-y-6 ${idx > 0 ? 'md:pl-6 pt-6 md:pt-0' : 'pb-6 md:pb-0'}`}>
                                {/* Brand / Title Header */}
                                <div className="space-y-3">
                                  <div className="relative aspect-video rounded-xl bg-slate-50 border border-slate-150 overflow-hidden shadow-xs">
                                    <img src={s.image} alt={s.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                  </div>
                                  <div>
                                    <h4 className="text-lg font-extrabold text-slate-950 font-sans tracking-tight">{s.name}</h4>
                                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{s.description}</p>
                                  </div>
                                </div>

                                {/* Metrics Grid */}
                                <div className="grid grid-cols-2 gap-3">
                                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Estimated Time</span>
                                    <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mt-1 font-mono">
                                      <Clock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                                      {s.estimatedTime || 'Varies (Inquire)'}
                                    </span>
                                  </div>
                                  <div className="bg-slate-50 border border-slate-100 p-3 rounded-xl">
                                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block font-mono">Price Estimate</span>
                                    <span className="text-xs font-extrabold text-wine-950 flex items-center gap-1.5 mt-1 font-mono">
                                      {s.priceRange || 'Contact for Quote'}
                                    </span>
                                  </div>
                                </div>

                                {/* Core Benefits with scrollable area */}
                                <div className="space-y-2">
                                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Direct Repair Benefits</span>
                                  <div className="max-h-36 overflow-y-auto pr-1.5 space-y-1.5 border border-slate-100 rounded-lg p-2 bg-slate-50/50">
                                    <ul className="space-y-1.5">
                                      {s.keyBenefits && s.keyBenefits.map((b, bIdx) => (
                                        <li key={bIdx} className="text-xs text-slate-600 flex items-start gap-2 leading-relaxed">
                                          <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 shrink-0 stroke-[3]" />
                                          <span>{b}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>

                                {/* Call to Actions inside service columns */}
                                <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row gap-2.5">
                                  <a 
                                    href={getWhatsAppUrl(
                                      `Hi SmartTech, I am comparing repair benefits on your website and would like to inquire about the "${s.name}" service. I noticed its key benefits include: ${s.keyBenefits ? s.keyBenefits.slice(0, 3).join(', ') : ''}. Could you please confirm your pricing and availability for this?`
                                    )}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md flex-1 text-center"
                                  >
                                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                                      <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.47 5.258 1.471 5.403 0 9.8-4.386 9.803-9.789.002-2.618-1.012-5.08-2.859-6.93C16.964 2.067 14.501 1.04 11.89 1.04c-5.398 0-9.794 4.387-9.797 9.789-.001 1.902.497 3.761 1.44 5.393L2.51 21.43l5.22-.136zM18.14 14.9c-.33-.165-1.956-.964-2.256-1.074-.3-.11-.52-.165-.74.165-.22.33-.85 1.074-1.04 1.294-.19.22-.38.24-.71.075-.33-.165-1.4-.515-2.664-1.64-1.05-.935-1.758-2.09-1.96-2.44-.2-.33-.025-.515.14-.68.15-.15.33-.38.495-.57.165-.19.22-.33.33-.55.11-.22.05-.41-.025-.57-.075-.165-.74-1.78-.1-2.41-.3-.72-.63-.72-.88-.72-.2-.01-.44-.01-.68-.01-.24 0-.63.09-.96.44-.33.35-1.27 1.24-1.27 3.03s1.3 3.52 1.48 3.76c.18.24 2.55 3.9 6.19 5.48.86.38 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 1.956-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38z"/>
                                    </svg>
                                    <span>WhatsApp Inquiry</span>
                                  </a>
                                  <button 
                                    onClick={() => {
                                      setComparisonModalOpen(false);
                                      handleTriggerServiceBook(s.id);
                                    }}
                                    className="bg-wine-950 hover:bg-wine-800 text-white font-extrabold text-xs px-4 py-3 rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer hover:shadow-md flex-1"
                                  >
                                    <Calendar className="w-3.5 h-3.5 text-amber-400" />
                                    <span>Book Repair Now</span>
                                  </button>
                                </div>
                              </div>
                            ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* ==================================== */}
            {/* ==================================== */}
            {/* SHOP & DEALS VIEW */}
            {/* ==================================== */}
            {(activeView === 'shop' || activeView === 'deals') && (() => {
              const shopCategories = [
                'All Products',
                'CCTV',
                'TV',
                'Solar',
                'Air Condition',
                'Fridge',
                'Phone'
              ];

              const displayProducts = products.filter(p => {
                if (activeView === 'deals') {
                  return p.originalPrice !== undefined && p.originalPrice !== null;
                }
                return true;
              });

              return (
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12" id="shop-view-container">
                  <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* Left Sidebar for Desktop layout */}
                    <aside className="hidden lg:block w-72 shrink-0 space-y-6">
                      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-5 shadow-xs">
                        <div className="border-b border-slate-100 pb-3">
                          <h2 className="text-sm font-bold uppercase tracking-widest text-slate-800 font-display">Categories</h2>
                        </div>
                        <nav className="space-y-1">
                          {shopCategories.map(cat => {
                            const isSelected = shopCategory === cat || (cat === 'All Products' && (shopCategory === 'All' || !shopCategory));
                            return (
                              <button
                                key={cat}
                                onClick={() => {
                                  setShopCategory(cat === 'All Products' ? 'All' : cat);
                                }}
                                className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 flex items-center justify-between group cursor-pointer ${
                                  isSelected 
                                    ? 'bg-blue-50 text-blue-700 font-bold' 
                                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                                }`}
                              >
                                <span>{cat}</span>
                                <span className={`text-[10px] opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? 'opacity-100 text-blue-500 font-bold' : 'text-slate-400'}`}>
                                  →
                                </span>
                              </button>
                            );
                          })}
                        </nav>
                      </div>

                      <div className="bg-white border border-slate-200/60 rounded-2xl p-5 space-y-4 shadow-xs">
                        <div>
                          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 font-mono">Sort Catalogue</h3>
                          <div className="mt-2.5 relative">
                            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                            <select
                              value={shopSort}
                              onChange={(e) => setShopSort(e.target.value)}
                              className="w-full text-xs pl-8.5 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 font-bold cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 appearance-none"
                            >
                              <option value="rating">Top Rated</option>
                              <option value="price-low">Price: Low to High</option>
                              <option value="price-high">Price: High to Low</option>
                            </select>
                            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                    </aside>

                    {/* Right Side Content Pane */}
                    <div className="flex-1 space-y-6">
                      {/* Top title and info bar */}
                      <div className="bg-white border border-slate-200/50 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div>
                          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-950 tracking-tight font-display">
                            {activeView === 'deals' ? '🔥 SmartTech Hot Deals' : 'Explore Catalog'}
                          </h1>
                          <p className="text-xs text-slate-500 mt-1">
                            {activeView === 'deals' 
                              ? 'Selected premium laptops, storage & appliances at wholesale prices.' 
                              : `Displaying tech items in category: ${shopCategory === 'All' ? 'All Products' : shopCategory}`}
                          </p>
                        </div>

                        {/* Small inline search */}
                        <div className="relative w-full sm:w-64 shrink-0">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                          <input 
                            type="text" 
                            placeholder="Search products..." 
                            value={shopSearch}
                            onChange={(e) => setShopSearch(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-8 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-600 focus:bg-white transition-all"
                          />
                          {shopSearch && (
                            <button 
                              type="button" 
                              onClick={() => setShopSearch('')}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Horizontal mobile slider of categories */}
                      <div className="lg:hidden overflow-x-auto pb-1 flex gap-1.5 scrollbar-thin">
                        {shopCategories.map(cat => {
                          const isSelected = shopCategory === cat || (cat === 'All Products' && (shopCategory === 'All' || !shopCategory));
                          return (
                            <button
                              key={cat}
                              onClick={() => {
                                setShopCategory(cat === 'All Products' ? 'All' : cat);
                              }}
                              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-200 cursor-pointer ${
                                isSelected 
                                  ? 'bg-blue-600 text-white shadow-sm' 
                                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600 border border-transparent'
                              }`}
                            >
                              {cat}
                            </button>
                          );
                        })}
                      </div>

                      {/* Catalog Grid */}
                      {displayProducts.length === 0 ? (
                        <div className="h-96 flex flex-col items-center justify-center text-slate-400 text-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-6">
                          <Filter className="w-12 h-12 text-slate-300 mb-2" />
                          <p className="text-sm font-semibold">No products found</p>
                          <p className="text-xs mt-1">Try resetting filters or search criteria.</p>
                          <button
                            onClick={() => {
                              setShopCategory('All');
                              setShopSearch('');
                            }}
                            className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all cursor-pointer"
                          >
                            Clear All Filters
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                          {displayProducts.map((p, idx) => {
                            const pctSaved = p.originalPrice ? Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100) : 0;
                            const brandName = p.tags && p.tags.length > 0 ? p.tags[0].toUpperCase() : 'SMARTTECH';

                            return (
                              <motion.div 
                                key={p.id} 
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: (idx % 3) * 0.05 }}
                                className="bg-white border border-slate-200/60 rounded-2xl overflow-hidden hover:shadow-lg hover:border-blue-200/60 transition-all duration-300 flex flex-col justify-between group"
                              >
                                <div>
                                  <div className="relative aspect-square bg-slate-50 border-b border-slate-100 overflow-hidden flex items-center justify-center p-4">
                                    {p.originalPrice && (
                                      <span className="absolute top-3 left-3 bg-[#dc2626] text-white font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md z-10 shadow-sm">
                                        Sale
                                      </span>
                                    )}
                                    {p.stock === 0 ? (
                                      <span className="absolute top-3 right-3 bg-slate-900 text-white font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md z-10">
                                        Out of Stock
                                      </span>
                                    ) : p.stock < 5 ? (
                                      <span className="absolute top-3 right-3 bg-rose-50 text-rose-700 border border-rose-100 font-bold text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-md z-10 animate-pulse">
                                        Low Stock
                                      </span>
                                    ) : null}

                                    <img 
                                      src={p.image} 
                                      alt={p.name} 
                                      className="max-h-full max-w-full object-contain group-hover:scale-103 transition-transform duration-300" 
                                      referrerPolicy="no-referrer" 
                                    />
                                  </div>

                                  <div className="p-4 space-y-1.5">
                                    {/* Brand and category info */}
                                    <div className="flex justify-between items-center">
                                      <span className="text-[10px] font-black tracking-widest text-[#64748b] uppercase font-mono">{brandName}</span>
                                      <span className="text-[9px] font-bold text-slate-400 uppercase font-mono">{p.category}</span>
                                    </div>
                                    
                                    <h3 
                                      className="text-sm font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1 leading-snug font-sans cursor-pointer" 
                                      title={p.name}
                                      onClick={() => setSelectedProduct(p)}
                                    >
                                      {p.name}
                                    </h3>
                                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed h-8 font-sans">{p.description}</p>
                                    
                                    <div className="flex items-center gap-1 text-amber-500">
                                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                                      <span className="text-[11px] font-bold text-slate-600">{p.rating} ({p.stock} units)</span>
                                    </div>
                                  </div>
                                </div>

                                {/* Price and Action Bar */}
                                <div className="p-4 pt-0 border-t border-slate-50 mt-1 flex flex-col gap-3">
                                  <div className="flex items-baseline gap-2.5 pt-2">
                                    <span className="text-base font-black text-[#16a34a] font-sans">Ksh {p.price.toLocaleString()}</span>
                                    {p.originalPrice && (
                                      <span className="text-xs line-through text-slate-400 font-mono font-medium">Ksh {p.originalPrice.toLocaleString()}</span>
                                    )}
                                  </div>

                                  <div className="flex items-center justify-between gap-2.5 pt-1">
                                    <button
                                      onClick={() => setSelectedProduct(p)}
                                      className="text-blue-600 hover:text-blue-800 font-bold text-xs transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                      <span>Show details</span>
                                      <span>→</span>
                                    </button>

                                    <button
                                      onClick={() => {
                                        addToCart(p);
                                      }}
                                      disabled={p.stock === 0}
                                      className="bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-xs px-3.5 py-2 rounded-lg transition-all shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                                    >
                                      <span>Shop Now</span>
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            );
                          })}
                        </div>
                      )}
                    </div>

                  </div>
                </div>
              );
            })()}

            {/* Product Detail Modal */}
            {selectedProduct && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" id="product-detail-modal">
                <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setSelectedProduct(null)} />
                
                <div className="bg-white rounded-2xl shadow-2xl border border-slate-150 max-w-2xl w-full relative z-10 overflow-hidden flex flex-col">
                  <button 
                    onClick={() => setSelectedProduct(null)}
                    className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 p-1.5 hover:bg-slate-50 rounded-full transition-colors cursor-pointer z-20"
                  >
                    <X className="w-5.5 h-5.5" />
                  </button>

                  <div className="grid grid-cols-1 md:grid-cols-12 gap-6 p-6 sm:p-8">
                    <div className="md:col-span-5 aspect-square bg-slate-50 rounded-xl overflow-hidden flex items-center justify-center p-4 border border-slate-100">
                      <img 
                        src={selectedProduct.image} 
                        alt={selectedProduct.name} 
                        className="max-h-full max-w-full object-contain"
                        referrerPolicy="no-referrer"
                      />
                    </div>

                    <div className="md:col-span-7 flex flex-col justify-between space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-black tracking-widest text-[#64748b] uppercase font-mono">
                            {selectedProduct.tags && selectedProduct.tags[0] ? selectedProduct.tags[0].toUpperCase() : 'SMARTTECH'}
                          </span>
                          <span className="text-[9px] bg-blue-50 text-blue-700 font-extrabold uppercase px-2 py-0.5 rounded-md font-mono">
                            {selectedProduct.category}
                          </span>
                        </div>
                        <h2 className="text-lg sm:text-xl font-extrabold text-[#1e40af] tracking-tight font-sans">
                          {selectedProduct.name}
                        </h2>
                        <div className="flex items-center gap-1 text-amber-500">
                          <Star className="w-3.5 h-3.5 fill-amber-500" />
                          <span className="text-xs font-bold text-slate-600">{selectedProduct.rating} Rating</span>
                          <span className="text-slate-300">|</span>
                          <span className="text-xs text-slate-500">{selectedProduct.stock > 0 ? `${selectedProduct.stock} units in stock` : 'Out of stock'}</span>
                        </div>
                        <p className="text-xs text-slate-600 leading-relaxed font-sans pt-1">
                          {selectedProduct.description}
                        </p>
                      </div>

                      <div className="space-y-4 pt-3 border-t border-slate-100">
                        <div className="flex items-baseline gap-2.5">
                          <span className="text-xl sm:text-2xl font-black text-[#16a34a] font-sans">Ksh {selectedProduct.price.toLocaleString()}</span>
                          {selectedProduct.originalPrice && (
                            <span className="text-sm line-through text-slate-400 font-mono font-medium">Ksh {selectedProduct.originalPrice.toLocaleString()}</span>
                          )}
                        </div>

                        <div className="flex flex-col xs:flex-row gap-2.5">
                          <button
                            onClick={() => {
                              addToCart(selectedProduct);
                              setSelectedProduct(null);
                            }}
                            disabled={selectedProduct.stock === 0}
                            className="flex-1 bg-[#16a34a] hover:bg-[#15803d] disabled:opacity-40 disabled:cursor-not-allowed text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <ShoppingCart className="w-4 h-4" />
                            <span>Add to Cart & Checkout</span>
                          </button>

                          <a 
                            href={getWhatsAppUrl(`Hi SmartTech, I want to purchase "${selectedProduct.name}" listed at Ksh ${selectedProduct.price.toLocaleString()}. Is this item available for delivery today?`)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs py-3 rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5 cursor-pointer text-center"
                          >
                            <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.47 5.258 1.471 5.403 0 9.8-4.386 9.803-9.789.002-2.618-1.012-5.08-2.859-6.93C16.964 2.067 14.501 1.04 11.89 1.04c-5.398 0-9.794 4.387-9.797 9.789-.001 1.902.497 3.761 1.44 5.393L2.51 21.43l5.22-.136zM18.14 14.9c-.33-.165-1.956-.964-2.256-1.074-.3-.11-.52-.165-.74.165-.22.33-.85 1.074-1.04 1.294-.19.22-.38.24-.71.075-.33-.165-1.4-.515-2.664-1.64-1.05-.935-1.758-2.09-1.96-2.44-.2-.33-.025-.515.14-.68.15-.15.33-.38.495-.57.165-.19.22-.33.33-.55.11-.22.05-.41-.025-.57-.075-.165-.74-1.78-.1-2.41-.3-.72-.63-.72-.88-.72-.2-.01-.44-.01-.68-.01-.24 0-.63.09-.96.44-.33.35-1.27 1.24-1.27 3.03s1.3 3.52 1.48 3.76c.18.24 2.55 3.9 6.19 5.48.86.38 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 1.956-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38z"/>
                            </svg>
                            <span>Buy on WhatsApp</span>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* BOOKING VIEW */}
            {/* ==================================== */}
            {activeView === 'booking' && (
              <div className="max-w-4xl mx-auto px-4 py-12" id="booking-view">
                
                {bookingSuccessCard ? (
                  /* Success Frame */
                  <div className="bg-white border border-emerald-100 rounded-3xl p-8 sm:p-12 text-center shadow-lg space-y-6">
                    <div className="bg-emerald-100 text-emerald-800 p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto animate-bounce">
                      <Check className="w-8 h-8" />
                    </div>
                    <div className="space-y-2">
                      <h2 className="text-xl font-bold text-slate-900">Repair Job Cataloged Successfully!</h2>
                      <p className="text-xs text-slate-500 font-mono">Booking Code: **{bookingSuccessCard.id}**</p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 p-6 rounded-2xl max-w-lg mx-auto text-left space-y-4">
                      <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider border-b border-slate-200 pb-1.5">Appointment Summary</h3>
                      
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div>
                          <p className="text-slate-400">Scheduled Service:</p>
                          <p className="font-semibold text-slate-800">{bookingSuccessCard.serviceName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Client Profile:</p>
                          <p className="font-semibold text-slate-800">{bookingSuccessCard.customerName}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Date slot:</p>
                          <p className="font-semibold text-slate-800">{bookingSuccessCard.date} at {bookingSuccessCard.time}</p>
                        </div>
                        <div>
                          <p className="text-slate-400">Diagnostic Fee:</p>
                          <p className="font-mono font-bold text-slate-900">KES {bookingSuccessCard.amount.toLocaleString()}</p>
                        </div>
                      </div>

                      <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl text-[11px] text-amber-800 font-medium">
                        📱 A certified hardware technician has been assigned. We will coordinate via **{bookingSuccessCard.customerPhone}** to confirm logistics.
                      </div>
                    </div>

                    <button
                      onClick={() => setBookingSuccessCard(null)}
                      className="bg-slate-900 hover:bg-slate-950 text-white text-xs font-bold px-6 py-2.5 rounded-lg transition-colors"
                    >
                      Schedule Another Diagnostic Repair
                    </button>
                  </div>
                ) : (
                  /* Form Frame */
                  <div className="bg-white border border-slate-100/90 rounded-2xl overflow-hidden shadow-xs grid grid-cols-1 md:grid-cols-12">
                    
                    {/* Left Promo Card */}
                    <div className="md:col-span-4 bg-slate-950 text-white p-8 space-y-6 flex flex-col justify-between relative overflow-hidden bg-grid-pattern">
                      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 opacity-90 z-0" />
                      
                      <div className="space-y-4 relative z-10">
                        <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono block">Scheduling System</span>
                        <h2 className="text-lg font-bold text-white tracking-tight leading-snug font-display">Precision Hardware Auditing</h2>
                        <p className="text-xs text-slate-400 leading-relaxed font-sans">
                          Secure your on-site survey slot. SmartTech sends certified technicians matching standard tool calibration guides.
                        </p>
                      </div>

                      <div className="space-y-3.5 text-xs relative z-10">
                        <div className="flex gap-2.5 items-center">
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-sans">Same-day diagnostic calls</span>
                        </div>
                        <div className="flex gap-2.5 items-center">
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-sans">Genuine warrantied spare parts</span>
                        </div>
                        <div className="flex gap-2.5 items-center">
                          <Check className="w-4 h-4 text-amber-500 shrink-0" />
                          <span className="font-sans">Certified voltage loading trials</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-900 pt-4 text-[10px] text-slate-400 relative z-10 font-mono">
                        Need instant phone advice? Call Us: **0708776967**
                      </div>
                    </div>

                    {/* Right Form Card */}
                    <form onSubmit={handleBookingSubmit} className="md:col-span-8 p-6 sm:p-8 space-y-6">
                      <div className="border-b border-slate-100 pb-3">
                        <h3 className="text-sm font-bold text-slate-950 uppercase tracking-wider font-display">Configure Repair Appointment</h3>
                        <p className="text-xs text-slate-500 mt-0.5">Please specify diagnostic targets and logistics coordinates.</p>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Select Service *</label>
                          <select
                            value={bookingServiceId}
                            onChange={(e) => setBookingServiceId(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          >
                            {services.map(s => (
                              <option key={s.id} value={s.id}>{s.name}</option>
                            ))}
                            <option value="custom">Other Custom Electronics Repair</option>
                          </select>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Client Full Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="e.g. Moses Mwamuye" 
                            value={bookingName}
                            onChange={(e) => setBookingName(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Contact Phone Number *</label>
                          <input 
                            type="tel" 
                            required
                            placeholder="e.g. 0708776967" 
                            value={bookingPhone}
                            onChange={(e) => setBookingPhone(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Email Address (optional)</label>
                          <input 
                            type="email" 
                            placeholder="e.g. moses@gmail.com" 
                            value={bookingEmail}
                            onChange={(e) => setBookingEmail(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Appointment Date *</label>
                          <input 
                            type="date" 
                            required
                            value={bookingDate}
                            onChange={(e) => setBookingDate(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Preferred Time Slot *</label>
                          <select
                            value={bookingTime}
                            onChange={(e) => setBookingTime(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                          >
                            <option value="08:00 AM - 11:00 AM">Morning (08:00 AM - 11:00 AM)</option>
                            <option value="11:00 AM - 02:00 PM">Mid-Day (11:00 AM - 02:00 PM)</option>
                            <option value="02:00 PM - 05:00 PM">Afternoon (02:00 PM - 05:00 PM)</option>
                            <option value="05:00 PM - 07:00 PM">Late Evening (05:00 PM - 07:00 PM)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Physical Site Location / Estate Spot *</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Roysambu Area, Flat 4B, Nairobi" 
                          value={bookingAddress}
                          onChange={(e) => setBookingAddress(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Symptom notes / specialized demands</label>
                        <textarea 
                          rows={3}
                          placeholder="Please describe precise issues (e.g. My LG TV backlight goes off in 2 seconds, Fridge compressor clicked twice, CCTV camera model number...)" 
                          value={bookingNotes}
                          onChange={(e) => setBookingNotes(e.target.value)}
                          className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all resize-none font-semibold"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={isSubmittingBooking}
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold py-3.5 rounded-xl transition-all shadow-md shadow-amber-500/10 cursor-pointer text-xs uppercase tracking-wider font-mono disabled:opacity-50"
                      >
                        {isSubmittingBooking ? 'Submitting Schedule Information...' : 'Confirm Diagnostics Appointment Booking'}
                      </button>
                    </form>

                  </div>
                )}

              </div>
            )}

            {/* ==================================== */}
            {/* BLOGS & FAQ TROUBLESHOOTING VIEW */}
            {/* ==================================== */}
            {activeView === 'faq' && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12" id="faq-view">
                
                <div className="text-center max-w-xl mx-auto space-y-2">
                  <span className="text-[10px] font-bold text-amber-600 uppercase tracking-widest font-mono block">Knowledge Hub</span>
                  <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-display">Tech Manuals & Collapsible FAQs</h1>
                  <p className="text-xs text-slate-500 font-sans">Read maintenance logs authored by our certified hardware engineers or scroll down standard diagnostic checklists.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                  
                  {/* Left Column - Blogs */}
                  <div className="lg:col-span-7 space-y-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2 block">Latest Maintenance Manuals</span>
                    {blogs.map(post => (
                      <article key={post.id} className="bg-white border border-slate-100/95 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 space-y-4 group shadow-xs">
                        <div className="overflow-hidden rounded-xl bg-slate-50 relative aspect-video">
                          <img 
                            src={post.image} 
                            alt={post.title} 
                            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <div className="space-y-2">
                          <div className="flex gap-4 items-center text-[10px] text-slate-400 font-mono">
                            <span>📅 {post.date}</span>
                            <span>✍️ {post.author}</span>
                            <span>⏱️ {post.readTime}</span>
                          </div>
                          <h2 className="text-lg font-bold text-slate-950 group-hover:text-amber-600 transition-colors leading-snug font-display">{post.title}</h2>
                          <p className="text-xs text-slate-500 leading-relaxed font-semibold font-sans">{post.excerpt}</p>
                        </div>
                        
                        <div className="text-xs text-slate-600 space-y-3 leading-relaxed border-t border-slate-50 pt-4 font-sans">
                          {post.content.split('\n\n').map((para, pIdx) => {
                            if (para.startsWith('### ')) {
                              return <h4 key={pIdx} className="font-bold text-slate-950 mt-4 font-display text-sm">{para.replace('### ', '')}</h4>;
                            }
                            if (para.startsWith('* ') || para.startsWith('1.')) {
                              return <p key={pIdx} className="ml-3 italic text-slate-700 bg-slate-50/80 p-2.5 rounded-lg border-l-2 border-amber-500 font-mono text-[11px]">{para}</p>;
                            }
                            return <p key={pIdx}>{para}</p>;
                          })}
                        </div>
                      </article>
                    ))}
                  </div>

                  {/* Right Column - FAQs accordion */}
                  <div className="lg:col-span-5 space-y-8">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono border-b border-slate-100 pb-2 block">Collapsible Diagnostic Checklists</span>
                    
                    <div className="space-y-3">
                      {faqs.map(f => (
                        <div key={f.id} className="bg-white border border-slate-100/80 rounded-xl overflow-hidden shadow-xs hover:border-slate-200/40 transition-colors">
                          <button
                            onClick={() => setExpandedFaq(expandedFaq === f.id ? null : f.id)}
                            className="w-full text-left p-4 flex justify-between items-center hover:bg-slate-50/50 transition-colors cursor-pointer"
                          >
                            <span className="text-xs font-bold text-slate-950 pr-4 font-sans">{f.question}</span>
                            <ChevronDown className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                              expandedFaq === f.id ? 'rotate-180' : ''
                            }`} />
                          </button>
                          
                          {expandedFaq === f.id && (
                            <div className="px-4 pb-4 text-xs text-slate-600 leading-relaxed border-t border-slate-100/60 pt-3 bg-slate-50/30 font-sans">
                              {f.answer}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-950 text-white p-6 rounded-2xl border border-slate-800 space-y-3 shadow-xs bg-grid-pattern relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-950 to-slate-900 opacity-90 z-0" />
                      
                      <div className="relative z-10 space-y-3">
                        <HelpCircle className="w-8 h-8 text-amber-500" />
                        <h4 className="text-xs font-bold uppercase tracking-widest font-mono text-amber-500">Unresolved hardware issue?</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed font-sans">
                          Don't stress. Click our floating <strong className="text-white">Repair Diagnostician Chatbot</strong> in the bottom-right corner. It utilizes real-time Gemini Artificial Intelligence diagnostics to troubleshoot your exactly described symptoms instantly!
                        </p>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            )}

            {/* ==================================== */}
            {/* ADMIN CONSOLE VIEW */}
            {/* ==================================== */}
            {activeView === 'admin' && (
              <div id="admin-dashboard-view">
                {adminToken ? (
                  <AdminDashboard adminToken={adminToken} onLogout={handleLogout} />
                ) : (
                  <div className="max-w-md mx-auto py-24 px-4">
                    <div className="bg-white border border-slate-100/90 rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
                      <div className="bg-slate-100 text-slate-700 p-3.5 rounded-full w-14 h-14 flex items-center justify-center mx-auto">
                        <ShieldCheck className="w-8 h-8 text-amber-500" />
                      </div>
                      <div className="space-y-1">
                        <h2 className="text-xl font-bold text-slate-950 font-display">Administrative Portal</h2>
                        <p className="text-xs text-slate-400 font-sans">Authenticating access checks for database parameters.</p>
                      </div>
                      <button
                        onClick={() => setLoginOpen(true)}
                        className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md"
                      >
                        Sign In as Administrator
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </main>

      {/* Floating Smart AI Troubleshooter bot */}
      <AIAssistant />

      {/* Static Footer Component */}
      <Footer settings={settings} setActiveView={setActiveView} />

      {/* Secure Administrative Login Overlay Modal */}
      {loginOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-hidden" id="admin-login-modal">
          <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={() => setLoginOpen(false)} />
          
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-100 max-w-sm w-full p-6 relative z-10 space-y-4">
            <button 
              onClick={() => setLoginOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-950 p-1 hover:bg-slate-50 rounded-full transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center space-y-1.5">
              <div className="bg-slate-950 text-amber-500 p-2.5 rounded-xl w-12 h-12 flex items-center justify-center mx-auto border border-slate-800">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-950 font-display">Sign In to Dashboard</h3>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest font-mono">Electronics Workshop Desk</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-3.5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Username or Email</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. admin" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono block">Password</label>
                <input 
                  type="password" 
                  required
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-2.5 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500/80 focus:bg-white transition-all font-semibold"
                />
              </div>

              {loginError && (
                <p className="text-[10px] font-bold text-rose-600 text-center">{loginError}</p>
              )}

              <div className="bg-slate-50 p-3 rounded-xl text-[10px] text-slate-500 leading-relaxed font-sans border border-slate-100">
                ℹ️ Standard demonstration credentials are: <br />
                User: <strong className="text-slate-800 font-mono">admin</strong> | Password: <strong className="text-slate-800 font-mono">admin123</strong>
              </div>

              <button
                type="submit"
                className="w-full bg-slate-950 hover:bg-slate-900 text-white font-bold text-xs py-3.5 rounded-xl transition-all cursor-pointer shadow-xs hover:shadow-md border border-slate-800"
              >
                Verify and Open Console
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Persistent WhatsApp Floating Contact Button */}
      <div className="fixed bottom-20 sm:bottom-6 right-6 z-40 group flex items-center gap-2">
        {/* Expanded tooltip message on hover */}
        <div className="bg-slate-950 text-white text-xs font-semibold px-3 py-2 rounded-xl shadow-xl border border-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap">
          💬 Need Help? Contact us on WhatsApp!
        </div>
        <a 
          href={getWhatsAppUrl("Hi SmartTech, I am visiting your website and would like to inquire about your repair services and spare parts availability. Can you please assist me?")}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-emerald-600 hover:bg-emerald-500 text-white p-3.5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 flex items-center justify-center cursor-pointer relative"
          title="Contact Us on WhatsApp"
        >
          {/* Subtle pulse animation indicator */}
          <span className="absolute inset-0 rounded-full bg-emerald-600 opacity-40 animate-ping -z-10" />
          
          <svg className="w-6 h-6 fill-current text-white" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.47 5.258 1.471 5.403 0 9.8-4.386 9.803-9.789.002-2.618-1.012-5.08-2.859-6.93C16.964 2.067 14.501 1.04 11.89 1.04c-5.398 0-9.794 4.387-9.797 9.789-.001 1.902.497 3.761 1.44 5.393L2.51 21.43l5.22-.136zM18.14 14.9c-.33-.165-1.956-.964-2.256-1.074-.3-.11-.52-.165-.74.165-.22.33-.85 1.074-1.04 1.294-.19.22-.38.24-.71.075-.33-.165-1.4-.515-2.664-1.64-1.05-.935-1.758-2.09-1.96-2.44-.2-.33-.025-.515.14-.68.15-.15.33-.38.495-.57.165-.19.22-.33.33-.55.11-.22.05-.41-.025-.57-.075-.165-.74-1.78-.1-2.41-.3-.72-.63-.72-.88-.72-.2-.01-.44-.01-.68-.01-.24 0-.63.09-.96.44-.33.35-1.27 1.24-1.27 3.03s1.3 3.52 1.48 3.76c.18.24 2.55 3.9 6.19 5.48.86.38 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 1.956-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38z"/>
          </svg>
        </a>
      </div>

      {/* Mobile Bottom Navigation Bar - Sticky only on mobile screens */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-50 bg-wine-950/95 backdrop-blur-md border-t border-wine-900 px-4 py-2.5 flex justify-around items-center text-white shadow-2xl">
        <button 
          onClick={() => { setActiveView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeView === 'home' ? 'text-amber-400 font-bold' : 'text-wine-300 hover:text-white'}`}
        >
          <span className="text-base">🏠</span>
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase">Home</span>
        </button>
        <button 
          onClick={() => { setActiveView('services'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeView === 'services' ? 'text-amber-400 font-bold' : 'text-wine-300 hover:text-white'}`}
        >
          <span className="text-base">🛠️</span>
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase">Repairs</span>
        </button>
        <button 
          onClick={() => { setActiveView('shop'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          className={`flex flex-col items-center gap-0.5 cursor-pointer transition-colors ${activeView === 'shop' ? 'text-amber-400 font-bold' : 'text-wine-300 hover:text-white'}`}
        >
          <span className="text-base">🛒</span>
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase">Shop Spares</span>
        </button>
        <button 
          onClick={() => { setCartOpen(true); }}
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-colors text-wine-300 hover:text-white relative"
        >
          <span className="text-base">📦</span>
          {cart.length > 0 && (
            <span className="absolute -top-1.5 -right-2 bg-amber-500 text-slate-950 font-black text-[8px] h-3.5 w-3.5 rounded-full flex items-center justify-center border border-wine-950 animate-bounce">
              {cart.reduce((sum, item) => sum + item.quantity, 0)}
            </span>
          )}
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase">Cart</span>
        </button>
        <a 
          href="tel:0708776967"
          className="flex flex-col items-center gap-0.5 cursor-pointer transition-colors text-emerald-400 hover:text-emerald-300"
        >
          <span className="text-base">📞</span>
          <span className="text-[9px] font-bold font-mono tracking-wider uppercase font-sans">Call Desk</span>
        </a>
      </div>

    </div>
  );
}
