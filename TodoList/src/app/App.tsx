import { Routes, Route, Navigate } from 'react-router-dom'
import { AuthPage, TasksPage } from '../pages'
import { Layout } from '@/widgets/layout'

function App() {
  return (
    <Routes>

      {/* Авторизация */}
      <Route path="/auth" element={<AuthPage />} />

      <Route path="/" element={<Layout />}>

        {/* Задачи (главная страница) */}
        <Route path="/tasks" element={<TasksPage />} />

        {/* Перенаправление на страницу задач по умолчанию */}
        <Route path="/" element={<Navigate to="/tasks" replace />} />

        {/* Все остальные маршруты перенаправляем на страницу задач */}
        <Route path="*" element={<Navigate to="/tasks" replace />} />
      </Route>
    </Routes>
  )
}

export default App