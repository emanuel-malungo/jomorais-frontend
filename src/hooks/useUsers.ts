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

// Hook para criar usuário
export function useCreateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createUser = useCallback(async (userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/users/legacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao criar usuário');
      }

      return data.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao criar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { createUser, loading, error };
}

// Hook para atualizar usuário
export function useUpdateUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateUser = useCallback(async (userId: number, userData: any) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/legacy/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao atualizar usuário');
      }

      return data.data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
}

// Hook para deletar usuário
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (userId: number) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/legacy/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao excluir usuário');
      }

      return data;
    } catch (err: any) {
      const errorMessage = err.message || 'Erro ao excluir usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
}
