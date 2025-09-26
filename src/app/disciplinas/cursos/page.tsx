import AdminLayout from "@/components/layout/AdminLayout";
import { Cursos } from "@/components/pages";

export default function CursosPage() {
  return (
    <AdminLayout title="Cursos" description="Gerencie os cursos e programas educacionais">
      <Cursos />
    </AdminLayout>
  );
}
