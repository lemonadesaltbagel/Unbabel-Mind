'use client';
import{useRouter}from'next/navigation';
import{BookOpen,Info}from'lucide-react';
export default function CopyrightMessage({quizType,quizId,questionType}:{quizType:string;quizId:string;questionType:string}){
const r=useRouter();
const hg=()=>window.open('/QUIZ_CREATION_GUIDE.html','_blank');
return(<div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
<div className="max-w-2xl w-full bg-white rounded-2xl shadow-xl p-8 text-center">
<div className="mb-6">
<div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
<Info className="w-8 h-8 text-blue-600"/>
</div>
<h1 className="text-2xl font-bold text-gray-800 mb-2">Content Not Available</h1>
<p className="text-gray-600">This {quizType} quiz content is not currently available in our system.</p>
</div>
<div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
<h2 className="text-lg font-semibold text-blue-800 mb-3 flex items-center justify-center">
<BookOpen className="w-5 h-5 mr-2"/>
For Copyright Reasons
</h2>
<p className="text-blue-700 mb-4">Due to copyright restrictions, we can not upload the questions to Github directly. To access this content, please download the questions from ILES website yourself and add them to the system.</p>
<div className="text-sm text-blue-600">
<p className="mb-2"><strong>Quiz Details:</strong></p>
<p>Type: {quizType.charAt(0).toUpperCase()+quizType.slice(1)}</p>
<p>Quiz ID: {quizId}</p>
<p>Question Type: {questionType}</p>
</div>
</div>
<div className="space-y-4">
<button onClick={hg} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center">
<BookOpen className="w-5 h-5 mr-2"/>
View Quiz Creation Guide
</button>
<button onClick={()=>r.push('/dashboard')} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-colors">
Back to Dashboard
</button>
</div>
<div className="mt-6 pt-4 border-t border-gray-200">
<p className="text-xs text-gray-500">This is the standard way to add new quizzes to the system. Follow the guide to learn how to create and contribute your own quiz content.</p>
</div>
</div>
</div>);} 