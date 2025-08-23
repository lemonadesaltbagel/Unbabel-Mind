'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('Reading');

  useEffect(() => {
    if (!loading && user) {
      router.push('/dashboard');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-xl animate-pulse">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div 
          className="absolute top-0 left-0 w-full h-full opacity-30" 
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        ></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10">
        <div className="min-h-screen flex flex-col items-center justify-center p-8 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-blue-900/20 animate-pulse"></div>
          
          <div className="text-center max-w-4xl relative z-10">
            {/* Hero Section */}
            <div className="relative mb-8">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 rounded-full blur-2xl opacity-75 animate-pulse"></div>
              <h1 className="relative text-6xl md:text-8xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 via-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-600 bg-clip-text text-transparent bg-[length:200%_100%] animate-[flow_3s_ease-in-out_infinite] tracking-tight hover:scale-105 transition-transform duration-500">
                Unbabel Mind
              </h1>
            </div>
            
            <p className="text-xl md:text-3xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed font-light animate-fade-in-up">
              Master language comprehension with interactive passages and real-time feedback
            </p>

            {/* Floating Elements */}
            <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full blur-3xl opacity-20 animate-float"></div>
            <div 
              className="absolute -bottom-20 -right-20 w-40 h-40 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full blur-3xl opacity-20 animate-float" 
              style={{ animationDelay: '2s' }}
            ></div>
            <div 
              className="absolute top-1/2 -right-10 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full blur-2xl opacity-30 animate-float" 
              style={{ animationDelay: '4s' }}
            ></div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-6 justify-center flex-wrap mb-16">
            <Link 
              href="/login" 
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            
            <Link 
              href="/signup" 
              className="group relative overflow-hidden border-2 border-white/30 text-white px-10 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
            >
              <span className="relative z-10">Sign Up</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="relative">
            <div className="absolute -inset-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full blur opacity-50 animate-pulse"></div>
            <svg className="relative w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>

        {/* Interactive Demo Section */}
        <div className="py-32 px-8 relative">
          <div className="max-w-7xl mx-auto">
            <div className="mb-24">
              <div className="text-center mb-16">
                <div className="relative inline-block mb-8">
                  <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  <h2 className="relative text-6xl font-black mb-6 bg-gradient-to-r from-purple-400 via-pink-500 to-blue-400 bg-clip-text text-transparent tracking-tight">
                    Interactive Demo
                  </h2>
                </div>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
                  Experience our AI-powered learning platform with cutting-edge technology
                </p>
              </div>

              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 via-transparent to-blue-600/20 rounded-3xl blur-3xl animate-pulse"></div>
                <div className="relative bg-gradient-to-br from-slate-900/95 via-purple-900/40 to-blue-900/40 backdrop-blur-2xl p-16 rounded-3xl border border-white/20 shadow-2xl min-h-[1000px] overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-400/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"></div>
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]"></div>
                  
                  <div className="flex h-[900px] relative z-10">
                    {/* Tab Navigation */}
                    <div className="bg-black/40 backdrop-blur-xl rounded-3xl p-4 border border-white/20 mr-8 flex-shrink-0 w-56 shadow-2xl">
                      <div className="flex flex-col space-y-4 h-full">
                        {['Reading', 'Listening', 'Speaking', 'Writing'].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`group relative overflow-hidden px-8 py-8 rounded-2xl font-bold transition-all duration-500 text-left flex-shrink-0 text-lg ${
                              activeTab === tab
                                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-2xl shadow-purple-500/25 transform scale-105'
                                : 'bg-transparent text-gray-400 hover:text-white hover:bg-white/10'
                            }`}
                          >
                            <span className="relative z-10">{tab}</span>
                            {activeTab === tab && (
                              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Content Area */}
                    <div className="flex-1 relative bg-gradient-to-br from-white/10 via-purple-900/20 to-blue-900/20 backdrop-blur-xl rounded-3xl border border-white/20 flex items-center justify-center min-h-0 shadow-2xl overflow-hidden">
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]"></div>
                      
                      {/* Reading Tab Content */}
                      {activeTab === 'Reading' && (
                        <div className="w-full h-full flex p-6 relative z-10">
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-purple-300 mb-3 font-semibold">Passage Excerpt</div>
                            <div className="text-sm text-gray-300 leading-relaxed">
                              The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand&apos;s unique treasures. It is the world&apos;s only flightless parrot, and is also possibly one of the world&apos;s longest-living birds, with a reported lifespan of up to 100 years.
                            </div>
                          </div>
                          
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-blue-300 mb-3 font-semibold">Question 1</div>
                            <div className="text-sm text-gray-300 mb-3">
                              There are other parrots that share the kakapo&apos;s inability to fly.
                            </div>
                            <div className="text-sm text-red-400 mb-1">Your Answer: TRUE</div>
                            <div className="text-sm text-green-400 font-semibold">Correct: FALSE</div>
                          </div>
                          
                          <div className="w-1/3 bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl p-6 m-2 border border-purple-500/30 shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-purple-300 mb-3 flex items-center font-semibold">
                              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
                                </svg>
                              </div>
                              Unbabel AI Analysis
                            </div>
                            <div className="text-sm text-gray-200 space-y-3">
                              <div className="bg-black/20 p-3 rounded-lg border border-purple-500/20">
                                <span className="text-blue-400 font-semibold">Why FALSE is correct:</span> The passage states &quot;It is the world&apos;s only flightless parrot&quot; - this means no other parrots share this characteristic.
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                                <span className="text-orange-400 font-semibold">Your mistake:</span> You may have focused on &quot;flightless&quot; without noting the word &quot;only&quot; which makes this unique to kakapo.
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-green-500/20">
                                <span className="text-green-400 font-semibold">Improvement tip:</span> Pay attention to absolute words like &quot;only,&quot; &quot;never,&quot; &quot;always&quot; - they often determine True/False answers.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Listening Tab Content */}
                      {activeTab === 'Listening' && (
                        <div className="w-full h-full flex p-6 relative z-10">
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-blue-300 mb-3 font-semibold">Audio Player</div>
                            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 mb-4 border border-white/10">
                              <div className="flex items-center justify-center space-x-3 mb-3">
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                                  ⏮️
                                </button>
                                <button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg">
                                  ▶️ Play
                                </button>
                                <button className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 transform hover:scale-105">
                                  ⏭️
                                </button>
                              </div>
                              <div className="w-full bg-gray-700 rounded-full h-2 mb-2">
                                <div className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: '45%' }}></div>
                              </div>
                              <div className="text-xs text-gray-400 text-center">02:15 / 05:30</div>
                            </div>
                            <div className="text-sm text-gray-300 leading-relaxed">
                              The kākāpō is a nocturnal, flightless parrot that is critically endangered and one of New Zealand&apos;s unique treasures. It is the world&apos;s only flightless parrot, and is also possibly one of the world&apos;s longest-living birds, with a reported lifespan of up to 100 years.
                            </div>
                          </div>
                          
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-blue-300 mb-3 font-semibold">Question 1</div>
                            <div className="text-sm text-gray-300 mb-3">
                              There are other parrots that share the kakapo&apos;s inability to fly.
                            </div>
                            <div className="text-sm text-red-400 mb-1">Your Answer: TRUE</div>
                            <div className="text-sm text-green-400 font-semibold">Correct: FALSE</div>
                          </div>
                          
                          <div className="w-1/3 bg-gradient-to-br from-blue-900/50 to-cyan-900/50 rounded-2xl p-6 m-2 border border-blue-500/30 shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-blue-300 mb-3 flex items-center font-semibold">
                              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
                                </svg>
                              </div>
                              Unbabel AI Analysis
                            </div>
                            <div className="text-sm text-gray-200 space-y-3">
                              <div className="bg-black/20 p-3 rounded-lg border border-blue-500/20">
                                <span className="text-blue-400 font-semibold">Why FALSE is correct:</span> The audio states &quot;It is the world&apos;s only flightless parrot&quot; - this means no other parrots share this characteristic.
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                                <span className="text-orange-400 font-semibold">Your mistake:</span> You may have focused on &quot;flightless&quot; without noting the word &quot;only&quot; which makes this unique to kakapo.
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-green-500/20">
                                <span className="text-green-400 font-semibold">Improvement tip:</span> Pay attention to absolute words like &quot;only,&quot; &quot;never,&quot; &quot;always&quot; - they often determine True/False answers in listening tests.
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-purple-500/20">
                                <span className="text-purple-400 font-semibold">Listening strategy:</span> Practice identifying key words and phrases that indicate exclusivity or uniqueness.
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Speaking Tab Content */}
                      {activeTab === 'Speaking' && (
                        <div className="text-center w-full">
                          <div className="relative mb-12">
                            <div className="absolute -inset-8 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                            <div className="relative w-32 h-32 bg-gradient-to-br from-green-400 to-emerald-400 rounded-3xl mx-auto flex items-center justify-center shadow-2xl shadow-green-500/25 transform hover:scale-110 transition-all duration-500">
                              <div className="text-6xl">🗣️</div>
                            </div>
                          </div>
                          <p className="text-4xl font-light text-gray-200 mb-8">Speaking Exercise</p>
                          <p className="text-gray-400 text-2xl">Premium learning experience coming soon</p>
                        </div>
                      )}

                      {/* Writing Tab Content */}
                      {activeTab === 'Writing' && (
                        <div className="w-full h-full flex p-6 relative z-10">
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-yellow-300 mb-3 font-semibold">Writing Prompt</div>
                            <div className="text-sm text-gray-300 mb-4">
                              <div className="font-bold text-yellow-400 mb-3">Task 2: Academic Writing</div>
                              <div className="text-gray-200 leading-relaxed">
                                Some people believe that technology has made life easier and more convenient, while others argue that it has made life more complex and stressful. Discuss both views and give your own opinion.
                              </div>
                              <div className="text-xs text-gray-500 mt-3">Write at least 250 words</div>
                            </div>
                          </div>
                          
                          <div className="w-1/3 bg-black/30 backdrop-blur-sm rounded-2xl p-6 m-2 border border-white/10 shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-gray-300 mb-3 font-semibold">Sample Essay</div>
                            <div className="text-xs text-gray-300 leading-relaxed">
                              Technology has undoubtedly transformed modern life in profound ways. While some argue that technological advancements have simplified daily routines, others contend that they have introduced new complexities and stress factors. This essay will examine both perspectives before presenting a balanced conclusion.

                              On the positive side, technology has streamlined many aspects of daily life. Smartphones enable instant communication across continents, reducing the need for physical travel. Online banking eliminates the need to visit physical branches, saving time and effort. Additionally, household appliances like washing machines and dishwashers have significantly reduced manual labor in homes.

                              However, critics argue that technology has created new forms of stress and complexity. The constant connectivity through social media can lead to information overload and mental fatigue. The pressure to stay updated with rapidly changing technology can be overwhelming, especially for older generations. Furthermore, the blurring of work-life boundaries due to remote work technologies has increased stress levels for many professionals.

                              In my opinion, while technology has introduced certain complexities, its benefits far outweigh the drawbacks. The key lies in how individuals choose to use and manage technology in their lives. With proper digital literacy and mindful usage, technology can indeed make life more convenient and efficient.

                              In conclusion, technology&apos;s impact on modern life is multifaceted. While it has simplified many tasks, it has also introduced new challenges. The solution is not to reject technology but to develop better strategies for managing its use effectively.
                            </div>
                            <div className="text-xs text-gray-500 mt-3">Word count: 248</div>
                          </div>
                          
                          <div className="w-1/3 bg-gradient-to-br from-orange-900/50 to-red-900/50 rounded-2xl p-6 m-2 border border-orange-500/30 shadow-2xl hover:shadow-orange-500/25 transition-all duration-300 transform hover:scale-105">
                            <div className="text-sm text-orange-300 mb-3 flex items-center font-semibold">
                              <div className="w-6 h-6 mr-2 bg-gradient-to-r from-orange-400 to-red-400 rounded-full flex items-center justify-center">
                                <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M9.99 0C4.47 0 0 4.48 0 10s4.47 10 9.99 10C15.52 20 20 15.52 20 10S15.52 0 9.99 0zM10 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S14.33 6 13.5 6 12 6.67 12 7.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S7.33 6 6.5 6 5 6.67 5 7.5S5.67 9 6.5 9zm3.5-6.5c2.33 0 4.31-1.46 5.11-3.5H4.89c.8 2.04 2.78 3.5 5.11 3.5z" clipRule="evenodd"/>
                                </svg>
                              </div>
                              Unbabel AI Analysis
                            </div>
                            <div className="text-sm text-gray-200 space-y-3">
                              <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                                <div className="flex justify-between mb-2">
                                  <span>Task Achievement:</span>
                                  <span className="text-green-400 font-bold">7.5</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span>Coherence & Cohesion:</span>
                                  <span className="text-blue-400 font-bold">7.0</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span>Lexical Resource:</span>
                                  <span className="text-purple-400 font-bold">6.5</span>
                                </div>
                                <div className="flex justify-between mb-2">
                                  <span>Grammatical Range:</span>
                                  <span className="text-yellow-400 font-bold">7.0</span>
                                </div>
                                <div className="border-t border-orange-500/30 pt-2 mt-2">
                                  <div className="flex justify-between font-bold">
                                    <span>Final Score:</span>
                                    <span className="text-orange-400 text-lg">7.0</span>
                                  </div>
                                </div>
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-green-500/20">
                                <span className="text-green-400 font-semibold">Strengths:</span> Good task response, clear structure, balanced argument
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20">
                                <span className="text-orange-400 font-semibold">Areas to improve:</span> Expand vocabulary range, add more complex sentence structures
                              </div>
                              <div className="bg-black/20 p-3 rounded-lg border border-blue-500/20">
                                <span className="text-blue-400 font-semibold">Suggestion:</span> Include more academic vocabulary and varied linking phrases
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* AI Feedback Section */}
      <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-green-900/40 to-blue-900/40 p-12 rounded-3xl border border-green-500/30 backdrop-blur-xl shadow-2xl shadow-green-500/25">
            <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h3 className="text-2xl font-bold mb-4">AI-Powered Feedback</h3>
              <p className="text-gray-300 text-lg">Instant analysis and personalized recommendations</p>
            </div>
          </div>
        </div>
        
        <div>
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-blue-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-5xl font-black mb-8 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent tracking-tight">
              Real-Time AI Feedback
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Get instant feedback on your answers with our advanced AI system. Understand your mistakes, learn from them, and track your progress over time.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-green-400 to-green-600 rounded-full shadow-lg shadow-green-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">Detailed answer explanations</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">Progress tracking and analytics</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">Personalized learning recommendations</span>
            </div>
          </div>
        </div>
      </div>

      {/* IELTS Preparation Section */}
      <div className="text-center mb-32">
        <div className="relative mb-16">
          <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <h2 className="relative text-6xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
            Comprehensive IELTS Preparation
          </h2>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">📖</div>
              <h3 className="text-xl font-bold mb-4">Reading Module</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Interactive passages with highlighting, note-taking, and multiple question types including True/False/Not Given, Multiple Choice, and Fill-in-the-blank
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">🎧</div>
              <h3 className="text-xl font-bold mb-4">Listening Module</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Audio transcript synchronization with interactive questions, real-time scoring, and Cambridge IELTS materials
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-8 rounded-2xl border border-green-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">🗣️</div>
              <h3 className="text-xl font-bold mb-4">Speaking Module</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                AI-powered speaking prompts with voice recording capabilities and structured IELTS-style practice
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-orange-900/30 to-red-900/30 p-8 rounded-2xl border border-orange-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-orange-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">✍️</div>
              <h3 className="text-xl font-bold mb-4">Writing Module</h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Rich text editor with word count, auto-save, and comprehensive writing task types for Task 1 & Task 2
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Quiz System Section */}
      <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
        <div>
          <div className="relative mb-8">
            <div className="absolute -inset-4 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-2xl opacity-50 animate-pulse"></div>
            <h2 className="relative text-5xl font-black mb-8 bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent tracking-tight">
              Advanced AI Quiz System
            </h2>
          </div>
          <p className="text-xl text-gray-300 mb-8 leading-relaxed">
            Our dynamic AI generates personalized questions across three categories to adapt to your learning level and provide targeted practice.
          </p>
          <div className="space-y-6">
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-pink-400 to-pink-600 rounded-full shadow-lg shadow-pink-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">Context Understanding - Real-world scenarios</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-purple-400 to-purple-600 rounded-full shadow-lg shadow-purple-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">English to English - Vocabulary and synonyms</span>
            </div>
            <div className="flex items-center space-x-4 group">
              <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-blue-600 rounded-full shadow-lg shadow-blue-500/50 group-hover:scale-125 transition-transform duration-300"></div>
              <span className="text-gray-200 text-lg">Grammar MCQ - Grammar rules and usage</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <div className="absolute -inset-8 bg-gradient-to-r from-pink-600 to-purple-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <div className="relative bg-gradient-to-br from-pink-900/40 to-purple-900/40 p-12 rounded-3xl border border-pink-500/30 backdrop-blur-xl shadow-2xl shadow-pink-500/25">
            <div className="text-center">
              <div className="text-6xl mb-6">🤖</div>
              <h3 className="text-2xl font-bold mb-4">Dynamic Question Generation</h3>
              <p className="text-gray-300 text-lg">AI-powered questions that adapt to your skill level</p>
            </div>
          </div>
        </div>
      </div>

      {/* Why Choose Section */}
      <div className="text-center mb-32">
        <div className="relative mb-16">
          <div className="absolute -inset-8 bg-gradient-to-r from-yellow-600 to-orange-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
          <h2 className="relative text-6xl font-black mb-8 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent tracking-tight">
            Why Choose Unbabel Mind?
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-purple-900/30 to-pink-900/30 p-8 rounded-2xl border border-purple-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-purple-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">🚀</div>
              <h3 className="text-xl font-bold mb-4">Fast Learning</h3>
              <p className="text-gray-300 leading-relaxed">
                Accelerate your language learning with targeted exercises and immediate feedback
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-blue-900/30 to-cyan-900/30 p-8 rounded-2xl border border-blue-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-blue-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">🎨</div>
              <h3 className="text-xl font-bold mb-4">Beautiful Interface</h3>
              <p className="text-gray-300 leading-relaxed">
                Enjoy a modern, intuitive design that makes learning engaging and enjoyable
              </p>
            </div>
          </div>
          
          <div className="group relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur-2xl opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-green-900/30 to-emerald-900/30 p-8 rounded-2xl border border-green-500/30 backdrop-blur-xl shadow-xl group-hover:shadow-2xl group-hover:shadow-green-500/25 transition-all duration-500 transform group-hover:scale-105">
              <div className="text-4xl mb-6">📊</div>
              <h3 className="text-xl font-bold mb-4">Track Progress</h3>
              <p className="text-gray-300 leading-relaxed">
                Monitor your improvement with detailed analytics and performance insights
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action Section */}
      <div className="relative text-center bg-gradient-to-r from-purple-900/40 via-blue-900/40 to-purple-900/40 p-16 rounded-3xl border border-purple-500/30 backdrop-blur-xl shadow-2xl shadow-purple-500/25 mb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(120,119,198,0.1),transparent_50%)]"></div>
        <div className="relative z-10">
          <div className="relative mb-8">
            <div className="absolute -inset-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <h2 className="relative text-4xl font-black mb-8">Ready to Start Your Journey?</h2>
          </div>
          <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Join thousands of learners who have already improved their language skills with Unbabel Mind
          </p>
          <div className="flex gap-6 justify-center flex-wrap">
            <Link 
              href="/signup" 
              className="group relative overflow-hidden bg-gradient-to-r from-purple-500 to-blue-500 text-white px-12 py-4 rounded-2xl font-bold text-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25"
            >
              <span className="relative z-10">Get Started Free</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
            <Link 
              href="/login" 
              className="group relative overflow-hidden border-2 border-white/30 text-white px-12 py-4 rounded-2xl font-bold text-lg backdrop-blur-sm bg-white/5 hover:bg-white/10 hover:border-white/50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl hover:shadow-white/25"
            >
              <span className="relative z-10">Sign In</span>
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
