export interface ICourseInput {
  designacao: string
  observacoes?: string
}

export interface ICourse {
  codigo: number
  designacao: string
  codigo_Status: number
  observacoes?: string
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface ICourseListResponse {
  data: ICourse[]
  pagination: IPagination
}
