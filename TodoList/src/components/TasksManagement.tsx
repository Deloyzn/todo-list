import React, { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import type { Task } from '@/shared/types/task';
import TaskItem from './TaskItem';

interface TasksManagementProps {
  activeTab: 'active' | 'completed';
}

export const TasksManagement: React.FC<TasksManagementProps> = ({ activeTab }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 1. Загрузка задач с твоего сервера
  const fetchTasks = async () => {
    try {
      setLoading(false);
      setError(null);

      // 1. Проверяем, есть ли активная сессия в Supabase Auth
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError || !session) {
        setError('Вы не авторизованы в системе Supabase.');
        setLoading(false);
        return;
      }

      // 2. Загружаем задачи напрямую из таблицы Supabase 'items'
      const { data, error: fetchError } = await supabase
        .from('items') // Убедись, что таблица называется 'items'
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;

      setTasks(data || []);
    } catch (err: any) {
      console.error('Error loading tasks:', err.message)
      setError(err.message || 'Не удалось загрузить задачи.')
    } finally {
      setLoading(false);
    }
  }


  useEffect(() => {
    fetchTasks();
    // Примечание: так как данные теперь идут через твой экспресс/fastify-сервер, 
    // старая вебсокет-подписка Supabase Realtime тут не используется.
    // Для обновления данных мы просто вызываем функции мутаций.
  }, []);

  const handleEditTask = (task: Task) => {
    alert(`Редактирование задачи: ${task.title}`);
  };

  // 2. Изменение статуса через твой сервер (PATCH /tasks/:id)
  const handleToggleComplete = async (task: Task) => {
    try {
      const res = await fetch(`${API_URL}/tasks/${task.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ is_done: !task.is_done }) // Инвертируем статус
      });

      if (res.ok) {
        // Локально обновляем состояние, чтобы интерфейс изменился мгновенно
        setTasks(prev => prev.map(t => t.id === task.id ? { ...t, is_done: !t.is_done } : t));
      }
    } catch (err) {
      console.error('Ошибка обновления:', err);
    }
  };

  // 3. Удаление задачи через твой сервер (DELETE /tasks/:id)
  const handleDeleteTask = async (taskId: string) => {
    if (!window.confirm('Вы уверены, что хотите удалить эту задачу?')) return;

    try {
      const res = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        // Удаляем из локального стейта
        setTasks(prev => prev.filter(t => t.id !== taskId));
      }
    } catch (err) {
      console.error('Ошибка удаления:', err);
    }
  };

  // Разделение по твоей колонке из БД (is_done)
  const activeTasks = tasks.filter((task) => !task.is_done);
  const completedTasks = tasks.filter((task) => task.is_done);

  if (loading) return <div className="loading-state">Загрузка задач...</div>;
  if (error) return <div className="error-state">Ошибка: {error}</div>;

  return (
    <div className="main-content">
      {activeTab === 'active' && (
        <div className="tasks-wrapper">
          <div className="tasks-header">
            <h2 className="tasks-title">Активные задачи</h2>
            <button className='btn btn--primary btn--add' onClick={() => alert('Функция добавления новой задачи')}>➕ Новая задача</button>
          </div>
          <div className="tasks-list">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask} // Пока не используется для активных, но на всякий случай
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">Нет активных задач</h3>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === 'completed' && (
        <div className="tasks-wrapper">
          <div className="tasks-header">
            <h2 className="tasks-title">Выполненные задачи</h2>
            <button className="btn btn--secondary" onClick={() => alert('Функция очистки истории')}>
              📊 Очистить историю
            </button>
          </div>
          <div className="tasks-list">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask} // Неактивно для выполненных, но компонент принимает
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleDeleteTask}
                />
              ))
            ) : (
              <div className="empty-state">
                <div className="empty-icon">✓</div>
                <h3 className="empty-title">Нет выполненных задач</h3>
                <p className="empty-description">Начните с активных задач!</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
