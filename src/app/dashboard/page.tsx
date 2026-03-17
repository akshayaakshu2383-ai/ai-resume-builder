"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
    Plus, FileText, Edit2, Trash2, 
    Layout, Clock, ChevronRight, Sparkles 
} from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Resume {
    id: string;
    data: any;
    template_id: string;
    updated_at: string;
}

export default function DashboardPage() {
    const [resumes, setResumes] = useState<Resume[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userName, setUserName] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    window.location.href = '/login';
                    return;
                }

                setUserName(user.user_metadata.full_name || user.email?.split('@')[0] || 'User');

                const { data, error } = await supabase
                    .from('resumes')
                    .select('*')
                    .eq('user_id', user.id)
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                setResumes(data || []);
            } catch (error) {
                console.error('Error fetching resumes:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    const deleteResume = async (id: string) => {
        if (!confirm('Are you sure you want to delete this resume?')) return;

        try {
            const supabase = createClient();
            const { error } = await supabase.from('resumes').delete().eq('id', id);
            if (error) throw error;
            setResumes(resumes.filter(r => r.id !== id));
        } catch (error) {
            console.error('Error deleting resume:', error);
            alert('Failed to delete resume');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
                    <p className="text-gray-400 font-medium animate-pulse">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto space-y-8">
                {/* Header */}
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-zinc-900/50 border border-white/5 p-8 rounded-[32px] backdrop-blur-xl">
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight">
                            Welcome back, <span className="text-indigo-400">{userName}</span>
                        </h1>
                        <p className="text-gray-400">Manage your professional resumes and career documents.</p>
                    </div>
                    <Link href="/builder">
                        <button className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95 text-sm">
                            <Plus className="w-5 h-5" />
                            Create New Resume
                        </button>
                    </Link>
                </header>

                {/* Resumes Grid */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Layout className="w-5 h-5 text-indigo-400" />
                        Your Resumes
                    </h2>

                    {resumes.length === 0 ? (
                        <div className="bg-zinc-900/30 border border-dashed border-white/10 rounded-[40px] p-20 text-center flex flex-col items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center">
                                <FileText className="w-10 h-10 text-gray-600" />
                            </div>
                            <div className="space-y-2">
                                <h3 className="text-xl font-bold text-gray-300">No resumes found</h3>
                                <p className="text-gray-500 max-w-sm">Start building your professional profile by creating your first resume.</p>
                            </div>
                            <Link href="/builder">
                                <button className="px-8 py-3 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition-all">
                                    Start Building
                                </button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {resumes.map((resume) => (
                                <motion.div
                                    key={resume.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="group bg-zinc-900/50 border border-white/10 rounded-[32px] overflow-hidden hover:border-indigo-500/50 transition-all"
                                >
                                    <div className="p-6 space-y-6">
                                        <div className="flex items-start justify-between">
                                            <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-indigo-600/10 transition-colors">
                                                <FileText className="w-7 h-7 text-gray-400 group-hover:text-indigo-400 transition-colors" />
                                            </div>
                                            <div className="flex gap-2">
                                                <Link href={`/builder?id=${resume.id}`}>
                                                    <button className="p-2.5 rounded-xl bg-white/5 hover:bg-indigo-600 text-white transition-all">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                </Link>
                                                <button 
                                                    onClick={() => deleteResume(resume.id)}
                                                    className="p-2.5 rounded-xl bg-white/5 hover:bg-red-600 text-white transition-all"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="space-y-1">
                                            <h3 className="font-bold text-lg truncate">
                                                {resume.data?.personal?.name || "Untitled Resume"}
                                            </h3>
                                            <p className="text-xs text-gray-500 font-medium uppercase tracking-widest">
                                                {resume.template_id} Template
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3.5 h-3.5" />
                                                {new Date(resume.updated_at).toLocaleDateString()}
                                            </div>
                                            <Link href={`/builder?id=${resume.id}`} className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-colors">
                                                Continue Editing
                                                <ChevronRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
