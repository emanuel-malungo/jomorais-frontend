"use client"

import React from 'react'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Settings, LogOut } from 'lucide-react'

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
    <header className="bg-white h-16 px-6 flex items-center justify-end">
      <div className="flex items-center space-x-4">

		  {/* Settings Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 w-9 p-0 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
        >
          <Settings className="h-4 w-4" />
        </Button>

        {/* User Info */}
        <div className="flex items-center space-x-3">
          <Avatar className="h-8 w-8">
            <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
            <AvatarFallback className="bg-gray-200 text-gray-700 text-sm font-semibold">
              {currentUser.initials}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-900">
              {currentUser.name}
            </p>
            <p className="text-xs text-gray-600">{currentUser.role}</p>
          </div>
        </div>

        {/* Logout Button */}
        <Button 
          variant="ghost" 
          size="sm"
          className="h-9 w-9 p-0 text-gray-600 hover:text-red-600 hover:bg-red-50"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  )
}

export default Header