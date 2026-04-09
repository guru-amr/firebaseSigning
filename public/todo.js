const API = 'https://firebasesigning-production.up.railway.app/api';
const token = localStorage.getItem('token');
if (!token) location.href = 'index.html';

const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

const statusLabel = s => s === 'todo' ? 'Start' : s === 'inprogress' ? 'Complete' : 'Completed';
const formatStatus = s => s === 'todo' ? 'todo' : s === 'inprogress' ? 'inprogress' : 'completed';

let allTasks = [];

const renderTasks = () => {
  const filterValue = document.getElementById('status-filter').value;
  const searchValue = document.getElementById('search-input').value.toLowerCase();
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = '';

  const filtered = allTasks.filter(task => {
    const matchesFilter = filterValue === 'All' || formatStatus(task.status) === filterValue;
    const matchesSearch = task.title.toLowerCase().includes(searchValue) || task.assignee.toLowerCase().includes(searchValue);
    return matchesFilter && matchesSearch;
  });

  if (!filtered.length) {
    const empty = document.createElement('div');
    empty.className = 'empty-state';
    empty.textContent = 'No tasks match the current filter.';
    taskList.appendChild(empty);
    return;
  }

  filtered.forEach(task => taskList.appendChild(renderTaskCard(task)));
};

const renderTaskCard = (task) => {
  const container = document.createElement('div');
  container.className = 'task-card';

  const content = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = task.title;
  content.appendChild(title);

  const meta = document.createElement('div');
  meta.className = 'task-meta';
  [['Assignee', task.assignee], ['Priority', task.priority], ['Status', task.status]].forEach(([label, value]) => {
    const block = document.createElement('div');
    const labelEl = document.createElement('span');
    labelEl.textContent = label;
    const text = document.createElement('div');
    text.textContent = value;
    block.append(labelEl, text);
    meta.appendChild(block);
  });
  content.appendChild(meta);

  const actions = document.createElement('div');
  actions.className = 'task-actions';

  const statusBtn = document.createElement('button');
  statusBtn.className = 'action-button complete-button';
  statusBtn.textContent = statusLabel(task.status);
  statusBtn.disabled = task.status === 'completed';
  statusBtn.onclick = () => {
    const nextStatus = task.status === 'todo' ? 'inprogress' : 'completed';
    fetch(`${API}/tasks/${task.id}`, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ status: nextStatus }) });
  };

  const editBtn = document.createElement('button');
  editBtn.className = 'action-button edit-button';
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const newTitle = prompt('Update task title', task.title);
    const newAssignee = prompt('Update assignee', task.assignee);
    if (!newTitle || !newAssignee) return;
    fetch(`${API}/tasks/${task.id}`, { method: 'PATCH', headers: authHeaders, body: JSON.stringify({ title: newTitle, assignee: newAssignee }) });
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-button delete-button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => fetch(`${API}/tasks/${task.id}`, { method: 'DELETE', headers: authHeaders });

  actions.append(statusBtn, editBtn, deleteBtn);
  container.append(content, actions);
  return container;
};

// WebSocket for real-time updates
const socket = new SockJS('https://firebasesigning-production.up.railway.app/ws');
const stompClient = Stomp.client(socket);
stompClient.connect({}, () => {
  stompClient.subscribe('/topic/tasks', (msg) => {
    allTasks = JSON.parse(msg.body);
    renderTasks();
  });
});

// Load initial tasks
fetch(`${API}/tasks`, { headers: authHeaders })
  .then(r => r.json())
  .then(tasks => { allTasks = tasks; renderTasks(); });

const addTask = () => {
  const title = document.getElementById('task-title').value.trim();
  const assignee = document.getElementById('task-assignee').value.trim();
  const priority = document.getElementById('task-priority').value;
  if (!title || !assignee) return;
  fetch(`${API}/tasks`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ title, assignee, priority }) });
  document.getElementById('task-title').value = '';
  document.getElementById('task-assignee').value = '';
  document.getElementById('task-priority').value = 'Medium';
};

document.getElementById('btn-add').onclick = addTask;
document.getElementById('task-title').onkeydown = e => { if (e.key === 'Enter') addTask(); };
document.getElementById('status-filter').onchange = renderTasks;
document.getElementById('search-input').oninput = renderTasks;
document.getElementById('btn-signout').onclick = () => { localStorage.removeItem('token'); location.href = 'index.html'; };
