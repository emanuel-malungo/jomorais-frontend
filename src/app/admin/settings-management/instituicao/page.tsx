"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  School,
  Save,
  Upload,
  MapPin,
  Phone,
  Mail,
  Globe,
  FileText,
  Building,
  Calendar,
} from 'lucide-react';

export default function InstituicaoPage() {
  const [formData, setFormData] = useState({
    nome: "Escola Secundária JoMorais",
    sigla: "ESJM",
    nif: "5417039144",
    endereco: "Rua da Educação, 123",
    bairro: "Maianga",
    cidade: "Luanda",
    provincia: "Luanda",
    telefone: "+244 923 456 789",
    email: "info@jomorais.edu.ao",
    website: "www.jomorais.edu.ao",
    diretor: "Dr. João Morais",
    fundacao: "2010",
    missao: "Formar cidadãos íntegros e competentes para o desenvolvimento de Angola.",
    visao: "Ser uma instituição de referência no ensino secundário em Angola.",
    valores: "Excelência, Integridade, Inovação, Responsabilidade Social"
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
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
                  <School className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">
                    Dados Institucionais
                  </h1>
                  <p className="text-[#F9CD1D] font-semibold text-lg">Informações da Escola</p>
                </div>
              </div>
              <p className="text-gray-600 text-sm max-w-2xl">
                Configure as informações básicas da instituição de ensino, 
                incluindo dados de contato, localização e informações institucionais.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white">
                <Save className="w-4 h-4 mr-2" />
                Salvar Alterações
              </Button>
            </div>
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Informações Básicas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Building className="h-5 w-5" />
              <span>Informações Básicas</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Nome da Instituição
              </label>
              <Input
                value={formData.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                placeholder="Nome completo da escola"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Sigla
                </label>
                <Input
                  value={formData.sigla}
                  onChange={(e) => handleInputChange('sigla', e.target.value)}
                  placeholder="Sigla da escola"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  NIF
                </label>
                <Input
                  value={formData.nif}
                  onChange={(e) => handleInputChange('nif', e.target.value)}
                  placeholder="Número de identificação fiscal"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Diretor Geral
              </label>
              <Input
                value={formData.diretor}
                onChange={(e) => handleInputChange('diretor', e.target.value)}
                placeholder="Nome do diretor"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Ano de Fundação
              </label>
              <Input
                value={formData.fundacao}
                onChange={(e) => handleInputChange('fundacao', e.target.value)}
                placeholder="Ano de fundação"
                type="number"
              />
            </div>

            {/* Upload de Logo */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Logo da Instituição
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Clique para fazer upload do logo</p>
                <p className="text-xs text-gray-500 mt-1">PNG, JPG até 2MB</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Localização e Contato */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Localização e Contato</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Endereço
              </label>
              <Input
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua, número"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Bairro
                </label>
                <Input
                  value={formData.bairro}
                  onChange={(e) => handleInputChange('bairro', e.target.value)}
                  placeholder="Bairro"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 block">
                  Cidade
                </label>
                <Input
                  value={formData.cidade}
                  onChange={(e) => handleInputChange('cidade', e.target.value)}
                  placeholder="Cidade"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Província
              </label>
              <Input
                value={formData.provincia}
                onChange={(e) => handleInputChange('provincia', e.target.value)}
                placeholder="Província"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Phone className="h-4 w-4 inline mr-1" />
                Telefone
              </label>
              <Input
                value={formData.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                placeholder="+244 xxx xxx xxx"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Mail className="h-4 w-4 inline mr-1" />
                Email
              </label>
              <Input
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="email@escola.com"
                type="email"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                <Globe className="h-4 w-4 inline mr-1" />
                Website
              </label>
              <Input
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                placeholder="www.escola.com"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Missão, Visão e Valores */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <FileText className="h-5 w-5" />
            <span>Missão, Visão e Valores</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Missão
            </label>
            <Textarea
              value={formData.missao}
              onChange={(e) => handleInputChange('missao', e.target.value)}
              placeholder="Descreva a missão da instituição"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Visão
            </label>
            <Textarea
              value={formData.visao}
              onChange={(e) => handleInputChange('visao', e.target.value)}
              placeholder="Descreva a visão da instituição"
              rows={3}
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 block">
              Valores
            </label>
            <Textarea
              value={formData.valores}
              onChange={(e) => handleInputChange('valores', e.target.value)}
              placeholder="Liste os valores da instituição"
              rows={3}
            />
          </div>

          <div className="pt-4 border-t">
            <Button className="bg-[#F9CD1D] hover:bg-[#F9CD1D]/90 text-white w-full">
              <Save className="w-4 h-4 mr-2" />
              Salvar Informações Institucionais
            </Button>
          </div>
        </CardContent>
      </Card>
    </Container>
  );
}
