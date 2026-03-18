'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useLanguage } from '@/context/LanguageContext';
import Icon from '@/components/ui/AppIcon';
import { API_ENDPOINT } from '@/config/api';

interface FormData {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    address: string;
    city: string;
    postalCode: string;
    role: 'client' | 'admin' | 'livreur';
    termsAccepted: boolean;
}

interface FormErrors {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    address?: string;
    city?: string;
    postalCode?: string;
    termsAccepted?: string;
}

const RegistrationForm = () => {
    const { t } = useLanguage();
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [showAddressFields, setShowAddressFields] = useState(true); // Always show address fields
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        postalCode: '',
        role: 'client',
        termsAccepted: false,
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [passwordStrength, setPasswordStrength] = useState<{
        score: number;
        label: string;
        color: string;
    }>({ score: 0, label: '', color: '' });

    useEffect(() => {
        setIsHydrated(true);
    }, []);

    // UseEffect for address fields removed to prevent focus jumping

    useEffect(() => {
        if (formData.password) {
            const strength = calculatePasswordStrength(formData.password);
            setPasswordStrength(strength);
        } else {
            setPasswordStrength({ score: 0, label: '', color: '' });
        }
    }, [formData.password]);

    const calculatePasswordStrength = (password: string) => {
        let score = 0;
        if (password.length >= 8) score++;
        if (password.length >= 12) score++;
        if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
        if (/\d/.test(password)) score++;
        if (/[^a-zA-Z0-9]/.test(password)) score++;

        const labels = [
            { label: t('auth.register.passwordStrength.veryWeak'), color: 'bg-error' },
            { label: t('auth.register.passwordStrength.weak'), color: 'bg-warning' },
            { label: t('auth.register.passwordStrength.medium'), color: 'bg-warning' },
            { label: t('auth.register.passwordStrength.strong'), color: 'bg-success' },
            { label: t('auth.register.passwordStrength.veryStrong'), color: 'bg-success' },
        ];

        return { score, ...labels[Math.min(score, 4)] };
    };

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        const phoneRegex = /^[\d\s+\-()]{8,15}$/;
        return phoneRegex.test(phone.trim());
    };

    const validatePostalCode = (code: string): boolean => {
        const postalRegex = /^[0-9]{4}$/;
        return postalRegex.test(code);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = t('auth.register.errors.firstName');
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = t('auth.register.errors.lastName');
        }

        if (!formData.email.trim()) {
            newErrors.email = t('auth.register.errors.emailRequired');
        } else if (!validateEmail(formData.email)) {
            newErrors.email = t('auth.register.errors.email');
        }

        if (!formData.phone.trim()) {
            newErrors.phone = t('auth.register.errors.phoneRequired');
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = t('auth.register.errors.phone');
        }

        if (!formData.password) {
            newErrors.password = t('auth.register.errors.password');
        } else if (formData.password.length < 8) {
            newErrors.password = t('auth.register.errors.password');
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.errors.confirmPasswordRequired');
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = t('auth.register.errors.confirmPassword');
        }

        if (showAddressFields) {
            if (!formData.address.trim()) {
                newErrors.address = t('auth.register.errors.address');
            }

            if (!formData.city.trim()) {
                newErrors.city = t('auth.register.errors.city');
            }

            if (!formData.postalCode.trim()) {
                newErrors.postalCode = t('auth.register.errors.postalCode');
            } else if (!validatePostalCode(formData.postalCode)) {
                newErrors.postalCode = t('auth.register.errors.postalCodeInvalid');
            }
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = t('auth.register.errors.terms');
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value, type } = e.target;
        const checked = (e.target as HTMLInputElement).checked;

        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));

        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({
                ...prev,
                [name]: undefined,
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);

        try {
            if (!isHydrated) return;

            const response = await fetch(`${API_ENDPOINT}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    firstName: formData.firstName,
                    lastName: formData.lastName,
                    email: formData.email,
                    password: formData.password,
                    phone: formData.phone,
                    address: formData.address,
                    city: formData.city,
                    postalCode: formData.postalCode,
                    role: formData.role
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                setErrors({ email: data.message || t('auth.register.errors.general') });
                setIsSubmitting(false);
                return;
            }

            // Successful registration
            // Determine redirect or action
            if (formData.role === 'livreur') {
                // Drivers are pending
                // alert removed
            }

            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Trigger storage event for other components (like Header)
                window.dispatchEvent(new Event('storage'));

                // alert removed

                // Redirect based on role
                if (formData.role === 'livreur') {
                    router.push('/login'); // Drivers still need to wait for approval
                } else {
                    router.push('/');
                }
            } else {
                // alert removed
                router.push('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ email: t('auth.register.errors.general') });
            setIsSubmitting(false);
        }
    };

    if (!isHydrated) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-2xl bg-card rounded-xl shadow-warm-lg p-8">
                    <div className="animate-pulse space-y-6">
                        <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
                        <div className="space-y-4">
                            <div className="h-12 bg-muted rounded" />
                            <div className="h-12 bg-muted rounded" />
                            <div className="h-12 bg-muted rounded" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto">
                <div className="bg-card rounded-3xl shadow-xl p-8 border border-border/10">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            {t('auth.register.title')}
                        </h1>
                        <p className="text-muted-foreground">
                            {t('auth.register.subtitle')}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    {t('auth.register.firstName')} <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.firstName ? 'border-error' : 'border-input/50'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                    placeholder={t('auth.register.placeholders.firstName')}
                                />
                                {errors.firstName && (
                                    <p className="mt-1 text-sm text-error flex items-center gap-1">
                                        <Icon name="ExclamationCircleIcon" size={16} />
                                        {errors.firstName}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label
                                    htmlFor="lastName"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    {t('auth.register.lastName')} <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-xl border ${errors.lastName ? 'border-error' : 'border-input/50'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                    placeholder={t('auth.register.placeholders.lastName')}
                                />
                                {errors.lastName && (
                                    <p className="mt-1 text-sm text-error flex items-center gap-1">
                                        <Icon name="ExclamationCircleIcon" size={16} />
                                        {errors.lastName}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                {t('auth.register.email')} <span className="text-error">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.email ? 'border-error' : 'border-input/50'
                                    } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                placeholder={t('auth.register.placeholders.email')}
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <Icon name="ExclamationCircleIcon" size={16} />
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="phone"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                {t('auth.register.phone')} <span className="text-error">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-xl border ${errors.phone ? 'border-error' : 'border-input/50'
                                    } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                placeholder={t('auth.register.placeholders.phone')}
                            />
                            {errors.phone && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <Icon name="ExclamationCircleIcon" size={16} />
                                    {errors.phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                {t('auth.register.password')} <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.password ? 'border-error' : 'border-input/50'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                    placeholder={t('auth.register.placeholders.password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    <Icon
                                        name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                                        size={20}
                                    />
                                </button>
                            </div>
                            {formData.password && (
                                <div className="mt-2">
                                    <div className="flex items-center gap-2 mb-1">
                                        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                                            <div
                                                className={`h-full ${passwordStrength.color} transition-smooth`}
                                                style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                                            />
                                        </div>
                                        <span className="text-xs text-muted-foreground">
                                            {passwordStrength.label}
                                        </span>
                                    </div>
                                </div>
                            )}
                            {errors.password && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <Icon name="ExclamationCircleIcon" size={16} />
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="confirmPassword"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                {t('auth.register.confirmPassword')} <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-xl border ${errors.confirmPassword ? 'border-error' : 'border-input/50'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                    placeholder={t('auth.register.placeholders.password')}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-smooth"
                                >
                                    <Icon
                                        name={showConfirmPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                                        size={20}
                                    />
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <Icon name="ExclamationCircleIcon" size={16} />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {showAddressFields && (
                            <div className="space-y-6 pt-6 border-t border-border animate-fade-in">
                                <h3 className="text-lg font-semibold text-foreground">
                                    {t('auth.register.shippingAddress')}
                                </h3>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-foreground mb-2"
                                    >
                                        {t('auth.register.address')} <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-xl border ${errors.address ? 'border-error' : 'border-input/50'
                                            } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                        placeholder={t('auth.register.placeholders.address')}
                                    />
                                    {errors.address && (
                                        <p className="mt-1 text-sm text-error flex items-center gap-1">
                                            <Icon name="ExclamationCircleIcon" size={16} />
                                            {errors.address}
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label
                                            htmlFor="city"
                                            className="block text-sm font-medium text-foreground mb-2"
                                        >
                                            {t('auth.register.city')} <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.city ? 'border-error' : 'border-input/50'
                                                } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                            placeholder={t('auth.register.placeholders.city')}
                                        />
                                        {errors.city && (
                                            <p className="mt-1 text-sm text-error flex items-center gap-1">
                                                <Icon name="ExclamationCircleIcon" size={16} />
                                                {errors.city}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label
                                            htmlFor="postalCode"
                                            className="block text-sm font-medium text-foreground mb-2"
                                        >
                                            {t('auth.register.postalCode')} <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            maxLength={5}
                                            className={`w-full px-4 py-3 rounded-xl border ${errors.postalCode ? 'border-error' : 'border-input/50'
                                                } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium`}
                                            placeholder={t('auth.register.placeholders.postalCode')}
                                        />
                                        {errors.postalCode && (
                                            <p className="mt-1 text-sm text-error flex items-center gap-1">
                                                <Icon name="ExclamationCircleIcon" size={16} />
                                                {errors.postalCode}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <label
                                htmlFor="role"
                                className="block text-sm font-medium text-foreground mb-2"
                            >
                                {t('auth.register.role')}
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-xl border border-input/50 bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                            >
                                <option value="client">{t('auth.register.client')}</option>
                                <option value="livreur">{t('auth.register.delivery')}</option>
                            </select>
                        </div>

                        <div>
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    name="termsAccepted"
                                    checked={formData.termsAccepted}
                                    onChange={handleInputChange}
                                    className="mt-1 w-5 h-5 rounded border-input text-primary focus:ring-3 focus:ring-ring cursor-pointer"
                                />
                                <span className="text-sm text-foreground group-hover:text-primary transition-smooth">
                                    {t('auth.register.terms').split(/({terms}|{privacy})/).map((part, i) => {
                                        if (part === '{terms}') {
                                            return <a key={i} href="/terms" className="text-primary hover:underline font-medium">{t('legal.terms')}</a>;
                                        }
                                        if (part === '{privacy}') {
                                            return <a key={i} href="/privacy" className="text-primary hover:underline font-medium">{t('legal.privacy')}</a>;
                                        }
                                        return part;
                                    })}
                                </span>
                            </label>
                            {errors.termsAccepted && (
                                <p className="mt-1 text-sm text-error flex items-center gap-1">
                                    <Icon name="ExclamationCircleIcon" size={16} />
                                    {errors.termsAccepted}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                    {t('auth.register.loading')}
                                </>
                            ) : (
                                <>
                                    <Icon name="UserPlusIcon" size={20} />
                                    {t('auth.register.submit')}
                                </>
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                {t('auth.register.haveAccount')}{' '}
                                <a
                                    href="/login"
                                    className="text-primary hover:underline font-medium transition-smooth"
                                >
                                    {t('auth.register.login')}
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-card rounded-2xl shadow-sm border border-border/20 p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Icon name="ShieldCheckIcon" size={32} className="text-success" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">
                                {t('auth.register.securityInfo.title')}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {t('auth.register.securityInfo.description')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
