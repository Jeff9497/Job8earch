import React, { useState } from 'react'
import { formatSalary, formatJobType } from '../services/reedApi'
import openRouterService from '../services/openRouterApi'

const JobCard = ({ job }) => {
  const [showFullDescription, setShowFullDescription] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState(null)

  const handleAnalyzeJob = async () => {
    setAnalyzing(true)
    try {
      const result = await openRouterService.analyzeJobPosting(job)
      setAnalysis(result)
    } catch (error) {
      console.error('Failed to analyze job:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const handleGetSkills = async () => {
    setAnalyzing(true)
    try {
      const result = await openRouterService.analyzeJobSkills(job.jobTitle, job.jobDescription)
      setAnalysis(result)
    } catch (error) {
      console.error('Failed to get skills:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  const truncateText = (text, maxLength = 200) => {
    if (!text) return ''
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + '...'
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Recently posted'
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`
    return date.toLocaleDateString()
  }

  return (
    <div className="card hover:shadow-lg transition-shadow duration-200">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {job.jobTitle}
          </h3>
          <div className="flex items-center space-x-4 text-gray-600 mb-2">
            <span className="font-medium">{job.employerName}</span>
            <span>📍 {job.locationName}</span>
            <span>🕒 {formatDate(job.date)}</span>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-semibold text-primary-600 mb-1">
            {formatSalary(job.minimumSalary, job.maximumSalary)}
          </div>
          <div className="text-sm text-gray-500">
            {formatJobType(job)}
          </div>
        </div>
      </div>

      {/* Job Description */}
      <div className="mb-4">
        <div className="text-gray-700">
          {showFullDescription ? (
            <div dangerouslySetInnerHTML={{ __html: job.jobDescription }} />
          ) : (
            <p>{truncateText(job.jobDescription?.replace(/<[^>]*>/g, ''))}</p>
          )}
        </div>
        
        {job.jobDescription && job.jobDescription.length > 200 && (
          <button
            onClick={() => setShowFullDescription(!showFullDescription)}
            className="text-primary-600 hover:text-primary-700 text-sm font-medium mt-2"
          >
            {showFullDescription ? 'Show Less' : 'Show More'}
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3 mb-4">
        <a
          href={job.jobUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
        >
          Apply Now
        </a>
        
        <button
          onClick={handleGetSkills}
          disabled={analyzing}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : '🎯 Required Skills'}
        </button>
        
        <button
          onClick={handleAnalyzeJob}
          disabled={analyzing}
          className="btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {analyzing ? 'Analyzing...' : '🤖 AI Analysis'}
        </button>
      </div>

      {/* AI Analysis Results */}
      {analysis && (
        <div className="border-t border-gray-200 pt-4">
          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <span className="text-blue-600 text-lg mr-2">🤖</span>
              <h4 className="font-semibold text-blue-900">
                {analysis.success ? 'AI Analysis' : 'Analysis Error'}
              </h4>
            </div>
            
            {analysis.success ? (
              <div className="text-blue-800 whitespace-pre-wrap">
                {analysis.analysis || analysis.response}
              </div>
            ) : (
              <div className="text-red-600">
                {analysis.error}
                {analysis.fallback && (
                  <div className="mt-2 text-blue-800">
                    <strong>Basic Skills:</strong> {analysis.fallback}
                  </div>
                )}
              </div>
            )}
            
            <button
              onClick={() => setAnalysis(null)}
              className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-2"
            >
              Close Analysis
            </button>
          </div>
        </div>
      )}

      {/* Job Tags */}
      <div className="flex flex-wrap gap-2 mt-4">
        {job.fullTime && (
          <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
            Full-time
          </span>
        )}
        {job.partTime && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
            Part-time
          </span>
        )}
        {job.permanent && (
          <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
            Permanent
          </span>
        )}
        {job.contract && (
          <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full">
            Contract
          </span>
        )}
        {job.temp && (
          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
            Temporary
          </span>
        )}
      </div>
    </div>
  )
}

export default JobCard
