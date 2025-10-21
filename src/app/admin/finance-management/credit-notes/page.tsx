"use client";

import React, { useState, useEffect, useMemo } from 'react';
import Container from '@/components/layout/Container';
import { WelcomeHeader } from '@/components/dashboard';
import StatCard from '@/components/layout/StatCard';
import FilterSearchCard from '@/components/layout/FilterSearchCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useCreditNotes, useDeleteCreditNote } from '@/hooks/useCreditNote';
import { useRouter } from 'next/navigation';
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
  FileText,
  Plus,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Activity,
  CreditCard,
  Receipt,
  RefreshCw,
  DollarSign,
  Calendar,
} from 'lucide-react';

export default function CreditNotesPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Hooks da API
  const { creditNotes, loading, error, pagination, fetchCreditNotes } = useCreditNotes(currentPage, itemsPerPage, searchTerm);
  const { deleteCreditNote, loading: deleting } = useDeleteCreditNote();

  // Carregar notas de crédito
  useEffect(() => {
    fetchCreditNotes();
  }, [fetchCreditNotes]);

  const handleViewCreditNote = (noteId: number) => {
    router.push(`/admin/finance-management/credit-notes/details/${noteId}`);
  };

  const handleEditCreditNote = (noteId: number) => {
    router.push(`/admin/finance-management/credit-notes/edit/${noteId}`);
  };

  const handleDeleteCreditNote = async (noteId: number) => {
    if (confirm('Tem certeza que deseja excluir esta nota de crédito?')) {
      try {
        await deleteCreditNote(noteId);
        fetchCreditNotes(); // Recarregar lista
      } catch (error) {
        console.error('Erro ao excluir nota de crédito:', error);
      }
    }
  };

  // Estatísticas das notas de crédito
  const totalCreditos = useMemo(() => {
    return creditNotes.reduce((sum, note) => sum + parseFloat(note.valor || '0'), 0);
  }, [creditNotes]);

  const creditosAtivos = useMemo(() => {
    return creditNotes.length;
  }, [creditNotes]);

  const creditosUtilizados = useMemo(() => {
    return creditNotes.filter(n => n.codigoPagamentoi).length;
  }, [creditNotes]);

  const creditosExpirados = 0; // API não tem campo de status

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-AO');
  };

  // Loading state
  if (loading && creditNotes.length === 0) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando notas de crédito...</p>
          </div>
        </div>
      </Container>
    );
  }

  // Error state
  if (error) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={() => fetchCreditNotes()}>Tentar Novamente</Button>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header - Usando WelcomeHeader */}
      <WelcomeHeader
        title="Notas de Crédito"
        description="Gerencie todas as notas de crédito emitidas. Controle estornos, devoluções e créditos disponíveis para utilização futura pelos alunos."
        iconMain={<FileText />}
        titleBtnRight="Nova Nota de Crédito"
        iconBtnRight={<Plus />}
        onClickBtnRight={() => router.push('/admin/finance-management/credit-notes/add')}
      />

      {/* Stats Cards usando StatCard */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Créditos"
          value={formatCurrency(totalCreditos)}
          change="+8.7%"
          changeType="up"
          icon={DollarSign}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />
        
        <StatCard
          title="Créditos Ativos"
          value={formatCurrency(creditosAtivos)}
          change="Ativos"
          changeType="neutral"
          icon={CreditCard}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        
        <StatCard
          title="Créditos Utilizados"
          value={creditosUtilizados.toString()}
          change="Utilizados"
          changeType="neutral"
          icon={Receipt}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />
        
        <StatCard
          title="Créditos Expirados"
          value={creditosExpirados.toString()}
          change="Expirados"
          changeType="down"
          icon={RefreshCw}
          color="text-red-600"
          bgColor="bg-gradient-to-br from-red-50 via-white to-red-50/50"
          accentColor="bg-gradient-to-br from-red-500 to-red-600"
        />
      </div>

      {/* Busca */}
      <FilterSearchCard
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por aluno, número da nota ou descrição..."
        filters={[]}
      />

      {/* Tabela de Notas de Crédito */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RefreshCw className="h-5 w-5" />
              <span>Controle de Notas de Crédito</span>
            </div>
            <Badge variant="outline" className="text-sm">
              {pagination.totalItems} notas encontradas
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Designação</TableHead>
                  <TableHead>Aluno</TableHead>
                  <TableHead>Fatura</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Data Operação</TableHead>
                  <TableHead>Documento</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {creditNotes.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      Nenhuma nota de crédito encontrada
                    </TableCell>
                  </TableRow>
                ) : (
                  creditNotes.map((note) => (
                    <TableRow key={note.codigo}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-[#F9CD1D]/10 flex items-center justify-center">
                            <FileText className="h-5 w-5 text-[#F9CD1D]" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{note.designacao}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium text-gray-900">{note.tb_alunos?.nome || 'N/A'}</p>
                          <p className="text-sm text-gray-500">Cód: {note.codigo_aluno}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{note.fatura}</span>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium text-gray-900">{formatCurrency(parseFloat(note.valor || '0'))}</span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Calendar className="h-4 w-4 text-gray-400" />
                          <span className="text-sm text-gray-600">{formatDate(note.dataOperacao)}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-gray-600">{note.documento}</span>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0" disabled={deleting}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Ações</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewCreditNote(note.codigo)}>
                              <Eye className="mr-2 h-4 w-4" />
                              Visualizar
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditCreditNote(note.codigo)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem 
                              onClick={() => handleDeleteCreditNote(note.codigo)}
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
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between space-x-2 py-4">
              <div className="text-sm text-gray-500">
                Mostrando {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} a {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalItems)} de {pagination.totalItems} notas
              </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={pagination.currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Anterior
                </Button>
                <div className="flex items-center space-x-1">
                  <span className="text-sm text-gray-600">
                    Página {pagination.currentPage} de {pagination.totalPages}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, pagination.totalPages))}
                  disabled={pagination.currentPage === pagination.totalPages}
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
