"use client";

import React, { useState, useRef } from 'react';
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
import { useReactToPrint } from 'react-to-print';

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
        name: 'Akshaya',
        email: 'akshaya@example.com',
        phone: '+91 98765 43210',
        summary: 'Experienced software engineer with a passion for building scalable and efficient systems.',
        title: 'Software Engineer'
    },
    experiences: [{
        id: '1',
        company: 'Tech Solutions Inc.',
        position: 'Full Stack Developer',
        duration: '2021 - Present',
        description: 'Developing high-performance React applications and optimizing Node.js microservices.'
    }],
    educations: [{ id: '1', school: 'Tech University', degree: 'B.Tech in CS', year: '2021' }],
    schooling: {
        tenth: { school: '', board: 'CBSE', percentage: '', year: '' },
        twelfth: { school: '', board: 'CBSE', percentage: '', year: '' },
    },
    skills: ['JavaScript', 'React', 'Node.js', 'MongoDB', 'TypeScript'],
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
    const contentRef = useRef<HTMLDivElement>(null);

    const handlePrint = useReactToPrint({
        contentRef,
    });

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

    const mockImproveExperience = (id: string) => {
        setIsImproving(id);
        setTimeout(() => {
            setData(prev => ({
                ...prev,
                experiences: prev.experiences.map(exp => {
                    if (exp.id === id) {
                        return {
                            ...exp,
                            description: "Engineered scalable web architectures using React and Node.js, resulting in a 40% improvement in load times. Spearheaded the implementation of automated testing suites reducing production bugs by 25%. Collaborated with cross-functional teams to deliver enterprise-grade features on tight deadlines."
                        };
                    }
                    return exp;
                })
            }));
            setIsImproving(null);
        }, 1500);
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

    const resumeScore = Math.min(
        (data.personal.name ? 10 : 0) +
        (data.personal.summary ? 15 : 0) +
        (data.experiences.length * 20) +
        (data.skills.length * 5) +
        (data.educations.length * 15),
        100
    );

    return (
        <div className="min-h-screen bg-[#0a0a0f] text-white">
            {/* Header */}
            <header className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                            <Sparkles className="w-5 h-5" />
                        </div>
                        <h1 className="font-bold text-lg hidden sm:block">AI Resume Builder</h1>
                    </div>

                    <div className="hidden md:flex items-center gap-6 px-6 border-x border-white/5">
                        <div className="flex items-center gap-2">
                            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${resumeScore}%` }}
                                    className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500"
                                />
                            </div>
                            <span className="text-xs font-bold text-gray-400">Score: {resumeScore}%</span>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-2 text-sm font-medium"
                        >
                            <Eye className="w-4 h-4" />
                            {showPreview ? "Edit Mode" : "Preview"}
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
                                                    onClick={() => mockImproveExperience(exp.id)}
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
                                        <h3 className="text-sm font-bold flex items-center gap-2 text-indigo-400 mb-4">
                                            <Trophy className="w-4 h-4" /> AI Keyword Suggestions for {data.personal.title || 'Engineer'}
                                        </h3>
                                        <div className="flex flex-wrap gap-2 text-xs">
                                            {['Microservices', 'GraphQL', 'Docker', 'AWS', 'System Design', 'CI/CD'].map(s => (
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
