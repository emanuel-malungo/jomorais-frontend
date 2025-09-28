"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { GraduationCap, Download } from 'lucide-react'

interface WelcomeHeaderProps {
  selectedPeriod: string
  setSelectedPeriod: (period: string) => void
}

const WelcomeHeader: React.FC<WelcomeHeaderProps> = ({ 
  selectedPeriod, 
  setSelectedPeriod 
}) => {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#182F59] via-[#1a3260] to-[#182F59] p-8 mb-8">
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD002]/10 via-transparent to-[#FFD002]/5"></div>
      <div className="relative z-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="h-16 w-16 bg-gradient-to-br from-[#FFD002] to-[#FFC107] rounded-2xl flex items-center justify-center shadow-xl">
                <GraduationCap className="h-8 w-8 text-[#182F59]" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white">
                  Bem-vindo ao Dashboard
                </h1>
                <p className="text-[#FFD002] font-semibold text-lg">Sistema de Gestão Escolar JoMorais</p>
              </div>
            </div>
            <p className="text-white/80 text-sm max-w-2xl">
              Gerencie sua instituição de ensino com eficiência. Acompanhe matrículas, finanças, 
              desempenho acadêmico e muito mais em um só lugar.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              title="Selecionar período"
              className="px-4 py-3 rounded-xl border-0 bg-white/10 backdrop-blur-sm font-medium text-white focus:ring-2 focus:ring-[#FFD002] focus:outline-none appearance-none cursor-pointer"
            >
              <option value="day" className="text-gray-900">Hoje</option>
              <option value="week" className="text-gray-900">Esta Semana</option>
              <option value="month" className="text-gray-900">Este Mês</option>
              <option value="year" className="text-gray-900">Este Ano</option>
            </select>
            
            <Button className="bg-gradient-to-r from-[#FFD002] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFD002] text-[#182F59] border-0 px-6 py-3 rounded-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl">
              <Download className="w-5 h-5 mr-2" />
              Exportar Dados
            </Button>
          </div>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute -top-16 -right-16 w-32 h-32 bg-[#FFD002]/10 rounded-full"></div>
      <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#FFD002]/5 rounded-full"></div>
    </div>
  )
}

export default WelcomeHeader