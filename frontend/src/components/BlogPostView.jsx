import React, { useState } from 'react';
import { 
  ArrowLeft, Clock, Calendar, User, Share2, Check, 
  HelpCircle, ChevronDown, ChevronUp, Sparkles, ExternalLink, 
  CheckCircle2, AlertTriangle, Info, ArrowRight, Phone, MessageSquare
} from 'lucide-react';
import { getMergedBlogPosts } from '../data/blogData.js';

export default function BlogPostView({ postSlug, onBackToHub, onSelectPost, onOpenHire, onOpenTool }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [copiedLink, setCopiedLink] = useState(false);

  const allPosts = getMergedBlogPosts();
  const post = allPosts.find(p => p.slug === postSlug) || allPosts[0];
  const relatedPosts = allPosts.filter(p => p.slug !== post.slug).slice(0, 2);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  return (
    <article className="max-w-4xl mx-auto py-10 px-4 sm:px-6 space-y-10">
      
      {/* Top Breadcrumb & Back Action */}
      <div className="flex items-center justify-between gap-4 text-xs font-mono text-slate-400 pb-4 border-b border-slate-800">
        <button
          onClick={onBackToHub}
          className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-semibold cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>&larr; Back to Blog Hub</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white cursor-pointer transition-colors"
          >
            {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5 text-cyan-400" />}
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>

      {/* Article Header */}
      <header className="space-y-5">
        <div className="flex items-center gap-3 text-xs font-mono text-slate-400 flex-wrap">
          <span className="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 font-bold uppercase">
            {post.categoryLabel}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{post.readTime}</span>
          <span>•</span>
          <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />Published: {post.publishedAt}</span>
          <span>•</span>
          <span className="text-emerald-400 font-semibold">Updated: {post.updatedAt}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
          {post.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-light">
          {post.excerpt}
        </p>

        {/* Author Byline Box */}
        <div className="flex items-center gap-3 p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center font-black text-slate-950 text-sm">
            W
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-1.5">
              <span>Waqas Mehmood</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono">Author & SEO Architect</span>
            </div>
            <div className="text-[11px] text-slate-400">
              Senior Digital Marketing & SEO Architect • 4.8x Avg ROAS • Hyderabad, Sindh
            </div>
          </div>
        </div>

        {/* Cover Image */}
        <div className="relative rounded-3xl overflow-hidden h-72 sm:h-96 w-full shadow-2xl border border-slate-800">
          <img 
            src={post.coverImage} 
            alt={post.title}
            width="1200"
            height="630"
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
          />
        </div>
      </header>

      {/* Table of Contents */}
      {post.sections && post.sections.length > 0 && (
        <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            Table of Contents
          </span>
          <nav className="space-y-1.5 text-xs">
            {post.sections.map((sec, i) => (
              <a
                key={sec.id}
                href={`#${sec.id}`}
                className="block text-slate-300 hover:text-cyan-400 transition-colors py-0.5"
              >
                <span className="text-slate-500 font-mono mr-2">{i + 1}.</span>
                <span>{sec.title}</span>
              </a>
            ))}
          </nav>
        </div>
      )}

      {/* Article Body Content */}
      <div className="space-y-10 text-slate-200 leading-relaxed text-sm sm:text-base">
        {post.sections.map((sec) => (
          <section key={sec.id} id={sec.id} className="space-y-4 pt-4">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight border-b border-slate-800/80 pb-2">
              {sec.title}
            </h2>

            <p className="text-slate-300 leading-relaxed whitespace-pre-line">
              {sec.content}
            </p>

            {/* Callout Box if present */}
            {sec.callout && (
              <div className={`p-4 sm:p-5 rounded-2xl border text-xs sm:text-sm space-y-1.5 ${
                sec.callout.type === 'important'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-200'
                  : sec.callout.type === 'warning'
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-200'
                  : 'bg-cyan-500/10 border-cyan-500/30 text-cyan-200'
              }`}>
                <div className="flex items-center gap-2 font-bold text-xs uppercase tracking-wider">
                  {sec.callout.type === 'important' ? <AlertTriangle className="w-4 h-4 text-amber-400" /> :
                   sec.callout.type === 'warning' ? <AlertTriangle className="w-4 h-4 text-rose-400" /> :
                   <Info className="w-4 h-4 text-cyan-400" />}
                  <span>{sec.callout.title}</span>
                </div>
                <p className="leading-relaxed opacity-90">
                  {sec.callout.text}
                </p>
              </div>
            )}

            {/* Checklist items if present */}
            {sec.checklist && (
              <div className="space-y-2.5 pt-2">
                {sec.checklist.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs sm:text-sm text-slate-300">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        ))}
      </div>

      {/* Embedded Moz-Style Interactive Tool Box */}
      {post.toolCta && (
        <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-[11px] font-mono text-cyan-400 uppercase font-bold tracking-wider">
              Free Native In-House Tool
            </span>
            <h3 className="text-lg sm:text-xl font-bold text-white">
              {post.toolCta.toolTitle}
            </h3>
            <p className="text-xs text-slate-400 max-w-md">
              Apply the framework from this guide directly using our free interactive tool.
            </p>
          </div>

          <button
            onClick={() => onOpenTool && onOpenTool(post.toolCta.toolSlug)}
            className="px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 shrink-0 flex items-center gap-2 cursor-pointer transition-all"
          >
            <span>{post.toolCta.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Frequently Asked Questions */}
      {post.faqs && post.faqs.length > 0 && (
        <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-5">
          <div className="flex items-center gap-2 text-white font-bold text-base">
            <HelpCircle className="w-5 h-5 text-cyan-400" />
            <span>Frequently Asked Questions</span>
          </div>

          <div className="space-y-3">
            {post.faqs.map((faq, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === i ? -1 : i)}
                  className="w-full flex items-center justify-between text-left text-xs sm:text-sm font-semibold text-white cursor-pointer"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === i ? <ChevronUp className="w-4 h-4 text-cyan-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                </button>
                {openFaqIndex === i && (
                  <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-slate-800/60">
                    {faq.a}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Author Bio & Hire Waqas CTA Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg shrink-0">
            W
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-white">About Waqas Mehmood</h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Assalam-o-Alaikum! I'm Waqas Mehmood, an established <strong>Best SEO Expert</strong>, senior SEO specialist, and full-stack software engineer. I specialize in compounding organic revenue, localized Google Maps domination, and scaling Google Ads with positive ROAS.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <button
                onClick={() => onOpenHire && onOpenHire(post.serviceCta?.serviceName || 'Full-Funnel Digital Marketing')}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs cursor-pointer shadow-lg shadow-cyan-500/20"
              >
                {post.serviceCta?.buttonText || 'Hire Waqas for Your Brand'}
              </button>
              <a
                href="https://wa.me/923033111126"
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2.5 rounded-xl bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 hover:bg-emerald-600/30 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>WhatsApp (+92 303 3111126)</span>
              </a>
            </div>

            {/* Author Social Media Profiles */}
            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-center sm:justify-start gap-4 text-xs">
              <span className="text-slate-400 text-[11px] font-mono">Connect with Waqas:</span>
              <div className="flex items-center gap-2.5">
                <a
                  href="https://www.linkedin.com/in/waqas-mehmood-657b7a8b/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors"
                  title="LinkedIn"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 8.76a1.59 1.59 0 1 0 0-3.18 1.59 1.59 0 0 0 0 3.18m1.4 9.74v-8.37H5.06v8.37h2.8z"/></svg>
                </a>
                <a
                  href="https://x.com/waqasmehmood89"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
                  title="X (Twitter)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a
                  href="https://share.google/rwnMRpUr6G9OqHnhy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-400 text-slate-400 hover:text-amber-400 flex items-center justify-center transition-colors"
                  title="Google Business Profile (GMB)"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z"/></svg>
                </a>
                <a
                  href="https://www.facebook.com/waqas.duacomm"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-blue-400 flex items-center justify-center transition-colors"
                  title="Facebook"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                <a
                  href="mailto:waqasmehmoodhyd@gmail.com"
                  className="w-7 h-7 rounded-lg bg-slate-950 border border-slate-800 hover:border-cyan-400 text-slate-400 hover:text-cyan-400 flex items-center justify-center transition-colors"
                  title="Direct Email"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z"/></svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Playbooks Grid */}
      {relatedPosts.length > 0 && (
        <div className="space-y-4 pt-6 border-t border-slate-800">
          <h3 className="text-sm font-mono uppercase font-bold text-slate-400 tracking-wider">
            Related Playbooks & Insights
          </h3>
          <div className="grid sm:grid-cols-2 gap-4">
            {relatedPosts.map((rel) => (
              <div
                key={rel.slug}
                onClick={() => onSelectPost(rel.slug)}
                className="p-5 rounded-2xl bg-slate-900/70 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 cursor-pointer transition-all space-y-2 group"
              >
                <span className="text-[10px] font-mono text-cyan-400 uppercase font-semibold">
                  {rel.categoryLabel}
                </span>
                <h4 className="text-sm font-bold text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                  {rel.title}
                </h4>
                <p className="text-xs text-slate-400 line-clamp-2">
                  {rel.excerpt}
                </p>
                <span className="text-xs font-bold text-cyan-400 pt-1 flex items-center gap-1">
                  Read Playbook &rarr;
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </article>
  );
}
