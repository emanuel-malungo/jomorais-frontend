"use client";

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ArrowLeft,
  Save,
  Loader2,
  AlertCircle,
  User,
  Mail,
  Phone,
  GraduationCap,
} from 'lucide-react';

import { useDocente, useUpdateDocente, useEspecialidades } from '@/hooks/useTeacher';
import { IDocenteInput } from '@/types/teacher.types';

export default function EditTeacherPage() {
  const router = useRouter();
  const params = useParams();
  const teacherId = parseInt(params.id as string);
  
  const { docente: teacher, loading, error } = useDocente(teacherId);
  const { updateDocente, loading: updateLoading } = useUpdateDocente();
  const { especialidades } = useEspecialidades();

  const [formData, setFormData] = useState<IDocenteInput>({
    nome: '',
    email: '',
    contacto: '',
    status: 1,
    codigo_Especialidade: 1,
    codigo_Utilizador: 0,
    user_id: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  // Carregar dados do docente no formulário
  useEffect(() => {
    if (teacher) {
      setFormData({
        nome: teacher.nome || '',
        email: teacher.email || '',
        contacto: teacher.contacto || '',
        status: teacher.status || 1,
        codigo_Especialidade: teacher.codigo_Especialidade || 1,
        codigo_Utilizador: teacher.codigo_Utilizador || 0,
        user_id: teacher.user_id || '',
        codigo_disciplina: teacher.codigo_disciplina,
      });
    }
  }, [teacher]);

  const handleInputChange = (field: keyof IDocenteInput, value: string | number | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Limpar mensagens ao editar
    setSaveSuccess(false);
    setSaveError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.email) {
      setSaveError('Por favor, preencha os campos obrigatórios: Nome e Email');
      return;
    }

    try {
      setIsSubmitting(true);
      setSaveError(null);
      setSaveSuccess(false);

      // Filtrar campos vazios ou nulos antes de enviar
      const cleanedData = Object.fromEntries(
        Object.entries(formData).filter(([key, value]) => {
          // Manter campos obrigatórios mesmo se vazios
          if (['nome', 'email', 'contacto', 'status', 'codigo_Especialidade'].includes(key)) {
            return true;
          }
          // Filtrar campos opcionais vazios
          return value !== '' && value !== null && value !== undefined;
        })
      ) as IDocenteInput;

      const result = await updateDocente(teacherId, cleanedData);
      
      if (result) {
        setSaveSuccess(true);
        setTimeout(() => {
          router.push('/admin/teacher-management/teacher');
        }, 2000);
      } else {
        setSaveError('Erro ao atualizar docente');
      }
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : 'Erro ao atualizar docente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin text-[#182F59]" />
          <span className="ml-2 text-gray-600">Carregando dados do docente...</span>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <div>
              <span className="text-red-700 font-medium">Erro ao carregar docente:</span>
              <p className="text-red-600 text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </Container>
    );
  }

  if (!teacher) {
    return (
      <Container>
        <div className="text-center py-8">
          <p className="text-gray-500">Docente não encontrado</p>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Editar Docente</h1>
            <p className="text-gray-600">{teacher.nome}</p>
          </div>
        </div>
      </div>

      {/* Estados de Sucesso e Erro */}
      {saveSuccess && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
          <div className="flex items-center">
            <div className="text-green-500 mr-2">✓</div>
            <span className="text-green-700">Docente atualizado com sucesso! Redirecionando...</span>
          </div>
        </div>
      )}

      {saveError && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <div>
                <span className="text-red-700 font-medium">Erro ao salvar:</span>
                <p className="text-red-600 text-sm mt-1">{saveError}</p>
              </div>
            </div>
            <button 
              onClick={() => setSaveError(null)}
              className="text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Formulário */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="nome">Nome Completo <span className="text-red-500">*</span></Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Nome completo do docente"
                  className={!formData.nome ? 'border-red-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="email@exemplo.com"
                  className={!formData.email ? 'border-red-300' : ''}
                />
              </div>

              <div>
                <Label htmlFor="contacto">Contacto</Label>
                <Input
                  id="contacto"
                  value={formData.contacto}
                  onChange={(e) => handleInputChange('contacto', e.target.value)}
                  placeholder="+244 xxx xxx xxx"
                />
              </div>

              <div>
                <Label htmlFor="user_id">ID Utilizador</Label>
                <Input
                  id="user_id"
                  value={formData.user_id || ''}
                  onChange={(e) => handleInputChange('user_id', e.target.value)}
                  placeholder="ID do utilizador (opcional)"
                />
              </div>
            </CardContent>
          </Card>

          {/* Informações Acadêmicas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5" />
                <span>Informações Acadêmicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="especialidade">Especialidade</Label>
                <Select
                  value={formData.codigo_Especialidade?.toString()}
                  onValueChange={(value) => handleInputChange('codigo_Especialidade', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma especialidade" />
                  </SelectTrigger>
                  <SelectContent>
                    {especialidades.map((esp) => (
                      <SelectItem key={esp.codigo} value={esp.codigo.toString()}>
                        {esp.designacao}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status?.toString()}
                  onValueChange={(value) => handleInputChange('status', parseInt(value))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ativo</SelectItem>
                    <SelectItem value="0">Inativo</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="codigo_Utilizador">Código Utilizador</Label>
                <Input
                  id="codigo_Utilizador"
                  type="number"
                  value={formData.codigo_Utilizador}
                  onChange={(e) => handleInputChange('codigo_Utilizador', parseInt(e.target.value) || 0)}
                  placeholder="0"
                />
              </div>

              <div>
                <Label htmlFor="codigo_disciplina">Código Disciplina Principal</Label>
                <Input
                  id="codigo_disciplina"
                  type="number"
                  value={formData.codigo_disciplina || ''}
                  onChange={(e) => handleInputChange('codigo_disciplina', parseInt(e.target.value) || null)}
                  placeholder="Código da disciplina principal (opcional)"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Botões de Ação */}
        <div className="flex items-center justify-end space-x-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={handleBack}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || updateLoading}
            className="bg-[#3B6C4D] hover:bg-[#2d5016]"
          >
            {isSubmitting || updateLoading ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Save className="w-4 h-4 mr-2" />
            )}
            {isSubmitting || updateLoading ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </form>
    </Container>
  );
}
