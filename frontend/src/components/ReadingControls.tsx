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
    <div className="mt-8 flex space-x-4 items-center">
      <button 
        onClick={() => onNavigate('back')} 
        className="px-4 py-2 rounded text-white bg-gray-700 hover:bg-gray-600"
      >
        Back
      </button>
      
      <button 
        onClick={onSubmit} 
        disabled={isSubmitting} 
        className={`px-6 py-2 rounded text-white ${
          isSubmitting 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </button>
      
      <button 
        onClick={() => onNavigate('next')} 
        className={`px-4 py-2 rounded text-white ${
          questionType >= 4 
            ? 'bg-gray-500 cursor-not-allowed' 
            : 'bg-gray-700 hover:bg-gray-600'
        }`} 
        disabled={questionType >= 4}
      >
        Next
      </button>
    </div>
  );
} 