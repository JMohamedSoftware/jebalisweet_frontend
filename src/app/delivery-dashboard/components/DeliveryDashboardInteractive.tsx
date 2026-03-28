'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { formatPrice } from '@/utils/format';

interface OrderItem {
    productId: string;
    name: string;
    quantity: number;
    price: number;
}

interface Order {
    id: string;
    customerName: string;
    customerEmail: string;
    items: OrderItem[];
    total: number;
    status: 'assigned' | 'in_delivery' | 'delivered';
    deliveryAddress: string;
    phone: string;
    paymentMethod: string;
    createdAt: string;
}

const DeliveryDashboardInteractive = () => {
    const router = useRouter();
    const [isHydrated, setIsHydrated] = useState(false);
    const [orders, setOrders] = useState<Order[]>([]);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

    const filteredOrders = orders.filter(order => {
        if (activeTab === 'active') {
            return order.status !== 'delivered';
        }
        return order.status === 'delivered';
    });

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const fetchedOrders = await api.orders.getAll();
            setOrders(fetchedOrders);
        } catch (error) {
            console.error('Failed to fetch orders', error);
            alert('Erreur lors du chargement des commandes');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        setIsHydrated(true);
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUser = JSON.parse(userData);
            if (parsedUser.role !== 'livreur') {
                router.push('/');
                return;
            }
            fetchOrders();
        } else {
            router.push('/login');
            return;
        }
    }, [router]);

    const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
        try {
            await api.orders.updateStatus(orderId, newStatus);
            await fetchOrders(); // Refresh orders
            if (selectedOrder?.id === orderId) {
                setSelectedOrder({ ...selectedOrder, status: newStatus });
            }
        } catch (error) {
            console.error('Failed to update status', error);
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    const getStatusLabel = (status: string) => {
        const labels: Record<string, string> = {
            assigned: 'Assignée',
            in_delivery: 'En livraison',
            delivered: 'Livrée',
        };
        return labels[status] || status;
    };

    const getStatusColor = (status: string) => {
        const colors: Record<string, string> = {
            assigned: 'bg-warning text-warning-foreground',
            in_delivery: 'bg-accent text-accent-foreground',
            delivered: 'bg-success text-success-foreground',
        };
        return colors[status] || 'bg-muted text-muted-foreground';
    };

    if (!isHydrated) {
        return <PageLoader />;
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="container mx-auto px-6 py-8">
                <div className="mb-8 flex items-center justify-between">
                    <div>
                        <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
                            Tableau de Bord Livreur
                        </h1>
                        <p className="text-muted-foreground">
                            {orders.length} commande{orders.length > 1 ? 's' : ''} assignée{orders.length > 1 ? 's' : ''}
                        </p>
                    </div>
                    <Link
                        href="/"
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium"
                    >
                        <Icon name="HomeIcon" size={20} />
                        Retour à l'accueil
                    </Link>
                </div>

                <div className="mb-6 flex gap-4 border-b border-border">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`pb-4 px-2 font-medium transition-smooth relative ${activeTab === 'active' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Commandes Actives
                        {activeTab === 'active' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-scale-x" />
                        )}
                    </button>
                    <button
                        onClick={() => setActiveTab('history')}
                        className={`pb-4 px-2 font-medium transition-smooth relative ${activeTab === 'history' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
                            }`}
                    >
                        Historique des Livraisons
                        {activeTab === 'history' && (
                            <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary animate-scale-x" />
                        )}
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                        <p className="mt-4 text-muted-foreground">Chargement...</p>
                    </div>
                ) : filteredOrders.length === 0 ? (
                    <div className="text-center py-12 bg-card rounded-lg shadow-warm-md border border-border">
                        <Icon name={activeTab === 'active' ? "TruckIcon" : "ClipboardDocumentListIcon"} size={64} className="text-muted-foreground mx-auto mb-4" />
                        <p className="text-muted-foreground text-lg">
                            {activeTab === 'active' ? "Aucune commande assignée pour le moment" : "Aucun historique de livraison"}
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-4">
                        {filteredOrders.map((order) => (
                            <div
                                key={order.id}
                                className="bg-card rounded-lg shadow-warm-md border border-border hover:shadow-warm-lg transition-smooth overflow-hidden"
                            >
                                <div className="p-6">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                                                Commande #{order.id.substring(0, 8).toUpperCase()}
                                            </h3>
                                            <p className="text-muted-foreground caption">
                                                {order.customerName}
                                            </p>
                                            <p className="text-muted-foreground caption">
                                                Tél: {order.phone}
                                            </p>
                                        </div>
                                        <span className={`px-4 py-2 rounded-full caption font-semibold ${getStatusColor(order.status)}`}>
                                            {getStatusLabel(order.status)}
                                        </span>
                                    </div>

                                    <div className="border-t border-border pt-4 mb-4">
                                        <p className="caption font-medium text-foreground mb-2">Adresse de livraison:</p>
                                        <p className="text-muted-foreground caption">{order.deliveryAddress}</p>
                                    </div>

                                    <div className="border-t border-border pt-4 mb-4">
                                        <p className="caption font-medium text-foreground mb-2">Articles:</p>
                                        <div className="space-y-2">
                                            {order.items.map((item, index) => (
                                                <div key={index} className="flex justify-between items-center">
                                                    <span className="text-muted-foreground caption">
                                                        {item.name} × {item.quantity}
                                                    </span>
                                                    <span className="data-text text-foreground">
                                                        {formatPrice(item.price * item.quantity)}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="flex justify-between items-center pt-2 mt-2 border-t border-border">
                                            <span className="font-heading text-lg font-semibold text-foreground">Total</span>
                                            <span className="font-heading text-xl font-bold text-primary">
                                                {formatPrice(order.total)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2 flex-wrap">
                                        {order.status === 'assigned' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'in_delivery')}
                                                className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                                            >
                                                <Icon name="TruckIcon" size={16} />
                                                Commencer la livraison
                                            </button>
                                        )}
                                        {order.status === 'in_delivery' && (
                                            <button
                                                onClick={() => handleStatusUpdate(order.id, 'delivered')}
                                                className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                                            >
                                                <Icon name="CheckCircleIcon" size={16} />
                                                Marquer comme livrée
                                            </button>
                                        )}
                                        <button
                                            onClick={() => setSelectedOrder(order)}
                                            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium caption"
                                        >
                                            <Icon name="EyeIcon" size={16} />
                                            Détails
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
                    <div className="bg-card rounded-lg shadow-warm-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
                            <h2 className="font-heading text-2xl font-semibold text-foreground">
                                Détails de la commande
                            </h2>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="p-2 hover:bg-muted rounded-lg transition-smooth"
                            >
                                <Icon name="XMarkIcon" size={24} className="text-foreground" />
                            </button>
                        </div>
                        <div className="p-6 space-y-6">
                            <div>
                                <h3 className="font-heading text-xl font-semibold text-foreground mb-4">
                                    Commande #{selectedOrder.id.substring(0, 8).toUpperCase()}
                                </h3>
                                <div className="space-y-2">
                                    <p className="caption">
                                        <span className="font-medium text-foreground">Client:</span>{' '}
                                        <span className="text-muted-foreground">{selectedOrder.customerName}</span>
                                    </p>
                                    <p className="caption">
                                        <span className="font-medium text-foreground">Email:</span>{' '}
                                        <span className="text-muted-foreground">{selectedOrder.customerEmail}</span>
                                    </p>
                                    <p className="caption">
                                        <span className="font-medium text-foreground">Téléphone:</span>{' '}
                                        <span className="text-muted-foreground">{selectedOrder.phone}</span>
                                    </p>
                                    <p className="caption">
                                        <span className="font-medium text-foreground">Statut:</span>{' '}
                                        <span className={`px-3 py-1 rounded-full caption font-semibold ${getStatusColor(selectedOrder.status)}`}>
                                            {getStatusLabel(selectedOrder.status)}
                                        </span>
                                    </p>
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <h4 className="font-medium text-foreground mb-3">Adresse de livraison</h4>
                                <p className="caption text-muted-foreground">{selectedOrder.deliveryAddress}</p>
                            </div>

                            <div className="border-t border-border pt-4">
                                <h4 className="font-medium text-foreground mb-3">Articles</h4>
                                <div className="space-y-3">
                                    {selectedOrder.items.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg">
                                            <div>
                                                <p className="font-medium text-foreground">{item.name}</p>
                                                <p className="caption text-muted-foreground">Quantité: {item.quantity}</p>
                                            </div>
                                            <p className="data-text font-semibold text-foreground">
                                                {formatPrice(item.price * item.quantity)}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <div className="flex justify-between pt-2">
                                    <span className="font-heading text-lg font-semibold text-foreground">Total</span>
                                    <span className="font-heading text-xl font-bold text-primary">
                                        {formatPrice(selectedOrder.total)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default DeliveryDashboardInteractive;
