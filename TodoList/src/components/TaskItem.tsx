import React from 'react';
import type { Task } from '@/shared/types/task'; // Убедитесь, что путь правильный

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
  onToggleComplete: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit, onToggleComplete, onDelete }) => {
  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  return (
  <div className={`task-item ${task.is_done ? 'task-item--completed' : ''}`}>
    {/* Чекбокс */}
    <div className="task-checkbox">
      <input
        type="checkbox"
        id={`task-${task.id}`}
        className="task-input"
        checked={task.is_done}
        onChange={() => onToggleComplete(task)}
      />
      <label htmlFor={`task-${task.id}`} className="task-check-label"></label>
    </div>
    
    {/* Содержимое задачи */}
    <div className="task-content">
      <h3 className="task-title">{task.title}</h3>
      {task.description && <p className="task-description">{task.description}</p>}
      
      {/* НОВЫЙ БЛОК ВЫВОДА ОБЕИХ ДАТ БЕЗ ТЕРНАРНИКА */}
      <div className="task-dates-block" style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '8px', fontSize: '12px', color: '#8c8c8c' }}>
        {/* Дата создания отображается ВСЕГДА */}
        <div className="task-date-created">
          📅 Создана: {formattedDate(task.created_at)}
        </div>
        
        {/* Дата выполнения рендерится только если задача выполнена И в базе есть completed_at */}
        {task.is_done && task.complete_at && task.complete_at !== "" && (
        <div className="task-date-completed" style={{ color: '#52c41a', fontWeight: 500 }}>
          ✓ Выполнена: {formattedDate(task.complete_at)}
        </div>
      )}
      </div>
    </div>

    {/* Кнопки действий */}
    <div className="task-actions" style={{ display: 'flex', gap: '8px' }}>
      <button 
        type="button" 
        className="task-action-btn task-action-btn--edit" 
        onClick={() => onEdit(task)}
        title="Редактировать"
        style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.1rem' }}
      >
        ✏️
      </button>
      <button 
        type="button" 
        className="task-action-btn task-action-btn--delete" 
        onClick={() => onDelete(task.id)}
        title="Удалить"
        style={{ cursor: 'pointer', background: 'none', border: 'none', fontSize: '1.1rem' }}
      >
        ❌
      </button>
    </div>
  </div>
);
};

export default TaskItem;