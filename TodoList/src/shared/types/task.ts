export interface Task {
  id: string;
  title: string;
  description: string | null;
  is_done: boolean;
  user_id: string;
  created_at: string;
  complete_at: string | null;
}