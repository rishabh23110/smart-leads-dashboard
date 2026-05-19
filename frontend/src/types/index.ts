export type UserRole = 'admin' | 'sales';
export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Lost';
export type LeadSource = 'Website' | 'Instagram' | 'Referral';
export type SortOrder = 'latest' | 'oldest';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
}

export interface Lead {
  _id: string;
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
  createdBy: { _id: string; name: string; email: string } | string;
  assignedTo?: { _id: string; name: string; email: string } | string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: PaginationMeta;
  errors?: { field: string; message: string }[];
}

export interface LeadFilters {
  search: string;
  status: LeadStatus | '';
  source: LeadSource | '';
  sort: SortOrder;
  page: number;
}

export interface LeadStats {
  total: number;
  byStatus: { _id: LeadStatus; count: number }[];
  bySource: { _id: LeadSource; count: number }[];
}

export interface CreateLeadInput {
  name: string;
  email: string;
  status: LeadStatus;
  source: LeadSource;
}

export interface UpdateLeadInput extends Partial<CreateLeadInput> {}
