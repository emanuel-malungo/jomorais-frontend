"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BackgroundCarousel } from "@/components/ui/background-carousel";
import icon from "../../assets/images/icon.png";
import { 
  BookOpen, 
  Users, 
  Calendar, 
  FileText, 
  BarChart3, 
  Shield,
  Star,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  ChevronDown,
  Smartphone,
  CreditCard,
  GraduationCap,
  School,
  Building,
  Languages,
  Award,
  Network,
  Menu,
  X,
  LogIn,
  User,
  ChevronUp
} from "lucide-react";
import Link from "next/link";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Controla a visibilidade do botão "Voltar ao topo"
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Função para rolar suavemente ao topo
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };
  
  // Imagens para o carrossel de background
  const carouselImages = [
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-8 h-8 md:w-12 md:h-12 relative">
                <Image
                  src={icon}
                  alt="Jomorais Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl md:text-2xl lg:text-3xl font-bold text-[#2d5016]">JOMORAIS</span>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
              <a href="#inicio" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors text-sm xl:text-base">
                Início
              </a>
              <a href="#sobre" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors text-sm xl:text-base">
                Quem somos
              </a>
              <a href="#funcionalidades" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors text-sm xl:text-base">
                Funcionalidades
              </a>
              <a href="#demo" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors text-sm xl:text-base">
                Demo
              </a>
              <a href="#contato" className="text-gray-700 hover:text-[#2d5016] font-medium transition-colors text-sm xl:text-base">
                Contato
              </a>
            </nav>

            {/* Mobile menu button */}
            <div className="lg:hidden">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-md text-gray-700 hover:text-[#2d5016] hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#2d5016]"
              >
                {mobileMenuOpen ? (
                  <X className="h-6 w-6" />
                ) : (
                  <Menu className="h-6 w-6" />
                )}
              </button>
            </div>

            {/* Desktop Login Button */}
            <div className="hidden lg:block" >
              <Link href="/login" >
                <Button className="bg-gradient-to-r from-[#FFD700] to-[#FFC107] hover:from-[#FFC107] hover:to-[#FFB300] text-[#2d5016] px-6 py-3 rounded-full font-bold transition-all duration-300 text-sm flex items-center shadow-lg hover:shadow-xl transform hover:scale-105 cursor-pointer">
                  <User className="h-4 w-4 mr-2" />
                  Portal Escolar
                </Button>
              </Link>
            </div>
          </div>

          {/* Mobile menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden">
              <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
                <a
                  href="#inicio"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2d5016] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Início
                </a>
                <a
                  href="#sobre"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2d5016] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Quem somos
                </a>
                <a
                  href="#funcionalidades"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2d5016] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Funcionalidades
                </a>
                <a
                  href="#demo"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2d5016] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Demo
                </a>
                <a
                  href="#contato"
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-[#2d5016] hover:bg-gray-50 rounded-md"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contato
                </a>
                <Link
                  href="/login"
                  className="block px-3 py-2 text-base font-medium text-white bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] hover:from-[#3d6b1f] hover:to-[#4d7b2f] rounded-md transition-all duration-300 mt-2 flex items-center"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Portal Escolar
                </Link>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="relative min-h-[90vh] flex items-center">
        <BackgroundCarousel
          images={carouselImages}
          autoPlay={true}
          autoPlayInterval={6000}
          overlayOpacity={0.7}
          className="absolute inset-0"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 relative z-10">
            <div className="text-center text-white">
              <div className="mb-6 md:mb-8">
               <br /><br /><br /><br /><br /><br />
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold mb-4 md:mb-6 leading-tight px-4">
                  A Educação do seu filho, é a nossa prioridade<br className="hidden sm:block" />
                  <span className="sm:hidden"> </span>e é mais fácil com o JOMORAIS.
                </h1>
              </div>
            </div>
          </div>
        </BackgroundCarousel>
      </section>

      {/* About Section */}
      <section id="sobre" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Sobre o JOMORAIS
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                Sistema integrado de gestão escolar desenhado para instituições de ensino de todos os níveis. 
                O JOMORAIS permite realizar matrículas online, gerir alunos, controlar e realizar pagamentos, 
                acesso a aulas online, lançamento de notas, publicação de comunicados e notícias, tudo acessível 
                por dispositivos móveis.
              </p>
              <Button className="bg-[#FFD700] hover:bg-[#FFC107] text-[#2d5016] px-8 py-3 rounded-lg font-bold shadow-lg">
                Baixar Apresentação
              </Button>
            </div>
            <div className="relative">
              <div className="aspect-video bg-gray-100 rounded-xl overflow-hidden shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80"
                  alt="Sistema de gestão escolar"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-16 md:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Funcionalidades
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <CreditCard className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Pagamentos e Faturação
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Emissão de notas de cobrança e faturas de forma automatizada e mapa de pagamentos
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <Users className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Matrículas Online
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Novas matrículas e confirmação de matrículas 100% Online
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <BookOpen className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Conteúdos e Matérias
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lançamento de matérias e conteúdos no painel do aluno
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Gestão de Notas
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Lançamento de notas trimestrais ou semestrais e emissão de pautas automatizadas
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <Mail className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Portal do Aluno
              </h3>
              <p className="text-gray-600 leading-relaxed">
                O portal do aluno permite se comunicar com a secretaria, receber comunicados
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-16 h-16 bg-[#FFD700]/20 rounded-lg flex items-center justify-center mb-6">
                <FileText className="h-8 w-8 text-[#2d5016]" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Relatórios de Gestão
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Relatórios de gestão para administração e emissão de declaração com nota e sem nota
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section id="demo" className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Veja o JOMORAIS em Ação
            </h2>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="aspect-video bg-gray-900 rounded-2xl overflow-hidden shadow-2xl relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg hover:scale-110 transition-transform">
                  <svg className="w-8 h-8 text-gray-900 ml-1" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </button>
              </div>
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                alt="Demo do sistema"
                className="w-full h-full object-cover opacity-50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-16 md:py-24 bg-[#2d5016] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Invista na qualidade de educação do seu filho.
          </h2>
          <p className="text-xl mb-8 text-white/90 max-w-3xl mx-auto">
            Para mais informações e marcação de apresentação do sistema por favor entre em contacto!
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <a 
              href="tel:+244921222222" 
              className="bg-[#FFD700] hover:bg-[#FFC107] text-[#2d5016] font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 inline-flex items-center justify-center shadow-lg"
            >
              <Phone className="mr-2 h-5 w-5" />
              +244 921 222 222
            </a>
            <a 
              href="mailto:contato@jomorais.com.br?subject=JOMORAIS" 
              className="bg-transparent border-2 border-[#FFD700] text-[#FFD700] hover:bg-[#FFD700] hover:text-[#2d5016] font-bold px-8 py-4 rounded-lg text-lg transition-all duration-300 inline-flex items-center justify-center"
            >
              <Mail className="mr-2 h-5 w-5" />
              contato@jomorais.com
            </a>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <MapPin className="h-8 w-8 mx-auto mb-4 text-[#FFD700]" />
              <p className="text-white/90">Luanda, Angola<br />Angola</p>
            </div>
            <div>
              <Phone className="h-8 w-8 mx-auto mb-4 text-[#FFD700]" />
              <p className="text-white/90">+244 921 222 222</p>
              <p className="text-white/90">+244 951 222 222</p>
            </div>
            <div>
              <Mail className="h-8 w-8 mx-auto mb-4 text-[#FFD700]" />
              <p className="text-white/90">contato@jomorais.com</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 relative">
                <Image
                  src={icon}
                  alt="Jomorais Logo"
                  fill
                  className="object-contain"
                />
              </div>
              <span className="text-xl font-bold">JOMORAIS</span>
            </div>
            
            <div className="text-center md:text-right text-gray-400">
              <p>&copy; 2025 TODOS OS DIREITOS RESERVADOS. JOMORAIS</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Botão Voltar ao Topo */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 bg-gradient-to-r from-[#2d5016] to-[#3d6b1f] hover:from-[#3d6b1f] hover:to-[#4d7b2f] text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 z-50 group"
          aria-label="Voltar ao topo"
        >
          <ChevronUp className="h-6 w-6 group-hover:animate-bounce" />
        </button>
      )}

    </div>
  );
}
