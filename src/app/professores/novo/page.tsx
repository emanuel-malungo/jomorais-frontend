import { NovoProfessor } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function NovoProfessorPage() {
  return (
    <AdminLayout title="Novo Professor" description="Cadastre um novo professor na escola">
      <NovoProfessor />
    </AdminLayout>
  );
}
