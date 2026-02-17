import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import AdminPromotionManagementInteractive from './components/AdminPromotionManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export const metadata: Metadata = {
    title: 'Gérer Promotions - Admin - Jebali Sweet',
    description: 'Gérez les offres spéciales et les bannières promotionnelles sur la page d\'accueil.',
};

export default function AdminPromotionManagementPage() {
    return (
        <AdminGuard>
            <>
                <Header />
                <div className="bg-background min-h-screen">
                    <BreadcrumbTrail />
                    <AdminPromotionManagementInteractive />
                </div>
            </>
        </AdminGuard>
    );
}
