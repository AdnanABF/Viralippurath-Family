import { useState, useEffect, useCallback } from "react";
import toast from "react-hot-toast";

// 1. Types stay the same, but notice that our interceptor
// now returns this exact shape directly.
interface PaginationMeta {
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface FetchResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

interface AdminFilters {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export function useAdminData<T>(
  fetchFn: (params: any) => Promise<FetchResponse<T>>,
  initialFilters: AdminFilters = {}
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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
        // 2. The key change: 'response' is now the UNWRAPPED data
        // because of the interceptor in api.ts
        const result = await fetchFn({
          page,
          limit: size,
          ...currentFilters,
        });

        // Defensive check to ensure we have the expected structure
        if (result && result.data) {
          setData(result.data);
          setMeta(
            result.meta || { totalPages: 1, totalItems: 0, currentPage: 1 }
          );
          setCurrentPage(result.meta?.currentPage || 1);
        } else if (Array.isArray(result)) {
          // Fallback for cases where the API might return just an array
          // even when we expected a paginated object
          setData(result);
        }
      } catch (err: any) {
        setError(true);
        // Note: Your interceptor might already show a toast,
        // but keeping this here is a good fallback for network errors.
        if (!err.response) toast.error("Connection lost. Please try again.");
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
