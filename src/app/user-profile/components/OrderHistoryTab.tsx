'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';

interface Order {
  id: string;
  items: any[];
  subtotal: number;
  deliveryCost: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: string;
  createdAt: string;
  paymentMethod: string;
}

const OrderHistoryTab = () => {
  const { t, language } = useLanguage();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadOrders = async () => {
      try {
        const data = await api.orders.getAll();
        setOrders(data);
      } catch (error) {
        console.error('Error loading orders:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-success bg-success/10';
      case 'processing':
        return 'text-warning bg-warning/10';
      case 'shipped':
        return 'text-primary bg-primary/10';
      case 'delivered':
        return 'text-success bg-success/10';
      case 'cancelled':
        return 'text-error bg-error/10';
      default:
        return 'text-muted-foreground bg-muted';
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`profile.orders.status.${status}`) || status;
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat(language === 'ar_tn' ? 'ar-TN' : 'fr-FR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-32 bg-muted rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Icon name="ClipboardDocumentListIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
        <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
          {t('profile.orders.noOrders')}
        </h3>
        <p className="text-muted-foreground mb-6">
          {t('profile.orders.empty')}
        </p>
        <Link
          href="/product-catalog"
          className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:opacity-90 transition-smooth"
        >
          <Icon name="ShoppingBagIcon" size={20} />
          {t('profile.orders.discover')}
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
        {t('profile.orders.history')}
      </h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="bg-background rounded-lg border border-border p-6 hover:shadow-warm transition-smooth"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h3 className="font-semibold text-foreground data-text">#{order.id.substring(0, 8).toUpperCase()}</h3>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                  {getStatusLabel(order.status)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {t('profile.orders.date')} {formatDate(order.createdAt)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground mb-1">{t('profile.orders.total')}</p>
              <p className="font-heading text-2xl font-bold text-primary data-text">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          <div className="border-t border-border pt-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1">
                <p className="text-sm text-muted-foreground">
                  {t('profile.orders.items', { count: order.items.length })}
                </p>
                <p className="text-sm text-muted-foreground">
                  {t('profile.orders.payment')}: {order.paymentMethod === 'card' ? t('checkout.onlinePayment') : order.paymentMethod === 'paypal' ? 'PayPal' : t('checkout.cashOnDelivery')}
                </p>
              </div>
              <div className="flex gap-3">
                <Link
                  href={`/order-details?orderId=${order.id}`}
                  className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                >
                  <Icon name="EyeIcon" size={20} />
                  {t('profile.orders.viewDetails')}
                </Link>
                <button
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium"
                >
                  <Icon name="ArrowPathIcon" size={20} />
                  {t('profile.orders.reorder')}
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderHistoryTab;