type Props = {
  title: string;
  content: string;
  wordCount: number;
};

export default function WritingPrompt({ title, content, wordCount }: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-[#050b14]/60 to-transparent p-6 text-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.6)] backdrop-blur-2xl h-[80vh] overflow-y-auto">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Writing prompt</p>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mb-5">
        <p className="text-sm text-white/70 mb-2">You are drafting this response live. Keep the tone examiner-ready.</p>
        <div className="flex items-center justify-between text-xs uppercase tracking-[0.4em] text-white/50">
          <span>Words</span>
          <span className="text-base tracking-normal text-white font-semibold">{wordCount}/250</span>
        </div>
        <div className="mt-3 h-2 rounded-full bg-white/10 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-amber-300 to-rose-400 transition-all"
            style={{ width: `${Math.min((wordCount / 250) * 100, 120)}%` }}
          />
        </div>
      </div>

      <p className="whitespace-pre-wrap text-base leading-relaxed text-white/80">{content}</p>
    </div>
  );
}
