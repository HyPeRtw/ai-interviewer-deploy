import { useState, useEffect, useRef } from 'react'

const TranscriptionTab = () => {
  const [transcript, setTranscript] = useState('')
  const [isListening, setIsListening] = useState(false)
  const recognitionRef = useRef(null)

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech Recognition not supported. Use Chrome for best results.')
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()
    recognition.continuous = true
    recognition.interimResults = true
    recognition.lang = 'en-US'

    recognition.onresult = (event) => {
      let interim = ''
      let final = ''

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptPart = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          final += transcriptPart + ' '
        } else {
          interim += transcriptPart
        }
      }
      setTranscript(prev => prev + final + interim)
    }

    recognition.onend = () => {
      if (isListening) {
        recognition.start() // Restart for continuous
      }
    }

    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error)
      setIsListening(false)
    }

    recognitionRef.current = recognition

    return () => {
      recognition.stop()
    }
  }, [isListening])

  const startListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.start()
      setIsListening(true)
    }
  }

  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      setIsListening(false)
    }
  }

  const clearTranscript = () => {
    setTranscript('')
  }

  return (
    <div>
      <div className="flex gap-4 mb-6">
        <button
          onClick={startListening}
          disabled={isListening}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Start Listening
        </button>
        <button
          onClick={stopListening}
          disabled={!isListening}
          className="px-6 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
        >
          Stop
        </button>
        <button
          onClick={clearTranscript}
          className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
        >
          Clear
        </button>
      </div>
      <div className="bg-gray-100 p-6 rounded-xl min-h-[300px] max-h-[500px] overflow-y-auto">
        <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">{transcript || 'Transcript will appear here... (Grant mic permission)'}</pre>
      </div>
      <p className="text-sm text-gray-500 mt-4">Tip: Share tab audio in Zoom/Teams for meeting transcription.</p>
    </div>
  )
}

export default TranscriptionTab

