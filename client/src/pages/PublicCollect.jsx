import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import api from '../services/api';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/StarRating';
import {
  MessageSquareQuote,
  Upload,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const PublicCollect = () => {
  const { spaceSlug } = useParams();

  const [space, setSpace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  // Form State
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [companyRole, setCompanyRole] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Status & Validation
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);
  const [thankYouInfo, setThankYouInfo] = useState(null);

  useEffect(() => {
    fetchPublicSpace();
  }, [spaceSlug]);

  const fetchPublicSpace = async () => {
    try {
      const res = await api.get(`/public/space/${spaceSlug}`);
      if (res.data.success) {
        setSpace(res.data.data);
      }
    } catch (err) {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    if (!clientName.trim() || !clientEmail.trim() || !reviewText.trim()) {
      return setError('Please fill in your name, email, and testimonial text.');
    }

    if (space?.settings?.mandatoryAvatar && !avatarFile) {
      return setError('The space owner requires a photo/avatar upload.');
    }

    setSubmitLoading(true);

    try {
      const formData = new FormData();
      formData.append('clientName', clientName);
      formData.append('clientEmail', clientEmail);
      formData.append('companyRole', companyRole);
      formData.append('rating', rating);
      formData.append('reviewText', reviewText);
      if (avatarFile) {
        formData.append('avatar', avatarFile);
      }

      const res = await api.post(`/public/space/${spaceSlug}/testimonials`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (res.data.success) {
        setSubmittedSuccess(true);
        setThankYouInfo({
          title: res.data.thankYouTitle,
          message: res.data.message,
          redirectUrl: res.data.redirectUrl,
        });

        // Trigger confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 70,
            origin: { y: 0.6 },
          });
        } catch (e) {}
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong submitting your review');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="w-12 h-12 rounded-full border-4 border-emerald-500/20 border-t-emerald-500 animate-spin" />
      </div>
    );
  }

  if (notFound || !space) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Space Not Found</h2>
          <p className="text-sm text-slate-500 mt-2">
            The collection link you visited does not exist or has been disabled.
          </p>
          <Link to="/" className="mt-4 inline-block text-emerald-600 underline text-sm">
            Go to TrustPulse Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        {/* Brand Header */}
        <div className="text-center mb-8">
          {space.logoUrl ? (
            <img
              src={space.logoUrl}
              alt={space.name}
              className="w-16 h-16 rounded-2xl mx-auto mb-4 object-cover shadow-md ring-2 ring-white dark:ring-slate-800"
            />
          ) : (
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center text-white text-xl font-black mx-auto mb-4 shadow-lg shadow-emerald-500/20">
              {space.name.slice(0, 2).toUpperCase()}
            </div>
          )}

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {space.headerTitle || space.name}
          </h1>

          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            {space.customMessage}
          </p>
        </div>

        {/* Success Screen with Confetti */}
        {submittedSuccess ? (
          <Card className="p-8 text-center border-slate-200/80 dark:border-slate-800 shadow-xl animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              {thankYouInfo?.title || 'Thank you so much! 🎉'}
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
              {thankYouInfo?.message}
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <Link to={`/wall/${space.slug}`}>
                <Button variant="outline" size="sm" className="w-full sm:w-auto">
                  <span>View Wall of Love</span>
                  <ExternalLink className="w-3.5 h-3.5 ml-1.5" />
                </Button>
              </Link>

              {thankYouInfo?.redirectUrl && (
                <a href={thankYouInfo.redirectUrl} target="_blank" rel="noreferrer">
                  <Button size="sm" className="w-full sm:w-auto">
                    Continue to Website
                  </Button>
                </a>
              )}
            </div>
          </Card>
        ) : (
          <Card className="p-6 sm:p-8 shadow-xl border-slate-200/80 dark:border-slate-800">
            {/* Guided Questions Box */}
            {space.questions && space.questions.length > 0 && (
              <div className="mb-6 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60">
                <div className="flex items-center space-x-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                  <HelpCircle className="w-4 h-4 text-emerald-500" />
                  <span>Questions to help you write:</span>
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 list-disc list-inside">
                  {space.questions.map((q, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {error && (
              <div className="mb-5 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Star Rating Selector */}
              {space.settings?.collectStarRating && (
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
                    Your Rating
                  </label>
                  <div className="flex items-center space-x-3 bg-slate-50 dark:bg-slate-800/40 p-3 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
                    <StarRating
                      rating={rating}
                      onChange={(newRating) => setRating(newRating)}
                      size="lg"
                    />
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      {rating} out of 5 stars
                    </span>
                  </div>
                </div>
              )}

              {/* Testimonial Text */}
              <Textarea
                label="Your Review / Testimonial"
                placeholder="Write your honest thoughts here..."
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                rows={5}
                required
              />

              {/* Client Name & Role */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                  label="Your Full Name"
                  placeholder="e.g. Alex Smith"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  required
                />

                <Input
                  label="Company & Role"
                  placeholder="e.g. CTO at Acme"
                  value={companyRole}
                  onChange={(e) => setCompanyRole(e.target.value)}
                />
              </div>

              {/* Client Email */}
              <Input
                label="Your Email"
                type="email"
                placeholder="alex@company.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                helperText="Your email remains private and will never be published publicly."
                required
              />

              {/* Avatar Upload */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Photo / Avatar {space.settings?.mandatoryAvatar ? '(Required)' : '(Optional)'}
                </label>
                <div className="flex items-center space-x-4">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover ring-2 ring-emerald-500"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400">
                      <Upload className="w-5 h-5" />
                    </div>
                  )}

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="text-xs text-slate-500 file:mr-3 file:py-2 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-slate-100 file:text-slate-700 dark:file:bg-slate-800 dark:file:text-slate-300 hover:file:bg-slate-200 cursor-pointer"
                  />
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full shadow-lg shadow-emerald-500/20 mt-4"
                loading={submitLoading}
              >
                <span>Submit Feedback</span>
                <Sparkles className="w-4 h-4 ml-2" />
              </Button>
            </form>
          </Card>
        )}

        <div className="mt-8 text-center text-xs text-slate-400">
          Powered by{' '}
          <Link to="/" className="font-semibold text-slate-600 dark:text-slate-300 hover:underline">
            TrustPulse
          </Link>
        </div>
      </div>
    </div>
  );
};
