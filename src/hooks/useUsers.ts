import { useState, useEffect, useCallback } from "react";
import usersService from "@/services/users.service";

export function useUsersLegacy(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState([]);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<unknown>(null);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (pageParam = page, limitParam = limit) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersService.getAllUsersLegacy(pageParam, limitParam);

      setUsers(response.data || []);
      setMeta(response.meta || null);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  // Busca inicial e quando page/limit mudarem
  useEffect(() => {
    fetchUsers(page, limit);
  }, [fetchUsers, page, limit]);

  return {
    users,
    meta,
    loading,
    error,
    page,
    limit,
    setPage,
    setLimit,
    refetch: () => fetchUsers(page, limit),
  };
}
