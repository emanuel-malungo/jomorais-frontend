"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import icon from "../../assets/images/icon.png";
import { 
  LogOut, 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign,
  Calendar,
  Bell,
  Search,
  Menu,
  TrendingUp,
  UserCheck,
  Clock,
  Award,
  BarChart3,
  PieChart,
  ChevronDown,
  ChevronRight,
  Plus,
  List,
  Edit,
  Eye,
  FileText,
  CreditCard,
  Settings,
  Sun,
  Moon
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function AdminPage() {
  type Theme = 'light' | 'dark';
  type MenuKey = 'students' | 'teachers' | 'subjects' | 'classes' | 'finance';
  const [theme, setTheme] = useState<Theme>('light');
  const [openMenus, setOpenMenus] = useState<Record<MenuKey, boolean>>({
    students: false,
    teachers: false,
    subjects: false,
    classes: false,
    finance: false,
  });
  useEffect(() => {
    try {
      const saved = typeof window !== 'undefined' ? localStorage.getItem('theme') : null;
      const isDark = saved ? saved === 'dark' : false;
      if (isDark) {
        document.documentElement.classList.add('dark');
        setTheme('dark');
      } else {
        document.documentElement.classList.remove('dark');
        setTheme('light');
      }
    } catch {}
  }, []);
  const toggleTheme = () => {
    setTheme((prev) => {
      const next = prev === 'dark' ? 'light' : 'dark';
      if (next === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      try {
        localStorage.setItem('theme', next);
      } catch {}
      return next;
    });
  };
  const toggleMenu = (key: MenuKey) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };
  return (
    <div className="min-h-screen bg-background">
      {/* Top Header */}
      <header className="sticky top-0 z-50 bg-card shadow-sm border-b border-border">
        <div className="px-6">
          <div className="flex justify-between items-center h-16">
            {/* Left side - Logo and Menu */}
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="lg:hidden">
                <Menu className="h-5 w-5" />
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative">
                  <Image
                    src={icon}
                    alt="Jomorais Logo"
                    fill
                    className="object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">JOMORAIS</h1>
                  <p className="text-xs text-muted-foreground">School Management</p>
                </div>
              </div>
            </div>

            {/* Right side - Search and User */}
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 pr-4 h-9 text-sm"
                />
              </div>
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'}
                title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}
              >
                {theme === 'dark' ? (
                  <Sun className="h-5 w-5" />
                ) : (
                  <Moon className="h-5 w-5" />
                )}
              </Button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#2d5016] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
              </div>
              <Link href="/landing">
                <Button variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-card shadow-sm sticky top-16 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-2">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu Principal</h3>
            </div>
            
            <a href="#" className="flex items-center space-x-3 px-3 py-2 bg-[#2d5016] text-white rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            
            <div>
              <button
                onClick={() => toggleMenu('students')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
              >
                <Users className="h-5 w-5" />
                <span className="ml-3">Estudantes</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.students ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.students ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Estudantes</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Estudante</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Matrículas</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('teachers')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
              >
                <UserCheck className="h-5 w-5" />
                <span className="ml-3">Professores</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.teachers ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.teachers ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Professores</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Professor</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Alocações</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('subjects')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
              >
                <BookOpen className="h-5 w-5" />
                <span className="ml-3">Disciplinas</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.subjects ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.subjects ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Disciplinas</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Disciplina</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Currículo</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('classes')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
              >
                <GraduationCap className="h-5 w-5" />
                <span className="ml-3">Turmas</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.classes ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.classes ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Turmas</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Turma</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Alunos por Turma</Link>
              </div>
            </div>
            
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Horários</span>
            </a>
            
            <a href="#" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
              <Award className="h-5 w-5" />
              <span>Notas</span>
            </a>
            
            <div>
              <button
                onClick={() => toggleMenu('finance')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
              >
                <DollarSign className="h-5 w-5" />
                <span className="ml-3">Financeiro</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.finance ? 'rotate-180' : ''}`} />
              </button>
              <div className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.finance ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Pagamentos</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Mensalidades</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Relatórios Financeiros</Link>
              </div>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-foreground mb-2">Dashboard</h1>
            <p className="text-muted-foreground">Bem-vindo de volta! Aqui está o que está acontecendo na sua escola hoje.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Estudantes</p>
                  <p className="text-3xl font-bold text-foreground mt-2">2,847</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+12%</span>
                    <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Professores</p>
                  <p className="text-3xl font-bold text-foreground mt-2">284</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+5%</span>
                    <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className="p-3 bg-[#2d5016]/10 rounded-full">
                  <UserCheck className="h-8 w-8 text-[#2d5016]" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Receita Mensal</p>
                  <p className="text-3xl font-bold text-foreground mt-2">Kz 45,280</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600 font-medium">+8%</span>
                    <span className="text-sm text-muted-foreground ml-1">vs mês anterior</span>
                  </div>
                </div>
                <div className="p-3 bg-[#FFD700]/20 rounded-full">
                  <DollarSign className="h-8 w-8 text-[#FFA500]" />
                </div>
              </div>
            </div>

            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Presença Hoje</p>
                  <p className="text-3xl font-bold text-foreground mt-2">94.2%</p>
                  <div className="flex items-center mt-2">
                    <Clock className="h-4 w-4 text-blue-500 mr-1" />
                    <span className="text-sm text-blue-600 font-medium">2,683</span>
                    <span className="text-sm text-muted-foreground ml-1">presentes</span>
                  </div>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <UserCheck className="h-8 w-8 text-green-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts and Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Chart */}
            <div className="lg:col-span-2 bg-card rounded-xl shadow-sm p-6 border border-border">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-foreground">Matrículas por Mês</h3>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">2024</Button>
                  <Button variant="outline" size="sm">2023</Button>
                </div>
              </div>
              <div className="h-80 flex items-center justify-center bg-muted rounded-lg">
                <div className="text-center">
                  <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">Gráfico de Matrículas</p>
                  <p className="text-sm text-muted-foreground">Dados em tempo real</p>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
              <h3 className="text-lg font-semibold text-foreground mb-6">Atividades Recentes</h3>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Nova matrícula</p>
                    <p className="text-xs text-muted-foreground">João Silva se matriculou na turma 10A</p>
                    <p className="text-xs text-muted-foreground">2 min atrás</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Pagamento recebido</p>
                    <p className="text-xs text-muted-foreground">Maria Santos - Mensalidade Março</p>
                    <p className="text-xs text-muted-foreground">15 min atrás</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Novo professor</p>
                    <p className="text-xs text-muted-foreground">Prof. Ana Costa adicionada ao sistema</p>
                    <p className="text-xs text-muted-foreground">1 hora atrás</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Falta registrada</p>
                    <p className="text-xs text-muted-foreground">Pedro Oliveira - Matemática</p>
                    <p className="text-xs text-muted-foreground">2 horas atrás</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Evento criado</p>
                    <p className="text-xs text-muted-foreground">Reunião de pais - 25 de Março</p>
                    <p className="text-xs text-muted-foreground">3 horas atrás</p>
                  </div>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-4" size="sm">
                Ver todas atividades
              </Button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card rounded-xl shadow-sm p-6 border border-border">
            <h3 className="text-lg font-semibold text-foreground mb-6">Ações Rápidas</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <Button className="flex flex-col items-center p-4 h-auto bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200">
                <Users className="h-6 w-6 mb-2" />
                <span className="text-sm">Novo Aluno</span>
              </Button>
              
              <Button className="flex flex-col items-center p-4 h-auto bg-green-50 hover:bg-green-100 text-green-700 border border-green-200">
                <UserCheck className="h-6 w-6 mb-2" />
                <span className="text-sm">Novo Professor</span>
              </Button>
              
              <Button className="flex flex-col items-center p-4 h-auto bg-purple-50 hover:bg-purple-100 text-purple-700 border border-purple-200">
                <BookOpen className="h-6 w-6 mb-2" />
                <span className="text-sm">Nova Disciplina</span>
              </Button>
              
              <Button className="flex flex-col items-center p-4 h-auto bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-200">
                <GraduationCap className="h-6 w-6 mb-2" />
                <span className="text-sm">Nova Turma</span>
              </Button>
              
              <Button className="flex flex-col items-center p-4 h-auto bg-red-50 hover:bg-red-100 text-red-700 border border-red-200">
                <Calendar className="h-6 w-6 mb-2" />
                <span className="text-sm">Evento</span>
              </Button>
              
              <Button className="flex flex-col items-center p-4 h-auto bg-yellow-50 hover:bg-yellow-100 text-yellow-700 border border-yellow-200">
                <Award className="h-6 w-6 mb-2" />
                <span className="text-sm">Lançar Notas</span>
              </Button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}