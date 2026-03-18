'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface PaymentMethodSelectorProps {
  selectedMethod: 'card' | 'paypal' | 'bank' | 'in_store';
  onSelectMethod: (method: 'card' | 'paypal' | 'bank' | 'in_store') => void;
}

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) => {
  const { t } = useLanguage();

  const paymentMethods = [
    {
      id: 'card' as const,
      label: t('checkout.payment.card'),
      description: t('checkout.payment.cardDescription'),
      icon: 'CreditCardIcon',
    },
    {
      id: 'paypal' as const,
      label: t('checkout.payment.paypal'),
      description: t('checkout.payment.paypalDescription'),
      icon: 'BanknotesIcon',
    },
    {
      id: 'bank' as const,
      label: t('checkout.payment.bank'),
      description: t('checkout.payment.bankDescription'),
      icon: 'BuildingLibraryIcon',
    },
    {
      id: 'in_store' as const,
      label: t('checkout.payment.inStore'),
      description: t('checkout.payment.inStoreDescription'),
      icon: 'BuildingStorefrontIcon',
    },
  ];

  return (
    <div className="space-y-3">
      {paymentMethods.map((method) => (
        <button
          key={method.id}
          onClick={() => onSelectMethod(method.id)}
          className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-smooth text-left ${selectedMethod === method.id
            ? 'border-primary bg-primary/5' : 'border-border bg-background hover:border-primary/50'
            }`}
        >
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedMethod === method.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
              }`}
          >
            <Icon name={method.icon as any} size={24} />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground">{method.label}</h3>
            <p className="text-sm text-muted-foreground">{method.description}</p>
          </div>
          <div
            className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${selectedMethod === method.id ? 'border-primary' : 'border-border'
              }`}
          >
            {selectedMethod === method.id && (
              <div className="w-3 h-3 rounded-full bg-primary" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default PaymentMethodSelector;