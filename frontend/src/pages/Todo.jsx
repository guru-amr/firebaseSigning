import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authFetch } from '../api'
import TaskCard from '../components/TaskCard'
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'

const WS_URL = import.meta.env.VITE_API_URL.replace('/api', '')

export default function Todo() {
  const [tasks, setTasks] = useState([])
  const [title, setTitle] = useState('')
  const [assignee, setAssignee] = useState('')
  const [priority, setPriority] = useState('Medium')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    authFetch('/tasks').then(r => r.json()).then(setTasks)

    const socket = new SockJS(`${WS_URL}/ws`)
    const client = Stomp.over(socket)
    client.debug = null
    client.connect({}, () => {
      client.subscribe('/topic/tasks', msg => setTasks(JSON.parse(msg.body)))
    })
    return () => { try { client.disconnect() } catch (_) {} }
  }, [])

  const addTask = () => {
    if (!title.trim() || !assignee.trim()) return
    authFetch('/tasks', { method: 'POST', body: JSON.stringify({ title, assignee, priority }) })
    setTitle(''); setAssignee(''); setPriority('Medium')
  }

  const updateTask = (id, patch) => authFetch(`/tasks/${id}`, { method: 'PATCH', body: JSON.stringify(patch) })
  const deleteTask = (id) => authFetch(`/tasks/${id}`, { method: 'DELETE' })
  const signOut = () => { localStorage.removeItem('token'); navigate('/') }

  const filtered = tasks.filter(t => {
    const matchFilter = filter === 'All' || t.status === filter
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
                        t.assignee.toLowerCase().includes(search.toLowerCase())
    return matchFilter && matchSearch
  })

  return (
    <main className="todo-shell">
      <header className="todo-banner">
        <div>
          <h1>Collaborative Task Manager</h1>
          <p>Realtime updates with Spring Boot WebSocket</p>
        </div>
        <button id="btn-signout" className="secondary-button" onClick={signOut}>Sign Out</button>
      </header>

      <section className="card section-card controls-card">
        <div className="section-title">controls</div>
        <div className="control-row">
          <input placeholder="Task title" value={title} onChange={e => setTitle(e.target.value)} onKeyDown={e => e.key === 'Enter' && addTask()} />
          <input placeholder="Assignee" value={assignee} onChange={e => setAssignee(e.target.value)} />
          <select value={priority} onChange={e => setPriority(e.target.value)}>
            <option value="High">High priority</option>
            <option value="Medium">Medium priority</option>
            <option value="Low">Low priority</option>
          </select>
          <button className="primary-button" onClick={addTask}>Add Task</button>
        </div>
      </section>

      <section className="card section-card filters-card">
        <div className="section-title">filters</div>
        <div className="filter-row">
          <label>Filter:
            <select value={filter} onChange={e => setFilter(e.target.value)}>
              <option value="All">All</option>
              <option value="todo">Todo</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </label>
          <label>Search:
            <input placeholder="Search" value={search} onChange={e => setSearch(e.target.value)} />
          </label>
        </div>
      </section>

      <section className="card section-card tasks-card">
        <div className="section-title">tasksList</div>
        <div className="task-list">
          {filtered.length === 0
            ? <div className="empty-state">No tasks match the current filter.</div>
            : filtered.map(task => <TaskCard key={task.id} task={task} onUpdate={updateTask} onDelete={deleteTask} />)
          }
        </div>
      </section>
    </main>
  )
}
