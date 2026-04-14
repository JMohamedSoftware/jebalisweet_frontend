import React from 'react';
import AdminHeroManagementInteractive from './components/AdminHeroManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Gestion du Hero - Jebali Sweet',
  description: 'Gérez l\'en-tête de votre page d\'accueil',
};

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const AdminHeroManagementPage = async () => {
  await delay(500); // Branded intro delay
  
  return (
    <AdminGuard>
      <AdminHeroManagementInteractive />
    </AdminGuard>
  );
};

export default AdminHeroManagementPage;
