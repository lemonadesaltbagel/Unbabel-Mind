'use client';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';
export default function Home(){
const {user,loading}=useAuth();
const r=useRouter();
const [activeTab,setActiveTab]=useState('Reading');
useEffect(()=>{if(!loading&&user){r.push('/dashboard');}},[user,loading,r]);
if(loading){return(<div className="min-h-screen bg-black flex items-center justify-center"><div className="text-white text-xl">Loading...</div></div>);}
return(
<div className="min-h-screen bg-black text-white">
<div className="min-h-screen flex flex-col items-center justify-center p-8 relative overflow-hidden">
<div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
<div className="text-center max-w-4xl relative z-10">
<h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-purple-400 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-[flow_3s_ease-in-out_infinite]">Unbabel Mind</h1>
<p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">Master language comprehension with interactive passages and real-time feedback</p>
<div className="flex gap-4 justify-center flex-wrap">
<Link href="/login" className="bg-white text-black px-8 py-3 rounded-lg font-semibold hover:bg-gray-200 transition transform hover:scale-105">Sign In</Link>
<Link href="/signup" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition transform hover:scale-105">Sign Up</Link>
</div>
</div>
<div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
<svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
</svg>
</div>
</div>
<div className="py-20 px-8">
<div className="max-w-6xl mx-auto">
<div className="mb-20">
<div className="text-center mb-12">
<h2 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent">Interactive Demo</h2>
<p className="text-lg text-gray-400 max-w-2xl mx-auto">Experience our AI-powered learning platform</p>
</div>
<div className="relative">
<div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-transparent to-blue-600/10 rounded-3xl blur-2xl"></div>
<div className="relative bg-gradient-to-br from-slate-900/90 via-purple-900/30 to-blue-900/30 backdrop-blur-xl p-12 rounded-3xl border border-white/20 shadow-xl min-h-[900px]">
<div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/30 to-transparent"></div>
<div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/30 to-transparent"></div>
<div className="flex h-[800px]">
<div className="bg-black/30 backdrop-blur-sm rounded-2xl p-3 border border-white/20 mr-8 flex-shrink-0 w-48">
<div className="flex flex-col space-y-3 h-full">
{['Reading','Listening','Speaking','Writing'].map((tab)=>(<button key={tab} onClick={()=>setActiveTab(tab)} className={`px-8 py-6 rounded-xl font-semibold transition-all duration-300 text-left flex-shrink-0 text-lg ${activeTab===tab?'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg':'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'}`}>
{tab}
</button>))}
</div>
</div>
<div className="flex-1 relative bg-gradient-to-br from-white/5 via-purple-900/10 to-blue-900/10 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center min-h-0">
{activeTab==='Reading'&&(
<div className="w-full h-full flex">
<div className="w-1/3 bg-black/20 rounded-xl p-4 m-2">
<div className="text-sm text-gray-300 mb-2">Passage Excerpt</div>
<div className="text-xs text-gray-400 leading-relaxed">
The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand's unique treasures. It is the world's only flightless parrot, and is also possibly one of the world's longest-living birds, with a reported lifespan of up to 100 years.
</div>
</div>
<div className="w-1/3 bg-black/20 rounded-xl p-4 m-2">
<div className="text-sm text-gray-300 mb-2">Question 1</div>
<div className="text-xs text-gray-400 mb-2">There are other parrots that share the kakapo's inability to fly.</div>
<div className="text-xs text-red-400">Your Answer: TRUE</div>
<div className="text-xs text-green-400">Correct: FALSE</div>
</div>
<div className="w-1/3 bg-gradient-to-br from-purple-900/30 to-blue-900/30 rounded-xl p-4 m-2 border border-purple-500/20">
<div className="text-sm text-purple-300 mb-2 flex items-center">
<svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
<path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
</svg>
Unbabel AI Analysis
</div>
<div className="text-xs text-gray-300 space-y-2">
<div><span className="text-blue-400 font-semibold">Why FALSE is correct:</span> The passage states "It is the world's only flightless parrot" - this means no other parrots share this characteristic.</div>
<div><span className="text-orange-400 font-semibold">Your mistake:</span> You may have focused on "flightless" without noting the word "only" which makes this unique to kakapo.</div>
<div><span className="text-green-400 font-semibold">Improvement tip:</span> Pay attention to absolute words like "only," "never," "always" - they often determine True/False answers.</div>
</div>
</div>
</div>
)}
{activeTab==='Listening'&&(
<div className="text-center">
<div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-cyan-400 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
<div className="text-4xl">🎧</div>
</div>
<p className="text-3xl font-light text-gray-200 mb-6">Listening Exercise</p>
<p className="text-gray-400 text-xl">Premium learning experience coming soon</p>
</div>
)}
{activeTab==='Speaking'&&(
<div className="text-center">
<div className="w-24 h-24 bg-gradient-to-br from-green-400 to-emerald-400 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
<div className="text-4xl">🗣️</div>
</div>
<p className="text-3xl font-light text-gray-200 mb-6">Speaking Exercise</p>
<p className="text-gray-400 text-xl">Premium learning experience coming soon</p>
</div>
)}
{activeTab==='Writing'&&(
<div className="text-center">
<div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-red-400 rounded-2xl mx-auto mb-8 flex items-center justify-center shadow-lg">
<div className="text-4xl">✍️</div>
</div>
<p className="text-3xl font-light text-gray-200 mb-6">Writing Exercise</p>
<p className="text-gray-400 text-xl">Premium learning experience coming soon</p>
</div>
)}
</div>
</div>
</div>
</div>
</div>
<div className="grid md:grid-cols-2 gap-12 items-center mb-20">
<div className="bg-gradient-to-br from-green-900/30 to-blue-900/30 p-8 rounded-2xl border border-green-500/20 order-2 md:order-1">
<div className="text-center">
<div className="text-4xl mb-4">🎯</div>
<h3 className="text-xl font-semibold mb-2">AI-Powered Feedback</h3>
<p className="text-gray-400">Instant analysis and personalized recommendations</p>
</div>
</div>
<div className="order-1 md:order-2">
<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">Real-Time AI Feedback</h2>
<p className="text-lg text-gray-300 mb-6">Get instant feedback on your answers with our advanced AI system. Understand your mistakes, learn from them, and track your progress over time.</p>
<div className="space-y-4">
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-green-400 rounded-full"></div>
<span className="text-gray-300">Detailed answer explanations</span>
</div>
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
<span className="text-gray-300">Progress tracking and analytics</span>
</div>
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
<span className="text-gray-300">Personalized learning recommendations</span>
</div>
</div>
</div>
</div>
<div className="text-center mb-20">
<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Comprehensive IELTS Preparation</h2>
<div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
<div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
<div className="text-3xl mb-4">📖</div>
<h3 className="text-xl font-semibold mb-3">Reading Module</h3>
<p className="text-gray-400 text-sm">Interactive passages with highlighting, note-taking, and multiple question types including True/False/Not Given, Multiple Choice, and Fill-in-the-blank</p>
</div>
<div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/20">
<div className="text-3xl mb-4">🎧</div>
<h3 className="text-xl font-semibold mb-3">Listening Module</h3>
<p className="text-gray-400 text-sm">Audio transcript synchronization with interactive questions, real-time scoring, and Cambridge IELTS materials</p>
</div>
<div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/20">
<div className="text-3xl mb-4">🗣️</div>
<h3 className="text-xl font-semibold mb-3">Speaking Module</h3>
<p className="text-gray-400 text-sm">AI-powered speaking prompts with voice recording capabilities and structured IELTS-style practice</p>
</div>
<div className="bg-gradient-to-br from-orange-900/20 to-red-900/20 p-6 rounded-xl border border-orange-500/20">
<div className="text-3xl mb-4">✍️</div>
<h3 className="text-xl font-semibold mb-3">Writing Module</h3>
<p className="text-gray-400 text-sm">Rich text editor with word count, auto-save, and comprehensive writing task types for Task 1 & Task 2</p>
</div>
</div>
</div>
<div className="grid md:grid-cols-2 gap-12 items-center mb-20">
<div>
<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent">Advanced AI Quiz System</h2>
<p className="text-lg text-gray-300 mb-6">Our dynamic AI generates personalized questions across three categories to adapt to your learning level and provide targeted practice.</p>
<div className="space-y-4">
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-pink-400 rounded-full"></div>
<span className="text-gray-300">Context Understanding - Real-world scenarios</span>
</div>
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
<span className="text-gray-300">English to English - Vocabulary and synonyms</span>
</div>
<div className="flex items-center space-x-3">
<div className="w-2 h-2 bg-blue-400 rounded-full"></div>
<span className="text-gray-300">Grammar MCQ - Grammar rules and usage</span>
</div>
</div>
</div>
<div className="bg-gradient-to-br from-pink-900/30 to-purple-900/30 p-8 rounded-2xl border border-pink-500/20">
<div className="text-center">
<div className="text-4xl mb-4">🤖</div>
<h3 className="text-xl font-semibold mb-2">Dynamic Question Generation</h3>
<p className="text-gray-400">AI-powered questions that adapt to your skill level</p>
</div>
</div>
</div>
<div className="text-center mb-20">
<h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Why Choose Unbabel Mind?</h2>
<div className="grid md:grid-cols-3 gap-8 mt-12">
<div className="bg-gradient-to-br from-purple-900/20 to-pink-900/20 p-6 rounded-xl border border-purple-500/20">
<div className="text-3xl mb-4">🚀</div>
<h3 className="text-xl font-semibold mb-3">Fast Learning</h3>
<p className="text-gray-400">Accelerate your language learning with targeted exercises and immediate feedback</p>
</div>
<div className="bg-gradient-to-br from-blue-900/20 to-cyan-900/20 p-6 rounded-xl border border-blue-500/20">
<div className="text-3xl mb-4">🎨</div>
<h3 className="text-xl font-semibold mb-3">Beautiful Interface</h3>
<p className="text-gray-400">Enjoy a modern, intuitive design that makes learning engaging and enjoyable</p>
</div>
<div className="bg-gradient-to-br from-green-900/20 to-emerald-900/20 p-6 rounded-xl border border-green-500/20">
<div className="text-3xl mb-4">📊</div>
<h3 className="text-xl font-semibold mb-3">Track Progress</h3>
<p className="text-gray-400">Monitor your improvement with detailed analytics and performance insights</p>
</div>
</div>
</div>
<div className="text-center bg-gradient-to-r from-purple-900/30 via-blue-900/30 to-purple-900/30 p-12 rounded-2xl border border-purple-500/20">
<h2 className="text-3xl font-bold mb-6">Ready to Start Your Journey?</h2>
<p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">Join thousands of learners who have already improved their language skills with Unbabel Mind</p>
<div className="flex gap-4 justify-center flex-wrap">
<Link href="/signup" className="bg-gradient-to-r from-purple-500 to-blue-500 text-white px-8 py-3 rounded-lg font-semibold hover:from-purple-600 hover:to-blue-600 transition transform hover:scale-105">Get Started Free</Link>
<Link href="/login" className="border border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-black transition transform hover:scale-105">Sign In</Link>
</div>
</div>
</div>
</div>
</div>
);}
