import Header from '@/components/common/Header';
import AdminDashboardInteractive from './components/AdminDashboardInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Tableau de Bord Admin - Jebali Sweet',
  description: 'Tableau de bord administrateur pour gérer les produits, commandes et clients',
};

const AdminDashboardPage = () => {
  return (
    <AdminGuard>
      <Header />
      <AdminDashboardInteractive />
    </AdminGuard>
  );
};

export default AdminDashboardPage;