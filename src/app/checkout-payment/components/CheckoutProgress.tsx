'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';

interface CheckoutProgressProps {
  currentStep: number;
}

const CheckoutProgress = ({ currentStep }: CheckoutProgressProps) => {
  const { t } = useLanguage();

  const steps = [
    { id: 1, label: t('checkout.steps.shipping'), icon: 'ShoppingCartIcon' },
    { id: 2, label: t('checkout.steps.payment'), icon: 'CreditCardIcon' },
    { id: 3, label: t('checkout.steps.confirmation'), icon: 'CheckCircleIcon' },
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between max-w-2xl mx-auto">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-smooth ${currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                  }`}
              >
                {currentStep > step.id ? (
                  <Icon name="CheckIcon" size={24} />
                ) : (
                  <Icon name={step.icon as any} size={24} />
                )}
              </div>
              <span
                className={`mt-2 text-sm font-medium ${currentStep >= step.id ? 'text-foreground' : 'text-muted-foreground'
                  }`}
              >
                {step.label}
              </span>
            </div>
            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 mx-4 mb-6">
                <div
                  className={`h-full transition-smooth ${currentStep > step.id ? 'bg-primary' : 'bg-muted'
                    }`}
                />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default CheckoutProgress;