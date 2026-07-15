/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingCart, User, LogOut, Menu, X, Trash2, ShieldCheck, MapPin, Phone, Mail, CheckCircle } from 'lucide-react';
import { Product, StoreSettings } from '../types';

interface NavbarProps {
  settings: StoreSettings;
  activeView: string;
  setActiveView: (view: string) => void;
  cart: { product: Product; quantity: number }[];
  updateCartQuantity: (id: string, qty: number) => void;
  removeFromCart: (id: string) => void;
  clearCart: () => void;
  adminToken: string | null;
  onLogout: () => void;
  openLoginModal: () => void;
  onCheckout: (details: {
    name: string;
    email: string;
    phone: string;
    address: string;
    notes: string;
    paymentMethod: 'mpesa' | 'cash';
    paymentPhone: string;
  }) => void;
  checkoutSuccessOrder: any;
  setCheckoutSuccessOrder: (order: any) => void;
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  shopSearch?: string;
  setShopSearch?: (val: string) => void;
  isAdminSecretUnlocked?: boolean;
}

export default function Navbar({
  settings,
  activeView,
  setActiveView,
  cart,
  updateCartQuantity,
  removeFromCart,
  clearCart,
  adminToken,
  onLogout,
  openLoginModal,
  onCheckout,
  checkoutSuccessOrder,
  setCheckoutSuccessOrder,
  cartOpen,
  setCartOpen,
  shopSearch = '',
  setShopSearch,
  isAdminSecretUnlocked = false
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [headerSearch, setHeaderSearch] = useState(shopSearch);
  
  // Checkout form state
  const [checkoutName, setCheckoutName] = useState('');
  const [checkoutEmail, setCheckoutEmail] = useState('');
  const [checkoutPhone, setCheckoutPhone] = useState('');
  const [checkoutAddress, setCheckoutAddress] = useState('');
  const [checkoutNotes, setCheckoutNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'mpesa' | 'cash'>('mpesa');
  const [paymentPhone, setPaymentPhone] = useState('');
  const [isSubmittingCheckout, setIsSubmittingCheckout] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkoutName || !checkoutPhone || !checkoutAddress) {
      alert('Please fill in Name, Phone, and Delivery Address.');
      return;
    }
    
    setIsSubmittingCheckout(true);
    try {
      await onCheckout({
        name: checkoutName,
        email: checkoutEmail,
        phone: checkoutPhone,
        address: checkoutAddress,
        notes: checkoutNotes,
        paymentMethod,
        paymentPhone: paymentMethod === 'mpesa' ? (paymentPhone || checkoutPhone) : ''
      });
      
      // Clear checkout form
      setCheckoutName('');
      setCheckoutEmail('');
      setCheckoutPhone('');
      setCheckoutAddress('');
      setCheckoutNotes('');
      setPaymentPhone('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmittingCheckout(false);
    }
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'services', label: 'Our Services' },
    { id: 'faq', label: 'Troubleshooting & FAQs' }
  ];

  const handleHeaderSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (setShopSearch) {
      setShopSearch(headerSearch);
    }
    setActiveView('shop');
  };

  React.useEffect(() => {
    setHeaderSearch(shopSearch);
  }, [shopSearch]);

  return (
    <>
      {/* Upper Info Bar */}
      <div className="bg-slate-50 text-slate-600 text-xs py-2 px-4 border-b border-slate-200/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium">{settings.phone}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-blue-600" />
              <span className="font-medium">{settings.email}</span>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-medium">{settings.location}</span>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 text-slate-800 backdrop-blur-md shadow-xs border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex justify-between items-center">
          
          {/* Brand Logo */}
          <div 
            onClick={() => { setActiveView('home'); setMobileMenuOpen(false); }} 
            className="flex items-center gap-2.5 cursor-pointer group shrink-0"
            id="nav-logo"
          >
            <div className="bg-blue-50 p-2 rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:rotate-3 shadow-xs border border-blue-100 text-blue-600">
              <ShieldCheck className="w-5.5 h-5.5" />
            </div>
            <div>
              <span className="text-xl font-black tracking-tight font-display leading-none block">
                <span className="text-[#dc2626]">SmartTech</span> <span className="text-[#1e40af]">Electronics</span>
              </span>
              <p className="text-[9px] text-slate-400 uppercase tracking-widest font-mono font-bold mt-0.5">Nairobi's #1 Tech & Repairs Store</p>
            </div>
          </div>

          {/* Header Search Form in Desktop */}
          <form onSubmit={handleHeaderSearchSubmit} className="hidden lg:flex items-center relative max-w-xs xl:max-w-md w-full mx-4">
            <input 
              type="text" 
              placeholder="Search for laptops, accessories, storage..." 
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
              className="w-full text-xs bg-slate-100 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-600 rounded-xl pl-3.5 pr-10 py-2.5 text-slate-800 font-medium transition-all"
            />
            <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-blue-600 p-1.5 rounded-lg transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`text-xs font-bold uppercase tracking-wider transition-all py-2 relative ${
                  activeView === item.id 
                    ? 'text-[#1e40af]' 
                    : 'text-slate-600 hover:text-[#1e40af]'
                }`}
                id={`nav-${item.id}`}
              >
                {item.label}
                {activeView === item.id && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Book Now Button */}
            <button
              onClick={() => setActiveView('booking')}
              className="hidden xl:inline-flex bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-xs px-4 py-2.5 rounded-xl transition-all border border-blue-200 shadow-xs cursor-pointer"
              id="nav-book-btn"
            >
              Book Service Repair
            </button>

            {/* Checkout / Order Trigger */}
            <button
              onClick={() => setCartOpen(true)}
              className="relative flex items-center gap-2 p-2.5 px-4 bg-[#16a34a] hover:bg-[#15803d] text-white font-bold text-xs rounded-xl transition-all shadow-sm cursor-pointer"
              aria-label="Checkout"
              id="nav-checkout-btn"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
              <span>Checkout</span>
              {cartItemCount > 0 && (
                <span className="bg-white text-emerald-800 font-extrabold text-[10px] w-5 h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartItemCount}
                </span>
              )}
            </button>

       

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-600 hover:bg-slate-100 rounded-full md:hidden"
              aria-label="Toggle menu"
              id="nav-hamburger"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t border-slate-200 py-4 px-6 space-y-3 shadow-lg">
            {navItems.map(item => (
              <button
                key={item.id}
                onClick={() => { setActiveView(item.id); setMobileMenuOpen(false); }}
                className={`block w-full text-left py-2.5 px-4 rounded-xl text-sm font-semibold transition-colors ${
                  activeView === item.id 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-700 hover:bg-slate-50'
                }`}
                id={`mobile-nav-${item.id}`}
              >
                {item.label}
              </button>
            ))}
            <button
              onClick={() => { setActiveView('booking'); setMobileMenuOpen(false); }}
              className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl text-sm transition-colors block"
              id="mobile-nav-book"
            >
              Book Service Repair
            </button>
          </div>
        )}
      </header>

      {/* Shopping Cart Drawer Side-Over */}
      {cartOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden" id="cart-drawer-overlay">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setCartOpen(false)}
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col h-full" id="cart-drawer-container">
              
              {/* Drawer Header */}
              <div className="px-6 py-5 border-b border-wine-800 flex justify-between items-center bg-wine-950 text-white">
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-amber-500" />
                  <h2 className="text-base font-bold">Your Purchase Checkout</h2>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="text-wine-200 hover:text-white p-1 rounded-full hover:bg-wine-800 transition-colors"
                >
                  <X className="w-5.5 h-5.5" />
                </button>
              </div>

              {/* Success Screen after Checkout */}
              {checkoutSuccessOrder ? (
                <div className="flex-1 overflow-y-auto px-6 py-12 flex flex-col items-center justify-center text-center">
                  <div className="bg-emerald-100 text-emerald-800 p-4 rounded-full mb-4 animate-bounce">
                    <CheckCircle className="w-12 h-12" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 mb-2">Order Received Securely!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mb-4">
                    Your order **{checkoutSuccessOrder.id}** has been generated. We have reserved your items and logged a dispatch request.
                  </p>
                  
                  {checkoutSuccessOrder.paymentMethod === 'mpesa' && (
                    <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 max-w-sm">
                      <p className="text-[11px] font-bold text-amber-800 uppercase tracking-wider mb-1 font-mono">SIMULATED MPESA PUSH ACTIVE</p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        An STK Push has been sent to **{checkoutSuccessOrder.paymentPhone}**. 
                      </p>
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(`/api/v1/orders/${checkoutSuccessOrder.id}/simulate-mpesa-callback`, { method: 'POST' });
                            const data = await res.json();
                            if (data.success) {
                              alert('Payment mock cleared! Order status updated to PAID inside Dashboard.');
                              setCheckoutSuccessOrder(null);
                              setCartOpen(false);
                            }
                          } catch (e) {
                            console.error(e);
                          }
                        }}
                        className="mt-3 w-full bg-slate-950 hover:bg-slate-900 text-white text-xs font-bold py-2 rounded-lg transition-colors border border-slate-800"
                      >
                        Click here to Approve Simulated Payment
                      </button>
                    </div>
                  )}

                  {checkoutSuccessOrder.paymentMethod === 'cash' && (
                    <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6 max-w-sm text-left">
                      <p className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider mb-1.5 font-mono flex items-center gap-1">
                        CHAT & PAY ON WHATSAPP
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed mb-3">
                        Your order <strong>#{checkoutSuccessOrder.id}</strong> has been logged! Please click the button below to send your order code and coordinate payment directly with us.
                      </p>
                      <a
                        href={`https://wa.me/254708776967?text=Hi%20ECB%20Technologies,%20I%20have%20placed%20order%20%23${checkoutSuccessOrder.id}%20totaling%20KES%20${checkoutSuccessOrder.total?.toLocaleString()}%20for%20${encodeURIComponent(checkoutSuccessOrder.customerName)}%20and%20would%20like%20to%20coordinate%20delivery.`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold py-2.5 rounded-lg transition-colors"
                      >
                        <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.62.963 3.41 1.47 5.258 1.471 5.403 0 9.8-4.386 9.803-9.789.002-2.618-1.012-5.08-2.859-6.93C16.964 2.067 14.501 1.04 11.89 1.04c-5.398 0-9.794 4.387-9.797 9.789-.001 1.902.497 3.761 1.44 5.393L2.51 21.43l5.22-.136zM18.14 14.9c-.33-.165-1.956-.964-2.256-1.074-.3-.11-.52-.165-.74.165-.22.33-.85 1.074-1.04 1.294-.19.22-.38.24-.71.075-.33-.165-1.4-.515-2.664-1.64-1.05-.935-1.758-2.09-1.96-2.44-.2-.33-.025-.515.14-.68.15-.15.33-.38.495-.57.165-.19.22-.33.33-.55.11-.22.05-.41-.025-.57-.075-.165-.74-1.78-.1-2.41-.3-.72-.63-.72-.88-.72-.2-.01-.44-.01-.68-.01-.24 0-.63.09-.96.44-.33.35-1.27 1.24-1.27 3.03s1.3 3.52 1.48 3.76c.18.24 2.55 3.9 6.19 5.48.86.38 1.54.6 2.06.77.87.28 1.66.24 2.28.15.7-.1 1.956-.8 2.23-1.57.27-.77.27-1.43.19-1.57-.08-.14-.3-.22-.63-.38z"/>
                        </svg>
                        <span>Send Order to WhatsApp</span>
                      </a>
                    </div>
                  )}

                  <button
                    onClick={() => { setCheckoutSuccessOrder(null); setCartOpen(false); }}
                    className="bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold px-6 py-2.5 rounded-lg transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              ) : (
                <>
                  {/* Cart Items List */}
                  <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
                    {cart.length === 0 ? (
                      <div className="h-64 flex flex-col items-center justify-center text-center text-slate-400">
                        <ShoppingCart className="w-12 h-12 text-slate-300 mb-2" />
                        <p className="text-sm font-medium">Your checkout list is empty</p>
                        <p className="text-xs">Browse our shop and click "Buy Now" on high-fidelity spare parts or security camera packs to purchase instantly.</p>
                      </div>
                    ) : (
                      <>
                        <div className="flex justify-between items-center pb-2 border-b border-slate-100">
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Product Description</span>
                          <button 
                            onClick={clearCart} 
                            className="text-[10px] font-bold text-rose-600 hover:underline flex items-center gap-1"
                          >
                            <Trash2 className="w-3 h-3" /> Clear All
                          </button>
                        </div>
                        {cart.map(item => (
                          <div key={item.product.id} className="flex gap-4 items-start py-2 border-b border-slate-100">
                            <img 
                              src={item.product.image} 
                              alt={item.product.name} 
                              className="w-16 h-16 object-cover rounded-lg bg-slate-100" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-slate-900 truncate">{item.product.name}</h4>
                              <p className="text-xs text-slate-500 font-medium font-mono mt-0.5">KES {item.product.price.toLocaleString()}</p>
                              
                              <div className="flex items-center gap-2 mt-2">
                                <label className="text-[10px] text-slate-400">Qty:</label>
                                <select 
                                  value={item.quantity} 
                                  onChange={(e) => updateCartQuantity(item.product.id, Number(e.target.value))}
                                  className="text-xs bg-slate-50 border border-slate-200 rounded px-1.5 py-0.5 font-medium text-slate-700"
                                >
                                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                                    <option key={n} value={n}>{n}</option>
                                  ))}
                                </select>
                                <button 
                                  onClick={() => removeFromCart(item.product.id)}
                                  className="text-slate-400 hover:text-rose-600 p-1 rounded hover:bg-slate-50 ml-auto transition-colors"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </>
                    )}
                  </div>

                  {/* Cart Footer & Form */}
                  {cart.length > 0 && (
                    <div className="border-t border-slate-100 bg-slate-50/50 px-6 py-5">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-sm font-semibold text-slate-600">Total Price:</span>
                        <span className="text-lg font-bold text-slate-950 font-mono">KES {cartTotal.toLocaleString()}</span>
                      </div>

                      {/* Checkout Information Form */}
                      <form onSubmit={handleCheckoutSubmit} className="space-y-3 bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
                        <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wide border-b border-slate-100 pb-1.5 mb-2">Checkout Details</h4>
                        
                        <div>
                          <input 
                            type="text" 
                            placeholder="Full Name *" 
                            required
                            value={checkoutName}
                            onChange={(e) => setCheckoutName(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                          />
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2">
                          <input 
                            type="tel" 
                            placeholder="Phone Number *" 
                            required
                            value={checkoutPhone}
                            onChange={(e) => setCheckoutPhone(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                          />
                          <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={checkoutEmail}
                            onChange={(e) => setCheckoutEmail(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                          />
                        </div>

                        <div>
                          <input 
                            type="text" 
                            placeholder="Delivery Address (e.g. Ward, Estate, Nairobi) *" 
                            required
                            value={checkoutAddress}
                            onChange={(e) => setCheckoutAddress(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                          />
                        </div>

                        <div>
                          <input 
                            type="text" 
                            placeholder="Order notes / delivery schedule (optional)" 
                            value={checkoutNotes}
                            onChange={(e) => setCheckoutNotes(e.target.value)}
                            className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-slate-800 placeholder-slate-400 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
                          />
                        </div>

                        <div className="bg-slate-50 p-2.5 rounded-lg space-y-2">
                          <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wide block">Payment Method</label>
                          <div className="flex gap-4">
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                              <input 
                                type="radio" 
                                name="payMethod" 
                                checked={paymentMethod === 'mpesa'}
                                onChange={() => setPaymentMethod('mpesa')}
                                className="text-amber-500 focus:ring-amber-500"
                              />
                              Safaricom M-Pesa
                            </label>
                            <label className="flex items-center gap-1.5 cursor-pointer text-xs font-semibold text-slate-700">
                              <input 
                                type="radio" 
                                name="payMethod" 
                                checked={paymentMethod === 'cash'}
                                onChange={() => setPaymentMethod('cash')}
                                className="text-amber-500 focus:ring-amber-500"
                              />
                              WhatsApp Pay & Support
                            </label>
                          </div>

                          {paymentMethod === 'mpesa' && (
                            <div className="pt-1">
                              <input 
                                type="tel" 
                                placeholder="MPesa Recipient Phone (e.g. 0708...)" 
                                value={paymentPhone}
                                onChange={(e) => setPaymentPhone(e.target.value)}
                                className="w-full text-xs bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800 font-mono placeholder-slate-400"
                              />
                              <p className="text-[9px] text-slate-500 mt-1">Initiates simulated Secure STK PIN request directly on phone</p>
                            </div>
                          )}

                          {paymentMethod === 'cash' && (
                            <div className="pt-1 text-[10px] text-slate-500 leading-relaxed bg-slate-100 p-2 rounded-md border border-slate-200">
                              <strong>WhatsApp Checkout:</strong> Generates a secure order, then lets you chat with us instantly on WhatsApp to coordinate direct payment and dispatch.
                            </div>
                          )}
                        </div>

                        <button
                          type="submit"
                          disabled={isSubmittingCheckout}
                          className="mt-2 w-full bg-slate-900 hover:bg-slate-950 text-white font-bold text-xs py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                        >
                          {isSubmittingCheckout ? 'Sending Secure STK Push...' : 'Complete Payment & Checkout'}
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
