'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface CardDetails {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface CardPaymentFormProps {
  cardDetails: CardDetails;
  onUpdateCardDetails: (details: CardDetails) => void;
  errors: Record<string, string>;
}

const CardPaymentForm = ({ cardDetails, onUpdateCardDetails, errors }: CardPaymentFormProps) => {
  const formatCardNumber = (value: string) => {
    const cleaned = value.replace(/\s/g, '');
    const chunks = cleaned.match(/.{1,4}/g);
    return chunks ? chunks.join(' ') : cleaned;
  };

  const formatExpiryDate = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (cleaned.length >= 2) {
      return `${cleaned.slice(0, 2)}/${cleaned.slice(2, 4)}`;
    }
    return cleaned;
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\s/g, '');
    if (value.length <= 16 && /^\d*$/.test(value)) {
      onUpdateCardDetails({ ...cardDetails, cardNumber: formatCardNumber(value) });
    }
  };

  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 4) {
      onUpdateCardDetails({ ...cardDetails, expiryDate: formatExpiryDate(value) });
    }
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 4 && /^\d*$/.test(value)) {
      onUpdateCardDetails({ ...cardDetails, cvv: value });
    }
  };

  const handleCardholderNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateCardDetails({ ...cardDetails, cardholderName: e.target.value });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-3 bg-muted rounded-lg">
        <Icon name="ShieldCheckIcon" size={20} className="text-success" />
        <p className="text-sm text-muted-foreground">
          Paiement sécurisé SSL - Vos données sont protégées
        </p>
      </div>

      <div className="space-y-2">
        <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground">
          Numéro de carte
        </label>
        <div className="relative">
          <input
            type="text"
            id="cardNumber"
            value={cardDetails.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="1234 5678 9012 3456"
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring data-text ${
              errors.cardNumber ? 'border-error' : 'border-input focus:border-primary'
            }`}
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
            <Icon name="CreditCardIcon" size={24} className="text-muted-foreground" />
          </div>
        </div>
        {errors.cardNumber && (
          <p className="text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.cardNumber}
          </p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="expiryDate" className="block text-sm font-medium text-foreground">
            Date d'expiration
          </label>
          <input
            type="text"
            id="expiryDate"
            value={cardDetails.expiryDate}
            onChange={handleExpiryDateChange}
            placeholder="MM/AA"
            className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring data-text ${
              errors.expiryDate ? 'border-error' : 'border-input focus:border-primary'
            }`}
          />
          {errors.expiryDate && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.expiryDate}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="cvv" className="block text-sm font-medium text-foreground">
            CVV
          </label>
          <div className="relative">
            <input
              type="text"
              id="cvv"
              value={cardDetails.cvv}
              onChange={handleCvvChange}
              placeholder="123"
              className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring data-text ${
                errors.cvv ? 'border-error' : 'border-input focus:border-primary'
              }`}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <Icon name="QuestionMarkCircleIcon" size={20} className="text-muted-foreground" />
            </div>
          </div>
          {errors.cvv && (
            <p className="text-sm text-error flex items-center gap-1">
              <Icon name="ExclamationCircleIcon" size={16} />
              {errors.cvv}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="cardholderName" className="block text-sm font-medium text-foreground">
          Nom du titulaire
        </label>
        <input
          type="text"
          id="cardholderName"
          value={cardDetails.cardholderName}
          onChange={handleCardholderNameChange}
          placeholder="JEAN DUPONT"
          className={`w-full px-4 py-3 bg-background border rounded-lg transition-smooth focus:outline-none focus:ring-3 focus:ring-ring uppercase ${
            errors.cardholderName ? 'border-error' : 'border-input focus:border-primary'
          }`}
        />
        {errors.cardholderName && (
          <p className="text-sm text-error flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {errors.cardholderName}
          </p>
        )}
      </div>
    </div>
  );
};

export default CardPaymentForm;