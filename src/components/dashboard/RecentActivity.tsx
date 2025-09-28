"use client"

import React from 'react'
import { Activity, Users, DollarSign, FileText, GraduationCap } from 'lucide-react'
import ActivityItem from './ActivityItem'

const RecentActivity: React.FC = () => {
  const activities = [
    { 
      icon: Users, 
      title: "5 novos estudantes matriculados", 
      time: "Há 2 horas", 
      type: "success" as const
    },
    { 
      icon: DollarSign, 
      title: "Pagamento de propinas processado", 
      time: "Há 4 horas", 
      type: "info" as const
    },
    { 
      icon: FileText, 
      title: "Boletins da 9ª classe publicados", 
      time: "Ontem", 
      type: "default" as const
    },
    { 
      icon: GraduationCap, 
      title: "2 novos professores adicionados", 
      time: "2 dias atrás", 
      type: "success" as const
    }
  ]

  return (
    <div className="bg-white rounded-2xl border-0 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
          <Activity className="h-5 w-5 text-white" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
      </div>
      <div className="space-y-2">
        {activities.map((activity, index) => (
          <ActivityItem 
            key={index}
            icon={activity.icon}
            title={activity.title}
            time={activity.time}
            type={activity.type}
          />
        ))}
      </div>
    </div>
  )
}

export default RecentActivity