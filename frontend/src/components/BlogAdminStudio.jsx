import React, { useState, useMemo, useEffect } from 'react';
import { 
  Sparkles, CheckCircle2, AlertCircle, XCircle, HelpCircle, 
  Eye, Save, Trash2, Plus, ArrowLeft, RefreshCw, Copy, Check, 
  FileText, Search, ExternalLink, Image, Link as LinkIcon, 
  Layers, Sliders, ChevronDown, ChevronUp, AlertTriangle, 
  Info, Compass, Code, Smartphone, Monitor
} from 'lucide-react';
import { BLOG_CATEGORIES, BLOG_POSTS, getMergedBlogPosts, saveCustomBlogPost, deleteCustomBlogPost } from '../data/blogData.js';

const EMPTY_TEMPLATE = {
  slug: '',
  title: '',
  seoTitle: '',
  seoDesc: '',
  focusKeyword: '',
  secondaryKeywords: '',
  category: 'technical-seo',
  categoryLabel: 'Technical SEO',
  readTime: '7 min read',
  coverImage: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80',
  imageAlt: '',
  excerpt: '',
  featured: false,
  sections: [
    {
      id: 'introduction-overview',
      title: 'Strategic Overview & Core Objective',
      content: 'Start your article with a compelling introduction answering the primary user query directly within the first 100 words.',
      callout: {
        type: 'important',
        title: 'Key Takeaway',
        text: 'State your unique insight, data-driven benchmark, or actionable framework immediately to satisfy search intent.'
      },
      checklist: [
        'Define the primary search intent and commercial objective.',
        'Outline the exact step-by-step implementation process.'
      ]
    },
    {
      id: 'step-by-step-framework',
      title: 'Actionable Implementation Framework',
      content: 'Explain the core methodology with practical steps, avoiding thin content or repetitive fluff.',
      callout: {
        type: 'tip',
        title: 'Pro Tip',
        text: 'Use structured formatting and bullet points to maximize readability and AI search extraction.'
      },
      checklist: [
        'Verify technical prerequisites before executing changes.',
        'Monitor performance signals in Google Search Console.'
      ]
    }
  ],
  faqs: [
    {
      q: 'How does this strategy improve search engine visibility?',
      a: 'By satisfying both search intent and Google Helpful Content guidelines with structured data, clear hierarchy, and actionable insights.'
    },
    {
      q: 'How long before ranking improvements appear?',
      a: 'Noticeable indexing improvements typically occur within 2 to 4 weeks, with compounding organic rankings maturing over 2 to 3 months.'
    }
  ],
  toolCta: {
    toolSlug: 'website-seo-checker',
    toolTitle: 'Website SEO Checker',
    buttonText: 'Run Free On-Page Audit'
  },
  serviceCta: {
    serviceName: 'Technical SEO Retainer & Growth Strategy',
    buttonText: 'Hire Waqas Mehmood for SEO Strategy'
  }
};

export default function BlogAdminStudio({ onBackToBlog, onPreviewPost }) {
  const [activeTab, setActiveTab] = useState('general'); // general | content | faqs | cta | manage
  const [serpDevice, setSerpDevice] = useState('desktop'); // desktop | mobile
  const [postData, setPostData] = useState(() => {
    const merged = getMergedBlogPosts();
    return merged[0] ? JSON.parse(JSON.stringify(merged[0])) : EMPTY_TEMPLATE;
  });
  const [allPosts, setAllPosts] = useState(() => getMergedBlogPosts());
  const [savedNotice, setSavedNotice] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedSchema, setCopiedSchema] = useState(false);
  const [expandedSectionIdx, setExpandedSectionIdx] = useState(0);

  // Sync postData when choosing an existing post
  const handleSelectExistingPost = (slug) => {
    const found = allPosts.find(p => p.slug === slug);
    if (found) {
      setPostData(JSON.parse(JSON.stringify(found)));
      setSavedNotice(false);
    }
  };

  const handleStartNewPost = () => {
    if (window.confirm('Start a new blank blog post? Unsaved changes will be cleared.')) {
      setPostData(JSON.parse(JSON.stringify(EMPTY_TEMPLATE)));
      setSavedNotice(false);
    }
  };

  // Auto-generate slug from title if empty
  const handleTitleChange = (val) => {
    setPostData(prev => {
      const updated = { ...prev, title: val };
      if (!prev.slug || prev.slug === EMPTY_TEMPLATE.slug) {
        updated.slug = val.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      }
      if (!prev.seoTitle) {
        updated.seoTitle = `${val.substring(0, 48)} | Waqas Mehmood`;
      }
      return updated;
    });
  };

  // Section handling
  const handleAddSection = () => {
    const newSec = {
      id: `section-${Date.now()}`,
      title: 'New Content Section',
      content: 'Add actionable detailed explanations here.',
      callout: null,
      checklist: []
    };
    setPostData(prev => ({
      ...prev,
      sections: [...prev.sections, newSec]
    }));
    setExpandedSectionIdx(postData.sections.length);
  };

  const handleRemoveSection = (idx) => {
    if (postData.sections.length <= 1) {
      alert('A blog post must have at least 1 section.');
      return;
    }
    setPostData(prev => ({
      ...prev,
      sections: prev.sections.filter((_, i) => i !== idx)
    }));
  };

  // FAQ handling
  const handleAddFaq = () => {
    setPostData(prev => ({
      ...prev,
      faqs: [...(prev.faqs || []), { q: 'Frequently Asked Question?', a: 'Direct, concise answer in 40 to 60 words.' }]
    }));
  };

  const handleRemoveFaq = (idx) => {
    setPostData(prev => ({
      ...prev,
      faqs: (prev.faqs || []).filter((_, i) => i !== idx)
    }));
  };

  // =========================================================================
  // RANK MATH STYLE REAL-TIME ON-PAGE SEO SCORING ENGINE
  // =========================================================================
  const seoAudit = useMemo(() => {
    const p = postData;
    const focusKw = (p.focusKeyword || '').trim().toLowerCase();
    const title = (p.seoTitle || p.title || '').trim();
    const desc = (p.seoDesc || p.excerpt || '').trim();
    const slug = (p.slug || '').trim().toLowerCase();
    const coverAlt = (p.imageAlt || '').trim().toLowerCase();

    // Assemble entire content text
    const allContent = p.sections.map(s => `${s.title} ${s.content} ${(s.checklist || []).join(' ')}`).join(' ');
    const allWords = allContent.trim().split(/\s+/).filter(Boolean);
    const wordCount = allWords.length;
    const first100Words = allWords.slice(0, 100).join(' ').toLowerCase();

    // Keyword density
    let kwCount = 0;
    if (focusKw) {
      const regex = new RegExp(`\\b${focusKw.replace(/[-/\\^$*+?.()|[\]{}]/g, '\\$&')}\\b`, 'gi');
      const matches = allContent.match(regex);
      kwCount = matches ? matches.length : 0;
    }
    const kwDensity = wordCount > 0 && kwCount > 0 ? ((kwCount / wordCount) * 100).toFixed(1) : '0.0';

    // Subheadings check
    const subheadingsWithKw = p.sections.filter(s => focusKw && s.title.toLowerCase().includes(focusKw)).length;

    // Checks breakdown
    const basicChecks = [
      {
        id: 'kw_in_title',
        label: 'Focus keyword in SEO Title',
        passed: focusKw && title.toLowerCase().includes(focusKw),
        score: 10,
        tip: focusKw ? `Add "${focusKw}" into your SEO title.` : 'Choose a primary focus keyword first.'
      },
      {
        id: 'kw_in_desc',
        label: 'Focus keyword in Meta Description',
        passed: focusKw && desc.toLowerCase().includes(focusKw),
        score: 8,
        tip: `Include "${focusKw || 'focus keyword'}" naturally within your meta description.`
      },
      {
        id: 'kw_in_slug',
        label: 'Focus keyword in URL Slug',
        passed: focusKw && slug.includes(focusKw.replace(/\s+/g, '-')),
        score: 8,
        tip: `Ensure URL slug contains "${focusKw ? focusKw.replace(/\s+/g, '-') : 'keyword'}".`
      },
      {
        id: 'kw_first_100',
        label: 'Focus keyword in first 100 words',
        passed: focusKw && first100Words.includes(focusKw),
        score: 8,
        tip: 'State your primary keyword in the opening introductory paragraph.'
      },
      {
        id: 'content_length',
        label: `Content length (${wordCount} words)`,
        passed: wordCount >= 600,
        score: wordCount >= 1000 ? 6 : wordCount >= 600 ? 4 : 1,
        tip: wordCount >= 600 ? 'Great length! 1,000+ words yields maximum pillar authority.' : 'Aim for at least 600 words to avoid thin content penalties.'
      }
    ];

    const additionalChecks = [
      {
        id: 'kw_in_subheading',
        label: 'Focus keyword in H2/H3 subheadings',
        passed: subheadingsWithKw > 0,
        score: 6,
        tip: 'Add your focus keyword or close synonym to at least one section heading.'
      },
      {
        id: 'kw_in_alt',
        label: 'Focus keyword in Image ALT text',
        passed: focusKw && coverAlt.includes(focusKw),
        score: 6,
        tip: 'Describe your featured image with ALT text containing the focus keyword.'
      },
      {
        id: 'kw_density',
        label: `Keyword density (${kwDensity}%)`,
        passed: parseFloat(kwDensity) >= 0.5 && parseFloat(kwDensity) <= 2.5,
        score: 6,
        tip: parseFloat(kwDensity) > 2.5 
          ? 'Keyword stuffing warning! Reduce repetitions below 2.5%.' 
          : 'Aim for 0.5% to 2.0% natural keyword density with synonyms.'
      },
      {
        id: 'url_length',
        label: `URL length (${slug.length} chars)`,
        passed: slug.length > 5 && slug.length <= 75,
        score: 6,
        tip: 'Keep the URL slug concise, readable, and under 75 characters.'
      },
      {
        id: 'internal_tool_cta',
        label: 'Internal link to in-house tool or pillar',
        passed: Boolean(p.toolCta && p.toolCta.toolSlug),
        score: 6,
        tip: 'Select a relevant in-house tool to establish topic cluster siloing.'
      }
    ];

    const titleSnippetChecks = [
      {
        id: 'title_length',
        label: `Title length (${title.length} chars)`,
        passed: title.length >= 48 && title.length <= 64,
        score: 5,
        tip: 'Google SERP cuts off titles longer than ~60 chars (580px). Optimal: 50-60 chars.'
      },
      {
        id: 'title_power_brand',
        label: 'Title CTR: Power word / Year & Brand',
        passed: (/(2026|guide|best|how|playbook|scale|rank|framework)/i.test(title)) && title.includes('Waqas Mehmood'),
        score: 5,
        tip: 'Include a year (2026) or power word, and end with "| Waqas Mehmood".'
      },
      {
        id: 'desc_length',
        label: `Meta desc length (${desc.length} chars)`,
        passed: desc.length >= 135 && desc.length <= 165,
        score: 5,
        tip: 'Target 140 to 160 characters for complete display on mobile and desktop snippets.'
      }
    ];

    const readabilityChecks = [
      {
        id: 'has_checklists',
        label: 'Visual formatting: Bullets / Checklists',
        passed: p.sections.some(s => s.checklist && s.checklist.length > 0),
        score: 4,
        tip: 'Break dense text with actionable bullet points or step lists.'
      },
      {
        id: 'has_callouts',
        label: 'E-E-A-T Signal: Highlight callout box',
        passed: p.sections.some(s => s.callout && s.callout.text),
        score: 4,
        tip: 'Add a Tip, Important, or Warning callout to emphasize expert knowledge.'
      },
      {
        id: 'has_faqs',
        label: 'FAQ section for Google FAQPage schema',
        passed: (p.faqs || []).length >= 2,
        score: 4,
        tip: 'Add at least 2 FAQs answering real "People Also Ask" questions.'
      },
      {
        id: 'service_cta',
        label: 'Conversion CTA: Direct consultation link',
        passed: Boolean(p.serviceCta && p.serviceCta.serviceName),
        score: 3,
        tip: 'Include a high-intent consultation CTA pointing to /contact.'
      }
    ];

    // Calculate total score
    const allChecks = [...basicChecks, ...additionalChecks, ...titleSnippetChecks, ...readabilityChecks];
    const passedChecks = allChecks.filter(c => c.passed);
    const rawScore = allChecks.reduce((acc, c) => acc + (c.passed ? c.score : 0), 0);
    const score = Math.min(100, Math.max(0, rawScore));

    return {
      score,
      totalChecks: allChecks.length,
      passedCount: passedChecks.length,
      wordCount,
      kwDensity,
      kwCount,
      basicChecks,
      additionalChecks,
      titleSnippetChecks,
      readabilityChecks
    };
  }, [postData]);

  // Save handler
  const handleSavePost = () => {
    if (!postData.title.trim()) {
      alert('Please enter a title for the blog post.');
      return;
    }
    if (!postData.slug.trim()) {
      alert('Please enter a valid URL slug.');
      return;
    }

    const payload = {
      ...postData,
      categoryLabel: BLOG_CATEGORIES.find(c => c.id === postData.category)?.label || 'SEO & Growth'
    };

    const success = saveCustomBlogPost(payload);
    if (success) {
      setAllPosts(getMergedBlogPosts());
      setSavedNotice(true);
      setTimeout(() => setSavedNotice(false), 3000);
    } else {
      alert('Failed to save to local storage.');
    }
  };

  const handleDeletePost = (slug) => {
    if (window.confirm(`Are you sure you want to delete post "${slug}"?`)) {
      deleteCustomBlogPost(slug);
      const merged = getMergedBlogPosts();
      setAllPosts(merged);
      if (postData.slug === slug) {
        setPostData(merged[0] || EMPTY_TEMPLATE);
      }
    }
  };

  // Copy Schema JSON
  const handleCopySchema = () => {
    const postRoute = `/blog/${postData.slug}`;
    const schema = {
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting",
          "@id": `https://waqasmehmood.com${postRoute}#article`,
          "headline": postData.title,
          "description": postData.seoDesc || postData.excerpt,
          "url": `https://waqasmehmood.com${postRoute}`,
          "image": postData.coverImage,
          "datePublished": `${postData.publishedAt || '2026-11-04'}T08:00:00+05:00`,
          "dateModified": `${postData.updatedAt || '2026-11-04'}T08:00:00+05:00`,
          "inLanguage": "en",
          "author": {
            "@type": "Person",
            "name": "Waqas Mehmood",
            "url": "https://waqasmehmood.com/about",
            "jobTitle": "Best SEO Expert & Engineer"
          },
          "publisher": {
            "@type": "Organization",
            "name": "Waqas Mehmood",
            "url": "https://waqasmehmood.com"
          }
        },
        {
          "@type": "BreadcrumbList",
          "@id": `https://waqasmehmood.com${postRoute}#breadcrumb`,
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waqasmehmood.com/" },
            { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://waqasmehmood.com/blog" },
            { "@type": "ListItem", "position": 3, "name": postData.title, "item": `https://waqasmehmood.com${postRoute}` }
          ]
        },
        ...(postData.faqs && postData.faqs.length > 0 ? [{
          "@type": "FAQPage",
          "@id": `https://waqasmehmood.com${postRoute}#faq`,
          "mainEntity": postData.faqs.map(f => ({
            "@type": "Question",
            "name": f.q,
            "acceptedAnswer": {
              "@type": "Answer",
              "text": f.a
            }
          }))
        }] : [])
      ]
    };

    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  // Copy Code for blogData.js
  const handleCopyCodeForJs = () => {
    const codeString = `  {\n` +
      `    slug: '${postData.slug}',\n` +
      `    title: '${postData.title.replace(/'/g, "\\'")}',\n` +
      `    seoTitle: '${(postData.seoTitle || postData.title).replace(/'/g, "\\'")}',\n` +
      `    seoDesc: '${(postData.seoDesc || postData.excerpt).replace(/'/g, "\\'")}',\n` +
      `    category: '${postData.category}',\n` +
      `    categoryLabel: '${BLOG_CATEGORIES.find(c => c.id === postData.category)?.label || 'SEO'}',\n` +
      `    readTime: '${postData.readTime || '7 min read'}',\n` +
      `    publishedAt: '${postData.publishedAt || new Date().toISOString().split('T')[0]}',\n` +
      `    updatedAt: '${new Date().toISOString().split('T')[0]}',\n` +
      `    coverImage: '${postData.coverImage}',\n` +
      `    excerpt: '${postData.excerpt.replace(/'/g, "\\'")}',\n` +
      `    featured: ${Boolean(postData.featured)},\n` +
      `    toolCta: ${JSON.stringify(postData.toolCta, null, 6)},\n` +
      `    serviceCta: ${JSON.stringify(postData.serviceCta, null, 6)},\n` +
      `    sections: ${JSON.stringify(postData.sections, null, 6)},\n` +
      `    faqs: ${JSON.stringify(postData.faqs, null, 6)}\n` +
      `  },`;

    navigator.clipboard.writeText(codeString);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  const scoreColor = seoAudit.score >= 80 
    ? 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10'
    : seoAudit.score >= 50
    ? 'text-amber-400 border-amber-500/40 bg-amber-500/10'
    : 'text-rose-400 border-rose-500/40 bg-rose-500/10';

  const scoreBadgeBg = seoAudit.score >= 80 
    ? 'from-emerald-500 to-teal-600'
    : seoAudit.score >= 50
    ? 'from-amber-500 to-orange-600'
    : 'from-rose-500 to-red-600';

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 space-y-6">
      
      {/* Top Studio Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-5 rounded-2xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl">
        <div className="flex items-center gap-3">
          <button
            onClick={onBackToBlog}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Return to Blog Hub"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-white text-base">WM Blog Admin Studio</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                PRO ON-PAGE ENGINE
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Rank Math-grade live scoring & formatting for high-intent Google rankings
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleStartNewPost}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
          >
            <Plus className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Post</span>
          </button>

          <button
            onClick={handleCopySchema}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
          >
            {copiedSchema ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Code className="w-3.5 h-3.5 text-purple-400" />}
            <span>{copiedSchema ? 'Schema Copied!' : 'Copy JSON-LD'}</span>
          </button>

          <button
            onClick={handleCopyCodeForJs}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            title="Export JavaScript object for frontend/src/data/blogData.js"
          >
            {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-amber-400" />}
            <span>{copiedCode ? 'Code Copied!' : 'Export blogData.js'}</span>
          </button>

          {onPreviewPost && (
            <button
              onClick={() => onPreviewPost(postData.slug)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs font-semibold cursor-pointer transition-all"
            >
              <Eye className="w-3.5 h-3.5 text-sky-400" />
              <span>Preview</span>
            </button>
          )}

          <button
            onClick={handleSavePost}
            className="flex items-center gap-1.5 px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 cursor-pointer transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Save & Publish</span>
          </button>
        </div>
      </div>

      {savedNotice && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Mubarak! Post saved successfully to local storage. It is now live in the Blog Hub!</span>
          </div>
          <span className="font-mono text-[11px] text-emerald-400/80">Saved at {new Date().toLocaleTimeString()}</span>
        </div>
      )}

      {/* Main 2-Column Grid: Editor Left (65%) vs Rank Math Scorer Right (35%) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ================================================================= */}
        {/* LEFT COLUMN: BLOG EDITOR & STRUCTURED FORMATTER (8 of 12 cols)     */}
        {/* ================================================================= */}
        <div className="lg:col-span-8 space-y-6">

          {/* Subtabs Navigation */}
          <div className="flex items-center gap-2 p-1.5 rounded-2xl bg-slate-900 border border-slate-800 text-xs font-semibold overflow-x-auto">
            <button
              onClick={() => setActiveTab('general')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'general' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              1. General & SEO Tags
            </button>
            <button
              onClick={() => setActiveTab('content')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'content' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              2. Content Sections ({postData.sections.length})
            </button>
            <button
              onClick={() => setActiveTab('faqs')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'faqs' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              3. PAA FAQs ({(postData.faqs || []).length})
            </button>
            <button
              onClick={() => setActiveTab('cta')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'cta' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              4. In-House CTAs
            </button>
            <button
              onClick={() => setActiveTab('manage')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                activeTab === 'manage' ? 'bg-cyan-500 text-slate-950 font-bold shadow-md' : 'text-slate-400 hover:text-white'
              }`}
            >
              5. Manage Posts ({allPosts.length})
            </button>
          </div>

          {/* TAB 1: GENERAL & SEO METADATA */}
          {activeTab === 'general' && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-400" />
                <span>Primary Keywords, Title & URL Architecture</span>
              </h3>

              {/* Focus Keyword & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>Focus Keyword <span className="text-cyan-400">*</span></span>
                    <span className="text-[11px] text-slate-500">Target search query</span>
                  </label>
                  <input
                    type="text"
                    value={postData.focusKeyword || ''}
                    onChange={(e) => setPostData({ ...postData, focusKeyword: e.target.value })}
                    placeholder="e.g. local seo hyderabad, google ads roas..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Category Pillar
                  </label>
                  <select
                    value={postData.category}
                    onChange={(e) => {
                      const cat = e.target.value;
                      const label = BLOG_CATEGORIES.find(c => c.id === cat)?.label || 'SEO';
                      setPostData({ ...postData, category: cat, categoryLabel: label });
                    }}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    {BLOG_CATEGORIES.filter(c => c.id !== 'all').map(c => (
                      <option key={c.id} value={c.id}>{c.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Title & Slug */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>H1 Article Title <span className="text-cyan-400">*</span></span>
                  <span className="text-[11px] text-slate-500">{postData.title.length} characters</span>
                </label>
                <input
                  type="text"
                  value={postData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Compelling, click-worthy article headline..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* SEO Title & URL Slug */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>SEO Title Tag (50-60 chars)</span>
                    <span className={`text-[11px] font-mono ${
                      (postData.seoTitle || '').length >= 48 && (postData.seoTitle || '').length <= 64 
                        ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {(postData.seoTitle || '').length} / 60
                    </span>
                  </label>
                  <input
                    type="text"
                    value={postData.seoTitle || ''}
                    onChange={(e) => setPostData({ ...postData, seoTitle: e.target.value })}
                    placeholder="Search snippet title | Waqas Mehmood"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>URL Slug</span>
                    <span className="text-[11px] font-mono text-slate-500">/blog/{postData.slug}</span>
                  </label>
                  <input
                    type="text"
                    value={postData.slug}
                    onChange={(e) => setPostData({ ...postData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    placeholder="clean-hyphenated-slug"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>

              {/* Meta Description */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5 flex items-center justify-between">
                  <span>Meta Description (Target: 140-160 characters)</span>
                  <span className={`text-[11px] font-mono ${
                    (postData.seoDesc || '').length >= 135 && (postData.seoDesc || '').length <= 165 
                      ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {(postData.seoDesc || '').length} / 160
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={postData.seoDesc || ''}
                  onChange={(e) => setPostData({ ...postData, seoDesc: e.target.value })}
                  placeholder="Summarize the core value, include your focus keyword naturally, and end with an action CTA..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 leading-relaxed"
                />
              </div>

              {/* Excerpt / Summary */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Hub Card Excerpt (Short preview text)
                </label>
                <input
                  type="text"
                  value={postData.excerpt || ''}
                  onChange={(e) => setPostData({ ...postData, excerpt: e.target.value })}
                  placeholder="2-sentence teaser displayed on /blog listing cards..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Media & Reading Time */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-slate-800">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Cover Image URL
                  </label>
                  <input
                    type="text"
                    value={postData.coverImage || ''}
                    onChange={(e) => setPostData({ ...postData, coverImage: e.target.value })}
                    placeholder="https://images.unsplash.com/... or /portfolio/..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1.5">
                    Image ALT Text
                  </label>
                  <input
                    type="text"
                    value={postData.imageAlt || ''}
                    onChange={(e) => setPostData({ ...postData, imageAlt: e.target.value })}
                    placeholder="Focus keyword descriptive ALT..."
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STRUCTURED CONTENT SECTIONS */}
          {activeTab === 'content' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Content Sections & Topical Hierarchy</h3>
                  <p className="text-xs text-slate-400">Structured into H2 subheadings with callouts and checklists for Google E-E-A-T.</p>
                </div>
                <button
                  onClick={handleAddSection}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add H2 Section</span>
                </button>
              </div>

              {postData.sections.map((section, idx) => {
                const isExpanded = expandedSectionIdx === idx;
                return (
                  <div key={section.id || idx} className="rounded-2xl bg-slate-900/80 border border-slate-800 overflow-hidden">
                    {/* Section Header Accordion */}
                    <div 
                      onClick={() => setExpandedSectionIdx(isExpanded ? -1 : idx)}
                      className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 text-xs font-mono font-bold flex items-center justify-center">
                          {idx + 1}
                        </span>
                        <div>
                          <div className="text-xs font-mono text-cyan-400 uppercase font-semibold">H2 Subheading</div>
                          <h4 className="text-sm font-bold text-white">{section.title || 'Untitled Section'}</h4>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); handleRemoveSection(idx); }}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                          title="Delete section"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    {/* Section Body */}
                    {isExpanded && (
                      <div className="p-5 border-t border-slate-800/80 space-y-4 bg-slate-950/40">
                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1">
                            Section Heading (H2)
                          </label>
                          <input
                            type="text"
                            value={section.title}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPostData(prev => {
                                const copy = [...prev.sections];
                                copy[idx].title = val;
                                return { ...prev, sections: copy };
                              });
                            }}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-slate-300 mb-1 flex items-center justify-between">
                            <span>Body Content</span>
                            <span className="text-[11px] text-slate-500">
                              {section.content.trim().split(/\s+/).filter(Boolean).length} words
                            </span>
                          </label>
                          <textarea
                            rows={4}
                            value={section.content}
                            onChange={(e) => {
                              const val = e.target.value;
                              setPostData(prev => {
                                const copy = [...prev.sections];
                                copy[idx].content = val;
                                return { ...prev, sections: copy };
                              });
                            }}
                            className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                          />
                        </div>

                        {/* Callout Box Config */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                              <span>Highlight Callout Box (Optional)</span>
                            </span>
                            {section.callout ? (
                              <button
                                type="button"
                                onClick={() => {
                                  setPostData(prev => {
                                    const copy = [...prev.sections];
                                    copy[idx].callout = null;
                                    return { ...prev, sections: copy };
                                  });
                                }}
                                className="text-[11px] text-rose-400 hover:underline cursor-pointer"
                              >
                                Remove Callout
                              </button>
                            ) : (
                              <button
                                type="button"
                                onClick={() => {
                                  setPostData(prev => {
                                    const copy = [...prev.sections];
                                    copy[idx].callout = { type: 'tip', title: 'Pro Tip', text: 'Add actionable advice here.' };
                                    return { ...prev, sections: copy };
                                  });
                                }}
                                className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                              >
                                + Add Callout
                              </button>
                            )}
                          </div>

                          {section.callout && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                              <div>
                                <label className="block text-[11px] text-slate-400 mb-1">Type</label>
                                <select
                                  value={section.callout.type}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPostData(prev => {
                                      const copy = [...prev.sections];
                                      copy[idx].callout.type = val;
                                      return { ...prev, sections: copy };
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                                >
                                  <option value="tip">Tip (Cyan)</option>
                                  <option value="important">Important (Indigo)</option>
                                  <option value="warning">Warning (Amber)</option>
                                </select>
                              </div>
                              <div className="sm:col-span-2">
                                <label className="block text-[11px] text-slate-400 mb-1">Callout Title</label>
                                <input
                                  type="text"
                                  value={section.callout.title}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPostData(prev => {
                                      const copy = [...prev.sections];
                                      copy[idx].callout.title = val;
                                      return { ...prev, sections: copy };
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                                />
                              </div>
                              <div className="sm:col-span-3">
                                <label className="block text-[11px] text-slate-400 mb-1">Callout Text</label>
                                <input
                                  type="text"
                                  value={section.callout.text}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setPostData(prev => {
                                      const copy = [...prev.sections];
                                      copy[idx].callout.text = val;
                                      return { ...prev, sections: copy };
                                    });
                                  }}
                                  className="w-full px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Bullet Checklist Items */}
                        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              <span>Actionable Checklists / Bullets</span>
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                setPostData(prev => {
                                  const copy = [...prev.sections];
                                  copy[idx].checklist = [...(copy[idx].checklist || []), 'New checklist actionable point.'];
                                  return { ...prev, sections: copy };
                                });
                              }}
                              className="text-[11px] text-cyan-400 hover:underline cursor-pointer"
                            >
                              + Add Bullet
                            </button>
                          </div>

                          {(section.checklist || []).map((item, itemIdx) => (
                            <div key={itemIdx} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setPostData(prev => {
                                    const copy = [...prev.sections];
                                    copy[idx].checklist[itemIdx] = val;
                                    return { ...prev, sections: copy };
                                  });
                                }}
                                className="flex-1 px-3 py-1.5 bg-slate-950 border border-slate-700 rounded-lg text-xs text-white"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setPostData(prev => {
                                    const copy = [...prev.sections];
                                    copy[idx].checklist = copy[idx].checklist.filter((_, i) => i !== itemIdx);
                                    return { ...prev, sections: copy };
                                  });
                                }}
                                className="text-slate-500 hover:text-rose-400 p-1"
                              >
                                &times;
                              </button>
                            </div>
                          ))}
                        </div>

                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 3: FAQ SCHEMA BUILDER */}
          {activeTab === 'faqs' && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Frequently Asked Questions (FAQPage Schema)</span>
                  </h3>
                  <p className="text-xs text-slate-400">Qualify for expandable accordion rich snippet results on Google SERP.</p>
                </div>
                <button
                  onClick={handleAddFaq}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold hover:bg-cyan-500/20 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-4">
                {(postData.faqs || []).map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-cyan-400 font-mono">Question #{idx + 1}</span>
                      <button
                        onClick={() => handleRemoveFaq(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 text-xs"
                      >
                        Remove
                      </button>
                    </div>

                    <div>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPostData(prev => {
                            const copy = [...(prev.faqs || [])];
                            copy[idx].q = val;
                            return { ...prev, faqs: copy };
                          });
                        }}
                        placeholder="e.g. How does local SEO work in Hyderabad?"
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>

                    <div>
                      <textarea
                        rows={2}
                        value={faq.a}
                        onChange={(e) => {
                          const val = e.target.value;
                          setPostData(prev => {
                            const copy = [...(prev.faqs || [])];
                            copy[idx].a = val;
                            return { ...prev, faqs: copy };
                          });
                        }}
                        placeholder="Direct factual answer (40 to 60 words for maximum answer snippet capture)..."
                        className="w-full px-3.5 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: CONVERSION CTAS */}
          {activeTab === 'cta' && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass className="w-4 h-4 text-cyan-400" />
                <span>In-House Tool Linking & Client Consultation CTAs</span>
              </h3>

              {/* In-House Tool Recommendation */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-cyan-400 uppercase font-mono">1. Recommended In-House Tool CTA</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Select Tool Slug</label>
                    <select
                      value={postData.toolCta?.toolSlug || 'website-seo-checker'}
                      onChange={(e) => {
                        const slug = e.target.value;
                        setPostData(prev => ({
                          ...prev,
                          toolCta: {
                            ...prev.toolCta,
                            toolSlug: slug,
                            toolTitle: slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    >
                      <option value="ai-aeo-geo-analyzer">AI, AEO & GEO Search Engine Analyzer</option>
                      <option value="website-seo-checker">Website SEO Checker</option>
                      <option value="local-seo-audit-tool">Local SEO Audit Tool</option>
                      <option value="schema-generator">1-Click Schema JSON-LD Generator</option>
                      <option value="roas-calculator">Google Ads ROAS Calculator</option>
                      <option value="seo-roi-calculator">SEO ROI Revenue Calculator</option>
                      <option value="website-crawler">Free AI Website Crawler</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Button Call to Action</label>
                    <input
                      type="text"
                      value={postData.toolCta?.buttonText || 'Run Free Audit Now'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPostData(prev => ({
                          ...prev,
                          toolCta: { ...prev.toolCta, buttonText: val }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Service Consultation CTA */}
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
                <h4 className="text-xs font-bold text-indigo-400 uppercase font-mono">2. Strategic Consultation Retainer CTA</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Service Heading</label>
                    <input
                      type="text"
                      value={postData.serviceCta?.serviceName || 'Custom SEO Retainer Management'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPostData(prev => ({
                          ...prev,
                          serviceCta: { ...prev.serviceCta, serviceName: val }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">Button Text</label>
                    <input
                      type="text"
                      value={postData.serviceCta?.buttonText || 'Hire Waqas for SEO Retainer'}
                      onChange={(e) => {
                        const val = e.target.value;
                        setPostData(prev => ({
                          ...prev,
                          serviceCta: { ...prev.serviceCta, buttonText: val }
                        }));
                      }}
                      className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white"
                    />
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* TAB 5: MANAGE POSTS */}
          {activeTab === 'manage' && (
            <div className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center justify-between">
                <span>All Published & Custom Blog Posts ({allPosts.length})</span>
                <span className="text-xs text-slate-400 font-normal">Click to edit in Studio</span>
              </h3>

              <div className="space-y-3">
                {allPosts.map((post) => (
                  <div
                    key={post.slug}
                    className={`p-4 rounded-xl border flex flex-wrap items-center justify-between gap-4 transition-all ${
                      postData.slug === post.slug 
                        ? 'bg-cyan-950/30 border-cyan-500/50' 
                        : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-800 text-slate-300">
                          {post.categoryLabel || post.category}
                        </span>
                        <span className="text-xs font-mono text-slate-500">/blog/{post.slug}</span>
                      </div>
                      <h4 className="text-sm font-bold text-white">{post.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-1">{post.excerpt}</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSelectExistingPost(post.slug)}
                        className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 text-xs font-semibold cursor-pointer"
                      >
                        Edit in Studio
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.slug)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        title="Delete post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ================================================================= */}
        {/* RIGHT COLUMN: RANK MATH LIVE ON-PAGE SEO SCOREBOARD (4 of 12 cols)  */}
        {/* ================================================================= */}
        <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-24">

          {/* Master Rank Math Score Meter Card */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider block">
                  Rank Math Score
                </span>
                <span className="text-xs text-slate-500">Live On-Page SEO Engine</span>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${scoreColor}`}>
                {seoAudit.passedCount} / {seoAudit.totalChecks} Passed
              </span>
            </div>

            {/* Circular / Large Score Display */}
            <div className="flex items-center gap-5">
              <div className={`w-20 h-20 rounded-2xl bg-gradient-to-tr ${scoreBadgeBg} flex flex-col items-center justify-center text-slate-950 font-black shadow-lg shadow-cyan-500/10`}>
                <span className="text-3xl leading-none">{seoAudit.score}</span>
                <span className="text-[10px] uppercase font-mono tracking-wider">/ 100</span>
              </div>
              <div>
                <div className="font-extrabold text-white text-base">
                  {seoAudit.score >= 80 ? '100% SEO Ready!' : seoAudit.score >= 50 ? 'Good Progress' : 'Optimization Needed'}
                </div>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  {seoAudit.score >= 80 
                    ? 'All critical on-page guidelines from your checklist are fully satisfied!' 
                    : 'Address failing checks below to maximize Google Page 1 ranking potential.'}
                </p>
              </div>
            </div>

            {/* Quick Metrics Pills */}
            <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-800 text-[11px] font-mono">
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Total Words</span>
                <span className="text-white font-bold">{seoAudit.wordCount} words</span>
              </div>
              <div className="p-2 rounded-xl bg-slate-950 border border-slate-800">
                <span className="text-slate-500 block">Keyword Density</span>
                <span className={`font-bold ${parseFloat(seoAudit.kwDensity) > 2.5 ? 'text-rose-400' : 'text-emerald-400'}`}>
                  {seoAudit.kwDensity}% ({seoAudit.kwCount}x)
                </span>
              </div>
            </div>
          </div>

          {/* Interactive Live SERP Preview */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google SERP Preview</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-lg border border-slate-800">
                <button
                  onClick={() => setSerpDevice('desktop')}
                  className={`p-1 rounded cursor-pointer ${serpDevice === 'desktop' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                  title="Desktop Preview"
                >
                  <Monitor className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setSerpDevice('mobile')}
                  className={`p-1 rounded cursor-pointer ${serpDevice === 'mobile' ? 'bg-slate-800 text-cyan-400' : 'text-slate-500'}`}
                  title="Mobile Preview"
                >
                  <Smartphone className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* SERP Card */}
            <div className={`p-4 rounded-xl bg-slate-950 border border-slate-800 text-left space-y-1.5 ${
              serpDevice === 'mobile' ? 'max-w-[320px] mx-auto text-xs' : 'text-xs'
            }`}>
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-4 h-4 rounded-full bg-cyan-500 text-slate-950 font-black text-[9px] flex items-center justify-center">WM</span>
                <span className="text-slate-300">waqasmehmood.com &rsaquo; blog &rsaquo; {postData.slug || 'slug'}</span>
              </div>
              <h4 className="text-sm font-semibold text-sky-400 hover:underline line-clamp-1 cursor-pointer">
                {postData.seoTitle || postData.title || 'Post Title | Waqas Mehmood'}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed line-clamp-2">
                {postData.seoDesc || postData.excerpt || 'Meta description preview...'}
              </p>
            </div>
          </div>

          {/* Checklist Categories (From Attached PDF) */}
          <div className="space-y-3">
            
            {/* 1. Basic SEO (40 Points) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">1. Basic SEO</span>
                <span className="text-[11px] text-slate-400">
                  {seoAudit.basicChecks.filter(c => c.passed).length} / {seoAudit.basicChecks.length}
                </span>
              </div>
              <div className="space-y-2">
                {seoAudit.basicChecks.map(check => (
                  <div key={check.id} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className={check.passed ? 'text-slate-200' : 'text-slate-400'}>{check.label}</span>
                    </div>
                    {!check.passed && (
                      <p className="text-[11px] text-amber-400/90 pl-5 leading-tight">{check.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Additional SEO (25 Points) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">2. Additional SEO</span>
                <span className="text-[11px] text-slate-400">
                  {seoAudit.additionalChecks.filter(c => c.passed).length} / {seoAudit.additionalChecks.length}
                </span>
              </div>
              <div className="space-y-2">
                {seoAudit.additionalChecks.map(check => (
                  <div key={check.id} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className={check.passed ? 'text-slate-200' : 'text-slate-400'}>{check.label}</span>
                    </div>
                    {!check.passed && (
                      <p className="text-[11px] text-amber-400/90 pl-5 leading-tight">{check.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 3. Title & Snippet Readability (15 Points) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">3. Title & Snippet</span>
                <span className="text-[11px] text-slate-400">
                  {seoAudit.titleSnippetChecks.filter(c => c.passed).length} / {seoAudit.titleSnippetChecks.length}
                </span>
              </div>
              <div className="space-y-2">
                {seoAudit.titleSnippetChecks.map(check => (
                  <div key={check.id} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className={check.passed ? 'text-slate-200' : 'text-slate-400'}>{check.label}</span>
                    </div>
                    {!check.passed && (
                      <p className="text-[11px] text-amber-400/90 pl-5 leading-tight">{check.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Content Readability & E-E-A-T (20 Points) */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-white font-mono uppercase tracking-wider">4. Readability & E-E-A-T</span>
                <span className="text-[11px] text-slate-400">
                  {seoAudit.readabilityChecks.filter(c => c.passed).length} / {seoAudit.readabilityChecks.length}
                </span>
              </div>
              <div className="space-y-2">
                {seoAudit.readabilityChecks.map(check => (
                  <div key={check.id} className="text-xs space-y-0.5">
                    <div className="flex items-center gap-2">
                      {check.passed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      ) : (
                        <XCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      )}
                      <span className={check.passed ? 'text-slate-200' : 'text-slate-400'}>{check.label}</span>
                    </div>
                    {!check.passed && (
                      <p className="text-[11px] text-amber-400/90 pl-5 leading-tight">{check.tip}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
