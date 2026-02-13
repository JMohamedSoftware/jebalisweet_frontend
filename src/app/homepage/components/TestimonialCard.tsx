import React from 'react';
import Icon from '@/components/ui/AppIcon';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

const TestimonialCard = ({ name, location, rating, comment, date }: TestimonialCardProps) => {
  return (
    <div className="bg-card rounded-xl p-6 shadow-warm">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h4 className="font-semibold text-foreground">{name}</h4>
          <p className="caption text-muted-foreground">{location}</p>
        </div>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, index) => (
            <Icon
              key={index}
              name="StarIcon"
              size={16}
              variant={index < rating ? 'solid' : 'outline'}
              className={index < rating ? 'text-warning' : 'text-muted'}
            />
          ))}
        </div>
      </div>
      
      <p className="text-foreground mb-3 leading-relaxed">
        {comment}
      </p>
      
      <p className="caption text-muted-foreground">
        {date}
      </p>
    </div>
  );
};

export default TestimonialCard;