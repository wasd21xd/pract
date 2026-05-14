import { useState } from 'react'
import { useStore } from '../store'
import './TaskCard.css'

interface TaskCardProps {
  task: {
    id: string
    title: string
    description: string
    status: 'todo' | 'in-progress' | 'done'
    assignedTo?: string
    teamId: string
    createdAt: string
  }
}

function TaskCard({ task }: TaskCardProps) {
  const { removeTask, updateTask } = useStore()
  const [isEditing, setIsEditing] = useState(false)
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description)

  const handleDelete = async () => {
    if (!window.confirm('Удалить задачу?')) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      })

      if (res.ok) {
        removeTask(task.id)
      }
    } catch (err) {
      console.error('Failed to delete task:', err)
    }
  }

  const handleStatusChange = (newStatus: 'todo' | 'in-progress' | 'done') => {
    updateTask(task.id, { status: newStatus })
  }

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ title, description })
      })

      if (res.ok) {
        updateTask(task.id, { title, description })
        setIsEditing(false)
      }
    } catch (err) {
      console.error('Failed to update task:', err)
    }
  }

  return (
    <div className="task-card">
      {isEditing ? (
        <div className="edit-mode">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Название"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Описание"
          />
          <div className="edit-actions">
            <button className="save-btn" onClick={handleSave}>Сохранить</button>
            <button className="cancel-btn" onClick={() => setIsEditing(false)}>Отмена</button>
          </div>
        </div>
      ) : (
        <>
          <h3>{task.title}</h3>
          {task.description && <p>{task.description}</p>}
          
          <div className="task-meta">
            <select 
              value={task.status}
              onChange={(e) => handleStatusChange(e.target.value as any)}
              className="status-select"
            >
              <option value="todo">К выполнению</option>
              <option value="in-progress">В процессе</option>
              <option value="done">Готово</option>
            </select>
          </div>

          <div className="task-actions">
            <button className="edit-btn" onClick={() => setIsEditing(true)}>✏️</button>
            <button className="delete-btn" onClick={handleDelete}>🗑️</button>
          </div>
        </>
      )}
    </div>
  )
}

export default TaskCard
