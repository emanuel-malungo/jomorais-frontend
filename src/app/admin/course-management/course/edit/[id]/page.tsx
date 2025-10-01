"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ArrowLeft,
  Save,
  X,
  GraduationCap,
  Settings,
  FileText
} from 'lucide-react';
import { useCourse } from '@/hooks';
import { Course } from '@/types';

export default function EditCourse() {
  const params = useParams();
  const router = useRouter();
  const { getCourseById, updateCourse } = useCourse();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    designacao: '',
    nivel: '',
    modalidade: '',
    duracao: '',
    codigo_Status: 1,
    observacoes: ''
  });

  useEffect(() => {
    const loadCourse = async () => {
      setLoading(true);
      const courseId = parseInt(params.id as string);
      const course = await getCourseById(courseId);
      
      if (course) {
        setFormData({
          designacao: course.designacao,
          nivel: course.nivel || '',
          modalidade: course.modalidade || '',
          duracao: course.duracao || '',
          codigo_Status: course.codigo_Status || 1,
          observacoes: course.observacoes || ''
        });
      }
      
      setLoading(false);
    };

    loadCourse();
  }, [params.id, getCourseById]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const courseId = parseInt(params.id as string);
      const result = await updateCourse(courseId, formData);
      if (result) {
        router.push(`/admin/course-management/course/details/${params.id}`);
      }
    } catch (error) {
      console.error('Erro ao atualizar curso:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <Container>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F9CD1D] mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando dados do curso...</p>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      {/* Header Fixo */}
      <div className="sticky top-0 z-50 bg-background border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Voltar</span>
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-xl font-semibold text-foreground">Editar Curso</h1>
                <p className="text-sm text-muted-foreground">Atualizar informações do curso</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </Button>
              <Button
                form="course-form"
                disabled={saving}
                className="bg-[#3B6C4D] hover:bg-[#2d5016] text-white"
              >
                {saving ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                ) : (
                  <Save className="h-4 w-4 mr-2" />
                )}
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Formulário */}
      <div className="max-w-4xl mx-auto py-8 space-y-8">
        <form id="course-form" onSubmit={handleSubmit} className="space-y-8">
          {/* Informações Básicas */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                <span>Informações Básicas</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nome do Curso *
                  </label>
                  <input
                    type="text"
                    value={formData.designacao}
                    onChange={(e) => setFormData({...formData, designacao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    placeholder="Ex: Informática de Gestão"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Nível de Ensino *
                  </label>
                  <select
                    value={formData.nivel}
                    onChange={(e) => setFormData({...formData, nivel: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar nível</option>
                    <option value="Ensino Primário">Ensino Primário</option>
                    <option value="1º Ciclo Secundário">1º Ciclo Secundário</option>
                    <option value="2º Ciclo Secundário">2º Ciclo Secundário</option>
                    <option value="Pré-Universitário">Pré-Universitário</option>
                    <option value="Técnico Profissional">Técnico Profissional</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Modalidade *
                  </label>
                  <select
                    value={formData.modalidade}
                    onChange={(e) => setFormData({...formData, modalidade: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar modalidade</option>
                    <option value="Presencial">Presencial</option>
                    <option value="Semi-Presencial">Semi-Presencial</option>
                    <option value="À Distância">À Distância</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-foreground mb-2">
                    Duração *
                  </label>
                  <select
                    value={formData.duracao}
                    onChange={(e) => setFormData({...formData, duracao: e.target.value})}
                    className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-background text-foreground"
                    required
                  >
                    <option value="">Selecionar duração</option>
                    <option value="1 ano">1 ano</option>
                    <option value="2 anos">2 anos</option>
                    <option value="3 anos">3 anos</option>
                    <option value="4 anos">4 anos</option>
                    <option value="5 anos">5 anos</option>
                    <option value="6 anos">6 anos</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Configurações */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5 text-green-600" />
                <span>Configurações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Status *
                </label>
                <select
                  value={formData.codigo_Status}
                  onChange={(e) => setFormData({...formData, codigo_Status: parseInt(e.target.value)})}
                  className="w-full h-12 px-4 border border-border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-background text-foreground"
                  required
                >
                  <option value={1}>Ativo</option>
                  <option value={0}>Inativo</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Observações */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-orange-600" />
                <span>Observações</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-foreground mb-2">
                  Descrição do Curso
                </label>
                <textarea
                  value={formData.observacoes}
                  onChange={(e) => setFormData({...formData, observacoes: e.target.value})}
                  rows={4}
                  className="w-full px-4 py-3 border border-border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-background text-foreground"
                  placeholder="Descrição detalhada do curso, objetivos, características especiais..."
                />
              </div>
            </CardContent>
          </Card>
        </form>
      </div>
    </Container>
  );
}
