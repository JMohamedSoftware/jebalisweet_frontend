'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';
import AppImage from '@/components/ui/AppImage';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';

interface CartItemData {
  id: number;
  productId: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
}

interface OrderReviewPanelProps {
  cartItems: CartItemData[];
  subtotal: number;
  deliveryCost: number;
  taxAmount: number;
  discount: number;
  total: number;
  onConfirmPayment: () => void;
  isProcessing: boolean;
  isFormValid: boolean;
}

const OrderReviewPanel = ({
  cartItems,
  subtotal,
  deliveryCost,
  taxAmount,
  discount,
  total,
  onConfirmPayment,
  isProcessing,
  isFormValid,
}: OrderReviewPanelProps) => {
  const { t } = useLanguage();
  return (
    <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border sticky top-20">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
        {t('checkout.summary.title')}
      </h2>

      <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3">
            <div className="w-16 h-16 rounded-md overflow-hidden flex-shrink-0">
              <AppImage src={item.image} alt={item.alt} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium text-foreground truncate">{item.name}</h3>
              <p className="text-sm text-muted-foreground">{t('checkout.summary.qty')}: {item.quantity}</p>
              <p className="text-sm font-semibold text-primary data-text">
                {formatPrice(item.price * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 mb-6 border-t border-border pt-4">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t('checkout.summary.subtotal')}</span>
          <span className="data-text font-semibold text-foreground">
            {formatPrice(subtotal)}
          </span>
        </div>


        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">{t('checkout.summary.tax')}</span>
          <span className="data-text font-semibold text-foreground">
            {formatPrice(taxAmount)}
          </span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between items-center text-success">
            <span className="flex items-center gap-2">
              <Icon name="TagIcon" size={16} />
              {t('checkout.summary.discount')}
            </span>
            <span className="data-text font-semibold">
              -{formatPrice(discount)}
            </span>
          </div>
        )}

        <div className="border-t border-border pt-3">
          <div className="flex justify-between items-center">
            <span className="font-heading text-lg font-semibold text-foreground">{t('checkout.summary.total')}</span>
            <span className="data-text font-bold text-primary text-2xl">
              {formatPrice(total)}
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={onConfirmPayment}
        disabled={!isFormValid || isProcessing}
        className="w-full py-3 bg-primary text-primary-foreground rounded-lg font-heading font-semibold text-lg hover:opacity-90 transition-smooth shadow-warm-md hover:shadow-warm-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
      >
        {isProcessing ? (
          <>
            <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
            {t('checkout.payment.processing')}
          </>
        ) : (
          <>
            <Icon name="LockClosedIcon" size={20} />
            {t('checkout.payment.placeOrder')}
          </>
        )}
      </button>

      <div className="mt-4 space-y-2">
        <div className="flex items-center justify-center gap-2 text-muted-foreground caption">
          <Icon name="ShieldCheckIcon" size={16} />
          <span>{t('checkout.payment.secureInfo')}</span>
        </div>
        <div className="flex items-center justify-center gap-2 text-muted-foreground caption">
          <Icon name="TruckIcon" size={16} />
          <span>{t('checkout.shipping.deliveryTime')}</span>
        </div>
      </div>
    </div>
  );
};

export default OrderReviewPanel;