import Header from '@/components/common/Header';
import AdminPromoCodesInteractive from './components/AdminPromoCodesInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Gestion des Codes Promo - Jebali Sweet',
  description: 'Gérer les codes promotionnels et les remises clients',
};

const AdminPromoCodesPage = () => {
  return (
    <AdminGuard>
      <Header />
      <AdminPromoCodesInteractive />
    </AdminGuard>
  );
};

export default AdminPromoCodesPage;
