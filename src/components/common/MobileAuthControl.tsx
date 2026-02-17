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

const MobileAuthControl = () => {
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
                } else {
                    setUser(null);
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

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
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

    // Unauthenticated: Show simple Login Icon
    if (!user) {
        return (
            <Link
                href="/login"
                className="flex items-center justify-center p-2 text-foreground hover:text-primary transition-smooth"
                aria-label={t('nav.login')}
            >
                <Icon name="UserIcon" size={24} />
            </Link>
        );
    }

    // Authenticated: Show Avatar/Initial with Dropdown
    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={toggleMenu}
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary text-primary-foreground font-semibold focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                aria-expanded={isOpen}
            >
                {(user.username || user.name || user.firstName || 'U').charAt(0).toUpperCase()}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-popover rounded-lg shadow-warm-lg z-200 animate-fade-in overflow-hidden border border-border">
                    <div className="p-3 border-b border-border bg-muted/30">
                        <p className="font-semibold text-sm truncate">
                            {user.username || user.name || (user.firstName ? `${user.firstName} ${user.lastName || ''}` : t('nav.user'))}
                        </p>
                    </div>

                    <div className="py-1">
                        <Link
                            href="/user-profile"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                        >
                            <Icon name="UserCircleIcon" size={18} />
                            <span>{t('nav.profile')}</span>
                        </Link>

                        {user.role !== 'livreur' && (
                            <Link
                                href="/orders"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center gap-3 px-4 py-2 text-sm text-popover-foreground hover:bg-muted transition-smooth"
                            >
                                <Icon name="ClipboardDocumentListIcon" size={18} />
                                <span>{t('nav.orders')}</span>
                            </Link>
                        )}

                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-2 w-full text-left text-sm text-error hover:bg-muted transition-smooth border-t border-border mt-1"
                        >
                            <Icon name="ArrowRightOnRectangleIcon" size={18} />
                            <span>{t('nav.logout')}</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MobileAuthControl;
