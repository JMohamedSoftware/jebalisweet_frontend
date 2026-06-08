'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface OrderSummaryProps {
  subtotal: number;
  deliveryCost: number;
  discount: number;
  total: number;
  onApplyPromoCode: (code: string) => void;
  promoCodeError: string;
  promoCodeSuccess: string;
  hasCustomItems?: boolean;
}

const OrderSummary = ({
  subtotal,
  deliveryCost,
  discount,
  total,
  onApplyPromoCode,
  promoCodeError,
  promoCodeSuccess,
  hasCustomItems,
}: OrderSummaryProps) => {
  const { t } = useLanguage();
  const [promoCode, setPromoCode] = useState('');

  const handleApplyPromoCode = () => {
    if (promoCode.trim()) {
      onApplyPromoCode(promoCode.trim());
    }
  };

  return (
    <div className="bg-card rounded-3xl shadow-lg border border-border/10 p-8 sticky top-20">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
        {t('cart.summary.title')}
      </h2>

      <div className="space-y-4 mb-6">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t('cart.summary.subtotal')}</span>
          <span className="data-text font-semibold text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>


        {discount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span className="flex items-center gap-2">
              <Icon name="TagIcon" size={16} />
              {t('cart.summary.discount')}
            </span>
            <span className="data-text font-semibold">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-4">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg font-semibold text-foreground">
              {t('cart.summary.total')}
            </span>
            <span className="data-text font-bold text-primary text-2xl">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <label htmlFor="promoCode" className="caption font-medium text-foreground mb-2 block">
          {t('cart.summary.promoCode')}
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            id="promoCode"
            value={promoCode}
            onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
            placeholder={t('cart.summary.apply')}
            className="flex-1 px-4 py-2 border border-input rounded-md bg-background text-foreground focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
          />
          <button
            onClick={handleApplyPromoCode}
            disabled={!promoCode.trim()}
            className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:opacity-90 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed font-medium"
          >
            {t('cart.summary.apply')}
          </button>
        </div>
        {promoCodeError && (
          <p className="caption text-error mt-2 flex items-center gap-1">
            <Icon name="ExclamationCircleIcon" size={16} />
            {promoCodeError}
          </p>
        )}
        {promoCodeSuccess && (
          <p className="caption text-success mt-2 flex items-center gap-1">
            <Icon name="CheckCircleIcon" size={16} />
            {promoCodeSuccess}
          </p>
        )}
      </div>

      {hasCustomItems && (
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 flex gap-3 mb-4">
          <Icon name="InformationCircleIcon" size={20} className="text-purple-600 flex-shrink-0" />
          <p className="text-[10px] text-purple-800 leading-tight">
            {t('cart.summary.customNote')}
          </p>
        </div>
      )}

      <Link
        href="/checkout-payment"
        className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-heading font-bold text-lg hover:-translate-y-0.5 transition-all duration-300 shadow-lg shadow-primary/20 block text-center"
      >
        {t('cart.summary.checkout')}
      </Link>

      <div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground caption">
        <Icon name="ShieldCheckIcon" size={16} />
        <span>{t('home.trust.payment.title')}</span>
      </div>
    </div>
  );
};

export default OrderSummary;