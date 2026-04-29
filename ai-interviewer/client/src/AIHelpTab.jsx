import { useState } from 'react'

const AIHelpTab = () => {
  const [apiKey, setApiKey] = useState('')
  const [prompt, setPrompt] = useState('')
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(false)

  const sendMessage = async () => {
    if (!prompt.trim() || !apiKey.trim()) return

    const userMsg = { role: 'user', content: prompt }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setPrompt('')

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, apiKey })
      })
      const data = await response.json()
      if (data.response) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }])
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: data.error || 'Error' }])
      }
    } catch (error) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Network error' }])
    }
    setLoading(false)
  }

  return (
    <div>
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">Gemini API Key</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Enter your Gemini API key"
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
        <p className="text-xs text-gray-500 mt-1">Get from https://aistudio.google.com/app/apikey (use gemini-1.5-flash)</p>
      </div>
      <div className="chat-container max-h-[400px] overflow-y-auto mb-6 bg-gray-50 p-4 rounded-xl space-y-4">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[70%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-white shadow'}`}>
              <p className="whitespace-pre-wrap">{msg.content}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-white shadow p-3 rounded-lg">Typing...</div>
          </div>
        )}
        {messages.length === 0 && (
          <p className="text-gray-500 text-center py-8">Paste transcript or ask question for AI help (e.g., "Summarize this interview")</p>
        )}
      </div>
      <div className="flex gap-2">
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Type your query or paste transcript..."
          className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="3"
        />
        <button
          onClick={sendMessage}
          disabled={loading || !prompt.trim() || !apiKey.trim()}
          className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 font-medium"
        >
          Send
        </button>
      </div>
    </div>
  )
}

export default AIHelpTab

