import { Suspense } from 'react';
import OrderHistoryInteractive from './components/OrderHistoryInteractive';

export default function OrderHistoryPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Chargement...</div>}>
            <OrderHistoryInteractive />
        </Suspense>
    );
}
