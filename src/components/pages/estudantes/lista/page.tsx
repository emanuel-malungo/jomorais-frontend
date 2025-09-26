"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Eye, FileText } from "lucide-react";
import { Aluno } from "@/types/aluno";
import Link from "next/link";

export default function ListaEstudantesPage() {
  const [estudantes, setEstudantes] = useState<Aluno[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockEstudantes: Aluno[] = [
      {
        id_aluno: 1,
        nome: "João Silva",
        data_nascimento: new Date("2010-05-15"),
        genero: "M",
        nome_encarregado: "Maria Silva",
        contato_encarregado: "+244 923 456 789",
        numero_matricula: "2024001",
        estado_financeiro: "em_dia"
      },
      {
        id_aluno: 2,
        nome: "Ana Costa",
        data_nascimento: new Date("2011-03-22"),
        genero: "F",
        nome_encarregado: "Pedro Costa",
        contato_encarregado: "+244 912 345 678",
        numero_matricula: "2024002",
        estado_financeiro: "em_atraso"
      }
    ];
    
    setTimeout(() => {
      setEstudantes(mockEstudantes);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredEstudantes = estudantes.filter(estudante =>
    estudante.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    estudante.numero_matricula.includes(searchTerm)
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "em_dia": return "text-green-600 bg-green-100";
      case "em_atraso": return "text-red-600 bg-red-100";
      case "suspenso": return "text-gray-600 bg-gray-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="p-1">

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por nome ou número de matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Link href="/estudantes/novo">
          <Button className="bg-[#2d5016] hover:bg-[#2d5016]/90">
            <Plus className="h-4 w-4 mr-2" />
            Novo Estudante
          </Button>
        </Link>
      </div>

      {/* Students Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Estudante
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Encarregado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Status Financeiro
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
                    Carregando estudantes...
                  </td>
                </tr>
              ) : filteredEstudantes.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-muted-foreground">
                    Nenhum estudante encontrado
                  </td>
                </tr>
              ) : (
                filteredEstudantes.map((estudante) => (
                  <tr key={estudante.id_aluno} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-medium text-foreground">{estudante.nome}</div>
                        <div className="text-sm text-muted-foreground">
                          {estudante.genero === "M" ? "Masculino" : estudante.genero === "F" ? "Feminino" : "Outro"}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {estudante.numero_matricula}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-foreground">{estudante.nome_encarregado}</div>
                        <div className="text-sm text-muted-foreground">{estudante.contato_encarregado}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(estudante.estado_financeiro)}`}>
                        {estudante.estado_financeiro.replace("_", " ")}
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
                        <Button variant="ghost" size="sm">
                          <FileText className="h-4 w-4" />
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
          <div className="text-2xl font-bold text-foreground">{estudantes.length}</div>
          <div className="text-sm text-muted-foreground">Total de Estudantes</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-green-600">
            {estudantes.filter(e => e.estado_financeiro === "em_dia").length}
          </div>
          <div className="text-sm text-muted-foreground">Em Dia</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-red-600">
            {estudantes.filter(e => e.estado_financeiro === "em_atraso").length}
          </div>
          <div className="text-sm text-muted-foreground">Em Atraso</div>
        </div>
      </div>
    </div>
  );
}
