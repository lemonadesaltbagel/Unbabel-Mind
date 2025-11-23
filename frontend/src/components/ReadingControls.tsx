import { ArrowLeft, ArrowRight, Send } from 'lucide-react';

type Props = {
  questionType: number;
  isSubmitting: boolean;
  onSubmit: () => void;
  onNavigate: (direction: 'back' | 'next') => void;
};

export default function ReadingControls({ 
  questionType, 
  isSubmitting, 
  onSubmit, 
  onNavigate 
}: Props) {
  return (
    <div className="mt-8 flex flex-wrap gap-3 items-center justify-center lg:justify-end w-full">
      <button
        onClick={() => onNavigate('back')}
        className="group inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-sm font-medium text-white/80 transition hover:border-white/40 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4 text-white/60 group-hover:text-white" />
        Back
      </button>

      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className={`inline-flex items-center gap-2 rounded-full px-6 py-2 text-sm font-semibold transition ${
          isSubmitting
            ? 'bg-white/10 text-white/60 cursor-not-allowed'
            : 'bg-white text-black hover:bg-slate-100'
        }`}
      >
        <Send className="h-4 w-4" />
        {isSubmitting ? 'Submitting...' : 'Submit answers'}
      </button>
      
      <button 
        onClick={() => onNavigate('next')} 
        className={`group inline-flex items-center gap-2 rounded-full border px-5 py-2 text-sm font-medium ${
          questionType >= 4
            ? 'border-white/5 text-white/40 cursor-not-allowed'
            : 'border-white/10 text-white/80 hover:border-white/40 hover:text-white'
        }`} 
        disabled={questionType >= 4}
      >
        Next
        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition" />
      </button>
    </div>
  );
}
