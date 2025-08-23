import { Question, Answers, Highlight } from '@/types/reading';
import { handleSelection, handleFillIn } from '@/utils/reading';
import { createContextMenu } from '@/utils/contextMenu';

type Props = {
  questions: Question[];
  answers: Answers;
  setAnswers: (a: Answers) => void;
  highlights: Highlight[];
  setHighlights: (h: Highlight[] | ((prev: Highlight[]) => Highlight[])) => void;
};

export default function QuestionList({ 
  questions, 
  answers, 
  setAnswers, 
  highlights, 
  setHighlights 
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
        <span key={`highlight-${i}`} className="bg-yellow-200">
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
    <div className="bg-white p-6 rounded-xl shadow w-full lg:w-2/5 h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-4">Questions</h2>
      
      <ol className="space-y-6 text-sm">
        {questions.map((q, i) => {
          if (q.type === 'intro') {
            return (
              <div 
                key={`intro-${i}`} 
                className="text-base font-semibold mb-3 whitespace-pre-line"
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
                className="font-semibold mb-2"
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
                          className="inline-block w-40 border border-gray-400 rounded px-2 py-1 mx-1"
                          value={answers[q.number]?.[0] || ''}
                          placeholder="—"
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
              <div className="flex flex-wrap gap-4">
                {q.options.map((option, j) => (
                  <label key={option} className="flex items-center gap-2">
                    <input
                      type={q.type === 'multi' ? 'checkbox' : 'radio'}
                      name={`q-${q.number}`}
                      value={option}
                      checked={answers[q.number]?.includes(option) || false}
                      onChange={() => handleSelectionAnswer(q.number, option, q.type === 'multi')}
                      className="mr-2"
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