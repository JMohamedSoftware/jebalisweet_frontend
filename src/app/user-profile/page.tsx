import Header from '@/components/common/Header';
import UserProfileInteractive from './components/UserProfileInteractive';
import Footer from '@/components/common/Footer';

export const metadata = {
  title: 'Mon Profil - Jebali Sweet',
  description: 'Gérez vos informations personnelles et préférences',
};

const UserProfilePage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <UserProfileInteractive />
      </main>
      <Footer />
    </div>
  );
};

export default UserProfilePage;