import { useState, useEffect } from 'react'
import { useStore } from '../store'
import TaskCard from './TaskCard'
import './TaskBoard.css'

function TaskBoard() {
  const { user, tasks, setTasks, addTask } = useStore()
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (user?.teamId) {
      fetchTasks()
    }
  }, [user])

  const fetchTasks = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch(`/api/tasks`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTasks(data)
      }
    } catch (err) {
      console.error('Failed to fetch tasks:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !user?.teamId) return

    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          title,
          description,
          teamId: user.teamId,
          status: 'todo'
        })
      })

      if (res.ok) {
        const newTask = await res.json()
        addTask({
          title: newTask.title,
          description: newTask.description,
          status: newTask.status,
          teamId: newTask.teamId
        })
        setTitle('')
        setDescription('')
      }
    } catch (err) {
      console.error('Failed to add task:', err)
    }
  }

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    'in-progress': tasks.filter(t => t.status === 'in-progress'),
    done: tasks.filter(t => t.status === 'done')
  }

  if (loading) return <div className="loading">Загрузка задач...</div>

  return (
    <div className="task-board">
      <div className="task-form">
        <form onSubmit={handleAddTask}>
          <input
            type="text"
            placeholder="Название задачи"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Описание"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          <button type="submit">+ Добавить задачу</button>
        </form>
      </div>

      <div className="board">
        <div className="column">
          <h2>К выполнению ({groupedTasks.todo.length})</h2>
          <div className="tasks-list">
            {groupedTasks.todo.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="column">
          <h2>В процессе ({groupedTasks['in-progress'].length})</h2>
          <div className="tasks-list">
            {groupedTasks['in-progress'].map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>

        <div className="column">
          <h2>Готово ({groupedTasks.done.length})</h2>
          <div className="tasks-list">
            {groupedTasks.done.map(task => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TaskBoard
