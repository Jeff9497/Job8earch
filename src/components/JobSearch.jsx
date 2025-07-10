import React, { useState, useEffect } from 'react'
import { searchJobs, getJobCategories, getPopularLocations, formatSalary, formatJobType } from '../services/reedApi'
import JobCard from './JobCard'
import SearchFilters from './SearchFilters'
import LoadingSpinner from './LoadingSpinner'

const JobSearch = () => {
  const [searchParams, setSearchParams] = useState({
    keywords: '',
    locationName: '',
    resultsToTake: 20,
    resultsToSkip: 0
  })
  
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [totalResults, setTotalResults] = useState(0)
  const [hasSearched, setHasSearched] = useState(false)

  const handleSearch = async (newParams = searchParams) => {
    setLoading(true)
    setError('')
    
    try {
      const result = await searchJobs(newParams)
      
      if (result.success) {
        setJobs(result.jobs)
        setTotalResults(result.totalResults)
        setHasSearched(true)
      } else {
        setError(result.error)
        setJobs([])
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setJobs([])
    } finally {
      setLoading(false)
    }
  }

  const handleSearchSubmit = (e) => {
    e.preventDefault()
    const updatedParams = { ...searchParams, resultsToSkip: 0 }
    setSearchParams(updatedParams)
    handleSearch(updatedParams)
  }

  const handleLoadMore = () => {
    const updatedParams = {
      ...searchParams,
      resultsToSkip: searchParams.resultsToSkip + searchParams.resultsToTake
    }
    setSearchParams(updatedParams)
    handleSearch(updatedParams).then(() => {
      // Append new results to existing jobs
      searchJobs(updatedParams).then(result => {
        if (result.success) {
          setJobs(prevJobs => [...prevJobs, ...result.jobs])
        }
      })
    })
  }

  const handleQuickSearch = (keywords) => {
    const updatedParams = { ...searchParams, keywords, resultsToSkip: 0 }
    setSearchParams(updatedParams)
    handleSearch(updatedParams)
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Your Dream Job
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Search thousands of jobs with AI-powered insights
        </p>
      </div>

      {/* Search Form */}
      <div className="card mb-8">
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="keywords" className="block text-sm font-medium text-gray-700 mb-2">
                Job Title or Keywords
              </label>
              <input
                type="text"
                id="keywords"
                value={searchParams.keywords}
                onChange={(e) => setSearchParams({ ...searchParams, keywords: e.target.value })}
                placeholder="e.g. Software Developer, Marketing Manager"
                className="input-field"
              />
            </div>
            
            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                value={searchParams.locationName}
                onChange={(e) => setSearchParams({ ...searchParams, locationName: e.target.value })}
                placeholder="e.g. London, Manchester, Remote"
                className="input-field"
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary px-8 py-3 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Searching...' : 'Search Jobs'}
            </button>
          </div>
        </form>
      </div>

      {/* Quick Search Categories */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Popular Job Categories</h3>
        <div className="flex flex-wrap gap-2">
          {getJobCategories().slice(0, 8).map((category) => (
            <button
              key={category}
              onClick={() => handleQuickSearch(category)}
              className="btn-secondary text-sm"
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
      {loading && <LoadingSpinner />}

      {/* Results */}
      {hasSearched && !loading && (
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900">
              Job Results
            </h2>
            <div className="text-gray-600">
              {totalResults > 0 ? `${jobs.length} of ${totalResults} jobs` : 'No jobs found'}
            </div>
          </div>

          {jobs.length > 0 ? (
            <>
              <div className="space-y-4 mb-8">
                {jobs.map((job) => (
                  <JobCard key={job.jobId} job={job} />
                ))}
              </div>

              {/* Load More Button */}
              {jobs.length < totalResults && (
                <div className="text-center">
                  <button
                    onClick={handleLoadMore}
                    disabled={loading}
                    className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Load More Jobs
                  </button>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or browse popular categories above.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default JobSearch
