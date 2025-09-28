"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Separator } from "@/components/ui/separator"
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
  Clock,
  MapPin,
  Wallet,
  Sparkles,
  LogOut,
  Database,
  Zap
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
    href: "/admin",
    badge: "3"
  },
  {
    title: "Gestão de Alunos",
    icon: Users,
    badge: "1.2k",
    children: [
      { title: "Lista de Alunos", icon: Users, href: "/estudantes" },
      { title: "Matrículas", icon: UserCheck, href: "/estudantes/matriculas" },
      { title: "Confirmações", icon: GraduationCap, href: "/estudantes/confirmacoes" },
      { title: "Transferências", icon: FileText, href: "/estudantes/transferencias" }
    ]
  },
  {
    title: "Gestão Acadêmica",
    icon: BookOpen,
    badge: "28",
    children: [
      { title: "Disciplinas", icon: BookOpen, href: "/disciplinas" },
      { title: "Turmas", icon: School, href: "/turmas" },
      { title: "Horários", icon: Clock, href: "/horarios" },
      { title: "Notas", icon: FileText, href: "/notas" },
      { title: "Classes", icon: GraduationCap, href: "/admin/classes" }
    ]
  },
  {
    title: "Professores",
    icon: GraduationCap,
    badge: "89",
    children: [
      { title: "Lista de Professores", icon: GraduationCap, href: "/professores" },
      { title: "Disciplinas do Docente", icon: BookOpen, href: "/professores/disciplinas" },
      { title: "Diretores de Turma", icon: UserCheck, href: "/professores/diretores" }
    ]
  },
  {
    title: "Financeiro",
    icon: DollarSign,
    badge: "156",
    children: [
      { title: "Pagamentos", icon: Wallet, href: "/financeiro" },
      { title: "Propinas", icon: DollarSign, href: "/financeiro/propinas" },
      { title: "Serviços", icon: FileText, href: "/financeiro/servicos" },
      { title: "Notas de Crédito", icon: FileText, href: "/financeiro/notas-credito" }
    ]
  },
  {
    title: "Relatórios",
    icon: BarChart3,
    children: [
      { title: "Relatórios de Alunos", icon: Users, href: "/relatorios/alunos" },
      { title: "Relatórios Financeiros", icon: DollarSign, href: "/relatorios/financeiros" },
      { title: "Relatórios Acadêmicos", icon: BookOpen, href: "/relatorios/academicos" }
    ]
  },
  {
    title: "Configurações",
    icon: Settings,
    children: [
      { title: "Dados Institucionais", icon: School, href: "/configuracoes/instituicao" },
      { title: "Ano Letivo", icon: Calendar, href: "/configuracoes/ano-letivo" },
      { title: "Geográfico", icon: MapPin, href: "/configuracoes/geografico" },
      { title: "Usuários", icon: Users, href: "/configuracoes/usuarios" }
    ]
  }
]

interface SidebarProps {
  isCollapsed?: boolean
  onToggleCollapse?: () => void
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const pathname = usePathname()
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleExpanded = (title: string) => {
    const newExpanded = new Set(expandedItems)
    if (newExpanded.has(title)) {
      newExpanded.delete(title)
    } else {
      newExpanded.add(title)
    }
    setExpandedItems(newExpanded)
  }

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + "/")
  }

  const hasActiveChild = (children?: MenuItem[]) => {
    return children?.some(child => child.href && isActive(child.href)) || false
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col bg-gradient-to-b from-[#182F59] via-[#1a3260] to-[#182F59] shadow-2xl">
      {/* Header com logo */}
      <div className="flex h-20 items-center px-4 bg-gradient-to-r from-[#182F59] to-[#1a3260] border-b border-[#FFD002]/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-[#FFD002]/5 to-transparent"></div>
        {!isCollapsed && (
          <div className="flex items-center space-x-3 relative z-10">
            <div className="relative">
              <div className="h-12 w-12 bg-gradient-to-br from-[#FFD002] via-[#FFD002] to-[#FFC107] rounded-2xl flex items-center justify-center shadow-xl ring-2 ring-[#FFD002]/30">
                <Image
                  src={icon}
                  alt="JoMorais Logo"
                  width={28}
                  height={28}
                  className="object-contain"
                />
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-br from-[#00FF87] to-[#60EFFF] rounded-full animate-pulse"></div>
            </div>
            <div>
              <span className="text-2xl font-bold text-white">JoMorais</span>
              <div className="flex items-center space-x-2">
                <p className="text-xs text-[#FFD002] font-semibold">Sistema Escolar</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#FFD002]/20">
        <TooltipProvider delayDuration={0}>
          <div className="space-y-2">
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
                            "w-full justify-start h-12 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isCollapsed && "justify-center px-2",
                            item.href && isActive(item.href) 
                              ? "bg-gradient-to-r from-[#FFD002]/20 to-[#FFD002]/10 text-white shadow-lg ring-1 ring-[#FFD002]/30" 
                              : "hover:bg-gradient-to-r hover:from-[#FFD002]/10 hover:to-transparent hover:shadow-md text-white/80 hover:text-white"
                          )}
                        >
                          {item.href && isActive(item.href) && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD002] to-[#FFC107] rounded-r-full"></div>
                          )}
                          <item.icon className={cn(
                            "h-5 w-5 transition-all duration-300",
                            !isCollapsed && "mr-3",
                            item.href && isActive(item.href) 
                              ? "text-[#FFD002] drop-shadow-sm" 
                              : "text-white/70 group-hover:text-[#FFD002] group-hover:scale-110"
                          )} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                              {item.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "ml-2 h-5 text-xs font-bold shadow-sm",
                                    item.badge === "NEW" 
                                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white animate-pulse"
                                      : "bg-[#FFD002]/20 text-[#FFD002] border border-[#FFD002]/30"
                                  )}
                                >
                                  {item.badge}
                                </Badge>
                              )}
                            </>
                          )}
                        </Button>
                      </Link>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium bg-[#1a3260] border-[#FFD002]/20 text-white">
                        {item.title}
                        {item.badge && (
                          <Badge className="ml-2 bg-[#FFD002]/20 text-[#FFD002]">{item.badge}</Badge>
                        )}
                      </TooltipContent>
                    )}
                  </Tooltip>
                )
              }

              // Item com submenu
              const isExpanded = expandedItems.has(item.title)
              const hasActive = hasActiveChild(item.children)

              return (
                <Collapsible key={item.title} open={isExpanded} onOpenChange={() => toggleExpanded(item.title)}>
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger asChild>
                      <CollapsibleTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={cn(
                            "w-full justify-start h-12 rounded-xl transition-all duration-300 group relative overflow-hidden",
                            isCollapsed && "justify-center px-2",
                            hasActive 
                              ? "bg-gradient-to-r from-[#FFD002]/20 to-[#FFD002]/10 text-white shadow-lg ring-1 ring-[#FFD002]/30" 
                              : "hover:bg-gradient-to-r hover:from-[#FFD002]/10 hover:to-transparent hover:shadow-md text-white/80 hover:text-white"
                          )}
                        >
                          {hasActive && (
                            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-[#FFD002] to-[#FFC107] rounded-r-full"></div>
                          )}
                          <item.icon className={cn(
                            "h-5 w-5 transition-all duration-300",
                            !isCollapsed && "mr-3",
                            hasActive 
                              ? "text-[#FFD002] drop-shadow-sm" 
                              : "text-white/70 group-hover:text-[#FFD002] group-hover:scale-110"
                          )} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                              <div className={cn(
                                "ml-2 transition-all duration-300",
                                isExpanded && "rotate-90"
                              )}>
                                <ChevronRight className={cn(
                                  "h-4 w-4",
                                  hasActive ? "text-[#FFD002]" : "text-white/50 group-hover:text-[#FFD002]"
                                )} />
                              </div>
                            </>
                          )}
                        </Button>
                      </CollapsibleTrigger>
                    </TooltipTrigger>
                    {isCollapsed && (
                      <TooltipContent side="right" className="font-medium bg-[#1a3260] border-[#FFD002]/20 text-white">
                        {item.title}
                      </TooltipContent>
                    )}
                  </Tooltip>

                  {!isCollapsed && (
                    <CollapsibleContent className="space-y-1 overflow-hidden">
                      <div className="ml-8 space-y-1 relative">
                        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-[#FFD002]/30 via-[#FFD002]/20 to-transparent"></div>
                        {item.children?.map((child) => (
                          <Link key={child.title} href={child.href || "#"}>
                            <Button
                              variant="ghost"
                              size="sm"
                              className={cn(
                                "w-full justify-start h-10 text-sm rounded-lg transition-all duration-300 group relative pl-4",
                                child.href && isActive(child.href) 
                                  ? "bg-gradient-to-r from-[#FFD002]/25 to-[#FFD002]/10 text-white font-semibold shadow-md ring-1 ring-[#FFD002]/20" 
                                  : "hover:bg-[#FFD002]/10 hover:shadow-sm text-white/70 hover:text-white"
                              )}
                            >
                              <div className={cn(
                                "absolute left-0 top-1/2 transform -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300",
                                child.href && isActive(child.href) 
                                  ? "bg-[#FFD002] shadow-lg shadow-[#FFD002]/50" 
                                  : "bg-white/30 group-hover:bg-[#FFD002] group-hover:shadow-md group-hover:shadow-[#FFD002]/30"
                              )}></div>
                              <child.icon className={cn(
                                "h-4 w-4 mr-3 ml-4 transition-all duration-300",
                                child.href && isActive(child.href) 
                                  ? "text-[#FFD002]" 
                                  : "text-white/60 group-hover:text-[#FFD002] group-hover:scale-110"
                              )} />
                              <span className="flex-1 text-left">{child.title}</span>
                              {child.badge && (
                                <Badge 
                                  variant="secondary" 
                                  className={cn(
                                    "ml-2 h-4 text-xs font-bold shadow-sm",
                                    child.badge === "NEW" 
                                      ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white animate-pulse"
                                      : "bg-[#FFD002]/20 text-[#FFD002] border border-[#FFD002]/30"
                                  )}
                                >
                                  {child.badge}
                                </Badge>
                              )}
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
        <div className="border-t border-[#FFD002]/20 px-4 py-4 space-y-4 bg-gradient-to-r from-[#182F59] to-[#1a3260]">
          {/* System Info */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Database className="h-3 w-3 text-[#FFD002]" />
                <span className="text-white/70">Banco de Dados</span>
              </div>
              <span className="text-green-400 font-semibold">Conectado</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Zap className="h-3 w-3 text-[#FFD002]" />
                <span className="text-white/70">Performance</span>
              </div>
              <span className="text-[#FFD002] font-semibold">Excelente</span>
            </div>
          </div>

          <Separator className="bg-[#FFD002]/20" />

          {/* Version and Copyright */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Sparkles className="h-4 w-4 text-[#FFD002] animate-pulse" />
              <span className="text-sm font-bold text-[#FFD002]">v2.1.0 Pro</span>
            </div>
            <div className="text-xs text-white/60">
              © 2025 JoMorais - Gestão Escolar
            </div>
          </div>

          {/* Logout Button */}
          <Button 
            variant="outline" 
            className="w-full border-[#FFD002]/30 bg-transparent text-white hover:bg-[#FFD002] hover:text-[#182F59] hover:border-[#FFD002] transition-all duration-300 group"
          >
            <LogOut className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform duration-300" />
            Terminar Sessão
          </Button>
        </div>
      )}

      {/* Collapsed Footer */}
      {isCollapsed && (
        <div className="border-t border-[#FFD002]/20 px-2 py-4 space-y-3">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                className="w-full h-10 border-[#FFD002]/30 bg-transparent text-white hover:bg-[#FFD002] hover:text-[#182F59] p-0 cursor-pointer"
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right" className="bg-[#1a3260] border-[#FFD002]/20 text-white">
              Terminar Sessão
            </TooltipContent>
          </Tooltip>
        </div>
      )}
    </div>
  )

  return <SidebarContent />
}