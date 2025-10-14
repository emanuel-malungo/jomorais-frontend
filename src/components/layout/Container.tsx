"use client";
import { useState, type ReactNode } from 'react';
import Header from './Header';
import Sidebar from './sidebar';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';

interface ContainerProps {
  children: ReactNode;
  onLogout?: () => void;
}

const Container: React.FC<ContainerProps> = ({ children, onLogout }) => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const handleToggleMobileSidebar = () => {
    console.log('Toggle mobile sidebar:', !mobileSidebarOpen);
    setMobileSidebarOpen(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <div className="hidden lg:block w-72">
        <Sidebar onLogout={onLogout} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen}>
        <SheetContent 
          side="left" 
          className="p-0 w-72 lg:hidden max-w-[80vw] sm:max-w-72 z-50"
          onEscapeKeyDown={() => setMobileSidebarOpen(false)}
          onPointerDownOutside={() => setMobileSidebarOpen(false)}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Menu de Navegação</SheetTitle>
          </SheetHeader>
          <Sidebar onLogout={onLogout} />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <Header onToggleMobileSidebar={handleToggleMobileSidebar} onLogout={onLogout} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-3 sm:p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Container;