"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import icon from "@/assets/images/icon.png"

import { 
  ChevronRight,
  Home,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  UserCheck,
  DollarSign,
  FileText,
  Settings,
  BarChart3,
  School,
  MapPin,
  Wallet,
  Shield,
  Sparkles,
  LogOut,
  Monitor,
  Building,
  Globe,
  UserCog,
  TrendingUp,
} from "lucide-react"

export interface MenuItem {
  title: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  badge?: string
  children?: MenuItem[]
}

const menuItems: MenuItem[] = [
  {
    title: "Dashboard",
    icon: Home,
    href: "/admin"
  },
  {
    title: "Gestão de Alunos",
    icon: Users,
    children: [
      { title: "Alunos", icon: Users, href: "/admin/student-management/student" },
      { title: "Matrículas", icon: GraduationCap, href: "/admin/student-management/enrolls" },
      { title: "Confirmações", icon: UserCheck, href: "/admin/student-management/confirmations" },
      { title: "Transferências", icon: FileText, href: "/admin/student-management/transfers" }
    ]
  },
  {
    title: "Gestão Acadêmica",
    icon: BookOpen,
    children: [
      { title: "Cursos", icon: School, href: "/admin/academic-management/course" },
      { title: "Disciplinas", icon: BookOpen, href: "/admin/academic-management/discipline" },
      { title: "Classes", icon: GraduationCap, href: "/admin/academic-management/classes" },
      { title: "Turmas", icon: School, href: "/admin/academic-management/turmas" },
      { title: "Notas", icon: FileText, href: "/admin/academic-management/notes" }
    ]
  },
  {
    title: "Professores",
    icon: GraduationCap,
    children: [
      { title: "Professores", icon: GraduationCap, href: "/admin/teacher-management/teacher" },
      { title: "Disciplinas do Docente", icon: BookOpen, href: "/admin/teacher-management/discpline-teacher" },
      { title: "Diretores de Turma", icon: UserCheck, href: "/admin/teacher-management/director-turma" }
    ]
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    children: [
      { title: "Pagamentos", icon: Wallet, href: "/admin/financeiro/pagamentos" },
      { title: "Relatórios de Vendas", icon: TrendingUp, href: "/admin/financeiro/relatorios-vendas" },
      { title: "Serviços", icon: FileText, href: "/admin/finance-management/services" },
      { title: "Notas de Crédito", icon: FileText, href: "/admin/finance-management/credit-notes" }
    ]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    children: [
      { title: "Relatórios de Alunos", icon: Users, href: "/admin/reports-management/students" },
      { title: "Relatórios Financeiros", icon: DollarSign, href: "/admin/reports-management/financial" },
      { title: "Relatórios Acadêmicos", icon: BookOpen, href: "/admin/reports-management/academic" }
    ]
  },
  {
    title: "Configurações",
    icon: Settings,
    children: [
      { title: "Dados Institucionais", icon: Building, href: "/admin/settings-management/instituicao" },
      { title: "Ano Letivo", icon: Calendar, href: "/admin/settings-management/ano-letivo" },
      { title: "Usuários", icon: UserCog, href: "/admin/settings-management/usuarios" }
    ]
  }
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
  onLogout?: () => void
}

export default function Sidebar({ isCollapsed = false, onLogout }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  // Função isActive precisa ser definida antes do useEffect
  const isActive = (href: string) => {
    
    if (pathname === href) return true;
    
    // Para evitar conflitos, verificamos se o pathname começa com href + "/"
    // mas não é apenas uma substring de uma rota maior
    if (href === "/admin") {
      return pathname === "/admin";
    }
    
    return pathname.startsWith(href + "/");
  }

  // Auto-expandir menu que contém a página ativa
  useEffect(() => {
    const newExpanded = new Set<string>()
    
    menuItems.forEach((item) => {
      if (item.children) {
        const hasActiveChild = item.children.some(child => 
          child.href && isActive(child.href)
        )
        if (hasActiveChild) {
          newExpanded.add(item.title)
        }
      }
    })
    
    setExpandedItems(newExpanded)
  }, [pathname])

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const hasActiveChild = (children?: MenuItem[]) => {
    return children?.some(child => child.href && isActive(child.href)) || false
  }

  const SidebarContent = () => (
    <div className={cn(
      "flex h-full flex-col bg-white shadow-lg transition-all duration-300 border-r border-gray-200",
      isCollapsed ? "w-16" : "w-72"
    )}>
      {/* Header com logo */}
      <div className="flex h-20 items-center px-4 bg-white border-b border-gray-200">
        {!isCollapsed && (
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="h-12 w-12 border-1 rounded-2xl flex items-center justify-center">
                <Image
                  src={icon}
                  alt="JOMORAIS Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
            </div>
            <div>
              <span className="text-2xl font-bold text-gray-800">JOMORAIS</span>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-[#FFC506] font-semibold">Sistema Escolar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-1">
            {menuItems.map((item) => {
              if (!item.children) {
                // Item simples
                return (
                  <Tooltip key={item.title} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link href={item.href || "#"}>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-11 rounded-lg transition-all duration-200",
                            isCollapsed ? "justify-center px-2" : "px-3",
                            item.href && isActive(item.href) 
                              ? "bg-gray-100 text-gray-900" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            !isCollapsed && "mr-3",
                            item.href && isActive(item.href) 
                              ? "text-gray-900" 
                              : "text-gray-500"
                          )} />
                          {!isCollapsed && (
                            <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              }

              // Item com submenu
              const isExpanded = expandedItems.has(item.title)
              const hasActive = hasActiveChild(item.children)
              const shouldShowParentActive = false // Pai nunca fica ativo quando há filhos ativos

              return (
                <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-11 rounded-lg transition-all duration-200",
                            isCollapsed ? "justify-center px-2" : "px-3",
                            shouldShowParentActive 
                              ? "bg-gray-100 text-gray-900 border border-[#FFC506]" 
                              : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                          )}
                        >
                          <item.icon className={cn(
                            "h-5 w-5 transition-colors duration-200",
                            !isCollapsed && "mr-3",
                            shouldShowParentActive 
                              ? "text-[#FFC506]" 
                              : "text-gray-500"
                          )} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                              <div className={cn(
                                "ml-2 transition-transform duration-200",
                                isExpanded && "rotate-90"
                              )}>
                                <ChevronRight className="h-4 w-4 text-gray-400" />
                              </div>
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {!isCollapsed && (
                    <CollapsibleContent className="space-y-1 overflow-hidden">
                      <div className="ml-6 space-y-1 relative">
                        <div className="absolute left-2 top-0 bottom-0 w-px bg-gray-200"></div>
                        {item.children?.map((child) => (
                          <Link key={child.title} href={child.href || "#"}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start h-9 text-sm rounded-lg transition-all duration-200 pl-6 pr-3",
                                child.href && isActive(child.href) 
                                  ? "bg-gray-100 text-gray-900 border border-[#FFC506]" 
                                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                              )}
                            >
                              <div className={cn(
                                "absolute left-2 top-1/2 transform -translate-y-1/2 w-1.5 h-1.5 rounded-full transition-colors duration-200",
                                child.href && isActive(child.href) 
                                  ? "bg-[#FFC506]" 
                                  : "bg-gray-300"
                              )}></div>
                              <child.icon className={cn(
                                "h-4 w-4 mr-3 ml-2 transition-colors duration-200",
                                child.href && isActive(child.href) 
                                  ? "text-[#FFC506]" 
                                  : "text-gray-500"
                              )} />
                              <span className="flex-1 text-left text-xs">{child.title}</span>
                            </Button>
                          </Link>
                        ))}
                      </div>
                    </CollapsibleContent>
                  )}
                </Collapsible>
              )
            })}
          </div>
        </TooltipProvider>
      </nav>

      {/* Footer com informações do sistema e logout */}
      {!isCollapsed && (
        <div className="border-t border-gray-200 px-4 py-4 space-y-4 bg-white">
          {/* Version and Copyright */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#FFC506]" />
              <span className="text-sm font-bold text-[#FFC506]">v2.1.0 Pro</span>
            </div>
            <div className="text-xs text-gray-500">
              © 2025 JOMORAIS - Gestão Escolar
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full border-gray-300 bg-white text-gray-600 hover:bg-red-200 hover:text-white hover:border-red-200 transition-all duration-200"
            onClick={onLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Terminar Sessão
          </Button>
        </div>
      )}

      {/* Collapsed Footer */}
      {isCollapsed && (
        <div className="border-t border-gray-200 px-2 py-4 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full h-10 border-gray-300 bg-white text-gray-600 hover:bg-red-200 hover:text-white hover:border-red-200 p-0"
                onClick={onLogout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              Terminar Sessão
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )

  return <SidebarContent />
}