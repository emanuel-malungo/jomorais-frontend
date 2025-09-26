import { ListaEstudantes } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function EstudantesPage() {
  return (
    <AdminLayout title="Estudantes" description="Gerencie todos os estudantes da escola">
      <ListaEstudantes />
    </AdminLayout>
  );
}
