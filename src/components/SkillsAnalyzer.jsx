import React, { useState } from 'react'
import openRouterService from '../services/openRouterApi'
import { getJobCategories } from '../services/reedApi'
import LoadingSpinner from './LoadingSpinner'

const SkillsAnalyzer = () => {
  const [jobTitle, setJobTitle] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleAnalyze = async (e) => {
    e.preventDefault()
    
    if (!jobTitle.trim()) {
      setError('Please enter a job title')
      return
    }

    setLoading(true)
    setError('')
    
    try {
      const result = await openRouterService.analyzeJobSkills(jobTitle, jobDescription)
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze skills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleQuickAnalyze = async (title) => {
    setJobTitle(title)
    setJobDescription('')
    setLoading(true)
    setError('')
    
    try {
      const result = await openRouterService.analyzeJobSkills(title)
      setAnalysis(result)
    } catch (err) {
      setError('Failed to analyze skills. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const clearAnalysis = () => {
    setAnalysis(null)
    setError('')
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Skills Analyzer
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover the skills you need for any profession with AI-powered analysis
        </p>
      </div>

      {/* Analysis Form */}
      <div className="card mb-8">
        <form onSubmit={handleAnalyze} className="space-y-6">
          <div>
            <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
              Job Title or Profession *
            </label>
            <input
              type="text"
              id="jobTitle"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Developer, Data Scientist, Product Manager"
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700 mb-2">
              Job Description (Optional)
            </label>
            <textarea
              id="jobDescription"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste a job description here for more specific analysis..."
              rows={4}
              className="input-field resize-none"
            />
            <p className="text-sm text-gray-500 mt-1">
              Adding a job description will provide more tailored skill requirements
            </p>
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Analyzing...' : 'Analyze Skills'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Analysis Options */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Analysis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {getJobCategories().map((category) => (
            <button
              key={category}
              onClick={() => handleQuickAnalyze(category)}
              disabled={loading}
              className="btn-secondary text-sm p-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex">
            <div className="text-red-400">⚠️</div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <p className="text-sm text-red-700 mt-1">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Loading Spinner */}
      {loading && <LoadingSpinner text="Analyzing skills requirements..." />}

      {/* Analysis Results */}
      {analysis && !loading && (
        <div className="card">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Skills Analysis: {analysis.jobTitle}
              </h2>
              <p className="text-gray-600 mt-1">
                AI-powered breakdown of required skills and qualifications
              </p>
            </div>
            <button
              onClick={clearAnalysis}
              className="text-gray-400 hover:text-gray-600 text-xl"
            >
              ✕
            </button>
          </div>

          {analysis.success ? (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-blue-600 text-2xl mr-3">🤖</span>
                <h3 className="text-lg font-semibold text-blue-900">
                  Claude AI Analysis
                </h3>
              </div>
              
              <div className="prose prose-blue max-w-none">
                <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                  {analysis.analysis}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <span className="text-red-600 text-2xl mr-3">⚠️</span>
                <h3 className="text-lg font-semibold text-red-900">
                  Analysis Failed
                </h3>
              </div>
              
              <p className="text-red-700 mb-4">{analysis.error}</p>
              
              {analysis.fallback && (
                <div className="bg-white rounded-lg p-4 border border-red-200">
                  <h4 className="font-semibold text-gray-900 mb-2">Basic Skills Information:</h4>
                  <p className="text-gray-700">{analysis.fallback}</p>
                </div>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <button
              onClick={() => handleAnalyze({ preventDefault: () => {} })}
              disabled={loading}
              className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              🔄 Re-analyze
            </button>
            
            <button
              onClick={() => {
                const text = `Skills Analysis for ${analysis.jobTitle}:\n\n${analysis.analysis || analysis.error}`
                navigator.clipboard.writeText(text)
                alert('Analysis copied to clipboard!')
              }}
              className="btn-secondary"
            >
              📋 Copy Analysis
            </button>
          </div>
        </div>
      )}

      {/* Tips Section */}
      {!analysis && !loading && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            💡 Tips for Better Analysis
          </h3>
          <ul className="space-y-2 text-green-800">
            <li>• Be specific with job titles (e.g., "Senior React Developer" vs "Developer")</li>
            <li>• Include job descriptions for more tailored skill requirements</li>
            <li>• Try different variations of the same role to compare requirements</li>
            <li>• Use the analysis to identify skill gaps in your current profile</li>
            <li>• Save or copy important analyses for future reference</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default SkillsAnalyzer
