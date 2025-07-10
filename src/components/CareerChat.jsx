import React, { useState, useRef, useEffect } from 'react'
import openRouterService from '../services/openRouterApi'
import LoadingSpinner from './LoadingSpinner'

const CareerChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'assistant',
      content: "Hi! I'm your AI Career Assistant powered by Claude. I can help you with:\n\n• Interview preparation\n• Resume and cover letter advice\n• Career path guidance\n• Salary negotiation tips\n• Skill development recommendations\n• Job search strategies\n\nWhat would you like to discuss today?",
      timestamp: new Date().toISOString()
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [context, setContext] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

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
      const systemPrompt = context ? `Context: ${context}\n\nYou are a career advisor. Provide helpful career advice. Be specific, actionable, and encouraging.` : 'You are a career advisor. Provide helpful career advice. Be specific, actionable, and encouraging.';
      const result = await openRouterService.chatWithAI(inputMessage, systemPrompt)

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.success ? result.response : result.error,
        timestamp: new Date().toISOString(),
        error: !result.success
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
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
      const systemPrompt = context ? `Context: ${context}\n\nYou are a career advisor. Provide helpful career advice. Be specific, actionable, and encouraging.` : 'You are a career advisor. Provide helpful career advice. Be specific, actionable, and encouraging.';
      const result = await openRouterService.chatWithAI(prompt, systemPrompt)

      const assistantMessage = {
        id: Date.now() + 1,
        type: 'assistant',
        content: result.success ? result.response : result.error,
        timestamp: new Date().toISOString(),
        error: !result.success
      }

      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
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
        content: "Chat cleared! How can I help you with your career today?",
        timestamp: new Date().toISOString()
      }
    ])
    setContext('')
  }

  const formatTime = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  const quickPrompts = [
    "Help me prepare for a software developer interview",
    "How do I negotiate my salary?",
    "What skills should I learn for career growth?",
    "Review my resume structure",
    "How to write a compelling cover letter?",
    "Tips for networking in tech industry",
    "How to transition to a new career field?",
    "What questions should I ask in an interview?"
  ]

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Career Assistant
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Get personalized career guidance powered by Claude AI
        </p>
      </div>

      {/* Context Input */}
      <div className="card mb-6">
        <label htmlFor="context" className="block text-sm font-medium text-gray-700 mb-2">
          Career Context (Optional)
        </label>
        <textarea
          id="context"
          value={context}
          onChange={(e) => setContext(e.target.value)}
          placeholder="Tell me about your current role, experience level, career goals, or any specific situation you'd like help with..."
          rows={3}
          className="input-field resize-none"
        />
        <p className="text-sm text-gray-500 mt-1">
          Providing context helps me give more personalized advice
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
            placeholder="Ask me anything about your career..."
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
            Career AI Assistant
          </div>
        </div>
      </div>

      {/* Quick Prompts */}
      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
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
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-purple-900 mb-4">
          💡 Tips for Better Conversations
        </h3>
        <ul className="space-y-2 text-purple-800">
          <li>• Be specific about your situation and goals</li>
          <li>• Provide context about your experience level and industry</li>
          <li>• Ask follow-up questions to dive deeper into topics</li>
          <li>• Use the context field to maintain conversation continuity</li>
          <li>• Feel free to ask for examples, templates, or step-by-step guidance</li>
        </ul>
      </div>
    </div>
  )
}

export default CareerChat
