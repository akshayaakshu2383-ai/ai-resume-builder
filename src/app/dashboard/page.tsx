"use client";

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
    FileText, StickyNote, Youtube, Search, 
    Sparkles, ArrowRight, Zap, Star
} from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';

const tools = [
    {
        name: 'AI Resume Builder',
        description: 'Create premium, ATS-friendly resumes with AI-powered skill suggestions and real-time scoring.',
        href: '/builder',
        icon: FileText,
        color: 'bg-blue-500',
        gradient: 'from-blue-600 to-indigo-600',
        stat: 'ATS Optimized'
    },
    {
        name: 'Notes Saver',
        description: 'Securely store and organize your professional thoughts with AI smart titles and auto-tagging.',
        href: '/notes',
        icon: StickyNote,
        color: 'bg-purple-500',
        gradient: 'from-purple-600 to-pink-600',
        stat: 'AI Organized'
    },
    {
        name: 'YouTube AI Summarizer',
        description: 'Instantly transform any YouTube video into concise, actionable summaries and key takeaways.',
        href: '/summarizer',
        icon: Youtube,
        color: 'bg-red-500',
        gradient: 'from-red-600 to-orange-600',
        stat: 'Instant Insights'
    },
    {
        name: 'AI Job Search',
        description: 'Intelligent job discovery powered by Firecrawl, with AI compatibility matching for your profile.',
        href: '/jobs',
        icon: Search,
        color: 'bg-emerald-500',
        gradient: 'from-emerald-600 to-teal-600',
        stat: 'Smart Matching'
    }
];

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const supabase = createClient();

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }
            setUser(user);
        };
        getUser();
    }, []);

    if (!user) return null;

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8 lg:p-12">
            <div className="max-w-7xl mx-auto space-y-12">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="space-y-2">
                        <motion.h1 
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-4xl md:text-5xl font-extrabold tracking-tight"
                        >
                            Welcome back, <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{user.email?.split('@')[0]}</span>
                        </motion.h1>
                        <p className="text-gray-400 text-lg">Your AI-powered career growth command center.</p>
                    </div>
                </header>

                {/* Main Tools Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                    {tools.map((tool, i) => {
                        const Icon = tool.icon;
                        return (
                            <Link key={tool.name} href={tool.href}>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="group relative h-full bg-zinc-900/50 border border-white/5 rounded-[32px] p-8 hover:bg-zinc-900 transition-all duration-300 overflow-hidden"
                                >
                                    {/* Gradient Glow */}
                                    <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${tool.gradient} opacity-[0.03] group-hover:opacity-[0.08] blur-3xl transition-opacity`} />
                                    
                                    <div className="relative flex flex-col h-full">
                                        <div className="flex items-start justify-between mb-8">
                                            <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${tool.gradient} flex items-center justify-center shadow-xl`}>
                                                <Icon className="w-7 h-7 text-white" />
                                            </div>
                                            <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-widest text-gray-400 group-hover:text-white transition-colors">
                                                {tool.stat}
                                            </div>
                                        </div>

                                        <div className="space-y-4 mb-10">
                                            <h2 className="text-2xl font-bold tracking-tight group-hover:text-indigo-400 transition-colors">
                                                {tool.name}
                                            </h2>
                                            <p className="text-gray-400 leading-relaxed">
                                                {tool.description}
                                            </p>
                                        </div>

                                        <div className="mt-auto flex items-center gap-2 font-bold text-sm text-indigo-400 group-hover:gap-4 transition-all">
                                            Open Tool
                                            <ArrowRight className="w-4 h-4" />
                                        </div>
                                    </div>
                                </motion.div>
                            </Link>
                        );
                    })}
                </div>

                {/* Quick Stats/Tip Section */}
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 rounded-[32px] bg-gradient-to-r from-indigo-600/10 to-purple-600/10 border border-indigo-500/20 flex flex-col md:flex-row items-center justify-between gap-6"
                >
                    <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
                            <Zap className="w-6 h-6 text-indigo-400" />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg">Pro Tip: Try AI Smart Titles</h3>
                            <p className="text-gray-400">Our Notes Saver can now automatically generate professional titles for your snippets!</p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
