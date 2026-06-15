import { useState } from 'react'
import './TasksPage.css'

export function TasksPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'completed'>('active')

  const handleTabClick = (tab: 'active' | 'completed') => {
    setActiveTab(tab)
  }

  return (
    <div className="tasks-page" style={{ animation: 'pageSlideInLeft 0.5s ease' }}>
      
      {/* Main Content */}
      <main className="tasks-container">
        <div className="tasks-content">
          {/* Tabs */}
          <div className="tasks-tabs">
            <button 
              className={`tab-btn ${activeTab === 'active' ? 'tab-btn--active' : ''}`}
              onClick={() => handleTabClick('active')}
            >
              <span className="tab-icon">📋</span> Активные
            </button>
            <button 
              className={`tab-btn ${activeTab === 'completed' ? 'tab-btn--active' : ''}`}
              onClick={() => handleTabClick('completed')}
            >
              <span className="tab-icon">✓</span> Выполненные
            </button>
          </div>

          {/* Active Tasks */}
          {activeTab === 'active' && (
            <div className="tasks-wrapper" style={{ animation: 'slideInFromLeft 0.3s ease' }}>
              {/* Tasks Header with Add Button */}
              <div className="tasks-header">
                <h2 className="tasks-title">Активные задачи</h2>
                <button className="btn btn--primary btn--add">
                  <span className="add-icon">+</span> Новая задача
                </button>
              </div>

              {/* Tasks List */}
              <div className="tasks-list">
                {/* Task Item */}
                <div className="task-item">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="task-1" 
                      className="task-input"
                    />
                    <label htmlFor="task-1" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Купить продукты</h3>
                    <p className="task-description">Молоко, хлеб, яйца</p>
                    <span className="task-date">Создана: 15 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--edit" title="Редактировать">
                      ✎
                    </button>
                    <button className="btn-icon btn-icon--complete" title="Отметить выполненной">
                      ✓
                    </button>
                  </div>
                </div>

                {/* Task Item */}
                <div className="task-item">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="task-2" 
                      className="task-input"
                    />
                    <label htmlFor="task-2" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Написать отчет</h3>
                    <p className="task-description">Финальный отчет за квартал</p>
                    <span className="task-date">Создана: 14 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--edit" title="Редактировать">
                      ✎
                    </button>
                    <button className="btn-icon btn-icon--complete" title="Отметить выполненной">
                      ✓
                    </button>
                  </div>
                </div>

                {/* Task Item */}
                <div className="task-item">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="task-3" 
                      className="task-input"
                    />
                    <label htmlFor="task-3" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Позвонить менеджеру</h3>
                    <p className="task-description">Уточнить детали проекта</p>
                    <span className="task-date">Создана: 13 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--edit" title="Редактировать">
                      ✎
                    </button>
                    <button className="btn-icon btn-icon--complete" title="Отметить выполненной">
                      ✓
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty State (show when no tasks) */}
              <div className="empty-state" style={{ display: 'none' }}>
                <div className="empty-icon">📝</div>
                <h3 className="empty-title">Нет активных задач</h3>
                <p className="empty-description">Отличная работа! Создайте новую задачу, чтобы продолжить.</p>
              </div>
            </div>
          )}

          {/* Completed Tasks */}
          {activeTab === 'completed' && (
            <div className="tasks-wrapper" style={{ animation: 'slideInFromRight 0.3s ease' }}>
              {/* Completed Header */}
              <div className="tasks-header">
                <h2 className="tasks-title">Выполненные задачи</h2>
                <button className="btn btn--secondary">
                  📊 Очистить историю
                </button>
              </div>

              {/* Completed Tasks List */}
              <div className="tasks-list">
                {/* Completed Task Item */}
                <div className="task-item task-item--completed">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="completed-1" 
                      className="task-input"
                      checked
                      disabled
                    />
                    <label htmlFor="completed-1" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Отправить письмо клиенту</h3>
                    <p className="task-description">Важное письмо с предложением</p>
                    <span className="task-date">Выполнена: 12 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--delete" title="Удалить">
                      🗑
                    </button>
                  </div>
                </div>

                {/* Completed Task Item */}
                <div className="task-item task-item--completed">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="completed-2" 
                      className="task-input"
                      checked
                      disabled
                    />
                    <label htmlFor="completed-2" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Завершить проект</h3>
                    <p className="task-description">Финальная сборка и тестирование</p>
                    <span className="task-date">Выполнена: 10 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--delete" title="Удалить">
                      🗑
                    </button>
                  </div>
                </div>

                {/* Completed Task Item */}
                <div className="task-item task-item--completed">
                  <div className="task-checkbox">
                    <input 
                      type="checkbox" 
                      id="completed-3" 
                      className="task-input"
                      checked
                      disabled
                    />
                    <label htmlFor="completed-3" className="task-check-label"></label>
                  </div>

                  <div className="task-content">
                    <h3 className="task-title">Провести встречу с командой</h3>
                    <p className="task-description">Планирование на следующий спринт</p>
                    <span className="task-date">Выполнена: 9 июня 2026</span>
                  </div>

                  <div className="task-actions">
                    <button className="btn-icon btn-icon--delete" title="Удалить">
                      🗑
                    </button>
                  </div>
                </div>
              </div>

              {/* Empty State for Completed */}
              <div className="empty-state" style={{ display: 'none' }}>
                <div className="empty-icon">✓</div>
                <h3 className="empty-title">Нет выполненных задач</h3>
                <p className="empty-description">Начните с активных задач!</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar with Navigation */}
        <aside className="sidebar">
          <nav className="nav">
            <div className="nav-section">
              <h4 className="nav-title">Статус</h4>
              <ul className="nav-list">
                <li className={`nav-item ${activeTab === 'active' ? 'nav-item--active' : ''}`}>
                  <button 
                    className="nav-link nav-link--button"
                    onClick={() => handleTabClick('active')}
                  >
                    <span className="nav-icon">📋</span>
                    Активные
                  </button>
                </li>
                <li className={`nav-item ${activeTab === 'completed' ? 'nav-item--active' : ''}`}>
                  <button 
                    className="nav-link nav-link--button"
                    onClick={() => handleTabClick('completed')}
                  >
                    <span className="nav-icon">✓</span>
                    Выполненные
                  </button>
                </li>
              </ul>
            </div>

            <div className="nav-section">
              <h4 className="nav-title">Фильтр</h4>
              <ul className="nav-list">
                <li className="nav-item">
                  <a href="#today" className="nav-link">
                    <span className="nav-icon">🕐</span>
                    На сегодня
                  </a>
                </li>
                <li className="nav-item">
                  <a href="#week" className="nav-link">
                    <span className="nav-icon">📅</span>
                    На неделю
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </aside>
      </main>
    </div>
  )
}
