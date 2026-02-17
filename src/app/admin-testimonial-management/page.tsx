import AdminTestimonialManagementInteractive from './components/AdminTestimonialManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata = {
    title: 'Gestion des Témoignages | Jebali Sweet Admin',
    description: 'Gérer les témoignages des clients sur le site'
};

export default function AdminTestimonialManagementPage() {
    return (
        <AdminGuard>
            <AdminTestimonialManagementInteractive />
        </AdminGuard>
    );
}
