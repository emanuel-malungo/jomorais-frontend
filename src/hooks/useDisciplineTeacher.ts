import { useState, useEffect } from 'react';
import { disciplineTeacherService } from '@/services/disciplineTeacher.service';
import { 
  IDisciplinaDocente, 
  IDisciplinaDocenteInput, 
  IDisciplinaDocenteResponse 
} from '@/types/disciplineTeacher.types';

// Hook para listar disciplinas do docente
export function useDisciplinasDocente(page: number = 1, limit: number = 10, search: string = '') {
  const [data, setData] = useState<IDisciplinaDocente[]>([]);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 10,
    hasNextPage: false,
    hasPreviousPage: false
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDisciplinasDocente = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.getDisciplinasDocente(page, limit, search);
      
      if (response.success) {
        setData(response.data);
        setPagination(response.pagination);
      } else {
        setError(response.message || 'Erro ao carregar disciplinas do docente');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar disciplinas do docente');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisciplinasDocente();
  }, [page, limit, search]);

  return {
    data,
    pagination,
    loading,
    error,
    refetch: fetchDisciplinasDocente
  };
}

// Hook para buscar disciplina do docente por ID
export function useDisciplinaDocente(id: number) {
  const [data, setData] = useState<IDisciplinaDocente | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDisciplinaDocente = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        setError(null);
        const response = await disciplineTeacherService.getDisciplinaDocenteById(id);
        
        if (response.success && response.data) {
          setData(response.data);
        } else {
          setError(response.message || 'Disciplina do docente não encontrada');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar disciplina do docente');
      } finally {
        setLoading(false);
      }
    };

    fetchDisciplinaDocente();
  }, [id]);

  return { data, loading, error };
}

// Hook para criar disciplina do docente
export function useCreateDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createDisciplinaDocente = async (data: IDisciplinaDocenteInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.createDisciplinaDocente(data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erro ao criar disciplina do docente');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar disciplina do docente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { createDisciplinaDocente, loading, error };
}

// Hook para atualizar disciplina do docente
export function useUpdateDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const updateDisciplinaDocente = async (id: number, data: IDisciplinaDocenteInput) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.updateDisciplinaDocente(id, data);
      
      if (response.success) {
        return response.data;
      } else {
        setError(response.message || 'Erro ao atualizar disciplina do docente');
        return null;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar disciplina do docente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { updateDisciplinaDocente, loading, error };
}

// Hook para excluir disciplina do docente
export function useDeleteDisciplinaDocente() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const deleteDisciplinaDocente = async (id: number) => {
    try {
      setLoading(true);
      setError(null);
      const response = await disciplineTeacherService.deleteDisciplinaDocente(id);
      
      if (response.success) {
        return true;
      } else {
        setError(response.message || 'Erro ao excluir disciplina do docente');
        return false;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir disciplina do docente';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { deleteDisciplinaDocente, loading, error };
}
