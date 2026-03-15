"use client";

import React, { useState } from 'react';
import { 
    Youtube, Sparkles, Send, Copy, 
    Check, Play, List, Clock, 
    AlertCircle, FileText, ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Summary {
    title: string;
    description: string;
    keyPoints: string[];
    actionItems: string[];
    timestamp?: string;
}

export default function SummarizerPage() {
    const [url, setUrl] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState<Summary | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [isCopied, setIsCopied] = useState(false);

    const handleSummarize = async () => {
        if (!url) return;
        setIsProcessing(true);
        setError(null);
        setSummary(null);

        try {
            const response = await fetch('/api/summarize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url })
            });

            if (!response.ok) throw new Error('Failed to summarize video');

            const data = await response.json();
            setSummary(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong. Please try another URL.');
        } finally {
            setIsProcessing(false);
        }
    };

    const copyToClipboard = () => {
        if (!summary) return;
        const text = `
Title: ${summary.title}
Summary: ${summary.description}
Key Points:
${summary.keyPoints.map(p => `- ${p}`).join('\n')}
        `.trim();
        navigator.clipboard.writeText(text);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    return (
        <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-12">
            <header className="text-center space-y-4 max-w-2xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-bold uppercase tracking-widest">
                    <Youtube className="w-3.5 h-3.5" />
                    AI Video Analysis
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                    YouTube <span className="text-indigo-500 italic">Summarizer</span>
                </h1>
                <p className="text-gray-400 text-lg">
                    Transform long videos into concise, actionable summaries in seconds.
                </p>
            </header>

            <section className="bg-zinc-900/50 border border-white/5 p-6 md:p-10 rounded-[40px] backdrop-blur-xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/5 rounded-full blur-3xl -mr-32 -mt-32 transition-transform group-hover:scale-110" />
                
                <div className="relative space-y-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="text"
                                placeholder="Paste YouTube video URL here..."
                                value={url}
                                onChange={(e) => setUrl(e.target.value)}
                                className="w-full bg-black/40 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-indigo-500 transition-all text-lg placeholder:text-gray-600"
                            />
                            {url && (
                                <button 
                                    onClick={() => setUrl('')}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full bg-white/5 hover:bg-white/10 text-gray-500 transition-all"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button 
                            onClick={handleSummarize}
                            disabled={isProcessing || !url}
                            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 shrink-0"
                        >
                            {isProcessing ? (
                                <>
                                    <Sparkles className="w-5 h-5 animate-spin" />
                                    Analyzing...
                                </>
                            ) : (
                                <>
                                    <Send className="w-5 h-5" />
                                    Summarize
                                </>
                            )}
                        </button>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                            >
                                <AlertCircle className="w-5 h-5" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </section>

            <AnimatePresence>
                {summary && (
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-12 gap-8"
                    >
                        {/* Video Info / Description */}
                        <div className="lg:col-span-12 bg-white/5 border border-white/10 p-8 rounded-[40px] space-y-6">
                            <div className="flex items-start justify-between gap-4">
                                <div className="space-y-2">
                                    <h2 className="text-2xl font-bold">{summary.title}</h2>
                                    <div className="flex items-center gap-3 text-xs text-gray-500 font-bold uppercase tracking-widest">
                                        <Clock className="w-3.5 h-3.5" />
                                        Summary Generated
                                        <span className="w-1 h-1 rounded-full bg-gray-700" />
                                        Youtube AI
                                    </div>
                                </div>
                                <button 
                                    onClick={copyToClipboard}
                                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex items-center gap-2 text-sm font-bold"
                                >
                                    {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                                    {isCopied ? 'Copied!' : 'Copy'}
                                </button>
                            </div>
                            <p className="text-gray-300 leading-relaxed text-lg italic">
                                "{summary.description}"
                            </p>
                        </div>

                        {/* Key Points */}
                        <div className="lg:col-span-7 bg-indigo-600/5 border border-indigo-500/20 p-8 rounded-[40px] space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <List className="w-6 h-6 text-indigo-400" />
                                Key Takeaways
                            </h3>
                            <div className="space-y-4">
                                {summary.keyPoints.map((point, i) => (
                                    <div key={i} className="flex gap-4 group">
                                        <div className="w-6 h-6 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 mt-0.5 text-[10px] font-black group-hover:bg-indigo-500 transition-all">
                                            {i + 1}
                                        </div>
                                        <p className="text-gray-300 leading-relaxed">{point}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Action Items */}
                        <div className="lg:col-span-5 bg-zinc-900/50 border border-white/10 p-8 rounded-[40px] space-y-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <Check className="w-6 h-6 text-green-500" />
                                Action Items
                            </h3>
                            <div className="space-y-4">
                                {summary.actionItems.map((item, i) => (
                                    <div key={i} className="flex gap-3 items-center">
                                        <div className="w-2 h-2 rounded-full bg-green-500" />
                                        <p className="text-gray-400 text-sm font-medium">{item}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {!summary && !isProcessing && (
                <div className="pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                    <div className="space-y-4 p-6 hover:bg-white/5 rounded-3xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                            <Play className="w-6 h-6 text-red-500" />
                        </div>
                        <h4 className="font-bold">Paste URL</h4>
                        <p className="text-sm text-gray-500">Just copy and paste any public YouTube link.</p>
                    </div>
                    <div className="space-y-4 p-6 hover:bg-white/5 rounded-3xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center mx-auto mb-6">
                            <Sparkles className="w-6 h-6 text-indigo-400" />
                        </div>
                        <h4 className="font-bold">AI Analysis</h4>
                        <p className="text-sm text-gray-500">Our AI processes the transcript in real-time.</p>
                    </div>
                    <div className="space-y-4 p-6 hover:bg-white/5 rounded-3xl transition-all">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mx-auto mb-6">
                            <FileText className="w-6 h-6 text-green-500" />
                        </div>
                        <h4 className="font-bold">Get Summary</h4>
                        <p className="text-sm text-gray-500">Read the highlights and take action.</p>
                    </div>
                </div>
            )}
        </div>
    );
}

const X = ({ className }: { className?: string }) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
)
