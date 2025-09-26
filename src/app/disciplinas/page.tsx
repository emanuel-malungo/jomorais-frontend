import { ListaDisciplinas } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function DisciplinasPage() {
  return (
    <AdminLayout title="Disciplinas" description="Gerencie todas as disciplinas da escola">
      <ListaDisciplinas />
    </AdminLayout>
  );
}
