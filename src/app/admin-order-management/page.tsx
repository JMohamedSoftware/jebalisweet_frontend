import React from 'react';
import AdminOrderManagementInteractive from './components/AdminOrderManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
  title: 'Gestion des Commandes - Jebali Sweet',
  description: 'Gérez les commandes de votre boutique',
};

export default function AdminOrderManagementPage() {
  return (
    <AdminGuard>
      <AdminOrderManagementInteractive />
    </AdminGuard>
  );
}