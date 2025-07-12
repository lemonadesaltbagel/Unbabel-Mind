'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useRef } from 'react';
import { Home } from 'lucide-react';

export default function ReviewPage() {
  const r = useRouter();
  const { id, type } = useParams();
  const [pt, setPt] = useState('');
  const [pc, setPc] = useState('');
  const [qs, setQs] = useState<any[]>([]);
  const [a, setA] = useState<Record<number, string[]>>({});
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [showContextMenu, setShowContextMenu] = useState(false);
  const [contextMenuPosition, setContextMenuPosition] = useState({ x: 0, y: 0 });
  const contextMenuRef = useRef<HTMLDivElement>(null);

  // Add new state for AI response
  const [aiResponse, setAiResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizWord, setQuizWord] = useState('');
  const [quizOptions, setQuizOptions] = useState<string[]>([]);

  // Add new state for submenu
  const [showQuizSubmenu, setShowQuizSubmenu] = useState(false);
  const [quizSubmenuPosition, setQuizSubmenuPosition] = useState({ x: 0, y: 0 });

  type Highlight = {
    text: string;
    start: number;
    end: number;
  };

  useEffect(() => {
    fetch(`/static/reading/${id}_${type}.txt`)
      .then(res => res.text())
      .then(text => {
        const [tl, ...rest] = text.split('\n');
        setPt(tl.trim());
        setPc(rest.join('\n').trim());
      });

    fetch(`/static/reading/${id}_${type}_q.json`)
      .then(res => res.json())
      .then(setQs);

    const saved = localStorage.getItem(`reading-answers-${id}-${type}`);
    if (saved) setA(JSON.parse(saved));
  }, [id, type]);

  const handleNavigation = (direction: 'back' | 'next') => {
    const currentType = Number(type);
    const newType = direction === 'back' ? currentType - 1 : currentType + 1;
    r.push(`/reading/${id}/${newType}/review`);
  };

  // Update handleContextMenu to check for single word
  const handleContextMenu = async (e: React.MouseEvent) => {
    e.preventDefault();
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    const hasSpaces = /\s/.test(selectedText);
    const isSingleWord = /^[a-zA-Z]+$/.test(selectedText);

    // Set position but only show word quiz option if it's a single word
    setContextMenuPosition({ x: e.pageX, y: e.pageY });
    setShowContextMenu(true);
  };

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(document.querySelector('.passage-content') as Node);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const start = preCaretRange.toString().length;

    setHighlights(prev => [...prev, {
      text: selectedText,
      start,
      end: start + selectedText.length
    }]);
    setShowContextMenu(false);
  };

  // Add this new handler function
  const handleClearHighlight = () => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(document.querySelector('.passage-content') as Node);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    const start = preCaretRange.toString().length;
    const end = start + selectedText.length;

    // Remove any highlight that overlaps with the selected text
    setHighlights(prev => prev.filter(h => 
      !(start <= h.end && end >= h.start)
    ));
    setShowContextMenu(false);
  };

  // Modify handleParaphrase function
  const handleParaphrase = async () => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    setIsLoading(true);
    
    try {
      // Add your AI paraphrase API call here
      // const response = await fetch('your-api-endpoint', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ text: selectedText })
      // });
      // const data = await response.json();
      
      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse(`Paraphrase of "${selectedText}":\n\nThis is a mock paraphrase response from AI IELTS Assistant.`);
    } catch (error) {
      setAiResponse('Failed to get AI response. Please try again.');
    } finally {
      setIsLoading(false);
      setShowContextMenu(false);
    }
  };

  const handleShowQuiz = async () => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    setIsLoading(true);
    
    try {
      // Mock API call to generate quiz
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuizWord(selectedText);
      setQuizOptions(['Option A', 'Option B', 'Option C', 'Option D']);
      setShowQuiz(true);
    } catch (error) {
      setAiResponse('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
      setShowContextMenu(false);
    }
  };

  // Add new handler function
  const handleWordQuiz = async (quizType: 'context' | 'translation' | 'grammar') => {
    const selection = window.getSelection();
    if (!selection) return;

    const selectedText = selection.toString().trim();
    // Check if selection contains any spaces or is not purely letters
    const hasSpaces = /\s/.test(selectedText);
    const isSingleWord = /^[a-zA-Z]+$/.test(selectedText);
    
    if (hasSpaces || !isSingleWord) {
      const toast = document.createElement('div');
      toast.className = 'fixed left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-red-500 text-white px-6 py-3 rounded shadow-lg z-50';
      toast.textContent = hasSpaces ? 'Please select only one word' : 'Please select a valid word';
      document.body.appendChild(toast);
      setTimeout(() => document.body.removeChild(toast), 2000);
      return;
    }

    setIsLoading(true);
    
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setQuizWord(selectedText);
      
      // Different options based on quiz type
      const options = {
        context: [
          'Meaning in current context',
          'Alternative meaning 1',
          'Alternative meaning 2',
          'Alternative meaning 3'
        ],
        translation: [
          'English definition 1',
          'English definition 2',
          'English definition 3',
          'English definition 4'
        ],
        grammar: [
          'Grammar usage 1',
          'Grammar usage 2',
          'Grammar usage 3',
          'Grammar usage 4'
        ]
      };
      
      setQuizOptions(options[quizType]);
      setShowQuiz(true);
    } catch (error) {
      setAiResponse('Failed to generate quiz. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Add handleExplanation function
  const handleExplanation = async (questionNumber: number, userAnswer: string, correctAnswer: string) => {
    setIsLoading(true);
    setShowQuiz(false);
    
    try {
      // Mock API call - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAiResponse(
        `Question ${questionNumber} Explanation:\n\n` +
        `Your answer "${userAnswer}" is incorrect.\n\n` +
        `The correct answer is "${correctAnswer}".\n\n` +
        `Here's why:\n` +
        `This is a mock explanation from AI IELTS Assistant explaining why "${correctAnswer}" is the correct answer in this context.`
      );
    } catch (error) {
      setAiResponse('Failed to get AI explanation. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // effect for handling clicks outside context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
        setShowContextMenu(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className="min-h-screen bg-black text-black p-4 sm:p-6 flex flex-col items-center">
      <div className="w-full max-w-6xl flex items-center mb-4">
        <div className="w-6">
          <button 
            onClick={() => r.push('/dashboard')}
            className="text-white hover:text-blue-500 transition"
          >
            <Home className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 flex justify-center">
          <h1 className="text-white text-2xl font-bold">Review: Reading Passage {type}</h1>
        </div>
        <div className="w-6"></div>
      </div>
      <div className="flex w-full max-w-6xl">
        {/* Left spacing with a white box */}
        <div className="flex w-1/3 justify-end pr-2">
          <div className="w-[320px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
            <div className="bg-gray-100 text-gray-800 px-4 py-2 rounded-lg shadow-sm text-center font-semibold mb-4">
              AI IELTS Assistant
            </div>
            {isLoading ? (
              <div className="flex items-center justify-center h-32 text-gray-500">
                Loading...
              </div>
            ) : showQuiz ? (
              <div className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2">Word Quiz: "{quizWord}"</h3>
                  <p className="text-sm text-gray-600 mb-4">Choose the best explanation:</p>
                </div>
                <div className="space-y-2">
                  {quizOptions.map((option, index) => (
                    <button
                      key={index}
                      className="w-full p-3 text-left border rounded-lg hover:bg-gray-50 transition-colors"
                      onClick={() => {
                        // Handle option selection
                        setAiResponse(`You selected option ${['A', 'B', 'C', 'D'][index]}: ${option}`);
                        setShowQuiz(false);
                      }}
                    >
                      <span className="font-medium">{['A', 'B', 'C', 'D'][index]}.</span> {option}
                    </button>
                  ))}
                </div>
              </div>
            ) : aiResponse ? (
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-gray-700">
                  {aiResponse}
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-4">
                Get Started with AI for IELTS
              </div>
            )}
          </div>
        </div>
        {/* Main content wrapper - reduced left spacing */}
        <div className="flex space-x-4">
          <div className="w-[500px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh] border-r border-gray-400">
            <h2 className="text-xl font-bold mb-2">{pt}</h2>
            <div 
              className="whitespace-pre-wrap text-sm passage-content" 
              onContextMenu={handleContextMenu}
            >
              {(() => {
                let lastIndex = 0;
                const sortedHighlights = [...highlights].sort((a, b) => a.start - b.start);
                const result = [];

                sortedHighlights.forEach((highlight, index) => {
                  if (highlight.start > lastIndex) {
                    result.push(
                      <span key={`text-${index}`}>
                        {pc.slice(lastIndex, highlight.start)}
                      </span>
                    );
                  }
                  result.push(
                    <span key={`highlight-${index}`} className="bg-yellow-200">
                      {pc.slice(highlight.start, highlight.end)}
                    </span>
                  );
                  lastIndex = highlight.end;
                });

                if (lastIndex < pc.length) {
                  result.push(
                    <span key="text-last">
                      {pc.slice(lastIndex)}
                    </span>
                  );
                }

                return result;
              })()}
            </div>

            {/* Add context menu */}
            {showContextMenu && (
              <div
                ref={contextMenuRef}
                className="fixed bg-white shadow-lg rounded-md py-2 z-50"
                style={{ left: contextMenuPosition.x, top: contextMenuPosition.y }}
              >
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={handleHighlight}
                >
                  Highlight
                </button>
                <button
                  className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                  onClick={handleClearHighlight}
                >
                  Clear Highlight
                </button>
                {!/\s/.test(window.getSelection()?.toString().trim() || '') && (
                  <div 
                    className="relative"
                    onMouseEnter={(e) => {
                      setQuizSubmenuPosition({ x: e.currentTarget.offsetWidth, y: 0 });
                      setShowQuizSubmenu(true);
                    }}
                    onMouseLeave={() => setShowQuizSubmenu(false)}
                  >
                    <button
                      className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm flex items-center justify-between"
                    >
                      <span>AI Quiz</span>
                      <span className="ml-2">▶</span>
                    </button>
                    {showQuizSubmenu && (
                      <div 
                        className="absolute top-0 left-full bg-white shadow-lg rounded-md py-2 min-w-[200px]"
                        style={{ 
                          left: quizSubmenuPosition.x,
                          top: quizSubmenuPosition.y 
                        }}
                      >
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => {
                            handleWordQuiz('context');
                            setShowContextMenu(false);
                          }}
                        >
                          Context Understanding
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => {
                            handleWordQuiz('translation');
                            setShowContextMenu(false);
                          }}
                        >
                          English to English
                        </button>
                        <button
                          className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                          onClick={() => {
                            handleWordQuiz('grammar');
                            setShowContextMenu(false);
                          }}
                        >
                          Grammar MCQ
                        </button>
                      </div>
                    )}
                  </div>
                )}
                {/\s/.test(window.getSelection()?.toString().trim() || '') && (
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-100 text-sm"
                    onClick={handleParaphrase}
                  >
                    AI Paraphrase
                  </button>
                )}
              </div>
            )}
          </div>
          <div className="w-[320px] bg-white p-6 rounded-xl shadow overflow-y-auto h-[80vh]">
            <h2 className="text-xl font-bold mb-4">Your Answers</h2>
            <ol className="space-y-4 text-sm">
              {qs.map((q, i) => {
                if (!('number' in q)) return null;
                const userAns = a[q.number]?.[0] ?? '';
                const correct = q.correct;
                const isCorrect = userAns === correct;
                return (
                  <li key={i}>
                    <div className="mb-1 font-semibold">{q.number}. {q.question}</div>
                    <div className={isCorrect ? 'text-green-600' : 'text-red-600'}>
                      Your Answer: {userAns || '—'}
                    </div>
                    {!isCorrect && (
                      <>
                        <div className="text-blue-600">
                          Correct Answer: {correct || 'N/A'}
                        </div>
                        <button 
                          className="mt-2 px-4 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg transition-colors text-sm"
                          onClick={() => handleExplanation(q.number, userAns, correct)}
                        >
                          AI Explanation
                        </button>
                      </>
                    )}
                  </li>
                );
              })}
            </ol>
            
            {/* Add conclusion section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold mb-2">Conclusion</h3>
              <div className="text-sm text-gray-600 space-y-2">
                <p>Total Questions: {qs.filter(q => 'number' in q).length}</p>
                <p>Correct Answers: {qs.filter(q => 'number' in q && a[q.number]?.[0] === q.correct).length}</p>
                <p className="font-medium">
                  Score: {Math.round((qs.filter(q => 'number' in q && a[q.number]?.[0] === q.correct).length / qs.filter(q => 'number' in q).length) * 100)}%
                </p>
                <p className="text-xs text-gray-400 mt-4 italic">Generated by AI</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation buttons */}
      <div className="w-full max-w-6xl flex justify-center mt-6 space-x-4">
        <button
          onClick={() => handleNavigation('back')}
          disabled={type === '1'}
          className={`px-6 py-2 rounded-lg transition-colors ${
            type === '1'
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Back
        </button>
        <button
          onClick={() => handleNavigation('next')}
          disabled={type === '3'}
          className={`px-6 py-2 rounded-lg transition-colors ${
            type === '3'
              ? 'bg-gray-300 cursor-not-allowed text-gray-500'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}