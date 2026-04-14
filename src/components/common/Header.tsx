'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import CartIndicator from '@/components/common/CartIndicator';
import UserMenu from '@/components/common/UserMenu';
import MobileNavToggle from '@/components/common/MobileNavToggle';
import LanguageSwitcher from '@/components/common/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';

interface NavigationItem {
  label: string;
  path: string;
  icon: string;
  roles: string[];
}

const Header = () => {
  const { t } = useLanguage();
  const { wishlist } = useWishlist();
  const { setIsDrawerOpen } = useCart();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [userRole, setUserRole] = useState<string | null>(null);

  const favoritesCount = wishlist.length;

  const navigationItems: NavigationItem[] = [
    { label: t('nav.home'), path: '/', icon: 'HomeIcon', roles: ['public', 'admin', 'livreur'] },
    { label: t('nav.products'), path: '/product-catalog', icon: 'ShoppingBagIcon', roles: ['public', 'admin'] },
    { label: t('nav.wishlist') || 'Favoris', path: '/wishlist', icon: 'HeartIcon', roles: ['public', 'admin'] },
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
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
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

  const isHomePage = pathname === '/' || pathname === '/fr' || pathname === '/ar';

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[100] transition-colors duration-300 ease-out ${
          isHomePage 
            ? `${isScrolled ? 'bg-white/95 backdrop-blur-2xl shadow-warm-sm border-b border-black/[0.03]' : 'bg-transparent border-b border-transparent'}`
            : `bg-white/95 backdrop-blur-2xl border-b border-black/[0.03] shadow-sm`
        }`}
      >
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          {/* Mobile Header */}
          <div className="flex md:hidden items-center justify-between h-14 relative">
            <div className="flex items-center">
              <MobileNavToggle
                isOpen={isMobileMenuOpen}
                onToggle={handleMobileMenuToggle}
                inverse={isHomePage && !isScrolled}
              />
            </div>

            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link
                href="/"
                className="flex items-center transition-smooth hover:opacity-80"
                onClick={closeMobileMenu}
              >
                <img
                  src="/images/jebali_sweet_logo.png"
                  alt="Jebali Sweet Logo"
                  width="40"
                  height="40"
                  className="rounded-full object-cover shadow-sm"
                />
              </Link>
            </div>

            <div className="flex items-center gap-2">
              <CartIndicator inverse={isHomePage && !isScrolled} />
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden md:flex items-center justify-between h-16">
            <div className="flex items-center gap-12">
              <Link
                href="/"
                className="flex items-center gap-4 transition-smooth hover:opacity-80"
                onClick={closeMobileMenu}
              >
                <img
                  src="/images/jebali_sweet_logo.png"
                  alt="Jebali Sweet Logo"
                  width="48"
                  height="48"
                  className="rounded-full object-cover shadow-sm transition-transform duration-500 hover:rotate-12"
                />
                <span className={`font-heading text-2xl font-black tracking-tighter transition-colors duration-300 ${isHomePage && !isScrolled ? 'text-white drop-shadow-md' : 'text-primary'}`}>
                  Jebali Sweet
                </span>
              </Link>

              <nav className="flex items-center gap-2">
                {navigationItems
                  .filter(item => {
                    if (userRole === 'livreur') {
                      return item.path === '/';
                    }
                    return true;
                  })
                  .slice(0, 3)
                  .map((item) => (
                    <Link
                      key={item.path}
                      href={item.path}
                      className={`relative px-5 py-2 flex items-center group transition-all duration-300 ${
                        isActivePath(item.path)
                          ? isHomePage && !isScrolled ? 'text-primary' : 'text-primary'
                          : isHomePage && !isScrolled
                            ? 'text-white/90 hover:text-white font-medium'
                            : isScrolled ? 'text-foreground/70 hover:text-primary' : 'text-foreground/80 hover:text-primary font-medium'
                        }`}
                    >
                      <span className="text-[10px] font-black tracking-[0.3em] uppercase leading-none">
                        {item.label}
                      </span>
                      <span className={`absolute bottom-0 left-5 right-5 h-[1.5px] bg-primary transition-all duration-500 origin-left ${isActivePath(item.path) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-100'}`} />

                      {item.path === '/wishlist' && favoritesCount > 0 && (
                        <span className="ml-2 flex items-center justify-center min-w-[14px] h-[14px] rounded-full bg-primary/20 text-primary text-[8px] font-black">
                          {favoritesCount}
                        </span>
                      )}
                    </Link>
                  ))}
              </nav>
            </div>

            <div className="flex items-center gap-6">
              <div className="scale-90 opacity-80 hover:opacity-100 transition-opacity">
                <LanguageSwitcher inverse={isHomePage && !isScrolled} />
              </div>
              {userRole !== 'livreur' && <CartIndicator inverse={isHomePage && !isScrolled} />}
              <UserMenu inverse={isHomePage && !isScrolled} />
            </div>
          </div>
        </div>
      </header>

      {/* Spacer to push content down on non-homepage routes fix fixed position covering content */}
      {!isHomePage && <div className="h-16 md:h-20" />}

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-[300] md:hidden"
          onClick={closeMobileMenu}
        >
          <div className="absolute inset-0 bg-background/80 backdrop-blur-md" />
          <nav
            className="absolute top-0 right-0 bottom-0 w-80 bg-background shadow-2xl animate-fade-in-right overflow-y-auto border-l border-border/10"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 flex justify-between items-center border-b border-border/5">
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-primary">Menu Principal</span>
              <button onClick={closeMobileMenu} className="p-2 hover:bg-muted rounded-full transition-colors">
                <Icon name="XMarkIcon" size={24} />
              </button>
            </div>
            
            <div className="py-4">
              {navigationItems
                .filter(item => {
                  if (userRole === 'livreur') return item.path === '/';
                  // Only show login to public users (non-logged in)
                  if (item.path === '/login' && userRole) return false;
                  return true;
                })
                .map((item) => (
                  <Link
                    key={item.path}
                    href={item.path}
                    onClick={closeMobileMenu}
                    className={`flex items-center justify-between px-8 py-5 border-b border-border/5 transition-all ${
                      isActivePath(item.path) ? 'bg-primary/5 text-primary text-xl font-black' : 'text-foreground/80'
                    }`}
                  >
                    <span className="text-sm font-bold tracking-widest uppercase">{item.label}</span>
                    <Icon name="ChevronRightIcon" size={16} className="opacity-30" />
                  </Link>
                ))}
            </div>

            <div className="p-8 mt-4 border-t border-border/5">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40 mb-6">Paramètres</p>
              <LanguageSwitcher />
            </div>
          </nav>
        </div>
      )}
    </>
  );
};

export default Header;