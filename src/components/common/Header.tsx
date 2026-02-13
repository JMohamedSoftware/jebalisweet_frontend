'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import CartIndicator from '@/components/common/CartIndicator';
import UserMenu from '@/components/common/UserMenu';
import MobileNavToggle from '@/components/common/MobileNavToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import BottomNavigation from '@/components/common/BottomNavigation';
import { useLanguage } from '@/context/LanguageContext';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const Header = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);
  const { t } = useLanguage();

  const navigationItems: NavigationItem[] = [
    { label: t('nav.home'), path: '/', icon: 'HomeIcon', roles: ['public', 'admin', 'livreur'] },
    { label: t('nav.products'), path: '/product-catalog', icon: 'ShoppingBagIcon', roles: ['public', 'admin'] },
    { label: t('nav.account'), path: '/login', icon: 'UserIcon', roles: ['public'] },
  ];

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          setUserRole(parsedUser.role || null);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Error loading user role:', error);
      }
    };

    loadUser();
    window.addEventListener('authChanged', loadUser);
    return () => window.removeEventListener('authChanged', loadUser);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const isActivePath = (path: string) => {
    return pathname === path;
  };

  return (
    <>
      <header
        className={`sticky top-0 z-100 transition-smooth ${isScrolled ? 'glass shadow-warm-md' : 'bg-card'
          }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center justify-between h-14 md:h-16 px-4 md:px-6">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center gap-3 transition-smooth hover:opacity-80"
                onClick={closeMobileMenu}
              >
                <img
                  src="/images/jebali_sweet_logo.png"
                  alt="Jebali Sweet Logo"
                  width="45"
                  height="45"
                  className="rounded-full object-cover transition-smooth hover:scale-105 shadow-sm border border-primary/20"
                />
                <span className="font-heading text-2xl font-semibold text-primary hidden sm:block">
                  Jebali Sweet
                </span>
              </Link>

              <nav className="hidden md:flex items-center gap-1">
                {navigationItems
                  .filter(item => {
                    if (userRole === 'livreur') {
                      return item.path === '/';
                    }
                    return true;
                  })
                  .slice(0, 2)
                  .map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`flex items-center gap-2 px-4 py-2 rounded-md transition-smooth font-medium ${isActivePath(item.path)
                        ? 'bg-primary text-primary-foreground'
                        : 'text-foreground hover:bg-muted'
                        }`}
                    >
                      <Icon name={item.icon as any} size={20} />
                      <span>{item.label}</span>
                    </Link>
                  ))}
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden sm:block">
                <LanguageSwitcher />
              </div>
              <div className="hidden md:flex items-center gap-4">
                {userRole !== 'livreur' && <CartIndicator />}
                <UserMenu />
              </div>
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onToggle={handleMobileMenuToggle}
              />
            </div>
          </div>
        </div>
      </header>

      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-300 md:hidden"
          onClick={closeMobileMenu}
        >
          <div className="absolute inset-0 bg-background" />
          <nav
            className="absolute top-16 right-0 bottom-0 w-80 bg-card shadow-warm-2xl animate-slide-in-right overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-2">
              {navigationItems
                .filter(item => {
                  // Hide items that are already in the BottomNavigation on mobile
                  const inBottomNav = ['/', '/product-catalog', '/login', '/shopping-cart'].includes(item.path);
                  if (inBottomNav) return false;

                  if (userRole === 'livreur') {
                    return item.path === '/' || item.path === '/login';
                  }
                  return true;
                })
                .map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-smooth font-medium ${isActivePath(item.path)
                      ? 'bg-primary text-primary-foreground'
                      : 'text-foreground hover:bg-muted'
                      }`}
                  >
                    <Icon name={item.icon as any} size={24} />
                    <span className="text-lg">{item.label}</span>
                  </Link>
                ))}
              <div className="px-4 py-2 border-b border-muted">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 px-4">{t('nav.language')}</p>
                <div className="flex justify-center">
                  <LanguageSwitcher />
                </div>
              </div>
            </div>
          </nav>
        </div>
      )}
      <BottomNavigation />
    </>
  );
};

export default Header;