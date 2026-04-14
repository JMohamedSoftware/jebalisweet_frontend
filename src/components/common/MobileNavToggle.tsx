'use client';

import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface MobileNavToggleProps {
  isOpen: boolean;
  onToggle: () => void;
  inverse?: boolean;
}

const MobileNavToggle = ({ isOpen, onToggle, inverse }: MobileNavToggleProps) => {
  return (
    <button
      onClick={onToggle}
      className="md:hidden p-2 rounded-lg transition-smooth hover:bg-muted focus:outline-none focus:ring-3 focus:ring-ring focus:ring-offset-3"
      aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
      aria-expanded={isOpen}
    >
      <Icon
        name={isOpen ? 'XMarkIcon' : 'Bars3Icon'}
        size={24}
        className={inverse ? 'text-white' : 'text-foreground'}
      />
    </button>
  );
};

export default MobileNavToggle;