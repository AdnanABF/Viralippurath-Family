import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
interface PaginationMeta {
  totalPages: number;
  totalItems: number;
  currentPage: number;
}

interface FetchResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface AdminFilters {
  status?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
  [key: string]: any;
}

export function useAdminData<T>(
  queryKey: string, // Added a unique key for caching
  fetchFn: (params: any) => Promise<FetchResponse<T>>,
  initialFilters: AdminFilters = {}
) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [filters, setFilters] = useState<AdminFilters>(initialFilters);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: [queryKey, currentPage, pageSize, filters],
    queryFn: () =>
      fetchFn({
        page: currentPage,
        limit: pageSize,
        ...filters,
      }),
    placeholderData: (previousData) => previousData,
    staleTime: 30000,
  });

  const meta = useMemo(() => {
    return data?.meta || { totalPages: 1, totalItems: 0, currentPage: 1 };
  }, [data]);

  const handlePageChange = (newPage: number) => {
    if (newPage !== currentPage && newPage >= 1 && newPage <= meta.totalPages) {
      setCurrentPage(newPage);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const reset = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  return {
    data: data?.data || [],
    loading: isLoading,
    isRefreshing: isFetching, // Added this so you can show a subtle "syncing" state
    error: isError,
    meta,
    currentPage,
    pageSize,
    setPageSize,
    filters,
    setFilters: (
      update: AdminFilters | ((prev: AdminFilters) => AdminFilters)
    ) => {
      setFilters(update);
      setCurrentPage(1);
    },
    handlePageChange,
    reset,
    refresh: () => refetch(),
  };
}
