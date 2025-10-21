"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useConfirmations } from '@/hooks/useConfirmation';
import { IConfirmation } from '@/types/confirmation.types';
import { useFilterOptions } from '@/hooks/useFilterOptions';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import {
  Plus,
  MoreHorizontal,
  Edit,
  Users,
  Calendar,
  CheckCircle,
  Clock,
  GraduationCap,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';

export default function ConfirmationsListPage() {

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Usar o hook useFilterOptions para obter as opções de filtros
  const {
    statusOptions,
    academicYearOptions
  } = useFilterOptions(1, 100, "");

  // Hook para buscar confirmações da API com filtros
  const {
    confirmations,
    pagination,
    loading: isLoading,
    error,
    refetch: fetchConfirmations
  } = useConfirmations(
    currentPage, 
    itemsPerPage, 
    searchTerm,
    statusFilter !== "all" ? statusFilter : null,
    yearFilter !== "all" ? yearFilter : null
  );

  // Recarregar quando mudar a busca (com debounce)
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentPage(1);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Usar dados diretamente da API (filtros são aplicados no backend)
  const totalPages = pagination?.totalPages || 1;
  const totalItems = pagination?.totalItems || 0;
  const currentConfirmations = confirmations || [];

  const startIndex = ((currentPage - 1) * itemsPerPage) + 1;
  const endIndex = Math.min(currentPage * itemsPerPage, totalItems);


  const handleEditConfirmation = (confirmationId: number) => {
    window.location.href = `/admin/student-management/confirmations/edit/${confirmationId}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <Container>

      <WelcomeHeader
        title="Gestão de Confirmações"
        description="Gerencie todas as confirmações de turma dos alunos. Visualize informações detalhadas, acompanhe classificações e mantenha os registros sempre atualizados."
        titleBtnRight='Nova Confirmação'
        iconBtnRight={<Plus className="w-5 h-5 mr-2" />}
        onClickBtnRight={() => window.location.href = '/admin/student-management/confirmations/add'}
      />

      {/* Stats Cards seguindo padrão do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">

        <StatCard
          title="Total de Confirmações"
          value={(pagination?.totalItems || 0).toString()}
          change="Total"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />

        <StatCard
          title="Confirmações Ativas"
          value={(confirmations?.filter((c: IConfirmation) => c.codigo_Status === 1).length || 0).toString()}
          change="+8.7%"
          changeType="up"
          icon={CheckCircle}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />

        <StatCard
          title="Aprovados"
          value={(confirmations?.filter((c: IConfirmation) => c.classificacao === "Aprovado").length || 0).toString()}
          change="+12.1%"
          changeType="up"
          icon={GraduationCap}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />

        <StatCard
          title="Pendentes"
          value={(confirmations?.filter((c: IConfirmation) => c.classificacao === "Pendente").length || 0).toString()}
          change="Atenção"
          changeType="neutral"
          icon={Clock}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />

      </div>


      <FilterSearchCard
        title="Filtros e Busca"
        searchPlaceholder="Buscar por aluno ou ano letivo..."
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
            label: "Ano Letivo",
            value: yearFilter,
            onChange: setYearFilter,
            options: academicYearOptions,
            width: "w-48"
          }
        ]}
      />

      {/* Tabela de Confirmações */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Lista de Confirmações</span>
              {isLoading && <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#F9CD1D]"></div>}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
              <p className="text-red-600 text-sm">
                <strong>Erro ao carregar confirmações:</strong> {error}
              </p>
              <Button
                onClick={() => fetchConfirmations()}
                variant="outline"
                size="sm"
                className="mt-2"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {isLoading && !confirmations?.length ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#F9CD1D]"></div>
              <span className="ml-2 text-gray-600">Carregando confirmações...</span>
            </div>
          ) : currentConfirmations.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Nenhuma confirmação encontrada</p>
              <p className="text-sm text-gray-400 mt-1">
                Tente ajustar os filtros ou criar uma nova confirmação
              </p>
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Aluno</TableHead>
                    <TableHead>Turma</TableHead>
                    <TableHead>Curso</TableHead>
                    <TableHead>Data Confirmação</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentConfirmations.map((confirmation) => (
                    <TableRow key={confirmation.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <Users className="h-5 w-5 text-gray-500" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_alunos.nome}</p>
                            <p className="text-sm text-gray-500">
                              {confirmation.tb_matriculas.tb_alunos.dataNascimento ? calculateAge(confirmation.tb_matriculas.tb_alunos.dataNascimento) : 'N/A'} anos • {confirmation.tb_matriculas.tb_alunos.sexo === 'M' ? 'Masculino' : 'Feminino'}
                            </p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{confirmation.tb_turmas.designacao}</p>
                          <p className="text-sm text-gray-500">
                            {confirmation.tb_turmas.tb_classes.designacao} • {confirmation.tb_turmas.tb_periodos.designacao}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <p className="font-medium text-gray-900">{confirmation.tb_matriculas.tb_cursos.designacao}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm">{confirmation.data_Confirmacao ? formatDate(confirmation.data_Confirmacao) : 'N/A'}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={confirmation.codigo_Status === 1 ? "default" : "secondary"}
                          className={confirmation.codigo_Status === 1 ? "bg-blue-100 text-blue-800" : "bg-gray-100 text-gray-800"}
                        >
                          {confirmation.codigo_Status === 1 ? "Ativa" : "Inativa"}
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
                            <DropdownMenuItem onClick={() => handleEditConfirmation(confirmation.codigo)}>
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

          {/* Paginação */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {startIndex} a {endIndex} de {totalItems} confirmações
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
                  disabled={currentPage === totalPages}
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