"use client";

import React from 'react';
import { motion } from 'framer-motion';
import * as Tooltip from '@radix-ui/react-tooltip';
import { MousePointer2, Copy, BarChart3 } from 'lucide-react';

const CircularGauge = ({ value, max, copies = 0, size = 120, strokeWidth = 10, label = "Clicks" }: any) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progress = Math.min(value / (max === Infinity ? 100 : max), 1);
    const dashoffset = circumference - progress * circumference;

    const getColor = () => {
        if (progress > 0.9) return '#f87171'; // Red
        if (progress > 0.7) return '#facc15'; // Yellow
        return '#34d399'; // Green
    };

    const strokeColor = getColor();

    return (
        <Tooltip.Provider delayDuration={100}>
            <Tooltip.Root>
                <Tooltip.Trigger asChild>
                    <div style={{ position: 'relative', width: size, height: size, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
                            <circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth={strokeWidth}
                                fill="transparent"
                            />
                            <motion.circle
                                cx={size / 2}
                                cy={size / 2}
                                r={radius}
                                stroke={strokeColor}
                                strokeWidth={strokeWidth}
                                fill="transparent"
                                strokeDasharray={circumference}
                                initial={{ strokeDashoffset: circumference }}
                                animate={{ strokeDashoffset: dashoffset }}
                                transition={{ duration: 1, ease: "easeOut" }}
                                strokeLinecap="round"
                                style={{ filter: `drop-shadow(0 0 6px ${strokeColor})` }}
                            />
                        </svg>
                        {label && (
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-white font-bold" style={{ fontSize: size * 0.25 }}>{value}</span>
                            </div>
                        )}
                    </div>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                    <Tooltip.Content className="z-50 bg-slate-900 border border-white/10 text-white text-xs p-3 rounded-lg shadow-xl animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95" sideOffset={5}>
                        <div className="space-y-2">
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-2 text-slate-400"><MousePointer2 className="w-3 h-3 text-cyan-400" /> Visits</span>
                                <span className="font-bold">{value}</span>
                            </div>
                            <div className="flex items-center justify-between gap-4">
                                <span className="flex items-center gap-2 text-slate-400"><Copy className="w-3 h-3 text-fuchsia-400" /> Copies</span>
                                <span className="font-bold">{copies}</span>
                            </div>
                            {max !== Infinity && (
                                <div className="pt-2 mt-2 border-t border-white/10 flex items-center justify-between gap-4">
                                    <span className="text-slate-500">Limit</span>
                                    <span className="font-mono text-slate-400">{max}</span>
                                </div>
                            )}
                        </div>
                        <Tooltip.Arrow className="fill-slate-900" />
                    </Tooltip.Content>
                </Tooltip.Portal>
            </Tooltip.Root>
        </Tooltip.Provider>
    );
};

export default CircularGauge;
