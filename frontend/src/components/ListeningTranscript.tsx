type Props = { title: string };

export default function ListeningTranscript({ title }: Props) {
  return (
    <div className="bg-white p-6 rounded-xl shadow w-full lg:w-1/2 h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-bold mb-2">Listening Section</h2>
      <h3 className="text-md font-semibold mb-4">{title}</h3>
      
      <div className="bg-gray-100 p-4 rounded-lg mb-4">
        <div className="text-center text-gray-600 mb-2">🎧 Audio Player</div>
        <div className="text-center text-sm text-gray-500 mb-4">Audio file would be embedded here</div>
        
        {/* Audio controls placeholder */}
        <div className="flex items-center justify-center space-x-4 mb-4">
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            ⏮️ Previous
          </button>
          <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg transition-colors">
            ▶️ Play
          </button>
          <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors">
            ⏭️ Next
          </button>
        </div>
        
        {/* Progress bar placeholder */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
          <div className="bg-blue-500 h-2 rounded-full" style={{ width: '25%' }}></div>
        </div>
        <div className="text-center text-xs text-gray-500">00:30 / 02:15</div>
      </div>
      
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="text-center text-yellow-800 font-medium mb-2">📝 Instructions</div>
        <div className="text-sm text-yellow-700">
          <p className="mb-2">• Listen to the audio carefully</p>
          <p className="mb-2">• You can replay the audio as many times as needed</p>
          <p className="mb-2">• Answer the questions based on what you hear</p>
          <p>• The transcript will be available in the review section</p>
        </div>
      </div>
    </div>
  );
} 