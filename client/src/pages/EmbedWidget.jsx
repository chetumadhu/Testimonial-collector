import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import api from '../services/api';
import { StarRating } from '../components/StarRating';
import { ChevronLeft, ChevronRight, Star, Quote, Award } from 'lucide-react';

export const EmbedWidget = () => {
  const { spaceSlug } = useParams();
  const [searchParams] = useSearchParams();

  const layout = searchParams.get('layout') || 'grid'; // grid, carousel, badge
  const theme = searchParams.get('theme') || 'light'; // light, dark

  const [space, setSpace] = useState(null);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 5.0 });
  const [testimonials, setTestimonials] = useState([]);
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchEmbedData = useCallback(async () => {
    try {
      const res = await api.get(`/public/space/${spaceSlug}/wall`);
      if (res.data.success) {
        setSpace(res.data.space);
        setStats(res.data.stats);
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Embed load error:', err);
    } finally {
      setLoading(false);
    }
  }, [spaceSlug]);

  useEffect(() => {
    fetchEmbedData();
  }, [fetchEmbedData]);

  const isDark = theme === 'dark';

  if (loading) {
    return (
      <div className={`p-6 flex items-center justify-center ${isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'}`}>
        <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return (
      <div className={`p-4 text-center text-xs ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-white text-slate-500'}`}>
        No verified reviews yet.
      </div>
    );
  }

  // BADGE LAYOUT
  if (layout === 'badge') {
    return (
      <div
        className={`p-3 font-['Plus_Jakarta_Sans',sans-serif] ${
          isDark ? 'bg-slate-950 text-white' : 'bg-white text-slate-900'
        }`}
      >
        <div
          className={`inline-flex items-center space-x-3 px-4 py-2.5 rounded-2xl border shadow-sm ${
            isDark
              ? 'bg-slate-900 border-slate-800 text-white'
              : 'bg-white border-slate-200 text-slate-900'
          }`}
        >
          <div className="flex -space-x-2 overflow-hidden">
            {testimonials.slice(0, 4).map((t, idx) => (
              <img
                key={idx}
                src={
                  t.avatarUrl ||
                  `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(t.clientName)}`
                }
                alt={t.clientName}
                className="inline-block h-7 w-7 rounded-full ring-2 ring-white dark:ring-slate-900 object-cover"
              />
            ))}
          </div>

          <div className="flex flex-col">
            <div className="flex items-center space-x-1">
              <StarRating rating={Math.round(stats.avgRating)} readOnly size="sm" />
              <span className="text-xs font-bold ml-1">{stats.avgRating.toFixed(1)}/5.0</span>
            </div>
            <span className={`text-[11px] font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Loved by <strong>{stats.totalReviews}+ customers</strong> on {space?.name}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // CAROUSEL LAYOUT
  if (layout === 'carousel') {
    const current = testimonials[carouselIndex] || testimonials[0];
    const handlePrev = () => {
      setCarouselIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    };
    const handleNext = () => {
      setCarouselIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    };

    return (
      <div
        className={`p-4 font-['Plus_Jakarta_Sans',sans-serif] ${
          isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <div
          className={`max-w-xl mx-auto rounded-2xl p-6 border shadow-sm relative ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <StarRating rating={current.rating} readOnly size="sm" />
            <span className="text-[11px] font-mono text-slate-400">
              {carouselIndex + 1} / {testimonials.length}
            </span>
          </div>

          <p
            className={`text-sm leading-relaxed mb-6 ${
              isDark ? 'text-slate-200' : 'text-slate-700'
            }`}
          >
            "{current.reviewText}"
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center space-x-3">
              {current.avatarUrl && (
                <img
                  src={current.avatarUrl}
                  alt={current.clientName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              )}
              <div>
                <h4 className="text-xs font-bold">{current.clientName}</h4>
                {current.companyRole && (
                  <p className="text-[11px] text-slate-400">{current.companyRole}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-1.5">
              <button
                onClick={handlePrev}
                className={`p-1.5 rounded-lg border transition ${
                  isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className={`p-1.5 rounded-lg border transition ${
                  isDark
                    ? 'border-slate-800 hover:bg-slate-800 text-slate-300'
                    : 'border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // GRID LAYOUT (DEFAULT)
  return (
    <div
      className={`p-6 font-['Plus_Jakarta_Sans',sans-serif] ${
        isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'
      }`}
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {testimonials.map((t) => (
          <div
            key={t._id}
            className={`rounded-2xl p-5 border shadow-sm transition ${
              isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
            }`}
          >
            <div className="mb-2.5">
              <StarRating rating={t.rating} readOnly size="sm" />
            </div>

            <p
              className={`text-xs leading-relaxed mb-4 ${
                isDark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              "{t.reviewText}"
            </p>

            <div className="flex items-center space-x-2.5 pt-3 border-t border-slate-100 dark:border-slate-800">
              {t.avatarUrl ? (
                <img
                  src={t.avatarUrl}
                  alt={t.clientName}
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-500 font-bold text-xs flex items-center justify-center">
                  {t.clientName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <h4 className="text-xs font-bold truncate">{t.clientName}</h4>
                {t.companyRole && (
                  <p className="text-[10px] text-slate-400 truncate">{t.companyRole}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
