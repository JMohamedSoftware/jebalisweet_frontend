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

interface Address {
  id: string;
  label: string;
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  isDefault: boolean;
}

interface AddressBookTabProps {
  user: User;
  onUpdateUser: (user: User) => void;
}

const AddressBookTab = ({ user, onUpdateUser }: AddressBookTabProps) => {
  const [addresses, setAddresses] = useState<Address[]>([
    {
      id: '1',
      label: 'Domicile',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      address: user.address || '',
      city: user.city || '',
      postalCode: user.postalCode || '',
      phone: user.phone || '',
      isDefault: true,
    },
  ]);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    label: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    postalCode: '',
    phone: '',
    isDefault: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.label.trim()) {
      newErrors.label = 'Le libellé est requis';
    }

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'Le prénom est requis';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Le nom est requis';
    }

    if (!formData.address.trim()) {
      newErrors.address = 'L\'adresse est requise';
    }

    if (!formData.city.trim()) {
      newErrors.city = 'La ville est requise';
    }

    if (!formData.postalCode.match(/^[0-9]{5}$/)) {
      newErrors.postalCode = 'Code postal invalide (5 chiffres)';
    }

    if (!formData.phone.match(/^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/)) {
      newErrors.phone = 'Numéro de téléphone invalide';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleAddNew = () => {
    setIsAddingNew(true);
    setFormData({
      label: '',
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      address: '',
      city: '',
      postalCode: '',
      phone: user.phone || '',
      isDefault: false,
    });
  };

  const handleEdit = (address: Address) => {
    setEditingId(address.id);
    setFormData({
      label: address.label,
      firstName: address.firstName,
      lastName: address.lastName,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      phone: address.phone,
      isDefault: address.isDefault,
    });
  };

  const handleSave = () => {
    if (!validateForm()) return;

    if (editingId) {
      setAddresses((prev) =>
        prev.map((addr) =>
          addr.id === editingId
            ? { ...formData, id: editingId }
            : formData.isDefault
            ? { ...addr, isDefault: false }
            : addr
        )
      );
      setEditingId(null);
    } else {
      const newAddress: Address = {
        ...formData,
        id: Date.now().toString(),
      };
      if (formData.isDefault) {
        setAddresses((prev) => [
          newAddress,
          ...prev.map((addr) => ({ ...addr, isDefault: false })),
        ]);
      } else {
        setAddresses((prev) => [...prev, newAddress]);
      }
      setIsAddingNew(false);
    }

    setFormData({
      label: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      isDefault: false,
    });
    setErrors({});
  };

  const handleCancel = () => {
    setIsAddingNew(false);
    setEditingId(null);
    setFormData({
      label: '',
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      postalCode: '',
      phone: '',
      isDefault: false,
    });
    setErrors({});
  };

  const handleDelete = (id: string) => {
    setAddresses((prev) => prev.filter((addr) => addr.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setAddresses((prev) =>
      prev.map((addr) => ({
        ...addr,
        isDefault: addr.id === id,
      }))
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl font-semibold text-foreground">
          Carnet d'adresses
        </h2>
        {!isAddingNew && !editingId && (
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth"
          >
            <Icon name="PlusIcon" size={20} />
            Ajouter une adresse
          </button>
        )}
      </div>

      {(isAddingNew || editingId) && (
        <div className="bg-muted rounded-lg p-6 space-y-4">
          <h3 className="font-semibold text-foreground mb-4">
            {editingId ? 'Modifier l\'adresse' : 'Nouvelle adresse'}
          </h3>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Libellé</label>
            <input
              type="text"
              name="label"
              value={formData.label}
              onChange={handleInputChange}
              placeholder="Domicile, Bureau, etc."
              className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                errors.label ? 'border-error' : 'border-input focus:border-primary'
              }`}
            />
            {errors.label && (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.label}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Prénom</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.firstName ? 'border-error' : 'border-input focus:border-primary'
                }`}
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
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.lastName ? 'border-error' : 'border-input focus:border-primary'
                }`}
              />
              {errors.lastName && (
                <p className="text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.lastName}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Adresse</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="123 Rue de la Paix"
              className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                errors.address ? 'border-error' : 'border-input focus:border-primary'
              }`}
            />
            {errors.address && (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.address}
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Ville</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.city ? 'border-error' : 'border-input focus:border-primary'
                }`}
              />
              {errors.city && (
                <p className="text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.city}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-foreground">Code postal</label>
              <input
                type="text"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="75001"
                className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                  errors.postalCode ? 'border-error' : 'border-input focus:border-primary'
                }`}
              />
              {errors.postalCode && (
                <p className="text-sm text-error flex items-center gap-1">
                  <Icon name="ExclamationCircleIcon" size={16} />
                  {errors.postalCode}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-foreground">Téléphone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              placeholder="06 12 34 56 78"
              className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${
                errors.phone ? 'border-error' : 'border-input focus:border-primary'
              }`}
            />
            {errors.phone && (
              <p className="text-sm text-error flex items-center gap-1">
                <Icon name="ExclamationCircleIcon" size={16} />
                {errors.phone}
              </p>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleInputChange}
              className="w-4 h-4 rounded border-input text-primary focus:ring-3 focus:ring-ring"
            />
            <label htmlFor="isDefault" className="text-sm text-foreground cursor-pointer">
              Définir comme adresse par défaut
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSave}
              className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth"
            >
              Enregistrer
            </button>
            <button
              onClick={handleCancel}
              className="px-6 py-3 bg-muted text-foreground rounded-lg font-medium hover:bg-muted/80 transition-smooth"
            >
              Annuler
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {addresses.map((address) => (
          <div
            key={address.id}
            className="bg-background rounded-lg border border-border p-6 hover:shadow-warm transition-smooth"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-foreground">{address.label}</h3>
                  {address.isDefault && (
                    <span className="px-2 py-1 bg-primary/10 text-primary text-xs font-medium rounded">
                      Par défaut
                    </span>
                  )}
                </div>
                <p className="text-foreground">
                  {address.firstName} {address.lastName}
                </p>
                <p className="text-muted-foreground">{address.address}</p>
                <p className="text-muted-foreground">
                  {address.postalCode} {address.city}
                </p>
                <p className="text-muted-foreground">{address.phone}</p>
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-border">
              {!address.isDefault && (
                <button
                  onClick={() => handleSetDefault(address.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                >
                  <Icon name="StarIcon" size={20} />
                  Définir par défaut
                </button>
              )}
              <button
                onClick={() => handleEdit(address)}
                className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
              >
                <Icon name="PencilIcon" size={20} />
                Modifier
              </button>
              {addresses.length > 1 && (
                <button
                  onClick={() => handleDelete(address.id)}
                  className="flex items-center gap-2 px-4 py-2 bg-error/10 text-error rounded-lg hover:bg-error/20 transition-smooth font-medium"
                >
                  <Icon name="TrashIcon" size={20} />
                  Supprimer
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AddressBookTab;