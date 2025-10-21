import { useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import StudentService from '@/services/student.service';
import { getErrorMessage } from '@/utils/getErrorMessage.utils';
import {
    Student, UseStudentState, UseStudentReturn,
    EncarregadoData, CreateStudentPayload
} from '@/types/student.types';

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
            const errorMessage = getErrorMessage(error, "Erro ao carregar alunos");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

    const getAllStudents = useCallback(async (
        page: number = 1, 
        limit: number = 10, 
        search: string = '', 
        statusFilter: string | null = null, 
        cursoFilter: string | null = null
    ) => {
        try {
            setLoading(true);
            clearError();

            console.log('[useStudent] Buscando alunos com filtros:', { 
                page, 
                limit, 
                search, 
                statusFilter, 
                cursoFilter 
            });

            const response = await StudentService.getAllStudents(page, limit, search, statusFilter, cursoFilter);

            console.log('[useStudent] Resposta recebida:', {
                totalStudents: response.students.length,
                pagination: response.pagination
            });

            setState(prev => ({
                ...prev,
                students: response.students,
                pagination: response.pagination,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error, "Erro ao carregar alunos");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

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
            const errorMessage = getErrorMessage(error, "Erro ao buscar aluno");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

    const createStudent = useCallback(async (studentData: Student) => {
        try {
            setLoading(true);
            clearError();

            const formatDate = (date: string | Date | Record<string, unknown> | undefined): string | undefined => {
                if (!date) return undefined;
                if (date instanceof Date) {
                    return date.toISOString();
                }
                if (typeof date === 'string') {
                    return new Date(date).toISOString();
                }
                return undefined;
            };

            const studentDataWithEncarregado = studentData as Student & { encarregado?: EncarregadoData };

            const payload: CreateStudentPayload = {

                // Dados do aluno - TODOS OS CAMPOS OBRIGATÓRIOS
                nome: studentData.nome,
                pai: studentData.pai || '',
                mae: studentData.mae || '',
                sexo: studentData.sexo || 'M',
                dataNascimento: formatDate(studentData.dataNascimento),
                telefone: studentData.telefone || '',
                email: studentData.email || '',
                morada: studentData.morada || '',

                // Campos numéricos obrigatórios
                codigo_Nacionalidade: Number(studentData.codigo_Nacionalidade) || 2,
                codigo_Estado_Civil: 1, // SEMPRE 1 (SOLTEIRO) como padrão
                codigo_Comuna: Number(studentData.codigo_Comuna) || 1,
                codigoTipoDocumento: Number(studentData.codigoTipoDocumento) || 1,
                codigo_Status: 1, // SEMPRE 1 (NORMAL) como padrão
                escolaProveniencia: 1, // SEMPRE 1 como padrão
                codigo_Utilizador: "1", // Usuário padrão como string para conversão BigInt

                // Campos de documento obrigatórios
                n_documento_identificacao: studentData.n_documento_identificacao || `AUTO${Date.now()}`,
                dataEmissao: new Date().toISOString(), // DATA ATUAL como padrão
                provinciaEmissao: 'Luanda', // LUANDA como padrão

                // Dados do encarregado como objeto aninhado (já vem estruturado do formulário)
                encarregado: {
                    nome: studentDataWithEncarregado.encarregado?.nome,
                    telefone: studentDataWithEncarregado.encarregado?.telefone,
                    email: studentDataWithEncarregado.encarregado?.email || '',
                    codigo_Profissao: (() => {
                        const profissaoId = Number(studentDataWithEncarregado.encarregado?.codigo_Profissao);
                        // Se for 153 (que não existe), usar 1 (Professor)
                        // Se for qualquer outro ID inválido, usar 1 como padrão
                        if (profissaoId === 153 || !profissaoId || profissaoId < 1) {
                            return 1; // Professor como padrão
                        }
                        return profissaoId;
                    })(),
                    local_Trabalho: studentDataWithEncarregado.encarregado?.local_Trabalho || 'Não informado',
                    codigo_Utilizador: "1", // String para conversão BigInt
                    status: Number(studentDataWithEncarregado.encarregado?.status) || 1
                }
            };

            const newStudent = await StudentService.createStudent(payload as unknown as Student);

            setState(prev => ({
                ...prev,
                students: [...prev.students, newStudent],
                student: newStudent,
                loading: false,
                error: null,
            }));
        } catch (error: unknown) {
            const errorMessage = getErrorMessage(error, "Erro ao criar aluno");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

    const updateStudent = useCallback(async (id: number, studentData: Student) => {
        try {
            setLoading(true);
            clearError();

            const cleanData = { ...studentData } as Student & { provincia?: unknown; municipio?: unknown };

            delete cleanData.provincia;
            delete cleanData.municipio;

            const updatedStudent = await StudentService.updateStudent(id, cleanData as Student);

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
            const errorMessage = getErrorMessage(error, "Erro ao atualizar aluno");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

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
            const errorMessage = getErrorMessage(error, "Erro ao excluir aluno");
            toast.error(errorMessage);
        }
    }, [setLoading, clearError]);

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
