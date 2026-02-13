'use client';

import React, { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';
import { api } from '@/services/api';

interface Preferences {
  language: 'fr' | 'en';
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
}

const PreferencesTab = () => {
  const [preferences, setPreferences] = useState<Preferences>({
    language: 'fr',
    notifications: {
      email: true,
      sms: false,
      orderUpdates: true,
      promotions: true,
      newsletter: false,
    },
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [userId, setUserId] = useState<number | null>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const user = JSON.parse(savedUser);
      setUserId(user.id); // Assuming user object has ID
      if (user.id) {
        api.users.getPreferences(user.id)
          .then(prefs => setPreferences(prefs))
          .catch(err => console.error(err));
      }
    }
  }, []);

  const savePreferences = async (newPreferences: Preferences) => {
    setPreferences(newPreferences);
    if (userId) {
      try {
        await api.users.updatePreferences(userId, newPreferences);
        setSuccessMessage('Préférences mises à jour avec succès');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Failed to update preferences', error);
      }
    }
  };

  const handleLanguageChange = (language: 'fr' | 'en') => {
    const updatedPreferences = { ...preferences, language };
    savePreferences(updatedPreferences);
  };

  const handleNotificationToggle = (key: keyof Preferences['notifications']) => {
    const updatedPreferences = {
      ...preferences,
      notifications: {
        ...preferences.notifications,
        [key]: !preferences.notifications[key],
      },
    };
    savePreferences(updatedPreferences);
  };

  return (
    <div className="space-y-6">
      {successMessage && (
        <div className="p-4 bg-success/10 border border-success rounded-lg flex items-center gap-3">
          <Icon name="CheckCircleIcon" size={20} className="text-success" />
          <p className="text-success">{successMessage}</p>
        </div>
      )}

      <div>
        <h2 className="font-heading text-2xl font-semibold text-foreground mb-6">
          Préférences du compte
        </h2>

        <div className="space-y-6">
          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="GlobeAltIcon" size={20} />
              Langue
            </h3>
            <div className="space-y-3">
              <button
                onClick={() => handleLanguageChange('fr')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-smooth ${preferences.language === 'fr' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
              >
                <span className="font-medium text-foreground">Français</span>
                {preferences.language === 'fr' && (
                  <Icon name="CheckCircleIcon" size={20} className="text-primary" />
                )}
              </button>
              <button
                onClick={() => handleLanguageChange('en')}
                className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-smooth ${preferences.language === 'en' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                  }`}
              >
                <span className="font-medium text-foreground">English</span>
                {preferences.language === 'en' && (
                  <Icon name="CheckCircleIcon" size={20} className="text-primary" />
                )}
              </button>
            </div>
          </div>

          <div className="bg-background rounded-lg border border-border p-6">
            <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
              <Icon name="BellIcon" size={20} />
              Notifications
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications par e-mail</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par e-mail
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('email')}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${preferences.notifications.email ? 'bg-primary' : 'bg-muted'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-smooth ${preferences.notifications.email ? 'right-1' : 'left-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Notifications par SMS</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications par SMS
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('sms')}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${preferences.notifications.sms ? 'bg-primary' : 'bg-muted'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-smooth ${preferences.notifications.sms ? 'right-1' : 'left-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Mises à jour de commande</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des notifications sur l'état de vos commandes
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('orderUpdates')}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${preferences.notifications.orderUpdates ? 'bg-primary' : 'bg-muted'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-smooth ${preferences.notifications.orderUpdates ? 'right-1' : 'left-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Promotions et offres</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir des offres spéciales et promotions
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('promotions')}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${preferences.notifications.promotions ? 'bg-primary' : 'bg-muted'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-smooth ${preferences.notifications.promotions ? 'right-1' : 'left-1'
                      }`}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-foreground">Newsletter</p>
                  <p className="text-sm text-muted-foreground">
                    Recevoir notre newsletter mensuelle
                  </p>
                </div>
                <button
                  onClick={() => handleNotificationToggle('newsletter')}
                  className={`relative w-12 h-6 rounded-full transition-smooth ${preferences.notifications.newsletter ? 'bg-primary' : 'bg-muted'
                    }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-smooth ${preferences.notifications.newsletter ? 'right-1' : 'left-1'
                      }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreferencesTab;