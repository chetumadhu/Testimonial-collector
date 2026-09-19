import React from 'react';
import { TestimonialCard } from './TestimonialCard';

export const MasonryGrid = ({
  testimonials = [],
  isOwnerView = false,
  onStatusChange,
  onToggleFeature,
  onToggleLike,
  onDelete,
}) => {
  if (!testimonials || testimonials.length === 0) {
    return (
      <div className="text-center py-16 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
        <p className="text-slate-500 dark:text-slate-400 text-sm">
          No testimonials match the selected filters.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 [column-fill:_balance] space-y-6">
      {testimonials.map((testimonial) => (
        <TestimonialCard
          key={testimonial._id}
          testimonial={testimonial}
          isOwnerView={isOwnerView}
          onStatusChange={onStatusChange}
          onToggleFeature={onToggleFeature}
          onToggleLike={onToggleLike}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
};
