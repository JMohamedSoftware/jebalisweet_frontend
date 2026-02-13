'use client';

import React from 'react';
import AppImage from '@/components/ui/AppImage';
import Icon from '@/components/ui/AppIcon';
import { formatPrice } from '@/utils/format';

interface CartItemProps {
  item: {
    id: string; // Changed to string
    productId: string; // Changed to string
    name: string;
    price: number;
    quantity: number;
    image: string;
    alt: string;
    availability: 'in_stock' | 'low_stock' | 'out_of_stock';
    maxQuantity: number;
    customImage?: string;
    comment?: string;
    customOptions?: any;
  };
  onUpdateQuantity: (productId: string, newQuantity: number) => void;
  onUpdateComment: (productId: string, newComment: string) => void;
  onRemove: (productId: string) => void;
}

const CartItem = ({ item, onUpdateQuantity, onUpdateComment, onRemove }: CartItemProps) => {
  const handleIncrement = () => {
    if (item.quantity < item.maxQuantity) {
      onUpdateQuantity(item.productId, item.quantity + 1);
    }
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.productId, item.quantity - 1);
    }
  };

  const getAvailabilityText = () => {
    switch (item.availability) {
      case 'in_stock':
        return 'En stock';
      case 'low_stock':
        return 'Stock limité';
      case 'out_of_stock':
        return 'Rupture de stock';
      default:
        return '';
    }
  };

  const getAvailabilityColor = () => {
    switch (item.availability) {
      case 'in_stock':
        return 'text-success';
      case 'low_stock':
        return 'text-warning';
      case 'out_of_stock':
        return 'text-error';
      default:
        return '';
    }
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex flex-col sm:flex-row gap-4 p-4 bg-card rounded-lg shadow-warm border border-border">
      <div className="w-full sm:w-32 h-32 flex-shrink-0 overflow-hidden rounded-md">
        <AppImage
          src={item.customImage || item.image}
          alt={item.alt}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-foreground mb-1">
            {item.name}
          </h3>
          <p className={`caption font-medium ${getAvailabilityColor()}`}>
            {getAvailabilityText()}
          </p>
          <div className="mt-3">
            <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Commentaire / Instructions</label>
            <textarea
              value={item.comment || ''}
              onChange={(e) => onUpdateComment(item.productId, e.target.value)}
              placeholder="Ex: Pas trop sucré, message 'Joyeux Anniversaire'..."
              className="w-full bg-muted/20 border border-border rounded-md p-2 text-xs focus:ring-1 ring-primary/30 outline-none min-h-[60px] resize-none"
            />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
          <div className="flex items-center gap-3">
            <button
              onClick={handleDecrement}
              disabled={item.quantity <= 1}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Diminuer la quantité"
            >
              <Icon name="MinusIcon" size={16} />
            </button>
            <span className="data-text font-semibold text-foreground min-w-[2rem] text-center">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              disabled={item.quantity >= item.maxQuantity}
              className="w-8 h-8 flex items-center justify-center rounded-md bg-muted text-foreground hover:bg-primary hover:text-primary-foreground transition-smooth disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Augmenter la quantité"
            >
              <Icon name="PlusIcon" size={16} />
            </button>
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-4">
            <div className="text-right">
              <p className="caption text-muted-foreground">Prix unitaire</p>
              <p className="data-text font-semibold text-foreground">
                {formatPrice(item.price)}
              </p>
            </div>
            <div className="text-right">
              <p className="caption text-muted-foreground">Sous-total</p>
              <p className="data-text font-bold text-primary text-lg">
                {formatPrice(subtotal)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => onRemove(item.productId)}
        className="absolute top-4 right-4 sm:relative sm:top-0 sm:right-0 p-2 rounded-md text-muted-foreground hover:text-error hover:bg-muted transition-smooth"
        aria-label="Supprimer du panier"
      >
        <Icon name="TrashIcon" size={20} />
      </button>
    </div>
  );
};

export default CartItem;