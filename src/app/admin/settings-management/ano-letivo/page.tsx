"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calendar,
  Save,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  BookOpen,
  Users,
  GraduationCap,
} from 'lucide-react';

interface AnoLetivo {
  id: string;
  nome: string;
  inicio: string;
  fim: string;
  status: 'ativo' | 'inativo' | 'planejado';
  trimestres: Trimestre[];
}

interface Trimestre {
  id: string;
  nome: string;
  inicio: string;
  fim: string;
  status: 'ativo' | 'concluido' | 'planejado';
}

export default function AnoLetivoPage() {
  const [anosLetivos] = useState<AnoLetivo[]>([
    {
      id: '1',
      nome: '2024/2025',
      inicio: '2024-09-02',
      fim: '2025-07-15',
      status: 'ativo',
      trimestres: [
        { id: '1', nome: '1º Trimestre', inicio: '2024-09-02', fim: '2024-12-15', status: 'concluido' },
        { id: '2', nome: '2º Trimestre', inicio: '2025-01-08', fim: '2025-04-15', status: 'ativo' },
        { id: '3', nome: '3º Trimestre', inicio: '2025-04-22', fim: '2025-07-15', status: 'planejado' }
      ]
    },
    {
      id: '2',
      nome: '2025/2026',
      inicio: '2025-09-01',
      fim: '2026-07-15',
      status: 'planejado',
      trimestres: [
        { id: '4', nome: '1º Trimestre', inicio: '2025-09-01', fim: '2025-12-15', status: 'planejado' },
        { id: '5', nome: '2º Trimestre', inicio: '2026-01-08', fim: '2026-04-15', status: 'planejado' },
        { id: '6', nome: '3º Trimestre', inicio: '2026-04-22', fim: '2026-07-15', status: 'planejado' }
      ]
    }
  ]);

  const [novoAno, setNovoAno] = useState({
    nome: '',
    inicio: '',
    fim: ''
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo': return 'bg-green-100 text-green-800';
      case 'concluido': return 'bg-blue-100 text-blue-800';
      case 'inativo': return 'bg-gray-100 text-gray-800';
      case 'planejado': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ativo': return <CheckCircle className="h-4 w-4" />;
      case 'concluido': return <CheckCircle className="h-4 w-4" />;
      case 'planejado': return <Clock className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-AO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Container>
      {/* Header */}
      <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
        <div className="relative z-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
            <div className="space-y-3">
              <div className="flex items-center space-x-4">
                <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Ano Letivo
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Gestão de Anos Letivos e Trimestres</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Configure os anos letivos, defina períodos acadêmicos e gerencie 
                os trimestres do calendário escolar.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Novo Ano Letivo
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-green-50 via-white to-green-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-sm">
              <Calendar className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <CheckCircle className="h-3 w-3 text-green-500" />
              <span className="font-bold text-xs text-green-600">Ativo</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-green-600">Ano Letivo Atual</p>
            <p className="text-3xl font-bold text-gray-900">2024/2025</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-white to-blue-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59] to-[#1a3260] shadow-sm">
              <BookOpen className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Clock className="h-3 w-3 text-blue-500" />
              <span className="font-bold text-xs text-blue-600">Em Curso</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#182F59]">Trimestre Atual</p>
            <p className="text-3xl font-bold text-gray-900">2º Trimestre</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-amber-50 via-white to-yellow-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107] shadow-sm">
              <Users className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Users className="h-3 w-3 text-yellow-500" />
              <span className="font-bold text-xs text-yellow-600">1.247</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-[#FFD002]">Alunos Matriculados</p>
            <p className="text-3xl font-bold text-gray-900">1.247</p>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-purple-50 via-white to-purple-50/50 border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-sm">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
              <Calendar className="h-3 w-3 text-purple-500" />
              <span className="font-bold text-xs text-purple-600">87 dias</span>
            </div>
          </div>
          <div>
            <p className="text-sm font-semibold mb-2 text-purple-600">Dias Letivos Restantes</p>
            <p className="text-3xl font-bold text-gray-900">87</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Novo Ano Letivo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Novo Ano Letivo</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nome do Ano Letivo
              </label>
              <Input
                value={novoAno.nome}
                onChange={(e) => setNovoAno(prev => ({ ...prev, nome: e.target.value }))}
                placeholder="Ex: 2025/2026"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Data de Início
              </label>
              <Input
                type="date"
                value={novoAno.inicio}
                onChange={(e) => setNovoAno(prev => ({ ...prev, inicio: e.target.value }))}
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Data de Fim
              </label>
              <Input
                type="date"
                value={novoAno.fim}
                onChange={(e) => setNovoAno(prev => ({ ...prev, fim: e.target.value }))}
              />
            </div>

            <div className="pt-4">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white w-full">
                <Save className="w-4 h-4 mr-2" />
                Criar Ano Letivo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Anos Letivos */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Calendar className="h-5 w-5" />
                <span>Anos Letivos</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {anosLetivos.map((ano) => (
                  <div key={ano.id} className="border rounded-lg p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{ano.nome}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(ano.inicio)} - {formatDate(ano.fim)}
                          </p>
                        </div>
                        <Badge className={getStatusColor(ano.status)}>
                          {getStatusIcon(ano.status)}
                          <span className="ml-1 capitalize">{ano.status}</span>
                        </Badge>
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    {/* Trimestres */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900">Trimestres</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {ano.trimestres.map((trimestre) => (
                          <div key={trimestre.id} className="border rounded-lg p-4 space-y-2">
                            <div className="flex items-center justify-between">
                              <h5 className="font-medium text-sm text-gray-900">{trimestre.nome}</h5>
                              <Badge className={`text-xs ${getStatusColor(trimestre.status)}`}>
                                {getStatusIcon(trimestre.status)}
                                <span className="ml-1 capitalize">{trimestre.status}</span>
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600">
                              {formatDate(trimestre.inicio)} - {formatDate(trimestre.fim)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Container>
  );
}
