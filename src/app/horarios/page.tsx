import { Horarios } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function HorariosPage() {
  return (
    <AdminLayout title="Horários" description="Gerencie os horários das aulas e atividades">
      <Horarios />
    </AdminLayout>
  );
}
