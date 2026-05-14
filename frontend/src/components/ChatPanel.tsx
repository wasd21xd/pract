import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import './ChatPanel.css'

function ChatPanel() {
  const { user, messages } = useStore()
  const [message, setMessage] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user) return

    const msgObj = {
      id: Date.now().toString() + Math.random().toString(36).slice(2),
      taskId: selectedTaskId || 'general',
      userId: user.id,
      userName: user.name,
      message,
      createdAt: new Date().toISOString()
    }

    const token = localStorage.getItem("token")
    fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
      body: JSON.stringify({ message: msgObj.message })
    }).catch(() => {})

    const ws = (window as any).__appWs
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'message', message: msgObj }))
    }

    setMessage('')
  }

  const filteredMessages = messages.filter(m => {
    if (!m || !m.taskId) return false
    return selectedTaskId ? m.taskId === selectedTaskId : m.taskId === 'general'
  })

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>💬 Чат</h2>
        {selectedTaskId && (
          <button className="close-task-filter" onClick={() => setSelectedTaskId('')}>
            ✕ Очистить фильтр
          </button>
        )}
      </div>
      <div className="messages-container">
        {filteredMessages.length === 0 ? (
          <div className="no-messages"><p>Нет сообщений</p></div>
        ) : (
          filteredMessages.map(msg => (
            <div key={msg.id} className={`message ${msg.userId === user?.id ? 'own' : 'other'}`}>
              <div className="message-header">
                <span className="sender">{msg.userName}</span>
                <span className="time">
                  {new Date(msg.createdAt).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
              <div className="message-text">{msg.message}</div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="chat-form">
        <input
          type="text"
          placeholder="Введите сообщение..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button type="submit" disabled={!message.trim()}>Отправить</button>
      </form>
    </div>
  )
}

export default ChatPanel
