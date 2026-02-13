'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';


interface User {
  username?: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface FormErrors {
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

const UserProfileInteractive = () => {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    role: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Le nom est requis';
    if (formData.phone && !/^(\+?\d{1,4}[-.\s]?)?(\(?\d{1,3}?\)?[-.\s]?)?[\d\s\-\.]{5,15}$/.test(formData.phone)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }
    if (formData.postalCode && !/^\d{5}$/.test(formData.postalCode)) {
      newErrors.postalCode = 'Code postal invalide (5 chiffres)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error for the field when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    const storedUser = localStorage.getItem('user'); // Still need this for initial ID/Auth check
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const userId = parsedUser.id || parsedUser._id;

      // Fetch fresh profile from API
      api.users.getProfile(userId)
        .then(profile => {
          setUser(profile);
          setFormData({
            name: profile.username || profile.name || '', // mapping username/name
            email: profile.email || '',
            role: profile.role || '',
            phone: profile.phone || '',
            address: profile.address || '',
            city: profile.city || '',
            postalCode: profile.postalCode || '',
          });
        })
        .catch(err => console.error("Failed to load profile", err));

    } else {
      router.push('/login');
    }
  }, [router]);

  // ... validateForm ...

  // ... handleInputChange ...

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    if (!user) return;

    setIsSaving(true);

    try {
      const userId = (user as any).id || (user as any)._id;
      const updatedProfile = await api.users.updateProfile(userId, formData);

      setUser(updatedProfile);
      // Update local storage user cache if needed, or just rely on API state
      localStorage.setItem('user', JSON.stringify(updatedProfile));
      window.dispatchEvent(new Event('authChanged')); // notify header

      setSuccessMessage('Profil mis à jour avec succès!');
    } catch (error) {
      console.error("Update failed", error);
      // setErrors({ general: 'Update failed' }); // Add error state usage if desired
    } finally {
      setIsSaving(false);
      setIsEditing(false);
      setTimeout(() => setSuccessMessage(''), 3000);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        role: user.role || '',
        phone: user.phone || '',
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
      });
    }
    setErrors({});
    setIsEditing(false);
  };

  if (!isHydrated || !user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="h-8 w-48 bg-muted rounded mx-auto mb-4" />
          <div className="h-4 w-32 bg-muted rounded mx-auto" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-3xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              Mon Profil
            </h1>
            <p className="text-muted-foreground">
              Gérez vos informations personnelles et préférences
            </p>
          </div>

          {successMessage && (
            <div className="mb-6 p-4 bg-success/10 border border-success rounded-lg flex items-center gap-3 animate-fade-in">
              <Icon name="CheckCircleIcon" size={20} className="text-success" />
              <p className="text-success font-medium">{successMessage}</p>
            </div>
          )}

          <div className="bg-card rounded-lg shadow-warm-md p-8 border border-border">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-heading text-3xl font-bold">
                  {(user?.username || user?.name || '?').charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="font-heading text-2xl font-semibold text-foreground">
                    {user?.username || user?.name || 'Utilisateur'}
                  </h2>
                  <p className="text-muted-foreground capitalize">{user?.role || 'Client'}</p>
                </div>
              </div>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium"
                >
                  <Icon name="PencilIcon" size={20} />
                  Modifier
                </button>
              )}
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="name" className="block caption font-medium text-foreground">
                    Nom complet *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.name ? 'border-error' : 'border-input'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  {errors.name && (
                    <p className="caption text-error flex items-center gap-1">
                      <Icon name="ExclamationCircleIcon" size={16} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="email" className="block caption font-medium text-foreground">
                    Adresse e-mail
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    disabled
                    className="w-full px-4 py-3 bg-muted border border-input rounded-lg opacity-60 cursor-not-allowed"
                  />
                  <p className="caption text-muted-foreground">L'email ne peut pas être modifié</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="phone" className="block caption font-medium text-foreground">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="+33 6 12 34 56 78"
                    className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.phone ? 'border-error' : 'border-input'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  {errors.phone && (
                    <p className="caption text-error flex items-center gap-1">
                      <Icon name="ExclamationCircleIcon" size={16} />
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="role" className="block caption font-medium text-foreground">
                    Rôle
                  </label>
                  <input
                    type="text"
                    id="role"
                    name="role"
                    value={formData.role}
                    disabled
                    className="w-full px-4 py-3 bg-muted border border-input rounded-lg opacity-60 cursor-not-allowed capitalize"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="address" className="block caption font-medium text-foreground">
                  Adresse
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  rows={3}
                  placeholder="Numéro et nom de rue"
                  className="w-full px-4 py-3 bg-background border border-input rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed resize-none"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="city" className="block caption font-medium text-foreground">
                    Ville
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="Paris"
                    className="w-full px-4 py-3 bg-background border border-input rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring disabled:opacity-60 disabled:cursor-not-allowed"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="postalCode" className="block caption font-medium text-foreground">
                    Code postal
                  </label>
                  <input
                    type="text"
                    id="postalCode"
                    name="postalCode"
                    value={formData.postalCode}
                    onChange={handleInputChange}
                    disabled={!isEditing}
                    placeholder="75001"
                    maxLength={5}
                    className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.postalCode ? 'border-error' : 'border-input'
                      } disabled:opacity-60 disabled:cursor-not-allowed`}
                  />
                  {errors.postalCode && (
                    <p className="caption text-error flex items-center gap-1">
                      <Icon name="ExclamationCircleIcon" size={16} />
                      {errors.postalCode}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex items-center gap-4 mt-8 pt-6 border-t border-border">
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                      Enregistrement...
                    </>
                  ) : (
                    <>
                      <Icon name="CheckIcon" size={20} />
                      Enregistrer
                    </>
                  )}
                </button>
                <button
                  onClick={handleCancel}
                  disabled={isSaving}
                  className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Annuler
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileInteractive;