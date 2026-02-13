'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

interface User {
  id?: string;
  name: string;
  email: string;
  role: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface PersonalInfoTabProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const PersonalInfoTab = ({ user, onUpdateUser }: PersonalInfoTabProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPasswordChange, setShowPasswordChange] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [successMessage, setSuccessMessage] = useState('');

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = 'Email invalide';
    }

    if (formData.phone && !formData.phone.match(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!validateForm()) return;

    const updatedUser = {
      ...user,
      firstName: formData.firstName,
      lastName: formData.lastName,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      phone: formData.phone,
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    onUpdateUser(updatedUser);
    setIsEditing(false);
    setSuccessMessage('Informations mises à jour avec succès');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handlePasswordUpdate = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setErrors({ confirmPassword: 'Les mots de passe ne correspondent pas' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setErrors({ newPassword: 'Le mot de passe doit contenir au moins 8 caractères' });
      return;
    }

    setSuccessMessage('Mot de passe mis à jour avec succès');
    setShowPasswordChange(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg flex items-center gap-3">
          <Icon name="CheckCircleIcon" size={20} className="text-success" />
          <p className="text-success">{successMessage}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Informations personnelles
        </h2>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth"
          >
            <Icon name="PencilIcon" size={20} />
            Modifier
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Prénom</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
              errors.firstName ? 'border-error' : 'border-input focus:border-primary'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.firstName && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.firstName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Nom</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
              errors.lastName ? 'border-error' : 'border-input focus:border-primary'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.lastName && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.lastName}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            disabled={!isEditing}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
              errors.email ? 'border-error' : 'border-input focus:border-primary'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.email && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.email}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-foreground">Téléphone</label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            disabled={!isEditing}
            placeholder="06 12 34 56 78"
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
              errors.phone ? 'border-error' : 'border-input focus:border-primary'
            } ${!isEditing ? 'opacity-60 cursor-not-allowed' : ''}`}
          />
          {errors.phone && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.phone}
            </p>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="flex gap-3">
          <button
            onClick={handleSave}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth"
          >
            Enregistrer
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setFormData({
                firstName: user.firstName || '',
                lastName: user.lastName || '',
                email: user.email,
                phone: user.phone || '',
              });
              setErrors({});
            }}
            className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-smooth"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="border-t border-border pt-6">
        <button
          onClick={() => setShowPasswordChange(!showPasswordChange)}
          className="flex items-center gap-2 text-primary hover:text-secondary transition-smooth font-medium"
        >
          <Icon name="LockClosedIcon" size={20} />
          Changer le mot de passe
        </button>

        {showPasswordChange && (
          <div className="mt-4 space-y-4 p-4 bg-muted rounded-lg">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Mot de passe actuel
              </label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="w-full px-4 py-3 bg-background border border-input rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring focus:border-primary"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Nouveau mot de passe
              </label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.newPassword ? 'border-error' : 'border-input focus:border-primary'
                }`}
              />
              {errors.newPassword && (
                <p className="text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.newPassword}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">
                Confirmer le mot de passe
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.confirmPassword ? 'border-error' : 'border-input focus:border-primary'
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handlePasswordUpdate}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth"
              >
                Mettre à jour
              </button>
              <button
                onClick={() => {
                  setShowPasswordChange(false);
                  setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                  setErrors({});
                }}
                className="px-6 py-2 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-smooth"
              >
                Annuler
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonalInfoTab;