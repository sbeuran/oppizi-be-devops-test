export interface CreateCategoryDTO {
  name: string;
}

export interface UpdateCategoryDTO {
  name?: string;
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