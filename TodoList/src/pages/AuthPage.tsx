import { useState } from 'react'
import { Link } from 'react-router-dom'
import './AuthPage.css'

export function AuthPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  const [formHeight, setFormHeight] = useState<number>(0)

  const handleTabClick = (tab: 'login' | 'register') => {
    setActiveTab(tab)
  }

  const handleFormRef = (ref: HTMLDivElement | null) => {
    if (ref) {
      setFormHeight(ref.scrollHeight)
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">TodoList</h1>
        
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'login' ? 'tab-btn--active' : ''}`}
            onClick={() => handleTabClick('login')}
          >
            Вход
          </button>
          <button 
            className={`tab-btn ${activeTab === 'register' ? 'tab-btn--active' : ''}`}
            onClick={() => handleTabClick('register')}
          >
            Регистрация
          </button>
        </div>

        <div className="forms-wrapper" style={{ height: `${formHeight}px` }}>
          {/* Login Form */}
          {activeTab === 'login' && (
            <div ref={handleFormRef} className="form-container">
              <form className="auth-form" style={{ animation: 'slideInFromLeft 0.4s ease' }}>
                <div className="form-group">
                  <label htmlFor="login-email" className="form-label">Email</label>
                  <input 
                    id="login-email"
                    type="email" 
                    className="form-input" 
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="login-password" className="form-label">Пароль</label>
                  <input 
                    id="login-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Link to="/tasks" className="btn btn--primary btn--full" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                  Войти
                </Link>
              </form>
            </div>
          )}

          {/* Register Form */}
          {activeTab === 'register' && (
            <div ref={handleFormRef} className="form-container">
              <form className="auth-form" style={{ animation: 'slideInFromRight 0.4s ease' }}>
                <div className="form-group">
                  <label htmlFor="register-name" className="form-label">Имя</label>
                  <input 
                    id="register-name"
                    type="text" 
                    className="form-input" 
                    placeholder="Иван"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-email" className="form-label">Email</label>
                  <input 
                    id="register-email"
                    type="email" 
                    className="form-input" 
                    placeholder="example@mail.com"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-password" className="form-label">Пароль</label>
                  <input 
                    id="register-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="register-confirm-password" className="form-label">Подтвердите пароль</label>
                  <input 
                    id="register-confirm-password"
                    type="password" 
                    className="form-input" 
                    placeholder="••••••••"
                    required
                  />
                </div>

                <Link to="/tasks" className="btn btn--primary btn--full" style={{ display: 'inline-block', textAlign: 'center', textDecoration: 'none' }}>
                  Зарегистрироваться
                </Link>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
