'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';
import { useLanguage } from '@/context/LanguageContext';

interface User {
  name: string;
  email: string;
  role: string;
}

interface DashboardStats {
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
  totalCustomers: number;
  salesChange: number;
  ordersChange: number;
  productsChange: number;
  customersChange: number;
}

interface RecentActivity {
  id: number;
  type: 'order' | 'customer' | 'product' | 'alert';
  message: string;
  timestamp: string;
  priority?: 'low' | 'medium' | 'high';
}

const AdminDashboardInteractive = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [pendingDrivers, setPendingDrivers] = useState<any[]>([]);
  const [pendingQuotesCount, setPendingQuotesCount] = useState(0);
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
    salesChange: 0,
    ordersChange: 0,
    productsChange: 0,
    customersChange: 0,
  });

  const [recentActivities, setRecentActivities] = useState<RecentActivity[]>([]);
  const [salesData, setSalesData] = useState<any[]>([]);

  useEffect(() => {
    setIsHydrated(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      if (parsedUser.role !== 'admin') {
        router.push('/homepage');
        return;
      }
      setUser(parsedUser);

      // Fetch real stats
      api.stats.getSummary()
        .then((data: any) => {
          setStats(prev => ({
            ...prev,
            totalSales: data.totalSales,
            totalOrders: data.totalOrders,
            totalProducts: data.totalProducts,
            totalCustomers: data.totalCustomers
          }));
          if (data.salesData) setSalesData(data.salesData);
          if (data.recentActivities) setRecentActivities(data.recentActivities);
        })
        .catch((err: any) => console.error("Failed to load stats", err));

      fetchPendingDrivers();

      // Fetch orders to check for pending quotes
      api.orders.getAll().then((orders: any[]) => {
        const count = orders.filter(o => o.status === 'pending_quote').length;
        setPendingQuotesCount(count);
      }).catch(console.error);

    } else {
      router.push('/login');
    }
  }, [router]);

  const fetchPendingDrivers = async () => {
    try {
      const drivers = await api.users.getPendingDrivers();
      setPendingDrivers(drivers);
    } catch (error) {
      console.error("Failed to fetch pending drivers", error);
    }
  };

  const handleDriverAction = async (id: string, action: 'active' | 'rejected') => {
    try {
      await api.users.updateStatus(id, action);
      fetchPendingDrivers(); // Refresh list
      alert(`Livreur ${action === 'active' ? 'approuvé' : 'rejeté'} avec succès.`);
    } catch (error) {
      alert("Erreur lors de l'action.");
    }
  };

  if (!isHydrated || !user) {
    return <PageLoader />;
  }

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order':
        return 'ShoppingBagIcon';
      case 'customer':
        return 'UserPlusIcon';
      case 'product':
        return 'CubeIcon';
      case 'alert':
        return 'ExclamationTriangleIcon';
      default:
        return 'BellIcon';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-muted-foreground';
      default:
        return 'text-foreground';
    }
  };

  const maxSales = Math.max(...salesData.map(d => d.sales));

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
            Tableau de Bord Administrateur
          </h1>
          <p className="text-muted-foreground">
            Bienvenue, {user.name}. Voici un aperçu de votre activité.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="BanknotesIcon" size={24} className="text-primary" />
              </div>
              <span className={`caption font-semibold ${stats.salesChange >= 0 ? 'text-success' : 'text-error'}`}>
                {stats.salesChange >= 0 ? '+' : ''}{stats.salesChange}%
              </span>
            </div>
            <h3 className="caption text-muted-foreground mb-1">{t('admin.dashboard.totalSales')}</h3>
            <p className="font-heading text-3xl font-bold text-foreground">
              {formatPrice(stats.totalSales)}
            </p>
          </div>

          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                <Icon name="ShoppingBagIcon" size={24} className="text-secondary" />
              </div>
              <span className={`caption font-semibold ${stats.ordersChange >= 0 ? 'text-success' : 'text-error'}`}>
                {stats.ordersChange >= 0 ? '+' : ''}{stats.ordersChange}%
              </span>
            </div>
            <h3 className="caption text-muted-foreground mb-1">{t('admin.dashboard.orders')}</h3>
            <p className="font-heading text-3xl font-bold text-foreground">{stats.totalOrders}</p>
          </div>

          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center">
                <Icon name="CubeIcon" size={24} className="text-accent" />
              </div>
              <span className={`caption font-semibold ${stats.productsChange >= 0 ? 'text-success' : 'text-error'}`}>
                {stats.productsChange >= 0 ? '+' : ''}{stats.productsChange}%
              </span>
            </div>
            <h3 className="caption text-muted-foreground mb-1">{t('admin.dashboard.products')}</h3>
            <p className="font-heading text-3xl font-bold text-foreground">{stats.totalProducts}</p>
          </div>

          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-success/10 flex items-center justify-center">
                <Icon name="UsersIcon" size={24} className="text-success" />
              </div>
              <span className={`caption font-semibold ${stats.customersChange >= 0 ? 'text-success' : 'text-error'}`}>
                {stats.customersChange >= 0 ? '+' : ''}{stats.customersChange}%
              </span>
            </div>
            <h3 className="caption text-muted-foreground mb-1">{t('admin.dashboard.customers')}</h3>
            <p className="font-heading text-3xl font-bold text-foreground">{stats.totalCustomers}</p>
          </div>
        </div>

        {pendingDrivers.length > 0 && (
          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border mb-8">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Validations Livreurs en Attente
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-3 font-semibold">Nom</th>
                    <th className="pb-3 font-semibold">Email</th>
                    <th className="pb-3 font-semibold">Téléphone</th>
                    <th className="pb-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingDrivers.map((driver) => (
                    <tr key={driver.id} className="border-b border-border last:border-0 hover:bg-muted/50 transition-colors">
                      <td className="py-4">{driver.username}</td>
                      <td className="py-4">{driver.email}</td>
                      <td className="py-4">{driver.phone || 'N/A'}</td>
                      <td className="py-4 flex gap-2">
                        <button
                          onClick={() => handleDriverAction(driver.id, 'active')}
                          className="px-3 py-1 bg-success text-white rounded text-sm hover:bg-success/90 transition-colors">
                          Accepter
                        </button>
                        <button
                          onClick={() => handleDriverAction(driver.id, 'rejected')}
                          className="px-3 py-1 bg-error text-white rounded text-sm hover:bg-error/90 transition-colors">
                          Refuser
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {pendingQuotesCount > 0 && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-6 mb-8 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                <Icon name="BanknotesIcon" size={24} className="text-accent" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-bold text-foreground">Devis en attente</h3>
                <p className="text-muted-foreground">Il y a {pendingQuotesCount} commande(s) qui nécessitent un devis de votre part.</p>
              </div>
            </div>
            <Link
              href="/admin-order-management?status=pending_quote"
              className="px-6 py-2 bg-accent text-accent-foreground rounded-lg font-bold hover:opacity-90 transition-smooth"
            >
              Gérer les devis
            </Link>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Performance des Ventes
            </h2>
            <div className="space-y-4">
              {salesData.map((data) => (
                <div key={data.month} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="caption font-medium text-foreground">{data.month}</span>
                    <span className="data-text text-muted-foreground">
                      {formatPrice(data.sales)}
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-primary h-full rounded-full transition-smooth"
                      style={{ width: `${(data.sales / maxSales) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
            <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
              Actions Rapides
            </h2>
            <div className="space-y-3">
              <Link
                href="/admin-product-management"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-smooth border border-primary/20"
              >
                <Icon name="CubeIcon" size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Gérer Produits</p>
                  <p className="caption text-muted-foreground">Ajouter, modifier, supprimer</p>
                </div>
              </Link>

              <Link
                href="/admin-category-management"
                className="flex items-center gap-3 p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-smooth border border-accent/20"
              >
                <Icon name="TagIcon" size={24} className="text-accent" />
                <div>
                  <p className="font-medium text-foreground">Gérer Catégories</p>
                  <p className="caption text-muted-foreground">Ajouter, supprimer</p>
                </div>
              </Link>

              <Link
                href="/admin-order-management"
                className="flex items-center gap-3 p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-smooth border border-secondary/20"
              >
                <Icon name="ClipboardDocumentListIcon" size={24} className="text-secondary" />
                <div>
                  <p className="font-medium text-foreground">Gérer Commandes</p>
                  <p className="caption text-muted-foreground">Suivre et traiter</p>
                </div>
              </Link>

              <Link
                href="/admin-user-management"
                className="flex items-center gap-3 p-4 bg-success/5 hover:bg-success/10 rounded-lg transition-smooth border border-success/20"
              >
                <Icon name="UsersIcon" size={24} className="text-success" />
                <div>
                  <p className="font-medium text-foreground">Gérer Clients</p>
                  <p className="caption text-muted-foreground">Comptes, rôles et statuts</p>
                </div>
              </Link>

              <Link
                href="/user-profile"
                className="flex items-center gap-3 p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-smooth border border-accent/20"
              >
                <Icon name="UserCircleIcon" size={24} className="text-accent" />
                <div>
                  <p className="font-medium text-foreground">Mon Profil</p>
                  <p className="caption text-muted-foreground">Paramètres du compte</p>
                </div>
              </Link>

              <Link
                href="/admin-testimonial-management"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-smooth border border-primary/20"
              >
                <Icon name="ChatBubbleLeftRightIcon" size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Gérer Témoignages</p>
                  <p className="caption text-muted-foreground">Ajouter, supprimer des avis</p>
                </div>
              </Link>

              <Link
                href="/admin-promotion-management"
                className="flex items-center gap-3 p-4 bg-secondary/5 hover:bg-secondary/10 rounded-lg transition-smooth border border-secondary/20"
              >
                <Icon name="TagIcon" size={24} className="text-secondary" />
                <div>
                  <p className="font-medium text-foreground">Gérer Promotions</p>
                  <p className="caption text-muted-foreground">Offre spéciale, bannières Noël</p>
                </div>
              </Link>

              <Link
                href="/admin-promo-codes"
                className="flex items-center gap-3 p-4 bg-primary/5 hover:bg-primary/10 rounded-lg transition-smooth border border-primary/20"
              >
                <Icon name="TagIcon" size={24} className="text-primary" />
                <div>
                  <p className="font-medium text-foreground">Gérer Codes Promo</p>
                  <p className="caption text-muted-foreground">Coupons et remises panier</p>
                </div>
              </Link>

              <Link
                href="/admin-hero-management"
                className="flex items-center gap-3 p-4 bg-accent/5 hover:bg-accent/10 rounded-lg transition-smooth border border-accent/20"
              >
                <Icon name="PhotoIcon" size={24} className="text-accent" />
                <div>
                  <p className="font-medium text-foreground">Gérer le Hero</p>
                  <p className="caption text-muted-foreground">Image d'accueil et slogan</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border">
          <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
            Activité Récente
          </h2>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <Link
                key={activity.id}
                href="/"
                className="flex items-start gap-4 px-4 py-2 border border-border rounded-lg hover:bg-muted transition-smooth"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${activity.priority === 'high' ? 'bg-error/10' : activity.priority === 'medium' ? 'bg-warning/10' : 'bg-muted'}`}>
                  <Icon
                    name={getActivityIcon(activity.type) as any}
                    size={20}
                    className={getPriorityColor(activity.priority)}
                  />
                </div>
                <div className="flex-1">
                  <p className="text-foreground font-medium">{activity.message}</p>
                  <p className="caption text-muted-foreground mt-1">{activity.timestamp}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboardInteractive;