import { Question, Answers } from '@/types/reading';
import { handleSelection, handleFillIn } from '@/utils/reading';

type Props = {
  questions: Question[];
  answers: Answers;
  setAnswers: (a: Answers) => void;
  className?: string;
};

export default function ListeningQuestionList({ questions, answers, setAnswers, className = '' }: Props) {
  const handleSelectionAnswer = (questionNumber: number, option: string, isMulti: boolean) =>
    setAnswers(handleSelection(questionNumber, option, isMulti, answers));

  const handleFillInAnswer = (questionNumber: number, value: string) =>
    setAnswers(handleFillIn(questionNumber, value, answers));

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl h-[80vh] overflow-y-auto ${className}`}
    >
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Question deck</p>
        <h2 className="text-2xl font-semibold text-white">Active prompts</h2>
      </div>

      <ol className="space-y-6 text-sm text-slate-200">
        {questions.map((q, i) => {
          if (q.type === 'intro') {
            return (
              <div key={`intro-${i}`} className="text-base font-semibold mb-3 whitespace-pre-line text-white">
                {q.text}
              </div>
            );
          }

          if (q.type === 'subheading') {
            return (
              <div key={`subheading-${i}`} className="font-semibold mb-2 text-white/80">
                {q.text}
              </div>
            );
          }

          if (q.type === 'fill-in-line') {
            return (
            <li key={`fill-${q.number}`} className="rounded-2xl border border-white/5 p-4 bg-white/5">
                <div className="text-white font-semibold mb-2">
                  {q.text.split('____').map((part, j, arr) => (
                    <span key={j}>
                      {part}
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
            <li key={`q-${q.number}`} className="rounded-2xl border border-white/5 p-4 bg-white/[0.02]">
              <div className="mb-3 text-white font-semibold">
                {q.number}. {q.question}
              </div>
              <div className="flex flex-wrap gap-3">
                {q.options?.map(option => (
                  <label
                    key={option}
                    className={`flex items-center gap-2 rounded-2xl border px-4 py-2 text-sm transition ${
                      answers[q.number]?.includes(option)
                        ? 'border-sky-400/60 bg-sky-400/10 text-white'
                        : 'border-white/10 bg-white/5 text-white/70 hover:text-white hover:border-white/40'
                    }`}
                  >
                    <input
                      type={q.type === 'multi' ? 'checkbox' : 'radio'}
                      name={`q-${q.number}`}
                      value={option}
                      checked={answers[q.number]?.includes(option) || false}
                      onChange={() => handleSelectionAnswer(q.number, option, q.type === 'multi')}
                      className="accent-sky-500"
                    />
                    <span>{option}</span>
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
