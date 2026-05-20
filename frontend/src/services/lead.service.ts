import api from './api';
import type { ApiResponse, Lead, LeadFilters, LeadStats, CreateLeadInput, UpdateLeadInput } from '@/types';

export const leadService = {
  getLeads: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.page) params.set('page', String(filters.page));
    if (filters.limit) params.set('limit', String(filters.limit));
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    if (filters.sort) params.set('sort', filters.sort);
    return api.get<ApiResponse<Lead[]>>(`/leads?${params.toString()}`);
  },

  getLead: (id: string) =>
    api.get<ApiResponse<Lead>>(`/leads/${id}`),

  createLead: (data: CreateLeadInput) =>
    api.post<ApiResponse<Lead>>('/leads', data),

  updateLead: (id: string, data: UpdateLeadInput) =>
    api.put<ApiResponse<Lead>>(`/leads/${id}`, data),

  deleteLead: (id: string) =>
    api.delete<ApiResponse>(`/leads/${id}`),

  getStats: () =>
    api.get<ApiResponse<LeadStats>>('/leads/stats'),

  exportCSV: (filters: Partial<LeadFilters>) => {
    const params = new URLSearchParams();
    if (filters.search) params.set('search', filters.search);
    if (filters.status) params.set('status', filters.status);
    if (filters.source) params.set('source', filters.source);
    const token = localStorage.getItem('token');
    const baseURL = (import.meta.env.VITE_API_URL as string | undefined) ?? '/api';
    const url = `${baseURL}/leads/export?${params.toString()}`;
    fetch(url, { headers: { Authorization: `Bearer ${token ?? ''}` } })
      .then((r) => r.blob())
      .then((blob) => {
        const blobUrl = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = blobUrl;
        link.setAttribute('download', 'leads.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(blobUrl);
      });
  },
};
