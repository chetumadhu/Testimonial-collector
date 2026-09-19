import React, { useState } from 'react';
import { Modal } from './ui/Modal';
import { Button } from './ui/Button';
import { Copy, Check, Code2, LayoutGrid, SlidersHorizontal, ShieldCheck } from 'lucide-react';

export const EmbedModal = ({ isOpen, onClose, spaceSlug, spaceName }) => {
  const [layout, setLayout] = useState('grid');
  const [theme, setTheme] = useState('light');
  const [copied, setCopied] = useState(false);

  const origin = window.location.origin;
  const embedUrl = `${origin}/embed/${spaceSlug}?layout=${layout}&theme=${theme}`;
  const iframeSnippet = `<iframe\n  src="${embedUrl}"\n  width="100%"\n  height="${layout === 'badge' ? '120' : '650'}"\n  frameborder="0"\n  scrolling="no"\n  title="${spaceName || 'Testimonials'}"\n></iframe>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(iframeSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Embed Testimonial Widget" maxWidth="max-w-2xl">
      <div className="space-y-6">
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Customize and copy this embed snippet to display your verified social proof on Webflow, Shopify, WordPress, or your custom React/Next.js app.
        </p>

        {/* Customization Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Widget Layout
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'grid', label: 'Grid' },
                { id: 'carousel', label: 'Carousel' },
                { id: 'badge', label: 'Badge' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setLayout(opt.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    layout === opt.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-2">
              Color Theme
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'light', label: 'Light' },
                { id: 'dark', label: 'Dark' },
              ].map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setTheme(opt.id)}
                  className={`px-3 py-2 text-xs font-bold rounded-xl border transition cursor-pointer ${
                    theme === opt.id
                      ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Preview Box */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Live Preview
            </span>
            <span className="text-[11px] text-slate-400 font-mono">
              layout={layout}&theme={theme}
            </span>
          </div>

          <div
            className={`w-full rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-inner ${
              theme === 'dark' ? 'bg-slate-950' : 'bg-slate-50'
            }`}
          >
            <iframe
              src={embedUrl}
              title="Widget Preview"
              className="w-full border-0 transition-all duration-300"
              style={{ height: layout === 'badge' ? '120px' : '280px' }}
            />
          </div>
        </div>

        {/* Generated Code Snippet */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center space-x-1">
              <Code2 className="w-3.5 h-3.5" />
              <span>Copy Embed Code</span>
            </span>
          </div>

          <div className="relative">
            <pre className="p-3.5 rounded-xl bg-slate-900 text-slate-200 text-xs font-mono overflow-x-auto leading-relaxed selection:bg-emerald-500 selection:text-white">
              {iframeSnippet}
            </pre>
            <Button
              onClick={handleCopy}
              size="sm"
              variant={copied ? 'secondary' : 'primary'}
              className="absolute top-2.5 right-2.5 text-xs py-1 px-3 shadow-md"
            >
              {copied ? (
                <span className="flex items-center space-x-1 text-emerald-600">
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied!</span>
                </span>
              ) : (
                <span className="flex items-center space-x-1">
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copy Snippet</span>
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
