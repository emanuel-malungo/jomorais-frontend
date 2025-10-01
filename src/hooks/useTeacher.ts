import { useState, useCallback } from 'react';
import { Teacher, TeacherFormData } from '@/types/teacher.types';

// Interface para o estado do hook
interface UseTeacherState {
    teachers: Teacher[];
    teacher: Teacher | null;
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
interface UseTeacherReturn extends UseTeacherState {
    getAllTeachers: (page?: number, limit?: number) => Promise<void>;
    getTeacherById: (id: number) => Promise<void>;
    createTeacher: (teacherData: TeacherFormData) => Promise<void>;
    updateTeacher: (id: number, teacherData: TeacherFormData) => Promise<void>;
    deleteTeacher: (id: number) => Promise<void>;
    clearError: () => void;
    clearTeacher: () => void;
    setLoading: (loading: boolean) => void;
}

export const useTeacher = (): UseTeacherReturn => {
    const [state, setState] = useState<UseTeacherState>({
        teachers: [],
        teacher: null,
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

    const clearTeacher = useCallback(() => {
        setState(prev => ({ ...prev, teacher: null }));
    }, []);

    // Mock data para demonstração
    const mockTeachers: Teacher[] = [
        {
            codigo: 1,
            nome: "Prof. João Manuel Silva",
            email: "joao.silva@jomorais.com",
            telefone: "+244 923 456 789",
            sexo: "M",
            dataNascimento: "1985-03-15",
            n_documento_identificacao: "004567890LA041",
            codigo_Status: 1,
            especialidade: "Matemática",
            grau_academico: "Licenciatura",
            experiencia_anos: 8,
            salario: 150000,
            data_contratacao: "2020-02-01",
            tb_nacionalidades: { codigo: 1, designacao: "Angolana" },
            tb_disciplinas_professores: [
                { codigo: 1, tb_disciplinas: { codigo: 1, designacao: "Matemática", codigo_disciplina: "MAT", carga_horaria: 4 } }
            ]
        },
        {
            codigo: 2,
            nome: "Prof.ª Maria Fernanda Costa",
            email: "maria.costa@jomorais.com",
            telefone: "+244 924 567 890",
            sexo: "F",
            dataNascimento: "1982-07-22",
            n_documento_identificacao: "005678901LA042",
            codigo_Status: 1,
            especialidade: "Língua Portuguesa",
            grau_academico: "Mestrado",
            experiencia_anos: 12,
            salario: 180000,
            data_contratacao: "2018-03-15",
            tb_nacionalidades: { codigo: 1, designacao: "Angolana" },
            tb_disciplinas_professores: [
                { codigo: 2, tb_disciplinas: { codigo: 2, designacao: "Língua Portuguesa", codigo_disciplina: "LP", carga_horaria: 5 } }
            ]
        },
        {
            codigo: 3,
            nome: "Prof. António Carlos Neto",
            email: "antonio.neto@jomorais.com",
            telefone: "+244 925 678 901",
            sexo: "M",
            dataNascimento: "1978-11-08",
            n_documento_identificacao: "006789012LA043",
            codigo_Status: 1,
            especialidade: "Física",
            grau_academico: "Licenciatura",
            experiencia_anos: 15,
            salario: 165000,
            data_contratacao: "2015-09-01",
            tb_nacionalidades: { codigo: 1, designacao: "Angolana" },
            tb_disciplinas_professores: [
                { codigo: 3, tb_disciplinas: { codigo: 3, designacao: "Física", codigo_disciplina: "FIS", carga_horaria: 3 } }
            ]
        }
    ];

    const getAllTeachers = useCallback(async (page: number = 1, limit: number = 10) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedTeachers = mockTeachers.slice(startIndex, endIndex);
            
            setState(prev => ({
                ...prev,
                teachers: paginatedTeachers,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(mockTeachers.length / limit),
                    totalItems: mockTeachers.length,
                    itemsPerPage: limit,
                },
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao buscar professores';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const getTeacherById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const teacher = mockTeachers.find(t => t.codigo === id);
            
            if (!teacher) {
                throw new Error('Professor não encontrado');
            }
            
            setState(prev => ({
                ...prev,
                teacher,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao buscar professor';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const createTeacher = useCallback(async (teacherData: TeacherFormData) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newTeacher: Teacher = {
                ...teacherData,
                codigo: Math.max(...mockTeachers.map(t => t.codigo || 0)) + 1,
                codigo_Status: 1,
                data_contratacao: new Date().toISOString().split('T')[0],
                tb_nacionalidades: { codigo: 1, designacao: "Angolana" },
                tb_disciplinas_professores: []
            };
            
            setState(prev => ({
                ...prev,
                teachers: [...prev.teachers, newTeacher],
                teacher: newTeacher,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao criar professor';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const updateTeacher = useCallback(async (id: number, teacherData: TeacherFormData) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const existingTeacher = mockTeachers.find(t => t.codigo === id);
            if (!existingTeacher) {
                throw new Error('Professor não encontrado');
            }
            
            const updatedTeacher: Teacher = {
                ...existingTeacher,
                ...teacherData,
            };
            
            setState(prev => ({
                ...prev,
                teachers: prev.teachers.map(teacher => 
                    teacher.codigo === id ? updatedTeacher : teacher
                ),
                teacher: prev.teacher?.codigo === id ? updatedTeacher : prev.teacher,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar professor';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const deleteTeacher = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setState(prev => ({
                ...prev,
                teachers: prev.teachers.filter(teacher => teacher.codigo !== id),
                teacher: prev.teacher?.codigo === id ? null : prev.teacher,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao deletar professor';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    return {
        ...state,
        getAllTeachers,
        getTeacherById,
        createTeacher,
        updateTeacher,
        deleteTeacher,
        clearError,
        clearTeacher,
        setLoading,
    };
};

export default useTeacher;
