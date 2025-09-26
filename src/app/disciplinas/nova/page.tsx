import { NovaDisciplina } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function NovaDisciplinaPage() {
  return (
    <AdminLayout title="Nova Disciplina" description="Cadastre uma nova disciplina no currículo">
      <NovaDisciplina />
    </AdminLayout>
  );
}
