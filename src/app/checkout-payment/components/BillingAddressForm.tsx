'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface BillingAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  phone: string;
  useShippingAddress: boolean;
}

interface BillingAddressFormProps {
  billingAddress: BillingAddress;
  onUpdateBillingAddress: (address: BillingAddress) => void;
  errors: Record<string, string>;
}

const BillingAddressForm = ({ billingAddress, onUpdateBillingAddress, errors }: BillingAddressFormProps) => {
  const { t } = useLanguage();
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    onUpdateBillingAddress({
      ...billingAddress,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <input
          type="checkbox"
          id="useShippingAddress"
          name="useShippingAddress"
          checked={billingAddress.useShippingAddress}
          onChange={handleInputChange}
          className="w-4 h-4 rounded border-input text-primary focus:ring-3 focus:ring-ring"
        />
        <label htmlFor="useShippingAddress" className="text-sm text-foreground cursor-pointer">
          {t('checkout.shipping.useShippingAsBilling')}
        </label>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="firstName" className="block text-sm font-medium text-foreground">
            {t('checkout.shipping.firstName')}
          </label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={billingAddress.firstName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.firstName ? 'border-error' : 'border-input focus:border-primary'
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
          <label htmlFor="lastName" className="block text-sm font-medium text-foreground">
            {t('checkout.shipping.lastName')}
          </label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={billingAddress.lastName}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.lastName ? 'border-error' : 'border-input focus:border-primary'
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
        <label htmlFor="address" className="block text-sm font-medium text-foreground">
          {t('checkout.shipping.address')}
        </label>
        <input
          type="text"
          id="address"
          name="address"
          value={billingAddress.address}
          onChange={handleInputChange}
          placeholder={t('auth.register.placeholders.address')}
          className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.address ? 'border-error' : 'border-input focus:border-primary'
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
          <label htmlFor="city" className="block text-sm font-medium text-foreground">
            {t('checkout.shipping.city')}
          </label>
          <input
            type="text"
            id="city"
            name="city"
            value={billingAddress.city}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.city ? 'border-error' : 'border-input focus:border-primary'
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
          <label htmlFor="postalCode" className="block text-sm font-medium text-foreground">
            {t('checkout.shipping.postalCode')}
          </label>
          <input
            type="text"
            id="postalCode"
            name="postalCode"
            value={billingAddress.postalCode}
            onChange={handleInputChange}
            placeholder="75000"
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.postalCode ? 'border-error' : 'border-input focus:border-primary'
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
        <label htmlFor="phone" className="block text-sm font-medium text-foreground">
          {t('checkout.shipping.phone')}
        </label>
        <input
          type="tel"
          id="phone"
          name="phone"
          value={billingAddress.phone}
          onChange={handleInputChange}
          placeholder="06 12 34 56 78"
          className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring ${errors.phone ? 'border-error' : 'border-input focus:border-primary'
            }`}
        />
        {errors.phone && (
          <p className="text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.phone}
          </p>
        )}
      </div>
    </div>
  );
};

export default BillingAddressForm;