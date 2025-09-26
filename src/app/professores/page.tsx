import { ListaProfessores } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function ProfessoresPage() {
  return (
    <AdminLayout title="Professores" description="Gerencie todos os professores da escola">
      <ListaProfessores />
    </AdminLayout>
  );
}
