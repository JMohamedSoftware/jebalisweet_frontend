'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface User {
  username?: string;
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  role: string;
}

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    const loadUser = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          setUser(JSON.parse(userData));
        }
      } catch (error) {
        console.error('Error loading user:', error);
      }
    };

    loadUser();

    const handleAuthChange = () => {
      loadUser();
    };

    window.addEventListener('authChanged', handleAuthChange);

    return () => {
      window.removeEventListener('authChanged', handleAuthChange);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    setUser(null);
    setIsOpen(false);
    window.dispatchEvent(new Event('authChanged'));
    router.push('/login');
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!user) {
    return (
      <Link
        href="/login"
        className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:opacity-90 focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3 font-medium"
      >
        <Icon name="UserIcon" size={20} />
        <span className="hidden sm:inline">{t('nav.login')}</span>
      </Link>
    );
  }

  return (
    <div className="relative" ref={menuRef}>
      <button
        onClick={toggleMenu}
        className="flex items-center gap-2 px-3 py-2 rounded-lg transition-smooth hover:bg-muted focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-semibold">
          {(user.username || user.name || user.firstName || 'U').charAt(0).toUpperCase()}
        </div>
        {user.username || user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : t('nav.user'))}
        <Icon
          name="ChevronDownIcon"
          size={16}
          className={`text-foreground transition-smooth ${isOpen ? 'rotate-180' : ''
            }`}
        />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-popover rounded-lg shadow-warm-lg z-200 animate-fade-in overflow-hidden border border-border">
          <div className="p-4 border-b border-border">
            <p className="font-semibold text-popover-foreground">
              {user.username || user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : t('nav.user'))}
            </p>
            <p className="text-sm text-muted-foreground">{user.email || ''}</p>
            <p className="text-xs text-muted-foreground mt-1 capitalize">
              {user.role}
            </p>
          </div>

          <div className="py-2">
            <Link
              href="/user-profile"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-2.5 text-popover-foreground hover:bg-muted transition-smooth"
            >
              <Icon name="UserCircleIcon" size={20} />
              <span>{t('nav.profile')}</span>
            </Link>

            {user.role !== 'livreur' && (
              <Link
                href="/orders"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-popover-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="ClipboardDocumentListIcon" size={20} />
                <span>{t('nav.orders')}</span>
              </Link>
            )}

            {user.role === 'admin' && (
              <Link
                href="/admin-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-popover-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="Cog6ToothIcon" size={20} />
                <span>{t('nav.admin')}</span>
              </Link>
            )}

            {user.role === 'livreur' && (
              <Link
                href="/delivery-dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 px-4 py-2.5 text-popover-foreground hover:bg-muted transition-smooth"
              >
                <Icon name="TruckIcon" size={20} />
                <span>{t('nav.delivery')}</span>
              </Link>
            )}
          </div>

          <div className="border-t border-border py-2">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-4 py-2.5 w-full text-left text-error hover:bg-muted transition-smooth"
            >
              <Icon name="ArrowRightOnRectangleIcon" size={20} />
              <span>{t('nav.logout')}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserMenu;