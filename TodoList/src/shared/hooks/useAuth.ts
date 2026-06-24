import { useState, type FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/shared/lib/supabase' // Проверь, чтобы этот путь был правильным в твоем проекте

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,6}$/;
  return emailRegex.test(email);
};

export function useAuth() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login')
  
  // Состояния для полей формы
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [name, setName] = useState('')
  
  // Состояния для UI
  const [loading, setLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const handleTabClick = (tab: 'login' | 'register') => {
    setActiveTab(tab)
    setErrorMessage(null)
    setEmail('')
    setPassword('')
    setConfirmPassword('')
    setName('')
  }

  // 1. Вход напрямую через Supabase Auth
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validateEmail(email.trim())) {
      setErrorMessage('Пожалуйста, введите корректный email адрес (например, name@mail.ru)');
      return; // Прерываем регистрацию
    }
    if (!email.trim() || !password.trim()) {
      setErrorMessage('Пожалуйста, заполните все поля.')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      })

      if (error) throw error

      if (data.session) {
        // Успешный вход — перенаправляем на страницу с задачами
        navigate('/tasks')
      }
    } catch (err: any) {
      console.error('Login error:', err.message)
        setErrorMessage(err.message || 'Неверный email или пароль.')
    } finally {
      setLoading(false)
    }
  }

  // 2. Регистрация напрямую через Supabase Auth
  const handleRegister = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMessage(null)

    if (!validateEmail(email.trim())) {
      setErrorMessage('Пожалуйста, введите корректный email адрес (например, name@mail.ru)');
      return; // Прерываем регистрацию
    }
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      setErrorMessage('Пожалуйста, заполните все обязательные поля.')
      return
    }
    if (password.length < 6) {
      setErrorMessage('Пароль должен быть не менее 6 символов.')
      return
    }
    if (password !== confirmPassword) {
      setErrorMessage('Пароли не совпадают!')
      return
    }

    try {
      setLoading(true)
      const { data, error } = await supabase.auth.signUp({
        email: email.trim(),
        password: password
      })

      if (error) throw error

      // Если в Supabase отключено подтверждение по почте, сессия создается сразу
      if (data.session) {
        navigate('/tasks')
      } else {
        alert('Регистрация успешна! Проверьте вашу почту для подтверждения аккаунта.')
        handleTabClick('login')
      }
    } catch (err: any) {
      console.error('Registration error:', err.message)
      if (err.message === 'User already registered') {
        setErrorMessage('Пользователь с таким email уже существует.')
      } else {
        setErrorMessage(err.message || 'Произошла ошибка при регистрации.')
      }
    } finally {
      setLoading(false)
    }
  }

  return {
    activeTab, email, password, confirmPassword, name, loading, errorMessage,
    setEmail, setPassword, setConfirmPassword, setName, handleTabClick, handleLogin, handleRegister
  }
}