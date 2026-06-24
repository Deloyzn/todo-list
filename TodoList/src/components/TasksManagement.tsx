import React, { useState, useEffect } from 'react';
import { supabase } from '@/shared/lib/supabase';
import type { Task } from '@/shared/types/task';
import TaskItem from './TaskItem';
import { Modal } from './Modal';

interface TasksManagementProps {
  activeTab: 'active' | 'completed';
}

export const TasksManagement: React.FC<TasksManagementProps> = ({ activeTab }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Новые состояния для формы создания задачи
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [newTaskTitle, setNewTaskTitle] = useState<string>('');
  const [newTaskDescription, setNewTaskDescription] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [editTaskTitle, setEditTaskTitle] = useState<string>('');
  const [editTaskDescription, setEditTaskDescription] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState<boolean>(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [deletingTaskId, setDeletingTaskId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);

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
  }, []);

  // Функция создания НОВОЙ задачи из модалки
  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      setIsSubmitting(true);

      // Получаем id текущего юзера, чтобы связать задачу с ним
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setError('Сессия истекла. Пожалуйста, войдите снова.');
        return;
      }

      const { data, error: insertError } = await supabase
        .from('items')
        .insert([
          {
            title: newTaskTitle.trim(),
            description: newTaskDescription.trim() || null, // Если описание пустое, сохраняем как null
            user_id: session?.user.id, // Привязываем к текущему пользователю
            is_done: false
          }
        ])
        .select(); // Возвращает созданную строку

      if (insertError) throw insertError;

      // Локально добавляем новую задачу в начало списка, чтобы UI обновился мгновенно
      if (data && data.length > 0) {
        setTasks((prev) => [data[0], ...prev]);
      }

      // Очищаем инпут
      setNewTaskTitle('');
      setNewTaskDescription('');
      setIsCreateModalOpen(false);
    } catch (err: any) {
      console.error('Error creating task:', err.message);
      alert(`Не удалось создать задачу: ${err.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Переключение статуса задачи (выполнено / активно)
  const handleToggleComplete = async (task: Task) => {
    try {
      const nextStatus = !task.is_done;
      const completedAtValue = nextStatus ? new Date().toISOString() : null;

      const { error: updateError } = await supabase
        .from('items')
        .update({
          is_done: nextStatus,
          complete_at: completedAtValue
        })
        .eq('id', task.id);

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((t) =>
          (t.id === task.id
            ? { ...t, is_done: nextStatus, complete_at: completedAtValue }
            : t
          )
        )
      );
    } catch (err: any) {
      console.error(err.message);
    }
  };

  // Открытие модалки редактирования и заполнение полей данными задачи
  const handleOpenEditModal = (task: Task) => {
    setEditingTask(task);
    setEditTaskTitle(task.title);
    setEditTaskDescription(task.description || '');
    setIsEditModalOpen(true);
  };

  // Сохранение отредактированной задачи
  const handleUpdateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTask || !editTaskTitle.trim()) return;

    try {
      setIsUpdating(true);
      const { error: updateError } = await supabase
        .from('items')
        .update({
          title: editTaskTitle.trim(),
          description: editTaskDescription.trim() || null
        })
        .eq('id', editingTask.id);

      if (updateError) throw updateError;

      setTasks((prev) =>
        prev.map((t) => t.id === editingTask.id ? { ...t, title: editTaskTitle.trim(), description: editTaskDescription.trim() || null } : t)
      );
      setIsEditModalOpen(false);
    } catch (err: any) {
      alert(`Ошибка обновления: ${err.message}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Открытие модалки удаления
  const handleOpenDeleteModal = (taskId: string) => {
    setDeletingTaskId(taskId);
    setIsDeleteModalOpen(true);
  };

  // Подтверждение удаления задачи
  const handleConfirmDeleteTask = async () => {
    if (!deletingTaskId) return;

    try {
      setIsDeleting(true);
      const { error: deleteError } = await supabase
        .from('items')
        .delete()
        .eq('id', deletingTaskId);

      if (deleteError) throw deleteError;

      setTasks((prev) => prev.filter((t) => t.id !== deletingTaskId));
      setIsDeleteModalOpen(false);
    } catch (err: any) {
      alert(`Ошибка удаления: ${err.message}`);
    } finally {
      setIsDeleting(false);
      setDeletingTaskId(null);
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
            <button className='btn btn--primary btn--add' onClick={() => setIsCreateModalOpen(true)}>➕ Новая задача</button>
          </div>

          <div className="tasks-list">
            {activeTasks.length > 0 ? (
              activeTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEditModal}
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleOpenDeleteModal} // Пока не используется для активных, но на всякий случай
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
          </div>
          <div className="tasks-list">
            {completedTasks.length > 0 ? (
              completedTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onEdit={handleOpenEditModal} // Неактивно для выполненных, но компонент принимает
                  onToggleComplete={handleToggleComplete}
                  onDelete={handleOpenDeleteModal}
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

      {/* МОДАЛЬНОЕ ОКНО СОЗДАНИЯ ЗАДАЧИ */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          setNewTaskTitle('');
        }}
        title='Новая задача'>
        <form className="modal-form" onSubmit={handleCreateTask}>
          <div className="form-group">
            <label className="form-label">Название задачи</label>
            <input
              type="text"
              className="form-input"
              placeholder="Название задачи..."
              value={newTaskTitle}
              onChange={(e) => setNewTaskTitle(e.target.value)}
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              Описание задачи
            </label>
            <textarea
              className="form-textarea"
              placeholder="Добавьте детали или заметки к задаче..."
              value={newTaskDescription}
              onChange={(e) => setNewTaskDescription(e.target.value)}
              disabled={isSubmitting}
              rows={4}
              style={{ 
                width: '100%', 
                boxSizing: 'border-box',
                resize: 'vertical', // Позволяет растягивать только по высоте
                minHeight: '80px'
              }}
            />
          </div>

          <div className="modal-actions">
            <button
              type="submit"
              className="btn btn--primary"
              disabled={isSubmitting || !newTaskTitle.trim()}
            >
              {isSubmitting ? 'Создание...' : 'Создать'}
            </button>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => {
                setIsCreateModalOpen(false);
                setNewTaskTitle('');
              }}
              disabled={isSubmitting}
              >
              Отмена
            </button>
          </div>
        </form>
      </Modal>
      {/* МОДАЛКА 2: РЕДАКТИРОВАНИЕ */}
      <Modal isOpen={isEditModalOpen} onClose={() => setIsEditModalOpen(false)} title="Редактировать задачу">
        <form onSubmit={handleUpdateTask} className="modal-form">
          <div className="form-group" style={{ marginBottom: '16px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Название</label>
            <input type="text" className="form-input" value={editTaskTitle} onChange={(e) => setEditTaskTitle(e.target.value)} disabled={isUpdating} autoFocus style={{ width: '100%', boxSizing: 'border-box' }} />
          </div>
          <div className="form-group" style={{ marginBottom: '24px' }}>
            <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Описание</label>
            <textarea className="form-textarea" value={editTaskDescription} onChange={(e) => setEditTaskDescription(e.target.value)} disabled={isUpdating} rows={4} style={{ width: '100%', boxSizing: 'border-box', resize: 'vertical', minHeight: '80px' }} />
          </div>
          <div className="modal-actions">
            <button type="button" className="btn btn--secondary" onClick={() => setIsEditModalOpen(false)}>Отмена</button>
            <button type="submit" className="btn btn--primary" disabled={isUpdating || !editTaskTitle.trim()}>{isUpdating ? 'Сохранение...' : 'Сохранить'}</button>
          </div>
        </form>
      </Modal>
      {/* МОДАЛКА 3: ПОДТВЕРЖДЕНИЕ УДАЛЕНИЯ */}
      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Удалить задачу?">
        <div className="modal-body-text" style={{ marginBottom: '24px', color: '#595959' }}>
          Вы уверены, что хотите безвозвратно удалить эту задачу? Это действие нельзя отменить.
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn--secondary" onClick={() => setIsDeleteModalOpen(false)} disabled={isDeleting}>Отмена</button>
          <button type="button" className="btn" style={{ backgroundColor: '#ff4d4f', color: '#fff' }} onClick={handleConfirmDeleteTask} disabled={isDeleting}>
            {isDeleting ? 'Удаление...' : 'Удалить'}
          </button>
        </div>
      </Modal>
    </div>
  );
}
