import { Notas } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function NotasPage() {
  return (
    <AdminLayout title="Notas" description="Gerencie as notas e avaliações dos estudantes">
      <Notas />
    </AdminLayout>
  );
}
