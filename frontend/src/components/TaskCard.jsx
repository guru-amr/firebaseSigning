const statusLabel = s => s === 'todo' ? 'Start' : s === 'inprogress' ? 'Complete' : 'Completed'

export default function TaskCard({ task, onUpdate, onDelete }) {
  const nextStatus = task.status === 'todo' ? 'inprogress' : 'completed'

  const edit = () => {
    const newTitle = prompt('Update task title', task.title)
    const newAssignee = prompt('Update assignee', task.assignee)
    if (!newTitle || !newAssignee) return
    onUpdate(task.id, { title: newTitle, assignee: newAssignee })
  }

  return (
    <div className="task-card">
      <div>
        <h3>{task.title}</h3>
        <div className="task-meta">
          {[['Assignee', task.assignee], ['Priority', task.priority], ['Status', task.status]].map(([label, value]) => (
            <div key={label}><span>{label}</span><div>{value}</div></div>
          ))}
        </div>
      </div>
      <div className="task-actions">
        <button className="action-button complete-button" disabled={task.status === 'completed'} onClick={() => onUpdate(task.id, { status: nextStatus })}>
          {statusLabel(task.status)}
        </button>
        <button className="action-button edit-button" onClick={edit}>Edit</button>
        <button className="action-button delete-button" onClick={() => onDelete(task.id)}>Delete</button>
      </div>
    </div>
  )
}
