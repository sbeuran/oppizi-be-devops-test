import { TaskPriority, TaskStatus } from '../entities/Task';

export interface CreateTaskDTO {
  title: string;
  description?: string;
  dueDate?: Date;
  priority?: TaskPriority;
  status?: TaskStatus;
  categoryId?: string;
}

export interface UpdateTaskDTO extends Partial<Omit<CreateTaskDTO, 'categoryId'>> {
  id: string;
  categoryId?: string | null;
}

export interface TaskResponseDTO extends Required<CreateTaskDTO> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilterDTO {
  status?: TaskStatus;
  priority?: TaskPriority;
  search?: string;
  categoryId?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof CreateTaskDTO;
  sortOrder?: 'ASC' | 'DESC';
} 