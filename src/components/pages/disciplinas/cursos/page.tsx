"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Eye, Users, BookOpen, Clock, Calendar, Award } from "lucide-react";
import Link from "next/link";

interface Curso {
  id: string;
  nome: string;
  codigo: string;
  area_conhecimento: string;
  nivel_ensino: string;
  duracao_anos: number;
  total_disciplinas: number;
  disciplinas_obrigatorias: number;
  disciplinas_optativas: number;
  carga_horaria_total: number;
  status: "ativo" | "inativo" | "em_revisao";
  descricao: string;
  coordenador?: string;
}

export default function DisciplinasCursosPage() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todos");
  const [filterArea, setFilterArea] = useState<string>("todas");

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockCursos: Curso[] = [
      {
        id: "1",
        nome: "Ensino Primário Completo",
        codigo: "EPC",
        area_conhecimento: "Educação Geral",
        nivel_ensino: "Ensino Primário",
        duracao_anos: 6,
        total_disciplinas: 8,
        disciplinas_obrigatorias: 6,
        disciplinas_optativas: 2,
        carga_horaria_total: 4800,
        status: "ativo",
        descricao: "Curso fundamental que abrange da 1ª à 6ª classe, focado na alfabetização e conceitos básicos",
        coordenador: "Prof. Maria Santos"
      },
      {
        id: "2",
        nome: "Ciências Exatas",
        codigo: "CEX",
        area_conhecimento: "Ciências Exatas",
        nivel_ensino: "2º Ciclo do Ensino Secundário",
        duracao_anos: 3,
        total_disciplinas: 12,
        disciplinas_obrigatorias: 8,
        disciplinas_optativas: 4,
        carga_horaria_total: 3600,
        status: "ativo",
        descricao: "Curso voltado para estudantes interessados em matemática, física e química avançadas",
        coordenador: "Prof. João Silva"
      },
      {
        id: "3",
        nome: "Ciências Humanas",
        codigo: "CHU",
        area_conhecimento: "Ciências Humanas",
        nivel_ensino: "2º Ciclo do Ensino Secundário",
        duracao_anos: 3,
        total_disciplinas: 10,
        disciplinas_obrigatorias: 7,
        disciplinas_optativas: 3,
        carga_horaria_total: 3200,
        status: "ativo",
        descricao: "Curso focado em história, geografia, sociologia e filosofia para formação humanística",
        coordenador: "Prof. Ana Costa"
      },
      {
        id: "4",
        nome: "Ciências Biológicas",
        codigo: "CBI",
        area_conhecimento: "Ciências da Natureza",
        nivel_ensino: "2º Ciclo do Ensino Secundário",
        duracao_anos: 3,
        total_disciplinas: 11,
        disciplinas_obrigatorias: 8,
        disciplinas_optativas: 3,
        carga_horaria_total: 3400,
        status: "ativo",
        descricao: "Curso especializado em biologia, química orgânica e ciências da saúde",
        coordenador: "Prof. Carlos Oliveira"
      },
      {
        id: "5",
        nome: "Pré-Universitário Intensivo",
        codigo: "PUI",
        area_conhecimento: "Preparação Universitária",
        nivel_ensino: "Ensino Pré-Universitário",
        duracao_anos: 1,
        total_disciplinas: 8,
        disciplinas_obrigatorias: 6,
        disciplinas_optativas: 2,
        carga_horaria_total: 1200,
        status: "ativo",
        descricao: "Curso intensivo de preparação para exames de acesso ao ensino superior",
        coordenador: "Prof. Pedro Almeida"
      },
      {
        id: "6",
        nome: "Educação Artística",
        codigo: "EAR",
        area_conhecimento: "Artes",
        nivel_ensino: "1º Ciclo do Ensino Secundário",
        duracao_anos: 3,
        total_disciplinas: 9,
        disciplinas_obrigatorias: 5,
        disciplinas_optativas: 4,
        carga_horaria_total: 2800,
        status: "em_revisao",
        descricao: "Curso voltado para desenvolvimento artístico e cultural dos estudantes"
      }
    ];
    
    setTimeout(() => {
      setCursos(mockCursos);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredCursos = cursos.filter(curso => {
    const matchesSearch = 
      curso.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      curso.area_conhecimento.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todos" || curso.status === filterStatus;
    const matchesArea = filterArea === "todas" || curso.area_conhecimento === filterArea;
    
    return matchesSearch && matchesStatus && matchesArea;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativo": return "bg-green-100 text-green-800 border-green-200";
      case "inativo": return "bg-red-100 text-red-800 border-red-200";
      case "em_revisao": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "ativo": return "Ativo";
      case "inativo": return "Inativo";
      case "em_revisao": return "Em Revisão";
      default: return status;
    }
  };

  const getAreaColor = (area: string) => {
    switch (area) {
      case "Educação Geral": return "bg-blue-100 text-blue-800";
      case "Ciências Exatas": return "bg-purple-100 text-purple-800";
      case "Ciências Humanas": return "bg-orange-100 text-orange-800";
      case "Ciências da Natureza": return "bg-green-100 text-green-800";
      case "Artes": return "bg-pink-100 text-pink-800";
      case "Preparação Universitária": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
            <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{cursos.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Cursos Ativos</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {cursos.filter(c => c.status === "ativo").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Disciplinas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">
              {cursos.reduce((acc, curso) => acc + curso.total_disciplinas, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carga Horária Total</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {(cursos.reduce((acc, curso) => acc + curso.carga_horaria_total, 0) / 1000).toFixed(1)}k
            </div>
            <p className="text-xs text-muted-foreground">horas</p>
          </CardContent>
        </Card>
      </div>

      {/* Controles de busca e filtros */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Buscar cursos..."
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
            <option value="todos">Todos os Status</option>
            <option value="ativo">Ativo</option>
            <option value="inativo">Inativo</option>
            <option value="em_revisao">Em Revisão</option>
          </select>
          
          <select
            value={filterArea}
            onChange={(e) => setFilterArea(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[#3B6C4D] focus:border-transparent"
          >
            <option value="todas">Todas as Áreas</option>
            <option value="Educação Geral">Educação Geral</option>
            <option value="Ciências Exatas">Ciências Exatas</option>
            <option value="Ciências Humanas">Ciências Humanas</option>
            <option value="Ciências da Natureza">Ciências da Natureza</option>
            <option value="Artes">Artes</option>
            <option value="Preparação Universitária">Preparação Universitária</option>
          </select>
        </div>
        
        <Link href="/disciplinas/cursos/novo">
          <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Novo Curso
          </Button>
        </Link>
      </div>

      {/* Lista de cursos */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {filteredCursos.map((curso) => (
          <Card key={curso.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {curso.nome}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <span className="font-medium">{curso.codigo}</span>
                    <span>•</span>
                    <Badge className={`${getAreaColor(curso.area_conhecimento)} border-0 text-xs`}>
                      {curso.area_conhecimento}
                    </Badge>
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(curso.status)} border`}>
                  {getStatusLabel(curso.status)}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações básicas */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Duração:</span>
                  <span className="font-medium ml-1">{curso.duracao_anos} {curso.duracao_anos === 1 ? 'ano' : 'anos'}</span>
                </div>
                <div>
                  <span className="text-gray-600">Nível:</span>
                  <span className="font-medium ml-1">{curso.nivel_ensino}</span>
                </div>
                <div>
                  <span className="text-gray-600">Disciplinas:</span>
                  <span className="font-medium ml-1">{curso.total_disciplinas}</span>
                </div>
                <div>
                  <span className="text-gray-600">Carga Horária:</span>
                  <span className="font-medium ml-1">{curso.carga_horaria_total}h</span>
                </div>
              </div>
              
              {/* Descrição */}
              <div>
                <p className="text-sm text-gray-600">{curso.descricao}</p>
              </div>
              
              {/* Distribuição de disciplinas */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Distribuição de Disciplinas:</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-xs">
                    {curso.disciplinas_obrigatorias} Obrigatórias
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {curso.disciplinas_optativas} Optativas
                  </Badge>
                </div>
              </div>
              
              {/* Coordenador */}
              {curso.coordenador && (
                <div className="text-sm">
                  <span className="text-gray-600">Coordenador: </span>
                  <span className="font-medium">{curso.coordenador}</span>
                </div>
              )}
              
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
                  <BookOpen className="h-4 w-4 mr-1" />
                  Disciplinas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredCursos.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum curso encontrado</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== "todos" || filterArea !== "todas"
              ? "Tente ajustar os filtros de busca."
              : "Comece criando seu primeiro curso."}
          </p>
          {(!searchTerm && filterStatus === "todos" && filterArea === "todas") && (
            <Link href="/disciplinas/cursos/novo">
              <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Novo Curso
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}