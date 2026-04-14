'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { API_ENDPOINT } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';
import PageLoader from '@/components/ui/PageLoader';

export default function VerifyEmailForm() {
    const { t } = useLanguage();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isHydrated, setIsHydrated] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [email, setEmail] = useState<string | null>(null);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    useEffect(() => {
        setIsHydrated(true);
        setUserId(searchParams.get('userId'));
        setEmail(searchParams.get('email'));
    }, [searchParams]);

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) value = value.slice(-1);
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-focus next input
        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleSubmit = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        const otpCode = otp.join('');
        if (otpCode.length !== 6) return;

        setIsSubmitting(true);
        setError(null);

        try {
            const response = await fetch(`${API_ENDPOINT}/auth/verify-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, otp: otpCode }),
            });

            const data = await response.json();

            if (response.ok) {
                setSuccess(data.message);
                setTimeout(() => router.push('/login'), 2000);
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(t('common.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleResend = async () => {
        if (!userId || isResending) return;
        setIsResending(true);
        setError(null);
        setSuccess(null);

        try {
            const response = await fetch(`${API_ENDPOINT}/auth/resend-verification`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId }),
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess('Un nouveau code a été envoyé.');
            } else {
                setError(data.message);
            }
        } catch (err) {
            setError(t('common.error'));
        } finally {
            setIsResending(false);
        }
    };

    if (!isHydrated) return <PageLoader />;

    return (
        <div className="bg-card rounded-3xl shadow-2xl p-8 border border-border/10">
            <div className="text-center mb-10">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/10 rounded-full mb-6 text-primary">
                    <Icon name="EnvelopeOpenIcon" size={40} />
                </div>
                <h1 className="text-3xl font-bold text-foreground mb-3">Vérifiez votre Email</h1>
                <p className="text-muted-foreground leading-relaxed">
                    Nous avons envoyé un code de 6 chiffres à <br />
                    <span className="text-foreground font-semibold">{email || 'votre adresse email'}</span>
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="flex justify-between gap-2 sm:gap-4">
                    {otp.map((digit, index) => (
                        <input
                            key={index}
                            type="text"
                            maxLength={1}
                            value={digit}
                            ref={(el) => (inputRefs.current[index] = el)}
                            onChange={(e) => handleChange(index, e.target.value)}
                            onKeyDown={(e) => handleKeyDown(index, e)}
                            className="w-full h-14 sm:h-16 text-center text-2xl font-bold bg-background border border-input rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        />
                    ))}
                </div>

                {error && (
                    <div className="p-4 bg-error/10 border border-error rounded-xl flex items-center gap-3 text-error animate-shake">
                        <Icon name="ExclamationCircleIcon" size={20} />
                        <p className="text-sm font-medium">{error}</p>
                    </div>
                )}

                {success && (
                    <div className="p-4 bg-success/10 border border-success rounded-xl flex items-center gap-3 text-success animate-fade-in">
                        <Icon name="CheckCircleIcon" size={20} />
                        <p className="text-sm font-medium">{success}</p>
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting || otp.join('').length !== 6}
                    className="w-full py-4 bg-primary text-primary-foreground rounded-2xl font-bold shadow-lg shadow-primary/20 hover:shadow-xl hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {isSubmitting ? (
                        <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                    ) : (
                        'Vérifier le compte'
                    )}
                </button>

                <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Vous n'avez pas reçu le code ?{' '}
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={isResending}
                            className="text-primary font-bold hover:underline disabled:opacity-50"
                        >
                            {isResending ? 'Envoi en cours...' : 'Renvoyer'}
                        </button>
                    </p>
                </div>
            </form>
        </div>
    );
}
