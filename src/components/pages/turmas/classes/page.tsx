"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Eye, Users, GraduationCap, BookOpen, Calendar } from "lucide-react";
import Link from "next/link";

interface Classe {
  id: string;
  nome: string;
  nivel_ensino: string;
  idade_minima: number;
  idade_maxima: number;
  total_turmas: number;
  total_alunos: number;
  disciplinas_obrigatorias: string[];
  status: "ativa" | "inativa";
  descricao: string;
}

export default function TurmasClassesPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("todas");

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockClasses: Classe[] = [
      {
        id: "1",
        nome: "1ª Classe",
        nivel_ensino: "Ensino Primário",
        idade_minima: 6,
        idade_maxima: 7,
        total_turmas: 4,
        total_alunos: 120,
        disciplinas_obrigatorias: ["Português", "Matemática", "Ciências", "Educação Física"],
        status: "ativa",
        descricao: "Primeira classe do ensino primário, focada na alfabetização e conceitos básicos"
      },
      {
        id: "2",
        nome: "6ª Classe",
        nivel_ensino: "Ensino Primário",
        idade_minima: 11,
        idade_maxima: 12,
        total_turmas: 3,
        total_alunos: 90,
        disciplinas_obrigatorias: ["Português", "Matemática", "História", "Geografia", "Ciências"],
        status: "ativa",
        descricao: "Última classe do ensino primário, preparação para o ensino secundário"
      },
      {
        id: "3",
        nome: "7ª Classe",
        nivel_ensino: "1º Ciclo do Ensino Secundário",
        idade_minima: 12,
        idade_maxima: 13,
        total_turmas: 5,
        total_alunos: 150,
        disciplinas_obrigatorias: ["Português", "Matemática", "Física", "Química", "Biologia", "História"],
        status: "ativa",
        descricao: "Início do ensino secundário com introdução às ciências especializadas"
      },
      {
        id: "4",
        nome: "9ª Classe",
        nivel_ensino: "1º Ciclo do Ensino Secundário",
        idade_minima: 14,
        idade_maxima: 15,
        total_turmas: 4,
        total_alunos: 128,
        disciplinas_obrigatorias: ["Português", "Matemática", "Física", "Química", "Biologia", "História", "Geografia"],
        status: "ativa",
        descricao: "Final do primeiro ciclo, preparação para exames nacionais"
      },
      {
        id: "5",
        nome: "12ª Classe",
        nivel_ensino: "2º Ciclo do Ensino Secundário",
        idade_minima: 17,
        idade_maxima: 18,
        total_turmas: 3,
        total_alunos: 85,
        disciplinas_obrigatorias: ["Português", "Matemática", "Física", "Química", "Biologia", "História", "Geografia", "Filosofia"],
        status: "ativa",
        descricao: "Classe final do ensino secundário, preparação para o ensino superior"
      },
      {
        id: "6",
        nome: "13ª Classe",
        nivel_ensino: "Ensino Pré-Universitário",
        idade_minima: 18,
        idade_maxima: 19,
        total_turmas: 2,
        total_alunos: 45,
        disciplinas_obrigatorias: ["Matemática Avançada", "Física Avançada", "Química Avançada", "Português", "Inglês"],
        status: "ativa",
        descricao: "Preparação intensiva para ingresso no ensino superior"
      }
    ];
    
    setTimeout(() => {
      setClasses(mockClasses);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredClasses = classes.filter(classe => {
    const matchesSearch = 
      classe.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classe.nivel_ensino.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === "todas" || classe.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ativa": return "bg-green-100 text-green-800 border-green-200";
      case "inativa": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getNivelColor = (nivel: string) => {
    switch (nivel) {
      case "Ensino Primário": return "bg-blue-100 text-blue-800";
      case "1º Ciclo do Ensino Secundário": return "bg-purple-100 text-purple-800";
      case "2º Ciclo do Ensino Secundário": return "bg-orange-100 text-orange-800";
      case "Ensino Pré-Universitário": return "bg-red-100 text-red-800";
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
            <CardTitle className="text-sm font-medium">Total de Classes</CardTitle>
            <GraduationCap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">{classes.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Ativas</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {classes.filter(c => c.status === "ativa").length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Turmas</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#3B6C4D]">
              {classes.reduce((acc, classe) => acc + classe.total_turmas, 0)}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Alunos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {classes.reduce((acc, classe) => acc + classe.total_alunos, 0)}
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
              placeholder="Buscar classes..."
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
          </select>
        </div>
        
        <Link href="/turmas/classes/nova">
          <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
            <Plus className="h-4 w-4 mr-2" />
            Nova Classe
          </Button>
        </Link>
      </div>

      {/* Lista de classes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredClasses.map((classe) => (
          <Card key={classe.id} className="hover:shadow-lg transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg font-semibold text-gray-900">
                    {classe.nome}
                  </CardTitle>
                  <CardDescription className="mt-1">
                    <Badge className={`${getNivelColor(classe.nivel_ensino)} border-0 text-xs`}>
                      {classe.nivel_ensino}
                    </Badge>
                  </CardDescription>
                </div>
                <Badge className={`${getStatusColor(classe.status)} border`}>
                  {classe.status === "ativa" ? "Ativa" : "Inativa"}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Informações básicas */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Idade:</span>
                  <span className="font-medium ml-1">{classe.idade_minima}-{classe.idade_maxima} anos</span>
                </div>
                <div>
                  <span className="text-gray-600">Turmas:</span>
                  <span className="font-medium ml-1">{classe.total_turmas}</span>
                </div>
                <div>
                  <span className="text-gray-600">Alunos:</span>
                  <span className="font-medium ml-1">{classe.total_alunos}</span>
                </div>
                <div>
                  <span className="text-gray-600">Disciplinas:</span>
                  <span className="font-medium ml-1">{classe.disciplinas_obrigatorias.length}</span>
                </div>
              </div>
              
              {/* Descrição */}
              <div>
                <p className="text-sm text-gray-600">{classe.descricao}</p>
              </div>
              
              {/* Disciplinas obrigatórias */}
              <div className="space-y-2">
                <span className="text-sm font-medium text-gray-700">Disciplinas Obrigatórias:</span>
                <div className="flex flex-wrap gap-1">
                  {classe.disciplinas_obrigatorias.slice(0, 3).map((disciplina, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {disciplina}
                    </Badge>
                  ))}
                  {classe.disciplinas_obrigatorias.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{classe.disciplinas_obrigatorias.length - 3} mais
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
                  Turmas
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Mensagem quando não há resultados */}
      {filteredClasses.length === 0 && (
        <div className="text-center py-12">
          <GraduationCap className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhuma classe encontrada</h3>
          <p className="text-gray-500 mb-4">
            {searchTerm || filterStatus !== "todas"
              ? "Tente ajustar os filtros de busca."
              : "Comece criando sua primeira classe."}
          </p>
          {(!searchTerm && filterStatus === "todas") && (
            <Link href="/turmas/classes/nova">
              <Button className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white">
                <Plus className="h-4 w-4 mr-2" />
                Nova Classe
              </Button>
            </Link>
          )}
        </div>
      )}
    </div>
  );
}