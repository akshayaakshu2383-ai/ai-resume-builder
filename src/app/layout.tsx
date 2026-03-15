import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import Navigation from "@/components/Navigation";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "AI Suite - Multi-Tool Platform",
    description: "AI-powered tools for resumes, notes, and productivity.",
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <Navigation />
                <main className="lg:pl-64 min-h-screen">
                    {children}
                </main>
            </body>
        </html>
    );
}
