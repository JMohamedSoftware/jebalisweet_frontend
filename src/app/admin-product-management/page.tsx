import React from 'react';
import AdminProductManagementInteractive from './components/AdminProductManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Gestion des Produits - Jebali Sweet',
  description: 'Gérez les produits de votre boutique',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AdminProductManagementPage = async () => {
  await delay(500); // Branded intro delay
  
  return (
    <AdminGuard>
      <AdminProductManagementInteractive />
    </AdminGuard>
  );
};

export default AdminProductManagementPage;