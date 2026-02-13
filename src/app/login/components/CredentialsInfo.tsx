'use client';

import React, { useState } from 'react';
import Icon from '@/components/ui/AppIcon';

const CredentialsInfo = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  const credentials = [
    {
      role: 'Client',
      email: 'client@jebalislweet.fr',
      password: 'Client123!',
      icon: 'UserIcon',
      color: 'text-primary',
    },
    {
      role: 'Administrateur',
      email: 'admin@jebalisweet.fr',
      password: 'Admin123!',
      icon: 'ShieldCheckIcon',
      color: 'text-secondary',
    },
    {
      role: 'Livreur',
      email: 'delivery@jebalisweet.fr',
      password: 'Delivery123!',
      icon: 'TruckIcon',
      color: 'text-accent',
    },
  ];

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 bg-muted/50 rounded-lg transition-smooth hover:bg-muted flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <Icon
            name="InformationCircleIcon"
            size={20}
            className="text-primary"
          />
          <span className="text-sm font-medium text-foreground">
            Identifiants de test
          </span>
        </div>
        <Icon
          name="ChevronDownIcon"
          size={20}
          className={`text-muted-foreground transition-smooth ${
            isExpanded ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isExpanded && (
        <div className="mt-2 p-4 bg-card rounded-lg shadow-warm space-y-4 animate-fade-in">
          {credentials.map((cred, index) => (
            <div
              key={index}
              className="p-3 bg-background rounded-lg border border-border"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon
                  name={cred.icon as any}
                  size={18}
                  className={cred.color}
                />
                <span className="font-semibold text-foreground text-sm">
                  {cred.role}
                </span>
              </div>
              <div className="space-y-1 caption">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">
                    E-mail :
                  </span>
                  <span className="text-foreground font-medium data-text">
                    {cred.email}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground min-w-[80px]">
                    Mot de passe :
                  </span>
                  <span className="text-foreground font-medium data-text">
                    {cred.password}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CredentialsInfo;