import { useState } from 'react'
import TranscriptionTab from './TranscriptionTab'
import AIHelpTab from './AIHelpTab'

function App() {
  const [activeTab, setActiveTab] = useState('transcription')

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          AI Interviewer Helper
        </h1>
        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <div className="flex border-b border-gray-200 mb-6">
            <button
              className={`px-6 py-3 font-semibold rounded-t-lg ${activeTab === 'transcription' ? 'bg-blue-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('transcription')}
            >
              Live Transcription
            </button>
            <button
              className={`px-6 py-3 font-semibold rounded-t-lg ${activeTab === 'aihelp' ? 'bg-green-500 text-white' : 'text-gray-500 hover:text-gray-700'}`}
              onClick={() => setActiveTab('aihelp')}
            >
              AI Help
            </button>
          </div>
          {activeTab === 'transcription' && <TranscriptionTab />}
          {activeTab === 'aihelp' && <AIHelpTab />}
        </div>
      </div>
    </div>
  )
}

export default App

