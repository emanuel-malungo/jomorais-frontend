"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Clock,
  Users,
  GraduationCap,
  ChevronLeft,
  ChevronRight,
  FileText,
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

import useDiscipline from '@/hooks/useDiscipline';
import { Discipline } from '@/types/discipline.types';

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

const cargaHorariaOptions = [
  { value: "all", label: "Todas as Cargas Horárias" },
  { value: "1-2", label: "1-2 horas" },
  { value: "3-4", label: "3-4 horas" },
  { value: "5-6", label: "5-6 horas" },
  { value: "7+", label: "7+ horas" },
];

export default function ListDisciplinePage() {
  const { disciplines, loading, error, pagination, getAllDisciplines } = useDiscipline();

  const [filteredDisciplines, setFilteredDisciplines] = useState<Discipline[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [cargaHorariaFilter, setCargaHorariaFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Carregar disciplinas quando o componente for montado ou página mudar
  useEffect(() => {
    getAllDisciplines(currentPage, itemsPerPage);
  }, [getAllDisciplines, currentPage, itemsPerPage]);

  // Filtrar disciplinas (aplicado aos dados da página atual)
  useEffect(() => {
    let filtered = disciplines;

    // Filtro por busca
    if (searchTerm) {
      filtered = filtered.filter(discipline =>
        discipline.designacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.codigo_disciplina.toLowerCase().includes(searchTerm.toLowerCase()) ||
        discipline.descricao?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por status
    if (statusFilter !== "all") {
      filtered = filtered.filter(discipline => 
        discipline.codigo_Status.toString() === statusFilter
      );
    }

    // Filtro por carga horária
    if (cargaHorariaFilter !== "all") {
      filtered = filtered.filter(discipline => {
        const carga = discipline.carga_horaria;
        switch (cargaHorariaFilter) {
          case "1-2": return carga >= 1 && carga <= 2;
          case "3-4": return carga >= 3 && carga <= 4;
          case "5-6": return carga >= 5 && carga <= 6;
          case "7+": return carga >= 7;
          default: return true;
        }
      });
    }

    setFilteredDisciplines(filtered);
  }, [searchTerm, statusFilter, cargaHorariaFilter, disciplines]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    if (searchTerm || statusFilter !== "all" || cargaHorariaFilter !== "all") {
      setCurrentPage(1);
    }
  }, [searchTerm, statusFilter, cargaHorariaFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentDisciplines = filteredDisciplines; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredDisciplines.length;

  const handleViewDiscipline = (disciplineId: number) => {
    window.location.href = `/admin/academic-management/discipline/details/${disciplineId}`;
  };

  const handleEditDiscipline = (disciplineId: number) => {
    window.location.href = `/admin/academic-management/discipline/edit/${disciplineId}`;
  };

  const handleDeleteDiscipline = (disciplineId: number) => {
    console.log("Excluir disciplina:", disciplineId);
    // Implementar confirmação e exclusão da disciplina com o hook
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Disciplinas"
        description="Gerencie todas as disciplinas da instituição. Visualize informações detalhadas, acompanhe cargas horárias e mantenha os dados sempre atualizados."
        titleBtnRight='Nova Disciplina'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/academic-management/discipline/add'}
      />

      {/* Stats Cards usando componente StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Disciplinas"
          value={totalItems.toString()}
          change="+4.2%"
          changeType="up"
          icon={BookOpen}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Disciplinas Ativas"
          value={disciplines.filter(d => d.codigo_Status === 1).length.toString()}
          change="+2.1%"
          changeType="up"
          icon={GraduationCap}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Carga Horária Total"
          value={disciplines.reduce((total, d) => total + d.carga_horaria, 0).toString() + "h"}
          change="+1.5%"
          changeType="up"
          icon={Clock}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Página Atual"
          value={`${currentPage}/${totalPages}`}
          change="Paginação"
          changeType="neutral"
          icon={FileText}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por nome, código, descrição..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
            width: "w-48"
          },
          {
            label: "Carga Horária",
            value: cargaHorariaFilter,
            onChange: setCargaHorariaFilter,
            options: cargaHorariaOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Disciplinas */}
      <Card>
        <CardHeader>
          <CardTitle>
            Disciplinas da Página {currentPage} ({filteredDisciplines.length} de {itemsPerPage})
          </CardTitle>
          <CardDescription>
            Página {currentPage} de {totalPages} - Total: {totalItems} disciplinas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">#</TableHead>
                  <TableHead>Disciplina</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Carga Horária</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Professores</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#182F59]"></div>
                        <span>Carregando página {currentPage}...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : currentDisciplines.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      <div className="flex flex-col items-center space-y-2">
                        <BookOpen className="h-12 w-12 text-gray-400" />
                        <p className="text-gray-500">Nenhuma disciplina encontrada</p>
                        <p className="text-sm text-gray-400">
                          Tente ajustar os filtros de busca
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentDisciplines.map((discipline, index) => (
                    <TableRow key={discipline.codigo || index} className="hover:bg-gray-50">
                      <TableCell className="font-medium">
                        {startIndex + index}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#182F59] to-[#1a3260] flex items-center justify-center text-white font-semibold">
                            {discipline.designacao.charAt(0)}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{discipline.designacao}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">
                              {discipline.descricao || 'Sem descrição'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {discipline.codigo_disciplina}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">{discipline.carga_horaria}h</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {discipline.tb_disciplinas_classes && discipline.tb_disciplinas_classes.length > 0 ? (
                            <>
                              <p className="text-sm font-medium">
                                {discipline.tb_disciplinas_classes.length} classe(s)
                              </p>
                              <div className="flex flex-wrap gap-1">
                                {discipline.tb_disciplinas_classes.slice(0, 2).map((dc) => (
                                  <Badge key={dc.codigo} variant="secondary" className="text-xs">
                                    {dc.tb_classes.designacao}
                                  </Badge>
                                ))}
                                {discipline.tb_disciplinas_classes.length > 2 && (
                                  <Badge variant="secondary" className="text-xs">
                                    +{discipline.tb_disciplinas_classes.length - 2}
                                  </Badge>
                                )}
                              </div>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhuma classe</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          {discipline.tb_disciplinas_professores && discipline.tb_disciplinas_professores.length > 0 ? (
                            <>
                              <p className="text-sm font-medium">
                                {discipline.tb_disciplinas_professores.length} professor(es)
                              </p>
                              <p className="text-xs text-gray-500">
                                {discipline.tb_disciplinas_professores[0].tb_professores.nome}
                                {discipline.tb_disciplinas_professores.length > 1 && 
                                  ` +${discipline.tb_disciplinas_professores.length - 1}`
                                }
                              </p>
                            </>
                          ) : (
                            <p className="text-sm text-gray-500">Nenhum professor</p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={discipline.codigo_Status === 1 ? "default" : "secondary"}
                          className={discipline.codigo_Status === 1 ? "bg-emerald-100 text-emerald-800" : ""}
                        >
                          {discipline.codigo_Status === 1 ? "Ativa" : "Inativa"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewDiscipline(discipline.codigo || 0)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditDiscipline(discipline.codigo || 0)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDiscipline(discipline.codigo || 0)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} disciplinas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1 || loading}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
                    const adjustedStartPage = Math.max(1, endPage - maxPagesToShow + 1);
                    
                    const pages = [];
                    
                    // Primeira página
                    if (adjustedStartPage > 1) {
                      pages.push(
                        <Button
                          key={1}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(1)}
                          disabled={loading}
                        >
                          1
                        </Button>
                      );
                      if (adjustedStartPage > 2) {
                        pages.push(<span key="ellipsis1" className="px-2">...</span>);
                      }
                    }
                    
                    // Páginas do meio
                    for (let i = adjustedStartPage; i <= endPage; i++) {
                      pages.push(
                        <Button
                          key={i}
                          variant={currentPage === i ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(i)}
                          disabled={loading}
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }
                    
                    // Última página
                    if (endPage < totalPages) {
                      if (endPage < totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(totalPages)}
                          disabled={loading}
                        >
                          {totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages || loading}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}
