import { useState, useCallback } from 'react';
import StudentService from '@/services/student.service';
import { Student } from '@/types/student.types';

// Interface completa baseada no backend
interface StudentCreateData {
    nome: string;
    pai?: string;
    mae?: string;
    codigo_Nacionalidade: number;
    dataNascimento: string;
    email?: string;
    telefone?: string;
    codigo_Comuna: number;
    codigo_Encarregado?: number;
    codigo_Utilizador: number;
    sexo: 'M' | 'F';
    n_documento_identificacao?: string;
    saldo?: number;
    morada?: string;
}

// Interface para o estado do hook
interface UseStudentState {
    students: Student[];
    student: Student | null;
    loading: boolean;
    error: string | null;
    pagination: {
        currentPage: number;
        totalPages: number;
        totalItems: number;
        itemsPerPage: number;
    } | null;
}

// Interface para o retorno do hook
interface UseStudentReturn extends UseStudentState {
    getAllStudents: (page?: number, limit?: number) => Promise<void>;
    getAllStudentsComplete: () => Promise<void>;
    getStudentById: (id: number) => Promise<void>;
    createStudent: (studentData: Student) => Promise<void>;
    updateStudent: (id: number, studentData: Student) => Promise<void>;
    deleteStudent: (id: number) => Promise<void>;
    clearError: () => void;
    clearStudent: () => void;
    setLoading: (loading: boolean) => void;
}

export const useStudent = (): UseStudentReturn => {
    const [state, setState] = useState<UseStudentState>({
        students: [],
        student: null,
        loading: false,
        error: null,
        pagination: null,
    });

    const setLoading = useCallback((loading: boolean) => {
        setState(prev => ({ ...prev, loading }));
    }, []);

    const setError = useCallback((error: string | null) => {
        setState(prev => ({ ...prev, error, loading: false }));
    }, []);

    const clearError = useCallback(() => {
        setState(prev => ({ ...prev, error: null }));
    }, []);

    const clearStudent = useCallback(() => {
        setState(prev => ({ ...prev, student: null }));
    }, []);

    const getAllStudentsComplete = useCallback(async () => {
        try {
            setLoading(true);
            clearError();
            
            const response = await StudentService.getAllStudentsComplete();
            
            setState(prev => ({
                ...prev,
                students: response.students,
                pagination: response.pagination,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao carregar alunos';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const getAllStudents = useCallback(async (page: number = 1, limit: number = 10) => {
        try {
            setLoading(true);
            clearError();
            
            const response = await StudentService.getAllStudents(page, limit);
			
            
            setState(prev => ({
                ...prev,
                students: response.students,
                pagination: response.pagination,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao buscar alunos';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const getStudentById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            const student = await StudentService.getStudentById(id);
            
            setState(prev => ({
                ...prev,
                student,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao buscar aluno';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const createStudent = useCallback(async (studentData: Student) => {
        try {
            setLoading(true);
            clearError();
            
            const newStudent = await StudentService.createStudent(studentData);
            
            setState(prev => ({
                ...prev,
                students: [...prev.students, newStudent],
                student: newStudent,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao criar aluno';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const updateStudent = useCallback(async (id: number, studentData: Student) => {
        try {
            setLoading(true);
            clearError();
            
            const updatedStudent = await StudentService.updateStudent(id, studentData);
            
            setState(prev => ({
                ...prev,
                students: prev.students.map(student => 
                    student.codigo === id ? updatedStudent : student
                ),
                student: prev.student?.codigo === id ? updatedStudent : prev.student,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao atualizar aluno';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const deleteStudent = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            await StudentService.deleteStudent(id);
            
            setState(prev => ({
                ...prev,
                students: prev.students.filter(student => student.codigo !== id),
                student: prev.student?.codigo === id ? null : prev.student,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const axiosError = error as any;
            const errorMessage = axiosError?.response?.data?.message || axiosError?.message || 'Erro ao excluir aluno';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    return {
        ...state,
        getAllStudents,
        getAllStudentsComplete,
        getStudentById,
        createStudent,
        updateStudent,
        deleteStudent,
        clearError,
        clearStudent,
        setLoading,
    };
};

export default useStudent;
