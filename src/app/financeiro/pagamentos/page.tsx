import { Pagamentos } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function PagamentosPage() {
  return (
    <AdminLayout title="Pagamentos" description="Gerencie os pagamentos dos estudantes">
      <Pagamentos />
    </AdminLayout>
  );
}
