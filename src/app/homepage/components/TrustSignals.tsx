import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TrustSignal {
  icon: string;
  title: string;
  description: string;
}

interface TrustSignalsProps {
  signals: TrustSignal[];
}

const TrustSignals = ({ signals }: TrustSignalsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {signals.map((signal, index) => (
        <div
          key={index}
          className="flex flex-col items-center text-center p-6 bg-card rounded-xl shadow-warm"
        >
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Icon name={signal.icon as any} size={32} className="text-primary" />
          </div>
          
          <h3 className="font-heading text-xl font-semibold text-foreground mb-2">
            {signal.title}
          </h3>
          
          <p className="text-muted-foreground">
            {signal.description}
          </p>
        </div>
      ))}
    </div>
  );
};

export default TrustSignals;