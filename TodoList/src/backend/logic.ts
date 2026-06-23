import { supabase, updateTask } from '@/shared/lib/supabase';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const handleToggleTodo = async (id: number, currentStatus: boolean) => {
  // Меняем статус на противоположный
  const updatedTask = await updateTask(id, { is_done: !currentStatus });

  // Здесь обновляете состояние (state) в React, чтобы интерфейс перерисовался
};

export const handleSaveEdit = async (id: number, newTitle: string, newDescription: string) => {
  const updatedTask = await updateTask(id, {
    title: newTitle,
    description: newDescription
  });

  // Обновляете state в React
};

