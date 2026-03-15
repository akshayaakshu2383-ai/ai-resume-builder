"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
    Plus, StickyNote, Search, Trash2, 
    Save, Clock, Tag, ChevronRight,
    Sparkles, X, Edit3, Wand2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface Note {
    id: string;
    title: string;
    content: string;
    tags: string[];
    updated_at: string;
}

export default function NotesPage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeNote, setActiveNote] = useState<Note | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [showEditor, setShowEditor] = useState(false);
    const [isGeneratingTitle, setIsGeneratingTitle] = useState(false);
    const [isGeneratingTags, setIsGeneratingTags] = useState(false);
    const [lastSavedContent, setLastSavedContent] = useState('');

    useEffect(() => {
        const init = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) {
                window.location.href = '/login';
                return;
            }
            fetchNotes();
        };
        init();
    }, []);

    // Debounced Auto-save
    useEffect(() => {
        const timer = setTimeout(() => {
            if (activeNote && activeNote.id && activeNote.content !== lastSavedContent) {
                handleSave(activeNote);
                setLastSavedContent(activeNote.content);
            }
        }, 2000); // 2 second delay

        return () => clearTimeout(timer);
    }, [activeNote?.content]);

    const fetchNotes = async () => {
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data, error } = await supabase
                .from('notes')
                .select('*')
                .eq('user_id', user.id)
                .order('updated_at', { ascending: false });

            if (error) throw error;
            setNotes(data || []);
        } catch (error) {
            console.error('Error fetching notes:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSave = async (note: Partial<Note>) => {
        setIsSaving(true);
        try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (!user) return;

            const { data: savedNote, error } = await supabase
                .from('notes')
                .upsert({
                    ...note,
                    user_id: user.id,
                    updated_at: new Date().toISOString()
                })
                .select()
                .single();

            if (error) throw error;
            
            if (activeNote?.id === savedNote.id) {
                setActiveNote(savedNote);
            }
            
            fetchNotes();
            if (!activeNote) setShowEditor(false);
        } catch (error) {
            console.error('Error saving note:', error);
        } finally {
            setIsSaving(false);
        }
    };

    const generateAiTitle = async () => {
        if (!activeNote?.content) return;
        setIsGeneratingTitle(true);
        try {
            const response = await fetch('/api/improve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    context: activeNote.content,
                    type: 'note_title'
                })
            });
            const result = await response.json();
            if (result.content) {
                setActiveNote(prev => prev ? { ...prev, title: result.content.replace(/^"|"$/g, '') } : null);
            }
        } catch (error) {
            console.error('Error generating title:', error);
        } finally {
            setIsGeneratingTitle(false);
        }
    };

    const generateAiTags = async () => {
        if (!activeNote?.content) return;
        setIsGeneratingTags(true);
        try {
            const response = await fetch('/api/improve', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    context: activeNote.content,
                    type: 'note_tags'
                })
            });
            const result = await response.json();
            if (result.content) {
                const tags = result.content.split(',').map((s: string) => s.trim());
                setActiveNote(prev => prev ? { ...prev, tags } : null);
            }
        } catch (error) {
            console.error('Error generating tags:', error);
        } finally {
            setIsGeneratingTags(false);
        }
    };

    const deleteNote = async (id: string) => {
        if (!confirm('Delete this note?')) return;
        try {
            const supabase = createClient();
            const { error } = await supabase.from('notes').delete().eq('id', id);
            if (error) throw error;
            setNotes(notes.filter(n => n.id !== id));
            if (activeNote?.id === id) {
                setActiveNote(null);
                setShowEditor(false);
            }
        } catch (error) {
            console.error('Error deleting note:', error);
        }
    };

    const filteredNotes = notes.filter(n => 
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[80vh]">
                <Sparkles className="w-12 h-12 text-indigo-500 animate-pulse" />
            </div>
        );
    }

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-3">
                        <StickyNote className="w-8 h-8 text-indigo-400" />
                        Notes Saver
                    </h1>
                    <p className="text-gray-400">Securely store your professional thoughts and snippets.</p>
                </div>
                <button 
                    onClick={() => {
                        setActiveNote({ id: '', title: '', content: '', tags: [], updated_at: '' });
                        setShowEditor(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 rounded-2xl font-bold transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
                >
                    <Plus className="w-5 h-5" />
                    New Note
                </button>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-[calc(100vh-250px)]">
                {/* Notes List */}
                <div className="lg:col-span-4 flex flex-col gap-4 overflow-hidden">
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input 
                            type="text"
                            placeholder="Search notes..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-indigo-500 transition-all text-sm"
                        />
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {filteredNotes.map((note) => (
                            <button
                                key={note.id}
                                onClick={() => {
                                    setActiveNote(note);
                                    setLastSavedContent(note.content);
                                    setShowEditor(true);
                                }}
                                className={cn(
                                    "w-full text-left p-4 rounded-2xl border transition-all group",
                                    activeNote?.id === note.id 
                                        ? "bg-indigo-600/10 border-indigo-500/50" 
                                        : "bg-white/5 border-white/5 hover:bg-white/10"
                                )}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-bold truncate pr-6">{note.title || 'Untitled Note'}</h3>
                                    <button 
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            deleteNote(note.id);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-500/20 text-gray-500 hover:text-red-400 transition-all"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <p className="text-sm text-gray-400 line-clamp-2 mb-4">
                                    {note.content || 'Empty note...'}
                                </p>
                                <div className="flex items-center justify-between text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                    <span className="flex items-center gap-1.5">
                                        <Clock className="w-3 h-3" />
                                        {new Date(note.updated_at).toLocaleDateString()}
                                    </span>
                                    {note.tags.length > 0 && (
                                        <span className="flex items-center gap-1.5">
                                            <Tag className="w-3 h-3" />
                                            {note.tags[0]}
                                        </span>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Editor Area */}
                <div className="lg:col-span-8 bg-zinc-900/50 border border-white/5 rounded-[32px] overflow-hidden flex flex-col backdrop-blur-xl">
                    <AnimatePresence mode="wait">
                        {showEditor && activeNote ? (
                            <motion.div 
                                key="editor"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col h-full"
                            >
                                <div className="p-6 border-b border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-4 flex-1">
                                        <input 
                                            type="text"
                                            value={activeNote.title}
                                            onChange={(e) => setActiveNote({ ...activeNote, title: e.target.value })}
                                            placeholder="Note title..."
                                            className="bg-transparent text-xl font-bold outline-none flex-1 placeholder:text-gray-600 pr-4"
                                        />
                                        <button 
                                            onClick={generateAiTitle}
                                            disabled={isGeneratingTitle || !activeNote.content}
                                            className="p-2 rounded-lg bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 transition-all border border-indigo-500/20 group relative"
                                            title="Generate AI Title"
                                        >
                                            {isGeneratingTitle ? <Sparkles className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                                            <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-800 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-white/10">
                                                AI Smart Title
                                            </span>
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button 
                                            onClick={() => handleSave(activeNote)}
                                            disabled={isSaving}
                                            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 rounded-xl font-bold text-sm transition-all shadow-lg shadow-indigo-600/20"
                                        >
                                            {isSaving ? <Sparkles className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                            {isSaving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button 
                                            onClick={() => setShowEditor(false)}
                                            className="p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 transition-all border border-white/10"
                                        >
                                            <X className="w-5 h-5" />
                                        </button>
                                    </div>
                                </div>

                                {/* Metadata Row */}
                                <div className="px-6 py-3 border-b border-white/5 bg-white/5 flex items-center justify-between gap-4">
                                    <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
                                        <Tag className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                                        {activeNote.tags.map((tag, i) => (
                                            <span key={i} className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-[10px] text-gray-400 whitespace-nowrap">
                                                {tag}
                                            </span>
                                        ))}
                                        <button 
                                            onClick={generateAiTags}
                                            disabled={isGeneratingTags || !activeNote.content}
                                            className="flex items-center gap-1 text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors shrink-0"
                                        >
                                            {isGeneratingTags ? <Sparkles className="w-3 h-3 animate-spin" /> : '+ AI Tags'}
                                        </button>
                                    </div>
                                    <div className="text-[10px] text-gray-500 italic shrink-0 font-medium">
                                        {isSaving ? 'Saving changes...' : (activeNote.content === lastSavedContent ? 'All changes saved' : 'Unsaved changes...')}
                                    </div>
                                </div>
                                <div className="flex-1 p-6">
                                    <textarea 
                                        value={activeNote.content}
                                        onChange={(e) => setActiveNote({ ...activeNote, content: e.target.value })}
                                        placeholder="Start writing your thoughts..."
                                        className="w-full h-full bg-transparent outline-none resize-none text-gray-300 leading-relaxed placeholder:text-gray-700"
                                    />
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div 
                                key="empty"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="flex flex-col items-center justify-center h-full text-center p-12 space-y-4"
                            >
                                <div className="w-20 h-20 rounded-[32px] bg-white/5 flex items-center justify-center">
                                    <Edit3 className="w-10 h-10 text-gray-700" />
                                </div>
                                <div className="space-y-2">
                                    <h2 className="text-xl font-bold text-gray-400">Select or create a note</h2>
                                    <p className="text-gray-600 max-w-xs mx-auto">Click on a note from the list or start a fresh one to begin writing.</p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
}
