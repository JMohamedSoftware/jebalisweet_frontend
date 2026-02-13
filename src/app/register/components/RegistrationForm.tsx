'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
            { label: 'Très faible', color: 'bg-error' },
            { label: 'Faible', color: 'bg-warning' },
            { label: 'Moyen', color: 'bg-warning' },
            { label: 'Fort', color: 'bg-success' },
            { label: 'Très fort', color: 'bg-success' },
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
        const postalRegex = /^[0-9]{5}$/;
        return postalRegex.test(code);
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.firstName.trim()) {
            newErrors.firstName = 'Le prénom est requis';
        }

        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = 'Format email invalide';
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Le téléphone est requis';
        } else if (!validatePhone(formData.phone)) {
            newErrors.phone = 'Format téléphone invalide (ex: 06 12 34 56 78)';
        }

        if (!formData.password) {
            newErrors.password = 'Le mot de passe est requis';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Le mot de passe doit contenir au moins 8 caractères';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Veuillez confirmer le mot de passe';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
        }

        if (showAddressFields) {
            if (!formData.address.trim()) {
                newErrors.address = "L'adresse est requise";
            }

            if (!formData.city.trim()) {
                newErrors.city = 'La ville est requise';
            }

            if (!formData.postalCode.trim()) {
                newErrors.postalCode = 'Le code postal est requis';
            } else if (!validatePostalCode(formData.postalCode)) {
                newErrors.postalCode = 'Code postal invalide (5 chiffres)';
            }
        }

        if (!formData.termsAccepted) {
            newErrors.termsAccepted = 'Vous devez accepter les conditions générales';
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
                setErrors({ email: data.message || "Une erreur s'est produite lors de l'inscription" });
                setIsSubmitting(false);
                return;
            }

            // Successful registration
            // Determine redirect or action
            if (formData.role === 'livreur') {
                // Drivers are pending
                alert("Votre compte livreur a été créé avec succès et est en attente de validation.");
            }

            if (data.token && data.user) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));

                // Trigger storage event for other components (like Header)
                window.dispatchEvent(new Event('storage'));

                // Custom success message
                const welcomeMsg = formData.role === 'livreur'
                    ? 'Inscription réussie ! Votre compte est en attente de validation.'
                    : `Bienvenue, ${formData.firstName} ! Votre compte a été créé avec succès.`;

                alert(welcomeMsg);

                // Redirect based on role
                if (formData.role === 'livreur') {
                    router.push('/login'); // Drivers still need to wait for approval
                } else {
                    router.push('/');
                }
            } else {
                alert('Inscription réussie ! Veuillez vous connecter.');
                router.push('/login');
            }
        } catch (error) {
            console.error('Registration error:', error);
            setErrors({ email: "Une erreur s'est produite lors de l'inscription" });
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
                <div className="bg-card rounded-xl shadow-warm-lg p-8">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-foreground mb-2">
                            Créer un compte
                        </h1>
                        <p className="text-muted-foreground">
                            Rejoignez Jebali Sweet et découvrez nos délicieuses confiseries
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="firstName"
                                    className="block text-sm font-medium text-foreground mb-2"
                                >
                                    Prénom <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="firstName"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.firstName ? 'border-error' : 'border-input'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                    placeholder="Jean"
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
                                    Nom <span className="text-error">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="lastName"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 rounded-lg border ${errors.lastName ? 'border-error' : 'border-input'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                    placeholder="Dupont"
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
                                Email <span className="text-error">*</span>
                            </label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-error' : 'border-input'
                                    } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                placeholder="jean.dupont@example.com"
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
                                Téléphone <span className="text-error">*</span>
                            </label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className={`w-full px-4 py-3 rounded-lg border ${errors.phone ? 'border-error' : 'border-input'
                                    } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                placeholder="12 34 56 78"
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
                                Mot de passe <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.password ? 'border-error' : 'border-input'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                    placeholder="••••••••"
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
                                Confirmer le mot de passe <span className="text-error">*</span>
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className={`w-full px-4 py-3 pr-12 rounded-lg border ${errors.confirmPassword ? 'border-error' : 'border-input'
                                        } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                    placeholder="••••••••"
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
                                    Adresse de livraison
                                </h3>

                                <div>
                                    <label
                                        htmlFor="address"
                                        className="block text-sm font-medium text-foreground mb-2"
                                    >
                                        Adresse <span className="text-error">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        className={`w-full px-4 py-3 rounded-lg border ${errors.address ? 'border-error' : 'border-input'
                                            } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                        placeholder="123 Rue de la Paix"
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
                                            Ville <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            value={formData.city}
                                            onChange={handleInputChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.city ? 'border-error' : 'border-input'
                                                } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                            placeholder="Paris"
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
                                            Code postal <span className="text-error">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            id="postalCode"
                                            name="postalCode"
                                            value={formData.postalCode}
                                            onChange={handleInputChange}
                                            maxLength={5}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.postalCode ? 'border-error' : 'border-input'
                                                } bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth`}
                                            placeholder="75001"
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
                                Type de compte
                            </label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleInputChange}
                                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                            >
                                <option value="client">Client</option>
                                <option value="livreur">Livreur</option>
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
                                    J'accepte les{' '}
                                    <a href="#" className="text-primary hover:underline font-medium">
                                        conditions générales d'utilisation
                                    </a>{' '}
                                    et la{' '}
                                    <a href="#" className="text-primary hover:underline font-medium">
                                        politique de confidentialité
                                    </a>
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
                            className="w-full px-6 py-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-smooth hover:opacity-90 focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                                    Création en cours...
                                </>
                            ) : (
                                <>
                                    <Icon name="UserPlusIcon" size={20} />
                                    Créer le compte
                                </>
                            )}
                        </button>

                        <div className="text-center pt-4 border-t border-border">
                            <p className="text-sm text-muted-foreground">
                                Vous avez déjà un compte ?{' '}
                                <a
                                    href="/login"
                                    className="text-primary hover:underline font-medium transition-smooth"
                                >
                                    Retour à la connexion
                                </a>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="mt-8 bg-card rounded-xl shadow-warm p-6">
                    <div className="flex items-start gap-4">
                        <div className="flex-shrink-0">
                            <Icon name="ShieldCheckIcon" size={32} className="text-success" />
                        </div>
                        <div>
                            <h3 className="font-semibold text-foreground mb-2">
                                Vos données sont sécurisées
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Nous utilisons les dernières technologies de cryptage pour protéger
                                vos informations personnelles. Vos données ne seront jamais partagées
                                avec des tiers sans votre consentement.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegistrationForm;
