import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Users, Database, Shield, Bell, Palette, Globe, Lock, HardDrive, UserCheck } from "lucide-react";
import Link from "next/link";

export default function Configuracoes() {
  const configSections = [
    {
      title: "Configurações do Sistema",
      description: "Configure as preferências gerais do sistema",
      icon: Settings,
      href: "/configuracoes/sistema",
      color: "bg-blue-500",
      items: ["Informações da escola", "Ano letivo", "Períodos acadêmicos", "Configurações gerais"]
    },
    {
      title: "Gestão de Usuários",
      description: "Gerencie usuários, permissões e acessos",
      icon: Users,
      href: "/configuracoes/usuarios",
      color: "bg-green-500",
      items: ["Usuários do sistema", "Perfis de acesso", "Permissões", "Auditoria de acessos"]
    },
    {
      title: "Backup e Segurança",
      description: "Configure backups automáticos e segurança",
      icon: Database,
      href: "/configuracoes/backup",
      color: "bg-purple-500",
      items: ["Backup automático", "Restauração", "Logs de segurança", "Políticas de senha"]
    }
  ];

  const systemStatus = [
    { label: "Versão do Sistema", value: "v2.1.0", status: "success" },
    { label: "Último Backup", value: "Hoje, 03:00", status: "success" },
    { label: "Usuários Ativos", value: "127", status: "info" },
    { label: "Espaço em Disco", value: "78% usado", status: "warning" }
  ];

  const quickActions = [
    { icon: Shield, label: "Auditoria de Segurança", description: "Verificar logs de acesso" },
    { icon: Bell, label: "Notificações", description: "Configurar alertas do sistema" },
    { icon: Palette, label: "Personalização", description: "Temas e aparência" },
    { icon: Globe, label: "Idioma e Região", description: "Configurações regionais" },
    { icon: Lock, label: "Políticas de Senha", description: "Requisitos de segurança" },
    { icon: HardDrive, label: "Manutenção", description: "Limpeza e otimização" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Configurações do Sistema
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Gerencie as configurações e preferências do sistema Jomorais
          </p>
        </div>
        <Button className="bg-[#3B6C4D] hover:bg-[#2d5239] text-white">
          <UserCheck className="w-4 h-4 mr-2" />
          Perfil do Administrador
        </Button>
      </div>

      {/* Status do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-[#3B6C4D]" />
            Status do Sistema
          </CardTitle>
          <CardDescription>
            Informações gerais sobre o estado atual do sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {systemStatus.map((item, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">
                    {item.label}
                  </p>
                  <p className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    {item.value}
                  </p>
                </div>
                <span 
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.status === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' :
                    item.status === 'warning' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' :
                    'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                  }`}
                >
                  {item.status === 'success' ? 'OK' : item.status === 'warning' ? 'Atenção' : 'Info'}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Seções de Configuração */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {configSections.map((section, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${section.color} text-white`}>
                  <section.icon className="w-6 h-6" />
                </div>
                <div>
                  <CardTitle className="text-lg">{section.title}</CardTitle>
                  <CardDescription>{section.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 mb-4">
                {section.items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-[#3B6C4D] rounded-full" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link href={section.href}>
                <Button variant="outline" className="w-full border-[#3B6C4D] text-[#3B6C4D] hover:bg-[#3B6C4D] hover:text-white">
                  Configurar
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Ações Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
          <CardDescription>
            Acesso rápido às configurações mais utilizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => (
              <Button
                key={index}
                variant="outline"
                className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                <action.icon className="w-5 h-5 text-[#3B6C4D]" />
                <div className="text-left">
                  <p className="font-medium text-gray-900 dark:text-white">
                    {action.label}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {action.description}
                  </p>
                </div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Alertas de Configuração */}
      <Card className="border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20">
        <CardHeader>
          <CardTitle className="text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Alertas de Configuração
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Backup Recomendado
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Configure backups automáticos para garantir a segurança dos dados
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-white dark:bg-gray-800 rounded-lg border border-yellow-200 dark:border-yellow-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2" />
              <div>
                <p className="font-medium text-gray-900 dark:text-white">
                  Atualização Disponível
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Nova versão do sistema disponível com melhorias de segurança
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
