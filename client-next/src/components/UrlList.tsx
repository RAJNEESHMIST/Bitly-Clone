"use client";

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { ExternalLink, Copy, CheckCircle2, Calendar, MousePointer2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import CircularGauge from './ui/CircularGauge';

interface Url {
    id: string;
    originalUrl: string;
    shortUrl: string;
    clicks: number;
    maxClicks?: number;
    expiresAt?: string;
    createdAt: string;
    isExpired?: boolean;
}

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function UrlList() {
    const [urls, setUrls] = useState<Url[]>([]);
    const [loading, setLoading] = useState(true);
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const fetchUrls = async () => {
        try {
            const res = await axios.get('/api/urls/recent');
            setUrls(res.data);
        } catch (error) {
            console.error("Failed to fetch URLs", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUrls();
        // Poll for updates every 10 seconds to update click counts
        const interval = setInterval(fetchUrls, 10000);
        return () => clearInterval(interval);
    }, []);

    const copyToClipboard = async (text: string, id: string, shortCode: string) => {
        navigator.clipboard.writeText(text);
        setCopiedId(id);

        try {
            await axios.post(`/api/urls/${shortCode}/copy`);
            // Optimistically update
        } catch (e) {
            console.error("Failed to track copy", e);
        }

        setTimeout(() => setCopiedId(null), 2000);
    };

    if (loading) {
        return <div className="text-center py-20 text-slate-500 animate-pulse">Loading recently created links...</div>;
    }

    if (urls.length === 0) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-20">
            <h2 className="text-3xl font-bold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">
                Recent Activity
            </h2>

            <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
                <AnimatePresence mode='popLayout'>
                    {urls.map((url) => (
                        <motion.div
                            key={url.id}
                            variants={item}
                            layout
                            className="group relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
                        >
                            {/* Hovery Border Gradient */}
                            <div className="absolute inset-0 border border-white/20 rounded-2xl group-hover:border-fuchsia-500/50 transition-colors pointer-events-none" />

                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-white/5 rounded-xl text-cyan-400 group-hover:text-white group-hover:bg-cyan-500 transition-all duration-300">
                                    <ExternalLink className="w-6 h-6" />
                                </div>

                                {/* Gauge Integration */}
                                <div className="relative">
                                    <CircularGauge value={url.clicks} max={url.maxClicks || Infinity} copies={(url as any).copies} size={50} strokeWidth={4} label="" />
                                </div>
                            </div>

                            <div className="space-y-3 mb-6">
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-mono">ORIGINAL</p>
                                    <a href={url.originalUrl} target="_blank" className="block text-sm text-slate-300 truncate hover:text-white transition-colors" rel="noreferrer">
                                        {url.originalUrl}
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs text-slate-500 mb-1 font-mono">SHORT LINK</p>
                                    <a href={url.shortUrl} target="_blank" className="block text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-neon-cyan to-neon-pink truncate hover:opacity-80 transition-opacity" rel="noreferrer">
                                        {url.shortUrl}
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-center justify-between pt-4 border-t border-white/10">
                                <div className="flex items-center gap-4 text-xs text-slate-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" /> {new Date(url.createdAt).toLocaleDateString()}
                                    </span>
                                    {url.isExpired && <span className="text-red-400 font-semibold">Expired</span>}
                                </div>
                                <button
                                    onClick={() => copyToClipboard(url.shortUrl, url.id, (url as any).shortCode)}
                                    className={cn(
                                        "p-2 rounded-lg transition-all",
                                        copiedId === url.id ? "bg-emerald-500/20 text-emerald-400" : "hover:bg-white/10 text-slate-400 hover:text-white"
                                    )}
                                >
                                    {copiedId === url.id ? <CheckCircle2 className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </motion.div>
        </div>
    );

}
