"use client";

import React, { useState, useEffect } from 'react';
import Container from '@/components/layout/Container';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  GraduationCap, 
  BookOpen, 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  FileText,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Activity,
  Zap,
  Star,
  Award,
  Settings,
  Download
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

const StatCard = ({ title, value, change, changeType, icon: Icon, color, bgColor, accentColor }) => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  return (
    <div 
      className={`relative overflow-hidden rounded-2xl ${bgColor} border border-gray-100 p-6 transition-all duration-300 hover:scale-105 hover:shadow-lg ${animate ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} shadow-sm`}
      style={{ transitionDelay: Math.random() * 200 + 'ms' }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${accentColor} shadow-sm`}>
          <Icon className={`h-6 w-6 text-white`} />
        </div>
        <div className="flex items-center space-x-1 text-sm bg-white/60 backdrop-blur-sm px-3 py-1.5 rounded-full">
          {changeType === 'up' ? (
            <TrendingUp className="h-3 w-3 text-emerald-500" />
          ) : changeType === 'down' ? (
            <TrendingDown className="h-3 w-3 text-red-500" />
          ) : (
            <Activity className="h-3 w-3 text-blue-500" />
          )}
          <span className={`font-bold text-xs ${
            changeType === 'up' ? 'text-emerald-600' : 
            changeType === 'down' ? 'text-red-600' : 'text-blue-600'
          }`}>
            {change}
          </span>
        </div>
      </div>
      <div>
        <p className={`text-sm font-semibold mb-2 ${color.replace('text-', 'text-')}`}>{title}</p>
        <p className="text-3xl font-bold text-gray-900">{value}</p>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-white/20 rounded-full -translate-y-10 translate-x-10"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full translate-y-8 -translate-x-8"></div>
    </div>
  );
};

const ChartCard = ({ title, children, icon: Icon, action }) => (
  <div className="bg-white rounded-2xl border-0 p-6 backdrop-blur-sm bg-gradient-to-br from-white to-gray-50/50 shadow-sm hover:shadow-md transition-all duration-200">
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-3">
        <div className="p-3 rounded-xl bg-gradient-to-br from-[#182F59]/10 to-[#1a3260]/5">
          <Icon className="h-5 w-5 text-[#182F59]" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
      </div>
      {action && action}
    </div>
    {children}
  </div>
);

const ActivityItem = ({ icon: Icon, title, time, type = 'default' }) => {
  const colors = {
    success: 'from-emerald-500 to-green-600',
    warning: 'from-amber-500 to-yellow-600',
    info: 'from-blue-500 to-indigo-600',
    default: 'from-gray-400 to-gray-600'
  };

  return (
    <div className="flex items-center space-x-4 p-3 rounded-xl hover:bg-gray-50 transition-colors">
      <div className={`p-2 rounded-lg bg-gradient-to-br ${colors[type]}`}>
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{title}</p>
        <p className="text-xs text-gray-500">{time}</p>
      </div>
    </div>
  );
};

export default function Dashboard() {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  
  return (
    <Container>
  
        {/* Welcome Header */}
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

        {/* KPI Cards modernos */}
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

        {/* Cards de métricas adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600">
                <BookOpen className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">HOJE</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Disciplinas Ativas</p>
              <p className="text-2xl font-bold text-gray-900">45</p>
              <p className="text-xs text-green-600 font-medium mt-1">+2 novas este mês</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-pink-500 to-rose-600">
                <Calendar className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">SEMANA</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Aulas Ministradas</p>
              <p className="text-2xl font-bold text-gray-900">312</p>
              <p className="text-xs text-blue-600 font-medium mt-1">98% de presença</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600">
                <Target className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">MÊS</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Avaliações</p>
              <p className="text-2xl font-bold text-gray-900">89</p>
              <p className="text-xs text-purple-600 font-medium mt-1">16 pendentes</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 rounded-xl bg-gradient-to-br from-orange-500 to-red-600">
                <Clock className="h-5 w-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-full">HOJE</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-600 mb-1">Horas Letivas</p>
              <p className="text-2xl font-bold text-gray-900">8.5h</p>
              <p className="text-xs text-emerald-600 font-medium mt-1">Meta: 8h diárias</p>
            </div>
          </div>
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
          <ChartCard title="Distribuição de Notas" icon={Target} action={null}>
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
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mb-10">
          {/* Receitas */}
          <ChartCard title="Receitas Mensais" icon={DollarSign} action={null}>
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

          {/* Taxa de presença */}
          <ChartCard title="Taxa de Presença Semanal" icon={Clock} action={null}>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Ações rápidas */}
          <div className="bg-gradient-to-br from-[#182F59] to-[#1a3260] rounded-2xl border-0 p-6 shadow-lg">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107]">
                <Zap className="h-5 w-5 text-[#182F59]" />
              </div>
              <h3 className="text-lg font-semibold text-white">Ações Rápidas</h3>
            </div>
            <div className="space-y-3">
              {[
                { icon: Users, text: 'Matricular Estudante', href: '/estudantes' },
                { icon: GraduationCap, text: 'Adicionar Professor', href: '/professores' },
                { icon: BookOpen, text: 'Criar Nova Turma', href: '/turmas' },
                { icon: FileText, text: 'Gerar Relatório', href: '/relatorios' }
              ].map((action, index) => (
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

          {/* Atividade recente */}
          <div className="bg-white rounded-2xl border-0 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-emerald-500 to-green-600">
                <Activity className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Atividades Recentes</h3>
            </div>
            <div className="space-y-2">
              <ActivityItem 
                icon={Users} 
                title="5 novos estudantes matriculados" 
                time="Há 2 horas" 
                type="success" 
              />
              <ActivityItem 
                icon={DollarSign} 
                title="Pagamento de propinas processado" 
                time="Há 4 horas" 
                type="info" 
              />
              <ActivityItem 
                icon={FileText} 
                title="Boletins da 9ª classe publicados" 
                time="Ontem" 
                type="default" 
              />
              <ActivityItem 
                icon={GraduationCap} 
                title="2 novos professores adicionados" 
                time="2 dias atrás" 
                type="success" 
              />
            </div>
          </div>

          {/* Status do sistema */}
          <div className="bg-white rounded-2xl border-0 p-6 shadow-sm hover:shadow-md transition-all duration-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-3 rounded-xl bg-gradient-to-br from-[#FFD002] to-[#FFC107]">
                <Star className="h-5 w-5 text-[#182F59]" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900">Status do Sistema</h3>
            </div>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-red-100 rounded-xl border border-red-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-red-500">
                    <AlertTriangle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-red-900">3 pagamentos em atraso</p>
                    <p className="text-xs text-red-700">Requer atenção imediata</p>
                  </div>
                </div>
                <Badge className="bg-red-500 text-white px-2 py-1">Urgente</Badge>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-xl border border-green-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-green-500">
                    <CheckCircle className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-green-900">Sistema atualizado</p>
                    <p className="text-xs text-green-700">Versão 2.1.0 Pro</p>
                  </div>
                </div>
                <Badge className="bg-green-500 text-white px-2 py-1">OK</Badge>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-xl border border-blue-200/50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-lg bg-blue-500">
                    <Zap className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-blue-900">Performance</p>
                    <p className="text-xs text-blue-700">Excelente velocidade</p>
                  </div>
                </div>
                <Badge className="bg-blue-500 text-white px-2 py-1">100%</Badge>
              </div>
            </div>
          </div>
        </div>
   
	</Container>
  );
}