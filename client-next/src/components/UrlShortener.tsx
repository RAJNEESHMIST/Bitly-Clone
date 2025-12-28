"use client";

import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Copy, ArrowRight, Settings2, Link as LinkIcon, AlertCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Accordion from '@radix-ui/react-accordion';

// Typewriter Component
const TypewriterInput = ({ value, onChange, disabled, placeholder }: any) => {
    const placeholders = [
        "Paste your long URL here...",
        "Shorten any link instantly...",
        "Share with the world...",
        "Track your clicks..."
    ];
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % placeholders.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="relative w-full group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-neon-cyan group-focus-within:text-neon-pink transition-colors duration-300">
                <LinkIcon className="w-5 h-5" />
            </div>
            <input
                type="url"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-transparent focus:outline-none focus:ring-2 focus:ring-neon-pink/50 focus:border-neon-pink/50 transition-all duration-300 backdrop-blur-md text-sm"
            />
            {!value && (
                <div className="absolute inset-y-0 left-12 flex items-center pointer-events-none overflow-hidden">
                    <AnimatePresence mode='wait'>
                        <motion.span
                            key={index}
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 0.5 }}
                            exit={{ y: -20, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="text-slate-400 font-medium"
                        >
                            {placeholders[index]}
                        </motion.span>
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

// Magnetic Button
const MagneticButton = ({ children, onClick, disabled, loading }: any) => {
    const ref = useRef<HTMLButtonElement>(null);
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const handleMouseMove = (e: React.MouseEvent) => {
        const { clientX, clientY } = e;
        const { left, top, width, height } = ref.current!.getBoundingClientRect();
        const x = (clientX - (left + width / 2)) * 0.3;
        const y = (clientY - (top + height / 2)) * 0.3;
        setPosition({ x, y });
    };

    const handleMouseLeave = () => {
        setPosition({ x: 0, y: 0 });
    };

    return (
        <motion.button
            ref={ref}
            onClick={onClick}
            disabled={disabled}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ x: position.x, y: position.y }}
            transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
            className={cn(
                "relative px-6 py-3 rounded-lg font-bold text-white overflow-hidden group w-full sm:w-auto text-sm",
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            )}
        >
            <div className="absolute inset-0 bg-gradient-to-r from-neon-cyan via-neon-violet to-neon-pink opacity-90 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-30 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-300" />
            <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                    <>
                        {children} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </div>
        </motion.button>
    );
};

export default function UrlShortener({ onUrlCreated }: { onUrlCreated: (url: any) => void }) {
    const [originalUrl, setOriginalUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Custom options state
    const [customCode, setCustomCode] = useState('');
    const [expiresAt, setExpiresAt] = useState('');
    const [maxClicks, setMaxClicks] = useState('');

    const [lastShortUrl, setLastShortUrl] = useState('');
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!originalUrl) return;

        setLoading(true);
        setError('');
        setLastShortUrl('');

        try {
            const payload: any = { originalUrl };
            if (customCode) payload.customCode = customCode;
            if (expiresAt) payload.expiresAt = new Date(expiresAt).toISOString();
            if (maxClicks) payload.maxClicks = Number(maxClicks);

            const res = await axios.post('/api/urls/shorten', payload);
            const data = res.data;

            setLastShortUrl(data.shortUrl);
            onUrlCreated(data);
            setOriginalUrl('');
            setCustomCode('');
            setExpiresAt('');
            setMaxClicks('');
        } catch (err: any) {
            setError(err.response?.data?.error || "Failed to shorten URL");
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(lastShortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="w-full max-w-xl mx-auto px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative z-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl shadow-indigo-500/10 overflow-hidden"
            >
                {/* Glow Effects */}
                <div className="absolute -top-20 -right-20 w-32 h-32 bg-neon-pink/20 blur-[60px] rounded-full pointer-events-none" />
                <div className="absolute -bottom-20 -left-20 w-32 h-32 bg-neon-cyan/20 blur-[60px] rounded-full pointer-events-none" />

                <div className="text-center mb-6">
                    <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-200 to-indigo-400 mb-2 tracking-tight">
                        Shorten Your Links
                    </h1>
                    <p className="text-slate-400 text-sm">
                        Transform long URLs into powerful, trackable short links.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5 relative z-10">
                    <div className="relative">
                        <TypewriterInput
                            value={originalUrl}
                            onChange={(e: any) => setOriginalUrl(e.target.value)}
                            disabled={loading}
                        />
                    </div>

                    <Accordion.Root type="single" collapsible className="w-full bg-white/5 rounded-xl border border-white/10 overflow-hidden">
                        <Accordion.Item value="options" className="border-none">
                            <Accordion.Trigger className="flex items-center justify-between w-full px-4 py-3 text-xs text-slate-300 hover:text-white hover:bg-white/5 transition-colors group">
                                <span className="flex items-center gap-2 font-medium">
                                    <Settings2 className="w-3.5 h-3.5 text-neon-cyan" />
                                    Advanced Options
                                </span>
                                <Settings2 className="w-3.5 h-3.5 group-data-[state=open]:rotate-180 transition-transform duration-300 opacity-50" />
                            </Accordion.Trigger>
                            <Accordion.Content className="data-[state=open]:animate-accordion-down data-[state=closed]:animate-accordion-up overflow-hidden text-xs bg-black/20">
                                <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Custom Alias</label>
                                        <input
                                            type="text"
                                            value={customCode}
                                            onChange={(e) => setCustomCode(e.target.value)}
                                            placeholder="e.g. my-super-link"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-neon-cyan/50 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Max Clicks</label>
                                        <input
                                            type="number"
                                            value={maxClicks}
                                            onChange={(e) => setMaxClicks(e.target.value)}
                                            placeholder="Unlimited"
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-neon-pink/50 focus:border-transparent transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-1.5 md:col-span-2">
                                        <label className="text-[10px] text-slate-400 uppercase tracking-widest font-bold ml-1">Expiration Date</label>
                                        <input
                                            type="datetime-local"
                                            value={expiresAt}
                                            onChange={(e) => setExpiresAt(e.target.value)}
                                            className="w-full bg-black/40 border border-white/10 rounded-lg px-3 py-2 text-white focus:ring-1 focus:ring-neon-violet/50 focus:border-transparent transition-all outline-none [color-scheme:dark]"
                                        />
                                    </div>
                                </div>
                            </Accordion.Content>
                        </Accordion.Item>
                    </Accordion.Root>

                    <div className="flex justify-end pt-2">
                        <MagneticButton loading={loading} disabled={loading || !originalUrl}>
                            Shorten Now
                        </MagneticButton>
                    </div>
                </form>

                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden mt-4"
                        >
                            <div className="bg-red-500/10 border border-red-500/20 text-red-200 p-4 rounded-xl flex items-center gap-3">
                                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                <p className="text-sm">{error}</p>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {lastShortUrl && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="mt-8 p-1 bg-gradient-to-r from-cyan-500/50 via-fuchsia-500/50 to-indigo-500/50 rounded-2xl"
                        >
                            <div className="bg-slate-900/90 rounded-xl p-6 flex flex-col md:flex-row items-center gap-4">
                                <div className="flex-1 min-w-0 text-center md:text-left">
                                    <p className="text-xs text-slate-400 mb-1 uppercase tracking-widest font-semibold">Your Short Link</p>
                                    <a href={lastShortUrl} target="_blank" rel="noopener noreferrer" className="text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-300 hover:to-white transition-all truncate block">
                                        {lastShortUrl}
                                    </a>
                                </div>
                                <button
                                    onClick={copyToClipboard}
                                    className={cn(
                                        "flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-300 min-w-[140px] justify-center",
                                        copied ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 hover:bg-white/20 text-white"
                                    )}
                                >
                                    {copied ? <CheckCircle2 className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    {copied ? "Copied!" : "Copy"}
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </div>
    );
}
