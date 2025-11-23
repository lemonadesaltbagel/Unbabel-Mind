import { Mic, MicOff, Play, Radio } from 'lucide-react';

type Props = {
  title: string;
  content: string;
  recording: boolean;
  audioUrl: string | null;
  onStartRecording: () => void;
  onStopRecording: () => void;
};

export default function SpeakingPrompt({
  title,
  content,
  recording,
  audioUrl,
  onStartRecording,
  onStopRecording
}: Props) {
  return (
    <div className="rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-[#050b14]/60 to-transparent p-6 text-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.6)] backdrop-blur-2xl h-[80vh] overflow-y-auto">
      <div className="flex flex-col gap-1 mb-5">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50 flex items-center gap-2">
          <Radio className="h-4 w-4 text-emerald-300" />
          Speaking prompt
        </p>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>

      <div className="rounded-3xl border border-white/10 bg-white/5 p-5 mb-5">
        <p className="text-xs uppercase tracking-[0.4em] text-white/50 text-center mb-4">Recorder</p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={recording ? onStopRecording : onStartRecording}
            className={`inline-flex items-center gap-2 rounded-2xl px-5 py-2 text-sm font-semibold transition ${
              recording ? 'bg-rose-500 text-white hover:bg-rose-400' : 'bg-emerald-400 text-slate-900 hover:bg-emerald-300'
            }`}
          >
            {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            {recording ? 'Stop recording' : 'Start recording'}
          </button>
          {audioUrl && (
            <button className="inline-flex items-center gap-2 rounded-2xl border border-white/20 px-4 py-2 text-sm text-white/80 hover:text-white hover:border-white/50 transition">
              <Play className="h-4 w-4" />
              Play recording
            </button>
          )}
        </div>
        <p className="mt-4 text-center text-xs text-white/60">
          Keep eye contact, maintain tempo, and pause intentionally to highlight structure.
        </p>
      </div>

      <p className="whitespace-pre-wrap text-base leading-relaxed text-white/80">{content}</p>
    </div>
  );
}
