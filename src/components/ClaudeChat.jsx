import React, { useState, useRef, useEffect } from 'react'
import openRouterService from '../services/openRouterApi'
import LoadingSpinner from './LoadingSpinner'

const Model8Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hello! I'm your AI assistant. I can help you with a wide variety of topics including:\n\n• General questions and explanations\n• Writing and editing assistance\n• Problem-solving and analysis\n• Creative projects\n• Learning and education\n• Technology and programming\n• And much more!\n\nWhat would you like to talk about today?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedModel, setSelectedModel] = useState(openRouterService.getAvailableModels()[0].id)
  const [connectionStatus, setConnectionStatus] = useState(null)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const testApiConnection = async () => {
    setConnectionStatus('testing')
    try {
      const result = await openRouterService.testConnection()
      setConnectionStatus(result.success ? 'success' : 'failed')

      const testMessage = {
        id: Date.now(),
        type: 'assistant',
        content: result.success
          ? `✅ API Connection successful!\n\nTotal models: ${result.totalModels}\nFree models: ${result.freeModels}\n\nSome available free models:\n${result.freeModelsList.slice(0, 5).map(m => `• ${m.name} (${m.id})`).join('\n')}`
          : `❌ API Connection failed: ${result.error}`,
        timestamp: new Date().toISOString(),
        error: !result.success
      }

      setMessages(prev => [...prev, testMessage])
    } catch (error) {
      setConnectionStatus('failed')
      console.error('Connection test error:', error)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    
    if (!inputMessage.trim()) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setInputMessage('')
    setLoading(true)

    try {
      const result = await openRouterService.chatWithAI(inputMessage, '', selectedModel)

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.success ? result.response : result.error,
        timestamp: new Date().toISOString(),
        error: !result.success,
        model: result.model
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI API Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please make sure you have an internet connection and try again.',
        timestamp: new Date().toISOString(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const handleQuickPrompt = async (prompt) => {
    setInputMessage(prompt)
    
    const userMessage = {
      id: Date.now(),
      type: 'user',
      content: prompt,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMessage])
    setLoading(true)

    try {
      const result = await openRouterService.chatWithAI(prompt, '', selectedModel)

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.success ? result.response : result.error,
        timestamp: new Date().toISOString(),
        error: !result.success,
        model: result.model
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('AI API Error:', error)
      const errorMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
        error: true
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setLoading(false)
    }
  }

  const clearChat = () => {
    setMessages([
      {
        id: 1,
        type: 'assistant',
        content: "Chat cleared! What would you like to talk about?",
        timestamp: new Date().toISOString()
      }
    ])
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const quickPrompts = [
    "Explain quantum computing in simple terms",
    "Help me write a professional email",
    "What are the latest trends in technology?",
    "Give me a creative writing prompt",
    "Explain how machine learning works",
    "Help me plan a healthy meal",
    "What's the best way to learn a new skill?",
    "Tell me an interesting fact about space"
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Chat with Model8
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Have a conversation with AI models about anything you're curious about
        </p>
      </div>

      {/* Model Selector */}
      <div className="card mb-6">
        <label htmlFor="model-select" className="block text-sm font-medium text-gray-700 mb-2">
          Select AI Model
        </label>
        <select
          id="model-select"
          value={selectedModel}
          onChange={(e) => setSelectedModel(e.target.value)}
          className="input-field"
        >
          {openRouterService.getAvailableModels().map((model) => (
            <option key={model.id} value={model.id}>
              {model.name}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500 mt-1">
          Choose from our selection of free AI models
        </p>
      </div>

      {/* Chat Container */}
      <div className="card">
        {/* Chat Messages */}
        <div className="h-96 overflow-y-auto mb-4 border border-gray-200 rounded-lg p-4 bg-gray-50">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.type === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-primary-600 text-white'
                    : message.error
                    ? 'bg-red-100 text-red-800 border border-red-200'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <div className="whitespace-pre-wrap">{message.content}</div>
                <div
                  className={`text-xs mt-1 ${
                    message.type === 'user'
                      ? 'text-primary-200'
                      : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                  {message.model && message.type === 'assistant' && (
                    <span className="ml-2 text-gray-400">
                      • {openRouterService.getAvailableModels().find(m => m.id === message.model)?.name || message.model}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {loading && (
            <div className="text-left mb-4">
              <div className="inline-block bg-white border border-gray-200 rounded-lg px-4 py-2">
                <LoadingSpinner size="small" text="" />
                <span className="text-gray-600 text-sm ml-2">Claude is thinking...</span>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input */}
        <form onSubmit={handleSendMessage} className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 input-field"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputMessage.trim()}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Send
          </button>
        </form>

        {/* Chat Controls */}
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
          <button
            onClick={clearChat}
            className="btn-secondary text-sm"
          >
            🗑️ Clear Chat
          </button>
          
          <div className="text-sm text-gray-500">
            AI Assistant
          </div>
        </div>
      </div>

      {/* API Connection Test */}
      <div className="mt-6">
        <button
          onClick={testApiConnection}
          disabled={loading || connectionStatus === 'testing'}
          className={`btn-primary w-full p-3 disabled:opacity-50 disabled:cursor-not-allowed ${
            connectionStatus === 'success' ? 'bg-green-600 hover:bg-green-700' :
            connectionStatus === 'failed' ? 'bg-red-600 hover:bg-red-700' : ''
          }`}
        >
          {connectionStatus === 'testing' ? '🔄 Testing API Connection...' :
           connectionStatus === 'success' ? '✅ API Connected' :
           connectionStatus === 'failed' ? '❌ API Connection Failed - Retry' :
           '🔧 Test API Connection'}
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Prompts</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {quickPrompts.map((prompt, index) => (
            <button
              key={index}
              onClick={() => handleQuickPrompt(prompt)}
              disabled={loading}
              className="btn-secondary text-left p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-4">
          💡 Tips for Better Conversations
        </h3>
        <ul className="space-y-2 text-blue-800">
          <li>• Be specific and clear in your questions</li>
          <li>• Ask follow-up questions to dive deeper into topics</li>
          <li>• Feel free to ask for examples, explanations, or step-by-step guides</li>
          <li>• I can help with creative tasks, analysis, learning, and problem-solving</li>
          <li>• Don't hesitate to ask me to clarify or rephrase my responses</li>
        </ul>
      </div>
    </div>
  )
}

export default Model8Chat
