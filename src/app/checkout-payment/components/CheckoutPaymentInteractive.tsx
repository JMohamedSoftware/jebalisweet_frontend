'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { useLanguage } from '@/context/LanguageContext';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';

interface CartItemData {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  alt: string;
  comment?: string;
  customImage?: string;
  customOptions?: any;
}

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
}

interface PromoDiscount {
  value: number;
  type: 'percentage' | 'fixed';
}

interface User {
  name: string;
  email: string;
  phone?: string;
  address?: string;
  city?: string;
  postalCode?: string;
}

interface ShippingFormData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  additionalInfo: string;
}

interface PaymentFormData {
  cardNumber: string;
  cardName: string;
  expiryDate: string;
  cvv: string;
}

const CheckoutPaymentInteractive = () => {
  const { t } = useLanguage();
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cartItems, setCartItems] = useState<CartItemData[]>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    additionalInfo: '',
  });
  const [paymentData, setPaymentData] = useState<PaymentFormData>({
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'bank' | 'in_store'>('in_store');
  const [deliveryOption, setDeliveryOption] = useState<'standard' | 'express' | 'pickup'>('pickup');
  const [isProcessing, setIsProcessing] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isQuoteRequest, setIsQuoteRequest] = useState(false);


  useEffect(() => {
    setIsHydrated(true);
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setShippingData((prev) => ({
        ...prev,
        fullName: parsedUser.name || '',
        email: parsedUser.email || '',
        phone: parsedUser.phone || '',
        address: parsedUser.address || '',
        city: parsedUser.city || '',
        postalCode: parsedUser.postalCode || '',
      }));
    } else {
      router.push('/login');
      return;
    }

    const loadCheckoutData = async () => {
      try {
        const data = await api.cart.get();
        if (data.items && data.items.length > 0) {
          setCartItems(data.items.map((item: any) => ({
            ...item,
            alt: item.name
          })));

          setIsQuoteRequest(data.items.some((item: any) => item.customImage));
          
          // Load and auto-apply promo code from localStorage
          const savedPromoCode = localStorage.getItem('currentPromoCode');
          if (savedPromoCode) {
            try {
              const promoData = await api.promoCodes.validate(savedPromoCode);
              const subtotalVal = data.items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
              const discountAmount = promoData.type === 'percentage' 
                ? (subtotalVal * promoData.discount / 100) 
                : promoData.discount;
              setDiscount(discountAmount);
              setPromoCode(savedPromoCode);
            } catch (pError) {
              console.error('Saved promo code invalid or expired', pError);
              localStorage.removeItem('currentPromoCode');
            }
          }
        } else {
          router.push('/shopping-cart');
        }
      } catch (error) {
        console.error('Failed to load checkout cart:', error);
        router.push('/shopping-cart');
      }
    };

    loadCheckoutData();
  }, [router]);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getDeliveryCost = () => {
    return 0;
  };

  const deliveryCost = getDeliveryCost();
  const total = subtotal + deliveryCost - discount;

  const handleShippingInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setShippingData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePaymentInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    let formattedValue = value;

    if (name === 'cardNumber') {
      formattedValue = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
    } else if (name === 'expiryDate') {
      formattedValue = value.replace(/\D/g, '').replace(/(\d{2})(\d{0,2})/, '$1/$2').substring(0, 5);
    } else if (name === 'cvv') {
      formattedValue = value.replace(/\D/g, '').substring(0, 3);
    }

    setPaymentData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleApplyPromoCode = async () => {
    const upperCode = promoCode.toUpperCase();
    try {
      const data = await api.promoCodes.validate(upperCode);
      const discountAmount = data.type === 'percentage' 
        ? (subtotal * data.discount / 100) 
        : data.discount;
      setDiscount(discountAmount);
      setPromoCode(upperCode);
    } catch (error) {
      console.error('Code promo invalide', error);
      setDiscount(0);
    }
  };

  const validateShippingForm = (): boolean => {
    return (
      shippingData.fullName.trim() !== '' &&
      shippingData.email.trim() !== '' &&
      shippingData.phone.trim() !== '' &&
      shippingData.address.trim() !== '' &&
      shippingData.city.trim() !== '' &&
      shippingData.postalCode.trim() !== ''
    );
  };

  const validatePaymentForm = (): boolean => {
    if (paymentMethod === 'card') {
      return (
        paymentData.cardNumber.replace(/\s/g, '').length === 16 &&
        paymentData.cardName.trim() !== '' &&
        paymentData.expiryDate.length === 5 &&
        paymentData.cvv.length === 3
      );
    }
    return true;
  };

  const handleContinueToPayment = () => {
    if (validateShippingForm()) {
      setCurrentStep(2);
    }
  };

  const handlePlaceOrder = async () => {
    if (!isQuoteRequest && !validatePaymentForm()) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderData = {
        items: cartItems.map((item) => ({
          productId: item.productId,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          comment: item.comment || '',
          customImage: item.customImage || null,
          customOptions: item.customOptions || null,
        })),
        total: isQuoteRequest ? 0 : total,
        deliveryAddress: deliveryOption === 'pickup' ? 'Retrait en magasin' : `${shippingData.address}, ${shippingData.postalCode} ${shippingData.city}`,
        paymentMethod: paymentMethod === 'card' ? 'Carte Bancaire' :
          paymentMethod === 'paypal' ? 'PayPal' :
            paymentMethod === 'bank' ? 'Virement Bancaire' : 'Paiement en boutique',
        phone: shippingData.phone,
        deliveryOption,
        promoCode: discount > 0 ? promoCode : null,
        discountAmount: discount
      };

      await api.orders.create(orderData);

      // Clear promo code from localStorage
      localStorage.removeItem('currentPromoCode');

      // Cart is cleared on the backend during order creation
      // Small timeout ensures backend operations are fully completed before frontend refresh
      setTimeout(() => {
        window.dispatchEvent(new Event('cartUpdated'));
      }, 500);

      setIsProcessing(false);

      if (isQuoteRequest) {
        // Pour les devis, rediriger vers "Mes Devis"
        router.push('/orders?tab=quotes');
      } else {
        // Pour les commandes normales, afficher la confirmation
        setCurrentStep(3);
      }
    } catch (error) {
      console.error('Failed to place order:', error);
      setIsProcessing(false);
      alert(t('checkout.orderError'));
    }
  };

  if (!isHydrated || !user) {
    return <PageLoader />;
  }

  if (currentStep === 3) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-md w-full mx-6">
          <div className="bg-card rounded-3xl shadow-xl p-10 border border-border/10 text-center animate-fade-in">
            <div className="w-20 h-20 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="CheckCircleIcon" size={48} className="text-success" />
            </div>
            <h1 className="font-heading text-3xl font-bold text-foreground mb-4">
              {t('checkout.success.title')}
            </h1>
            <p className="text-muted-foreground mb-6">
              {t('checkout.success.message', { email: shippingData.email })}
            </p>
            <div className="bg-background rounded-2xl p-6 mb-8 text-left border border-border/10">
              <h3 className="font-heading text-lg font-semibold text-foreground mb-4 pb-2 border-b border-border/10">
                {t('checkout.success.summaryTitle') || 'Détails de la commande'}
              </h3>
              
              <div className="space-y-3 mb-6">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.name} <span className="text-xs">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-foreground">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="pt-2 border-t border-border/10 flex justify-between font-bold text-base">
                  <span className="text-foreground">{t('checkout.summary.total')}</span>
                  <span className="text-primary">{formatPrice(total)}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-border/10">
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    {t('checkout.shipping.title')}
                  </p>
                  <p className="text-xs text-foreground leading-relaxed">
                    {deliveryOption === 'pickup' ? t('checkout.delivery.pickup') : `${shippingData.address}, ${shippingData.city}`}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-muted-foreground uppercase mb-1">
                    {t('checkout.shipping.phone')}
                  </p>
                  <p className="text-xs text-foreground font-medium" dir="ltr">
                    {shippingData.phone}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Link
                href="/orders"
                className="block w-full py-3.5 bg-primary text-primary-foreground rounded-xl hover:opacity-90 shadow-md shadow-primary/20 transition-all font-bold"
              >
                {t('checkout.success.viewOrders')}
              </Link>
              <Link
                href="/"
                className="block w-full py-3.5 bg-muted text-foreground rounded-xl hover:bg-muted/80 transition-all font-medium"
              >
                {t('checkout.success.backHome')}
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="font-heading text-4xl font-bold text-foreground mb-4">
              {t('checkout.title')}
            </h1>
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${currentStep >= 1 ? 'text-primary' : 'text-muted-foreground'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 1 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                  1
                </div>
                <span className="font-medium">{t('checkout.steps.shipping')}</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${currentStep >= 2 ? 'text-primary' : 'text-muted-foreground'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 2 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                  2
                </div>
                <span className="font-medium">{t('checkout.steps.payment')}</span>
              </div>
              <div className="flex-1 h-0.5 bg-border" />
              <div className={`flex items-center gap-2 ${currentStep >= 3 ? 'text-primary' : 'text-muted-foreground'
                }`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${currentStep >= 3 ? 'bg-primary text-primary-foreground' : 'bg-muted'
                  }`}>
                  3
                </div>
                <span className="font-medium">{t('checkout.steps.confirmation')}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {currentStep === 1 && (
                <div className="bg-card rounded-2xl shadow-sm p-8 border border-border/20">
                  <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                    {t('checkout.shipping.title')}
                  </h2>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="fullName" className="block caption font-medium text-foreground">
                          {t('checkout.shipping.fullName')} *
                        </label>
                        <input
                          type="text"
                          id="fullName"
                          name="fullName"
                          value={shippingData.fullName}
                          onChange={handleShippingInputChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="email" className="block caption font-medium text-foreground">
                          {t('checkout.shipping.email')} *
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={shippingData.email}
                          onChange={handleShippingInputChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="phone" className="block caption font-medium text-foreground">
                        {t('checkout.shipping.phone')} *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={shippingData.phone}
                        onChange={handleShippingInputChange}
                        required
                        placeholder="+216 -- --- ---"
                        dir="ltr"
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="address" className="block caption font-medium text-foreground">
                        {t('checkout.shipping.address')} *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingData.address}
                        onChange={handleShippingInputChange}
                        required
                        placeholder={t('auth.register.placeholders.address')}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label htmlFor="city" className="block caption font-medium text-foreground">
                          {t('checkout.shipping.city')} *
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={shippingData.city}
                          onChange={handleShippingInputChange}
                          required
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                      <div className="space-y-2">
                        <label htmlFor="postalCode" className="block caption font-medium text-foreground">
                          {t('checkout.shipping.postalCode')} *
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={shippingData.postalCode}
                          onChange={handleShippingInputChange}
                          required
                          maxLength={5}
                          className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="additionalInfo" className="block caption font-medium text-foreground">
                        {t('checkout.shipping.additionalInfo')}
                      </label>
                      <textarea
                        id="additionalInfo"
                        name="additionalInfo"
                        value={shippingData.additionalInfo}
                        onChange={handleShippingInputChange}
                        rows={3}
                        placeholder={t('checkout.shipping.additionalInfoPlaceholder')}
                        className="w-full px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth resize-none"
                      />
                    </div>

                    <div className="space-y-4 mt-8">
                      <h3 className="font-heading text-lg font-semibold text-foreground">{t('checkout.shipping.method')}</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="relative group">
                          <label className="cursor-not-allowed border-2 rounded-xl p-4 border-border/50 opacity-50 bg-muted/30 block">
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="standard"
                              disabled
                              className="hidden"
                            />
                            <div className="flex flex-col items-center text-center gap-2">
                              <Icon name="TruckIcon" size={24} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium text-muted-foreground">{t('checkout.shipping.standard')}</p>
                                <p className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold mt-1">
                                  {t('checkout.shipping.soon')}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>

                        <div className="relative group">
                          <label className="cursor-not-allowed border-2 rounded-xl p-4 border-border/50 opacity-50 bg-muted/30 block">
                            <input
                              type="radio"
                              name="deliveryOption"
                              value="express"
                              disabled
                              className="hidden"
                            />
                            <div className="flex flex-col items-center text-center gap-2">
                              <Icon name="RocketLaunchIcon" size={24} className="text-muted-foreground" />
                              <div>
                                <p className="font-medium text-muted-foreground">{t('checkout.shipping.express')}</p>
                                <p className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold mt-1">
                                  {t('checkout.shipping.soon')}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>

                        <label className={`cursor-pointer border-2 rounded-xl p-4 transition-all duration-300 hover:bg-muted/50 ${deliveryOption === 'pickup' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50'}`}>
                          <input
                            type="radio"
                            name="deliveryOption"
                            value="pickup"
                            checked={deliveryOption === 'pickup'}
                            onChange={() => setDeliveryOption('pickup')}
                            className="hidden"
                          />
                          <div className="flex flex-col items-center text-center gap-2">
                            <Icon name="BuildingStorefrontIcon" size={24} className="text-primary" />
                            <div>
                              <p className="font-medium text-foreground">{t('checkout.shipping.pickup')}</p>
                              <p className="caption text-muted-foreground">{t('checkout.shipping.inStore')}</p>
                              <p className="font-semibold text-primary mt-1">{t('checkout.shipping.free')}</p>
                            </div>
                          </div>
                        </label>
                      </div>
                    </div>

                    <button
                      onClick={handleContinueToPayment}
                      disabled={!validateShippingForm()}
                      className="w-full py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
                    >
                      {t('checkout.shipping.continueToPayment')}
                    </button>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="bg-card rounded-2xl shadow-sm p-8 border border-border/20">
                    <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                      {t('checkout.payment.title')}
                    </h2>
                    {isQuoteRequest ? (
                      <div className="p-6 bg-primary/5 border border-primary/20 rounded-lg">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                            <Icon name="InformationCircleIcon" size={24} className="text-primary" />
                          </div>
                          <div>
                            <h3 className="font-heading font-semibold text-foreground mb-1">{t('checkout.payment.quotePending')}</h3>
                            <p className="text-muted-foreground text-sm">
                              {t('checkout.payment.quoteInfo')}
                            </p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-4 mb-6">
                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-not-allowed border-border/50 opacity-50 bg-muted/30">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="card"
                            disabled
                            className="w-5 h-5"
                          />
                          <Icon name="CreditCardIcon" size={24} className="text-muted-foreground" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">{t('checkout.payment.card')}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                              {t('checkout.shipping.soon')}
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-not-allowed border-border/50 opacity-50 bg-muted/30">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="paypal"
                            disabled
                            className="w-5 h-5"
                          />
                          <Icon name="BanknotesIcon" size={24} className="text-muted-foreground" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">{t('checkout.payment.paypal')}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                              {t('checkout.shipping.soon')}
                            </span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-4 border-2 rounded-xl cursor-not-allowed border-border/50 opacity-50 bg-muted/30">
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="bank"
                            disabled
                            className="w-5 h-5"
                          />
                          <Icon name="BuildingLibraryIcon" size={24} className="text-muted-foreground" />
                          <div className="flex-1 flex items-center justify-between">
                            <span className="font-medium text-muted-foreground">{t('checkout.payment.bank')}</span>
                            <span className="text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-bold">
                              {t('checkout.shipping.soon')}
                            </span>
                          </div>
                        </label>

                        <label className={`flex items-center gap-3 p-4 border-2 rounded-xl cursor-pointer transition-all duration-300 hover:bg-muted/50 ${paymentMethod === 'in_store' ? 'border-primary bg-primary/5 shadow-sm' : 'border-border/50'
                          }`}>
                          <input
                            type="radio"
                            name="paymentMethod"
                            value="in_store"
                            checked={paymentMethod === 'in_store'}
                            onChange={(e) => setPaymentMethod(e.target.value as any)}
                            className="w-5 h-5"
                          />
                          <Icon name="BuildingStorefrontIcon" size={24} className="text-foreground" />
                          <span className="font-medium text-foreground">{t('checkout.payment.inStore')}</span>
                        </label>
                      </div>
                    )}

                    {!isQuoteRequest && paymentMethod === 'card' && (
                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label htmlFor="cardNumber" className="block caption font-medium text-foreground">
                            {t('checkout.payment.cardNumber')} *
                          </label>
                          <input
                            type="text"
                            id="cardNumber"
                            name="cardNumber"
                            value={paymentData.cardNumber}
                            onChange={handlePaymentInputChange}
                            placeholder="1234 5678 9012 3456"
                            maxLength={19}
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>

                        <div className="space-y-2">
                          <label htmlFor="cardName" className="block caption font-medium text-foreground">
                            {t('checkout.payment.cardName')} *
                          </label>
                          <input
                            type="text"
                            id="cardName"
                            name="cardName"
                            value={paymentData.cardName}
                            onChange={handlePaymentInputChange}
                            placeholder="JEAN DUPONT"
                            className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label htmlFor="expiryDate" className="block caption font-medium text-foreground">
                              {t('checkout.payment.expiryDate')} *
                            </label>
                            <input
                              type="text"
                              id="expiryDate"
                              name="expiryDate"
                              value={paymentData.expiryDate}
                              onChange={handlePaymentInputChange}
                              placeholder="MM/AA"
                              maxLength={5}
                              className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                            />
                          </div>
                          <div className="space-y-2">
                            <label htmlFor="cvv" className="block caption font-medium text-foreground">
                              {t('checkout.payment.cvv')} *
                            </label>
                            <input
                              type="text"
                              id="cvv"
                              name="cvv"
                              value={paymentData.cvv}
                              onChange={handlePaymentInputChange}
                              placeholder="123"
                              maxLength={3}
                              className="w-full px-4 py-3 bg-background border border-input rounded-xl focus:outline-none focus:ring-3 focus:ring-primary/20 transition-all font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {paymentMethod === 'paypal' && (
                      <div className="p-4 bg-background rounded-lg">
                        <p className="text-muted-foreground caption">
                          {t('checkout.payment.paypalInfo')}
                        </p>
                      </div>
                    )}

                    {!isQuoteRequest && paymentMethod === 'bank' && (
                      <div className="p-4 bg-background rounded-lg">
                        <p className="text-muted-foreground caption mb-2">
                          {t('checkout.payment.bankInfo')}
                        </p>
                        <p className="data-text text-foreground">IBAN: FR76 1234 5678 9012 3456 7890 123</p>
                        <p className="data-text text-foreground">BIC: ABCDEFGH</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => setCurrentStep(1)}
                      className="px-6 py-3 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                    >
                      {t('checkout.payment.back')}
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={isProcessing || !validatePaymentForm()}
                      className="flex-1 py-4 bg-primary text-primary-foreground rounded-xl font-bold shadow-md shadow-primary/20 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isProcessing ? (
                        <span className="flex items-center justify-center gap-2">
                          <Icon name="ArrowPathIcon" size={20} className="animate-spin" />
                          {isQuoteRequest ? t('checkout.payment.sendingQuote') : t('checkout.payment.processing')}
                        </span>
                      ) : (
                        isQuoteRequest ? t('checkout.payment.submitQuote') : t('checkout.payment.placeOrder')
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <div className="bg-card rounded-3xl shadow-lg p-8 border border-border/10 sticky top-20">
                <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
                  {t('checkout.summary.title')}
                </h2>
                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground caption">{item.name}</p>
                        <p className="text-muted-foreground caption">{t('checkout.summary.qty')}: {item.quantity}</p>
                      </div>
                      <p className="data-text font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border pt-4 space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground caption">{t('checkout.summary.subtotal')}</span>
                    <span className="data-text text-foreground">
                      {formatPrice(subtotal)}
                    </span>
                  </div>
                  {discount > 0 && (
                    <div className="flex justify-between text-success">
                      <span className="caption">{t('checkout.summary.discount')}</span>
                      <span className="data-text">
                        -{formatPrice(discount)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between pt-3 border-t border-border">
                    <span className="font-heading text-lg font-semibold text-foreground">{t('checkout.summary.total')}</span>
                    <span className="font-heading text-2xl font-bold text-primary">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {currentStep === 1 && (
                  <div className="space-y-2">
                    <label htmlFor="promoCodeSummary" className="caption font-medium text-foreground">
                      {t('checkout.summary.promoCode')}
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="promoCodeSummary"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
                        placeholder="Code"
                        className="flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth caption"
                      />
                      <button
                        onClick={handleApplyPromoCode}
                        className="px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-smooth caption font-medium"
                      >
                        Appliquer
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPaymentInteractive;