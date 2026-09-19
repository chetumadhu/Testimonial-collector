import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea } from '../components/ui/Input';
import { StarRating } from '../components/StarRating';
import {
  Plus,
  ExternalLink,
  Settings,
  MessageSquare,
  Sparkles,
  Inbox,
  Trash2,
  Copy,
  Check,
  Building,
} from 'lucide-react';

export const Dashboard = () => {
  const [spaces, setSpaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [copiedSlug, setCopiedSlug] = useState(null);

  // New Space Form State
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [headerTitle, setHeaderTitle] = useState('');
  const [customMessage, setCustomMessage] = useState('');
  const [questions, setQuestions] = useState([
    'What was your favorite feature?',
    'How has our product helped your team?',
    'Would you recommend us to friends?',
  ]);
  const [collectStarRating, setCollectStarRating] = useState(true);
  const [mandatoryAvatar, setMandatoryAvatar] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchSpaces();
  }, []);

  const fetchSpaces = async () => {
    try {
      const res = await api.get('/spaces');
      if (res.data.success) {
        setSpaces(res.data.data);
      }
    } catch (err) {
      console.error('Error fetching spaces:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleNameChange = (val) => {
    setName(val);
    if (!slug || slug === name.toLowerCase().replace(/[^a-z0-9]/g, '-')) {
      setSlug(
        val
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      );
    }
  };

  const handleQuestionChange = (index, value) => {
    const updated = [...questions];
    updated[index] = value;
    setQuestions(updated);
  };

  const addQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, '']);
    }
  };

  const removeQuestion = (index) => {
    if (questions.length > 1) {
      setQuestions(questions.filter((_, i) => i !== index));
    }
  };

  const handleCreateSpace = async (e) => {
    e.preventDefault();
    setFormError('');
    setCreateLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('slug', slug);
      formData.append('headerTitle', headerTitle || `Share your review with ${name}`);
      formData.append(
        'customMessage',
        customMessage || 'Your feedback helps us continuously build better products.'
      );
      formData.append('questions', JSON.stringify(questions.filter((q) => q.trim().length > 0)));
      formData.append(
        'settings',
        JSON.stringify({
          collectStarRating,
          mandatoryAvatar,
        })
      );
      if (logoFile) {
        formData.append('logo', logoFile);
      }

      const res = await api.post('/spaces', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setIsCreateModalOpen(false);
        resetForm();
        fetchSpaces();
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create space');
    } finally {
      setCreateLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setSlug('');
    setHeaderTitle('');
    setCustomMessage('');
    setLogoFile(null);
    setQuestions([
      'What was your favorite feature?',
      'How has our product helped your team?',
      'Would you recommend us to friends?',
    ]);
  };

  const copyPublicLink = (spaceSlug) => {
    const link = `${window.location.origin}/collect/${spaceSlug}`;
    navigator.clipboard.writeText(link);
    setCopiedSlug(spaceSlug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-8 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Your Spaces
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Manage your branded review collection pages, moderation inboxes, and embeds.
          </p>
        </div>

        <Button
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Space</span>
        </Button>
      </div>

      {/* Spaces List */}
      <div className="mt-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-48 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse"
              />
            ))}
          </div>
        ) : spaces.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-8 max-w-lg mx-auto">
            <Building className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              No spaces created yet
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-6">
              Create your first space to start collecting reviews from your clients.
            </p>
            <Button onClick={() => setIsCreateModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              Create Space
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {spaces.map((space) => (
              <Card
                key={space._id}
                hover
                className="flex flex-col justify-between p-6 border-slate-200/80 dark:border-slate-800"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex items-center space-x-3 min-w-0">
                      {space.logoUrl ? (
                        <img
                          src={space.logoUrl}
                          alt={space.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                          {space.name.slice(0, 2).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0">
                        <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                          {space.name}
                        </h3>
                        <span className="text-xs text-slate-400 font-mono">
                          /collect/{space.slug}
                        </span>
                      </div>
                    </div>

                    <Link to={`/space/${space._id}`}>
                      <button className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                        <Settings className="w-4 h-4" />
                      </button>
                    </Link>
                  </div>

                  {/* Quick Space Stats */}
                  <div className="grid grid-cols-3 gap-2 py-3 px-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl text-center mb-5">
                    <div>
                      <span className="text-lg font-bold text-slate-900 dark:text-white block">
                        {space.stats?.total || 0}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Total
                      </span>
                    </div>

                    <div className="border-x border-slate-200 dark:border-slate-700/60">
                      <span className="text-lg font-bold text-amber-500 block">
                        {space.stats?.pending || 0}
                      </span>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Pending
                      </span>
                    </div>

                    <div>
                      <div className="flex items-center justify-center space-x-0.5">
                        <span className="text-lg font-bold text-slate-900 dark:text-white">
                          {space.stats?.avgRating?.toFixed(1) || '5.0'}
                        </span>
                        <span className="text-amber-400 text-xs font-bold">★</span>
                      </div>
                      <span className="text-[10px] uppercase font-semibold text-slate-400">
                        Rating
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                  <Link to={`/space/${space._id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Inbox className="w-3.5 h-3.5 mr-1.5" />
                      Moderation Inbox
                    </Button>
                  </Link>

                  <button
                    onClick={() => copyPublicLink(space.slug)}
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition text-xs font-medium cursor-pointer"
                    title="Copy Public Collection Link"
                  >
                    {copiedSlug === space.slug ? (
                      <Check className="w-4 h-4 text-emerald-500" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>

                  <a
                    href={`/wall/${space.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition"
                    title="Open Wall of Love"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create New Space Modal */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create a New Space"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleCreateSpace} className="space-y-5">
          {formError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 text-xs">
              {formError}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Space Name"
              placeholder="e.g. Acme Corp"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              required
            />

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                Public URL Slug
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2.5 bg-slate-100 dark:bg-slate-800 border border-r-0 border-slate-200 dark:border-slate-700 rounded-l-xl text-xs text-slate-500 font-mono">
                  /collect/
                </span>
                <input
                  type="text"
                  placeholder="acme-corp"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value.toLowerCase().trim())}
                  className="w-full px-3.5 py-2.5 rounded-r-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                  required
                />
              </div>
            </div>
          </div>

          <Input
            label="Header Title"
            placeholder="e.g. Share your feedback with Acme Corp"
            value={headerTitle}
            onChange={(e) => setHeaderTitle(e.target.value)}
          />

          <Textarea
            label="Custom Message / Prompt for Clients"
            placeholder="Explain to your clients why their review matters..."
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={2}
          />

          {/* Logo Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
              Brand Logo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setLogoFile(e.target.files[0])}
              className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 dark:file:bg-slate-800 dark:file:text-slate-300 cursor-pointer"
            />
          </div>

          {/* Custom Questions */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Guided Questions for Clients
              </label>
              <button
                type="button"
                onClick={addQuestion}
                disabled={questions.length >= 5}
                className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
              >
                + Add Question
              </button>
            </div>
            <div className="space-y-2">
              {questions.map((q, idx) => (
                <div key={idx} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={q}
                    onChange={(e) => handleQuestionChange(idx, e.target.value)}
                    placeholder={`Question #${idx + 1}`}
                    className="flex-1 px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900"
                  />
                  {questions.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeQuestion(idx)}
                      className="p-2 text-slate-400 hover:text-rose-500"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Settings Toggles */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={collectStarRating}
                onChange={(e) => setCollectStarRating(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Collect 1–5 Star Rating
              </span>
            </label>

            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={mandatoryAvatar}
                onChange={(e) => setMandatoryAvatar(e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="text-xs font-medium text-slate-700 dark:text-slate-300">
                Require client photo / avatar upload
              </span>
            </label>
          </div>

          <div className="flex justify-end space-x-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsCreateModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" loading={createLoading}>
              Create Space
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
