"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus, Eye, Download, DollarSign, Calendar } from "lucide-react";
import { Pagamento } from "@/types/pagamento";

export default function PagamentosPage() {
  const [pagamentos, setPagamentos] = useState<Pagamento[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  // Mock data - substituir por chamada à API
  useEffect(() => {
    const mockPagamentos: Pagamento[] = [
      {
        id_pagamento: 1,
        id_matricula: 1,
        mes_referente: "2024-09",
        valor: 15000,
        data_pagamento: new Date("2024-09-05"),
        id_funcionario: 1,
        comprovativo_fatura: "comprovativo_001.pdf"
      },
      {
        id_pagamento: 2,
        id_matricula: 2,
        mes_referente: "2024-09",
        valor: 15000,
        data_pagamento: new Date("2024-09-10"),
        id_funcionario: 1,
        comprovativo_fatura: "comprovativo_002.pdf"
      },
      {
        id_pagamento: 3,
        id_matricula: 1,
        mes_referente: "2024-08",
        valor: 15000,
        data_pagamento: new Date("2024-08-15"),
        id_funcionario: 2,
        comprovativo_fatura: "comprovativo_003.pdf"
      }
    ];
    
    setTimeout(() => {
      setPagamentos(mockPagamentos);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredPagamentos = pagamentos.filter(pagamento =>
    pagamento.mes_referente.includes(searchTerm) ||
    pagamento.id_matricula.toString().includes(searchTerm)
  );

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA'
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-AO').format(date);
  };

  const totalPagamentos = pagamentos.reduce((sum, p) => sum + p.valor, 0);
  const pagamentosEsteMes = pagamentos.filter(p => p.mes_referente === "2024-09");

  return (
    <div className="p-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Arrecadado</p>
              <p className="text-2xl font-bold text-foreground">{formatCurrency(totalPagamentos)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <DollarSign className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Este Mês</p>
              <p className="text-2xl font-bold text-foreground">
                {formatCurrency(pagamentosEsteMes.reduce((sum, p) => sum + p.valor, 0))}
              </p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-lg border border-border p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pagamentos</p>
              <p className="text-2xl font-bold text-foreground">{pagamentos.length}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-full">
              <Eye className="h-6 w-6 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar por mês ou matrícula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button className="bg-[#2d5016] hover:bg-[#2d5016]/90">
          <Plus className="h-4 w-4 mr-2" />
          Registrar Pagamento
        </Button>
      </div>

      {/* Payments Table */}
      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  ID Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Matrícula
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Mês Referente
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Valor
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Data Pagamento
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Ações
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    Carregando pagamentos...
                  </td>
                </tr>
              ) : filteredPagamentos.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    Nenhum pagamento encontrado
                  </td>
                </tr>
              ) : (
                filteredPagamentos.map((pagamento) => (
                  <tr key={pagamento.id_pagamento} className="hover:bg-muted/50">
                    <td className="px-6 py-4 text-sm font-medium text-foreground">
                      #{pagamento.id_pagamento.toString().padStart(4, '0')}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {pagamento.id_matricula}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {new Date(pagamento.mes_referente + '-01').toLocaleDateString('pt-AO', { 
                        year: 'numeric', 
                        month: 'long' 
                      })}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold text-green-600">
                      {formatCurrency(pagamento.valor)}
                    </td>
                    <td className="px-6 py-4 text-sm text-foreground">
                      {formatDate(pagamento.data_pagamento)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Download className="h-4 w-4" />
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
    </div>
  );
}
