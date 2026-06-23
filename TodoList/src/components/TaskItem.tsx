import React from 'react';
import type { Task } from '@/shared/types/task'; // Убедитесь, что путь правильный

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onToggleComplete, onDelete }) => {
  const formattedDate = new Date(task.created_at).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className={`task-item ${task.is_completed ? 'task-item--completed' : ''}`}>
      <div className="task-checkbox">
        <input
          type="checkbox"
          id={`task-${task.id}`}
          className="task-input"
          checked={task.is_completed}
          onChange={() => onToggleComplete(task)}
          disabled={task.is_completed} // Можно сделать редактируемым, если нужно
        />
        <label htmlFor={`task-${task.id}`} className="task-check-label"></label>
      </div>
      <div className="task-content">
        <h3 className="task-title">{task.title}</h3>
        {task.description && <p className="task-description">{task.description}</p>}
        <span className="task-date">
          {task.is_completed ? `Выполнена: ${formattedDate}` : `Создана: ${formattedDate}`}
        </span>
      </div>
      <div className="task-actions">
        {!task.is_completed ? (
          <>
            <button className="btn-icon btn-icon--edit" title="Редактировать" onClick={() => onEdit(task)}>
              ✎
            </button>
            <button className="btn-icon btn-icon--complete" title="Отметить выполненной" onClick={() => onToggleComplete(task)}>
              ✓
            </button>
          </>
        ) : (
          <button className="btn-icon btn-icon--delete" title="Удалить" onClick={() => onDelete(task.id)}>
            🗑
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskItem;