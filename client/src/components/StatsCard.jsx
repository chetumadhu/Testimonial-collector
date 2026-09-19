import React from 'react';
import { StarRating } from './StarRating';
import { Card } from './ui/Card';
import { Star, MessageSquareCheck, Award } from 'lucide-react';

export const StatsCard = ({ analytics, spaceName }) => {
  if (!analytics) return null;

  const {
    totalReviews = 0,
    approvedReviews = 0,
    pendingReviews = 0,
    avgRating = 5.0,
    recommendationRate = 100,
    distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
    distributionPercentages = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 },
  } = analytics;

  return (
    <Card className="mb-8 border-slate-200/80 dark:border-slate-800/80 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-950">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
        {/* Rating Overview */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
          <div className="flex items-baseline space-x-2">
            <span className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {avgRating.toFixed(1)}
            </span>
            <span className="text-lg font-medium text-slate-400">/ 5.0</span>
          </div>

          <div className="mt-2 mb-3">
            <StarRating rating={Math.round(avgRating)} readOnly size="md" />
          </div>

          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Based on {approvedReviews} verified {approvedReviews === 1 ? 'review' : 'reviews'}
          </p>

          <div className="mt-4 flex items-center space-x-2 text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-3 py-1.5 rounded-lg border border-emerald-200 dark:border-emerald-800">
            <Award className="w-4 h-4" />
            <span>{recommendationRate}% of customers recommend {spaceName || 'you'}</span>
          </div>
        </div>

        {/* Star Distribution Breakdown */}
        <div className="space-y-2 border-b md:border-b-0 md:border-r border-slate-100 dark:border-slate-800 pb-6 md:pb-0 md:pr-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Rating Distribution
          </h4>
          {[5, 4, 3, 2, 1].map((star) => {
            const count = distribution[star] || 0;
            const pct = distributionPercentages[star] || 0;

            return (
              <div key={star} className="flex items-center text-xs space-x-2">
                <div className="flex items-center space-x-1 w-10 text-slate-600 dark:text-slate-300 font-semibold">
                  <span>{star}</span>
                  <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                </div>

                <div className="flex-1 h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-amber-400 rounded-full transition-all duration-500 ease-out"
                    style={{ width: `${pct}%` }}
                  />
                </div>

                <div className="w-12 text-right text-slate-400 font-mono text-[11px]">
                  {count} ({pct}%)
                </div>
              </div>
            );
          })}
        </div>

        {/* Quick Insights & Queue */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
            Inbox Status
          </h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Pending Approval
              </span>
              <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {pendingReviews}
              </span>
            </div>

            <div className="bg-slate-50 dark:bg-slate-800/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">
                Total Submissions
              </span>
              <span className="text-2xl font-bold text-slate-800 dark:text-slate-200">
                {totalReviews}
              </span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
