import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import ShoppingCartInteractive from './components/ShoppingCartInteractive';

export const metadata: Metadata = {
  title: 'Panier - Jebali Sweet',
  description: 'Consultez et modifiez votre panier d\'achats avant de procéder au paiement. Gérez vos quantités et appliquez des codes promotionnels.',
};

export default function ShoppingCartPage() {
  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <ShoppingCartInteractive />
    </>
  );
}