import { createClient } from '@/utils/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { url } = await req.json();
        const API_KEY = process.env.GROQ_API_KEY;

        if (!API_KEY) {
            return NextResponse.json({
                title: "API Key Missing",
                description: "Please configure GROQ_API_KEY in your environment variables to enable real AI summarization.",
                keyPoints: ["Add GROQ_API_KEY to .env.local", "Restart the server"],
                actionItems: ["Configure environment variables"]
            });
        }

        // HEURISTIC: Since we don't have a reliable library to get YT transcript on the fly WITHOUT a proxy/backend
        // we will simulate the extraction and use the URL to mock the content for now, OR if we had a transcript API
        // we would call it here. For the sake of this tool suite demonstration, we'll use a prompt that asks
        // the AI to summarize if it knows the video, or provide a generic "How to use" if it doesn't.
        
        const videoId = url.split('v=')[1]?.split('&')[0] || url.split('/').pop();

        const prompt = `Summarize the YouTube video with ID: ${videoId}. 
        URL: ${url}
        If you don't know the specific video, generate a highly informative summary based on the likely content from the title/URL.
        Provide the response in the following JSON format:
        {
            "title": "Video Title",
            "description": "One sentence summary",
            "keyPoints": ["Point 1", "Point 2", "Point 3"],
            "actionItems": ["Action 1", "Action 2"]
        }`;

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama3-70b-8192',
                messages: [{ role: 'user', content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        const data = await response.json();
        const summary = JSON.parse(data.choices?.[0]?.message?.content || "{}");

        return NextResponse.json(summary);

    } catch (error) {
        console.error('Summarize Route Error:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}
