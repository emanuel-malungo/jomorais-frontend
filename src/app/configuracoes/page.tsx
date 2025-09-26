import { Configuracoes } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function ConfiguracoesPage() {
  return (
    <AdminLayout title="Configurações" description="Configure as preferências do sistema">
      <Configuracoes />
    </AdminLayout>
  );
}
