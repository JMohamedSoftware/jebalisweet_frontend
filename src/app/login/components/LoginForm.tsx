'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { API_ENDPOINT } from '@/config/api';
import { useLanguage } from '@/context/LanguageContext';
import ForgotPasswordWizard from './ForgotPasswordWizard';
import PageLoader from '@/components/ui/PageLoader';

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
  const { t } = useLanguage();
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
      newErrors.email = t('auth.login.errors.emailRequired');
    } else if (!validateEmail(formData.email)) {
      newErrors.email = t('auth.login.errors.emailInvalid');
    }

    if (!formData.password.trim()) {
      newErrors.password = t('auth.login.errors.passwordRequired');
    } else if (formData.password.length < 6) {
      newErrors.password = t('auth.login.errors.passwordShort');
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

          // Sync token to cookie for Next.js Middleware Route Protection
          // Secure flag is important if HTTPS is used
          document.cookie = `auth_token=${data.token}; path=/; max-age=604800; SameSite=Lax; Secure`;

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
          general: data.message || t('auth.login.errors.invalid')
        });
      }
    } catch (error) {
      setErrors({
        general: t('common.error')
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!isHydrated) {
    return <PageLoader />;
  }

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-card rounded-3xl shadow-xl border border-border/10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">{t('auth.login.title')}</h1>
        <p className="text-muted-foreground">
          {t('auth.login.subtitle')}
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
            {t('auth.login.email')}
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
              className={`w-full pl-10 pr-4 py-3 bg-background border rounded-xl font-medium transition-all focus:outline-none focus:ring-3 focus:ring-primary/20 ${errors.email
                ? 'border-error focus:border-error' : 'border-input focus:border-primary'
                }`}
              placeholder={t('auth.register.placeholders.email')}
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
            {t('auth.login.password')}
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
              className={`w-full pl-10 pr-12 py-3 bg-background border rounded-xl font-medium transition-all focus:outline-none focus:ring-3 focus:ring-primary/20 ${errors.password
                ? 'border-error focus:border-error' : 'border-input focus:border-primary'
                }`}
              placeholder={t('auth.register.placeholders.password')}
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
              className="w-4 h-4 text-primary bg-background border-input rounded focus:ring-3 focus:ring-primary/20 transition-all cursor-pointer"
              disabled={isLoading}
            />
            <span className="text-sm text-foreground">{t('auth.login.rememberMe') || 'Se souvenir de moi'}</span>
          </label>

          <button
            type="button"
            onClick={() => setShowForgotPassword(true)}
            className="text-sm text-primary hover:text-primary/80 transition-smooth font-medium"
            disabled={isLoading}
          >
            {t('auth.login.forgotPassword')}
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-4 px-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <Icon
                name="ArrowPathIcon"
                size={20}
                className="animate-spin"
              />
              <span>{t('auth.login.loading')}</span>
            </>
          ) : (
            <>
              <Icon name="ArrowRightOnRectangleIcon" size={20} />
              <span>{t('auth.login.submit')}</span>
            </>
          )}
        </button>

        <div className="text-center pt-4 border-t border-border">
          <p className="text-sm text-muted-foreground">
            {t('auth.login.noAccount')}{' '}
            <button
              type="button"
              onClick={() => router.push('/register')}
              className="text-primary hover:text-primary/80 transition-smooth font-medium"
              disabled={isLoading}
            >
              {t('auth.login.register')}
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