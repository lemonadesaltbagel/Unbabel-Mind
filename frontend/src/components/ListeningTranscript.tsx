'use client';

import { useState, useEffect } from 'react';
import { SkipBack, SkipForward, Play, Pause, Waves } from 'lucide-react';
import { generateAudioDuration } from '@/utils/listening';

type Props = {
  title: string;
  id: string;
  type: string;
  className?: string;
};

export default function ListeningTranscript({ title, id, type, className = '' }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const duration = generateAudioDuration(id, type);
  const [progress, setProgress] = useState(0);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handlePrevious = () => {
    setCurrentTime(Math.max(0, currentTime - 5));
  };

  const handleNext = () => {
    setCurrentTime(Math.min(duration, currentTime + 5));
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, duration]);

  useEffect(() => {
    setProgress((currentTime / duration) * 100);
  }, [currentTime, duration]);

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-gradient-to-br from-white/[0.05] via-[#050b14]/60 to-transparent p-6 text-slate-200 shadow-[0_25px_80px_rgba(2,6,23,0.6)] backdrop-blur-2xl ${className}`}
    >
      <div className="flex items-start justify-between gap-6 mb-6">
        <div>
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/50 flex items-center gap-2">
            <Waves className="h-4 w-4 text-sky-400" />
            Listening passage
          </p>
          <h3 className="text-3xl font-semibold text-white mt-2">{title}</h3>
          <p className="text-sm text-white/60">Session {type} · Stream {id}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.05] px-4 py-2">
          <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Duration</p>
          <p className="text-xl font-semibold text-white">{formatTime(duration)}</p>
        </div>
      </div>
      <div className="rounded-3xl border border-white/10 bg-white/[0.08] p-5 shadow-inner">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 text-sm text-white/70">
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs uppercase tracking-[0.3em] text-white/60">
              Audio console
            </span>
            <p>{isPlaying ? 'Live playback' : 'Paused'}</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrevious}
              className="rounded-2xl border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/40 transition"
              aria-label="Previous 5 seconds"
            >
              <SkipBack className="h-5 w-5" />
            </button>
            <button
              onClick={handlePlay}
              className={`rounded-2xl px-6 py-2 text-sm font-semibold transition ${
                isPlaying ? 'bg-white/10 text-white border border-white/40' : 'bg-white text-black border border-transparent'
              }`}
            >
              <div className="flex items-center gap-2">
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {isPlaying ? 'Pause' : 'Play'}
              </div>
            </button>
            <button
              onClick={handleNext}
              className="rounded-2xl border border-white/10 p-2 text-white/70 hover:text-white hover:border-white/40 transition"
              aria-label="Next 5 seconds"
            >
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
        </div>
        <div className="mt-6 space-y-2">
          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 to-cyan-300 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-white/60 font-mono">
            <span>{formatTime(currentTime)}</span>
            <span>{formatTime(duration)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
