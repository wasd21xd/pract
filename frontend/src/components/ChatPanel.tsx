import { useState, useEffect, useRef } from 'react'
import { useStore } from '../store'
import './ChatPanel.css'

function ChatPanel() {
  const { user, messages, addMessage } = useStore()
  const [message, setMessage] = useState('')
  const [selectedTaskId, setSelectedTaskId] = useState('')
  const [ws, setWs] = useState<WebSocket | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    connectWebSocket()
    return () => {
      if (ws) ws.close()
    }
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const connectWebSocket = () => {
    try {
      const token = localStorage.getItem('token')
      const wsUrl = `ws://localhost:3000/ws?token=${token}`
      const newWs = new WebSocket(wsUrl)

      newWs.onopen = () => {
        console.log('WebSocket connected')
      }

      newWs.onmessage = (event) => {
        const data = JSON.parse(event.data)
        if (data.type === 'message') {
          addMessage(data.message)
        }
      }

      newWs.onerror = (err) => {
        console.error('WebSocket error:', err)
      }

      setWs(newWs)
    } catch (err) {
      console.error('Failed to connect WebSocket:', err)
    }
  }

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim() || !user) return

    const msgObj = {
      id: Date.now().toString(),
      taskId: selectedTaskId || 'general',
      userId: user.id,
      userName: user.name,
      message,
      createdAt: new Date().toISOString()
    }

    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({
        type: 'message',
        message: msgObj
      }))
    }

    addMessage(msgObj)
    setMessage('')
  }

  const filteredMessages = selectedTaskId 
    ? messages.filter(m => m.taskId === selectedTaskId)
    : messages.filter(m => m.taskId === 'general')

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <h2>💬 Чат</h2>
        {selectedTaskId && (
          <button 
            className="close-task-filter"
            onClick={() => setSelectedTaskId('')}
          >
            ✕ Очистить фильтр
          </button>
        )}
      </div>

      <div className="messages-container">
        {filteredMessages.length === 0 ? (
          <div className="no-messages">
            <p>Нет сообщений</p>
          </div>
        ) : (
          filteredMessages.map(msg => (
            <div 
              key={msg.id} 
              className={`message ${msg.userId === user?.id ? 'own' : 'other'}`}
            >
              <div className="message-header">
                <span className="sender">{msg.userName}</span>
                <span className="time">
                  {new Date(msg.createdAt).toLocaleTimeString('ru-RU', {
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
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
        <button type="submit" disabled={!message.trim()}>
          Отправить
        </button>
      </form>
    </div>
  )
}

export default ChatPanel
