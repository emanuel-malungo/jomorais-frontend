"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import icon from "../../assets/images/icon.png";
import { 
  LogOut, 
  Users, 
  BookOpen, 
  GraduationCap, 
  DollarSign,
  Calendar,
  Bell,
  Menu,
  Award,
  BarChart3,
  ChevronDown,
  Settings,
  Sun,
  Moon,
  X,
  UserCheck
} from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}

export default function AdminLayout({ children, title, description }: AdminLayoutProps) {
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
              <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </Link>

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
                  <Link href="/estudantes" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Estudantes</Link>
                  <Link href="/estudantes/novo" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Matrícula</Link>
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
                  <Link href="/professores" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Professores</Link>
                  <Link href="/professores/novo" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Professor</Link>
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
                  <Link href="/disciplinas" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Disciplinas</Link>
                  <Link href="/disciplinas/nova" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Disciplina</Link>
                  <Link href="/disciplinas/cursos" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Cursos</Link>
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
                  <Link href="/turmas" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Turmas</Link>
                  <Link href="/turmas/nova" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Turma</Link>
                  <Link href="/turmas/classes" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Classes</Link>
                </div>
              </div>

              <Link href="/horarios" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
                <Calendar className="h-5 w-5" />
                <span>Horários</span>
              </Link>

              <Link href="/notas" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
                <Award className="h-5 w-5" />
                <span>Notas</span>
              </Link>

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
                  <Link href="/financeiro/pagamentos" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Pagamentos</Link>
                  <Link href="/financeiro/mensalidades" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Mensalidades</Link>
                  <Link href="/financeiro/relatorios" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Relatórios Financeiros</Link>
                </div>
              </div>
            </nav>
            <div className="pt-4 border-t border-border space-y-2">
              <div className="flex items-center justify-between">
                <Link href="/configuracoes" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
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
            
            <Link href="/admin" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
              <BarChart3 className="h-5 w-5" />
              <span>Dashboard</span>
            </Link>
            
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
                <Link href="/estudantes" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Estudantes</Link>
                <Link href="/estudantes/novo" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Matrícula</Link>
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
                <Link href="/professores" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todos os Professores</Link>
                <Link href="/professores/novo" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Novo Professor</Link>
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
                <Link href="/disciplinas" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Disciplinas</Link>
                <Link href="/disciplinas/nova" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Disciplina</Link>
                <Link href="/disciplinas/cursos" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Cursos</Link>
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
                <Link href="/turmas" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Todas as Turmas</Link>
                <Link href="/turmas/nova" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Nova Turma</Link>
                <Link href="/turmas/classes" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Classes</Link>
              </div>
            </div>
            
            <Link href="/horarios" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
              <Calendar className="h-5 w-5" />
              <span>Horários</span>
            </Link>
            
            <Link href="/notas" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
              <Award className="h-5 w-5" />
              <span>Notas</span>
            </Link>
            
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
                <Link href="/financeiro/pagamentos" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Pagamentos</Link>
                <Link href="/financeiro/mensalidades" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Mensalidades</Link>
                <Link href="/financeiro/relatorios" className="block px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted rounded-lg">Relatórios Financeiros</Link>
              </div>
            </div>
            
            {/* Footer - Settings (desktop) */}
            <div className="pt-4 mt-auto border-t border-border">
              <div className="flex items-center justify-between">
                <Link href="/configuracoes" className="flex items-center space-x-3 px-3 py-2 text-foreground hover:bg-muted rounded-lg">
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
        <main className="flex-1 flex flex-col">
          {/* Page Header - Fixo */}
          <div className="sticky top-16 z-40 bg-background border-b border-border px-6 py-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-foreground mb-1">{title}</h1>
                {description && <p className="text-muted-foreground">{description}</p>}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
