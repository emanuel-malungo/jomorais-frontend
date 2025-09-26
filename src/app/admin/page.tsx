"use client";

import { Button } from "@/components/ui/button";
import { 
  TrendingUp,
  UserCheck,
  Clock,
  Award,
  BarChart3,
  Users,
  DollarSign,
  CreditCard
} from "lucide-react";
import { useState } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";
import AdminLayout from "@/components/layout/AdminLayout";

export default function AdminPage() {
  // Mock data for the enrollments chart (two years)
  const enrollmentData2024: { label: string; value: number }[] = [
    { label: 'Jan', value: 120 },
    { label: 'Fev', value: 180 },
    { label: 'Mar', value: 220 },
    { label: 'Abr', value: 200 },
    { label: 'Mai', value: 260 },
    { label: 'Jun', value: 240 },
    { label: 'Jul', value: 150 },
    { label: 'Ago', value: 300 },
    { label: 'Set', value: 280 },
    { label: 'Out', value: 320 },
    { label: 'Nov', value: 290 },
    { label: 'Dez', value: 210 },
  ];
  
  const enrollmentData2023: { label: string; value: number }[] = [
    { label: 'Jan', value: 90 },
    { label: 'Fev', value: 140 },
    { label: 'Mar', value: 180 },
    { label: 'Abr', value: 160 },
    { label: 'Mai', value: 200 },
    { label: 'Jun', value: 210 },
    { label: 'Jul', value: 120 },
    { label: 'Ago', value: 240 },
    { label: 'Set', value: 220 },
    { label: 'Out', value: 260 },
    { label: 'Nov', value: 230 },
    { label: 'Dez', value: 180 },
  ];
  
  const [chartYear, setChartYear] = useState<'2024' | '2023'>('2024');
  const chartData = chartYear === '2024' ? enrollmentData2024 : enrollmentData2023;

  return (
    <AdminLayout title="Dashboard" description="Bem-vindo de volta! Aqui está o que está acontecendo na sua escola hoje.">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Estudantes</p>
              <p className="text-3xl font-bold text-foreground mt-2">2,847</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+12%</span>
                <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Professores</p>
              <p className="text-3xl font-bold text-foreground mt-2">284</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+5%</span>
                <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 bg-[#2d5016]/10 rounded-full">
              <UserCheck className="h-8 w-8 text-[#2d5016]" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
              <p className="text-3xl font-bold text-foreground mt-2">Kz 45,280</p>
              <div className="flex items-center mt-2">
                <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                <span className="text-sm text-green-600 font-medium">+8%</span>
                <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
              </div>
            </div>
            <div className="p-3 bg-[#FFD700]/20 rounded-full">
              <DollarSign className="h-8 w-8 text-[#FFA500]" />
            </div>
          </div>
        </div>

        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Presença Hoje</p>
              <p className="text-3xl font-bold text-foreground mt-2">94.2%</p>
              <div className="flex items-center mt-2">
                <Clock className="h-4 w-4 text-blue-500 mr-1" />
                <span className="text-sm text-blue-600 font-medium">2,683</span>
                <span className="text-sm text-muted-foreground ml-1">presentes</span>
              </div>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <UserCheck className="h-8 w-8 text-green-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Summary */}
      <div className="bg-gradient-to-br from-card to-card/50 rounded-xl shadow-lg p-8 border border-border mb-8 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h3 className="text-xl font-bold text-foreground mb-2">Resumo Mensal</h3>
            <p className="text-sm text-muted-foreground">Indicadores de desempenho da escola</p>
          </div>
          <div className="p-3 bg-primary/10 rounded-full">
            <BarChart3 className="h-6 w-6 text-primary" />
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Pagamentos */}
          <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                  <CreditCard className="h-5 w-5 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Pagamentos</p>
                  <p className="text-xs text-muted-foreground">Este mês</p>
                </div>
              </div>
              <span className="text-lg font-bold text-green-600 dark:text-green-400">68%</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-green-500 to-green-600 dark:from-green-400 dark:to-green-500 rounded-full transition-all duration-500" style={{ width: "68%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1,938 de 2,847 alunos</span>
                <span>+5% vs anterior</span>
              </div>
            </div>
          </div>

          {/* Ocupação das turmas */}
          <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Ocupação</p>
                  <p className="text-xs text-muted-foreground">Das turmas</p>
                </div>
              </div>
              <span className="text-lg font-bold text-blue-600 dark:text-blue-400">82%</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full transition-all duration-500" style={{ width: "82%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>41 de 50 turmas</span>
                <span>+3% vs anterior</span>
              </div>
            </div>
          </div>

          {/* Lançamentos de notas */}
          <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 dark:bg-orange-900/30 rounded-lg">
                  <Award className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Notas</p>
                  <p className="text-xs text-muted-foreground">Lançadas</p>
                </div>
              </div>
              <span className="text-lg font-bold text-orange-600 dark:text-orange-400">54%</span>
            </div>
            <div className="space-y-2">
              <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 dark:from-orange-400 dark:to-orange-500 rounded-full transition-all duration-500" style={{ width: "54%" }}></div>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>153 de 284 disciplinas</span>
                <span>-2% vs anterior</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick insights */}
        <div className="mt-6 pt-6 border-t border-border/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800/30">
              <div className="p-1 bg-green-500 dark:bg-green-600 rounded-full">
                <TrendingUp className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-green-800 dark:text-green-200">Meta de pagamentos atingida</p>
                <p className="text-xs text-green-600 dark:text-green-300">68% supera a meta de 65%</p>
              </div>
            </div>
            <div className="flex items-center space-x-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
              <div className="p-1 bg-orange-500 dark:bg-orange-600 rounded-full">
                <Clock className="h-3 w-3 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-orange-800 dark:text-orange-200">Atenção: Lançamento de notas</p>
                <p className="text-xs text-orange-600 dark:text-orange-300">46% das disciplinas pendentes</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Chart */}
        <div className="lg:col-span-2 bg-card rounded-xl shadow-sm p-6 border border-border">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-foreground">Matrículas por Mês</h3>
            <div className="flex space-x-2">
              <Button variant={chartYear === '2024' ? 'default' : 'outline'} size="sm" onClick={() => setChartYear('2024')}>2024</Button>
              <Button variant={chartYear === '2023' ? 'default' : 'outline'} size="sm" onClick={() => setChartYear('2023')}>2023</Button>
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="label" />
                <YAxis />
                <Tooltip />
                <Area type="monotone" dataKey="value" stroke="#3B6C4D" fill="#3B6C4D" fillOpacity={0.3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
          <h3 className="text-lg font-semibold text-foreground mb-4">Atividade Recente</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Nova matrícula</p>
                <p className="text-xs text-muted-foreground">João Silva - 9ª Classe</p>
                <p className="text-xs text-muted-foreground">há 2 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Pagamento recebido</p>
                <p className="text-xs text-muted-foreground">Maria Santos - Kz 15,000</p>
                <p className="text-xs text-muted-foreground">há 15 minutos</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-orange-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Notas lançadas</p>
                <p className="text-xs text-muted-foreground">Matemática - 8ª Classe</p>
                <p className="text-xs text-muted-foreground">há 1 hora</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-foreground">Novo professor</p>
                <p className="text-xs text-muted-foreground">Ana Costa - Português</p>
                <p className="text-xs text-muted-foreground">há 3 horas</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
