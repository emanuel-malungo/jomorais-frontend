export interface ISalaInput {
  designacao: string
}

export interface ISala {
  codigo: number
  designacao: string
}

export interface IPagination {
  currentPage: number
  totalPages: number
  totalItems: number
  itemsPerPage: number
  hasNextPage?: boolean
  hasPreviousPage?: boolean
}

export interface ISalaListResponse {
  data: ISala[]
  pagination: IPagination
}
