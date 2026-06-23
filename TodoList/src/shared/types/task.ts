export interface Task {
  is_done: any;
  id: string;
  created_at: string; // Supabase возвращает дату как строку
  title: string;
  description: string | null;
  is_completed: boolean;
}