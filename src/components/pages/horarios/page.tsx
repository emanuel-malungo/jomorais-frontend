import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  Clock, 
  Settings, 
  Eye,
  Users,
  BookOpen,
  AlertCircle,
  CheckCircle,
  MapPin
} from "lucide-react";

export default function Horarios() {
  return (
    <div className="space-y-6">
      {/* Resumo de Horários */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aulas Hoje</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28</div>
            <p className="text-xs text-muted-foreground">
              6 turmas em andamento
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Professores Ativos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground">
              De 18 professores cadastrados
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Salas Ocupadas</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12</div>
            <p className="text-xs text-muted-foreground">
              De 16 salas disponíveis
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Taxa de Ocupação</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">
              Eficiência dos horários
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Ações Rápidas */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Gestão de Horários
            </CardTitle>
            <CardDescription>
              Configure e organize os horários das aulas
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Crie novos horários, aloque professores às disciplinas, gerencie conflitos e otimize a distribuição das aulas.
              </p>
              <Link href="/horarios/gestao">
                <Button className="w-full">
                  Gerenciar Horários
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visualização de Horários
            </CardTitle>
            <CardDescription>
              Consulte horários por turma, professor ou sala
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Visualize horários em formato de grade, consulte disponibilidade e acompanhe a agenda semanal.
              </p>
              <Link href="/horarios/visualizacao">
                <Button className="w-full">
                  Ver Horários
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Próximas Aulas */}
      <Card>
        <CardHeader>
          <CardTitle>Próximas Aulas</CardTitle>
          <CardDescription>
            Aulas programadas para as próximas horas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-800">Matemática - 9º A</p>
                  <p className="text-sm text-blue-600">Prof. João Silva • Sala 201 • 14:00-15:00</p>
                </div>
              </div>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">Em 30min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-800">História - 8º B</p>
                  <p className="text-sm text-green-600">Prof. Maria Santos • Sala 105 • 15:00-16:00</p>
                </div>
              </div>
              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">Em 1h30min</span>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
              <div className="flex items-center gap-3">
                <Users className="h-5 w-5 text-purple-600" />
                <div>
                  <p className="font-medium text-purple-800">Educação Física - 7º A</p>
                  <p className="text-sm text-purple-600">Prof. Carlos Lima • Quadra • 16:00-17:00</p>
                </div>
              </div>
              <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">Em 2h30min</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Horários */}
      <Card>
        <CardHeader>
          <CardTitle>Alertas de Horários</CardTitle>
          <CardDescription>
            Notificações importantes sobre conflitos e alterações
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="font-medium text-yellow-800">Conflito de horário detectado</p>
                <p className="text-sm text-yellow-600">Prof. Ana Costa tem duas aulas simultâneas na terça-feira às 10:00</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-red-50 border border-red-200 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">Sala 203 indisponível</p>
                <p className="text-sm text-red-600">Manutenção programada para quinta-feira - realocar 3 aulas</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Horários otimizados</p>
                <p className="text-sm text-green-600">Grade semanal atualizada com sucesso - 0 conflitos pendentes</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
