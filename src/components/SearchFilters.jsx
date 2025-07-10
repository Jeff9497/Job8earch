import React from 'react'

const SearchFilters = ({ filters, onFiltersChange }) => {
  const handleFilterChange = (key, value) => {
    onFiltersChange({
      ...filters,
      [key]: value
    })
  }

  return (
    <div className="card">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Filters</h3>
      
      <div className="space-y-4">
        {/* Job Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Job Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.fullTime}
                onChange={(e) => handleFilterChange('fullTime', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Full-time</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.partTime}
                onChange={(e) => handleFilterChange('partTime', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Part-time</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.contract}
                onChange={(e) => handleFilterChange('contract', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Contract</span>
            </label>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.temp}
                onChange={(e) => handleFilterChange('temp', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Temporary</span>
            </label>
          </div>
        </div>

        {/* Employment Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Type
          </label>
          <div className="space-y-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.permanent}
                onChange={(e) => handleFilterChange('permanent', e.target.checked)}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="ml-2 text-sm text-gray-700">Permanent</span>
            </label>
          </div>
        </div>

        {/* Salary Range */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Minimum Salary (£)
          </label>
          <input
            type="number"
            value={filters.minimumSalary || ''}
            onChange={(e) => handleFilterChange('minimumSalary', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="e.g. 30000"
            className="input-field"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Maximum Salary (£)
          </label>
          <input
            type="number"
            value={filters.maximumSalary || ''}
            onChange={(e) => handleFilterChange('maximumSalary', e.target.value ? parseInt(e.target.value) : null)}
            placeholder="e.g. 80000"
            className="input-field"
          />
        </div>

        {/* Results per page */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Results per page
          </label>
          <select
            value={filters.resultsToTake}
            onChange={(e) => handleFilterChange('resultsToTake', parseInt(e.target.value))}
            className="input-field"
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
            <option value={100}>100</option>
          </select>
        </div>
      </div>
    </div>
  )
}

export default SearchFilters
