import { useState, useEffect, useCallback } from "react";
import usersService from "@/services/users.service";

interface IUser {
  id: string;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

interface IUserInput {
  nome: string;
  email: string;
  perfil: string;
  status: string;
  senha?: string;
}

export function useUsersLegacy(initialPage = 1, initialLimit = 10) {
  const [users, setUsers] = useState<IUser[]>([]);
  const [meta, setMeta] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [page, setPage] = useState(initialPage);
  const [limit, setLimit] = useState(initialLimit);

  const fetchUsers = useCallback(async (pageParam = page, limitParam = limit) => {
    try {
      setLoading(true);
      setError(null);

      const response = await usersService.getAllUsersLegacy(pageParam, limitParam);

      setUsers(response.data || []);
      setMeta(response.meta || null);
    } catch (err: unknown) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Erro ao buscar usuários");
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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

  const createUser = useCallback(async (userData: IUserInput) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch('/api/users/legacy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || 'Erro ao criar usuário');
      }

      return data.data;
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar usuário';
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

  const updateUser = useCallback(async (id: string, userData: Partial<IUserInput>) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/legacy/${id}`, {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateUser, loading, error };
}

// Hook para excluir usuário
export function useDeleteUser() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteUser = useCallback(async (id: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/users/legacy/${id}`, {
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
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir usuário';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteUser, loading, error };
}
