import { useState } from "react";

// Types and services
import type { AdminEvent, AdminEventDraft } from "../../types/event.admin";
import { eventsAdminService } from "../../services/events.admin.service";
import { useAdminData } from "../../hooks/admin/useAdminData";

// Event specific components
import EventsTable from "../../components/admin/events/EventsTable";
import EventForm from "../../components/admin/events/EventForm";

// Reusable UI Components
import {
  Modal,
  ConfirmModal,
  EmptyState,
  Pagination,
  AdminHeader,
  AdminDateRange,
  AdminMultiSearch,
  AdminSelect,
  PrimaryButton,
  ResetButton,
  AdminLoading,
  AdminError,
  AdminControlGroup,
} from "../../components/ui";

const STATUS_OPTIONS = [
  { label: "All Status", value: "ALL" },
  { label: "Published", value: "PUBLISHED" },
  { label: "Draft", value: "DRAFT" },
];

const defaultEventValues = {
  uuid: "",
  title: "",
  description: "",
  location: "",
  type: "Gathering",
  startDateTime: "",
  endDateTime: "",
  status: "DRAFT",
};

const EventsAdmin = () => {
  // 1. Logic & Data Hook
  const {
    data: events,
    loading,
    error,
    meta,
    currentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters,
    handlePageChange,
    reset,
    refresh,
  } = useAdminData<AdminEvent>(eventsAdminService.getAll, {
    status: "ALL",
    search: "",
    startDate: "",
    endDate: "",
  });

  // 2. Action States (Modals & Buttons)
  const [editing, setEditing] = useState<AdminEvent | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  // 3. Handlers
  const handleSave = async (event: AdminEvent | AdminEventDraft) => {
    setIsSaving(true);
    try {
      if ("uuid" in event && event.uuid) {
        const { uuid, ...payload } = event;
        // Success toast is now handled globally by api.ts interceptor
        await eventsAdminService.update(uuid, payload);
      } else {
        // Success toast is now handled globally by api.ts interceptor
        await eventsAdminService.create(event as AdminEventDraft);
      }
      setEditing(null);
      refresh(); // Reload data via hook
    } catch {
      /* api.ts handles global error reporting via toast.error */
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      // Success toast is now handled globally by api.ts interceptor
      await eventsAdminService.remove(deleteTarget.uuid);
      refresh(); // Reload data via hook
    } catch {
      /* api.ts handles global error reporting via toast.error */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <AdminHeader
        title="Manage Events"
        description="Search and organize family gatherings."
      >
        <AdminMultiSearch
          value={filters.search || ""}
          onChange={(val) => setFilters((prev) => ({ ...prev, search: val }))}
          placeholder="Search title, desc, type..."
        />

        <AdminDateRange
          start={filters.startDate || ""}
          end={filters.endDate || ""}
          onStartChange={(val) =>
            setFilters((prev) => ({ ...prev, startDate: val }))
          }
          onEndChange={(val) =>
            setFilters((prev) => ({ ...prev, endDate: val }))
          }
        />

        <AdminControlGroup>
          <AdminSelect
            value={filters.status || "ALL"}
            onChange={(val) => setFilters((prev) => ({ ...prev, status: val }))}
            options={STATUS_OPTIONS}
          />
          <ResetButton onClick={reset} />
          <PrimaryButton
            label="Add New Event"
            onClick={() => setEditing(defaultEventValues as AdminEvent)}
          />
        </AdminControlGroup>
      </AdminHeader>

      {/* Main Content Area */}
      {loading ? (
        <AdminLoading message="Loading events..." />
      ) : error ? (
        <AdminError title="Unable to load events" onRetry={refresh} />
      ) : events.length === 0 ? (
        <EmptyState
          title="No events found"
          description="Adjust your filters or create a new event."
        />
      ) : (
        <>
          <EventsTable
            events={events}
            onEdit={setEditing}
            onDelete={(uuid) => {
              const e = events.find((x) => x.uuid === uuid);
              if (e) setDeleteTarget({ uuid: e.uuid, title: e.title });
            }}
            disabled={isDeleting || isSaving}
          />

          <Pagination
            currentPage={currentPage}
            totalPages={meta.totalPages}
            totalItems={meta.totalItems}
            pageSize={pageSize}
            onPageChange={handlePageChange}
            onPageSizeChange={setPageSize}
            isLoading={loading}
          />
        </>
      )}

      {/* Modals */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <EventForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Event?"
        description={
          deleteTarget && (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </span>
          )
        }
        confirmText="Delete"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default EventsAdmin;
