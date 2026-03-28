import React from 'react';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import CheckoutPaymentInteractive from './components/CheckoutPaymentInteractive';

export const metadata = {
  title: 'Paiement - Jebali Sweet',
  description: 'Finalisez votre commande',
};

const CheckoutPaymentPage = () => {
  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <CheckoutPaymentInteractive />
    </>
  );
};

export default CheckoutPaymentPage;