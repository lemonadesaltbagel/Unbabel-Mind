import { Mic, MicOff, Play } from 'lucide-react';

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
    <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">Speaking Section</h2>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      
      <div className="bg-blue-50 p-4 rounded-lg mb-4">
        <div className="text-center text-blue-600 mb-2">🎤 Recording Section</div>
        <div className="flex justify-center space-x-4">
          <button 
            onClick={recording ? onStopRecording : onStartRecording} 
            className={`px-4 py-2 rounded flex items-center space-x-2 ${
              recording 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : 'bg-blue-500 hover:bg-blue-600 text-white'
            }`}
          >
            {recording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            <span>{recording ? 'Stop Recording' : 'Start Recording'}</span>
          </button>
          
          {audioUrl && (
            <button className="px-4 py-2 rounded bg-green-500 hover:bg-green-600 text-white flex items-center space-x-2">
              <Play className="w-4 h-4" />
              <span>Play Recording</span>
            </button>
          )}
        </div>
      </div>
      
      <p className="whitespace-pre-wrap text-sm">{content}</p>
    </div>
  );
} 