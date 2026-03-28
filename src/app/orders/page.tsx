import { Suspense } from 'react';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import OrderHistoryInteractive from './components/OrderHistoryInteractive';

export default function OrderHistoryPage() {
    return (
        <>
            <Header />
            <BreadcrumbTrail />
            <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
                <OrderHistoryInteractive />
            </Suspense>
        </>
    );
}
