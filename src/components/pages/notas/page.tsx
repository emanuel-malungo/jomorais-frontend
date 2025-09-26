'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  BookOpen, 
  Users, 
  TrendingUp, 
  AlertTriangle,
  Plus,
  FileText,
  Search,
  BarChart3,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react';
import Link from 'next/link';

export default function Notas() {
  const [selectedPeriod, setSelectedPeriod] = useState('atual');

  // Dados mockados para demonstração
  const stats = {
    totalAvaliacoes: 156,
    avaliacoesPendentes: 23,
    mediaGeral: 7.8,
    aprovacoes: 89
  };

  const recentActivities = [
    {
      id: 1,
      type: 'lancamento',
      description: 'Notas de Matemática - 9º Ano A',
      time: '2 horas atrás',
      status: 'completed'
    },
    {
      id: 2,
      type: 'pendente',
      description: 'Avaliação de História - 8º Ano B',
      time: '1 dia atrás',
      status: 'pending'
    },
    {
      id: 3,
      type: 'relatorio',
      description: 'Relatório mensal gerado',
      time: '2 dias atrás',
      status: 'completed'
    }
  ];

  const alerts = [
    {
      id: 1,
      type: 'warning',
      message: '23 avaliações pendentes de lançamento',
      priority: 'high'
    },
    {
      id: 2,
      type: 'info',
      message: 'Período de recuperação inicia em 5 dias',
      priority: 'medium'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Estatísticas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Avaliações</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{stats.totalAvaliacoes}</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês anterior
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendentes</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.avaliacoesPendentes}</div>
            <p className="text-xs text-muted-foreground">
              Avaliações para lançar
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Média Geral</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{stats.mediaGeral}</div>
            <p className="text-xs text-muted-foreground">
              +0.3 pontos este bimestre
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Aprovação</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{stats.aprovacoes}%</div>
            <p className="text-xs text-muted-foreground">
              +5% em relação ao ano anterior
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
          <CardDescription>
            Acesse rapidamente as principais funcionalidades de notas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link href="/notas/lancamento">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-[#3B6C4D] hover:text-white transition-colors">
                <FileText className="h-6 w-6" />
                <span className="font-medium">Lançar Notas</span>
              </Button>
            </Link>
            
            <Link href="/notas/consulta">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-[#3B6C4D] hover:text-white transition-colors">
                <Search className="h-6 w-6" />
                <span className="font-medium">Consultar Notas</span>
              </Button>
            </Link>
            
            <Link href="/notas/relatorios">
              <Button variant="outline" className="w-full h-20 flex flex-col gap-2 hover:bg-[#3B6C4D] hover:text-white transition-colors">
                <BarChart3 className="h-6 w-6" />
                <span className="font-medium">Relatórios</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Atividades Recentes */}
        <Card>
          <CardHeader>
            <CardTitle>Atividades Recentes</CardTitle>
            <CardDescription>
              Últimas ações realizadas no sistema de notas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {activity.status === 'completed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <Clock className="h-5 w-5 text-orange-600" />
                    )}
                    <div>
                      <p className="font-medium text-sm">{activity.description}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </div>
                  <Badge variant={activity.status === 'completed' ? 'default' : 'secondary'}>
                    {activity.status === 'completed' ? 'Concluído' : 'Pendente'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Alertas e Notificações */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertas e Notificações
            </CardTitle>
            <CardDescription>
              Informações importantes sobre o sistema de notas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`p-4 border rounded-lg ${
                    alert.priority === 'high' 
                      ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950' 
                      : 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-950'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {alert.priority === 'high' ? (
                      <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{alert.message}</p>
                      <Badge 
                        variant="outline" 
                        className={`mt-2 ${
                          alert.priority === 'high' 
                            ? 'border-red-600 text-red-600' 
                            : 'border-blue-600 text-blue-600'
                        }`}
                      >
                        {alert.priority === 'high' ? 'Alta Prioridade' : 'Média Prioridade'}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtros de Período */}
      <Card>
        <CardHeader>
          <CardTitle>Filtrar por Período</CardTitle>
          <CardDescription>
            Selecione o período para visualizar as informações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {[
              { value: 'atual', label: 'Bimestre Atual' },
              { value: '1bim', label: '1º Bimestre' },
              { value: '2bim', label: '2º Bimestre' },
              { value: '3bim', label: '3º Bimestre' },
              { value: '4bim', label: '4º Bimestre' },
              { value: 'anual', label: 'Anual' }
            ].map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod(period.value)}
                className={selectedPeriod === period.value ? 'bg-[#3B6C4D] hover:bg-[#2d5239]' : ''}
              >
                {period.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
