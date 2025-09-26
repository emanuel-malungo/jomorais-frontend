import { RelatoriosFinanceiros } from "@/components/pages";
import AdminLayout from "@/components/layout/AdminLayout";

export default function RelatoriosFinanceirosPage() {
  return (
    <AdminLayout title="Relatórios Financeiros" description="Visualize relatórios e análises financeiras">
      <RelatoriosFinanceiros />
    </AdminLayout>
  );
}
