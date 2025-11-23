import { Save } from 'lucide-react';
import { wordCount } from '@/utils/writing';

type Props = {
  essay: string;
  setEssay: (text: string) => void;
};

export default function EssayEditor({ essay, setEssay }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.45)] backdrop-blur-2xl h-[80vh] overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Essay editor</p>
          <h3 className="text-2xl font-semibold text-white">Draft board</h3>
        </div>
        <div className="inline-flex items-center gap-2 rounded-2xl border border-white/15 px-4 py-2 text-xs text-white/70">
          <Save className="h-4 w-4 text-emerald-300" />
          Auto-save on
        </div>
      </div>

      <textarea
        value={essay}
        onChange={e => setEssay(e.target.value)}
        placeholder="Start writing your essay here..."
        className="w-full h-[60vh] rounded-3xl border border-white/10 bg-black/30 p-5 text-base text-white placeholder-white/40 focus:border-sky-400 focus:outline-none focus:ring-2 focus:ring-sky-500/30"
      />

      <div className="mt-4 flex items-center justify-between text-sm text-white/60">
        <p>Words: {wordCount(essay)}</p>
        <p>Characters: {essay.length}</p>
      </div>
    </div>
  );
}
