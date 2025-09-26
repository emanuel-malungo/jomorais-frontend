"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Eye, Users, Clock, MapPin, Calendar, BookOpen, User } from "lucide-react";
import Link from "next/link";

interface Turma {
  id: string;
  nome: string;
  codigo: string;
  classe: string;
  ano_letivo: string;
  periodo: "manha" | "tarde" | "noite";
  sala: string;
  capacidade_maxima: number;
  alunos_matriculados: number;
  professor_titular: string;
  status: "ativa" | "inativa" | "planejada" | "concluida";
  disciplinas: string[];
  horario_inicio: string;
  horario_fim: string;
  dias_semana: string[];
}

export default function TurmasListaPage() {
  const [turmas, setTurmas] = useState<Turma[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todas");
  const [filterPeriodo, setFilterPeriodo] = useState<string>("todos");

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockTurmas: Turma[] = [
      {
        id: "1",
        nome: "9º Ano A",
        codigo: "9A",
        classe: "9",
        ano_letivo: "2024",
        periodo: "manha",
        sala: "Sala 201",
        capacidade_maxima: 35,
        alunos_matriculados: 32,
        professor_titular: "Prof. João Silva",
        status: "ativa",
        disciplinas: ["Matemática", "Português", "História", "Geografia", "Ciências"],
        horario_inicio: "07:30",
        horario_fim: "12:00",
        dias_semana: ["segunda", "terca", "quarta", "quinta", "sexta"]
      },
      {
        id: "2",
        nome: "8º Ano B",
        codigo: "8B",
        classe: "8",
        ano_letivo: "2024",
        periodo: "tarde",
        sala: "Sala 102",
        capacidade_maxima: 30,
        alunos_matriculados: 28,
        professor_titular: "Prof. Maria Santos",
        status: "ativa",
        disciplinas: ["Matemática", "Português", "Inglês", "Ciências"],
        horario_inicio: "13:30",
        horario_fim: "18:00",
        dias_semana: ["segunda", "terca", "quarta", "quinta", "sexta"]
      },
      {
        id: "3",
        nome: "10º Ano A",
        codigo: "10A",
        classe: "10",
        ano_letivo: "2024",
        periodo: "manha",
        sala: "Sala 301",
        capacidade_maxima: 40,
        alunos_matriculados: 35,
        professor_titular: "Prof. Carlos Oliveira",
        status: "ativa",
        disciplinas: ["Matemática", "Física", "Química", "Biologia", "História"],
        horario_inicio: "07:30",
        horario_fim: "12:00",
        dias_semana: ["segunda", "terca", "quarta", "quinta", "sexta"]
      },
      {
        id: "4",
        nome: "7º Ano C",
        codigo: "7C",
        classe: "7",
        ano_letivo: "2024",
        periodo: "tarde",
        sala: "Sala 105",
        capacidade_maxima: 25,
        alunos_matriculados: 23,
        professor_titular: "Prof. Ana Costa",
        status: "ativa",
        disciplinas: ["Matemática", "Português", "História", "Geografia"],
        horario_inicio: "13:30",
        horario_fim: "17:30",
        dias_semana: ["segunda", "terca", "quarta", "quinta", "sexta"]
      },
      {
        id: "5",
        nome: "12º Ano A",
        codigo: "12A",
        classe: "12",
        ano_letivo: "2025",
        periodo: "manha",
        sala: "Sala 401",
        capacidade_maxima: 30,
        alunos_matriculados: 0,
        professor_titular: "Prof. Pedro Almeida",
        status: "planejada",
        disciplinas: ["Matemática", "Física", "Química", "Português"],
        horario_inicio: "07:30",
        horario_fim: "12:00",
        dias_semana: ["segunda", "terca", "quarta", "quinta", "sexta"]
      }
    ];
    
    setTimeout(() => {
      setTurmas(mockTurmas);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredTurmas = turmas.filter(turma => {
    const matchesSearch = 
      turma.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.professor_titular.toLowerCase().includes(searchTerm.toLowerCase()) ||
      turma.sala.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todas" || turma.status === filterStatus;
    const matchesPeriodo = filterPeriodo === "todos" || turma.periodo === filterPeriodo;
    
    return matchesSearch && matchesStatus && matchesPeriodo;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa": return "bg-green-100 text-green-800 border-green-200";
      case "inativa": return "bg-red-100 text-red-800 border-red-200";
      case "planejada": return "bg-blue-100 text-blue-800 border-blue-200";
      case "concluida": return "bg-gray-100 text-gray-800 border-gray-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativa": return "Ativa";
      case "inativa": return "Inativa";
      case "planejada": return "Planejada";
      case "concluida": return "Concluída";
      default: return status;
    }
  };

  const getPeriodoLabel = (periodo: string) => {
    switch (periodo) {
      case "manha": return "Manhã";
      case "tarde": return "Tarde";
      case "noite": return "Noite";
      default: return periodo;
    }
  };

  const getOcupacaoColor = (ocupacao: number) => {
    if (ocupacao >= 90) return "text-red-600";
    if (ocupacao >= 75) return "text-yellow-600";
    return "text-green-600";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#3B6C4D]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header com estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{turmas.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Turmas Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {turmas.filter(t => t.status === "ativa").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">
              {turmas.reduce((acc, turma) => acc + turma.alunos_matriculados, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Capacidade Total</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {turmas.reduce((acc, turma) => acc + turma.capacidade_maxima, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controles de busca e filtros */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar turmas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6C4D] focus:border-transparent"
          >
            <option value="todas">Todos os Status</option>
            <option value="ativa">Ativa</option>
            <option value="inativa">Inativa</option>
            <option value="planejada">Planejada</option>
            <option value="concluida">Concluída</option>
          </select>
          
          <select
            value={filterPeriodo}
            onChange={(e) => setFilterPeriodo(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6C4D] focus:border-transparent"
          >
            <option value="todos">Todos os Períodos</option>
            <option value="manha">Manhã</option>
            <option value="tarde">Tarde</option>
            <option value="noite">Noite</option>
          </select>
        </div>
        
        <Link href="/turmas/nova">
          <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Turma
          </Button>
        </Link>
      </div>

      {/* Lista de turmas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTurmas.map((turma) => {
          const ocupacao = Math.round((turma.alunos_matriculados / turma.capacidade_maxima) * 100);
          
          return (
            <Card key={turma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg font-semibold text-gray-900">
                      {turma.nome}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2 mt-1">
                      <span className="font-medium">{turma.codigo}</span>
                      <span>•</span>
                      <span>{turma.classe}ª Classe</span>
                      <span>•</span>
                      <span>{turma.ano_letivo}</span>
                    </CardDescription>
                  </div>
                  <Badge className={`${getStatusColor(turma.status)} border`}>
                    {getStatusLabel(turma.status)}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Informações básicas */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>{getPeriodoLabel(turma.periodo)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{turma.sala}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="truncate">{turma.professor_titular}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>{turma.horario_inicio} - {turma.horario_fim}</span>
                  </div>
                </div>
                
                {/* Ocupação */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-600">Ocupação</span>
                    <span className={`font-medium ${getOcupacaoColor(ocupacao)}`}>
                      {turma.alunos_matriculados}/{turma.capacidade_maxima} ({ocupacao}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        ocupacao >= 90 ? 'bg-red-500' : 
                        ocupacao >= 75 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(ocupacao, 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Disciplinas */}
                <div className="space-y-2">
                  <span className="text-sm text-gray-600">Disciplinas:</span>
                  <div className="flex flex-wrap gap-1">
                    {turma.disciplinas.slice(0, 3).map((disciplina, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {disciplina}
                      </Badge>
                    ))}
                    {turma.disciplinas.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{turma.disciplinas.length - 3} mais
                      </Badge>
                    )}
                  </div>
                </div>
                
                {/* Ações */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1">
                    <Eye className="h-4 w-4 mr-1" />
                    Ver
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    <Users className="h-4 w-4 mr-1" />
                    Alunos
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredTurmas.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma turma encontrada</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== "todas" || filterPeriodo !== "todos"
              ? "Tente ajustar os filtros de busca."
              : "Comece criando sua primeira turma."}
          </p>
          {(!searchTerm && filterStatus === "todas" && filterPeriodo === "todos") && (
            <Link href="/turmas/nova">
              <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Turma
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}