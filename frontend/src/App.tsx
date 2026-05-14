import { useEffect, useRef } from 'react'
import { useStore } from './store'
import Auth from './components/Auth'
import Dashboard from './components/Dashboard'
import './App.css'

function App() {
  const { user, fetchUser, fetchTeam, addMessage, setMessages, setTasks } = useStore()
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token && !user) {
      fetchUser()
    }
  }, [])

  useEffect(() => {
    if (!user) return

    // WebSocket — живёт на уровне App
    const token = localStorage.getItem('token')
    const ws = new WebSocket(`ws://localhost:3000/ws?token=${token}`)
    wsRef.current = ws
    ;(window as any).__appWs = ws

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'message' && data.data?.message?.taskId) {
          addMessage(data.data.message)
        }
        if (data.type === 'team_update') {
          fetchTeam()
        }
      } catch (err) {
        console.error('WS parse error:', err)
      }
    }

    // Загрузка сообщений
    const token2 = localStorage.getItem("token")
    fetch("/api/chat", { headers: { "Authorization": `Bearer ${token2}` } })
      .then(r => r.json()).then(msgs => setMessages(msgs)).catch(() => {})

    // Polling команды каждые 5 секунд
    // Загрузка задач
    if (user?.teamId) {
      const token3 = localStorage.getItem("token")
      fetch("/api/tasks", { headers: { "Authorization": `Bearer ${token3}` } })
        .then(r => r.json()).then(tasks => setTasks(tasks)).catch(() => {})
    }

    const interval = setInterval(() => {
      if (user?.teamId) {
        fetchTeam()
        const t = localStorage.getItem("token")
        fetch("/api/tasks", { headers: { "Authorization": `Bearer ${t}` } })
          .then(r => r.json()).then(d => setTasks(d)).catch(() => {})
      }
    }, 5000)

    return () => {
      ws.close()
      clearInterval(interval)
    }
  }, [user])

  return (
    <div>
      {user ? <Dashboard /> : <Auth />}
    </div>
  )
}

export default App
