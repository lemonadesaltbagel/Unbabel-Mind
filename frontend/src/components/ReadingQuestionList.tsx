import { Question, Answers, Highlight } from '@/types/reading';
import { handleSelection, handleFillIn } from '@/utils/reading';
import { createContextMenu } from '@/utils/contextMenu';

type Props = {
  questions: Question[];
  answers: Answers;
  setAnswers: (a: Answers) => void;
  highlights: Highlight[];
  setHighlights: (h: Highlight[] | ((prev: Highlight[]) => Highlight[])) => void;
  className?: string;
};

export default function QuestionList({ 
  questions, 
  answers, 
  setAnswers, 
  highlights, 
  setHighlights,
  className = ''
}: Props) {
  const handleSelectionAnswer = (questionNumber: number, option: string, isMulti: boolean) => 
    setAnswers(handleSelection(questionNumber, option, isMulti, answers));
  
  const handleFillInAnswer = (questionNumber: number, value: string) => 
    setAnswers(handleFillIn(questionNumber, value, answers));

  const renderHighlightedText = (text: string, highlights: Highlight[], textId: string) => {
    let lastIndex = 0;
    const sortedHighlights = highlights
      .filter(hl => hl.textId === textId)
      .sort((a, b) => a.start - b.start);
    
    const result: React.ReactElement[] = [];
    
    sortedHighlights.forEach((highlight, i) => {
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`text-${i}`}>
            {text.slice(lastIndex, highlight.start)}
          </span>
        );
      }
      result.push(
        <span key={`highlight-${i}`} className="bg-sky-400/30 text-white rounded-sm px-0.5">
          {text.slice(highlight.start, highlight.end)}
        </span>
      );
      lastIndex = highlight.end;
    });
    
    if (lastIndex < text.length) {
      result.push(
        <span key="text-last">
          {text.slice(lastIndex)}
        </span>
      );
    }
    
    return result;
  };

  const handleContextMenu = (e: React.MouseEvent, text: string, textId: string) => {
    const selection = window.getSelection();
    if (!selection || selection.toString().trim() === '') return;
    
    const selectedText = selection.toString().trim();
    const target = e.currentTarget as HTMLElement;
    
    const range = selection.getRangeAt(0);
    const preCaretRange = range.cloneRange();
    preCaretRange.selectNodeContents(target);
    preCaretRange.setEnd(range.startContainer, range.startOffset);
    
    const start = preCaretRange.toString().length;
    const end = start + selection.toString().length;
    
    createContextMenu(
      e,
      selectedText,
      start,
      end,
      () => setHighlights(prev => [...prev, { text: selectedText, start, end, textId }]),
      () => setHighlights(prev => prev.filter(h => !(h.textId === textId && start <= h.end && end >= h.start)))
    );
  };

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.03] shadow-[0_25px_80px_rgba(2,6,23,0.45)] p-6 text-slate-200 backdrop-blur-2xl h-[80vh] overflow-y-auto ${className}`}
    >
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Question deck</p>
        <h2 className="text-2xl font-semibold text-white">Answer queue</h2>
      </div>
      
      <ol className="space-y-6 text-sm">
        {questions.map((q, i) => {
          if (q.type === 'intro') {
            return (
              <div 
                key={`intro-${i}`} 
                className="text-base font-semibold mb-3 whitespace-pre-line text-white"
                onContextMenu={e => handleContextMenu(e, q.text, `intro-${i}`)}
              >
                {renderHighlightedText(q.text, highlights, `intro-${i}`)}
              </div>
            );
          }
          
          if (q.type === 'subheading') {
            return (
              <div 
                key={`subheading-${i}`} 
                className="font-semibold mb-2 text-white"
                onContextMenu={e => handleContextMenu(e, q.text, `subheading-${i}`)}
              >
                {renderHighlightedText(q.text, highlights, `subheading-${i}`)}
              </div>
            );
          }
          
          if (q.type === 'fill-in-line') {
            return (
              <li key={`fill-${q.number}`}>
                <div className="mb-2">
                  {q.text.split('____').map((part, j, arr) => (
                    <span 
                      key={j} 
                      onContextMenu={e => handleContextMenu(e, part, `fill-${q.number}-${j}`)}
                    >
                      {renderHighlightedText(part, highlights, `fill-${q.number}-${j}`)}
                      {j < arr.length - 1 && (
                        <input
                          type="text"
                          className="inline-block w-40 border border-white/20 bg-white/5 text-white placeholder-white/40 rounded-xl px-3 py-2 mx-1"
                          value={answers[q.number]?.[0] || ''}
                          placeholder="-"
                          onChange={e => handleFillInAnswer(q.number, e.target.value)}
                        />
                      )}
                    </span>
                  ))}
                </div>
              </li>
            );
          }
          
          return (
            <li key={`q-${q.number}`}>
              <div className="mb-2">
                {q.number}. <span onContextMenu={e => handleContextMenu(e, q.question, `q-${q.number}`)}>
                  {renderHighlightedText(q.question, highlights, `q-${q.number}`)}
                </span>
              </div>
              <div className="flex flex-wrap gap-3">
                {q.options.map((option, j) => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 px-4 py-2 rounded-2xl border ${
                      answers[q.number]?.includes(option)
                        ? 'border-sky-400/60 bg-sky-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
                    } transition`}
                  >
                    <input
                      type={q.type === 'multi' ? 'checkbox' : 'radio'}
                      name={`q-${q.number}`}
                      value={option}
                      checked={answers[q.number]?.includes(option) || false}
                      onChange={() => handleSelectionAnswer(q.number, option, q.type === 'multi')}
                      className="accent-sky-500"
                    />
                    <span onContextMenu={e => handleContextMenu(e, option, `o-${q.number}-${j}`)}>
                      {renderHighlightedText(option, highlights, `o-${q.number}-${j}`)}
                    </span>
                  </label>
                ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
} 
