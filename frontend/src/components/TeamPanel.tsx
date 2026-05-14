import { useState, useEffect } from 'react'
import { useStore } from '../store'
import './TeamPanel.css'

function TeamPanel() {
  const { user, team, setTeam, fetchUser } = useStore()
  const [showCreateTeam, setShowCreateTeam] = useState(false)
  const [teamName, setTeamName] = useState('')
  const [joinCode, setJoinCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (user?.teamId) {
      fetchTeam()
    }
  }, [user])

  const fetchTeam = async () => {
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/teams/my', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      if (res.ok) {
        const data = await res.json()
        setTeam(data)
      }
    } catch (err) {
      console.error('Failed to fetch team:', err)
    }
  }

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!teamName.trim()) return
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/teams', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: teamName })
      })
      if (res.ok) {
        const newTeam = await res.json()
        setTeam(newTeam)
        setTeamName('')
        setShowCreateTeam(false)
      } else {
        const err = await res.json()
        setError(err.message)
      }
    } catch (err) {
      setError('Ошибка при создании команды')
    } finally {
      setLoading(false)
    }
  }

  const handleJoinTeam = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!joinCode.trim()) return
    setLoading(true)
    setError('')
    try {
      const token = localStorage.getItem('token')
      const res = await fetch('/api/teams/join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ code: joinCode })
      })
      if (res.ok) {
        const newTeam = await res.json()
        setTeam(newTeam)
        await fetchUser()
        setJoinCode('')
      } else {
        const err = await res.json()
        setError(err.message)
      }
    } catch (err) {
      setError('Ошибка при присоединении к команде')
    } finally {
      setLoading(false)
    }
  }

  const handleLeaveTeam = async () => {
    if (!confirm("Вы уверены что хотите выйти из команды?")) return
    try {
      const token = localStorage.getItem("token")
      const res = await fetch("/api/teams/leave", {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      })
      if (res.ok) setTeam(null)
      else console.error("Failed to leave team")
    } catch (err) {
      console.error("Leave team error:", err)
    }
  }

  const handleCopy = () => {
    if (team?.code) {
      navigator.clipboard.writeText(team.code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="team-panel">
      {team ? (
        <div className="team-info">
          <h2>{team.name}</h2>
          <button onClick={handleLeaveTeam} className="leave-btn">Выйти из команды</button>

          {team.code && (
            <div className="invite-code">
              <span className="label">Код приглашения:</span>
              <div className="code-box">
                <strong>{team.code}</strong>
                <button onClick={handleCopy} className="copy-btn">
                  {copied ? '✅ Скопировано' : '📋 Копировать'}
                </button>
              </div>
            </div>
          )}

          <div className="team-stats">
            <div className="stat">
              <span className="label">Членов команды</span>
              <span className="value">{team.members.length}</span>
            </div>
          </div>

          <div className="members-list">
            <h3>Члены команды:</h3>
            {team.members.map(member => (
              <div key={member.id} className="member-item">
                <span className="member-name">{member.name}</span>
                <span className="member-email">{member.email}</span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="no-team">
          <h2>У вас нет команды</h2>
          <p>Создайте новую команду или присоединитесь к существующей</p>

          {error && <div className="error">{error}</div>}

          {showCreateTeam ? (
            <form onSubmit={handleCreateTeam} className="team-form">
              <input
                type="text"
                placeholder="Название команды"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
              <button type="submit" disabled={loading}>
                {loading ? 'Создание...' : 'Создать команду'}
              </button>
              <button type="button" className="cancel-btn" onClick={() => setShowCreateTeam(false)}>
                Отмена
              </button>
            </form>
          ) : (
            <form onSubmit={handleJoinTeam} className="team-form">
              <input
                type="text"
                placeholder="Код присоединения"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
              />
              <button type="submit" disabled={loading && !joinCode.trim()}>
                {loading ? 'Присоединение...' : 'Присоединиться'}
              </button>
              <button type="button" onClick={() => setShowCreateTeam(true)}>
                Создать новую команду
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  )
}

export default TeamPanel
