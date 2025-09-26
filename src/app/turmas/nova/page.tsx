import { NovaTurma } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function NovaTurmaPage() {
  return (
    <AdminLayout title="Nova Turma" description="Cadastre uma nova turma na escola">
      <NovaTurma />
    </AdminLayout>
  );
}
