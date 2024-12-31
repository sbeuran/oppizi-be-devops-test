import { Category } from '../entities/Category';

export type TaskStatus = 'todo' | 'in_progress' | 'done';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  categoryId?: string;
}

export interface UpdateTaskDTO {
  title?: string;
  description?: string;
  dueDate?: Date;
  status?: TaskStatus;
  categoryId?: string | null;
}

export interface TaskResponseDTO {
  id: string;
  title: string;
  description: string | null;
  dueDate: Date | null;
  status: TaskStatus;
  category: Category | null;
  createdAt: Date;
  updatedAt: Date;
} 