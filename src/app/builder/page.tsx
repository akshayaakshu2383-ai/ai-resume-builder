"use client";

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    User, Briefcase, GraduationCap, Code,
    ChevronRight, ChevronLeft, Sparkles, Plus, Trash2,
    Download, Layout as LayoutIcon, Eye, CheckCircle2,
    Trophy, Wand2
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { ClassicTemplate, ModernTemplate, CreativeTemplate } from '@/components/templates/ResumeTemplates';
import Link from 'next/link';
import { useReactToPrint } from 'react-to-print';
import { createClient } from '@/utils/supabase/client';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

// Types
interface Experience {
    id: string;
    company: string;
    position: string;
    duration: string;
    description: string;
}

interface Education {
    id: string;
    school: string;
    degree: string;
    year: string;
}

interface Schooling {
    tenth: { school: string; board: string; percentage: string; year: string; };
    twelfth: { school: string; board: string; percentage: string; year: string; };
}

interface ResumeData {
    personal: {
        name: string;
        email: string;
        phone: string;
        summary: string;
        title: string;
    };
    experiences: Experience[];
    educations: Education[];
    schooling: Schooling;
    skills: string[];
}

const INITIAL_DATA: ResumeData = {
    personal: {
        name: '',
        email: '',
        phone: '',
        summary: '',
        title: ''
    },
    experiences: [],
    educations: [],
    schooling: {
        tenth: { school: '', board: '', percentage: '', year: '' },
        twelfth: { school: '', board: '', percentage: '', year: '' },
    },
    skills: [],
};

const STEPS = [
    { id: 'personal', title: 'Personal', icon: User },
    { id: 'experience', title: 'Experience', icon: Briefcase },
    { id: 'education', title: 'Education', icon: GraduationCap },
    { id: 'skills', title: 'Skills', icon: Code },
];

export default function BuilderPage() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<ResumeData>(INITIAL_DATA);
    const [showPreview, setShowPreview] = useState(false);
    const [template, setTemplate] = useState<'classic' | 'modern' | 'creative'>('modern');
    const [isImproving, setIsImproving] = useState<string | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [resumeId, setResumeId] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAnalyzingAts, setIsAnalyzingAts] = useState(false);
    const [atsAnalysis, setAtsAnalysis] = useState<{ score: number; tips: string[] } | null>(null);
    const [suggestedSkills, setSuggestedSkills] = useState<string[]>([]);
    const [isFetchingSkills, setIsFetchingSkills] = useState(false);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const fetchResume = async () => {
            try {
                const supabase = createClient();
                const { data: { user } } = await supabase.auth.getUser();

                if (!user) {
                    setIsLoading(false);
                    return;
                }

                const urlParams = new URLSearchParams(window.location.search);
                const id = urlParams.get('id');

                let query = supabase
                    .from('resumes')
                    .select('*')
                    .eq('user_id', user.id);
                
                if (id) {
                    query = query.eq('id', id);
                } else {
                    query = query.order('updated_at', { ascending: false }).limit(1);
                }

                const { data, error } = await query.single();

                if (error && error.code !== 'PGRST116') { // PGRST116 is 'no rows returned'
                    throw error;
                }

                if (data) {
                    setData(data.data);
                    setTemplate(data.template_id as any);
                    setResumeId(data.id);
                }
            } catch (error) {
                console.error("Error fetching resume:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchResume();
    }, []);

    const handlePrint = useReactToPrint({
        contentRef,
    });

    const resetForm = () => {
        if (confirm("Are you sure you want to start a new resume? Any unsaved changes will be lost.")) {
            setData(INITIAL_DATA);
            setResumeId(null);
            setStep(0);
            setAtsAnalysis(null);
            setSuggestedSkills([]);
        }
    };

    // Handlers
    const updatePersonal = (field: keyof ResumeData['personal'], value: string) => {
        setData(prev => ({ ...prev, personal: { ...prev.personal, [field]: value } }));
    };

    const addExperience = () => {
        setData(prev => ({
            ...prev,
            experiences: [...prev.experiences, { id: Math.random().toString(), company: '', position: '', duration: '', description: '' }]
        }));
    };

    const updateExperience = (id: string, field: keyof Experience, value: string) => {
        setData(prev => ({
            ...prev,
            experiences: prev.experiences.map(exp => exp.id === id ? { ...exp, [field]: value } : exp)
        }));
    };

    const improveExperience = async (id: string) => {
        const exp = data.experiences.find(e => e.id === id);
        if (!exp || !exp.description) return;

        setIsImproving(id);
        try {
            const response = await fetch('/api/improve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: exp.description,
                    type: 'experience'
                })
            });

            const result = await response.json();
            if (result.content) {
                setData(prev => ({
                    ...prev,
                    experiences: prev.experiences.map(e => 
                        e.id === id ? { ...e, description: result.content } : e
                    )
                }));
            }
        } catch (error) {
            console.error("Error improving experience:", error);
            alert("Failed to improve description");
        } finally {
            setIsImproving(null);
        }
    };

    const removeExperience = (id: string) => {
        setData(prev => ({ ...prev, experiences: prev.experiences.filter(exp => exp.id !== id) }));
    };

    const addEducation = () => {
        setData(prev => ({
            ...prev,
            educations: [...prev.educations, { id: Math.random().toString(), school: '', degree: '', year: '' }]
        }));
    };

    const updateEducation = (id: string, field: keyof Education, value: string) => {
        setData(prev => ({
            ...prev,
            educations: prev.educations.map(edu => edu.id === id ? { ...edu, [field]: value } : edu)
        }));
    };

    const removeEducation = (id: string) => {
        setData(prev => ({ ...prev, educations: prev.educations.filter(edu => edu.id !== id) }));
    };

    const updateSchooling = (
        level: 'tenth' | 'twelfth',
        field: keyof Schooling['tenth'],
        value: string
    ) => {
        setData(prev => ({
            ...prev,
            schooling: {
                ...prev.schooling,
                [level]: { ...prev.schooling[level], [field]: value }
            }
        }));
    };

    const addSkill = (skill: string) => {
        if (skill && !data.skills.includes(skill)) {
            setData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
        }
    };

    const removeSkill = (skill: string) => {
        setData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
    };

    const fetchSkillSuggestions = async () => {
        if (!data.personal.title) {
            alert("Please enter a Job Title first to get relevant skill suggestions.");
            return;
        }
        setIsFetchingSkills(true);
        try {
            const response = await fetch('/api/improve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    context: data.personal.title,
                    type: 'skills'
                })
            });
            const result = await response.json();
            if (result.content) {
                const skills = result.content.split(',').map((s: string) => s.trim());
                setSuggestedSkills(skills);
            }
        } catch (error) {
            console.error("Error fetching skills:", error);
        } finally {
            setIsFetchingSkills(false);
        }
    };

    const runAtsAnalysis = async () => {
        setIsAnalyzingAts(true);
        try {
            const response = await fetch('/api/improve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    content: data,
                    type: 'ats_score'
                })
            });
            const result = await response.json();
            if (result.content) {
                try {
                    const analysis = JSON.parse(result.content);
                    setAtsAnalysis(analysis);
                } catch (e) {
                    console.error("Failed to parse ATS analysis:", e);
                }
            }
        } catch (error) {
            console.error("Error analyzing ATS:", error);
        } finally {
            setIsAnalyzingAts(false);
        }
    };

    const handleSave = async () => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();

            if (!user) {
                alert("Please log in to save your resume");
                return;
            }

            const { data: savedData, error } = await supabase
                .from('resumes')
                .upsert({
                    id: resumeId || undefined,
                    user_id: user.id,
                    data: data,
                    template_id: template,
                    updated_at: new Error().stack?.includes('upsert') ? undefined : new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;

            if (savedData) {
                setResumeId(savedData.id);
                alert("Resume saved successfully!");
            }
        } catch (error: any) {
            console.error("Error saving resume:", error);
            alert("Failed to save resume: " + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const resumeScore = Math.min(
        (data.personal.name ? 10 : 0) +
        (data.personal.summary ? 15 : 0) +
        (data.experiences.length * 20) +
        (data.skills.length * 5) +
        (data.educations.length * 15),
        100
    );

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
                    <p className="text-gray-400 font-medium animate-pulse">Loading your resume...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                    <Link href="/dashboard" className="flex items-center gap-4 group">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="font-bold text-lg hidden sm:block">AI Resume Builder</h1>
                    </Link>
                    </div>

                    <div className="hidden md:flex items-center gap-6 px-6 border-x border-white/5">
                        <button 
                            onClick={runAtsAnalysis}
                            disabled={isAnalyzingAts}
                            className="flex items-center gap-3 group"
                        >
                            <div className="flex flex-col items-end">
                                <div className="flex items-center gap-2">
                                    <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${atsAnalysis?.score || resumeScore}%` }}
                                            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                        />
                                    </div>
                                    <span className="text-xs font-bold text-gray-400">Score: {atsAnalysis?.score || resumeScore}%</span>
                                </div>
                                <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                                    {isAnalyzingAts ? 'Analyzing...' : 'Click for AI Analysis'}
                                </span>
                            </div>
                            <Wand2 className={cn("w-4 h-4 text-indigo-400", isAnalyzingAts && "animate-spin")} />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={resetForm}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-gray-400 hover:text-white"
                        >
                            New
                        </button>
                        <button
                            onClick={async () => {
                                const { createClient } = await import('@/utils/supabase/client');
                                const supabase = createClient();
                                await supabase.auth.signOut();
                                window.location.href = '/login';
                            }}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium text-red-400 hover:text-red-300"
                        >
                            Logout
                        </button>
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            {showPreview ? "Edit Mode" : "Preview"}
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={cn(
                                "px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium",
                                isSaving && "opacity-50 cursor-not-allowed"
                            )}
                        >
                            <Sparkles className={cn("w-4 h-4 text-indigo-400", isSaving && "animate-spin")} />
                            {isSaving ? "Saving..." : "Save"}
                        </button>
                        <button
                            onClick={() => handlePrint()}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 transition-all flex items-center gap-2 text-sm font-bold shadow-lg shadow-indigo-600/20"
                        >
                            <Download className="w-4 h-4" />
                            Download
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Left Panel: Forms */}
                <div className={cn("space-y-8", showPreview && "hidden lg:block")}>
                    {/* Template Switcher */}
                    <div className="flex p-1.5 bg-white/5 rounded-2xl border border-white/10 w-fit">
                        {[
                            { id: 'classic', label: 'Classic' },
                            { id: 'modern', label: 'Modern' },
                            { id: 'creative', label: 'Creative' }
                        ].map(t => (
                            <button
                                key={t.id}
                                onClick={() => setTemplate(t.id as any)}
                                className={cn(
                                    "px-4 py-1.5 rounded-xl text-xs font-bold transition-all",
                                    template === t.id ? "bg-white text-black shadow-lg" : "text-gray-400 hover:text-white"
                                )}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    {/* Progress Nav */}
                    <div className="flex items-center justify-between bg-white/5 p-2 rounded-2xl border border-white/10">
                        {STEPS.map((s, i) => (
                            <button
                                key={s.id}
                                onClick={() => setStep(i)}
                                className={cn(
                                    "flex items-center gap-2 px-4 py-2 rounded-xl transition-all relative",
                                    step === i ? "bg-indigo-600 text-white" : "text-gray-400 hover:text-white"
                                )}
                            >
                                <s.icon className="w-4 h-4" />
                                <span className="text-sm font-medium hidden md:block">{s.title}</span>
                                {i < step && <CheckCircle2 className="w-3 h-3 absolute -top-1 -right-1 text-emerald-400" />}
                            </button>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={step}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            className="bg-zinc-900/50 border border-white/5 rounded-3xl p-6 md:p-8"
                        >
                            {step === 0 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <User className="text-indigo-400" /> Personal Details
                                    </h2>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Full Name</label>
                                            <input
                                                value={data.personal.name}
                                                onChange={(e) => updatePersonal('name', e.target.value)}
                                                placeholder="John Doe"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Job Title</label>
                                            <input
                                                value={data.personal.title}
                                                onChange={(e) => updatePersonal('title', e.target.value)}
                                                placeholder="Software Engineer"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Email</label>
                                            <input
                                                value={data.personal.email}
                                                onChange={(e) => updatePersonal('email', e.target.value)}
                                                placeholder="john@example.com"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm text-gray-400 ml-1">Phone</label>
                                            <input
                                                value={data.personal.phone}
                                                onChange={(e) => updatePersonal('phone', e.target.value)}
                                                placeholder="+1 234 567 890"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-sm text-gray-400 ml-1">Professional Summary</label>
                                        <textarea
                                            value={data.personal.summary}
                                            onChange={(e) => updatePersonal('summary', e.target.value)}
                                            placeholder="Write a brief professional summary..."
                                            rows={4}
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all resize-none"
                                        />
                                    </div>
                                </div>
                            )}

                            {step === 1 && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold flex items-center gap-2">
                                            <Briefcase className="text-indigo-400" /> Work Experience
                                        </h2>
                                        <button
                                            onClick={addExperience}
                                            className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all border border-indigo-600/30"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {data.experiences.map((exp, idx) => (
                                        <div key={exp.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                                            <button
                                                onClick={() => removeExperience(exp.id)}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    value={exp.company}
                                                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                                                    placeholder="Company Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                                <input
                                                    value={exp.position}
                                                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                                                    placeholder="Position"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                                <input
                                                    value={exp.duration}
                                                    onChange={(e) => updateExperience(exp.id, 'duration', e.target.value)}
                                                    placeholder="Duration (e.g. 2021 - Present)"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                            <div className="relative">
                                                <textarea
                                                    value={exp.description}
                                                    onChange={(e) => updateExperience(exp.id, 'description', e.target.value)}
                                                    placeholder="Key responsibilities and achievements..."
                                                    rows={3}
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all resize-none pr-12"
                                                />
                                                <button
                                                    onClick={() => improveExperience(exp.id)}
                                                    className={cn(
                                                        "absolute right-3 bottom-3 p-2 rounded-lg bg-indigo-600 text-white shadow-lg shadow-indigo-600/20 hover:scale-105 transition-all",
                                                        isImproving === exp.id && "animate-pulse"
                                                    )}
                                                >
                                                    {isImproving === exp.id ? <Wand2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <GraduationCap className="text-indigo-400" /> Education
                                    </h2>

                                    {/* 10th Row */}
                                    <div className="p-5 rounded-2xl bg-indigo-950/40 border border-indigo-500/20 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 rounded-full">10th Standard</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                value={data.schooling.tenth.school}
                                                onChange={(e) => updateSchooling('tenth', 'school', e.target.value)}
                                                placeholder="School Name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.tenth.board}
                                                onChange={(e) => updateSchooling('tenth', 'board', e.target.value)}
                                                placeholder="Board (e.g. CBSE, ICSE, State)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.tenth.percentage}
                                                onChange={(e) => updateSchooling('tenth', 'percentage', e.target.value)}
                                                placeholder="Percentage / CGPA (e.g. 92% or 9.2)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.tenth.year}
                                                onChange={(e) => updateSchooling('tenth', 'year', e.target.value)}
                                                placeholder="Year of Passing (e.g. 2018)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* 12th Row */}
                                    <div className="p-5 rounded-2xl bg-purple-950/40 border border-purple-500/20 space-y-4">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-black uppercase tracking-widest text-purple-400 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full">12th Standard</span>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input
                                                value={data.schooling.twelfth.school}
                                                onChange={(e) => updateSchooling('twelfth', 'school', e.target.value)}
                                                placeholder="School / Junior College Name"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.twelfth.board}
                                                onChange={(e) => updateSchooling('twelfth', 'board', e.target.value)}
                                                placeholder="Board (e.g. CBSE, ICSE, State)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.twelfth.percentage}
                                                onChange={(e) => updateSchooling('twelfth', 'percentage', e.target.value)}
                                                placeholder="Percentage / CGPA (e.g. 88% or 8.8)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                                            />
                                            <input
                                                value={data.schooling.twelfth.year}
                                                onChange={(e) => updateSchooling('twelfth', 'year', e.target.value)}
                                                placeholder="Year of Passing (e.g. 2020)"
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-purple-500 outline-none transition-all"
                                            />
                                        </div>
                                    </div>

                                    {/* Higher Education */}
                                    <div className="flex items-center justify-between">
                                        <p className="text-sm font-semibold text-gray-400">Higher Education (Degree / Diploma)</p>
                                        <button
                                            onClick={addEducation}
                                            className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600/30 transition-all border border-indigo-600/30"
                                        >
                                            <Plus className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {data.educations.map((edu) => (
                                        <div key={edu.id} className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-4 relative group">
                                            <button
                                                onClick={() => removeEducation(edu.id)}
                                                className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <input
                                                    value={edu.school}
                                                    onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                                    placeholder="University / College Name"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                                <input
                                                    value={edu.degree}
                                                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                                    placeholder="Degree (e.g. B.Tech, MCA)"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                                <input
                                                    value={edu.year}
                                                    onChange={(e) => updateEducation(edu.id, 'year', e.target.value)}
                                                    placeholder="Year of Passing"
                                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                                />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-6">
                                    <h2 className="text-2xl font-bold flex items-center gap-2">
                                        <Code className="text-indigo-400" /> Skills & Expertise
                                    </h2>
                                    <div className="space-y-4">
                                        <input
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') {
                                                    addSkill((e.target as HTMLInputElement).value);
                                                    (e.target as HTMLInputElement).value = '';
                                                }
                                            }}
                                            placeholder="Type a skill and press Enter (e.g. React, Python)"
                                            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:border-indigo-500 outline-none transition-all"
                                        />
                                        <div className="flex flex-wrap gap-2">
                                            {data.skills.map(skill => (
                                                <span
                                                    key={skill}
                                                    className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 flex items-center gap-2 text-sm group"
                                                >
                                                    {skill}
                                                    <button onClick={() => removeSkill(skill)}>
                                                        <Trash2 className="w-3 h-3 text-gray-500 group-hover:text-red-400" />
                                                    </button>
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Skill Suggestions */}
                                    <div className="p-6 rounded-3xl bg-indigo-600/10 border border-indigo-500/20">
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400">
                                                <Trophy className="w-4 h-4" /> AI Keyword Suggestions for {data.personal.title || 'Engineer'}
                                            </h3>
                                            <button 
                                                onClick={fetchSkillSuggestions}
                                                disabled={isFetchingSkills}
                                                className="text-[10px] font-black uppercase tracking-widest text-indigo-400 hover:text-indigo-300 disabled:opacity-50 transition-colors"
                                            >
                                                {isFetchingSkills ? 'Refreshing...' : 'Refresh Suggestions'}
                                            </button>
                                        </div>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {(suggestedSkills.length > 0 ? suggestedSkills : ['Microservices', 'GraphQL', 'Docker', 'AWS', 'System Design', 'CI/CD']).map(s => (
                                                <button
                                                    key={s}
                                                    onClick={() => addSkill(s)}
                                                    className="px-3 py-1.5 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-all text-gray-300"
                                                >
                                                    + {s}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/10">
                        <button
                            disabled={step === 0}
                            onClick={() => setStep(s => s - 1)}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </button>
                        <div className="text-sm font-medium text-gray-400">Step {step + 1} of 4</div>
                        <button
                            disabled={step === 3}
                            onClick={() => setStep(s => s + 1)}
                            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-600/20"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </button>
                    </div>
                </div>

                {/* Right Panel: Preview */}
                <div className={cn("hidden lg:block h-fit sticky top-24", showPreview && "block col-span-1 lg:col-span-1")}>
                    <div className="bg-zinc-800 rounded-[32px] p-4 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-white/5">
                        <div className="bg-white rounded-[24px] shadow-sm aspect-[1/1.414] text-black overflow-hidden relative" ref={contentRef}>
                            {template === 'classic' && <ClassicTemplate data={data} />}
                            {template === 'modern' && <ModernTemplate data={data} />}
                            {template === 'creative' && <CreativeTemplate data={data} />}

                            {/* Empty State Help */}
                            {!data.personal.name && (
                                <div className="absolute inset-0 flex items-center justify-center bg-white/90 backdrop-blur-sm pointer-events-none p-12 text-center">
                                    <div className="space-y-4 grayscale opacity-50">
                                        <Eye className="w-12 h-12 mx-auto text-gray-300" />
                                        <p className="text-sm font-medium text-gray-400">Fill in the form to see your resume take shape in real-time</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
