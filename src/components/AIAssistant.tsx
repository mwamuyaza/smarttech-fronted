/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Bot, X, Send, Sparkles, MessageCircle, AlertCircle } from 'lucide-react';

interface Message {
  sender: 'user' | 'bot';
  text: string;
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      text: "Habari! I am the **SmartTech AI Troubleshooting Specialist** representing Chief Tech Gathoni.\n\nHaving issues with your appliances? Choose one of our quick diagnostic templates below, or type your exact symptom (e.g., *'my fridge hums for 2 seconds and clicks off'* or *'my flat-screen TV shows half-dark display'*) for a direct hardware-level diagnostic report!"
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const presets = [
    { label: 'TV Sound OK but Dark Panel', query: 'My LED TV screen backlight is black/dark, but sound is working fine' },
    { label: 'Fridge clicking & not cooling', query: 'Fridge motor is making clicking noises and not cooling food' },
    { label: 'CCTV feed shows "No Signal"', query: 'Outdoor security camera shows offline or Black Screen No Signal' },
    { label: 'Calculate solar array size', query: 'How do I calculate what solar panel size and inverter I need for my house?' }
  ];

  // Auto-scroll chat to latest messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim()) return;
    
    const userMessage: Message = { sender: 'user', text: textToSend };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/v1/ai/troubleshoot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem: textToSend })
      });
      const data = await res.json();
      
      const botMessage: Message = {
        sender: 'bot',
        text: data.diagnostics || 'I experienced an issue processing your diagnostic. Please contact Gathoni on 0708776967.'
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: 'bot', text: "Connection error! Unable to reach our central servers. Please call our technician directly at **0708776967** for instant support." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating launcher bubble */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-slate-900 hover:bg-slate-800 text-amber-500 hover:text-amber-400 p-4 rounded-full shadow-2xl transition-all hover:scale-105 flex items-center gap-2 border border-slate-800 group"
          id="ai-floating-bubble"
        >
          <Sparkles className="w-5 h-5 animate-pulse text-amber-400" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 text-xs font-bold text-white whitespace-nowrap">
            Repair Diagnostician
          </span>
          <MessageCircle className="w-5 h-5 text-white" />
        </button>
      )}

      {/* Slide-over chatbot frame */}
      {isOpen && (
        <div 
          className="fixed bottom-6 right-6 z-50 w-full max-w-sm bg-white rounded-2xl shadow-2xl border border-slate-100 flex flex-col overflow-hidden h-[540px] shadow-slate-950/20"
          id="ai-chat-container"
        >
          {/* Header */}
          <div className="bg-slate-950 text-white px-4 py-3.5 flex justify-between items-center">
            <div className="flex items-center gap-2.5">
              <div className="bg-slate-900 text-amber-500 p-1.5 rounded-lg border border-slate-800 shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-white tracking-wide">SmartTech AI Diagnostician</h3>
                <p className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live Hardware Expert
                </p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Message feed stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div 
                key={idx} 
                className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[85%] text-xs rounded-2xl px-3.5 py-2.5 leading-relaxed ${
                    m.sender === 'user' 
                      ? 'bg-slate-900 text-white rounded-tr-none font-medium' 
                      : 'bg-white text-slate-800 border border-slate-100 rounded-tl-none shadow-sm'
                  }`}
                >
                  {/* Clean custom rendering for bullets, bold headings */}
                  {m.text.split('\n').map((line, lIdx) => {
                    if (line.startsWith('### ')) {
                      return <h4 key={lIdx} className="font-bold text-slate-900 mt-2 mb-1 border-b border-slate-100 pb-0.5">{line.replace('### ', '')}</h4>;
                    }
                    if (line.startsWith('**')) {
                      return <p key={lIdx} className="font-semibold text-slate-900 mt-1">{line.replace(/\*\*/g, '')}</p>;
                    }
                    if (line.startsWith('* ') || line.startsWith('- ')) {
                      return <li key={lIdx} className="ml-3 list-disc text-slate-700">{line.substring(2)}</li>;
                    }
                    if (line.match(/^\d+\./)) {
                      return <p key={lIdx} className="ml-3 text-slate-700 mt-0.5">{line}</p>;
                    }
                    return <p key={lIdx} className="mt-1">{line}</p>;
                  })}
                </div>
              </div>
            ))}
            
            {/* Loading placeholder */}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-none px-4 py-3 flex items-center gap-2 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-bounce" />
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Diagnosing hardware...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick templates wrapper */}
          {messages.length === 1 && (
            <div className="p-3 bg-white border-t border-slate-100 space-y-1.5 shrink-0">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide block mb-1">Common Diagnostics:</span>
              <div className="flex flex-col gap-1">
                {presets.map((p, pIdx) => (
                  <button
                    key={pIdx}
                    onClick={() => handleSendMessage(p.query)}
                    className="text-left w-full text-[11px] font-semibold text-slate-700 hover:text-slate-950 bg-slate-50 hover:bg-amber-50 rounded-lg px-2.5 py-1.5 border border-slate-100 transition-colors truncate"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* TextInput Control */}
          <div className="p-3 border-t border-slate-100 bg-white flex gap-2 shrink-0">
            <input
              type="text"
              placeholder="Ask anything (e.g. My TV shows sound but...)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendMessage(input)}
              className="flex-1 text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none focus:border-amber-500 focus:bg-white transition-colors"
            />
            <button
              onClick={() => handleSendMessage(input)}
              disabled={loading || !input.trim()}
              className="bg-slate-900 hover:bg-slate-800 disabled:opacity-50 text-amber-500 p-2.5 rounded-xl transition-colors shrink-0"
              aria-label="Send"
            >
              <Send className="w-4.5 h-4.5 text-white" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
