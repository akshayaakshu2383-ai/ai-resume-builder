"use client";

import React, { useState } from 'react';
import { 
    Search, Briefcase, MapPin, DollarSign, 
    Sparkles, ExternalLink, Filter, 
    BrainCircuit, Target, Globe, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Job {
    title: string;
    company: string;
    location: string;
    salary: string;
    link: string;
    matchScore: number;
    aiAnalysis: string;
}

export default function JobSearchPage() {
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [jobs, setJobs] = useState<Job[]>([]);
    const [error, setError] = useState<string | null>(null);

    const handleSearch = async () => {
        if (!query) return;
        setIsSearching(true);
        setError(null);
        setJobs([]);

        try {
            const response = await fetch('/api/jobs', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query, location })
            });

            if (!response.ok) throw new Error('Failed to find jobs. Check your API key.');

            const data = await response.json();
            setJobs(data.jobs || []);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSearching(false);
        }
    };

    return (
        <div className="p-4 md:p-8 max-w-6xl mx-auto space-y-12">
            <header className="space-y-4">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-xs font-bold uppercase tracking-widest">
                    <BrainCircuit className="w-3.5 h-3.5" />
                    Firecrawl Powered Search
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight">
                    AI <span className="text-indigo-500">Job Finder</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Discover high-quality job opportunities matched to your profile using real-time web crawling and AI analysis.
                </p>
            </header>

            <section className="bg-zinc-900/50 border border-white/5 p-6 md:p-10 rounded-[40px] backdrop-blur-xl shadow-2xl space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                    <div className="md:col-span-5 relative">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="text"
                            placeholder="Job title, keywords, or company..."
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-indigo-500 transition-all text-lg"
                        />
                    </div>
                    <div className="md:col-span-4 relative">
                        <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input 
                            type="text"
                            placeholder="Location (e.g. Remote, NYC)..."
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-2xl pl-16 pr-6 py-4 outline-none focus:border-indigo-500 transition-all text-lg"
                        />
                    </div>
                    <button 
                        onClick={handleSearch}
                        disabled={isSearching || !query}
                        className="md:col-span-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-3 active:scale-95 px-8 h-16"
                    >
                        {isSearching ? (
                            <>
                                <Sparkles className="w-5 h-5 animate-spin" />
                                Searching...
                            </>
                        ) : (
                            <>
                                <Target className="w-5 h-5" />
                                Find Jobs
                            </>
                        )}
                    </button>
                </div>

                <AnimatePresence>
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium"
                        >
                            {error}
                        </motion.div>
                    )}
                </AnimatePresence>
            </section>

            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold flex items-center gap-2 px-2">
                        <Briefcase className="w-5 h-5 text-indigo-400" />
                        {jobs.length > 0 ? `Found ${jobs.length} Opportunities` : 'Recent Jobs'}
                    </h2>
                    {jobs.length > 0 && (
                        <button className="flex items-center gap-2 text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-widest">
                            <Filter className="w-3.5 h-3.5" />
                            Sort by Match
                        </button>
                    )}
                </div>

                {jobs.length === 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3].map((ref) => (
                            <div key={ref} className="bg-white/5 border border-dashed border-white/10 p-10 rounded-[40px] text-center space-y-4 opacity-50">
                                <div className="w-16 h-16 rounded-3xl bg-white/5 mx-auto flex items-center justify-center">
                                    <Globe className="w-8 h-8 text-gray-700" />
                                </div>
                                <div className="space-y-1">
                                    <div className="h-4 w-32 bg-white/5 mx-auto rounded-full" />
                                    <div className="h-3 w-48 bg-white/5 mx-auto rounded-full" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map((job, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1 }}
                                className="group bg-zinc-900/50 border border-white/5 rounded-[40px] overflow-hidden hover:border-indigo-500/50 transition-all flex flex-col"
                            >
                                <div className="p-8 space-y-6 flex-1">
                                    <div className="flex justify-between items-start">
                                        <div className="w-14 h-14 rounded-2xl bg-indigo-600/10 flex items-center justify-center group-hover:bg-indigo-600/20 transition-colors">
                                            <Briefcase className="w-7 h-7 text-indigo-400" />
                                        </div>
                                        <div className="px-3 py-1.5 rounded-full bg-green-500/10 border border-green-500/20 text-green-500 text-[10px] font-black uppercase tracking-widest">
                                            {job.matchScore}% Match
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <h3 className="text-xl font-bold group-hover:text-indigo-400 transition-colors">{job.title}</h3>
                                        <p className="text-gray-400 font-medium">{job.company}</p>
                                    </div>

                                    <div className="flex flex-wrap gap-4 text-xs font-bold text-gray-500">
                                        <span className="flex items-center gap-1.5">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {job.location}
                                        </span>
                                        <span className="flex items-center gap-1.5">
                                            <DollarSign className="w-3.5 h-3.5" />
                                            {job.salary}
                                        </span>
                                    </div>

                                    <div className="pt-6 border-t border-white/5">
                                        <p className="text-sm text-gray-400 leading-relaxed line-clamp-3 italic">
                                            "{job.aiAnalysis}"
                                        </p>
                                    </div>
                                </div>

                                <a 
                                    href={job.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-6 bg-white/5 hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-sm font-bold border-t border-white/5"
                                >
                                    Apply Now
                                    <ExternalLink className="w-4 h-4" />
                                </a>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
