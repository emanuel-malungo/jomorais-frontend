"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { GraduationCap, Users, Download } from 'lucide-react'

interface WelcomeHeaderProps {
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = () => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white border border-gray-200 p-8 mb-8 shadow-sm">
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-[#F9CD1D] rounded-2xl flex items-center justify-center shadow-md">
                <GraduationCap className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900">
                  Bem-vindo ao Dashboard
                </h1>
                <p className="text-[#F9CD1D] font-semibold text-lg">Sistema de Gestão Escolar JoMorais</p>
              </div>
            </div>
            <p className="text-gray-600 text-sm max-w-2xl">
              Gerencie sua instituição de ensino com eficiência. Acompanhe matrículas, finanças,
              desempenho acadêmico e muito mais em um só lugar.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="outline"
              className="border-gray-300 bg-white text-gray-600 hover:bg-gray-50 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <Download className="w-5 h-5 mr-2" />
              Exportar Dados
            </Button>

            <Button
              className="bg-[#F9CD1D] hover:bg-[#F9CD1D] text-white border-0 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
              onClick={() => window.location.href = '/estudantes'}
            >
              <Users className="w-5 h-5 mr-2" />
              Gestão de Alunos
            </Button>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFC506]/5 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-gray-100 rounded-full"></div>
    </div>
  )
}

export default WelcomeHeader