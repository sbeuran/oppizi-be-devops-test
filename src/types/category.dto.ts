export interface CreateCategoryDTO {
  name: string;
  description?: string;
}

export interface UpdateCategoryDTO extends Partial<CreateCategoryDTO> {
  id: string;
}

export interface CategoryResponseDTO extends Required<CreateCategoryDTO> {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryFilterDTO {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: keyof CreateCategoryDTO;
  sortOrder?: 'ASC' | 'DESC';
} 