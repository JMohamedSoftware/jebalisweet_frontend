import AdminUserManagementInteractive from './components/AdminUserManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Gestion des Utilisateurs | Jebali Sweet Admin',
    description: 'Gérer les comptes clients, livreurs et administrateurs.',
};

export default function AdminUserManagementPage() {
    return (
        <AdminGuard>
            <AdminUserManagementInteractive />
        </AdminGuard>
    );
}
