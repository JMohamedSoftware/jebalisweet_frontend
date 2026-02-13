'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';
import { API_BASE_URL } from '@/config/api';
import { formatPrice } from '@/utils/format';

const OrderHistoryInteractive = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [orders, setOrders] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'all' | 'quotes'>(
        (searchParams.get('tab') as 'all' | 'quotes') || 'all'
    );
    const [isProcessingPayment, setIsProcessingPayment] = useState<string | null>(null);

    const isQuoteOrder = (order: any) => {
        return order.status === 'pending_quote' ||
            (order.items && order.items.some((item: any) => item.customImage));
    };

    const handlePayment = async (orderId: string) => {
        setIsProcessingPayment(orderId);
        setTimeout(async () => {
            try {
                // Persistent backend update
                await api.orders.updateStatus(orderId, 'confirmed');

                alert("Paiement réussi ! Votre commande est maintenant en cours de préparation.");

                // Update local state
                setOrders(prev => prev.map(o =>
                    o.id === orderId ? { ...o, status: 'confirmed' } : o
                ));
            } catch (error) {
                console.error("Payment failed", error);
                alert("Une erreur est survenue lors du traitement. Veuillez réessayer.");
            } finally {
                setIsProcessingPayment(null);
            }
        }, 1500);
    };

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await api.orders.getAll();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setIsLoading(false);
            }
        };

        const token = localStorage.getItem('token');
        if (!token) {
            router.push('/login');
        } else {
            fetchOrders();
        }
    }, [router]);

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'quotes') return isQuoteOrder(order);
        return true;
    });

    const quotesCount = orders.filter(o => isQuoteOrder(o) && o.status !== 'confirmed' && o.status !== 'delivered' && o.status !== 'cancelled').length;

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-pulse flex flex-col items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-muted"></div>
                    <div className="h-4 w-32 bg-muted rounded"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="max-w-4xl mx-auto">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-smooth mb-6 group"
                    >
                        <Icon name="ArrowLeftIcon" size={20} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Retour</span>
                    </button>

                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <h1 className="font-heading text-3xl font-bold text-foreground">
                            Mes Commandes
                        </h1>
                        <div className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                            <button
                                onClick={() => setActiveTab('all')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'all' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Toutes
                            </button>
                            <button
                                onClick={() => setActiveTab('quotes')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all flex items-center gap-2 ${activeTab === 'quotes' ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
                            >
                                Mes Devis
                                {quotesCount > 0 && (
                                    <span className="bg-primary text-primary-foreground text-[10px] w-4 h-4 rounded-full flex items-center justify-center">
                                        {quotesCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    </div>

                    {filteredOrders.length === 0 ? (
                        <div className="bg-card rounded-lg shadow-warm-md p-12 text-center border border-border">
                            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                                <Icon name={activeTab === 'quotes' ? "DocumentTextIcon" : "ShoppingBagIcon"} size={40} className="text-muted-foreground" />
                            </div>
                            <h2 className="font-heading text-xl font-semibold text-foreground mb-2">
                                {activeTab === 'quotes' ? "Aucun devis en cours" : "Aucune commande"}
                            </h2>
                            <p className="text-muted-foreground mb-6">
                                {activeTab === 'quotes' ? "Vous n'avez pas de demandes de devis pour le moment." : "Vous n'avez pas encore passé de commande."}
                            </p>
                            <Link
                                href="/"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium"
                            >
                                Commencer mes achats
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {filteredOrders.map((order) => (
                                <div key={order.id} className="bg-card rounded-lg shadow-warm-md overflow-hidden border border-border">
                                    <div className="p-6 border-b border-border bg-muted/30 flex flex-wrap items-center justify-between gap-4">
                                        <div>
                                            <p className="caption text-muted-foreground mb-1">Commande n°</p>
                                            <p className="font-heading font-semibold text-foreground">
                                                CMD-{order.id?.substring(0, 8).toUpperCase() || 'N/A'}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="caption text-muted-foreground mb-1">Date</p>
                                            <p className="font-medium text-foreground">
                                                {new Date(order.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="caption text-muted-foreground mb-1">Total</p>
                                            <p className="font-heading font-bold text-primary">
                                                {formatPrice(order.total)}
                                            </p>
                                        </div>
                                        <div>
                                            <span className={`px-3 py-1 rounded-full caption font-semibold
                        ${order.status === 'delivered' ? 'bg-success/10 text-success' :
                                                    order.status === 'cancelled' ? 'bg-error/10 text-error' :
                                                        order.status === 'pending_quote' ? 'bg-purple-100 text-purple-700' :
                                                            'bg-warning/10 text-warning'}`}>
                                                {order.status === 'pending_quote' ? 'En attente de devis' :
                                                    order.status === 'pending' ? 'En attente de paiement' :
                                                        order.status === 'confirmed' ? 'Confirmée' :
                                                            order.status === 'delivered' ? 'Livrée' :
                                                                order.status === 'cancelled' ? 'Annulée' : order.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="space-y-4 mb-6">
                                            {order.items.map((item: any, index: number) => (
                                                <div key={index} className="flex items-center justify-between">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-16 h-16 bg-muted rounded-lg flex items-center justify-center overflow-hidden border border-border">
                                                            {item.customImage ? (
                                                                <img src={item.customImage.startsWith('http') ? item.customImage : `${API_BASE_URL}${item.customImage}`} alt={item.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <Icon name="PhotoIcon" size={24} className="text-muted-foreground" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-foreground">{item.name}</p>
                                                            <p className="caption text-muted-foreground">Qté: {item.quantity}</p>
                                                            {item.comment && (
                                                                <p className="text-[10px] text-muted-foreground italic mt-1">"{item.comment}"</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <p className="font-medium text-foreground">
                                                        {order.status === 'pending_quote' ? 'À confirmer' : formatPrice(item.price)}
                                                    </p>
                                                </div>
                                            ))}
                                        </div>

                                        {order.status === 'pending' && isQuoteOrder(order) && (
                                            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 flex flex-col md:flex-row items-center justify-between gap-4">
                                                <div>
                                                    <p className="font-semibold text-foreground">Le devis a été établi !</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {order.paymentMethod === 'Paiement en boutique'
                                                            ? "Vous pouvez maintenant passer en boutique pour le règlement et le retrait."
                                                            : "Vous pouvez maintenant procéder au paiement pour confirmer votre commande."}
                                                    </p>
                                                </div>
                                                {order.paymentMethod !== 'Paiement en boutique' && (
                                                    <button
                                                        onClick={() => handlePayment(order.id)}
                                                        disabled={isProcessingPayment === order.id}
                                                        className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-bold hover:scale-105 active:scale-95 transition-all shadow-lg shadow-primary/20 disabled:opacity-50"
                                                    >
                                                        {isProcessingPayment === order.id ? (
                                                            <span className="flex items-center gap-2">
                                                                <Icon name="ArrowPathIcon" size={18} className="animate-spin" />
                                                                Chargement...
                                                            </span>
                                                        ) : "Payer maintenant"}
                                                    </button>
                                                )}
                                                {order.paymentMethod === 'Paiement en boutique' && (
                                                    <div className="flex items-center gap-2 text-primary font-bold">
                                                        <Icon name="BuildingStorefrontIcon" size={20} />
                                                        <span>Retrait en boutique</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistoryInteractive;
