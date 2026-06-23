import { createClient } from '@supabase/supabase-js';

// Получаем переменные окружения через import.meta.env
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

// Проверяем, что переменные существуют
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("Supabase URL or Anon Key is missing in environment variables. Make sure your .env file is configured correctly with VITE_ prefix.");
  // Можно выбросить ошибку или просто работать без Supabase, если это приемлемо
}

// Создаем и экспортируем клиент Supabase
export const supabase = createClient(supabaseUrl!, supabaseAnonKey!);

// Регистрация
export const handlerRegister = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({ email, password });
  if (error) console.error("Ошибка:", error.message);
  return data;
}

// Логин
export const handlerLogin = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) console.error("Ошибка:", error.message);
  return data;
}


// Создать задачу
export const createTask = async (title: string, description: string) => {
  const { data: _data, error: _error } = await supabase
    .from('tasks')
    .insert([{ title, description }])
    .select();
}

//Универсальная функция для обновления задачи
export const updateTask = async (id: number, updates: Partial<{ title: string; description: string; is_done: boolean }>) => {
  const { data, error } = await supabase
    .from('tasks')
    .update(updates)
    .eq('id', id)
    .select();

  if (error) {
    console.error('Ошибка обновления задачи:', error.message);
    throw error; // Пробрасываем ошибку дальше, чтобы её можно было обработать в компоненте
  }

  return { data, error };
}