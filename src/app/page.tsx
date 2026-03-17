"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Layout, Zap, Download, ShieldCheck, ArrowRight, Trophy } from 'lucide-react';
import Link from 'next/link';
import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';

export default function LandingPage() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const supabase = createClient();

    useEffect(() => {
        const checkAuth = async () => {
            const { data: { user } } = await supabase.auth.getUser();
            setIsLoggedIn(!!user);
        };
        checkAuth();
    }, []);

    const handleGoogleLogin = async () => {
        await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white selection:bg-indigo-500/30">
            {/* Navbar */}
            <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-110 transition-transform">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                            AIResume
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        {isLoggedIn ? (
                            <Link href="/dashboard">
                                <button className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm">
                                    Dashboard
                                </button>
                            </Link>
                        ) : (
                            <button 
                                onClick={handleGoogleLogin}
                                className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm flex items-center gap-2"
                            >
                                <svg className="w-4 h-4" viewBox="0 0 24 24">
                                    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                                    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                                    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                                    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                                </svg>
                                <span>Sign in with Google</span>
                            </button>
                        )}
                    </div>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-6xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            {/* Trusted Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold uppercase tracking-widest mb-10 mx-auto">
                                <ShieldCheck className="w-4 h-4" />
                                Trusted by 50,000+ Professionals
                            </div>

                            {/* Main Heading */}
                            <h1 className="text-5xl md:text-8xl font-black mb-8 tracking-tight leading-[1.05] bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/40">
                                Build a <span className="text-indigo-500">Standout</span> Resume <br />
                                <span className="relative">
                                    Powered by AI
                                    <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500 to-transparent opacity-50" />
                                </span>
                            </h1>

                            {/* Subtext */}
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-medium">
                                Create a professional, ATS-friendly resume in minutes. Get AI-powered suggestions,
                                premium templates, and land your dream job faster.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
                                {isLoggedIn ? (
                                    <Link href="/dashboard" className="w-full sm:w-auto">
                                        <button className="w-full px-10 py-5 rounded-[20px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg flex items-center justify-center gap-2 group transition-all shadow-2xl shadow-indigo-600/40 active:scale-95">
                                            Go to Dashboard
                                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                        </button>
                                    </Link>
                                ) : (
                                    <button 
                                        onClick={handleGoogleLogin}
                                        className="w-full px-10 py-5 rounded-[20px] bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold text-lg flex items-center justify-center gap-3 group transition-all shadow-2xl shadow-indigo-600/40 active:scale-95"
                                    >
                                        <svg className="w-6 h-6" viewBox="0 0 24 24">
                                            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="currentColor"/>
                                            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="currentColor" opacity="0.8"/>
                                        </svg>
                                        Sign in with Google
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                )}
                            </div>
                        </motion.div>

                        {/* Premium 3D Mockup Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-20 relative px-4"
                        >
                            {/* Decorative Background Elements */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] pointer-events-none">
                                <div className="absolute top-[10%] left-[5%] w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl animate-pulse" />
                                <div className="absolute bottom-[10%] right-[5%] w-72 h-72 bg-purple-600/10 rounded-full blur-3xl animate-pulse delay-700" />
                            </div>

                            {/* Main 3D Card */}
                            <div className="relative group perspective-2000">
                                <motion.div 
                                    style={{ rotateX: 15, rotateY: -15 }}
                                    className="relative bg-[#12121e] border border-white/5 rounded-[40px] p-2 md:p-3 shadow-2xl transition-all duration-500 group-hover:rotate-x-0 group-hover:rotate-y-0"
                                >
                                    <div className="bg-[#0a0a0f] rounded-[32px] overflow-hidden aspect-[16/10] flex flex-col">
                                        {/* Mock UI Header */}
                                        <div className="h-12 border-b border-white/5 bg-white/5 flex items-center px-6 gap-2">
                                            <div className="w-2.5 h-2.5 rounded-full bg-red-400/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/20" />
                                            <div className="w-2.5 h-2.5 rounded-full bg-green-400/20" />
                                            <div className="flex-1" />
                                            <div className="w-32 h-2 bg-white/5 rounded-full" />
                                        </div>
                                        {/* Mock UI Content */}
                                        <div className="flex-1 grid grid-cols-12 gap-4 p-8">
                                            <div className="col-span-4 space-y-4">
                                                <div className="w-full h-32 bg-indigo-600/10 rounded-2xl border border-indigo-500/10 animate-pulse" />
                                                <div className="space-y-2">
                                                    <div className="w-full h-2 bg-white/5 rounded-full" />
                                                    <div className="w-1/2 h-2 bg-white/5 rounded-full" />
                                                </div>
                                            </div>
                                            <div className="col-span-8 space-y-6">
                                                <div className="space-y-3">
                                                    <div className="w-3/4 h-8 bg-white/5 rounded-xl border border-white/5" />
                                                    <div className="w-full h-4 bg-white/5 rounded-lg" />
                                                </div>
                                                <div className="grid grid-cols-3 gap-3">
                                                    <div className="h-10 bg-indigo-600/5 rounded-xl border border-indigo-500/10" />
                                                    <div className="h-10 bg-indigo-600/5 rounded-xl border border-indigo-500/10" />
                                                    <div className="h-10 bg-indigo-600/5 rounded-xl border border-indigo-500/10" />
                                                </div>
                                                <div className="w-full h-48 bg-white/5 rounded-[24px] border border-white/5 shadow-inner" />
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>

                                {/* Floating Elements */}
                                <motion.div 
                                    animate={{ y: [0, -20, 0] }}
                                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                    className="absolute -right-8 -top-8 bg-indigo-600 p-4 rounded-2xl shadow-2xl shadow-indigo-600/40 z-20"
                                >
                                    <Sparkles className="w-6 h-6 text-white" />
                                </motion.div>
                                <motion.div 
                                    animate={{ y: [0, 20, 0] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                    className="absolute -left-12 bottom-12 bg-white/10 backdrop-blur-xl border border-white/10 p-5 rounded-2xl shadow-2xl z-20 hidden md:block"
                                >
                                    <Trophy className="w-6 h-6 text-yellow-400" />
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Table Style */}
                <section className="py-20 px-4 bg-zinc-950/50">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-5xl font-bold mb-4">Everything you need to succeed</h2>
                            <p className="text-gray-400">Professional tools designed for your career growth</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    icon: <Zap className="w-6 h-6 text-yellow-400" />,
                                    title: "AI Generation",
                                    desc: "Personalized suggestions to improve your resume based on industry."
                                },
                                {
                                    icon: <Layout className="w-6 h-6 text-indigo-400" />,
                                    title: "Multiple Templates",
                                    desc: "Choose from 3 unique designs - Classic, Modern, and Creative."
                                },
                                {
                                    icon: <Download className="w-6 h-6 text-emerald-400" />,
                                    title: "Instant Download",
                                    desc: "Download your professional resume as a high-quality PDF instantly."
                                }
                            ].map((feature, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-indigo-500/50 transition-colors group">
                                    <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
                                    <p className="text-gray-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-10 border-t border-white/5 text-center text-gray-500 text-sm">
                &copy; 2026 AIResume. Built for Modern Professionals.
            </footer>
        </div>
    );
}
