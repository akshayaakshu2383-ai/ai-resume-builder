"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
    FileText, StickyNote, Youtube, Search, 
    LayoutDashboard, LogOut, Sparkles,
    Settings, Menu, X
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { createClient } from '@/utils/supabase/client';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Resume Builder', href: '/builder', icon: FileText },
    { name: 'Notes Saver', href: '/notes', icon: StickyNote },
    { name: 'YouTube AI', href: '/summarizer', icon: Youtube },
    { name: 'Job Search', href: '/jobs', icon: Search },
];

export default function Navigation() {
    const pathname = usePathname();
    const [isOpen, setIsOpen] = React.useState(false);

    if (pathname === '/login' || pathname === '/') return null;

    const handleLogout = async () => {
        const supabase = createClient();
        await supabase.auth.signOut();
        window.location.href = '/login';
    };

    return (
        <>
            {/* Mobile Toggle */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-xl bg-indigo-600 text-white shadow-lg"
            >
                {isOpen ? <X /> : <Menu />}
            </button>

            {/* Sidebar */}
            <aside className={cn(
                "fixed left-0 top-0 h-screen w-64 bg-[#0a0a0f] border-r border-white/5 z-40 transition-transform duration-300 transform lg:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex flex-col h-full p-6">
                    {/* Logo */}
                    <div className="flex items-center gap-3 px-2 mb-10">
                        <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-600/20">
                            <Sparkles className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-bold text-xl tracking-tight">AI Suite</span>
                    </div>

                    {/* Nav Links */}
                    <nav className="flex-1 space-y-2">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link 
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setIsOpen(false)}
                                    className={cn(
                                        "flex items-center gap-3 px-4 py-3 rounded-2xl transition-all duration-200 group",
                                        isActive 
                                            ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" 
                                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                                    )}
                                >
                                    <Icon className={cn(
                                        "w-5 h-5 transition-colors",
                                        isActive ? "text-white" : "text-gray-500 group-hover:text-indigo-400"
                                    )} />
                                    <span className="font-medium">{item.name}</span>
                                </Link>
                            );
                        })}
                    </nav>

                    {/* Bottom Actions */}
                    <div className="pt-6 border-t border-white/5 space-y-2">
                        <button 
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-gray-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </aside>

            {/* Backdrop for mobile */}
            {isOpen && (
                <div 
                    onClick={() => setIsOpen(false)}
                    className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-30"
                />
            )}
        </>
    );
}
