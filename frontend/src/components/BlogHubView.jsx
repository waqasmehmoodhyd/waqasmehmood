import React, { useState, useMemo } from 'react';
import { 
  BookOpen, Sparkles, Clock, Calendar, ArrowRight, 
  Search, Filter, ExternalLink, ChevronRight, User, ShieldCheck, Zap,
  PenTool, Plus
} from 'lucide-react';
import { BLOG_CATEGORIES, getMergedBlogPosts } from '../data/blogData.js';

export default function BlogHubView({ onSelectPost, onOpenHire, onOpenTool, onOpenStudio, isAdmin }) {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const allPosts = useMemo(() => getMergedBlogPosts(), []);

  const filteredPosts = useMemo(() => {
    return allPosts.filter((post) => {
      const matchesCat = selectedCategory === 'all' || post.category === selectedCategory;
      const q = searchQuery.trim().toLowerCase();
      const matchesSearch = !q || 
        post.title.toLowerCase().includes(q) || 
        post.excerpt.toLowerCase().includes(q) ||
        post.categoryLabel.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [allPosts, selectedCategory, searchQuery]);

  const featuredPost = useMemo(() => {
    return allPosts.find(p => p.featured) || allPosts[0];
  }, [allPosts]);

  return (
    <div className="space-y-12 max-w-6xl mx-auto py-10 px-4 sm:px-6">
      
      {/* Blog Hub Hero */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
          <span>Engineering-Grade Insights & Playbooks</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          SEO, PPC & Growth Architecture <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Technical Knowledge Base
          </span>
        </h1>

        <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
          Battle-tested frameworks, local Google Maps ranking playbooks, and negative keyword PPC methodologies engineered by established Best SEO Expert <strong>Waqas Mehmood</strong>.
        </p>

        {/* Live Search & Filter Bar */}
        <div className="pt-4 max-w-xl mx-auto space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search guides by keyword (e.g. Local SEO, ROAS, Schema)..."
              className="w-full pl-11 pr-4 py-3 bg-slate-900 border border-slate-700/80 rounded-2xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400 shadow-xl"
            />
          </div>

          {/* Blog Studio Trigger */}
          <div className="flex justify-center">
            <button
              onClick={onOpenStudio}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 hover:text-white text-xs font-bold transition-all shadow-lg hover:shadow-cyan-500/10 cursor-pointer"
            >
              <PenTool className="w-3.5 h-3.5 text-cyan-400" />
              <span>✍️ Open Blog Studio (Rank Math On-Page SEO Engine)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Categories Filter Pills */}
      <div className="flex items-center justify-center gap-2 flex-wrap text-xs font-semibold">
        {BLOG_CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer border ${
                isSelected
                  ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                  : 'bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Featured Cornerstone Article Card */}
      {selectedCategory === 'all' && !searchQuery && featuredPost && (
        <div 
          onClick={() => onSelectPost(featuredPost.slug)}
          className="group rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/50 shadow-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 grid md:grid-cols-12 gap-0"
        >
          <div className="md:col-span-6 relative h-64 md:h-auto overflow-hidden bg-slate-950">
            <img 
              src={featuredPost.coverImage} 
              alt={featuredPost.title}
              width="1200"
              height="630"
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-cyan-500 text-slate-950 text-xs font-bold font-mono">
              ★ Featured Playbook
            </div>
          </div>

          <div className="md:col-span-6 p-6 sm:p-8 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="text-cyan-400 font-semibold">{featuredPost.categoryLabel}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{featuredPost.readTime}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" />{featuredPost.publishedAt}</span>
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white group-hover:text-cyan-400 transition-colors leading-tight">
                {featuredPost.title}
              </h2>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed line-clamp-3">
                {featuredPost.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs font-bold text-cyan-400">
              <span className="flex items-center gap-1.5 group-hover:underline">
                Read Complete Technical Guide <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
              <span className="text-[11px] font-mono text-slate-500 font-normal">By Waqas Mehmood</span>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Articles */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-2 border-b border-slate-800">
          <h3 className="text-sm font-mono uppercase font-bold text-slate-400 tracking-wider">
            All Guides & Playbooks ({filteredPosts.length})
          </h3>
        </div>

        {filteredPosts.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-slate-400 text-sm">No articles matched your search query.</p>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
              className="text-xs text-cyan-400 underline font-semibold cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <div
                key={post.slug}
                onClick={() => onSelectPost(post.slug)}
                className="group rounded-3xl bg-slate-900/80 hover:bg-slate-900 border border-slate-800 hover:border-cyan-500/40 shadow-xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                    <img 
                      src={post.coverImage} 
                      alt={post.title}
                      width="800"
                      height="450"
                      loading="lazy"
                      decoding="async"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                      {post.categoryLabel}
                    </div>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
                      <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{post.readTime}</span>
                      <span>•</span>
                      <span>{post.publishedAt}</span>
                    </div>

                    <h4 className="text-base font-bold text-white group-hover:text-cyan-400 transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h4>

                    <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                      {post.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs font-semibold text-cyan-400">
                    <span>Read Article &rarr;</span>
                    <span className="text-[10px] font-mono text-slate-500">Waqas Mehmood</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Bottom Conversion Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 shadow-2xl text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-white">
          Want These Exact Engineering Playbooks Executed on Your Site?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          I don't just write technical guides. I manage client campaigns, engineer full-stack architectures, and scale Google Maps 3-Pack rankings.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onOpenHire && onOpenHire('Full-Funnel Digital Marketing')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 cursor-pointer"
          >
            Hire Waqas for Your Brand
          </button>
          <a
            href="https://wa.me/923033111126"
            target="_blank"
            rel="noopener noreferrer"
            className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-xs sm:text-sm font-semibold cursor-pointer"
          >
            WhatsApp Consultation (+92 303 3111126)
          </a>
        </div>
      </div>

    </div>
  );
}
