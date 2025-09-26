import AdminLayout from "@/components/layout/AdminLayout";
import { Classes } from "@/components/pages";

export default function ClassesPage() {
  return (
    <AdminLayout title="Classes" description="Gerencie as classes do sistema educacional">
      <Classes />
    </AdminLayout>
  );
}
