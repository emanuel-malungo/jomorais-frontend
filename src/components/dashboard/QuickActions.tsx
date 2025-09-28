"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Users, GraduationCap, BookOpen, FileText, Zap } from 'lucide-react'

const QuickActions: React.FC = () => {
  const actions = [
    { icon: Users, text: 'Matricular Estudante', href: '/estudantes' },
    { icon: GraduationCap, text: 'Adicionar Professor', href: '/professores' },
    { icon: BookOpen, text: 'Criar Nova Turma', href: '/turmas' },
    { icon: FileText, text: 'Gerar Relatório', href: '/relatorios' }
  ]

  return (
    <div className="bg-gradient-to-br from-[#182F59] to-[#1a3260] rounded-2xl border-0 p-6 shadow-lg">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107]">
          <Zap className="h-5 w-5 text-[#182F59]" />
        </div>
        <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
      </div>
      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button 
            key={index}
            className="w-full justify-start bg-white/10 hover:bg-white/20 text-white border border-white/10 hover:border-[#FFD002]/30 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
          >
            <action.icon className="w-4 h-4 mr-3" />
            {action.text}
          </Button>
        ))}
      </div>
    </div>
  )
}

export default QuickActions