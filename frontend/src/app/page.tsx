'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Sparkles, BookOpen, Headphones, Mic } from 'lucide-react';

const heroStats = [
  { label: 'Learners coached', value: '42K+' },
  { label: 'Avg. score boost', value: '+1.3 bands' },
  { label: 'Feedback latency', value: '< 3s' }
];

const featureCards = [
  {
    title: 'Adaptive Reading',
    description: 'Interactive IELTS passages with inline note-taking and instant answer reveals.',
    icon: BookOpen
  },
  {
    title: 'Studio-grade Listening',
    description: 'High fidelity audio, waveform scrubbing, and sync’d questions for active practice.',
    icon: Headphones
  },
  {
    title: 'AI Critique',
    description: 'Real-time analysis that mirrors an examiner—tone, fluency, and structure included.',
    icon: Sparkles
  },
  {
    title: 'Speaking Coach',
    description: 'Guided prompts with tempo tracking so you can rehearse Task 2 anytime.',
    icon: Mic
  }
];

const tabOrder = ['Reading', 'Listening', 'Speaking', 'Writing'] as const;

type DemoTab = (typeof tabOrder)[number];

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<DemoTab>('Reading');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  const cardBase =
    'rounded-2xl bg-white/5 border border-white/10 p-6 shadow-[0_25px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl';

  const renderTabContent = useMemo(() => {
    if (activeTab === 'Reading') {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className={cardBase}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-3">Passage excerpt</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand&apos;s
              unique treasures. It is the world&apos;s only flightless parrot and is possibly one of the world&apos;s
              longest-living birds with a lifespan of up to 100 years.
            </p>
          </div>
          <div className={cardBase}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-4">
              <span>True / False / Not Given</span>
              <span>Question 1 of 14</span>
            </div>
            <p className="text-lg text-white font-semibold mb-6">
              There are other parrots that share the kakapo&apos;s inability to fly.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Your choice</span>
                <span className="text-rose-400 font-semibold">TRUE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Correct answer</span>
                <span className="text-sky-400 font-semibold">FALSE</span>
              </div>
            </div>
          </div>
          <div className={`${cardBase} bg-gradient-to-br from-white/10 via-slate-900/40 to-slate-900/0`}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              Unbabel insight
            </p>
            <div className="space-y-3 text-sm">
              <div className="border border-white/10 rounded-xl p-3 bg-black/10">
                <p className="text-slate-400 text-xs mb-1">Reason</p>
                <p className="text-slate-100">
                  The text explicitly states &quot;the world&apos;s only flightless parrot&quot; — absolute phrasing
                  signals exclusivity.
                </p>
              </div>
              <div className="border border-white/10 rounded-xl p-3 bg-black/10">
                <p className="text-slate-400 text-xs mb-1">Watch out for</p>
                <p className="text-slate-100">Absolute words such as only, never, and always flip True/False logic.</p>
              </div>
              <div className="border border-white/10 rounded-xl p-3 bg-black/10">
                <p className="text-slate-400 text-xs mb-1">Next step</p>
                <p className="text-slate-100">Highlight exclusivity markers before checking options.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (activeTab === 'Listening') {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className={cardBase}>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
              <span>Press play</span>
              <span>02:15 / 05:30</span>
            </div>
            <div className="bg-black/30 rounded-xl p-4 border border-white/5 mb-4">
              <div className="flex items-center justify-center gap-3 mb-3">
                <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs">⏮</button>
                <button className="px-6 py-2 rounded-xl bg-sky-500 text-black font-semibold flex items-center gap-2">
                  ▶ Play
                </button>
                <button className="px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-slate-200 text-xs">⏭</button>
              </div>
              <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-sky-400 to-cyan-300" style={{ width: '48%' }}></div>
              </div>
            </div>
            <p className="text-sm text-slate-300">
              Focus on keywords like &quot;only&quot; and &quot;exclusive&quot; as you scan the transcript. They decide
              the polarity of statements.
            </p>
          </div>
          <div className={cardBase}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-3">Comprehension Check</p>
            <p className="text-white text-lg font-semibold mb-4">
              There are other parrots that share the kakapo&apos;s inability to fly.
            </p>
            <div className="rounded-xl border border-white/10 p-4 bg-black/10">
              <p className="text-sm text-slate-300">
                Audio snippet: “It is the world&apos;s only flightless parrot…”
              </p>
            </div>
          </div>
          <div className={`${cardBase} bg-gradient-to-br from-sky-500/10 via-transparent to-transparent`}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 mb-4">Strategy</p>
            <ul className="space-y-4 text-sm text-slate-200">
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-sky-400 mt-2"></span>
                Write down absolutes immediately—they usually determine True/False questions.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-sky-400 mt-2"></span>
                When unsure, replay the clause rather than the entire audio to save time.
              </li>
              <li className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-sky-400 mt-2"></span>
                Tag mistakes to surface pattern reports on the dashboard.
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (activeTab === 'Speaking') {
      return (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className={cardBase}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Task 2 prompt</p>
            <p className="text-white text-lg font-semibold mb-4">
              Describe a public place where you enjoy spending time. Include details about sights, sounds, and how it
              makes you feel.
            </p>
            <p className="text-xs text-slate-400">30 seconds prep · 2 minute response</p>
          </div>
          <div className={cardBase}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Live transcript</p>
            <p className="text-sm text-slate-200 leading-relaxed">
              “I usually go to a riverside coffee shop near my home. The low hum of conversations mixes with the
              distant tram bells, and it keeps me calm before long study sessions…”
            </p>
          </div>
          <div className={`${cardBase} bg-gradient-to-br from-slate-900/20 to-transparent`}>
            <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-sky-400" />
              AI guidance
            </p>
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-slate-400 text-xs mb-1">Fluency + Coherence</p>
                <p className="text-slate-100">Keep eye contact and avoid filler words; pause intentionally.</p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Lexical Resource</p>
                <p className="text-slate-100">
                  Swap “good” for “restorative”, “nice place” for “third space” to sound more precise.
                </p>
              </div>
              <div>
                <p className="text-slate-400 text-xs mb-1">Pronunciation</p>
                <p className="text-slate-100">Rising intonation at the end of complex clauses keeps the listener in.</p>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="grid gap-6 lg:grid-cols-3">
        <div className={cardBase}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Task 2 prompt</p>
          <div className="space-y-4">
            <p className="text-white text-lg font-semibold">
              Some people believe technology makes life easier, others say it increases stress. Discuss both views and
              give your opinion.
            </p>
            <p className="text-xs text-slate-500">Write at least 250 words · 40 minutes</p>
          </div>
        </div>
        <div className={cardBase}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-slate-400 mb-2">Draft</p>
          <p className="text-sm text-slate-200 leading-relaxed h-56 overflow-hidden">
            Technology has undoubtedly transformed modern life. While it streamlines banking, communication, and domestic
            chores, constant connectivity can introduce new pressures. The optimal approach is deliberate usage with
            clear offline routines...
          </p>
          <p className="text-xs text-slate-500 mt-4">248 words · Auto-saved</p>
        </div>
        <div className={`${cardBase} bg-gradient-to-br from-[#111826]/40 to-transparent`}>
          <p className="text-[11px] uppercase tracking-[0.3em] text-sky-300 mb-3">Band estimate</p>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Task achievement</span>
              <span className="text-sky-400 font-semibold">7.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Coherence &amp; cohesion</span>
              <span className="text-sky-400 font-semibold">7.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Lexical resource</span>
              <span className="text-sky-400 font-semibold">6.5</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Grammar range</span>
              <span className="text-sky-400 font-semibold">7.0</span>
            </div>
            <div className="border-t border-white/5 pt-3 flex items-center justify-between">
              <span className="text-white font-semibold">Estimated band</span>
              <span className="text-white text-xl font-bold">7.0</span>
            </div>
          </div>
        </div>
      </div>
    );
  }, [activeTab, cardBase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center text-white">
        <p className="text-sm tracking-[0.6em] uppercase text-white/60 animate-pulse">Loading</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      <div className="relative isolate overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(29,155,240,0.25),_transparent_60%)] opacity-60"></div>
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: '120px 120px'
          }}
        ></div>

        <div className="relative z-10 max-w-6xl mx-auto px-6">
          <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between py-10 border-b border-white/5">
            <div className="flex items-center gap-3">
              <div className="h-11 w-11 rounded-full bg-white text-black font-bold flex items-center justify-center">
                U
              </div>
              <div>
                <p className="text-white font-semibold">Unbabel Mind</p>
                <p className="text-xs uppercase tracking-[0.4em] text-white/40">Language OS</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="px-5 py-2 rounded-full border border-white/20 text-sm text-white/80 hover:text-white hover:border-white/40 transition"
              >
                Log in
              </Link>
              <Link
                href="/signup"
                className="px-6 py-2 rounded-full bg-white text-black font-semibold text-sm flex items-center gap-2 hover:bg-slate-200 transition"
              >
                Join beta
                <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          </header>

          <section className="py-16 flex flex-col gap-10">
            <div className="grid lg:grid-cols-[minmax(0,1fr)_320px] gap-12 items-start">
              <div>
                <p className="text-xs uppercase tracking-[0.5em] text-white/50 mb-4">All-in-one IELTS cockpit</p>
                <h1 className="text-5xl md:text-6xl font-semibold leading-tight text-white mb-6">
                  Train like a creator, test like an examiner.
                </h1>
                <p className="text-lg text-slate-300 max-w-2xl mb-8">
                  Unbabel Mind is the all-in-one IELTS cockpit built to keep the spotlight on what matters—your answers,
                  your data, your confidence. Every interaction is immediate and intentionally minimal.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/signup"
                    className="px-6 py-3 rounded-2xl bg-white text-black font-semibold flex items-center gap-2 hover:bg-slate-100 transition"
                  >
                    Start for free <ArrowUpRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-6 py-3 rounded-2xl border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition"
                  >
                    Explore demo
                  </Link>
                </div>
              </div>
              <div className="rounded-3xl border border-white/5 bg-white/[0.02] p-6 shadow-[0_30px_80px_rgba(0,0,0,0.6)]">
                <p className="text-xs uppercase tracking-[0.4em] text-white/40 mb-4">Live telemetry</p>
                <div className="space-y-5">
                  {heroStats.map(stat => (
                    <div key={stat.label} className="flex items-center justify-between">
                      <p className="text-sm text-white/60">{stat.label}</p>
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                    </div>
                  ))}
                </div>
                <div className="mt-6 rounded-2xl border border-white/10 p-4">
                  <p className="text-xs text-white/50 uppercase tracking-[0.4em] mb-2">Realtime feed</p>
                  <p className="text-sm text-slate-200">
                    Jasmine just improved her reading accuracy by 18% after two practice runs.
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="grid md:grid-cols-2 gap-6 pb-12 border-b border-white/5">
            {featureCards.map(card => (
              <div
                key={card.title}
                className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 flex gap-4 items-start hover:border-white/30 transition"
              >
                <card.icon className="w-10 h-10 text-sky-400" />
                <div>
                  <h3 className="text-white text-xl font-semibold mb-2">{card.title}</h3>
                  <p className="text-slate-300 text-sm">{card.description}</p>
                </div>
              </div>
            ))}
          </section>

          <section className="py-16 space-y-12">
            <div className="flex flex-col gap-4">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Demo workspace</p>
              <div className="flex flex-wrap gap-3">
                {tabOrder.map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-4 py-2 rounded-full border text-sm transition ${
                      activeTab === tab
                        ? 'border-white text-white bg-white/10'
                        : 'border-white/10 text-white/60 hover:text-white hover:border-white/40'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <p className="text-slate-400 text-sm">
                Switch between skills to preview the in-browser exam experience. Every card mirrors the actual dashboard
                state.
              </p>
            </div>
            <div className="rounded-[32px] border border-white/10 bg-[#050b14] p-8 space-y-8">
              {renderTabContent}
            </div>
          </section>

          <section className="py-16 border-t border-white/5">
            <div className="rounded-[32px] border border-white/10 bg-white/[0.02] px-10 py-14 text-center space-y-6">
              <p className="text-xs uppercase tracking-[0.4em] text-white/50">Join the beta</p>
              <h2 className="text-4xl font-semibold">Stay focused. Ship better answers.</h2>
              <p className="text-slate-300 max-w-2xl mx-auto">
                The upgraded Unbabel Mind UI keeps language prep calm and intentional with ambient lighting, a minimal
                workspace, and controls that stay out of the way. Keep the lights low, the interface clean, and your
                attention on the next answer.
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                <Link
                  href="/signup"
                  className="px-6 py-3 rounded-full bg-white text-black font-semibold flex items-center gap-2 hover:bg-slate-200 transition"
                >
                  Create an account
                  <ArrowUpRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 rounded-full border border-white/15 text-white/80 hover:text-white hover:border-white/40 transition"
                >
                  Already with us?
                </Link>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
