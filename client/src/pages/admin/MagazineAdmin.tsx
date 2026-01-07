import { useEffect, useState, useCallback } from "react";
import {
  RotateCw,
  Search,
  Calendar,
  List,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type {
  AdminMagazine,
  AdminMagazineDraft,
} from "../../types/magazine.admin";
import { magazineAdminService } from "../../services/magazine.admin.service";
import { cloudinaryUploadService } from "../../services/cloudinary.service";
import MagazineTable from "../../components/admin/magazine/MagazineTable";
import MagazineForm from "../../components/admin/magazine/MagazineForm";
import Modal from "../../components/ui/Modal";
import ConfirmModal from "../../components/ui/ConfirmModal";
import EmptyState from "../../components/ui/EmptyState";
import toast from "react-hot-toast";

const MagazineAdmin = () => {
  const [items, setItems] = useState<AdminMagazine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);

  // Pagination & Filter States
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // Filter Values
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Action States
  const [editing, setEditing] = useState<AdminMagazine | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{
    uuid: string;
    title: string;
  } | null>(null);

  const loadMagazines = useCallback(
    async (page: number, limit: number) => {
      setLoading(true);
      setError(false);
      try {
        const response = await magazineAdminService.getAll({
          page,
          limit,
          search: searchTerm,
          status: statusFilter,
          startDate: startDate || undefined,
          endDate: endDate || undefined,
        });
        setItems(response.data);
        setTotalPages(response.meta.totalPages);
        setTotalItems(response.meta.totalItems);
        setCurrentPage(response.meta.currentPage);
      } catch {
        setError(true);
        toast.error("Failed to load magazine archives");
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, statusFilter, startDate, endDate]
  );

  useEffect(() => {
    loadMagazines(1, pageSize);
  }, [loadMagazines, pageSize]);

  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("ALL");
    setStartDate("");
    setEndDate("");
    loadMagazines(1, pageSize);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
      loadMagazines(newPage, pageSize);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleSave = async (data: any) => {
    setIsSaving(true);
    try {
      let uploadResults = {};
      if (data.file) {
        toast.loading("Uploading PDF to cloud...", { id: "upload-toast" });
        uploadResults = await cloudinaryUploadService.uploadFile(
          data.file,
          "magazines"
        );
        toast.success("PDF uploaded successfully", { id: "upload-toast" });
      }

      const { file, ...formFields } = data;
      const finalPayload = { ...formFields, ...uploadResults };

      if (data.uuid) {
        await magazineAdminService.update(data.uuid, finalPayload);
        toast.success("Magazine updated successfully");
      } else {
        await magazineAdminService.create(finalPayload as AdminMagazineDraft);
        toast.success("Magazine created successfully");
      }

      setEditing(null);
      loadMagazines(currentPage, pageSize);
    } catch {
      /* Handled by interceptors */
    } finally {
      setIsSaving(false);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await magazineAdminService.remove(deleteTarget.uuid);
      toast.success("Magazine deleted successfully");
      loadMagazines(currentPage, pageSize);
    } catch {
      /* Handled globally */
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    pages.push(1);
    const left = Math.max(2, currentPage - 1);
    const right = Math.min(totalPages - 1, currentPage + 1);
    if (left > 2) pages.push("...");
    for (let i = left; i <= right; i++) pages.push(i);
    if (right < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4">
        <div>
          <h1 className="text-2xl font-serif text-stone-900">
            Manage Magazines
          </h1>
          <p className="text-stone-500 text-sm mt-1">
            Digital archive of family publications.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-2 w-full xl:w-auto">
          {/* Multi-field Search */}
          <div className="relative w-full md:w-64">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
            />
            <input
              type="text"
              placeholder="Search by title"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 outline-none transition-all shadow-sm"
            />
          </div>

          {/* Date Range Row */}
          <div className="relative w-full md:w-96 flex items-center gap-2 bg-white border border-stone-200 px-3 py-1.5 rounded-lg shadow-sm">
            <Calendar size={14} className="text-stone-400" />
            <span className="text-xs font-medium text-stone-500">From:</span>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-xs font-bold text-stone-700 outline-none bg-transparent"
            />
            <span className="text-stone-300 mx-1">|</span>
            <span className="text-xs font-medium text-stone-500">To:</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-xs font-bold text-stone-700 outline-none bg-transparent"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="flex-1 md:w-32 px-3 py-2 bg-white border border-stone-200 rounded-lg text-sm text-stone-700 outline-none shadow-sm"
            >
              <option value="ALL">All Status</option>
              <option value="PUBLISHED">Published</option>
              <option value="DRAFT">Draft</option>
            </select>

            {/* Reset Button*/}
            <button
              onClick={resetFilters}
              title="Reset Filters"
              className="p-2 hover:text-amber-700 bg-stone-100 text-stone-600 rounded-lg hover:bg-stone-200 transition-all active:scale-95 disabled:opacity-50 border border-stone-200 shadow-sm"
            >
              <RotateCw size={18} />
            </button>

            <button
              onClick={() =>
                setEditing({
                  title: "",
                  publishedDate: new Date().toISOString(),
                  status: "DRAFT",
                } as AdminMagazine)
              }
              className="whitespace-nowrap bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 transition-all shadow-sm active:scale-95"
            >
              Add New Magazine
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 bg-white border border-stone-200 rounded-2xl">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-amber-700"></div>
          <p className="mt-4 text-stone-500 text-sm font-medium">
            Loading Archives...
          </p>
        </div>
      ) : error ? (
        <div className="p-8 bg-white border border-stone-200 rounded-2xl text-center">
          <p className="text-stone-800 font-serif text-lg">
            Error loading magazines
          </p>
          <button
            onClick={() => loadMagazines(1, pageSize)}
            className="text-amber-700 font-medium hover:underline text-sm mt-2"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="No magazines found"
          description="Adjust your filters or upload a new issue."
        />
      ) : (
        <>
          <MagazineTable
            items={items}
            onEdit={setEditing}
            onDelete={(uuid) => {
              const m = items.find((x) => x.uuid === uuid);
              if (m) setDeleteTarget({ uuid: m.uuid, title: m.title });
            }}
            disabled={isDeleting || isSaving}
          />

          {/* Pagination Footer */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-4 border-t border-stone-100">
            <div className="flex flex-row gap-4 sm:gap-6 justify-between w-full sm:w-auto">
              <p className="text-stone-400 text-[10px] uppercase tracking-widest font-bold border-r border-stone-200 pr-4">
                Total {totalItems} Magazines
              </p>

              <div className="flex items-center gap-2">
                <List size={14} className="text-stone-400" />
                <span className="text-xs text-stone-500 font-medium">
                  Size:
                </span>
                <select
                  value={pageSize}
                  onChange={(e) => setPageSize(Number(e.target.value))}
                  className="bg-transparent text-xs font-bold text-stone-700 outline-none cursor-pointer"
                >
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 sm:pb-0">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1 || loading}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-1">
                {getPageNumbers().map((pageNum, idx) => (
                  <button
                    key={idx}
                    disabled={pageNum === "..." || loading}
                    onClick={() =>
                      typeof pageNum === "number" && handlePageChange(pageNum)
                    }
                    className={`min-w-9 h-9 px-2 rounded-lg text-xs font-bold transition-all ${
                      pageNum === currentPage
                        ? "bg-amber-700 text-white shadow-md shadow-amber-900/10"
                        : pageNum === "..."
                        ? "text-stone-400 cursor-default"
                        : "bg-white border border-stone-200 text-stone-600 hover:border-amber-700 hover:text-amber-700"
                    }`}
                  >
                    {pageNum}
                  </button>
                ))}
              </div>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages || loading}
                className="p-2 rounded-lg border border-stone-200 bg-white text-stone-600 hover:bg-stone-50 disabled:opacity-30"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Modals */}
      <Modal open={!!editing} onClose={() => !isSaving && setEditing(null)}>
        {editing && (
          <MagazineForm
            initial={editing.uuid ? editing : undefined}
            onSave={handleSave}
            onCancel={() => setEditing(null)}
            isLoading={isSaving}
          />
        )}
      </Modal>

      <ConfirmModal
        open={!!deleteTarget}
        title="Delete Magazine Issue?"
        description={
          deleteTarget ? (
            <span>
              Are you sure you want to delete{" "}
              <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                {deleteTarget.title}
              </span>
              ? This action cannot be undone.
            </span>
          ) : undefined
        }
        confirmText="Delete Issue"
        onCancel={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default MagazineAdmin;
