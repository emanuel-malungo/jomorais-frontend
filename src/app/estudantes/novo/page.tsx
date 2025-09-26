import { NovoEstudante } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function NovoEstudantePage() {
  return (
    <AdminLayout title="Nova Matrícula" description="Cadastre um novo estudante na escola">
      <NovoEstudante />
    </AdminLayout>
  );
}
