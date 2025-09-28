"use client";

import React, { useState } from 'react';
import Container from '@/components/layout/Container';
import { Button } from '@/components/ui/button';
import { 
  WelcomeHeader,
  StatCard,
  ChartCard,
  RecentActivity,
  SystemStatus
} from '@/components/dashboard';
import { 
  Users, 
  GraduationCap, 
  DollarSign, 
  TrendingUp,
  Clock,
  Target,
  Award,
  Settings
} from 'lucide-react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

// Dados mockados
const enrollmentData = [
  { month: 'Jan', students: 850, teachers: 45, growth: 5.2 },
  { month: 'Fev', students: 890, teachers: 47, growth: 4.7 },
  { month: 'Mar', students: 920, teachers: 48, growth: 3.4 },
  { month: 'Abr', students: 950, teachers: 50, growth: 3.3 },
  { month: 'Mai', students: 980, teachers: 52, growth: 3.2 },
  { month: 'Jun', students: 1020, teachers: 54, growth: 4.1 },
  { month: 'Jul', students: 1050, teachers: 55, growth: 2.9 },
  { month: 'Ago', students: 1080, teachers: 56, growth: 2.9 },
  { month: 'Set', students: 1120, teachers: 58, growth: 3.7 },
];

const revenueData = [
  { month: 'Jan', propinas: 850000, servicos: 120000, total: 970000 },
  { month: 'Fev', propinas: 920000, servicos: 135000, total: 1055000 },
  { month: 'Mar', propinas: 890000, servicos: 140000, total: 1030000 },
  { month: 'Abr', propinas: 1050000, servicos: 155000, total: 1205000 },
  { month: 'Mai', propinas: 1120000, servicos: 160000, total: 1280000 },
  { month: 'Jun', propinas: 980000, servicos: 145000, total: 1125000 },
];

const gradeDistribution = [
  { grade: 'A', count: 145, percentage: 20.7, color: '#10b981' },
  { grade: 'B', count: 230, percentage: 32.9, color: '#06b6d4' },
  { grade: 'C', count: 180, percentage: 25.7, color: '#f59e0b' },
  { grade: 'D', count: 95, percentage: 13.6, color: '#f97316' },
  { grade: 'F', count: 45, percentage: 6.4, color: '#ef4444' },
];

const attendanceData = [
  { day: 'Seg', attendance: 95, students: 1065 },
  { day: 'Ter', attendance: 92, students: 1030 },
  { day: 'Qua', attendance: 88, students: 986 },
  { day: 'Qui', attendance: 94, students: 1053 },
  { day: 'Sex', attendance: 90, students: 1008 },
  { day: 'Sáb', attendance: 85, students: 952 },
];

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  return (
    <Container>
      {/* Welcome Header */}
      <WelcomeHeader 
        selectedPeriod={selectedPeriod}
        setSelectedPeriod={setSelectedPeriod}
      />

      {/* KPI Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total de Estudantes"
          value="1,120"
          change="+8.2%"
          changeType="up"
          icon={Users}
          color="text-[#182F59]"
          bgColor="bg-gradient-to-br from-blue-50 via-white to-blue-50/50"
          accentColor="bg-gradient-to-br from-[#182F59] to-[#1a3260]"
        />
        <StatCard
          title="Professores Ativos"
          value="58"
          change="+3.5%"
          changeType="up"
          icon={GraduationCap}
          color="text-emerald-600"
          bgColor="bg-gradient-to-br from-emerald-50 via-white to-emerald-50/50"
          accentColor="bg-gradient-to-br from-emerald-500 to-green-600"
        />
        <StatCard
          title="Taxa de Aprovação"
          value="87.3%"
          change="+2.1%"
          changeType="up"
          icon={Award}
          color="text-[#FFD002]"
          bgColor="bg-gradient-to-br from-amber-50 via-white to-yellow-50/50"
          accentColor="bg-gradient-to-br from-[#FFD002] to-[#FFC107]"
        />
        <StatCard
          title="Receita Mensal"
          value="1.28M Kz"
          change="+12.5%"
          changeType="up"
          icon={DollarSign}
          color="text-purple-600"
          bgColor="bg-gradient-to-br from-purple-50 via-white to-purple-50/50"
          accentColor="bg-gradient-to-br from-purple-500 to-purple-600"
        />
      </div>

      {/* Charts principais */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        {/* Evolução de matrículas */}
        <div className="xl:col-span-2">
          <ChartCard 
            title="Evolução de Matrículas" 
            icon={TrendingUp}
            action={
              <Button variant="outline" size="sm" className="border-gray-200 hover:bg-gray-50">
                <Settings className="w-4 h-4" />
              </Button>
            }
          >
            <ResponsiveContainer width="100%" height={320}>
              <AreaChart data={enrollmentData}>
                <defs>
                  <linearGradient id="studentsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="teachersGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
                <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', 
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    backdropFilter: 'blur(10px)'
                  }} 
                />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3b82f6" 
                  strokeWidth={3}
                  fill="url(#studentsGradient)"
                  name="Estudantes"
                />
                <Area 
                  type="monotone" 
                  dataKey="teachers" 
                  stroke="#10b981" 
                  strokeWidth={3}
                  fill="url(#teachersGradient)"
                  name="Professores"
                />
              </AreaChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Distribuição de notas */}
        <ChartCard title="Distribuição de Notas" icon={Target}>
          <ResponsiveContainer width="100%" height={320}>
            <PieChart>
              <Pie
                data={gradeDistribution}
                cx="50%"
                cy="50%"
                outerRadius={100}
                innerRadius={60}
                paddingAngle={2}
                dataKey="count"
              >
                {gradeDistribution.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value, name, props) => [
                  `${value} alunos (${props.payload.percentage}%)`, 
                  `Nota ${props.payload.grade}`
                ]}
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-wrap justify-center gap-2 mt-4">
            {gradeDistribution.map((item) => (
              <div key={item.grade} className="flex items-center space-x-2">
                <div 
                  className={`w-3 h-3 rounded-full ${
                    item.grade === 'A' ? 'bg-emerald-500' :
                    item.grade === 'B' ? 'bg-cyan-500' :
                    item.grade === 'C' ? 'bg-amber-500' :
                    item.grade === 'D' ? 'bg-orange-500' :
                    'bg-red-500'
                  }`}
                ></div>
                <span className="text-xs font-medium text-gray-600">
                  {item.grade}: {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* Seção de receitas e presença */}
       <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-10">
        <div className="xl:col-span-2">
        {/* Receitas */}
        <ChartCard title="Receitas Mensais" icon={DollarSign}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={revenueData} barGap={10}>
              <defs>
                <linearGradient id="propinasBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.2}/>
                </linearGradient>
                <linearGradient id="servicosBar" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="month" stroke="#64748b" fontSize={12} fontWeight={500} />
              <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
                formatter={(value) => [new Intl.NumberFormat('pt-AO').format(Number(value)) + ' Kz', '']}
              />
              <Bar dataKey="propinas" fill="url(#propinasBar)" name="Propinas" radius={[6, 6, 0, 0]} />
              <Bar dataKey="servicos" fill="url(#servicosBar)" name="Serviços" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        </div>

        {/* Taxa de presença */}
        <ChartCard title="Taxa de Presença Semanal" icon={Clock}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={attendanceData}>
              <defs>
                <linearGradient id="attendanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="day" stroke="#64748b" fontSize={12} fontWeight={500} />
              <YAxis stroke="#64748b" fontSize={12} fontWeight={500} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: 'rgba(255, 255, 255, 0.95)',
                  border: '1px solid #e2e8f0',
                  borderRadius: '12px'
                }}
                formatter={(value, name) => [
                  name === 'attendance' ? `${value}%` : `${value} alunos`,
                  name === 'attendance' ? 'Presença' : 'Total de Alunos'
                ]}
              />
              <Area 
                type="monotone" 
                dataKey="attendance" 
                stroke="#f59e0b" 
                fill="url(#attendanceGradient)"
                strokeWidth={0}
              />
              <Line 
                type="monotone" 
                dataKey="attendance" 
                stroke="#f59e0b" 
                strokeWidth={4}
                dot={{ fill: '#f59e0b', strokeWidth: 0, r: 6 }}
                activeDot={{ r: 8, fill: '#f59e0b', strokeWidth: 0 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Seção final com ações e atividades */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <RecentActivity />
        <SystemStatus />
      </div>
    </Container>
  );
}