import { useState } from 'react'
import JobSearch from './components/JobSearch'
import SkillsAnalyzer from './components/SkillsAnalyzer'
import CareerChat from './components/CareerChat'
import Model8Chat from './components/ClaudeChat'
import Header from './components/Header'

function App() {
  const [activeTab, setActiveTab] = useState('search')

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'search':
        return <JobSearch />
      case 'skills':
        return <SkillsAnalyzer />
      case 'chat':
        return <CareerChat />
      case 'claude':
        return <Model8Chat />
      default:
        return <JobSearch />
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      <main className="container mx-auto px-4 py-8">
        {renderActiveComponent()}
      </main>

      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-gray-600">
            <p>&copy; 2025 Job8earch. Find your next opportunity with AI-powered insights.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
