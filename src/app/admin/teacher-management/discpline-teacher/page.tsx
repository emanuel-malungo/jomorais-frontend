"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { useDisciplinasDocente, useDeleteDisciplinaDocente } from '@/hooks/useDisciplineTeacher';
import { IDisciplinaDocente } from '@/types/disciplineTeacher.types';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { DisciplineTeacherModal } from '@/components/discipline-teacher/discipline-teacher-modal';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
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
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  BookOpen,
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  GraduationCap,
  Clock,
  ChevronLeft,
  ChevronRight,
  Award,
} from 'lucide-react';

// Dados removidos - agora usando API real


const statusOptions = [
  { value: "all", label: "Todos os Status" },
  { value: "ativo", label: "Ativo" },
  { value: "inativo", label: "Inativo" },
];

export default function TeacherDisciplinesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Estados para modal de confirmação de exclusão
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{ id: number; nome: string } | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  // Estados para modal de criação/edição
  const [showModal, setShowModal] = useState(false);
  const [selectedDisciplineTeacher, setSelectedDisciplineTeacher] = useState<IDisciplinaDocente | null>(null);

  // Hooks da API
  const { data: disciplines, pagination, loading, error, refetch } = useDisciplinasDocente(currentPage, itemsPerPage, searchTerm);
  const { deleteDisciplinaDocente, loading: deleteLoading } = useDeleteDisciplinaDocente();

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return;

    try {
      setDeletingId(itemToDelete.id);
      await deleteDisciplinaDocente(itemToDelete.id);
      await refetch(); // Recarregar dados
      setShowDeleteModal(false);
      setItemToDelete(null);
    } catch (error) {
      console.error('Erro ao excluir disciplina do docente:', error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
    setItemToDelete(null);
  };

  const handleEditAssignment = (assignmentId: number) => {
    const discipline = disciplines?.find(d => d.codigo === assignmentId);
    if (discipline) {
      setSelectedDisciplineTeacher(discipline);
      setShowModal(true);
    }
  };

  // Estatísticas baseadas nos dados reais da API
  const totalAtribuicoes = disciplines?.length || 0;
  const professoresUnicos = disciplines ? [...new Set(disciplines.map(d => d.tb_docente.nome))].length : 0;
  const cursosUnicos = disciplines ? [...new Set(disciplines.map(d => d.tb_cursos.designacao))].length : 0;
  const disciplinasUnicas = disciplines ? [...new Set(disciplines.map(d => d.tb_disciplinas.designacao))].length : 0;

  return (
    <Container>
      {/* Header usando WelcomeHeader */}
      <WelcomeHeader
        title="Disciplinas do Docente"
        description="Gerencie as atribuições de disciplinas aos professores. Visualize horários, cargas horárias e organize a distribuição das disciplinas por docente."
        iconMain={<BookOpen className="h-8 w-8 text-white" />}
   
        onClickBtnLeft={() => console.log("Exportar")}
        titleBtnRight="Nova Atribuição"
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => {
          setSelectedDisciplineTeacher(null);
          setShowModal(true);
        }}
      />

      {/* Stats Cards usando StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={BookOpen}
          title="Total de Atribuições"
          value={totalAtribuicoes.toString()}
          change="+8.3%"
          changeType="up"
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          icon={GraduationCap}
          title="Professores Ativos"
          value={professoresUnicos.toString()}
          change="Ativos"
          changeType="neutral"
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          icon={Clock}
          title="Cursos Únicos"
          value={cursosUnicos.toString()}
          change="+5.2%"
          changeType="up"
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          icon={Award}
          title="Disciplinas Únicas"
          value={disciplinasUnicas.toString()}
          change="Ativas"
          changeType="neutral"
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Filtros e Busca usando FilterSearchCard */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por professor, disciplina, turma ou sala..."
        filters={[
          {
            label: "Status",
            value: statusFilter,
            onChange: setStatusFilter,
            options: statusOptions,
          },
        ]}
      />

      {/* Tabela de Atribuições */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5" />
              <span>Atribuições de Disciplinas</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination.totalItems} atribuições encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D]"></div>
              <span className="ml-2 text-gray-600">Carregando disciplinas do docente...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8">
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={refetch} variant="outline">
                Tentar novamente
              </Button>
            </div>
          ) : !disciplines || disciplines.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-2">Nenhuma disciplina do docente encontrada</p>
              <p className="text-sm text-gray-500">Comece criando uma nova atribuição</p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Professor</TableHead>
                    <TableHead>Disciplina</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {disciplines.map((discipline) => (
                    <TableRow key={discipline.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                            <GraduationCap className="h-5 w-5 text-[#F9CD1D]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{discipline.tb_docente.nome}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <BookOpen className="h-4 w-4 text-gray-400" />
                          <span className="font-medium text-gray-900">{discipline.tb_disciplinas.designacao}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                          {discipline.tb_cursos.designacao}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button 
                              variant="ghost" 
                              className="h-8 w-8 p-0"
                              disabled={deletingId === discipline.codigo}
                            >
                              {deletingId === discipline.codigo ? (
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-300"></div>
                              ) : (
                                <MoreHorizontal className="h-4 w-4" />
                              )}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuItem onClick={() => handleEditAssignment(discipline.codigo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </div>
          )}

          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((currentPage - 1) * itemsPerPage) + 1} a {Math.min(currentPage * itemsPerPage, pagination.totalItems)} de {pagination.totalItems} atribuições
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  {(() => {
                    const maxPagesToShow = 5;
                    const startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
                    const endPage = Math.min(pagination.totalPages, startPage + maxPagesToShow - 1);
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
                          className={currentPage === i ? "bg-[#182F59] hover:bg-[#1a3260]" : ""}
                        >
                          {i}
                        </Button>
                      );
                    }
                    
                    // Última página
                    if (endPage < pagination.totalPages) {
                      if (endPage < pagination.totalPages - 1) {
                        pages.push(<span key="ellipsis2" className="px-2">...</span>);
                      }
                      pages.push(
                        <Button
                          key={pagination.totalPages}
                          variant="outline"
                          size="sm"
                          onClick={() => setCurrentPage(pagination.totalPages)}
                        >
                          {pagination.totalPages}
                        </Button>
                      );
                    }
                    
                    return pages;
                  })()}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={currentPage === pagination.totalPages}
                >
                  Próximo
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal de Criação/Edição */}
      <DisciplineTeacherModal
        open={showModal}
        onOpenChange={(open) => {
          setShowModal(open);
          if (!open) {
            setSelectedDisciplineTeacher(null);
          }
        }}
        disciplineTeacher={selectedDisciplineTeacher}
        onSuccess={() => {
          refetch();
          setSelectedDisciplineTeacher(null);
        }}
      />

      {/* Modal de Confirmação de Exclusão */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <div className="h-10 w-10 bg-red-100 rounded-full flex items-center justify-center">
                <Trash2 className="h-5 w-5 text-red-600" />
              </div>
              <span>Confirmar Exclusão</span>
            </DialogTitle>
            <DialogDescription>
              Tem certeza que deseja excluir a atribuição de disciplina: <strong>{itemToDelete?.nome}</strong>?
              <br />
              <span className="text-red-600 text-sm mt-2 block">Esta ação não pode ser desfeita.</span>
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={handleCancelDelete} disabled={deleteLoading}>
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleConfirmDelete}
              disabled={deleteLoading}
            >
              {deleteLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Excluindo...
                </>
              ) : (
                'Excluir'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Container>
  );
}
