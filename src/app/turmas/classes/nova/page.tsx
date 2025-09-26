import AdminLayout from "@/components/layout/AdminLayout";
import NovaClassePage from "@/components/pages/turmas/classes/nova/page";

export default function NovaClasseRoutePage() {
  return (
    <AdminLayout title="Nova Classe" description="Crie uma nova classe no sistema educacional">
      <NovaClassePage />
    </AdminLayout>
  );
}
