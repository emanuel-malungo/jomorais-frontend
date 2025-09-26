"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Edit, Eye, BookOpen } from "lucide-react";
import { Disciplina } from "@/types/disciplina";

export default function ListaDisciplinasPage() {
  const [disciplinas, setDisciplinas] = useState<Disciplina[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockDisciplinas: Disciplina[] = [
      {
        id_disciplina: 1,
        nome_disciplina: "Matemática",
        id_curso: 1
      },
      {
        id_disciplina: 2,
        nome_disciplina: "Português",
        id_curso: 1
      },
      {
        id_disciplina: 3,
        nome_disciplina: "História",
        id_curso: null
      },
      {
        id_disciplina: 4,
        nome_disciplina: "Geografia",
        id_curso: null
      }
    ];
    
    setTimeout(() => {
      setDisciplinas(mockDisciplinas);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredDisciplinas = disciplinas.filter(disciplina =>
    disciplina.nome_disciplina.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar disciplina..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-[#2d5016] hover:bg-[#2d5016]/90">
          <Plus className="h-4 w-4 mr-2" />
          Nova Disciplina
        </Button>
      </div>

      {/* Disciplines Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Carregando disciplinas...
          </div>
        ) : filteredDisciplinas.length === 0 ? (
          <div className="col-span-full text-center text-muted-foreground py-8">
            Nenhuma disciplina encontrada
          </div>
        ) : (
          filteredDisciplinas.map((disciplina) => (
            <div key={disciplina.id_disciplina} className="bg-card rounded-lg border border-border p-6 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-[#2d5016]/10 rounded-lg">
                    <BookOpen className="h-6 w-6 text-[#2d5016]" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{disciplina.nome_disciplina}</h3>
                    <p className="text-sm text-muted-foreground">
                      {disciplina.id_curso ? `Curso ID: ${disciplina.id_curso}` : "Disciplina Geral"}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button variant="ghost" size="sm" className="flex-1">
                  <Eye className="h-4 w-4 mr-2" />
                  Ver
                </Button>
                <Button variant="ghost" size="sm" className="flex-1">
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-foreground">{disciplinas.length}</div>
          <div className="text-sm text-muted-foreground">Total de Disciplinas</div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="text-2xl font-bold text-[#2d5016]">
            {disciplinas.filter(d => d.id_curso !== null).length}
          </div>
          <div className="text-sm text-muted-foreground">Vinculadas a Cursos</div>
        </div>
      </div>
    </div>
  );
}
