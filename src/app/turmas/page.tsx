import { ListaTurmas } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function TurmasPage() {
  return (
    <AdminLayout title="Turmas" description="Gerencie todas as turmas da escola">
      <ListaTurmas />
    </AdminLayout>
  );
}
