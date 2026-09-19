import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../services/api';
import { MasonryGrid } from '../components/MasonryGrid';
import { StarRating } from '../components/StarRating';
import { Button } from '../components/ui/Button';
import { Search, Plus, Star, Heart, MessageSquareQuote } from 'lucide-react';

export const WallOfLove = () => {
  const { spaceSlug } = useParams();

  const [space, setSpace] = useState(null);
  const [stats, setStats] = useState({ totalReviews: 0, avgRating: 5.0 });
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [starFilter, setStarFilter] = useState('');

  const fetchWall = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (starFilter) params.append('rating', starFilter);

      const res = await api.get(`/public/space/${spaceSlug}/wall?${params.toString()}`);
      if (res.data.success) {
        setSpace(res.data.space);
        setStats(res.data.stats);
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Failed to load Wall of Love:', err);
    } finally {
      setLoading(false);
    }
  }, [spaceSlug, starFilter]);

  useEffect(() => {
    fetchWall();
  }, [fetchWall]);

  const filteredTestimonials = testimonials.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.clientName.toLowerCase().includes(q) ||
      (t.companyRole && t.companyRole.toLowerCase().includes(q)) ||
      t.reviewText.toLowerCase().includes(q)
    );
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Wall of Love Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">No active space found at this link.</p>
          <Link to="/" className="mt-4 inline-block text-emerald-600 underline text-sm">
            Go to TrustPulse Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/50 dark:bg-slate-950 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Wall of Love Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          {space.logoUrl && (
            <img
              src={space.logoUrl}
              alt={space.name}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover shadow-sm ring-1 ring-slate-200 dark:ring-slate-800"
            />
          )}

          <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800 text-xs font-bold mb-4">
            <Heart className="w-3.5 h-3.5 fill-rose-500" />
            <span>Wall of Love</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            Loved by fast-moving teams
          </h1>

          <p className="mt-3 text-base text-slate-600 dark:text-slate-400">
            Real stories and verified experiences from customers using {space.name}.
          </p>

          {/* Social Proof Stats Bar */}
          <div className="mt-6 inline-flex flex-wrap items-center justify-center gap-4 py-2.5 px-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-sm">
            <div className="flex items-center space-x-2">
              <span className="text-xl font-black text-slate-900 dark:text-white">
                {stats.avgRating.toFixed(1)}
              </span>
              <StarRating rating={Math.round(stats.avgRating)} readOnly size="sm" />
            </div>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              {stats.totalReviews} Verified {stats.totalReviews === 1 ? 'Review' : 'Reviews'}
            </span>

            <span className="text-slate-300 dark:text-slate-700">•</span>

            <Link to={`/collect/${space.slug}`}>
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center">
                <Plus className="w-3.5 h-3.5 mr-1" />
                Add Your Testimonial
              </span>
            </Link>
          </div>
        </div>

        {/* Filter & Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-10 max-w-4xl mx-auto">
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search reviews..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
            />
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
            <button
              onClick={() => setStarFilter('')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                starFilter === ''
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                  : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              All Reviews
            </button>

            {[5, 4, 3].map((star) => (
              <button
                key={star}
                onClick={() => setStarFilter(star.toString())}
                className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xl border transition cursor-pointer ${
                  starFilter === star.toString()
                    ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <span>{star}</span>
                <Star className="w-3 h-3 fill-current" />
              </button>
            ))}
          </div>
        </div>

        {/* Responsive Masonry Grid (Req D) */}
        <MasonryGrid testimonials={filteredTestimonials} isOwnerView={false} />

        {/* Footer */}
        <div className="mt-20 pt-8 border-t border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center space-x-2">
          <span>Powered by</span>
          <Link to="/" className="font-bold text-slate-700 dark:text-slate-300 hover:underline">
            TrustPulse Social Proof Platform
          </Link>
        </div>
      </div>
    </div>
  );
};
