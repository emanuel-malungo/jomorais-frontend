import api from "@/utils/api.utils";
import { toast } from "react-toastify";
import type {
  DashboardStats,
  EnrollmentEvolution,
  MonthlyRevenue,
  GradeDistribution,
  WeeklyAttendance,
  RecentActivity,
  SystemStatus,
  DashboardData
} from "@/types/dashboard.types";

export class DashboardService {
  /**
   * Obter todos os dados do dashboard de uma vez
   */
  static async getDashboardData(): Promise<DashboardData> {
    try {
      const response = await api.get('/api/dashboard');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar dados do dashboard');
      }
    } catch (error: any) {
      console.error("Erro ao buscar dados do dashboard:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar dados do dashboard"
      );
      throw error;
    }
  }

  /**
   * Obter apenas estatísticas gerais
   */
  static async getDashboardStats(): Promise<DashboardStats> {
    try {
      const response = await api.get('/api/dashboard/stats');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar estatísticas');
      }
    } catch (error: any) {
      console.error("Erro ao buscar estatísticas:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar estatísticas"
      );
      throw error;
    }
  }

  /**
   * Obter evolução de matrículas
   */
  static async getEnrollmentEvolution(): Promise<EnrollmentEvolution[]> {
    try {
      const response = await api.get('/api/dashboard/enrollment-evolution');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar evolução de matrículas');
      }
    } catch (error: any) {
      console.error("Erro ao buscar evolução de matrículas:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar evolução de matrículas"
      );
      throw error;
    }
  }

  /**
   * Obter receita mensal
   */
  static async getMonthlyRevenue(): Promise<MonthlyRevenue[]> {
    try {
      const response = await api.get('/api/dashboard/monthly-revenue');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar receita mensal');
      }
    } catch (error: any) {
      console.error("Erro ao buscar receita mensal:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar receita mensal"
      );
      throw error;
    }
  }

  /**
   * Obter distribuição de notas
   */
  static async getGradeDistribution(): Promise<GradeDistribution[]> {
    try {
      const response = await api.get('/api/dashboard/grade-distribution');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar distribuição de notas');
      }
    } catch (error: any) {
      console.error("Erro ao buscar distribuição de notas:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar distribuição de notas"
      );
      throw error;
    }
  }

  /**
   * Obter presença semanal
   */
  static async getWeeklyAttendance(): Promise<WeeklyAttendance[]> {
    try {
      const response = await api.get('/api/dashboard/weekly-attendance');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar presença semanal');
      }
    } catch (error: any) {
      console.error("Erro ao buscar presença semanal:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar presença semanal"
      );
      throw error;
    }
  }

  /**
   * Obter atividades recentes
   */
  static async getRecentActivity(limit: number = 10): Promise<RecentActivity[]> {
    try {
      const response = await api.get(`/api/dashboard/recent-activity?limit=${limit}`);
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar atividades recentes');
      }
    } catch (error: any) {
      console.error("Erro ao buscar atividades recentes:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar atividades recentes"
      );
      throw error;
    }
  }

  /**
   * Obter status do sistema
   */
  static async getSystemStatus(): Promise<SystemStatus> {
    try {
      const response = await api.get('/api/dashboard/system-status');
      
      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Erro ao buscar status do sistema');
      }
    } catch (error: any) {
      console.error("Erro ao buscar status do sistema:", error);
      toast.error(
        error?.response?.data?.message || 
        "Erro ao carregar status do sistema"
      );
      throw error;
    }
  }
}

export default DashboardService;
