import { useState } from 'react'
import { useStore } from '../store'
import TaskBoard from './TaskBoard'
import TeamPanel from './TeamPanel'
import ChatPanel from './ChatPanel'
import './Dashboard.css'

function Dashboard() {
  const { user, logout } = useStore()
  const [activeTab, setActiveTab] = useState<'tasks' | 'team' | 'chat'>('tasks')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <h1>Управление Командой</h1>
          <div className="user-info">
            <span>{user?.name}</span>
            <button className="logout-btn" onClick={logout}>Выход</button>
          </div>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button 
          className={`nav-btn ${activeTab === 'tasks' ? 'active' : ''}`}
          onClick={() => setActiveTab('tasks')}
        >
          📋 Задачи
        </button>
        <button 
          className={`nav-btn ${activeTab === 'team' ? 'active' : ''}`}
          onClick={() => setActiveTab('team')}
        >
          👥 Команда
        </button>
        <button 
          className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          💬 Чат
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'tasks' && <TaskBoard />}
        {activeTab === 'team' && <TeamPanel />}
        {activeTab === 'chat' && <ChatPanel />}
      </main>
    </div>
  )
}

export default Dashboard
