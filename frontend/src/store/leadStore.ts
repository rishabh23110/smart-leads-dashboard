import { create } from 'zustand';
import type { Lead, LeadFilters, PaginationMeta, LeadStats, CreateLeadInput, UpdateLeadInput, ApiResponse } from '@/types';
import { leadService } from '@/services/lead.service';
import { AxiosError } from 'axios';

const defaultFilters: LeadFilters = {
  search: '',
  status: '',
  source: '',
  sort: 'latest',
  page: 1,
};

interface LeadState {
  leads: Lead[];
  selectedLead: Lead | null;
  stats: LeadStats | null;
  filters: LeadFilters;
  meta: PaginationMeta | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  fetchLeads: () => Promise<void>;
  fetchStats: () => Promise<void>;
  createLead: (data: CreateLeadInput) => Promise<void>;
  updateLead: (id: string, data: UpdateLeadInput) => Promise<void>;
  deleteLead: (id: string) => Promise<void>;
  setFilters: (filters: Partial<LeadFilters>) => void;
  resetFilters: () => void;
  setSelectedLead: (lead: Lead | null) => void;
  exportCSV: () => void;
  clearError: () => void;
}

export const useLeadStore = create<LeadState>()((set, get) => ({
  leads: [],
  selectedLead: null,
  stats: null,
  filters: defaultFilters,
  meta: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchLeads: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await leadService.getLeads(get().filters);
      set({ leads: res.data.data ?? [], meta: res.data.meta ?? null, isLoading: false });
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      set({ error: axiosErr.response?.data?.message ?? 'Failed to fetch leads', isLoading: false });
    }
  },

  fetchStats: async () => {
    try {
      const res = await leadService.getStats();
      set({ stats: res.data.data ?? null });
    } catch {
      // non-critical
    }
  },

  createLead: async (data) => {
    set({ isSubmitting: true, error: null });
    try {
      await leadService.createLead(data);
      set({ isSubmitting: false });
      await get().fetchLeads();
      await get().fetchStats();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      set({ error: axiosErr.response?.data?.message ?? 'Failed to create lead', isSubmitting: false });
      throw err;
    }
  },

  updateLead: async (id, data) => {
    set({ isSubmitting: true, error: null });
    try {
      await leadService.updateLead(id, data);
      set({ isSubmitting: false });
      await get().fetchLeads();
      await get().fetchStats();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      set({ error: axiosErr.response?.data?.message ?? 'Failed to update lead', isSubmitting: false });
      throw err;
    }
  },

  deleteLead: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await leadService.deleteLead(id);
      set({ isSubmitting: false });
      await get().fetchLeads();
      await get().fetchStats();
    } catch (err) {
      const axiosErr = err as AxiosError<ApiResponse>;
      set({ error: axiosErr.response?.data?.message ?? 'Failed to delete lead', isSubmitting: false });
      throw err;
    }
  },

  setFilters: (filters) => {
    const reset = 'page' in filters ? {} : { page: 1 };
    set((state) => ({ filters: { ...state.filters, ...filters, ...reset } }));
  },

  resetFilters: () => set({ filters: defaultFilters }),
  setSelectedLead: (lead) => set({ selectedLead: lead }),
  exportCSV: () => leadService.exportCSV(get().filters),
  clearError: () => set({ error: null }),
}));
