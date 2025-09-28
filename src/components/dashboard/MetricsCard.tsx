"use client"

import React from 'react'
import { LucideIcon } from 'lucide-react'

interface MetricsCardProps {
  title: string
  value: string
  subtitle: string
  icon: LucideIcon
  iconColor: string
  period: string
}

const MetricsCard: React.FC<MetricsCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  iconColor,
  period
}) => {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
          {period}
        </span>
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-600 mb-1">{title}</p>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-600 font-medium mt-1">{subtitle}</p>
      </div>
    </div>
  )
}

export default MetricsCard