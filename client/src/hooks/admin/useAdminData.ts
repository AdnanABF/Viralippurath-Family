import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

// Generic types to make this work for any entity (Events, Magazine, etc.)
interface PaginationMeta {
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface FetchResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

// These are the filters common to all your admin pages
interface AdminFilters {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any; // Allows for extra filters like 'category'
}

export function useAdminData<T>(
  fetchFn: (params: any) => Promise<FetchResponse<T>>,
  initialFilters: AdminFilters = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Pagination & Filter State
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);

  const [meta, setMeta] = useState<PaginationMeta>({
    totalPages: 1,
    totalItems: 0,
    currentPage: 1,
  });

  const loadData = useCallback(
    async (page: number, size: number, currentFilters: AdminFilters) => {
      setLoading(true);
      setError(false);
      try {
        const response = await fetchFn({
          page,
          limit: size,
          ...currentFilters,
        });
        setData(response.data);
        setMeta(response.meta);
        setCurrentPage(response.meta.currentPage);
      } catch (err) {
        setError(true);
        toast.error("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    },
    [fetchFn]
  );

  // Trigger load on change
  useEffect(() => {
    loadData(1, pageSize, filters);
  }, [loadData, pageSize, filters]);

  const refresh = () => loadData(currentPage, pageSize, filters);

  const reset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= meta.totalPages) {
      loadData(newPage, pageSize, filters);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return {
    data,
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
  };
}
