'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/AppIcon';
import PageLoader from '@/components/ui/PageLoader';
import { api } from '@/services/api';
import { useLanguage } from '@/context/LanguageContext';
import { formatPrice } from '@/utils/format';
import { STATUS_ALL } from '@/constants';

interface OrderItem {
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  comment?: string;
  customImage?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  deliveryCost: number;
  discount: number;
  promoCode?: string | null;
  total: number;
  status: 'pending' | 'pending_quote' | 'confirmed' | 'assigned' | 'in_delivery' | 'delivered' | 'cancelled';
  paymentMethod: string;
  shippingAddress: string;
  deliveryOption: string;
  deliveryDriverId: string | null;
  deliveryDriverName: string | null;
  estimatedDeliveryTime: string | null;
  createdAt: string;
}

interface Driver {
  id: string;
  username: string;
  email: string;
  phone: string;
}

const AdminOrderManagementInteractive = () => {
  const router = useRouter();
  const { t } = useLanguage();
  const [isHydrated, setIsHydrated] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>(STATUS_ALL);
  const [searchQuery, setSearchQuery] = useState('');
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assigningDriver, setAssigningDriver] = useState<string | null>(null);
  const [selectedDriverId, setSelectedDriverId] = useState<string>('');
  const [editingPrices, setEditingPrices] = useState<Record<string, Record<number, number>>>({}); // Use index as key for uniqueness
  const [isUpdatingItems, setIsUpdatingItems] = useState(false);

  const statusOptions = [STATUS_ALL, 'pending', 'pending_quote', 'confirmed', 'assigned', 'in_delivery', 'delivered', 'cancelled'];

  const fetchOrders = async () => {
    try {
      const fetchedOrders = await api.orders.getAll();
      setOrders(fetchedOrders.map((o: any) => ({
        id: o.id,
        orderNumber: `CMD-${o.id.substring(0, 8).toUpperCase()}`,
        customerName: o.customerName || 'Guest',
        customerEmail: o.customerEmail,
        items: (o.items || []).map((item: any) => ({
          ...item,
          productId: item.productId || item.product,
          price: Number(item.price) || 0
        })),
        subtotal: (o.items || []).reduce((sum: any, item: any) => sum + ((Number(item.price) || 0) * (item.quantity || 0)), 0),
        deliveryCost: 0,
        discount: o.discountAmount || 0,
        promoCode: o.promoCode || null,
        total: o.total,
        status: o.status,
        paymentMethod: o.paymentMethod,
        shippingAddress: o.deliveryAddress,
        deliveryOption: o.deliveryOption,
        deliveryDriverId: o.deliveryDriverId,
        deliveryDriverName: o.deliveryDriverName,
        estimatedDeliveryTime: o.estimatedDeliveryTime,
        createdAt: new Date(o.createdAt).toLocaleString(),
      })));
    } catch (error) {
      console.error('Failed to fetch orders', error);
    }
  };

  useEffect(() => {
    setIsHydrated(true);
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'admin') {
      router.push('/homepage');
      return;
    }

    fetchOrders();
    api.users.getDrivers().then(setDrivers).catch(console.error);
  }, [router]);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await api.orders.updateStatus(orderId, newStatus);
      setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(prev => prev ? { ...prev, status: newStatus as any } : null);
      }
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const handleUpdatePrices = async (orderId: string) => {
    const priceUpdates = editingPrices[orderId];
    if (!priceUpdates) return;

    setIsUpdatingItems(true);
    try {
      const itemsToUpdate = Object.entries(priceUpdates).map(([index, price]) => {
        const item = orders.find(o => o.id === orderId)?.items[parseInt(index)];
        return {
          productId: item?.productId,
          name: item?.name,
          price
        };
      });

      await api.orders.updateItems(orderId, itemsToUpdate);
      await fetchOrders();
      setEditingPrices(prev => {
        const next = { ...prev };
        delete next[orderId];
        return next;
      });
    } catch (error) {
      console.error('Failed to update prices', error);
    } finally {
      setIsUpdatingItems(false);
    }
  };

  const handlePriceEdit = (orderId: string, index: number, price: string) => {
    const numPrice = parseFloat(price) || 0;
    setEditingPrices(prev => ({
      ...prev,
      [orderId]: {
        ...(prev[orderId] || {}),
        [index]: numPrice
      }
    }));
  };

  const handleAssignDriver = async (orderId: string) => {
    if (!selectedDriverId) return;
    try {
      await api.orders.assignDriver(orderId, selectedDriverId);
      await fetchOrders();
      setAssigningDriver(null);
      setSelectedDriverId('');
    } catch (error) {
      console.error('Failed to assign driver', error);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    if (!window.confirm(t('admin.orders.confirmDelete'))) return;
    try {
      await api.orders.delete(orderId);
      setOrders(prev => prev.filter(o => o.id !== orderId));
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(null);
      }
    } catch (error) {
      console.error('Failed to delete order', error);
      alert(t('admin.orders.deleteError'));
    }
  };

  const getStatusLabel = (status: string) => {
    return t(`admin.orders.status.${status}`);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-warning text-warning-foreground',
      pending_quote: 'bg-accent text-accent-foreground',
      confirmed: 'bg-accent text-accent-foreground',
      assigned: 'bg-secondary text-secondary-foreground',
      in_delivery: 'bg-accent text-accent-foreground',
      delivered: 'bg-success text-success-foreground',
      cancelled: 'bg-error text-error-foreground',
    };
    return colors[status] || 'bg-muted text-muted-foreground';
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === STATUS_ALL || order.status === filterStatus;
    const matchesSearch =
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (!isHydrated) {
    return <PageLoader />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="font-heading text-4xl font-bold text-foreground mb-2">
              {t('admin.orders.title')}
            </h1>
            <p className="text-muted-foreground">
              {t('admin.orders.count', { count: orders.length })}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium w-fit"
          >
            <Icon name="HomeIcon" size={20} />
            {t('admin.orders.backHome')}
          </Link>
        </div>

        <div className="bg-card rounded-lg shadow-warm-md p-6 border border-border mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="relative">
              <Icon
                name="MagnifyingGlassIcon"
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <input
                type="text"
                placeholder={t('admin.orders.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 bg-background border border-input rounded-lg focus:outline-none focus:ring-3 focus:ring-ring transition-smooth"
            >
              {statusOptions.map((status) => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-card rounded-lg shadow-warm-md border border-border hover:shadow-warm-lg transition-smooth overflow-hidden"
            >
              <div className="p-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 gap-4">
                  <div>
                    <h3 className="font-heading text-xl font-semibold text-foreground mb-1">
                      {order.orderNumber}
                    </h3>
                    <p className="text-muted-foreground caption">
                      {order.customerName} • {order.customerEmail}
                    </p>
                    <p className="text-muted-foreground caption mt-1">
                      {order.createdAt}
                    </p>
                  </div>
                  <span className={`px-4 py-2 rounded-full caption font-semibold w-fit ${getStatusColor(order.status)}`}>
                    {getStatusLabel(order.status)}
                  </span>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <p className="caption font-medium text-foreground mb-2">{t('admin.orders.itemsTable.title')}</p>
                  <div className="space-y-2">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex flex-col gap-2 p-3 bg-muted/20 rounded-lg mb-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium text-foreground">
                            {item.name} × {item.quantity}
                          </span>
                          {order.status === 'pending_quote' ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="number"
                                placeholder={t('admin.orders.itemsTable.unitPrice')}
                                value={editingPrices[order.id]?.[index] ?? item.price}
                                onChange={(e) => handlePriceEdit(order.id, index, e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-border rounded text-xs outline-none focus:ring-1 ring-primary"
                              />
                              <span className="text-[10px] text-muted-foreground font-bold">DT</span>
                            </div>
                          ) : (
                            <span className="data-text text-foreground font-bold">
                              {item.price === 0 ? t('admin.orders.itemsTable.priceToQuote') : formatPrice(item.price * item.quantity)}
                            </span>
                          )}
                        </div>
                        {item.comment && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">{t('admin.orders.itemsTable.note')}</span>
                            <p className="text-xs text-muted-foreground italic bg-white/50 p-2 rounded border border-border/50">
                              "{item.comment}"
                            </p>
                          </div>
                        )}
                        {item.customImage && (
                          <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-bold text-muted-foreground uppercase">{t('admin.orders.itemsTable.inspiration')}</span>
                            <div className="w-48 h-48 rounded-lg overflow-hidden border border-border shadow-sm group relative">
                              <img src={item.customImage} alt="Inspiration" className="w-full h-full object-cover" />
                              <a href={item.customImage} target="_blank" rel="noopener noreferrer" className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-[10px] font-bold">
                                {t('admin.orders.itemsTable.viewFull')}
                              </a>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                    {order.status === 'pending_quote' && (
                      <button
                        onClick={() => handleUpdatePrices(order.id)}
                        disabled={isUpdatingItems}
                        className="w-full mt-2 py-2 bg-primary text-primary-foreground rounded-lg font-bold text-xs hover:opacity-90 transition-smooth flex items-center justify-center gap-2"
                      >
                        {isUpdatingItems ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Icon name="CheckIcon" size={14} /> {t('admin.orders.itemsTable.confirmQuote')}</>}
                      </button>
                    )}
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-muted-foreground caption">{t('admin.orders.total')}</span>
                    <div className="text-right">
                      {order.discount > 0 && (
                        <p className="text-[10px] text-success font-bold uppercase mb-1">
                          PROMO: {order.promoCode} (-{formatPrice(order.discount)})
                        </p>
                      )}
                      <span className="font-heading text-xl font-bold text-primary">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-4 mb-4">
                  <p className="caption font-medium text-foreground mb-1">{t('admin.orders.shipping.address')}</p>
                  <p className="text-muted-foreground caption">{order.shippingAddress}</p>
                  {order.deliveryDriverName && (
                    <>
                      <p className="caption font-medium text-foreground mt-2 mb-1">{t('admin.orders.shipping.driver')}</p>
                      <p className="text-muted-foreground caption">{order.deliveryDriverName}</p>
                    </>
                  )}
                </div>

                <div className="space-y-3">
                  {assigningDriver === order.id ? (
                    <div className="flex flex-col sm:flex-row gap-2 items-center">
                      <select
                        value={selectedDriverId}
                        onChange={(e) => setSelectedDriverId(e.target.value)}
                        className="w-full sm:flex-1 px-3 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
                      >
                        <option value="">{t('admin.orders.selectDriver')}</option>
                        {drivers.map((driver) => (
                          <option key={driver.id} value={driver.id}>
                            {driver.username} - <span dir="ltr">{driver.phone}</span>
                          </option>
                        ))}
                      </select>
                      <div className="flex gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => handleAssignDriver(order.id)}
                          className="flex-1 sm:flex-none px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                        >
                          {t('admin.orders.actions.confirm')}
                        </button>
                        <button
                          onClick={() => {
                            setAssigningDriver(null);
                            setSelectedDriverId('');
                          }}
                          className="flex-1 sm:flex-none px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium caption"
                        >
                          {t('admin.orders.actions.cancel')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex gap-2 flex-wrap">
                      {order.status === 'pending' && (
                        <button
                          onClick={() => handleStatusChange(order.id, 'confirmed')}
                          className="flex items-center gap-2 px-4 py-2 bg-accent text-accent-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                        >
                          <Icon name="CheckIcon" size={16} />
                          {t('admin.orders.actions.confirm')}
                        </button>
                      )}
                      {(order.status === 'pending' || order.status === 'confirmed') && !order.deliveryDriverId && (
                        <button
                          onClick={() => setAssigningDriver(order.id)}
                          className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                        >
                          <Icon name="UserPlusIcon" size={16} />
                          {t('admin.orders.actions.assign')}
                        </button>
                      )}
                      {(order.status === 'assigned' || order.status === 'in_delivery') && (
                        <button
                          onClick={() => {
                            if (window.confirm(t('admin.orders.confirmDelivered'))) {
                              handleStatusChange(order.id, 'delivered');
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 bg-success text-success-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption"
                        >
                          <Icon name="CheckIcon" size={16} />
                          {t('admin.orders.actions.delivered')}
                        </button>
                      )}

                      {(order.status === 'pending' || order.status === 'pending_quote') && (
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-error text-error-foreground rounded-lg hover:opacity-90 transition-smooth font-medium caption min-w-[40px]"
                          title={t('admin.orders.actions.delete')}
                        >
                          <Icon name="TrashIcon" size={16} />
                          <span className="hidden sm:inline">{t('admin.orders.actions.delete')}</span>
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-muted text-foreground rounded-lg hover:bg-muted/80 transition-smooth font-medium caption"
                      >
                        <Icon name="EyeIcon" size={16} />
                        {t('admin.orders.actions.details')}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Icon name="ClipboardDocumentListIcon" size={64} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground text-lg">{t('admin.orders.noResults')}</p>
          </div>
        )}
      </div>

      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-fade-in">
          <div className="bg-card rounded-lg shadow-warm-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-border">
            <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
              <h2 className="font-heading text-2xl font-semibold text-foreground">
                {t('admin.orders.modal.title')}
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
                  {selectedOrder.orderNumber}
                </h3>
                <p className="caption">
                  <span className="font-medium text-foreground">{t('admin.orders.statusLabel')}</span>{' '}
                  <span className={`px-3 py-1 rounded-full caption font-semibold ${getStatusColor(selectedOrder.status)}`}>
                    {getStatusLabel(selectedOrder.status)}
                  </span>
                </p>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-3">{t('admin.orders.modal.items')}</h4>
                <div className="space-y-3">
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-background rounded-lg">
                      <div>
                        <p className="font-medium text-foreground">{item.name}</p>
                        <p className="caption text-muted-foreground">{t('admin.orders.quantity')}: {item.quantity}</p>
                      </div>
                      <p className="data-text font-semibold text-foreground">
                        {formatPrice(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4">
                <h4 className="font-medium text-foreground mb-2">{t('admin.orders.modal.shipping')}</h4>
                <p className="caption text-muted-foreground">{selectedOrder.shippingAddress}</p>
                <h4 className="font-medium text-foreground mt-3 mb-2">{t('admin.orders.modal.payment')}</h4>
                <p className="caption text-muted-foreground">{selectedOrder.paymentMethod}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrderManagementInteractive;