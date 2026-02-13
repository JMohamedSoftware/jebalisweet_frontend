import Header from '@/components/common/Header';
import DeliveryDashboardInteractive from './components/DeliveryDashboardInteractive';

export const metadata = {
    title: 'Tableau de Bord Livreur - Jebali Sweet',
    description: 'Gérez vos livraisons',
};

export default function DeliveryDashboardPage() {
    return (
        <>
            <Header />
            <DeliveryDashboardInteractive />
        </>
    );
}
