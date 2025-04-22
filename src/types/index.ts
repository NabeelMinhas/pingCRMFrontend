export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  organization?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface Company {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  region?: string;
  country?: string;
  postalCode?: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  pages: number;
}

export interface ApiError {
  status: number;
  message: string;
  detail?: string;
} 