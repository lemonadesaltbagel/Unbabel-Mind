import { Highlight } from '@/types/reading';

type Props = {
  title: string;
  content: string;
  highlights: Highlight[];
  onContextMenu: (e: React.MouseEvent) => void;
  className?: string;
};

export default function ReadingPassage({ title, content, highlights, onContextMenu, className = '' }: Props) {
  const renderHighlightedText = (passageContent: string, highlights: Highlight[]) => {
    let lastIndex = 0;
    const sortedHighlights = highlights
      .filter(hl => hl.textId === 'passage')
      .sort((a, b) => a.start - b.start);
    
    const result: React.ReactElement[] = [];
    
    sortedHighlights.forEach((highlight, i) => {
      if (highlight.start > lastIndex) {
        result.push(
          <span key={`text-${i}`}>
            {passageContent.slice(lastIndex, highlight.start)}
          </span>
        );
      }
      result.push(
        <span key={`highlight-${i}`} className="bg-sky-400/30 text-white rounded-sm px-0.5">
          {passageContent.slice(highlight.start, highlight.end)}
        </span>
      );
      lastIndex = highlight.end;
    });
    
    if (lastIndex < passageContent.length) {
      result.push(
        <span key="text-last">
          {passageContent.slice(lastIndex)}
        </span>
      );
    }
    
    return result;
  };

  return (
    <div
      className={`rounded-[28px] border border-white/10 bg-white/[0.04] shadow-[0_25px_80px_rgba(2,6,23,0.55)] p-6 text-slate-200 backdrop-blur-2xl h-[80vh] overflow-y-auto ${className}`}
    >
      <div className="flex flex-col gap-1 mb-4">
        <p className="text-[11px] uppercase tracking-[0.4em] text-white/50">Reading passage</p>
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
      </div>
      <p 
        className="whitespace-pre-wrap text-base leading-relaxed passage-content"
        onContextMenu={onContextMenu}
      >
        {renderHighlightedText(content, highlights)}
      </p>
    </div>
  );
} 
