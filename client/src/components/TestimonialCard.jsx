import React from 'react';
import { StarRating } from './StarRating';
import { Badge } from './ui/Badge';
import { Heart, Star, Check, Archive, Trash2, Quote } from 'lucide-react';

export const TestimonialCard = ({
  testimonial,
  isOwnerView = false,
  onStatusChange,
  onToggleFeature,
  onToggleLike,
  onDelete,
  theme = 'auto',
}) => {
  const {
    _id,
    clientName,
    clientEmail,
    companyRole,
    rating,
    reviewText,
    avatarUrl,
    status,
    isFeatured,
    isLiked,
    submittedAt,
  } = testimonial;

  const initials = clientName
    ? clientName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2)
    : '??';

  const formattedDate = new Date(submittedAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div
      className={`relative group break-inside-avoid rounded-2xl p-6 transition-all duration-200 border ${
        isFeatured
          ? 'ring-2 ring-emerald-500/30 border-emerald-500/40 bg-gradient-to-b from-emerald-50/20 to-transparent dark:from-emerald-950/20 shadow-sm'
          : 'border-slate-200/80 dark:border-slate-800/80 bg-white dark:bg-slate-900 shadow-sm hover:shadow-md'
      }`}
    >
      {/* Top Header: Stars & Badges */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <StarRating rating={rating} readOnly size="sm" />

        <div className="flex items-center space-x-1.5">
          {isFeatured && (
            <Badge variant="emerald" className="flex items-center space-x-1 text-[11px]">
              <Star className="w-3 h-3 fill-emerald-500 text-emerald-500" />
              <span>Featured</span>
            </Badge>
          )}
          {isLiked && (
            <Badge variant="rose" className="flex items-center space-x-1 text-[11px]">
              <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
              <span>Loved</span>
            </Badge>
          )}
          {isOwnerView && (
            <Badge
              variant={
                status === 'approved'
                  ? 'emerald'
                  : status === 'pending'
                  ? 'amber'
                  : 'default'
              }
              className="text-[11px] capitalize"
            >
              {status}
            </Badge>
          )}
        </div>
      </div>

      {/* Testimonial Quote */}
      <div className="relative mb-5">
        <Quote className="w-6 h-6 text-slate-200 dark:text-slate-800 absolute -top-1 -left-2 -z-0" />
        <p className="relative z-10 text-slate-700 dark:text-slate-200 text-sm leading-relaxed whitespace-pre-line">
          "{reviewText}"
        </p>
      </div>

      {/* Client Info Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/60">
        <div className="flex items-center space-x-3 min-w-0">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={clientName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100 dark:ring-slate-800 flex-shrink-0"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-500 flex items-center justify-center text-white font-bold text-xs ring-2 ring-slate-100 dark:ring-slate-800 flex-shrink-0">
              {initials}
            </div>
          )}

          <div className="min-w-0">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white truncate">
              {clientName}
            </h4>
            {companyRole && (
              <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                {companyRole}
              </p>
            )}
            {isOwnerView && (
              <p className="text-[11px] text-slate-400 dark:text-slate-500 truncate">
                {clientEmail}
              </p>
            )}
          </div>
        </div>

        <span className="text-[11px] text-slate-400 dark:text-slate-500 flex-shrink-0">
          {formattedDate}
        </span>
      </div>

      {/* Moderation Actions for Space Owners */}
      {isOwnerView && (
        <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5">
            {status !== 'approved' && (
              <button
                onClick={() => onStatusChange(_id, 'approved')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:text-emerald-300 transition cursor-pointer"
                title="Approve Review"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve</span>
              </button>
            )}

            {status !== 'archived' && (
              <button
                onClick={() => onStatusChange(_id, 'archived')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 transition cursor-pointer"
                title="Archive Review"
              >
                <Archive className="w-3.5 h-3.5" />
                <span>Archive</span>
              </button>
            )}

            {status === 'archived' && (
              <button
                onClick={() => onStatusChange(_id, 'pending')}
                className="inline-flex items-center space-x-1 px-2.5 py-1 rounded-lg font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:text-amber-300 transition cursor-pointer"
              >
                <span>Move to Pending</span>
              </button>
            )}
          </div>

          <div className="flex items-center space-x-1">
            <button
              onClick={() => onToggleFeature(_id)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isFeatured
                  ? 'text-amber-500 bg-amber-50 dark:bg-amber-950/40'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isFeatured ? 'Unpin from Featured' : 'Pin to Featured'}
            >
              <Star className={`w-4 h-4 ${isFeatured ? 'fill-amber-500' : ''}`} />
            </button>

            <button
              onClick={() => onToggleLike(_id)}
              className={`p-1.5 rounded-lg transition cursor-pointer ${
                isLiked
                  ? 'text-rose-500 bg-rose-50 dark:bg-rose-950/40'
                  : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
              title={isLiked ? 'Unlike' : 'Like'}
            >
              <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
            </button>

            <button
              onClick={() => onDelete(_id)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition cursor-pointer"
              title="Delete permanently"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
