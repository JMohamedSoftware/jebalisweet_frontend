'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import { API_ENDPOINT } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';

interface Account {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone?: string;
    role: string;
}

interface ForgotPasswordWizardProps {
    onClose: () => void;
    onSuccess?: () => void;
}

const ForgotPasswordWizard = ({ onClose, onSuccess }: ForgotPasswordWizardProps) => {
    const { t } = useLanguage();
    const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);

    // Step 1: Find account by email
    const handleFindAccount = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            // Check if email exists
            const res = await fetch(`${API_ENDPOINT}/auth/check-email`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || t('auth.login.errors.emailInvalid'));

            // If account found, move to OTP step immediately
            // We don't need to select account since email is unique
            const account: Account = {
                id: data.user.id,
                firstName: data.user.firstName,
                lastName: data.user.lastName,
                email: data.user.email,
                phone: data.user.phone,
                role: 'client' // Default role or from API
            };

            setSelectedAccount(account);
            const success = await sendOTP(account.email);
            if (success) {
                setStep(2); // Skip account selection step as email is unique
            }

        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2 helper: Send OTP
    const sendOTP = async (userEmail: string) => {
        setLoading(true);
        try {
            const res = await fetch(`${API_ENDPOINT}/auth/forgot-password/send`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: userEmail }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            // Success, return true
            return true;
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_ENDPOINT}/auth/forgot-password/verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedAccount?.id, otp }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            setStep(3);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Step 4: Reset Password
    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError(t('auth.register.errors.confirmPassword'));
            return;
        }
        setLoading(true);
        setError('');
        try {
            const res = await fetch(`${API_ENDPOINT}/auth/forgot-password/reset`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId: selectedAccount?.id, otp, newPassword }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert(t('auth.forgotPassword.success'));
            if (onSuccess) onSuccess();
            else onClose(); // Close wizard if no onSuccess provided
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-300">
                <div className="p-6">
                    <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Icon name="key" className="w-8 h-8 text-primary" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{t('auth.forgotPassword.title')}</h2>
                        <p className="text-sm text-muted-foreground mt-2">
                            {step === 1 && t('auth.forgotPassword.step1')}
                            {step === 2 && t('auth.forgotPassword.step2')}
                            {step === 3 && t('auth.forgotPassword.step3')}
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                            <Icon name="alert-circle" className="w-4 h-4 shrink-0" />
                            {error}
                        </div>
                    )}

                    {step === 1 && (
                        <form onSubmit={handleFindAccount} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.login.email')}
                                </label>
                                <div className="relative">
                                    <Icon name="mail" className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors"
                                        placeholder={t('auth.register.placeholders.email')}
                                        required
                                    />
                                </div>
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
                            >
                                {loading ? t('common.loading') : t('common.next')}
                            </button>
                        </form>
                    )}

                    {step === 2 && (
                        <form onSubmit={handleVerifyOTP} className="space-y-4">
                            <p className="text-sm text-muted-foreground text-center">
                                {t('auth.forgotPassword.step2')} <strong>{email}</strong>
                            </p>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder={t('auth.forgotPassword.otpPlaceholder')}
                                className="w-full p-3 rounded-lg border border-input text-center tracking-widest text-lg"
                                maxLength={6}
                                required
                            />
                            <button type="submit" disabled={loading} className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold">
                                {loading ? t('common.loading') : t('auth.forgotPassword.submit')}
                            </button>
                            <button
                                type="button"
                                onClick={() => sendOTP(email)}
                                disabled={loading}
                                className="w-full py-2 text-sm text-primary hover:text-primary/80 transition-smooth underline"
                            >
                                {t('common.submit')} {t('auth.forgotPassword.otpLabel')}
                            </button>
                        </form>
                    )}

                    {step === 3 && (
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.forgotPassword.newPassword')}
                                </label>
                                <input
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                    placeholder={t('auth.register.placeholders.password')}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    {t('auth.forgotPassword.confirmNewPassword')}
                                </label>
                                <input
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="w-full p-2 rounded-lg border border-gray-300"
                                    placeholder={t('auth.register.placeholders.password')}
                                    required
                                    minLength={6}
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-semibold"
                            >
                                {loading ? t('common.loading') : t('auth.forgotPassword.updateSubmit')}
                            </button>
                        </form>
                    )}

                    <button
                        onClick={onClose}
                        className="w-full mt-4 py-2 text-sm text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        {t('common.cancel')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordWizard;
