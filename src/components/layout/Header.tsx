"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { 
  Settings, 
  LogOut, 
  Bell, 
  Search, 
  Menu,
  Sun,
  Zap,
  Shield,
  Database
} from 'lucide-react'

// Mock user data - replace with actual user data
const currentUser = {
  name: "João Morais",
  email: "joao.morais@jomorais.edu.ao",
  avatar: "/api/placeholder/40/40",
  role: "Administrador",
  initials: "JM"
}

const Header: React.FC = () => {
  return (
    <header className="bg-gradient-to-r from-white via-gray-50/80 to-white backdrop-blur-md border-b border-gray-200/60 h-20 px-6 flex items-center justify-between shadow-sm">
      {/* Left Section - Search and Menu */}
      <div className="flex items-center space-x-4">
        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-10 w-10 p-0 text-gray-600 hover:text-[#182F59] hover:bg-[#182F59]/5 rounded-xl lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Search Bar */}
        <div className="hidden md:flex items-center bg-white/80 backdrop-blur-sm border border-gray-200/60 rounded-xl px-4 py-2.5 w-96 focus-within:ring-2 focus-within:ring-[#FFD002]/20 focus-within:border-[#FFD002]/30 transition-all duration-200">
          <Search className="h-4 w-4 text-gray-400 mr-3" />
          <input 
            type="text" 
            placeholder="Pesquisar estudantes, professores..."
            className="bg-transparent border-0 outline-none text-sm text-gray-700 placeholder-gray-400 flex-1"
          />
        </div>

        {/* System Status Badges */}
        <div className="hidden lg:flex items-center space-x-2">
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-600 text-white border-0 px-3 py-1.5 text-xs font-semibold">
            <Database className="w-3 h-3 mr-1.5" />
            Online
          </Badge>
          <Badge className="bg-gradient-to-r from-[#FFD002] to-[#FFC107] text-[#182F59] border-0 px-3 py-1.5 text-xs font-semibold">
            <Zap className="w-3 h-3 mr-1.5" />
            v2.1.0
          </Badge>
        </div>
      </div>

      {/* Right Section - Actions and User */}
      <div className="flex items-center space-x-3">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center space-x-2">
          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0 text-gray-600 hover:text-[#182F59] hover:bg-[#182F59]/5 rounded-xl transition-all duration-200"
          >
            <Sun className="h-4 w-4" />
          </Button>

          {/* Notifications */}
          <div className="relative">
            <Button 
              variant="ghost" 
              size="sm"
              className="h-10 w-10 p-0 text-gray-600 hover:text-[#182F59] hover:bg-[#182F59]/5 rounded-xl transition-all duration-200"
            >
              <Bell className="h-4 w-4" />
            </Button>
            <div className="absolute -top-1 -right-1 h-5 w-5 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">3</span>
            </div>
          </div>

          {/* Settings */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-10 w-10 p-0 text-gray-600 hover:text-[#182F59] hover:bg-[#182F59]/5 rounded-xl transition-all duration-200"
          >
            <Settings className="h-4 w-4" />
          </Button>
        </div>

        {/* Divider */}
        <div className="h-8 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

        {/* User Profile Section */}
        <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm border border-gray-200/40 rounded-2xl px-4 py-2 hover:bg-white/80 hover:shadow-md transition-all duration-200">
          <div className="relative">
            <Avatar className="h-10 w-10 ring-2 ring-[#FFD002]/20 ring-offset-2">
              <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
              <AvatarFallback className="bg-gradient-to-br from-[#182F59] to-[#1a3260] text-[#FFD002] text-sm font-bold">
                {currentUser.initials}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-0.5 -right-0.5 h-4 w-4 bg-gradient-to-br from-emerald-400 to-green-500 rounded-full border-2 border-white flex items-center justify-center">
              <Shield className="h-2 w-2 text-white" />
            </div>
          </div>
          
          <div className="text-left hidden sm:block">
            <p className="text-sm font-semibold text-gray-900 leading-tight">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-600 font-medium">{currentUser.role}</p>
          </div>

          {/* Logout Button */}
          <Button 
            variant="ghost" 
            size="sm"
            className="h-8 w-8 p-0 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 ml-2"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </header>
  )
}

export default Header