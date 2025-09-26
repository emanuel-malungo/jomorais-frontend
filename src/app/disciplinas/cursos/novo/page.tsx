import AdminLayout from "@/components/layout/AdminLayout";
import NovoCursoPage from "@/components/pages/disciplinas/cursos/novo/page";

export default function NovoCursoRoutePage() {
  return (
    <AdminLayout title="Novo Curso" description="Crie um novo curso no sistema educacional">
      <NovoCursoPage />
    </AdminLayout>
  );
}
