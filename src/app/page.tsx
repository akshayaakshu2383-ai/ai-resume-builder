"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Sparkles, Layout, Zap, Download, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
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
                    <Link href="/builder">
                        <button className="px-6 py-2 rounded-full bg-white text-black font-semibold hover:bg-gray-200 transition-colors text-sm">
                            Get Started
                        </button>
                    </Link>
                </div>
            </nav>

            <main>
                {/* Hero Section */}
                <section className="relative pt-32 pb-20 px-4 overflow-hidden">
                    {/* Background Gradients */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] pointer-events-none opacity-20">
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-600 rounded-full blur-[120px]" />
                    </div>

                    <div className="max-w-5xl mx-auto text-center relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-sm font-medium mb-6">
                                <ShieldCheck className="w-4 h-4" />
                                Trusted by 50,000+ Professionals
                            </div>
                            <h1 className="text-5xl md:text-7xl font-extrabold mb-8 tracking-tight leading-[1.1]">
                                Build a <span className="text-indigo-500">Standout</span> Resume <br />
                                Powered by Artificial Intelligence
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
                                Create a professional, ATS-friendly resume in minutes. Get AI-powered suggestions,
                                premium templates, and land your dream job faster.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link href="/builder">
                                    <button className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-lg flex items-center justify-center gap-2 group transition-all shadow-xl shadow-indigo-600/20">
                                        Build My Resume
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </Link>
                                <button className="px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-lg transition-all">
                                    View Templates
                                </button>
                            </div>
                        </motion.div>

                        {/* Resume Preview Image Placeholder */}
                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="mt-20 relative"
                        >
                            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-3xl blur opacity-20" />
                            <div className="relative bg-zinc-900 border border-white/10 rounded-3xl p-4 md:p-8 aspect-[16/9] flex items-center justify-center text-zinc-700">
                                <FileText className="w-32 h-32 opacity-20" />
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
