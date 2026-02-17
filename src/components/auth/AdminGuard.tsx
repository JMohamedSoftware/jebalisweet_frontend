'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AdminGuardProps {
    children: React.ReactNode;
}

const AdminGuard: React.FC<AdminGuardProps> = ({ children }) => {
    const router = useRouter();
    const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

    useEffect(() => {
        const checkAuth = () => {
            const userData = localStorage.getItem('user');
            const token = localStorage.getItem('token');

            if (!userData || !token) {
                setIsAuthorized(false);
                router.push('/login');
                return;
            }

            try {
                const user = JSON.parse(userData);
                if (user.role === 'admin') {
                    setIsAuthorized(true);
                } else {
                    setIsAuthorized(false);
                    router.push('/homepage');
                }
            } catch (error) {
                setIsAuthorized(false);
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    // Loading state
    if (isAuthorized === null) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    return isAuthorized ? <>{children}</> : null;
};

export default AdminGuard;
