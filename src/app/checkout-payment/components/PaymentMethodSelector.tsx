'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface PaymentMethodSelectorProps {
  selectedMethod: 'card' | 'paypal' | 'bank' | 'in_store';
  onSelectMethod: (method: 'card' | 'paypal' | 'bank' | 'in_store') => void;
}

const PaymentMethodSelector = ({ selectedMethod, onSelectMethod }: PaymentMethodSelectorProps) => {
  const paymentMethods = [
    {
      id: 'card' as const,
      label: 'Carte bancaire',
      description: 'Visa, Mastercard, American Express',
      icon: 'CreditCardIcon',
    },
    {
      id: 'paypal' as const,
      label: 'PayPal',
      description: 'Paiement sécurisé via PayPal',
      icon: 'BanknotesIcon',
    },
    {
      id: 'bank' as const,
      label: 'Virement bancaire',
      description: 'Paiement par virement SEPA',
      icon: 'BuildingLibraryIcon',
    },
    {
      id: 'in_store' as const,
      label: 'Paiement en boutique',
      description: 'Payez lors du retrait de votre commande',
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