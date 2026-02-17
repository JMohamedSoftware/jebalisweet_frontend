import AdminCategoryManagementInteractive from './components/AdminCategoryManagementInteractive';
import AdminGuard from '@/components/auth/AdminGuard';

export default function AdminCategoryManagementPage() {
    return (
        <AdminGuard>
            <AdminCategoryManagementInteractive />
        </AdminGuard>
    );
}
