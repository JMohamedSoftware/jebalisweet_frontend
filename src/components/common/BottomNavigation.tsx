'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';

const BottomNavigation = () => {
    const pathname = usePathname();
    const { t } = useLanguage();
    const [userRole, setUserRole] = useState<string | null>(null);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const loadState = () => {
            const userData = localStorage.getItem('user');
            if (userData) {
                setUserRole(JSON.parse(userData).role || null);
            } else {
                setUserRole(null);
            }
        };

        const loadCartCount = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                setCartCount(0);
                return;
            }
            try {
                const data = await api.cart.get();
                if (data.items) {
                    const totalItems = data.items.reduce(
                        (sum: number, item: any) => sum + (item.quantity || 0),
                        0
                    );
                    setCartCount(totalItems);
                }
            } catch (error) {
                console.error('Error loading cart count in BottomNav:', error);
            }
        };

        loadState();
        loadCartCount();

        const handleCartUpdate = () => {
            loadCartCount();
        };

        window.addEventListener('authChanged', () => {
            loadState();
            loadCartCount();
        });
        window.addEventListener('cartUpdated', handleCartUpdate);

        return () => {
            window.removeEventListener('authChanged', loadState);
            window.removeEventListener('authChanged', loadCartCount);
            window.removeEventListener('cartUpdated', handleCartUpdate);
        };
    }, []);

    const navItems = [
        { label: t('nav.home'), path: '/', icon: 'HomeIcon' },
        { label: t('nav.products'), path: '/product-catalog', icon: 'ShoppingBagIcon' },
        { label: t('cart.title'), path: '/shopping-cart', icon: 'ShoppingCartIcon', count: cartCount },
        { label: t('nav.account'), path: '/login', icon: 'UserCircleIcon' },
    ];

    // Don't show for delivery drivers to keep their space focused
    if (userRole === 'livreur') return null;

    return (
        <nav className="fixed bottom-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-t border-border/50 md:hidden pb-safe">
            <div className="flex items-center justify-around h-16">
                {navItems.map((item) => {
                    const isActive = pathname === item.path;
                    return (
                        <Link
                            key={item.path}
                            href={item.path}
                            className={`relative flex flex-col items-center justify-center w-full h-full transition-all duration-300 ${isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                                }`}
                        >
                            <div className={`transition-transform duration-300 ${isActive ? 'scale-110 -translate-y-1' : ''}`}>
                                <Icon name={item.icon as any} size={24} />
                            </div>
                            <span className="text-[10px] font-medium mt-1 uppercase tracking-tighter">
                                {item.label}
                            </span>

                            {isActive && (
                                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-b-full shadow-[0_0_8px_rgba(var(--primary-rgb),0.5)]" />
                            )}

                            {item.count ? item.count > 0 && (
                                <span className="absolute top-2 right-[30%] bg-accent text-accent-foreground text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center animate-bounce-subtle">
                                    {item.count}
                                </span>
                            ) : null}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNavigation;
