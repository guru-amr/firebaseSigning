import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import {
  getDatabase,
  ref,
  push,
  remove,
  update,
  onValue
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyBBy9unBtcIzjDhXreeRP1HAuC22Punf5Y",
  authDomain: "fir-sign-5cfec.firebaseapp.com",
  projectId: "fir-sign-5cfec",
  storageBucket: "fir-sign-5cfec.firebasestorage.app",
  messagingSenderId: "724928683935",
  appId: "1:724928683935:web:84835c79320c96cccea7aa",
  databaseURL: "https://fir-sign-5cfec-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

const statusLabel = status => {
  if (status === 'todo') return 'Start';
  if (status === 'inprogress') return 'Complete';
  return 'Completed';
};

const formatStatus = status => {
  if (status === 'todo') return 'todo';
  if (status === 'inprogress') return 'inprogress';
  return 'completed';
};

const renderTaskCard = (task, key, userId) => {
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
    update(ref(db, `tasks/${userId}/${key}`), { status: nextStatus });
  };

  const editBtn = document.createElement('button');
  editBtn.className = 'action-button edit-button';
  editBtn.textContent = 'Edit';
  editBtn.onclick = () => {
    const newTitle = prompt('Update task title', task.title);
    const newAssignee = prompt('Update assignee', task.assignee);
    if (!newTitle || !newAssignee) return;
    update(ref(db, `tasks/${userId}/${key}`), {
      title: newTitle,
      assignee: newAssignee
    });
  };

  const deleteBtn = document.createElement('button');
  deleteBtn.className = 'action-button delete-button';
  deleteBtn.textContent = 'Delete';
  deleteBtn.onclick = () => remove(ref(db, `tasks/${userId}/${key}`));

  actions.append(statusBtn, editBtn, deleteBtn);
  container.append(content, actions);

  return container;
};

onAuthStateChanged(auth, user => {
  if (!user) {
    location.href = 'index.html';
    return;
  }

  const tasksRef = ref(db, `tasks/${user.uid}`);
  const taskList = document.getElementById('task-list');
  const titleInput = document.getElementById('task-title');
  const assigneeInput = document.getElementById('task-assignee');
  const priorityInput = document.getElementById('task-priority');
  const statusFilter = document.getElementById('status-filter');
  const searchInput = document.getElementById('search-input');
  let currentSnapshot = null;

  const renderTasks = () => {
    if (!currentSnapshot) return;
    const filterValue = statusFilter.value;
    const searchValue = searchInput.value.toLowerCase();
    const tasks = [];

    currentSnapshot.forEach(child => {
      const data = child.val();
      tasks.push({ key: child.key, ...data });
    });

    taskList.innerHTML = '';

    const filtered = tasks.filter(task => {
      const status = formatStatus(task.status || 'todo');
      const title = (task.title || task.text || 'Untitled task').toLowerCase();
      const assignee = (task.assignee || 'Unknown').toLowerCase();
      const matchesFilter = filterValue === 'All' || status === filterValue;
      const matchesSearch = title.includes(searchValue) || assignee.includes(searchValue);
      return matchesFilter && matchesSearch;
    });

    if (!filtered.length) {
      const empty = document.createElement('div');
      empty.className = 'empty-state';
      empty.textContent = 'No tasks match the current filter.';
      taskList.appendChild(empty);
      return;
    }

    filtered.forEach(task => {
      const normalized = {
        title: task.title || task.text || 'Untitled task',
        assignee: task.assignee || 'Unknown',
        priority: task.priority || 'Medium',
        status: formatStatus(task.status || 'todo')
      };
      const card = renderTaskCard(normalized, task.key, user.uid);
      taskList.appendChild(card);
    });
  };

  onValue(tasksRef, snapshot => {
    currentSnapshot = snapshot;
    renderTasks();
  });

  const addTask = () => {
    const title = titleInput.value.trim();
    const assignee = assigneeInput.value.trim();
    const priority = priorityInput.value;
    if (!title || !assignee) return;
    push(tasksRef, {
      title,
      assignee,
      priority,
      status: 'todo'
    });
    titleInput.value = '';
    assigneeInput.value = '';
    priorityInput.value = 'Medium';
  };

  document.getElementById('btn-add').onclick = addTask;
  titleInput.onkeydown = e => {
    if (e.key === 'Enter') addTask();
  };
  statusFilter.onchange = renderTasks;
  searchInput.oninput = renderTasks;

  document.getElementById('btn-signout').onclick = () => signOut(auth);
});

