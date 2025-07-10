import React from 'react'

const Header = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'search', name: 'Job Search', icon: '🔍' },
    { id: 'skills', name: 'Skills Analyzer', icon: '🎯' },
    { id: 'chat', name: 'Career Assistant', icon: '💬' },
    { id: 'claude', name: 'Chat with Model8', icon: '🤖' }
  ]

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-primary-600">
              Job8earch
            </div>
            <div className="text-sm text-gray-500 hidden sm:block">
              AI-Powered Job Discovery
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="flex space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="hidden sm:inline">{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
