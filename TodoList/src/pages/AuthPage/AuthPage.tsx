import { useAuth } from '@/shared/hooks/useAuth'
import './AuthPage.css'

export function AuthPage() {
  const {
    activeTab, email, password, confirmPassword, name, loading, errorMessage,
    setEmail, setPassword, setConfirmPassword, setName, handleTabClick, handleLogin, handleRegister
  } = useAuth()

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">TodoList</h1>
        
        {/* Вкладки (Вход / Регистрация) */}
        <div className="tabs">
          <button
            type="button"
            className={`tab-btn ${activeTab === 'login' ? 'tab-btn--active' : ''}`}
            onClick={() => handleTabClick('login')}
            disabled={loading} // Отключаем кнопку при загрузке
          >
            Вход
          </button>
          <button
            type="button"
            className={`tab-btn ${activeTab === 'register' ? 'tab-btn--active' : ''}`}
            onClick={() => handleTabClick('register')}
            disabled={loading}
          >
            Регистрация
          </button>
        </div>

        {errorMessage && (
          <div className="auth-error-block" style={{ color: '#ff4d4f', marginBottom: '15px', textAlign: 'center', fontSize: '14px' }}>
            ⚠️ {errorMessage}
          </div>
        )}

        <div className="forms-wrapper">
          {/* Форма Входа */}
          {activeTab === 'login' && (
            <div className="form-container">
              <form className="auth-form" onSubmit={handleLogin}>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">Email</label>
                  <input 
                    id="login-email"
                    type="email" 
                    className="form-input" 
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Пароль</label>
                  <input 
                    id="login-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                  {loading ? 'Вход...' : 'Войти'}
                </button>
              </form>
            </div>
          )}

          {/* Форма Регистрации */}
          {activeTab === 'register' && (
            <div className="form-container">
              <form className="auth-form" onSubmit={handleRegister}>
                <div className="form-group">
                  <label htmlFor="register-name" className="form-label">Имя</label>
                  <input 
                    id="register-name"
                    type="text" 
                    className="form-input" 
                    placeholder="Иван"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">Email</label>
                  <input 
                    id="register-email"
                    type="email" 
                    className="form-input" 
                    placeholder="example@mail.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">Пароль</label>
                  <input 
                    id="register-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="form-label">Подтвердите пароль</label>
                  <input 
                    id="register-confirm-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    disabled={loading}
                  />
                </div>

                <button type="submit" className="btn btn--primary btn--full" disabled={loading}>
                  {loading ? 'Регистрация...' : 'Зарегистрироваться'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}