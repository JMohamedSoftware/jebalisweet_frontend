import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import HomepageInteractive from './homepage/components/HomepageInteractive';
import Footer from '@/components/common/Footer';

export const metadata: Metadata = {
    title: 'Accueil - Jebali Sweet',
    description: 'Découvrez Jebali Sweet, votre destination pour des chocolats artisanaux, bonbons, gâteaux et pâtisseries de qualité supérieure. Livraison rapide en Tunisie.',
};

export default function HomePage() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
                <HomepageInteractive />
            </main>
            <Footer />
        </div>
    );
}
