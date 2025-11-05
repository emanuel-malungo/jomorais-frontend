import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { FilterOptionsProvider } from '@/contexts/FilterOptionsContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedRoute redirectTo="/">
      <FilterOptionsProvider>
        {children}
      </FilterOptionsProvider>
    </ProtectedRoute>
  );
}