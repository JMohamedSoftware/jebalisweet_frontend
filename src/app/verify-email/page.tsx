import React, { Suspense } from 'react';
import Header from '@/components/common/Header';
import BreadcrumbTrail from '@/components/common/BreadcrumbTrail';
import PageLoader from '@/components/ui/PageLoader';
import VerifyEmailForm from './components/VerifyEmailForm';

export const dynamic = 'force-dynamic';

export default function VerifyEmailPage() {
    return (
        <>
            <Header />
            <BreadcrumbTrail />
            <main className="min-h-[80vh] flex items-center justify-center bg-background py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Suspense fallback={<PageLoader />}>
                        <VerifyEmailForm />
                    </Suspense>
                </div>
            </main>
        </>
    );
}
