"use client"

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { 
  Menu, 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  ChevronDown, 
  Sun, 
  Moon,
  Maximize2,
  Minimize2,
  Wifi,
  Shield,
  Clock,
  Calendar,
  MessageSquare,
  AlertCircle,
  CheckCircle,
  Info,
  X
} from 'lucide-react'
import { Sheet, SheetTrigger } from '@/components/ui/sheet'

interface HeaderProps {
  onToggleSidebar: () => void;
}

// Mock user data - replace with actual user data
const currentUser = {
  name: "João Morais",
  email: "joao.morais@jomorais.edu.ao",
  avatar: "/api/placeholder/40/40",
  role: "Administrador",
  initials: "JM"
}

// Mock notifications
const notifications = [
  {
    id: 1,
    title: "Nova matrícula pendente",
    description: "Ana Silva - 10ª Classe",
    type: "alert",
    time: "Há 5 min",
    unread: true
  },
  {
    id: 2,
    title: "Pagamento confirmado",
    description: "Maria Fernandes - Propina Novembro",
    type: "success",
    time: "Há 1 hora",
    unread: true
  },
  {
    id: 3,
    title: "Reunião de professores",
    description: "Amanhã às 14h30 - Sala de Conferências",
    type: "info",
    time: "Ontem",
    unread: false
  },
  {
    id: 4,
    title: "Sistema atualizado",
    description: "JoMorais v2.1.0 instalado com sucesso",
    type: "success",
    time: "2 dias atrás",
    unread: false
  },
  {
    id: 5,
    title: "Backup automático",
    description: "Backup diário realizado com sucesso",
    type: "info",
    time: "3 dias atrás",
    unread: false
  }
]

const Header: React.FC<HeaderProps> = ({ onToggleSidebar }) => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [searchFocused, setSearchFocused] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  const unreadCount = notifications.filter(n => n.unread).length

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'alert': return <AlertCircle className="h-4 w-4 text-orange-500" />
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'info': return <Info className="h-4 w-4 text-blue-500" />
      default: return <Bell className="h-4 w-4 text-gray-500" />
    }
  }

  const getCurrentTime = () => {
    return new Date().toLocaleTimeString('pt-AO', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false
    })
  }

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('pt-AO', { 
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  return (
    <header className="bg-gradient-to-r from-[#182F59] via-[#1a3260] to-[#182F59] border-b border-[#FFD002]/20 backdrop-blur-sm px-4 md:px-6 py-3 shadow-xl relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#FFD002]/5 via-transparent to-[#FFD002]/5"></div>
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD002]/50 to-transparent"></div>
      
      <div className="flex items-center justify-between relative z-10">
        {/* Left Side */}
        <div className="flex items-center space-x-6">
          {/* Mobile Menu Button */}
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="md:hidden hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0"
                onClick={onToggleSidebar}
              >
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Page Info */}
          <div className="hidden md:flex items-center space-x-4">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#FFD002] bg-clip-text text-transparent">
                Sistema JoMorais
              </h1>
              <p className="text-sm text-white/70 font-medium">
                Gestão Escolar Inteligente
              </p>
            </div>
            <Separator orientation="vertical" className="h-8 bg-[#FFD002]/30" />
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1">
                <Wifi className="h-4 w-4 text-green-400" />
                <span className="text-xs text-white/70">Online</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="h-4 w-4 text-[#FFD002]" />
                <span className="text-xs text-[#FFD002] font-semibold">{getCurrentTime()}</span>
              </div>
            </div>
          </div>

          {/* Enhanced Search Bar */}
          <div className="hidden lg:flex relative">
            <div className={`relative transition-all duration-300 ${searchFocused ? 'scale-105' : ''}`}>
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50 transition-colors duration-300" />
              <Input
                type="search"
                placeholder="Buscar alunos, professores, turmas..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                className="pl-10 w-80 bg-white/10 border-[#FFD002]/30 text-white placeholder:text-white/50 focus:bg-white/20 focus:border-[#FFD002] transition-all duration-300 backdrop-blur-sm"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-white/20 text-white/50 hover:text-white"
                  onClick={() => setSearchValue('')}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Center - Date Display (Desktop) */}
        <div className="hidden xl:flex items-center space-x-2 bg-white/10 px-4 py-2 rounded-xl backdrop-blur-sm border border-[#FFD002]/20">
          <Calendar className="h-4 w-4 text-[#FFD002]" />
          <span className="text-sm text-white font-medium">
            {getCurrentDate()}
          </span>
        </div>

        {/* Right Side */}
        <div className="flex items-center space-x-2">
          {/* Mobile Search */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="lg:hidden hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0"
          >
            <Search className="h-4 w-4" />
          </Button>

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0"
            onClick={() => setIsDarkMode(!isDarkMode)}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>

          {/* Fullscreen Toggle */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="hidden md:flex hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0"
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
          </Button>

          {/* Messages */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="relative hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0"
          >
            <MessageSquare className="h-4 w-4" />
            <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs border border-[#182F59]">
              2
            </Badge>
          </Button>

          {/* Enhanced Notifications */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="relative hover:bg-[#FFD002]/20 transition-all duration-300 text-white hover:text-[#FFD002] h-10 w-10 p-0 group"
              >
                <Bell className="h-4 w-4 transition-transform group-hover:scale-110" />
                {unreadCount > 0 && (
                  <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs border border-[#182F59] animate-pulse">
                    {unreadCount}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-96 bg-[#1a3260] border-[#FFD002]/20 text-white max-h-80 overflow-hidden">
              <DropdownMenuLabel className="text-base font-semibold text-[#FFD002] px-4 py-3">
                <div className="flex items-center justify-between">
                  <span>Notificações</span>
                  {unreadCount > 0 && (
                    <Badge className="bg-[#FFD002]/20 text-[#FFD002] border-[#FFD002]/30">
                      {unreadCount} novas
                    </Badge>
                  )}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#FFD002]/20" />
              <div className="space-y-1 max-h-64 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#FFD002]/20">
                {notifications.map((notification) => (
                  <DropdownMenuItem 
                    key={notification.id}
                    className="cursor-pointer p-4 hover:bg-[#FFD002]/10 transition-colors duration-200 relative"
                  >
                    {notification.unread && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-[#FFD002] rounded-full animate-pulse"></div>
                    )}
                    <div className="flex items-start space-x-3 ml-2">
                      <div className="mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </p>
                        <p className="text-xs text-white/70 mt-1">
                          {notification.description}
                        </p>
                        <p className="text-xs text-[#FFD002] mt-1 font-medium">
                          {notification.time}
                        </p>
                      </div>
                      {notification.unread && (
                        <Badge className="bg-[#FFD002]/20 text-[#FFD002] border-[#FFD002]/30 text-xs">
                          Nova
                        </Badge>
                      )}
                    </div>
                  </DropdownMenuItem>
                ))}
              </div>
              <DropdownMenuSeparator className="bg-[#FFD002]/20" />
              <div className="p-2">
                <Button variant="ghost" size="sm" className="w-full text-[#FFD002] hover:bg-[#FFD002]/10 justify-center">
                  Ver todas as notificações
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Enhanced User Profile */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                size="sm" 
                className="flex items-center space-x-3 px-3 py-2 h-auto hover:bg-[#FFD002]/20 transition-all duration-300 rounded-xl group"
              >
                <Avatar className="h-9 w-9 ring-2 ring-[#FFD002]/30 ring-offset-2 ring-offset-[#182F59]">
                  <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                  <AvatarFallback className="bg-gradient-to-br from-[#FFD002] to-[#FFC107] text-[#182F59] text-sm font-bold">
                    {currentUser.initials}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-semibold text-white group-hover:text-[#FFD002] transition-colors">
                    {currentUser.name}
                  </p>
                  <div className="flex items-center space-x-1">
                    <Shield className="h-3 w-3 text-[#FFD002]" />
                    <p className="text-xs text-[#FFD002]">{currentUser.role}</p>
                  </div>
                </div>
                <ChevronDown className="h-3 w-3 text-white/70 group-hover:text-[#FFD002] transition-all duration-300 group-hover:rotate-180 hidden md:block" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-[#1a3260] border-[#FFD002]/20 text-white">
              <DropdownMenuLabel className="pb-3">
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10 ring-2 ring-[#FFD002]/30">
                    <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                    <AvatarFallback className="bg-gradient-to-br from-[#FFD002] to-[#FFC107] text-[#182F59] font-bold">
                      {currentUser.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium text-white">{currentUser.name}</p>
                    <p className="text-xs text-white/70">{currentUser.email}</p>
                    <div className="flex items-center space-x-1 mt-1">
                      <Shield className="h-3 w-3 text-[#FFD002]" />
                      <span className="text-xs text-[#FFD002] font-medium">{currentUser.role}</span>
                    </div>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-[#FFD002]/20" />
              <DropdownMenuItem className="cursor-pointer hover:bg-[#FFD002]/10 text-white hover:text-[#FFD002] transition-colors">
                <User className="mr-3 h-4 w-4" />
                Meu Perfil
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#FFD002]/10 text-white hover:text-[#FFD002] transition-colors">
                <Settings className="mr-3 h-4 w-4" />
                Configurações
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer hover:bg-[#FFD002]/10 text-white hover:text-[#FFD002] transition-colors">
                <Bell className="mr-3 h-4 w-4" />
                Notificações
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#FFD002]/20" />
              <DropdownMenuItem className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors">
                <LogOut className="mr-3 h-4 w-4" />
                Terminar Sessão
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-[#FFD002]/30 to-transparent"></div>
    </header>
  )
}

export default Header