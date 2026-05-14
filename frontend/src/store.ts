import { create } from 'zustand'

interface User {
  id: string
  email: string
  name: string
  teamId?: string
}

interface Task {
  id: string
  title: string
  description: string
  status: 'todo' | 'in-progress' | 'done'
  assignedTo?: string
  teamId: string
  createdAt: string
}

interface ChatMessage {
  id: string
  taskId: string
  userId: string
  userName: string
  message: string
  createdAt: string
}

interface Store {
  user: User | null
  tasks: Task[]
  messages: ChatMessage[]
  team: { id: string; name: string; code: string; members: User[] } | null

  setUser: (user: User) => void
  logout: () => void
  checkAuth: () => void
  fetchUser: () => Promise<void>

  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void
  removeTask: (id: string) => void
  updateTask: (id: string, task: Partial<Task>) => void
  setTasks: (tasks: Task[]) => void

  addMessage: (message: ChatMessage) => void
  setMessages: (messages: ChatMessage[]) => void

  setTeam: (team: Store["team"]) => void
  fetchTeam: () => Promise<void>
}

export const useStore = create<Store>((set) => ({
  user: null,
  tasks: [],
  messages: [],
  team: null,

  setUser: (user) => set({ user }),

  logout: () => {
    localStorage.removeItem('token')
    set({ user: null, tasks: [], messages: [], team: null })
  },

  checkAuth: async () => {
    const token = localStorage.getItem('token')
    if (token) {
      try {
        const res = await fetch('/api/auth/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        if (res.ok) {
          const user = await res.json()
          set({ user })
        } else {
          localStorage.removeItem('token')
        }
      } catch (err) {
        console.error('Auth check failed:', err)
      }
    }
  },

  fetchUser: async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await fetch('/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const user = await res.json()
        set({ user })
      } else {
        localStorage.removeItem('token')
      }
    } catch (err) {
      console.error('fetchUser error:', err)
    }
  },

  addTask: (task) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    }
    set((state) => ({ tasks: [...state.tasks, newTask] }))
  },

  removeTask: (id) => {
    set((state) => ({ tasks: state.tasks.filter(t => t.id !== id) }))
  },

  updateTask: (id, updates) => {
    set((state) => ({
      tasks: state.tasks.map(t => t.id === id ? { ...t, ...updates } : t)
    }))
  },

  setTasks: (tasks) => set({ tasks }),

  addMessage: (message) => {
    set((state) => ({
      messages: state.messages.find(m => m.id === message.id)
        ? state.messages
        : [...state.messages, message]
    }))
  },

  setMessages: (messages) => set({ messages }),

  setTeam: (team) => set({ team }),

  fetchTeam: async () => {
    const token = localStorage.getItem("token")
    if (!token) return
    try {
      const res = await fetch("/api/teams/my", { headers: { "Authorization": `Bearer ${token}` } })
      if (res.ok) { const team = await res.json(); set({ team }) }
    } catch (err) { console.error("fetchTeam error:", err) }
  },
}))
