import { useEffect, useState } from 'react';
import { Plus, Download, RefreshCw } from 'lucide-react';
import toast from 'react-hot-toast';
import { useLeadStore } from '@/store/leadStore';
import { useAuthStore } from '@/store/authStore';
import { Lead, CreateLeadInput, UpdateLeadInput } from '@/types';
import { LeadsFilters } from '@/components/leads/LeadsFilters';
import { LeadsTable } from '@/components/leads/LeadsTable';
import { Pagination } from '@/components/leads/Pagination';
import { LeadForm } from '@/components/leads/LeadForm';
import { LeadDetailModal } from '@/components/leads/LeadDetailModal';
import { Modal } from '@/components/ui/Modal';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { Button } from '@/components/ui/Button';

export const LeadsPage = () => {
  const {
    leads, meta, isLoading, isSubmitting, filters,
    fetchLeads, createLead, updateLead, deleteLead,
    setFilters, exportCSV,
  } = useLeadStore();
  const { user } = useAuthStore();

  const [createOpen, setCreateOpen] = useState(false);
  const [editLead, setEditLead] = useState<Lead | null>(null);
  const [viewLead, setViewLead] = useState<Lead | null>(null);
  const [deletingLead, setDeletingLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
  }, [filters, fetchLeads]);

  const handleCreate = async (data: CreateLeadInput) => {
    try {
      await createLead(data);
      setCreateOpen(false);
      toast.success('Lead created successfully!');
    } catch {
      toast.error(useLeadStore.getState().error ?? 'Failed to create lead');
    }
  };

  const handleUpdate = async (data: UpdateLeadInput) => {
    if (!editLead) return;
    try {
      await updateLead(editLead._id, data);
      setEditLead(null);
      toast.success('Lead updated successfully!');
    } catch {
      toast.error(useLeadStore.getState().error ?? 'Failed to update lead');
    }
  };

  const handleDelete = async () => {
    if (!deletingLead) return;
    try {
      await deleteLead(deletingLead._id);
      setDeletingLead(null);
      toast.success('Lead deleted');
    } catch {
      toast.error(useLeadStore.getState().error ?? 'Failed to delete lead');
    }
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Leads</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {meta ? `${meta.totalRecords} total leads` : 'Manage your sales leads'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => fetchLeads()}
            title="Refresh"
          >
            <RefreshCw className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={exportCSV}
            className="gap-1.5"
          >
            <Download className="h-3.5 w-3.5" />
            Export CSV
          </Button>
          <Button
            size="sm"
            onClick={() => setCreateOpen(true)}
            className="gap-1.5"
          >
            <Plus className="h-3.5 w-3.5" />
            Add Lead
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6">
        <LeadsFilters />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <LeadsTable
          leads={leads}
          isLoading={isLoading}
          onView={(lead) => setViewLead(lead)}
          onEdit={(lead) => setEditLead(lead)}
          onDelete={(lead) => setDeletingLead(lead)}
        />
        {meta && (
          <Pagination
            meta={meta}
            onPageChange={(page) => setFilters({ page })}
          />
        )}
      </div>

      {/* Create Modal */}
      <Modal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Add New Lead"
        size="md"
      >
        <LeadForm
          mode="create"
          onSubmit={handleCreate}
          onCancel={() => setCreateOpen(false)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editLead}
        onClose={() => setEditLead(null)}
        title="Edit Lead"
        size="md"
      >
        <LeadForm
          mode="edit"
          defaultValues={editLead ?? undefined}
          onSubmit={handleUpdate}
          onCancel={() => setEditLead(null)}
          isLoading={isSubmitting}
        />
      </Modal>

      {/* Detail Modal */}
      <LeadDetailModal
        lead={viewLead}
        isOpen={!!viewLead}
        onClose={() => setViewLead(null)}
      />

      {/* Delete Confirm */}
      <ConfirmDialog
        isOpen={!!deletingLead}
        onClose={() => setDeletingLead(null)}
        onConfirm={handleDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete "${deletingLead?.name}"? This action cannot be undone.`}
        isLoading={isSubmitting}
      />
    </div>
  );
};
