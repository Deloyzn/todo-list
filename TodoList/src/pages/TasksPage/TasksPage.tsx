import { useState } from 'react'
import { TasksManagement } from '@/components/TasksManagement'
import './TasksPage.css'

export function TasksPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const handleTabClick = (tab: 'active' | 'completed') => {
    setActiveTab(tab)
  }

  return (
    <div className="tasks-page">
      
      {/* Main Content */}
      <main className="tasks-container">
        <div className="tasks-content">
          {/* Tabs */}
          <div className="tasks-tabs">
            <button 
              className={`tab-btn ${activeTab === 'active' ? 'tab-btn--active' : ''}`}
              onClick={() => handleTabClick('active')}
            >
              <span className="tab-icon">📋</span> Активные
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'tab-btn--active' : ''}`}
              onClick={() => handleTabClick('completed')}
            >
              <span className="tab-icon">✓</span> Выполненные
            </button>
          </div>
          <TasksManagement activeTab={activeTab} />
        </div>

        {/* Sidebar with Navigation */}
        <aside className="sidebar">
          <nav className="nav">
            <div className="nav-section">
              <h4 className="nav-title">Статус</h4>
              <ul className="nav-list">
                <li className={`nav-item ${activeTab === 'active' ? 'nav-item--active' : ''}`}>
                  <button 
                    className="nav-link nav-link--button"
                    onClick={() => handleTabClick('active')}
                  >
                    <span className="nav-icon">📋</span>
                    Активные
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'completed' ? 'nav-item--active' : ''}`}>
                  <button 
                    className="nav-link nav-link--button"
                    onClick={() => handleTabClick('completed')}
                  >
                  <span className="nav-icon">✓</span>
                    Выполненные
                  </button>
                </li>
              </ul>
            </div>

            <div className="nav-section">
              <h4 className="nav-title">Фильтр</h4>
              <ul className="nav-list">
                <li className="nav-item">
                  <a href="#today" className="nav-link">
                    <span className="nav-icon">🕐</span>
                    На сегодня
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#week" className="nav-link">
                    <span className="nav-icon">📅</span>
                    На неделю
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
      </main>
    </div>
  )
}
