import { Financeiro } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function FinanceiroPage() {
  return (
    <AdminLayout title="Financeiro" description="Visão geral das finanças da escola">
      <Financeiro />
    </AdminLayout>
  );
}
