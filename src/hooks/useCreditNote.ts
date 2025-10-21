// hooks/useCreditNote.ts
import { useState, useCallback } from 'react';
import creditNoteService from '@/services/creditNote.service';
import { ICreditNote, ICreditNoteInput } from '@/types/creditNote.types';
import { toast } from 'react-toastify';

export function useCreateCreditNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createCreditNote = useCallback(async (data: ICreditNoteInput) => {
    try {
      setLoading(true);
      setError(null);
      
      // Garantir que codigo_aluno é um número
      const payload = {
        ...data,
        codigo_aluno: Number(data.codigo_aluno),
        codigoPagamentoi: data.codigoPagamentoi ? Number(data.codigoPagamentoi) : undefined
      };

      console.log('📤 Hook enviando payload:', payload);
      
      const creditNote = await creditNoteService.create(payload);
      toast.success('Nota de crédito criada com sucesso!');
      return creditNote;
    } catch (err: any) {
      console.error('❌ Erro completo:', err);
      console.error('❌ Response data:', err.response?.data);
      
      const errorMessage = err.response?.data?.message || err.response?.data?.error || 'Erro ao criar nota de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { createCreditNote, loading, error };
}

export function useUpdateCreditNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateCreditNote = useCallback(async (id: number, data: Partial<ICreditNoteInput>) => {
    try {
      setLoading(true);
      setError(null);
      const creditNote = await creditNoteService.update(id, data);
      toast.success('Nota de crédito atualizada com sucesso!');
      return creditNote;
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao atualizar nota de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { updateCreditNote, loading, error };
}

export function useCreditNotes(page: number = 1, limit: number = 10, search: string = '') {
  const [creditNotes, setCreditNotes] = useState<ICreditNote[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
  });

  const fetchCreditNotes = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await creditNoteService.getAll(page, limit, search);
      setCreditNotes(response.data);
      setPagination(response.pagination);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar notas de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [page, limit, search]);

  return { creditNotes, loading, error, pagination, fetchCreditNotes };
}

export function useCreditNote(id: number | null) {
  const [creditNote, setCreditNote] = useState<ICreditNote | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchCreditNote = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      setError(null);
      const data = await creditNoteService.getById(id);
      setCreditNote(data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao carregar nota de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }, [id]);

  return { creditNote, loading, error, fetchCreditNote };
}

export function useDeleteCreditNote() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteCreditNote = useCallback(async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      await creditNoteService.delete(id);
      toast.success('Nota de crédito excluída com sucesso!');
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Erro ao excluir nota de crédito';
      setError(errorMessage);
      toast.error(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { deleteCreditNote, loading, error };
}
