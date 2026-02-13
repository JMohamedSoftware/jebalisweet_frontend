import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import RegistrationForm from './components/RegistrationForm';

export const metadata: Metadata = {
  title: 'Inscription - Jebali Sweet',
  description: 'Créez votre compte Jebali Sweet pour commander nos délicieuses confiseries artisanales et profiter de nos offres exclusives.',
};

export default function RegisterPage() {
  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <main className="min-h-screen">
        <RegistrationForm />
      </main>
    </>
  );
}