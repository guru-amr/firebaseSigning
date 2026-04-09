const API = 'https://firebasesigning-production.up.railway.app/api';

const msg = (text) => document.getElementById('message').textContent = text;

if (localStorage.getItem('token')) location.href = 'todo.html';

document.getElementById('btn-signin').onclick = async () => {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  if (data.token) { localStorage.setItem('token', data.token); location.href = 'todo.html'; }
  else msg(data.error || 'Login failed');
};

document.getElementById('btn-signup').onclick = async () => {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: document.getElementById('email').value,
      password: document.getElementById('password').value
    })
  });
  const data = await res.json();
  if (data.token) { localStorage.setItem('token', data.token); location.href = 'todo.html'; }
  else msg(data.error || 'Registration failed');
};
