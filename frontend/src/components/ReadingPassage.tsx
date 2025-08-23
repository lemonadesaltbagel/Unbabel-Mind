import { Highlight } from '@/types/reading';

type Props = {
  title: string;
  content: string;
  highlights: Highlight[];
  onContextMenu: (e: React.MouseEvent) => void;
};

export default function ReadingPassage({ title, content, highlights, onContextMenu }: Props) {
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
        <span key={`highlight-${i}`} className="bg-yellow-200">
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
    <div className="bg-white p-6 rounded-xl shadow w-full lg:w-3/5 h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">Reading Section</h2>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      <p 
        className="whitespace-pre-wrap text-sm" 
        onContextMenu={onContextMenu}
      >
        {renderHighlightedText(content, highlights)}
      </p>
    </div>
  );
} 