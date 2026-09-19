import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StatsCard } from '../components/StatsCard';
import { TestimonialCard } from '../components/TestimonialCard';
import { EmbedModal } from '../components/EmbedModal';
import {
  ArrowLeft,
  ExternalLink,
  Code2,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Archive,
  Layers,
  Star,
  Trash2,
} from 'lucide-react';

export const SpaceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [space, setSpace] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States (Req C)
  const [activeTab, setActiveTab] = useState('all'); // all, pending, approved, archived
  const [searchQuery, setSearchQuery] = useState('');
  const [starFilter, setStarFilter] = useState('');
  const [featuredOnly, setFeaturedOnly] = useState(false);

  // Embed Modal State (Req D)
  const [isEmbedModalOpen, setIsEmbedModalOpen] = useState(false);

  const fetchSpaceData = useCallback(async () => {
    try {
      const spaceRes = await api.get(`/spaces/${id}`);
      if (spaceRes.data.success) {
        setSpace(spaceRes.data.data);
      }

      const analyticsRes = await api.get(`/spaces/${id}/analytics`);
      if (analyticsRes.data.success) {
        setAnalytics(analyticsRes.data.data);
      }
    } catch (err) {
      console.error('Error loading space:', err);
    }
  }, [id]);

  const fetchTestimonials = useCallback(async () => {
    try {
      const params = new URLSearchParams();
      if (activeTab !== 'all') params.append('status', activeTab);
      if (searchQuery) params.append('search', searchQuery);
      if (starFilter) params.append('rating', starFilter);
      if (featuredOnly) params.append('featured', 'true');

      const res = await api.get(`/spaces/${id}/testimonials?${params.toString()}`);
      if (res.data.success) {
        setTestimonials(res.data.data);
      }
    } catch (err) {
      console.error('Error loading testimonials:', err);
    } finally {
      setLoading(false);
    }
  }, [id, activeTab, searchQuery, starFilter, featuredOnly]);

  useEffect(() => {
    fetchSpaceData();
  }, [fetchSpaceData]);

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // Moderation Handlers
  const handleStatusChange = async (testimonialId, newStatus) => {
    try {
      await api.patch(`/testimonials/${testimonialId}/status`, { status: newStatus });
      fetchTestimonials();
      fetchSpaceData();
    } catch (err) {
      console.error('Failed to update status:', err);
    }
  };

  const handleToggleFeature = async (testimonialId) => {
    try {
      await api.patch(`/testimonials/${testimonialId}/feature`);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to toggle feature:', err);
    }
  };

  const handleToggleLike = async (testimonialId) => {
    try {
      await api.patch(`/testimonials/${testimonialId}/like`);
      fetchTestimonials();
    } catch (err) {
      console.error('Failed to toggle like:', err);
    }
  };

  const handleDelete = async (testimonialId) => {
    if (window.confirm('Are you sure you want to permanently delete this testimonial?')) {
      try {
        await api.delete(`/testimonials/${testimonialId}`);
        fetchTestimonials();
        fetchSpaceData();
      } catch (err) {
        console.error('Failed to delete testimonial:', err);
      }
    }
  };

  const handleDeleteSpace = async () => {
    if (window.confirm('Are you sure you want to delete this space and all its reviews?')) {
      try {
        await api.delete(`/spaces/${id}`);
        navigate('/dashboard');
      } catch (err) {
        console.error('Failed to delete space:', err);
      }
    }
  };

  if (!space && loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="h-40 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
      </div>
    );
  }

  if (!space) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-slate-800 dark:text-white">Space not found</h2>
        <Link to="/dashboard" className="mt-4 inline-block text-emerald-600 underline text-sm">
          Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center space-x-3">
          <Link
            to="/dashboard"
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-black text-slate-900 dark:text-white">
                {space.name}
              </h1>
              <span className="text-xs font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
                /collect/{space.slug}
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Review Moderation Inbox & Social Proof Command Center
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 flex-wrap gap-y-2">
          {/* Embed Generator Trigger */}
          <Button
            onClick={() => setIsEmbedModalOpen(true)}
            variant="outline"
            size="sm"
            className="text-xs"
          >
            <Code2 className="w-4 h-4 mr-1.5 text-indigo-500" />
            <span>Embed Widget</span>
          </Button>

          {/* Public Collection Form Link */}
          <a
            href={`/collect/${space.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
          >
            <span>Public Form</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-slate-400" />
          </a>

          {/* Wall of Love Link */}
          <a
            href={`/wall/${space.slug}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center px-3 py-1.5 text-xs font-semibold rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
          >
            <span>Wall of Love</span>
            <ExternalLink className="w-3.5 h-3.5 ml-1.5 text-emerald-500" />
          </a>

          <button
            onClick={handleDeleteSpace}
            className="p-2 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl transition"
            title="Delete Space"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Requirement E: Rating Metrics & Summary Stats */}
      <StatsCard analytics={analytics} spaceName={space.name} />

      {/* Requirement C: Review Moderation & Tagging Inbox */}
      <Card className="p-6 border-slate-200/80 dark:border-slate-800 shadow-sm">
        {/* Tabbed Review Filters */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center space-x-1 bg-slate-100 dark:bg-slate-800/70 p-1 rounded-xl">
            {[
              { id: 'all', label: 'All Reviews', icon: Layers, count: analytics?.totalReviews },
              { id: 'pending', label: 'Pending', icon: Clock, count: analytics?.pendingReviews },
              { id: 'approved', label: 'Approved', icon: CheckCircle2, count: analytics?.approvedReviews },
              { id: 'archived', label: 'Archived', icon: Archive, count: analytics?.archivedReviews },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                    isActive
                      ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm'
                      : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-emerald-500' : ''}`} />
                  <span>{tab.label}</span>
                  {tab.count !== undefined && (
                    <span
                      className={`ml-1 text-[10px] px-1.5 py-0.2 rounded-full ${
                        isActive
                          ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                          : 'bg-slate-200/60 dark:bg-slate-700/60 text-slate-500'
                      }`}
                    >
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Search and Star Filters */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            {/* Keyword Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search text, name, email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 w-48 sm:w-60"
              />
            </div>

            {/* Star Rating Filter */}
            <select
              value={starFilter}
              onChange={(e) => setStarFilter(e.target.value)}
              className="px-3 py-1.5 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            >
              <option value="">All Stars</option>
              <option value="5">5 Stars only</option>
              <option value="4">4 Stars only</option>
              <option value="3">3 Stars only</option>
              <option value="2">2 Stars only</option>
              <option value="1">1 Star only</option>
            </select>

            {/* Featured Only Toggle */}
            <button
              onClick={() => setFeaturedOnly(!featuredOnly)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-xl border transition flex items-center space-x-1 cursor-pointer ${
                featuredOnly
                  ? 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 border-amber-300 dark:border-amber-700'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
              }`}
            >
              <Star className={`w-3.5 h-3.5 ${featuredOnly ? 'fill-amber-400 text-amber-400' : ''}`} />
              <span>Featured</span>
            </button>
          </div>
        </div>

        {/* Testimonials List */}
        <div className="mt-6">
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
                />
              ))}
            </div>
          ) : testimonials.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No submissions found for the current filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {testimonials.map((item) => (
                <TestimonialCard
                  key={item._id}
                  testimonial={item}
                  isOwnerView={true}
                  onStatusChange={handleStatusChange}
                  onToggleFeature={handleToggleFeature}
                  onToggleLike={handleToggleLike}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </Card>

      {/* Embed Generator Modal */}
      <EmbedModal
        isOpen={isEmbedModalOpen}
        onClose={() => setIsEmbedModalOpen(false)}
        spaceSlug={space.slug}
        spaceName={space.name}
      />
    </div>
  );
};
