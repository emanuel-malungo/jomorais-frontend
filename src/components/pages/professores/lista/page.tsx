"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Eye, UserCheck } from "lucide-react";
import { Funcionario } from "@/types/funcionario";

export default function ListaProfessoresPage() {
  const [professores, setProfessores] = useState<Funcionario[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockProfessores: Funcionario[] = [
      {
        id_funcionario: 1,
        nome: "Prof. Carlos Santos",
        cargo: "professor",
        username: "carlos.santos",
        senha: "hashed_password",
        nivel_acesso: "escrita"
      },
      {
        id_funcionario: 2,
        nome: "Prof. Maria Oliveira",
        cargo: "professor",
        username: "maria.oliveira",
        senha: "hashed_password",
        nivel_acesso: "escrita"
      },
      {
        id_funcionario: 3,
        nome: "Ana Administradora",
        cargo: "administrativo",
        username: "ana.admin",
        senha: "hashed_password",
        nivel_acesso: "admin"
      }
    ];
    
    setTimeout(() => {
      setProfessores(mockProfessores);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredProfessores = professores.filter(professor =>
    professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    professor.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCargoColor = (cargo: string) => {
    switch (cargo) {
      case "professor": return "text-blue-600 bg-blue-100";
      case "administrativo": return "text-green-600 bg-green-100";
      case "gestor": return "text-purple-600 bg-purple-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const getNivelAcessoColor = (nivel: string) => {
    switch (nivel) {
      case "admin": return "text-red-600 bg-red-100";
      case "escrita": return "text-orange-600 bg-orange-100";
      case "leitura": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-6">

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou username..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-[#2d5016] hover:bg-[#2d5016]/90">
          <Plus className="h-4 w-4 mr-2" />
          Novo Professor
        </Button>
      </div>

      {/* Teachers Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Professor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Username
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Cargo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Nível de Acesso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    Carregando professores...
                  </td>
                </tr>
              ) : filteredProfessores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    Nenhum professor encontrado
                  </td>
                </tr>
              ) : (
                filteredProfessores.map((professor) => (
                  <tr key={professor.id_funcionario} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-[#2d5016] rounded-full flex items-center justify-center mr-3">
                          <UserCheck className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-foreground">{professor.nome}</div>
                          <div className="text-sm text-muted-foreground">ID: {professor.id_funcionario}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {professor.username}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getCargoColor(professor.cargo)}`}>
                        {professor.cargo}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getNivelAcessoColor(professor.nivel_acesso)}`}>
                        {professor.nivel_acesso}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">
            {professores.filter(p => p.cargo === "professor").length}
          </div>
          <div className="text-sm text-muted-foreground">Professores</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-green-600">
            {professores.filter(p => p.cargo === "administrativo").length}
          </div>
          <div className="text-sm text-muted-foreground">Administrativos</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-purple-600">
            {professores.filter(p => p.cargo === "gestor").length}
          </div>
          <div className="text-sm text-muted-foreground">Gestores</div>
        </div>
      </div>
    </div>
  );
}
