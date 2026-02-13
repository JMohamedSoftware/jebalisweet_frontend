'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { API_ENDPOINT } from '@/config/api';
import ForgotPasswordWizard from './ForgotPasswordWizard';

interface LoginFormProps {
  onSuccess: () => void;
  onForgotPassword: () => void; // Keeping this for backward compatibility if needed
}

interface FormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

interface FormErrors {
  email?: string;
  password?: string;
  general?: string;
}

const LoginForm = ({ onSuccess, onForgotPassword }: LoginFormProps) => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = 'L\'adresse e-mail est requise';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Veuillez entrer une adresse e-mail valide';
    }

    if (!formData.password.trim()) {
      newErrors.password = 'Le mot de passe est requis';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Le mot de passe doit contenir au moins 6 caractères';
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

    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch(`${API_ENDPOINT}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password
        })
      });

      const data = await response.json();

      if (response.ok) {
        if (isHydrated) {
          // Store minimal user info
          localStorage.setItem('user', JSON.stringify({
            ...data.user,
            name: data.user.username // for compatibility with components using .name
          }));
          localStorage.setItem('token', data.token);

          if (formData.rememberMe) {
            localStorage.setItem('rememberMe', 'true');
          }

          window.dispatchEvent(new Event('authChanged'));
        }

        onSuccess();

        // Redirect based on role
        if (data.user.role === 'admin') {
          router.push('/admin-dashboard');
        } else if (data.user.role === 'livreur') {
          router.push('/delivery-dashboard');
        } else {
          router.push('/');
        }
      } else {
        setErrors({
          general: data.message || 'Identifiants incorrects.'
        });
      }
    } catch (error) {
      setErrors({
        general: 'Erreur de connexion au serveur.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return (
      <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-warm-lg">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-muted rounded w-3/4 mx-auto" />
          <div className="space-y-4">
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
            <div className="h-12 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-xl shadow-warm-lg">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Connexion</h1>
        <p className="text-muted-foreground">
          Connectez-vous à votre compte Jebali Sweet
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {errors.general && (
          <div className="p-4 bg-error/10 border border-error rounded-lg flex items-start gap-3">
            <Icon
              name="ExclamationTriangleIcon"
              size={20}
              className="text-error flex-shrink-0 mt-0.5"
            />
            <p className="text-sm text-error">{errors.general}</p>
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-foreground"
          >
            Adresse e-mail
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                name="EnvelopeIcon"
                size={20}
                className="text-muted-foreground"
              />
            </div>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.email
                ? 'border-error focus:border-error' : 'border-input focus:border-primary'
                }`}
              placeholder="votre@email.fr"
              autoComplete="email"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-foreground"
          >
            Mot de passe
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Icon
                name="LockClosedIcon"
                size={20}
                className="text-muted-foreground"
              />
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className={`w-full pl-10 pr-12 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.password
                ? 'border-error focus:border-error' : 'border-input focus:border-primary'
                }`}
              placeholder="••••••••"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              <Icon
                name={showPassword ? 'EyeSlashIcon' : 'EyeIcon'}
                size={20}
                className="text-muted-foreground hover:text-foreground transition-smooth"
              />
            </button>
          </div>
          {errors.password && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.password}
            </p>
          )}
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleInputChange}
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-3 focus:ring-ring transition-smooth cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-sm text-foreground">Se souvenir de moi</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
            disabled={isLoading}
          >
            Mot de passe oublié ?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-primary text-primary-foreground rounded-lg font-semibold transition-smooth hover:opacity-90 focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon
                name="ArrowPathIcon"
                size={20}
                className="animate-spin"
              />
              <span>Connexion en cours...</span>
            </>
          ) : (
            <>
              <Icon name="ArrowRightOnRectangleIcon" size={20} />
              <span>Se connecter</span>
            </>
          )}
        </button>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas de compte ?{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-primary hover:text-primary/80 transition-smooth font-medium"
              disabled={isLoading}
            >
              Créer un compte
            </button>
          </p>
        </div>
      </form>

      {showForgotPassword && (
        <ForgotPasswordWizard
          onClose={() => setShowForgotPassword(false)}
        />
      )}
    </div>
  );
};

export default LoginForm;