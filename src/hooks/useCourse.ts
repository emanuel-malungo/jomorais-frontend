import { useState, useCallback } from 'react';
import { Course } from '@/types';

interface Pagination {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

interface UseCourseReturn {
  courses: Course[];
  loading: boolean;
  error: string | null;
  pagination: Pagination | null;
  getAllCourses: (page?: number, limit?: number) => Promise<void>;
  getCourseById: (id: number) => Promise<Course | null>;
  createCourse: (courseData: Partial<Course>) => Promise<Course | null>;
  updateCourse: (id: number, courseData: Partial<Course>) => Promise<Course | null>;
  deleteCourse: (id: number) => Promise<boolean>;
}

// Dados mockados para cursos
const mockCourses: Course[] = [
  {
    codigo: 1,
    designacao: "Informática de Gestão",
    codigo_Status: 1,
    observacoes: "Curso técnico profissional focado em gestão empresarial e tecnologia",
    nivel: "Técnico Profissional",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 1, designacao: "Programação I", codigo_Curso: 1 },
      { codigo: 2, designacao: "Base de Dados", codigo_Curso: 1 },
      { codigo: 3, designacao: "Gestão Empresarial", codigo_Curso: 1 }
    ]
  },
  {
    codigo: 2,
    designacao: "Contabilidade",
    codigo_Status: 1,
    observacoes: "Curso comercial com foco em contabilidade e finanças",
    nivel: "Técnico Profissional",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 4, designacao: "Contabilidade Geral", codigo_Curso: 2 },
      { codigo: 5, designacao: "Matemática Financeira", codigo_Curso: 2 }
    ]
  },
  {
    codigo: 3,
    designacao: "Enfermagem Geral",
    codigo_Status: 1,
    observacoes: "Curso da área da saúde com formação em cuidados de enfermagem",
    nivel: "Técnico Profissional",
    modalidade: "Presencial",
    duracao: "4 anos",
    tb_disciplinas: [
      { codigo: 6, designacao: "Anatomia e Fisiologia", codigo_Curso: 3 },
      { codigo: 7, designacao: "Cuidados de Enfermagem", codigo_Curso: 3 }
    ]
  },
  {
    codigo: 4,
    designacao: "Análises Clínicas",
    codigo_Status: 1,
    observacoes: "Curso técnico da área laboratorial",
    nivel: "Técnico Profissional",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 8, designacao: "Microbiologia", codigo_Curso: 4 },
      { codigo: 9, designacao: "Bioquímica Clínica", codigo_Curso: 4 }
    ]
  },
  {
    codigo: 5,
    designacao: "Ensino Primário",
    codigo_Status: 1,
    observacoes: "Ensino básico da 1ª à 6ª classe",
    nivel: "Ensino Primário",
    modalidade: "Presencial",
    duracao: "6 anos",
    tb_disciplinas: [
      { codigo: 10, designacao: "Língua Portuguesa", codigo_Curso: 5 },
      { codigo: 11, designacao: "Matemática", codigo_Curso: 5 },
      { codigo: 12, designacao: "Estudo do Meio", codigo_Curso: 5 }
    ]
  },
  {
    codigo: 6,
    designacao: "1º Ciclo Secundário",
    codigo_Status: 1,
    observacoes: "Ensino secundário da 7ª à 9ª classe",
    nivel: "1º Ciclo Secundário",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 13, designacao: "Física", codigo_Curso: 6 },
      { codigo: 14, designacao: "Química", codigo_Curso: 6 },
      { codigo: 15, designacao: "Biologia", codigo_Curso: 6 }
    ]
  },
  {
    codigo: 7,
    designacao: "2º Ciclo Secundário",
    codigo_Status: 1,
    observacoes: "Ensino secundário da 10ª à 12ª classe",
    nivel: "2º Ciclo Secundário",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 16, designacao: "Filosofia", codigo_Curso: 7 },
      { codigo: 17, designacao: "História", codigo_Curso: 7 }
    ]
  },
  {
    codigo: 8,
    designacao: "Pré-Universitário",
    codigo_Status: 1,
    observacoes: "Preparação para o ensino superior - 13ª classe",
    nivel: "Pré-Universitário",
    modalidade: "Presencial",
    duracao: "1 ano",
    tb_disciplinas: [
      { codigo: 18, designacao: "Preparação Universitária", codigo_Curso: 8 }
    ]
  },
  {
    codigo: 9,
    designacao: "Administração Pública",
    codigo_Status: 0,
    observacoes: "Curso suspenso temporariamente",
    nivel: "Técnico Profissional",
    modalidade: "Semi-Presencial",
    duracao: "3 anos",
    tb_disciplinas: []
  },
  {
    codigo: 10,
    designacao: "Turismo e Hotelaria",
    codigo_Status: 1,
    observacoes: "Curso técnico da área de turismo",
    nivel: "Técnico Profissional",
    modalidade: "Presencial",
    duracao: "3 anos",
    tb_disciplinas: [
      { codigo: 19, designacao: "Gestão Hoteleira", codigo_Curso: 10 },
      { codigo: 20, designacao: "Marketing Turístico", codigo_Curso: 10 }
    ]
  }
];

const useCourse = (): UseCourseReturn => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  const getAllCourses = useCallback(async (page: number = 1, limit: number = 10) => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simular paginação
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      const paginatedCourses = mockCourses.slice(startIndex, endIndex);

      setCourses(paginatedCourses);
      setPagination({
        currentPage: page,
        totalPages: Math.ceil(mockCourses.length / limit),
        totalItems: mockCourses.length,
        itemsPerPage: limit
      });
    } catch (err) {
      setError('Erro ao carregar cursos');
      console.error('Erro ao carregar cursos:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const getCourseById = useCallback(async (id: number): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 500));

      const course = mockCourses.find(c => c.codigo === id);
      return course || null;
    } catch (err) {
      setError('Erro ao carregar curso');
      console.error('Erro ao carregar curso:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const createCourse = useCallback(async (courseData: Partial<Course>): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const newCourse: Course = {
        codigo: Math.max(...mockCourses.map(c => c.codigo || 0)) + 1,
        designacao: courseData.designacao || '',
        codigo_Status: courseData.codigo_Status || 1,
        observacoes: courseData.observacoes || '',
        nivel: courseData.nivel || '',
        modalidade: courseData.modalidade || '',
        duracao: courseData.duracao || '',
        tb_disciplinas: courseData.tb_disciplinas || []
      };

      // Adicionar à lista mock
      mockCourses.push(newCourse);

      return newCourse;
    } catch (err) {
      setError('Erro ao criar curso');
      console.error('Erro ao criar curso:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCourse = useCallback(async (id: number, courseData: Partial<Course>): Promise<Course | null> => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const courseIndex = mockCourses.findIndex(c => c.codigo === id);
      if (courseIndex === -1) {
        throw new Error('Curso não encontrado');
      }

      const updatedCourse = { ...mockCourses[courseIndex], ...courseData };
      mockCourses[courseIndex] = updatedCourse;

      return updatedCourse;
    } catch (err) {
      setError('Erro ao atualizar curso');
      console.error('Erro ao atualizar curso:', err);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCourse = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true);
    setError(null);

    try {
      // Simular delay da API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const courseIndex = mockCourses.findIndex(c => c.codigo === id);
      if (courseIndex === -1) {
        throw new Error('Curso não encontrado');
      }

      mockCourses.splice(courseIndex, 1);
      return true;
    } catch (err) {
      setError('Erro ao excluir curso');
      console.error('Erro ao excluir curso:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    courses,
    loading,
    error,
    pagination,
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
  };
};

export default useCourse;
