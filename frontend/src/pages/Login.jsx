import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const navigate = useNavigate()

  const auth = async (endpoint) => {
    try {
      const res = await fetch(`${API}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (data.token) { localStorage.setItem('token', data.token); navigate('/todo') }
      else setMessage(data.error || `${endpoint} failed`)
    } catch (e) {
      setMessage('Cannot connect to server')
    }
  }

  return (
    <div className="card">
      <h2>Sign In</h2>
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button id="btn-signin" onClick={() => auth('login')}>Sign In</button>
      <button id="btn-signup" onClick={() => auth('register')}>Sign Up</button>
      {message && <p id="message">{message}</p>}
    </div>
  )
}
