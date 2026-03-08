import React from 'react';

interface TemplateProps {
    data: any;
}

export const ClassicTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="text-black font-serif p-8 bg-white h-full">
        <div className="text-center border-b border-black pb-4 mb-6">
            <h1 className="text-2xl font-bold uppercase tracking-widest">{data.personal.name || "Name"}</h1>
            <p className="text-sm font-medium mt-1 uppercase tracking-wider">{data.personal.title || "Job Title"}</p>
            <div className="flex justify-center gap-4 text-[10px] mt-2 italic">
                {data.personal.email && <span>{data.personal.email}</span>}
                {data.personal.phone && <span>{data.personal.phone}</span>}
            </div>
        </div>

        <div className="space-y-6">
            {data.personal.summary && (
                <section>
                    <h2 className="text-xs font-bold uppercase border-b border-gray-300 mb-2">Professional Summary</h2>
                    <p className="text-[10px] leading-relaxed text-gray-800">{data.personal.summary}</p>
                </section>
            )}

            <section>
                <h2 className="text-xs font-bold uppercase border-b border-gray-300 mb-2">Experience</h2>
                <div className="space-y-4">
                    {data.experiences.map((exp: any) => (
                        <div key={exp.id}>
                            <div className="flex justify-between items-baseline font-bold text-xs">
                                <span>{exp.position}</span>
                                <span>{exp.duration}</span>
                            </div>
                            <p className="text-[10px] italic mb-1">{exp.company}</p>
                            <p className="text-[10px] text-gray-700">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            <div className="grid grid-cols-2 gap-8">
                <section>
                    <h2 className="text-xs font-bold uppercase border-b border-gray-300 mb-2">Education</h2>
                    {data.educations.map((edu: any) => (
                        <div key={edu.id} className="mb-2">
                            <p className="text-[10px] font-bold">{edu.school}</p>
                            <p className="text-[10px]">{edu.degree} · {edu.year}</p>
                        </div>
                    ))}
                    {data.schooling?.twelfth?.school && (
                        <div className="mb-2">
                            <p className="text-[10px] font-bold">{data.schooling.twelfth.school}</p>
                            <p className="text-[10px]">12th · {data.schooling.twelfth.board} · {data.schooling.twelfth.percentage} · {data.schooling.twelfth.year}</p>
                        </div>
                    )}
                    {data.schooling?.tenth?.school && (
                        <div className="mb-2">
                            <p className="text-[10px] font-bold">{data.schooling.tenth.school}</p>
                            <p className="text-[10px]">10th · {data.schooling.tenth.board} · {data.schooling.tenth.percentage} · {data.schooling.tenth.year}</p>
                        </div>
                    )}
                </section>
                <section>
                    <h2 className="text-xs font-bold uppercase border-b border-gray-300 mb-2">Skills</h2>
                    <p className="text-[10px] text-gray-700 leading-relaxed">
                        {data.skills.join(', ')}
                    </p>
                </section>
            </div>
        </div>
    </div>
);

export const ModernTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="text-zinc-800 font-sans p-0 flex h-full bg-white">
        <div className="w-1/3 bg-zinc-900 text-white p-8 space-y-8">
            <div>
                <h1 className="text-xl font-black uppercase text-indigo-400 leading-tight">
                    {data.personal.name?.split(' ')[0] || "MY"} <br />
                    <span className="text-white">{data.personal.name?.split(' ').slice(1).join(' ') || "RESUME"}</span>
                </h1>
                <p className="text-[10px] font-bold text-zinc-400 mt-2 uppercase tracking-widest">{data.personal.title || "TITLE"}</p>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">Contact</h3>
                <div className="space-y-2 text-[9px] text-zinc-400 font-medium break-all">
                    <p>{data.personal.email}</p>
                    <p>{data.personal.phone}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">Skills</h3>
                <div className="flex flex-wrap gap-1.5">
                    {data.skills.map((s: string) => (
                        <span key={s} className="px-2 py-0.5 rounded-sm bg-white/10 text-[8px] font-bold">{s}</span>
                    ))}
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-[10px] font-black uppercase text-indigo-400 tracking-tighter">Education</h3>
                {data.educations.map((edu: any) => (
                    <div key={edu.id} className="text-[9px]">
                        <p className="font-bold text-white">{edu.school}</p>
                        <p className="text-zinc-400">{edu.degree}</p>
                        <p className="text-zinc-500">{edu.year}</p>
                    </div>
                ))}
                {data.schooling?.twelfth?.school && (
                    <div className="text-[9px]">
                        <p className="font-bold text-white">{data.schooling.twelfth.school}</p>
                        <p className="text-zinc-400">12th · {data.schooling.twelfth.board}</p>
                        <p className="text-zinc-500">{data.schooling.twelfth.percentage} · {data.schooling.twelfth.year}</p>
                    </div>
                )}
                {data.schooling?.tenth?.school && (
                    <div className="text-[9px]">
                        <p className="font-bold text-white">{data.schooling.tenth.school}</p>
                        <p className="text-zinc-400">10th · {data.schooling.tenth.board}</p>
                        <p className="text-zinc-500">{data.schooling.tenth.percentage} · {data.schooling.tenth.year}</p>
                    </div>
                )}
            </div>
        </div>

        <div className="w-2/3 p-10 space-y-10">
            <section>
                <h3 className="text-[10px] font-black uppercase text-indigo-600 mb-3 flex items-center gap-2">
                    About Me <div className="h-px flex-1 bg-zinc-100" />
                </h3>
                <p className="text-[10px] leading-relaxed text-zinc-600 font-medium">{data.personal.summary}</p>
            </section>

            <section>
                <h3 className="text-[10px] font-black uppercase text-indigo-600 mb-6 flex items-center gap-2">
                    Experience <div className="h-px flex-1 bg-zinc-100" />
                </h3>
                <div className="space-y-8">
                    {data.experiences.map((exp: any) => (
                        <div key={exp.id} className="relative pl-6 border-l border-zinc-100">
                            <div className="absolute -left-1 w-2 h-2 rounded-full bg-indigo-600 top-1.5" />
                            <div className="flex justify-between items-baseline mb-1">
                                <h4 className="text-[11px] font-bold">{exp.position}</h4>
                                <span className="text-[9px] text-zinc-400 font-bold">{exp.duration}</span>
                            </div>
                            <p className="text-[10px] font-bold text-zinc-400 mb-2 tracking-widest uppercase">{exp.company}</p>
                            <p className="text-[10px] leading-relaxed text-zinc-500">{exp.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    </div>
);

export const CreativeTemplate: React.FC<TemplateProps> = ({ data }) => (
    <div className="text-black font-sans p-10 bg-white h-full border-[12px] border-indigo-500 overflow-hidden">
        <div className="relative mb-12">
            <div className="absolute top-0 right-0 text-[100px] font-black text-indigo-100 -rotate-12 translate-x-12 -translate-y-8 pointer-events-none uppercase">
                {data.personal.title?.split(' ')[0] || "HI"}
            </div>
            <div className="relative">
                <h1 className="text-5xl font-black italic uppercase tracking-tighter leading-none">
                    {data.personal.name || "YOUR NAME"}
                </h1>
                <div className="mt-4 flex flex-wrap gap-4 text-[10px] font-black uppercase">
                    <span className="bg-indigo-600 text-white px-2 py-1">{data.personal.title || "JOB TITLE"}</span>
                    <span className="border-b-2 border-black py-1">{data.personal.email}</span>
                    <span className="border-b-2 border-black py-1">{data.personal.phone}</span>
                </div>
            </div>
        </div>

        <div className="grid grid-cols-12 gap-10 h-full">
            <div className="col-span-8 space-y-10">
                <section>
                    <div className="w-10 h-1 bg-black mb-4" />
                    <h3 className="text-sm font-black uppercase mb-4 tracking-tighter">Professional Story</h3>
                    <p className="text-xs leading-relaxed font-medium">{data.personal.summary}</p>
                </section>

                <section>
                    <div className="w-10 h-1 bg-black mb-4" />
                    <h3 className="text-sm font-black uppercase mb-6 tracking-tighter">Where I've Been</h3>
                    <div className="space-y-8">
                        {data.experiences.map((exp: any) => (
                            <div key={exp.id} className="group">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="text-[10px] font-black uppercase text-indigo-600">{exp.duration}</div>
                                    <div className="col-span-3">
                                        <h4 className="text-sm font-black uppercase mb-1">{exp.position}</h4>
                                        <p className="text-[10px] font-bold text-gray-500 mb-3">{exp.company}</p>
                                        <p className="text-[10px] leading-relaxed text-gray-700">{exp.description}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            <div className="col-span-4 space-y-10">
                <section>
                    <h3 className="text-sm font-black uppercase mb-4 tracking-tighter italic underline decoration-indigo-500 decoration-4">Superpowers</h3>
                    <div className="flex flex-col gap-2">
                        {data.skills.map((s: string) => (
                            <div key={s} className="text-[10px] font-black uppercase flex items-center gap-2">
                                <div className="w-2 h-2 bg-indigo-500 rotate-45" /> {s}
                            </div>
                        ))}
                    </div>
                </section>

                <section>
                    <h3 className="text-sm font-black uppercase mb-4 tracking-tighter italic underline decoration-indigo-500 decoration-4">Education</h3>
                    {data.educations.map((edu: any) => (
                        <div key={edu.id} className="mb-4">
                            <p className="text-[10px] font-black uppercase">{edu.school}</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">{edu.degree}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{edu.year}</p>
                        </div>
                    ))}
                    {data.schooling?.twelfth?.school && (
                        <div className="mb-4">
                            <p className="text-[10px] font-black uppercase">{data.schooling.twelfth.school}</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">12th · {data.schooling.twelfth.board}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{data.schooling.twelfth.percentage} · {data.schooling.twelfth.year}</p>
                        </div>
                    )}
                    {data.schooling?.tenth?.school && (
                        <div className="mb-4">
                            <p className="text-[10px] font-black uppercase">{data.schooling.tenth.school}</p>
                            <p className="text-[10px] font-bold text-indigo-600 uppercase">10th · {data.schooling.tenth.board}</p>
                            <p className="text-[10px] text-gray-400 font-bold">{data.schooling.tenth.percentage} · {data.schooling.tenth.year}</p>
                        </div>
                    )}
                </section>
            </div>
        </div>
    </div>
);
