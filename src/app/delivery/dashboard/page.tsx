'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/common/Header';
import { api } from '@/services/api';
import Icon from '@/components/ui/AppIcon';

interface OrderItem {
    name: string;
    quantity: number;
}

interface Order {
    id: number;
    customerName: string;
    delivery_address: string;
    phone: string;
    status: string;
    total: number;
    items: OrderItem[];
    created_at: string;
}

export default function DeliveryDashboard() {
    const router = useRouter();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const userStr = localStorage.getItem('user');
                if (!userStr) {
                    router.push('/login');
                    return;
                }
                const user = JSON.parse(userStr);
                if (user.role !== 'livreur' && user.role !== 'admin') {
                    router.push('/homepage');
                    return;
                }

                const data = await api.orders.getAll(); // Uses auth token header
                // Filter for delivery-relevant statuses if the API returns everything
                // Or if API handles filtering for role (which we implemented partly)
                // Let's filter client-side just in case for now to show only actionable items
                const actionableOrders = data.filter((o: any) =>
                    ['preparing', 'out_for_delivery', 'confirmed'].includes(o.status)
                );
                setOrders(actionableOrders);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, [router]);

    const updateStatus = async (orderId: number, newStatus: string) => {
        try {
            await api.orders.updateStatus(orderId, newStatus);
            // Update local state
            setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        } catch (error) {
            alert('Erreur lors de la mise à jour du statut');
        }
    };

    if (loading) return <div className="p-8 text-center">Chargement...</div>;

    return (
        <>
            <Header />
            <main className="min-h-screen bg-background py-8 px-4">
                <div className="container mx-auto">
                    <h1 className="text-3xl font-bold mb-8">Tableau de bord Livreur</h1>

                    <div className="grid gap-6">
                        {orders.length === 0 ? (
                            <p className="text-muted-foreground">Aucune commande à livrer pour le moment.</p>
                        ) : (
                            orders.map((order) => (
                                <div key={order.id} className="bg-card p-6 rounded-xl shadow-warm border border-border">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h3 className="font-bold text-lg">Commande #{order.id}</h3>
                                            <p className="text-sm text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                                order.status === 'out_for_delivery' ? 'bg-blue-100 text-blue-800' :
                                                    'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {order.status === 'out_for_delivery' ? 'En livraison' :
                                                order.status === 'delivered' ? 'Livrée' :
                                                    order.status}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4 mb-6">
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <Icon name="UserCircleIcon" size={18} /> Client
                                            </h4>
                                            <p>{order.customerName}</p>
                                            <p className="text-sm text-muted-foreground">{order.phone || 'Pas de téléphone'}</p>
                                        </div>
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <Icon name="MapPinIcon" size={18} /> Adresse
                                            </h4>
                                            <p>{order.delivery_address}</p>
                                        </div>
                                    </div>

                                    <div className="border-t border-border pt-4 mb-6">
                                        <h4 className="font-semibold mb-2">Articles</h4>
                                        <ul className="list-disc list-inside text-sm">
                                            {order.items.map((item, idx) => (
                                                <li key={idx}>{item.quantity}x {item.name}</li>
                                            ))}
                                        </ul>
                                    </div>

                                    <div className="flex gap-3 justify-end">
                                        {order.status !== 'out_for_delivery' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'out_for_delivery')}
                                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                            >
                                                Partir en livraison
                                            </button>
                                        )}
                                        {order.status !== 'delivered' && (
                                            <button
                                                onClick={() => updateStatus(order.id, 'delivered')}
                                                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
                                            >
                                                Valider Livraison
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </main>
        </>
    );
}
