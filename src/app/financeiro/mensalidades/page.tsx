import { Mensalidades } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function MensalidadesPage() {
  return (
    <AdminLayout title="Mensalidades" description="Controle as mensalidades escolares">
      <Mensalidades />
    </AdminLayout>
  );
}
