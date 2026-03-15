import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { content, type, context } = await req.json();

        // For now, using a mock response or a simple prompt logic
        // If the user provides GROQ_API_KEY or OPENROUTER_API_KEY, we can use it.
        // I will implement the logic to call an external API here.

        const API_KEY = process.env.GROQ_API_KEY;
        
        if (!API_KEY) {
            return NextResponse.json({ 
                content: "Please configure GROQ_API_KEY or OPENROUTER_API_KEY in your environment variables to enable real AI features. Currently using fallback mock logic.",
                isMock: true
            });
        }

        let prompt = "";
        if (type === 'experience') {
            prompt = `Improve the following professional experience description to be more impactful and professional. Focus on achievements and using action verbs. Keep it concise.
            Content: ${content}`;
        } else if (type === 'summary') {
            prompt = `Write a professional resume summary based on the following context.
            Context: ${context}`;
        }

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-8b-8192',
                messages: [{ role: 'user', content: prompt }]
            })
        });

        const data = await response.json();
        const improvedContent = data.choices?.[0]?.message?.content || "Failed to generate content.";

        return NextResponse.json({ content: improvedContent.trim() });

    } catch (error) {
        console.error('AI Route Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
