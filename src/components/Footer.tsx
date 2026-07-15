/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Send, ShieldCheck, Facebook, Twitter, Instagram, HelpCircle } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  settings: StoreSettings;
  setActiveView: (view: string) => void;
}

export default function Footer({ settings, setActiveView }: FooterProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setStatus('Please enter a valid email address.');
      return;
    }
    
    setLoading(true);
    setStatus(null);
    try {
      const res = await fetch('/api/v1/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await res.json();
      setStatus(data.message || 'Thank you for subscribing!');
      setEmail('');
    } catch (err) {
      console.error(err);
      setStatus('Failed to subscribe. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-wine-950 text-wine-300 font-sans border-t border-wine-900 bg-grid-pattern relative overflow-hidden" id="app-footer">
      
      {/* Decorative top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.06),transparent_40%)] pointer-events-none z-0" />

      {/* Top Banner section */}
      <div className="bg-wine-900/60 backdrop-blur-xs border-b border-wine-900/80 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="flex gap-4 items-center">
            <div className="bg-wine-950 border border-wine-800/85 text-amber-500 p-2.5 rounded-xl shrink-0 shadow-xs">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-wine-400 uppercase tracking-widest font-mono">Quick Repair Assistance</h4>
              <p className="text-sm font-semibold text-white mt-0.5">{settings.phone}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-wine-950 border border-wine-800/85 text-amber-500 p-2.5 rounded-xl shrink-0 shadow-xs">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-wine-400 uppercase tracking-widest font-mono">Send Electronic Inquiry</h4>
              <p className="text-sm font-semibold text-white mt-0.5">{settings.email}</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <div className="bg-wine-950 border border-wine-800/85 text-amber-500 p-2.5 rounded-xl shrink-0 shadow-xs">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-wine-400 uppercase tracking-widest font-mono">Our Shop Premises</h4>
              <p className="text-xs text-wine-200 mt-0.5 font-semibold">{settings.location}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links & Info */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
        
        {/* Brand Column */}
        <div className="space-y-4">
          <div className="flex items-center gap-2.5">
            <div className="bg-white/10 border border-white/20 text-emerald-400 p-2 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-white text-md font-black tracking-tight font-display">
              <span className="text-red-500">SmartTech</span> <span className="text-white">Electronics</span>
            </span>
          </div>
          <p className="text-xs text-wine-200/90 leading-relaxed font-sans">
            Nairobi's premier hub for high-definition CCTV installations, customized hybrid solar backup system designs, and hardware-level repairs for TVs, fridges, freezers, and air conditioners.
          </p>
          <div className="flex gap-2.5 pt-1">
            <a href="#" aria-label="Facebook" className="hover:text-amber-500 p-2 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-700 transition-colors"><Facebook className="w-4 h-4 text-wine-200 hover:text-white" /></a>
            <a href="#" aria-label="Twitter" className="hover:text-amber-500 p-2 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-700 transition-colors"><Twitter className="w-4 h-4 text-wine-200 hover:text-white" /></a>
            <a href="#" aria-label="Instagram" className="hover:text-amber-500 p-2 rounded-xl bg-wine-900 border border-wine-800 hover:border-wine-700 transition-colors"><Instagram className="w-4 h-4 text-wine-200 hover:text-white" /></a>
          </div>
        </div>

        {/* Quick View Links */}
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono border-b border-wine-900 pb-2.5 mb-5 block">Store Navigation</span>
          <ul className="space-y-3 text-xs font-sans">
            <li><button onClick={() => setActiveView('home')} className="hover:text-amber-500 hover:translate-x-1 transition-all text-wine-200 hover:text-white block cursor-pointer text-left">Welcome Home</button></li>
            <li><button onClick={() => setActiveView('services')} className="hover:text-amber-500 hover:translate-x-1 transition-all text-wine-200 hover:text-white block cursor-pointer text-left">Our Installation Services</button></li>
            <li><button onClick={() => setActiveView('shop')} className="hover:text-amber-500 hover:translate-x-1 transition-all text-wine-200 hover:text-white block cursor-pointer text-left">Shop</button></li>
            <li><button onClick={() => setActiveView('faq')} className="hover:text-amber-500 hover:translate-x-1 transition-all text-wine-200 hover:text-white block cursor-pointer text-left">Troubleshooting Guide</button></li>
            <li><button onClick={() => setActiveView('booking')} className="hover:text-amber-500 hover:translate-x-1 transition-all text-amber-500 font-bold block cursor-pointer text-left">Book Diagnostic Repair</button></li>
          </ul>
        </div>

        {/* Business Hours */}
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono border-b border-wine-900 pb-2.5 mb-5 block">Service Hours</span>
          <ul className="space-y-3 text-xs font-sans">
            <li className="flex justify-between border-b border-wine-900/60 pb-2">
              <span>Monday - Friday:</span>
              <span className="text-white font-mono">8:00 AM - 6:30 PM</span>
            </li>
            <li className="flex justify-between border-b border-wine-900/60 pb-2">
              <span>Saturdays:</span>
              <span className="text-white font-mono">9:00 AM - 5:00 PM</span>
            </li>
            <li className="flex justify-between border-b border-wine-900/60 pb-2">
              <span>Sundays:</span>
              <span className="text-amber-500 font-semibold font-mono">Special Bookings Only</span>
            </li>
            <li className="text-[10px] text-wine-400 italic pt-1.5 flex items-start gap-1.5 leading-relaxed">
              <HelpCircle className="w-3.5 h-3.5 shrink-0 text-amber-500" />
              <span>We provide urgent home call services for fridges and freezer repair.</span>
            </li>
          </ul>
        </div>

        {/* Newsletter & SEO Summary */}
        <div>
          <span className="text-[10px] font-bold text-amber-500 uppercase tracking-widest font-mono border-b border-wine-900 pb-2.5 mb-5 block">Newsletter Signup</span>
          <p className="text-xs text-wine-300 mb-4 leading-relaxed font-sans">
            Subscribe to receive expert electrical maintenance manuals, backup optimization advice, and stock discount warnings.
          </p>
          <form onSubmit={handleSubscribe} className="flex gap-2">
            <input 
              type="email" 
              required
              placeholder="Enter email address" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full text-xs bg-wine-900 text-white placeholder-wine-400 border border-wine-800 rounded-xl px-3.5 py-2.5 focus:outline-none focus:border-amber-500/80 focus:bg-wine-950 transition-all"
            />
            <button 
              type="submit" 
              disabled={loading}
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 p-2.5 rounded-xl transition-colors flex items-center justify-center shrink-0 cursor-pointer shadow-xs hover:shadow-md"
              aria-label="Submit subscribe"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
          {status && (
            <p className="text-[10px] text-amber-500 mt-2 font-mono font-bold">{status}</p>
          )}
        </div>

      </div>

      {/* Sub Footer Legal / Copyright Credits */}
      <div className="bg-wine-950/80 py-6 border-t border-wine-900 text-wine-400 text-[11px] px-4 relative z-10 font-sans">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <p>© {new Date().getFullYear()} SmartTech Electronics. All Rights Reserved. Designed for extreme durability.</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>

    </footer>
  );
}
