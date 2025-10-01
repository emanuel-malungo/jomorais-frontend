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
import { DisciplineModal } from '@/components/discipline/discipline-modal';
import { ConfirmDeleteModal } from '@/components/discipline/confirm-delete-modal';

import { useDisciplines, useDeleteDiscipline } from '@/hooks/useDiscipline';
import { useCourses } from '@/hooks/useCourse';
import { IDiscipline } from '@/types/discipline.types';

const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "1", label: "Ativo" },
  { value: "0", label: "Inativo" },
];

export default function ListDisciplinePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedDiscipline, setSelectedDiscipline] = useState<IDiscipline | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [disciplineToDelete, setDisciplineToDelete] = useState<IDiscipline | null>(null);

  const { disciplines, loading, error, pagination, refetch } = useDisciplines(currentPage, itemsPerPage, searchTerm);
  const { courses, loading: coursesLoading } = useCourses(1, 100); // Buscar todos os cursos para o modal
  const { deleteDiscipline, loading: deleting } = useDeleteDiscipline();

  const [filteredDisciplines, setFilteredDisciplines] = useState<IDiscipline[]>([]);

  // Filtrar disciplinas localmente se necessário
  useEffect(() => {
    let filtered = disciplines;

    // Filtro por status (apenas localmente se não for feito na API)
    if (statusFilter !== "all") {
      filtered = filtered.filter((discipline: IDiscipline) => 
        discipline.codigo_Status.toString() === statusFilter
      );
    }

    setFilteredDisciplines(filtered);
  }, [statusFilter, disciplines]);

  // Resetar para primeira página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, statusFilter]);

  // Paginação - usando dados da API
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentDisciplines = filteredDisciplines; // Já são os dados da página atual
  const startIndex = pagination ? (pagination.currentPage - 1) * pagination.itemsPerPage + 1 : 1;
  const endIndex = pagination ? Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems) : filteredDisciplines.length;

  const handleCreateDiscipline = () => {
    setSelectedDiscipline(null);
    setShowModal(true);
  };

  const handleModalSuccess = () => {
    refetch();
    setShowModal(false);
    setSelectedDiscipline(null);
  };

  const handleDeleteConfirm = async () => {
    if (disciplineToDelete) {
      try {
        await deleteDiscipline(disciplineToDelete.codigo);
        setShowDeleteModal(false);
        setDisciplineToDelete(null);
        refetch();
      } catch (error) {
        console.error('Erro ao excluir disciplina:', error);
      }
    }
  };

  return (
    <Container>
      {/* Header seguindo padrão do Dashboard */}
      <WelcomeHeader
        title="Gestão de Disciplinas"
        description="Gerencie todas as disciplinas da instituição. Visualize informações detalhadas e mantenha os dados sempre atualizados."
        titleBtnRight='Nova Disciplina'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={handleCreateDiscipline}
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
          title="Disciplinas Inativas"
          value={disciplines.filter((d: IDiscipline) => d.codigo_Status === 0).length.toString()}
          change="-0.8%"
          changeType="down"
          icon={Clock}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
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
        searchPlaceholder="Buscar por nome da disciplina..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
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
                  <TableHead>Curso</TableHead>
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
                            <p className="text-sm text-gray-500">ID: {discipline.codigo}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {discipline.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <GraduationCap className="w-4 h-4 text-gray-400" />
                          <span className="font-medium">Código: {discipline.codigo_Curso}</span>
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
                            <DropdownMenuItem onClick={() => { setSelectedDiscipline(discipline); setShowModal(true) }}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => { setDisciplineToDelete(discipline); setShowDeleteModal(true) }}
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

      {/* Modal de Disciplina */}
      <DisciplineModal
        open={showModal}
        onOpenChange={setShowModal}
        discipline={selectedDiscipline}
        courses={courses}
        onSuccess={handleModalSuccess}
      />

      {/* Modal de Confirmação de Exclusão */}
      <ConfirmDeleteModal
        open={showDeleteModal}
        onOpenChange={setShowDeleteModal}
        onConfirm={handleDeleteConfirm}
        loading={deleting}
        title="Excluir Disciplina"
        description={`Tem certeza que deseja excluir a disciplina "${disciplineToDelete?.designacao}"? Esta ação não pode ser desfeita.`}
      />
    </Container>
  );
}
