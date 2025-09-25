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
  Moon,
  X
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

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
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);
  // Mock data for the enrollments chart (two years)
  const enrollmentData2024: { label: string; value: number }[] = [
    { label: 'Jan', value: 120 },
    { label: 'Fev', value: 180 },
    { label: 'Mar', value: 220 },
    { label: 'Abr', value: 200 },
    { label: 'Mai', value: 260 },
    { label: 'Jun', value: 240 },
    { label: 'Jul', value: 150 },
    { label: 'Ago', value: 300 },
    { label: 'Set', value: 280 },
    { label: 'Out', value: 320 },
    { label: 'Nov', value: 290 },
    { label: 'Dez', value: 210 },
  ];
  const enrollmentData2023: { label: string; value: number }[] = [
    { label: 'Jan', value: 90 },
    { label: 'Fev', value: 140 },
    { label: 'Mar', value: 180 },
    { label: 'Abr', value: 160 },
    { label: 'Mai', value: 200 },
    { label: 'Jun', value: 210 },
    { label: 'Jul', value: 120 },
    { label: 'Ago', value: 240 },
    { label: 'Set', value: 220 },
    { label: 'Out', value: 260 },
    { label: 'Nov', value: 230 },
    { label: 'Dez', value: 180 },
  ];
  const [chartYear, setChartYear] = useState<'2024' | '2023'>('2024');
  const chartData = chartYear === '2024' ? enrollmentData2024 : enrollmentData2023;
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
              <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setMobileOpen(true)}>
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
              <div className="hidden lg:flex items-center space-x-2">
               
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-[#2d5016] rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-semibold">A</span>
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-medium text-foreground">Admin</p>
                  <p className="text-xs text-muted-foreground">Administrador</p>
                </div>
              </div>
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
              <Button variant="ghost" size="sm" className="relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">3</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setMobileOpen(false)} />
          <div className="fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border p-4 lg:hidden flex flex-col">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 relative">
                  <Image src={icon} alt="Jomorais Logo" fill className="object-contain" />
                </div>
                <span className="font-bold text-foreground">JOMORAIS</span>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setMobileOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <nav className="space-y-2 overflow-y-auto flex-1" role="navigation" aria-label="Menu lateral mobile">
              <a href="#" aria-current="page" className="flex items-center space-x-3 px-3 py-2 bg-[#2d5016] text-white rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </a>

              <div>
                <button
                  onClick={() => toggleMenu('students')}
                  className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                  aria-expanded={openMenus.students}
                  aria-controls="m-submenu-students"
                >
                  <Users className="h-5 w-5" />
                  <span className="ml-3">Estudantes</span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.students ? 'rotate-180' : ''}`} />
                </button>
                <div id="m-submenu-students" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.students ? 'max-h-40' : 'max-h-0'}`}>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Estudantes</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Estudante</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Matrículas</Link>
                </div>
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('teachers')}
                  className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                  aria-expanded={openMenus.teachers}
                  aria-controls="m-submenu-teachers"
                >
                  <UserCheck className="h-5 w-5" />
                  <span className="ml-3">Professores</span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.teachers ? 'rotate-180' : ''}`} />
                </button>
                <div id="m-submenu-teachers" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.teachers ? 'max-h-40' : 'max-h-0'}`}>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Professores</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Professor</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Alocações</Link>
                </div>
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('subjects')}
                  className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                  aria-expanded={openMenus.subjects}
                  aria-controls="m-submenu-subjects"
                >
                  <BookOpen className="h-5 w-5" />
                  <span className="ml-3">Disciplinas</span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.subjects ? 'rotate-180' : ''}`} />
                </button>
                <div id="m-submenu-subjects" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.subjects ? 'max-h-40' : 'max-h-0'}`}>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Disciplinas</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Disciplina</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Currículo</Link>
                </div>
              </div>

              <div>
                <button
                  onClick={() => toggleMenu('classes')}
                  className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                  aria-expanded={openMenus.classes}
                  aria-controls="m-submenu-classes"
                >
                  <GraduationCap className="h-5 w-5" />
                  <span className="ml-3">Turmas</span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.classes ? 'rotate-180' : ''}`} />
                </button>
                <div id="m-submenu-classes" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.classes ? 'max-h-40' : 'max-h-0'}`}>
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
                  aria-expanded={openMenus.finance}
                  aria-controls="m-submenu-finance"
                >
                  <DollarSign className="h-5 w-5" />
                  <span className="ml-3">Financeiro</span>
                  <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.finance ? 'rotate-180' : ''}`} />
                </button>
                <div id="m-submenu-finance" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.finance ? 'max-h-40' : 'max-h-0'}`}>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Pagamentos</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Mensalidades</Link>
                  <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Relatórios Financeiros</Link>
                </div>
              </div>
            </nav>
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <Button variant="ghost" size="sm" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Ativar tema claro' : 'Ativar tema escuro'} title={theme === 'dark' ? 'Tema claro' : 'Tema escuro'}>
                  {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>
                <Link href="/landing">
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                    <span className="ml-2">Sair</span>
                  </Button>
                </Link>
              </div>              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
                <Link href="/landing">
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden lg:block w-64 bg-card shadow-sm sticky top-16 h-[calc(100vh-4rem)] border-r border-border overflow-y-auto">
          <nav className="p-4 space-y-2 flex h-full flex-col" role="navigation" aria-label="Menu lateral">
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Menu Principal</h3>
            </div>
            
            <a href="#" aria-current="page" className="flex items-center space-x-3 px-3 py-2 bg-[#2d5016] text-white rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </a>
            
            <div>
              <button
                onClick={() => toggleMenu('students')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                aria-expanded={openMenus.students}
                aria-controls="submenu-students"
              >
                <Users className="h-5 w-5" />
                <span className="ml-3">Estudantes</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.students ? 'rotate-180' : ''}`} />
              </button>
              <div id="submenu-students" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.students ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Estudantes</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Estudante</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Matrículas</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('teachers')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                aria-expanded={openMenus.teachers}
                aria-controls="submenu-teachers"
              >
                <UserCheck className="h-5 w-5" />
                <span className="ml-3">Professores</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.teachers ? 'rotate-180' : ''}`} />
              </button>
              <div id="submenu-teachers" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.teachers ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Professores</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Professor</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Alocações</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('subjects')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                aria-expanded={openMenus.subjects}
                aria-controls="submenu-subjects"
              >
                <BookOpen className="h-5 w-5" />
                <span className="ml-3">Disciplinas</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.subjects ? 'rotate-180' : ''}`} />
              </button>
              <div id="submenu-subjects" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.subjects ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Disciplinas</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Disciplina</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Currículo</Link>
              </div>
            </div>
            
            <div>
              <button
                onClick={() => toggleMenu('classes')}
                className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-lg"
                aria-expanded={openMenus.classes}
                aria-controls="submenu-classes"
              >
                <GraduationCap className="h-5 w-5" />
                <span className="ml-3">Turmas</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.classes ? 'rotate-180' : ''}`} />
              </button>
              <div id="submenu-classes" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.classes ? 'max-h-40' : 'max-h-0'}`}>
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
                aria-expanded={openMenus.finance}
                aria-controls="submenu-finance"
              >
                <DollarSign className="h-5 w-5" />
                <span className="ml-3">Financeiro</span>
                <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-transform ${openMenus.finance ? 'rotate-180' : ''}`} />
              </button>
              <div id="submenu-finance" className={`pl-11 mt-1 space-y-1 overflow-hidden transition-all ${openMenus.finance ? 'max-h-40' : 'max-h-0'}`}>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Pagamentos</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Mensalidades</Link>
                <Link href="#" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Relatórios Financeiros</Link>
              </div>
            </div>            {/* Footer - Settings (desktop) */}
            <div className="pt-4 mt-auto border-t border-border">              <div className="flex items-center justify-between">
                <Link href="#" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
                  <Settings className="h-5 w-5" />
                  <span>Configurações</span>
                </Link>
                <Link href="/landing">
                  <Button variant="ghost" size="sm">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </Link>
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

          {/* Enhanced Summary */}
          <div className="bg-gradient-to-br from-card to-card/50 rounded-xl shadow-lg p-8 border border-border mb-8 backdrop-blur-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">Resumo Mensal</h3>
                <p className="text-sm text-muted-foreground">Indicadores de desempenho da escola</p>
              </div>
              <div className="p-3 bg-primary/10 rounded-full">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pagamentos */}
              <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <CreditCard className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Pagamentos</p>
                      <p className="text-xs text-muted-foreground">Este mês</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-green-600">68%</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-green-500 to-green-600 rounded-full transition-all duration-500" style={{ width: "68%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>1,938 de 2,847 alunos</span>
                    <span>+5% vs anterior</span>
                  </div>
                </div>
              </div>

              {/* Ocupação das turmas */}
              <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Users className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Ocupação</p>
                      <p className="text-xs text-muted-foreground">Das turmas</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-blue-600">82%</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500" style={{ width: "82%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>41 de 50 turmas</span>
                    <span>+3% vs anterior</span>
                  </div>
                </div>
              </div>

              {/* Lançamentos de notas */}
              <div className="bg-card/80 rounded-lg p-5 border border-border/50 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Award className="h-5 w-5 text-orange-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Notas</p>
                      <p className="text-xs text-muted-foreground">Lançadas</p>
                    </div>
                  </div>
                  <span className="text-lg font-bold text-orange-600">54%</span>
                </div>
                <div className="space-y-2">
                  <div className="h-3 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-orange-500 to-orange-600 rounded-full transition-all duration-500" style={{ width: "54%" }}></div>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>153 de 284 disciplinas</span>
                    <span>-2% vs anterior</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick insights */}
            <div className="mt-6 pt-6 border-t border-border/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="p-1 bg-green-500 rounded-full">
                    <TrendingUp className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-green-800">Meta de pagamentos atingida</p>
                    <p className="text-xs text-green-600">68% supera a meta de 65%</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="p-1 bg-orange-500 rounded-full">
                    <Clock className="h-3 w-3 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-orange-800">Atenção: Lançamento de notas</p>
                    <p className="text-xs text-orange-600">46% das disciplinas pendentes</p>
                  </div>
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
                  <Button variant={chartYear === '2024' ? 'default' : 'outline'} size="sm" onClick={() => setChartYear('2024')}>2024</Button>
                  <Button variant={chartYear === '2023' ? 'default' : 'outline'} size="sm" onClick={() => setChartYear('2023')}>2023</Button>
                </div>
              </div>
              <div className="h-80 bg-muted rounded-lg p-2 sm:p-4">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid stroke="var(--border)" strokeDasharray="3 3" />
                    <XAxis dataKey="label" tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} />
                    <YAxis tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} axisLine={{ stroke: 'var(--border)' }} tickLine={{ stroke: 'var(--border)' }} />
                    <Tooltip contentStyle={{ background: 'var(--card)', border: '1px solid var(--border)', color: 'var(--foreground)' }} />
                    <Legend />
                    <Area type="monotone" dataKey="value" name="Matrículas" stroke="var(--accent-yellow)" fill="var(--accent-yellow)" fillOpacity={0.35} strokeWidth={2} />
                  </AreaChart>
                </ResponsiveContainer>
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
        </main>
      </div>
    </div>
  );
}