import type { Metadata } from 'next';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import LoginInteractive from './components/LoginInteractive';
import AppImage from '@/components/ui/AppImage';

export const metadata: Metadata = {
  title: 'Connexion - Jebali Sweet',
  description:
    'Connectez-vous à votre compte Jebali Sweet pour accéder à vos commandes, gérer votre profil et profiter de nos délicieuses confiseries.'
};

export default function LoginPage() {
  return (
    <>
      <Header />
      <BreadcrumbTrail />
      <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
        <div className="container mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="hidden lg:block">
              <div className="relative h-[600px] rounded-2xl overflow-hidden shadow-warm-xl">
                <AppImage
                  src="https://images.unsplash.com/photo-1596983475220-42c388adcbcf"
                  alt="Assortiment coloré de bonbons et confiseries françaises disposés artistiquement sur fond blanc"
                  className="w-full h-full object-cover"
                  priority />

                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/40 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <h2 className="text-4xl font-bold mb-4">
                    Bienvenue chez Jebali Sweet
                  </h2>
                  <p className="text-lg opacity-90">
                    Découvrez nos délicieuses confiseries artisanales et
                    profitez d&apos;une expérience sucrée inoubliable.
                  </p>
                </div>
              </div>
            </div>

            <div>
              <LoginInteractive />
            </div>
          </div>

          <div className="mt-16 grid sm:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />

                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Connexion Sécurisée
              </h3>
              <p className="text-sm text-muted-foreground">
                Vos données sont protégées avec un cryptage de niveau bancaire
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-secondary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-secondary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z" />

                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Accès Rapide
              </h3>
              <p className="text-sm text-muted-foreground">
                Connectez-vous en quelques secondes et commencez vos achats
              </p>
            </div>

            <div className="text-center p-6 bg-card rounded-2xl shadow-sm border border-border/10">
              <div className="w-16 h-16 mx-auto mb-4 bg-accent/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-accent"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24">

                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />

                </svg>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Multi-Rôles
              </h3>
              <p className="text-sm text-muted-foreground">
                Accès personnalisé pour clients, administrateurs et livreurs
              </p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-card border-t border-border py-8 mt-16">
        <div className="container mx-auto px-6 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Jebali Sweet. Tous droits
            réservés.
          </p>
        </div>
      </footer>
    </>);

}