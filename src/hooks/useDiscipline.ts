import { useState, useCallback } from 'react';
import { Discipline, DisciplineFormData } from '@/types/discipline.types';

// Interface para o estado do hook
interface UseDisciplineState {
    disciplines: Discipline[];
    discipline: Discipline | null;
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
interface UseDisciplineReturn extends UseDisciplineState {
    getAllDisciplines: (page?: number, limit?: number) => Promise<void>;
    getDisciplineById: (id: number) => Promise<void>;
    createDiscipline: (disciplineData: DisciplineFormData) => Promise<void>;
    updateDiscipline: (id: number, disciplineData: DisciplineFormData) => Promise<void>;
    deleteDiscipline: (id: number) => Promise<void>;
    clearError: () => void;
    clearDiscipline: () => void;
    setLoading: (loading: boolean) => void;
}

export const useDiscipline = (): UseDisciplineReturn => {
    const [state, setState] = useState<UseDisciplineState>({
        disciplines: [],
        discipline: null,
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

    const clearDiscipline = useCallback(() => {
        setState(prev => ({ ...prev, discipline: null }));
    }, []);

    // Mock data para demonstração
    const mockDisciplines: Discipline[] = [
        {
            codigo: 1,
            designacao: "Matemática",
            codigo_disciplina: "MAT",
            carga_horaria: 4,
            descricao: "Disciplina de matemática básica e avançada",
            codigo_Status: 1,
            tb_disciplinas_classes: [
                { codigo: 1, tb_classes: { codigo: 1, designacao: "10ª Classe", nivel_ensino: "2º Ciclo Secundário" } },
                { codigo: 2, tb_classes: { codigo: 2, designacao: "11ª Classe", nivel_ensino: "2º Ciclo Secundário" } }
            ],
            tb_disciplinas_professores: [
                { codigo: 1, tb_professores: { codigo: 1, nome: "Prof. João Silva", especialidade: "Matemática" } }
            ]
        },
        {
            codigo: 2,
            designacao: "Língua Portuguesa",
            codigo_disciplina: "LP",
            carga_horaria: 5,
            descricao: "Disciplina de língua portuguesa e literatura",
            codigo_Status: 1,
            tb_disciplinas_classes: [
                { codigo: 3, tb_classes: { codigo: 1, designacao: "10ª Classe", nivel_ensino: "2º Ciclo Secundário" } }
            ],
            tb_disciplinas_professores: [
                { codigo: 2, tb_professores: { codigo: 2, nome: "Prof.ª Maria Costa", especialidade: "Língua Portuguesa" } }
            ]
        },
        {
            codigo: 3,
            designacao: "Física",
            codigo_disciplina: "FIS",
            carga_horaria: 3,
            descricao: "Disciplina de física geral",
            codigo_Status: 1,
            tb_disciplinas_classes: [
                { codigo: 4, tb_classes: { codigo: 2, designacao: "11ª Classe", nivel_ensino: "2º Ciclo Secundário" } }
            ],
            tb_disciplinas_professores: [
                { codigo: 3, tb_professores: { codigo: 3, nome: "Prof. António Neto", especialidade: "Física" } }
            ],
            tb_pre_requisitos: [
                { codigo: 1, tb_disciplinas_pre_requisito: { codigo: 1, designacao: "Matemática", codigo_disciplina: "MAT" } }
            ]
        },
        {
            codigo: 4,
            designacao: "Química",
            codigo_disciplina: "QUI",
            carga_horaria: 3,
            descricao: "Disciplina de química geral e orgânica",
            codigo_Status: 1,
            tb_disciplinas_classes: [
                { codigo: 5, tb_classes: { codigo: 2, designacao: "11ª Classe", nivel_ensino: "2º Ciclo Secundário" } }
            ]
        },
        {
            codigo: 5,
            designacao: "Biologia",
            codigo_disciplina: "BIO",
            carga_horaria: 3,
            descricao: "Disciplina de biologia geral",
            codigo_Status: 1,
            tb_disciplinas_classes: [
                { codigo: 6, tb_classes: { codigo: 2, designacao: "11ª Classe", nivel_ensino: "2º Ciclo Secundário" } }
            ]
        }
    ];

    const getAllDisciplines = useCallback(async (page: number = 1, limit: number = 10) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const startIndex = (page - 1) * limit;
            const endIndex = startIndex + limit;
            const paginatedDisciplines = mockDisciplines.slice(startIndex, endIndex);
            
            setState(prev => ({
                ...prev,
                disciplines: paginatedDisciplines,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(mockDisciplines.length / limit),
                    totalItems: mockDisciplines.length,
                    itemsPerPage: limit,
                },
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao buscar disciplinas';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const getDisciplineById = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const discipline = mockDisciplines.find(d => d.codigo === id);
            
            if (!discipline) {
                throw new Error('Disciplina não encontrada');
            }
            
            setState(prev => ({
                ...prev,
                discipline,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao buscar disciplina';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const createDiscipline = useCallback(async (disciplineData: DisciplineFormData) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const newDiscipline: Discipline = {
                ...disciplineData,
                codigo: Math.max(...mockDisciplines.map(d => d.codigo || 0)) + 1,
                codigo_Status: 1,
                tb_disciplinas_classes: [],
                tb_disciplinas_professores: [],
                tb_pre_requisitos: []
            };
            
            setState(prev => ({
                ...prev,
                disciplines: [...prev.disciplines, newDiscipline],
                discipline: newDiscipline,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao criar disciplina';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const updateDiscipline = useCallback(async (id: number, disciplineData: DisciplineFormData) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const existingDiscipline = mockDisciplines.find(d => d.codigo === id);
            if (!existingDiscipline) {
                throw new Error('Disciplina não encontrada');
            }
            
            const updatedDiscipline: Discipline = {
                ...existingDiscipline,
                ...disciplineData,
            };
            
            setState(prev => ({
                ...prev,
                disciplines: prev.disciplines.map(discipline => 
                    discipline.codigo === id ? updatedDiscipline : discipline
                ),
                discipline: prev.discipline?.codigo === id ? updatedDiscipline : prev.discipline,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao atualizar disciplina';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    const deleteDiscipline = useCallback(async (id: number) => {
        try {
            setLoading(true);
            clearError();
            
            // Simular delay da API
            await new Promise(resolve => setTimeout(resolve, 500));
            
            setState(prev => ({
                ...prev,
                disciplines: prev.disciplines.filter(discipline => discipline.codigo !== id),
                discipline: prev.discipline?.codigo === id ? null : prev.discipline,
                loading: false,
                error: null,
            }));
        } catch (error: any) {
            const errorMessage = error?.response?.data?.message || error?.message || 'Erro ao deletar disciplina';
            setError(errorMessage);
        }
    }, [setLoading, clearError, setError]);

    return {
        ...state,
        getAllDisciplines,
        getDisciplineById,
        createDiscipline,
        updateDiscipline,
        deleteDiscipline,
        clearError,
        clearDiscipline,
        setLoading,
    };
};

export default useDiscipline;
