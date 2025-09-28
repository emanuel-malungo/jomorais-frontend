"use client"

import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Star, AlertTriangle, CheckCircle, Zap } from 'lucide-react'

const SystemStatus: React.FC = () => {
  const statusItems = [
    {
      icon: AlertTriangle,
      title: "3 pagamentos em atraso",
      subtitle: "Requer atenção imediata",
      bgColor: "from-red-50 to-red-100",
      borderColor: "border-red-200/50",
      iconBg: "bg-red-500",
      textColor: "text-red-900",
      subtitleColor: "text-red-700",
      badge: { text: "Urgente", color: "bg-red-500" }
    },
    {
      icon: CheckCircle,
      title: "Sistema atualizado",
      subtitle: "Versão 2.1.0 Pro",
      bgColor: "from-green-50 to-green-100",
      borderColor: "border-green-200/50",
      iconBg: "bg-green-500",
      textColor: "text-green-900",
      subtitleColor: "text-green-700",
      badge: { text: "OK", color: "bg-green-500" }
    },
    {
      icon: Zap,
      title: "Performance",
      subtitle: "Excelente velocidade",
      bgColor: "from-blue-50 to-blue-100",
      borderColor: "border-blue-200/50",
      iconBg: "bg-blue-500",
      textColor: "text-blue-900",
      subtitleColor: "text-blue-700",
      badge: { text: "100%", color: "bg-blue-500" }
    }
  ]

  return (
    <div className="bg-white rounded-2xl border-0 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107]">
          <Star className="h-5 w-5 text-[#182F59]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
      </div>
      <div className="space-y-4">
        {statusItems.map((item, index) => (
          <div 
            key={index}
            className={`flex items-center justify-between p-4 bg-gradient-to-r ${item.bgColor} rounded-xl border ${item.borderColor}`}
          >
            <div className="flex items-center space-x-3">
              <div className={`p-2 rounded-lg ${item.iconBg}`}>
                <item.icon className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className={`text-sm font-semibold ${item.textColor}`}>{item.title}</p>
                <p className={`text-xs ${item.subtitleColor}`}>{item.subtitle}</p>
              </div>
            </div>
            <Badge className={`${item.badge.color} text-white px-2 py-1`}>
              {item.badge.text}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SystemStatus