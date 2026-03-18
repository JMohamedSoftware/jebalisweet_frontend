import React from 'react';

interface TestimonialCardProps {
  name: string;
  location: string;
  rating: number;
  comment: string;
  date: string;
}

const TestimonialCard = ({ name, location, rating, comment, date }: TestimonialCardProps) => {
  return (
    <div className="group relative glass rounded-3xl p-8 sm:p-10 shadow-warm-sm border border-white/10 hover:shadow-warm-xl hover:-translate-y-2 transition-all duration-500 flex flex-col h-full overflow-hidden">

      {/* Absolute Decorative Quote Mark - Luxury styling */}
      <div className="absolute top-6 right-8 text-primary/5 text-8xl font-serif select-none pointer-events-none transform group-hover:scale-110 transition-transform duration-700">
        &ldquo;
      </div>

      <div className="relative z-10 flex flex-col h-full">
        {/* Star Rating - Elegant and Minimalist */}
        <div className="flex items-center gap-1.5 mb-8">
          {Array.from({ length: 5 }).map((_, index) => (
            <svg
              key={index}
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              fill={index < rating ? "currentColor" : "none"}
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
              className={index < rating ? 'text-accent' : 'text-muted-foreground/30'}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          ))}
          <span className="ml-2 text-[10px] font-bold text-accent tracking-[0.2em] uppercase">Excellent</span>
        </div>

        {/* Comment - Sophisticated Typography */}
        <p className="text-foreground/90 font-sans font-light italic text-base sm:text-lg leading-relaxed mb-10 flex-grow relative">
          <span className="text-2xl text-primary/20 absolute -left-4 -top-2">&ldquo;</span>
          {comment}
        </p>

        {/* Divider - Elegant Line */}
        <div className="h-px w-full bg-gradient-to-r from-border/20 via-border/40 to-transparent mb-6" />

        {/* User Info - Clean and High Level */}
        <div className="flex items-center justify-between">
          <div className="flex flex-col">
            <h4 className="font-heading font-bold text-foreground text-sm tracking-widest uppercase mb-0.5">
              {name}
            </h4>
            <p className="text-[10px] sm:text-xs text-muted-foreground font-light tracking-wide uppercase italic">
              {location}
            </p>
          </div>
          <div className="text-[9px] text-muted-foreground/40 font-bold tracking-widest uppercase">
            {date}
          </div>
        </div>
      </div>

    </div>
  );
};

export default TestimonialCard;