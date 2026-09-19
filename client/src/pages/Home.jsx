import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { StarRating } from '../components/StarRating';
import {
  MessageSquareQuote,
  ShieldCheck,
  Code2,
  Sparkles,
  ArrowRight,
  Zap,
  LayoutGrid,
  CheckCircle2,
} from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-700 dark:text-emerald-300 text-xs font-bold mb-8">
            <Sparkles className="w-4 h-4 text-emerald-500" />
            <span>Senja & Testimonial.to Alternative • Production Ready</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Collect testimonials without friction. <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-500 to-cyan-600">
              Convert visitors into buyers.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Launch branded review collection pages in 60 seconds, moderate with 1-click workflows, and embed glowing social proof widgets anywhere.
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" className="shadow-lg shadow-emerald-500/25">
                <span>Start Collecting Free</span>
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
            </Link>

            <Link to="/wall/acme-cloud">
              <Button variant="outline" size="lg">
                View Live Wall of Love
              </Button>
            </Link>

            <Link to="/collect/acme-cloud">
              <Button variant="secondary" size="lg">
                Test Public Form
              </Button>
            </Link>
          </div>

          {/* Quick Stats Banner */}
          <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-slate-500 dark:text-slate-400 text-sm font-medium">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-500" />
              <span>Pair-Token JWT Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Zap className="w-5 h-5 text-amber-500" />
              <span>Zero-Login Form for Clients</span>
            </div>
            <div className="flex items-center space-x-2">
              <Code2 className="w-5 h-5 text-indigo-500" />
              <span>Copy-Paste Iframe Widgets</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="py-16 bg-white dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">
              Built for high conversion and effortless management
            </h2>
            <p className="mt-3 text-slate-600 dark:text-slate-400">
              Everything you need to turn customer love into your most effective sales engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card hover className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                <MessageSquareQuote className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Frictionless Collection
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Clients never need to create an account or password. Direct branded URL with custom prompts, avatar upload, and 1–5 star rating.
              </p>
            </Card>

            <Card hover className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mb-6">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                1-Click Moderation Inbox
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Approve, archive, or pin testimonials as Featured with a single click. Filter instantly by star ratings, status tabs, and keyword search.
              </p>
            </Card>

            <Card hover className="p-8">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mb-6">
                <LayoutGrid className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                Wall of Love & Widgets
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Responsive Pinterest-style masonry showcase and embed generator with Grid, Carousel, and Badge layouts for your landing pages.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Interactive Mock Testimonial Preview */}
      <section className="py-20 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            What your Wall of Love looks like
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-2">
            Pixel-perfect cards designed to maximize credibility and social proof.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 border-emerald-500/30 ring-2 ring-emerald-500/20 bg-gradient-to-b from-emerald-50/20 to-white dark:from-emerald-950/20 dark:to-slate-900">
            <StarRating rating={5} readOnly size="sm" />
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              "TrustPulse increased our landing page conversion rate by 34% within the first week. Embedding the Wall of Love widget on Webflow took under 60 seconds!"
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80"
                alt="Sarah"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Sarah Jenkins</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">Head of Growth at DataDrive</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <StarRating rating={5} readOnly size="sm" />
            <p className="mt-3 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              "The pair token security and frictionless public collection link is what sold us. Our clients actually filled it out because there was no login required."
            </p>
            <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center space-x-3">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                alt="Marcus"
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">Marcus Vance</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">CTO at Hypergrowth</p>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
};
