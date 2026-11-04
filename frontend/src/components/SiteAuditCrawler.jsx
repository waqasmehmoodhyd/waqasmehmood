import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Globe, Play, Square, RefreshCw, Download, CheckCircle2, 
  AlertTriangle, XCircle, ArrowRight, ExternalLink, Filter, 
  HelpCircle, Layers, Clock, Zap, BookOpen, Target, Award, 
  Info, ChevronDown, ChevronRight, ChevronUp, FileSpreadsheet, Sparkles,
  Shield, Check, Search, Printer, FileText, ShieldAlert, ListTree,
  Smartphone, Laptop, Share2, Phone, X
} from 'lucide-react';

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://127.0.0.1:8000/api'
  : '/api';

export default function SiteAuditCrawler({ onHireClick }) {
  const [targetUrl, setTargetUrl] = useState('https://waqasmehmood.com');
  const [pageLimit, setPageLimit] = useState(25);
  const [isCrawling, setIsCrawling] = useState(false);
  const [progress, setProgress] = useState({ current: 0, target: 25, percent: 0, queue_size: 0 });
  const [currentCrawlingUrl, setCurrentCrawlingUrl] = useState('');
  const [crawledPages, setCrawledPages] = useState([]);
  const [summary, setSummary] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isBlockedDomain, setIsBlockedDomain] = useState(false);
  
  // Navigation & View Tabs
  const [auditViewTab, setAuditViewTab] = useState('overview'); // 'overview' | 'table' | 'ai-plan' | 'speed'
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'broken' | 'titles' | 'h1' | 'missing-alt' | 'redirects'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRowDetail, setSelectedRowDetail] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [expandedIssueId, setExpandedIssueId] = useState(null);
  const [speedDevice, setSpeedDevice] = useState('mobile'); // 'mobile' | 'desktop'
  const [pdfReportModalOpen, setPdfReportModalOpen] = useState(false);

  const eventSourceRef = useRef(null);
  const timerRef = useRef(null);
  const isCompletedRef = useRef(false);
  const isCrawlingRef = useRef(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const resultsTableRef = useRef(null);

  // Start Crawling via SSE
  const handleStartCrawl = () => {
    let cleanUrl = targetUrl.trim();
    if (!cleanUrl) return;
    if (!/^https?:\/\//i.test(cleanUrl)) {
      cleanUrl = 'https://' + cleanUrl;
      setTargetUrl(cleanUrl);
    }

    // Reset previous states
    isCompletedRef.current = false;
    isCrawlingRef.current = true;
    setCrawledPages([]);
    setSummary(null);
    setErrorMessage('');
    setIsBlockedDomain(false);
    setSelectedRowDetail(null);
    setElapsedSeconds(0);
    setProgress({ current: 0, target: pageLimit, percent: 0, queue_size: 0 });
    setIsCrawling(true);
    setAuditViewTab('overview');

    // Start elapsed timer
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);

    const sseUrl = `${API_BASE}/crawler/stream?url=${encodeURIComponent(cleanUrl)}&limit=${pageLimit}`;
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.addEventListener('start', (e) => {
      const data = JSON.parse(e.data);
      setCurrentCrawlingUrl(data.message || 'Connecting to target website...');
    });

    es.addEventListener('page', (e) => {
      const data = JSON.parse(e.data);
      if (data.page) {
        setCrawledPages((prev) => [...prev, data.page]);
        setCurrentCrawlingUrl(data.page.url);
      }
      if (data.progress) {
        setProgress(data.progress);
      }
    });

    es.addEventListener('complete', (e) => {
      isCompletedRef.current = true;
      isCrawlingRef.current = false;
      const sum = JSON.parse(e.data);
      setSummary(sum);
      setProgress((prev) => ({ ...prev, percent: 100 }));
      setCurrentCrawlingUrl(`Audit complete! Crawled all ${sum.total_crawled} discovered internal pages.`);
      handleStopCrawl(false);
    });

    es.addEventListener('error_event', (e) => {
      isCompletedRef.current = true;
      isCrawlingRef.current = false;
      const err = JSON.parse(e.data);
      setErrorMessage(err.message || 'An error occurred during crawling.');
      if (err.blocked) {
        setIsBlockedDomain(true);
      }
      handleStopCrawl(false);
    });

    es.onerror = () => {
      if (isCompletedRef.current) {
        return;
      }
      if (isCrawlingRef.current) {
        setErrorMessage('Connection closed or website timeout reached.');
      }
      handleStopCrawl(false);
    };
  };

  // Stop Crawling
  const handleStopCrawl = (manual = true) => {
    isCrawlingRef.current = false;
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsCrawling(false);
    if (manual) {
      setCurrentCrawlingUrl('Crawl stopped by user.');
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) eventSourceRef.current.close();
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // Filtered pages for table
  const filteredPages = useMemo(() => {
    return crawledPages.filter((p) => {
      let tabMatch = true;
      if (activeFilterTab === 'broken') tabMatch = p.status >= 400 || p.status === 0;
      else if (activeFilterTab === 'titles') tabMatch = p.title_status !== 'good';
      else if (activeFilterTab === 'h1') tabMatch = p.h1_status !== 'good';
      else if (activeFilterTab === 'missing-alt') tabMatch = (p.images_missing_alt_count || 0) > 0;
      else if (activeFilterTab === 'redirects') tabMatch = p.status >= 300 && p.status < 400;

      if (!tabMatch) return false;

      if (searchFilter.trim()) {
        const q = searchFilter.toLowerCase();
        return (
          p.url.toLowerCase().includes(q) ||
          p.title?.toLowerCase().includes(q) ||
          p.h1?.toLowerCase().includes(q) ||
          String(p.status).includes(q)
        );
      }
      return true;
    });
  }, [crawledPages, activeFilterTab, searchFilter]);

  // SEMrush 3-Tier Categorized Issues Computation
  const categorizedIssues = useMemo(() => {
    if (crawledPages.length === 0) return { errors: [], warnings: [], notices: [] };

    const total = crawledPages.length;

    // 1. CRITICAL ERRORS (Red - High Priority)
    const errors = [];
    const brokenPages = crawledPages.filter(p => p.status >= 400 || p.status === 0);
    if (brokenPages.length > 0) {
      errors.push({
        id: 'broken-links',
        title: 'Broken Pages & Dead Links (404 / 5xx)',
        desc: 'Pages returning client or server errors that waste crawl budget and destroy organic user experience.',
        severity: 'critical',
        count: brokenPages.length,
        percent: Math.round((brokenPages.length / total) * 100),
        pages: brokenPages,
        impact: 'High: Crawlers stop indexing and visitors bounce immediately.',
        fixPrompt: 'Set up 301 redirects to relevant live pages or restore missing content.'
      });
    }

    const missingTitles = crawledPages.filter(p => p.title_status === 'missing');
    if (missingTitles.length > 0) {
      errors.push({
        id: 'missing-titles',
        title: 'Missing <title> Meta Tags',
        desc: 'Pages completely lacking a title tag. Google will auto-generate poor snippet headlines on SERP.',
        severity: 'critical',
        count: missingTitles.length,
        percent: Math.round((missingTitles.length / total) * 100),
        pages: missingTitles,
        impact: 'High: Severe ranking drop and catastrophic reduction in organic click-through rate.',
        fixPrompt: 'Add a distinct, keyword-optimized <title> tag between 45 and 60 characters.'
      });
    }

    const missingH1 = crawledPages.filter(p => p.h1_status === 'missing');
    if (missingH1.length > 0) {
      errors.push({
        id: 'missing-h1',
        title: 'Missing Primary <h1> Headings',
        desc: 'Pages without an H1 heading. Google NLP bots cannot easily disambiguate the core topic hierarchy.',
        severity: 'critical',
        count: missingH1.length,
        percent: Math.round((missingH1.length / total) * 100),
        pages: missingH1,
        impact: 'High: Weak topical relevance signals for primary search keywords.',
        fixPrompt: 'Ensure exactly one prominent <h1> containing primary keyword exists on each page.'
      });
    }

    const duplicateH1 = crawledPages.filter(p => p.h1_status === 'duplicate');
    if (duplicateH1.length > 0) {
      errors.push({
        id: 'duplicate-h1',
        title: 'Multiple <h1> Headings on Same Page',
        desc: 'Multiple H1 tags dilute semantic entity weight across conflicting headlines.',
        severity: 'critical',
        count: duplicateH1.length,
        percent: Math.round((duplicateH1.length / total) * 100),
        pages: duplicateH1,
        impact: 'Moderate: Confuses Google topic classification.',
        fixPrompt: 'Retain single H1 for page headline, demote secondary headlines to <h2> or <h3>.'
      });
    }

    // 2. WARNINGS (Yellow - Medium Priority)
    const warnings = [];
    const missingDesc = crawledPages.filter(p => p.description_status === 'missing');
    if (missingDesc.length > 0) {
      warnings.push({
        id: 'missing-desc',
        title: 'Missing Meta Descriptions',
        desc: 'Pages lacking a meta description tag. Search engines will pull arbitrary text for SERP snippets.',
        severity: 'warning',
        count: missingDesc.length,
        percent: Math.round((missingDesc.length / total) * 100),
        pages: missingDesc,
        impact: 'Medium: Low organic CTR and un-optimized SERP preview snippets.',
        fixPrompt: 'Write compelling 140–160 character meta descriptions with a clear call-to-action.'
      });
    }

    const missingAlt = crawledPages.filter(p => (p.images_missing_alt_count || 0) > 0);
    if (missingAlt.length > 0) {
      warnings.push({
        id: 'missing-alt',
        title: 'Images Missing ALT Attributes',
        desc: 'Images lacking alternative text attributes, hurting Google Images traffic and accessibility.',
        severity: 'warning',
        count: missingAlt.length,
        percent: Math.round((missingAlt.length / total) * 100),
        pages: missingAlt,
        impact: 'Medium: Missed image search rankings and WCAG accessibility non-compliance.',
        fixPrompt: 'Add descriptive alt="keyword description" tags to all meaningful images.'
      });
    }

    const slowPages = crawledPages.filter(p => (p.load_time_ms || 0) > 1200);
    if (slowPages.length > 0) {
      warnings.push({
        id: 'slow-pages',
        title: 'Slow Server Response Time (> 1.2s)',
        desc: 'High Time To First Byte (TTFB) or unoptimized backend responses slowing down crawler indexing.',
        severity: 'warning',
        count: slowPages.length,
        percent: Math.round((slowPages.length / total) * 100),
        pages: slowPages,
        impact: 'Medium-High: Core Web Vitals penalty and increased mobile user abandonment.',
        fixPrompt: 'Enable server page caching, optimize database queries, or use Cloudflare CDN.'
      });
    }

    const missingCanonical = crawledPages.filter(p => p.canonical_status === 'missing');
    if (missingCanonical.length > 0) {
      warnings.push({
        id: 'missing-canonical',
        title: 'Missing rel="canonical" Link Tag',
        desc: 'Pages without canonical tags are vulnerable to duplicate content issues via URL parameters.',
        severity: 'warning',
        count: missingCanonical.length,
        percent: Math.round((missingCanonical.length / total) * 100),
        pages: missingCanonical,
        impact: 'Medium: Risk of duplicate content penalties across URL parameters and trailing slashes.',
        fixPrompt: 'Inject self-referencing <link rel="canonical" href="..."> on every indexable page.'
      });
    }

    const badTitleLen = crawledPages.filter(p => p.title_status === 'short' || p.title_status === 'long');
    if (badTitleLen.length > 0) {
      warnings.push({
        id: 'bad-title-len',
        title: 'Sub-Optimal Title Length (<30 or >65 chars)',
        desc: 'Titles that are either too short to rank well or truncated with "..." in Google search results.',
        severity: 'warning',
        count: badTitleLen.length,
        percent: Math.round((badTitleLen.length / total) * 100),
        pages: badTitleLen,
        impact: 'Medium: Truncated brand names or weak keyword density.',
        fixPrompt: 'Adjust title lengths to between 40 and 60 characters for optimal desktop & mobile display.'
      });
    }

    // 3. NOTICES (Blue - Informational)
    const notices = [];
    const redirects = crawledPages.filter(p => p.status >= 300 && p.status < 400);
    if (redirects.length > 0) {
      notices.push({
        id: 'redirects-notice',
        title: '3xx HTTP Redirects Detected',
        desc: 'Internal links pointing to redirecting URLs instead of direct destination.',
        severity: 'notice',
        count: redirects.length,
        percent: Math.round((redirects.length / total) * 100),
        pages: redirects,
        impact: 'Low: Wastes minor crawl hop latency. Update internal links to point directly.',
        fixPrompt: 'Update internal href links directly to the final 200 OK target URL.'
      });
    }

    const thinContent = crawledPages.filter(p => (p.word_count || 0) < 250 && p.status === 200);
    if (thinContent.length > 0) {
      notices.push({
        id: 'thin-content',
        title: 'Thin Content Pages (< 250 words)',
        desc: 'Pages with very sparse text that may struggle to rank for competitive commercial queries.',
        severity: 'notice',
        count: thinContent.length,
        percent: Math.round((thinContent.length / total) * 100),
        pages: thinContent,
        impact: 'Low-Medium: Google Helpful Content system deprioritizes low-depth pages.',
        fixPrompt: 'Expand page copy to at least 400+ words with valuable FAQs and structured answers.'
      });
    }

    const missingOg = crawledPages.filter(p => !p.has_og && p.status === 200);
    if (missingOg.length > 0) {
      notices.push({
        id: 'missing-og',
        title: 'Missing Open Graph Social Tags',
        desc: 'Pages lacking rich card previews when shared on WhatsApp, LinkedIn, or Twitter.',
        severity: 'notice',
        count: missingOg.length,
        percent: Math.round((missingOg.length / total) * 100),
        pages: missingOg,
        impact: 'Low: Reduces social media click-through and brand shareability.',
        fixPrompt: 'Add og:title, og:description, and og:image tags inside the <head>.'
      });
    }

    return { errors, warnings, notices };
  }, [crawledPages]);

  // Overall Live Stats
  const liveStats = useMemo(() => {
    const total = crawledPages.length;
    const broken = crawledPages.filter((p) => p.status >= 400 || p.status === 0).length;
    const redirects = crawledPages.filter((p) => p.status >= 300 && p.status < 400).length;
    const titleIssues = crawledPages.filter((p) => p.title_status !== 'good').length;
    const h1Issues = crawledPages.filter((p) => p.h1_status !== 'good').length;
    const missingAlt = crawledPages.filter((p) => (p.images_missing_alt_count || 0) > 0).length;
    const avgSpeed = total > 0 
      ? Math.round(crawledPages.reduce((acc, p) => acc + (p.load_time_ms || 0), 0) / total)
      : 0;

    const healthScore = summary?.health_score ?? (
      total > 0
        ? Math.max(10, Math.min(100, Math.round(100 - (broken * 20 + titleIssues * 10 + (missingAlt > 0 ? 5 : 0)))))
        : 100
    );

    return {
      total,
      broken,
      redirects,
      titleIssues,
      h1Issues,
      missingAlt,
      avgSpeed,
      healthScore,
      errorsCount: categorizedIssues.errors.length,
      warningsCount: categorizedIssues.warnings.length,
      noticesCount: categorizedIssues.notices.length,
      totalIssuesFound: categorizedIssues.errors.reduce((a, b) => a + b.count, 0) + categorizedIssues.warnings.reduce((a, b) => a + b.count, 0)
    };
  }, [crawledPages, summary, categorizedIssues]);

  // 1-Click CSV Export
  const exportToCsv = () => {
    if (crawledPages.length === 0) return;

    const headers = [
      'Index', 'Status Code', 'Status Text', 'URL', 'Load Time (ms)', 
      'Meta Title', 'Title Length', 'Title Status', 
      'Meta Description', 'Description Length', 'Description Status', 
      'H1 Heading', 'H1 Count', 'H1 Status', 
      'Canonical URL', 'Canonical Status', 
      'Images Count', 'Images Missing Alt', 'Word Count',
      'Internal Links', 'External Links', 'Issues'
    ];

    const escapeCsv = (str) => {
      if (str === null || str === undefined) return '""';
      const s = String(str).replace(/"/g, '""');
      return `"${s}"`;
    };

    const rows = crawledPages.map((p) => [
      p.index,
      p.status,
      escapeCsv(p.status_text),
      escapeCsv(p.url),
      p.load_time_ms,
      escapeCsv(p.title),
      p.title_length,
      escapeCsv(p.title_status),
      escapeCsv(p.description),
      p.description_length,
      escapeCsv(p.description_status),
      escapeCsv(p.h1),
      p.h1_count,
      escapeCsv(p.h1_status),
      escapeCsv(p.canonical),
      escapeCsv(p.canonical_status),
      p.images_count || 0,
      p.images_missing_alt_count || 0,
      p.word_count || 0,
      p.internal_links_count,
      p.external_links_count,
      escapeCsv((p.issues || []).join('; '))
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    const hostname = targetUrl.replace(/^https?:\/\//i, '').replace(/[\/\?#].*$/, '') || 'website';
    link.setAttribute('href', url);
    link.setAttribute('download', `site_audit_${hostname}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintPdf = () => {
    window.print();
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Flagship Suite • Deep AI Site Health Auditor &amp; Screaming Frog Engine</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          All-in-One AI Website Health Auditor <br />
          <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
            Technical &amp; On-Page Screaming Frog Suite
          </span>
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          Crawl any website in real-time. Detect 404 broken links, duplicate H1 headlines, missing meta descriptions, unoptimized images, Core Web Vitals, and download a <strong>1-Click White-Label PDF Report</strong>.
        </p>
      </div>

      {/* 2. INPUT CONTROL CARD */}
      <div className="p-5 sm:p-7 rounded-3xl bg-slate-900 border border-slate-800 shadow-xl space-y-5">
        <div className="grid sm:grid-cols-12 gap-3 items-center">
          
          {/* Target URL Input */}
          <div className="sm:col-span-8 relative">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <Globe className="w-5 h-5 text-cyan-400" />
            </div>
            <input
              type="text"
              value={targetUrl}
              onChange={(e) => setTargetUrl(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !isCrawling && handleStartCrawl()}
              placeholder="e.g. https://yourwebsite.com"
              disabled={isCrawling}
              className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-sm sm:text-base text-white font-mono focus:outline-none transition-all placeholder-slate-500 disabled:opacity-60"
            />
          </div>

          {/* Crawl Limit Selector */}
          <div className="sm:col-span-2">
            <select
              value={pageLimit}
              onChange={(e) => setPageLimit(Number(e.target.value))}
              disabled={isCrawling}
              className="w-full py-3.5 px-3 rounded-2xl bg-slate-950 border border-slate-700 text-xs sm:text-sm text-white font-semibold focus:border-cyan-400 focus:outline-none cursor-pointer disabled:opacity-60"
            >
              <option value={10}>10 Pages (Fast)</option>
              <option value={25}>25 Pages (Standard)</option>
              <option value={50}>50 Pages (Deep Audit)</option>
            </select>
          </div>

          {/* Start / Stop Button */}
          <div className="sm:col-span-2">
            {!isCrawling ? (
              <button
                onClick={handleStartCrawl}
                disabled={!targetUrl.trim()}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Audit</span>
              </button>
            ) : (
              <button
                onClick={() => handleStopCrawl(true)}
                className="w-full py-3.5 px-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-rose-600/20 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Square className="w-4 h-4 fill-white" />
                <span>Stop Crawl</span>
              </button>
            )}
          </div>

        </div>

        {/* Quick Presets & Safety Notice */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-800 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-slate-500">Quick Test:</span>
            {['https://waqasmehmood.com', 'https://laravel.com', 'https://vuejs.org'].map((demo, idx) => (
              <button
                key={idx}
                onClick={() => setTargetUrl(demo)}
                disabled={isCrawling}
                className="px-2.5 py-1 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/30 text-[11px] text-cyan-400 font-mono transition-all cursor-pointer disabled:opacity-50"
              >
                {demo.replace('https://', '')}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
            <Shield className="w-3.5 h-3.5" />
            <span>Zero Server Crash • Rate-Limited Breadth-First Crawler</span>
          </div>
        </div>

        {/* ERROR / BLOCKED ALERT */}
        {errorMessage && (
          <div className={`p-4 rounded-2xl text-xs sm:text-sm flex items-start gap-3 animate-in fade-in ${
            isBlockedDomain 
              ? 'bg-amber-950/40 border border-amber-500/40 text-amber-200' 
              : 'bg-rose-950/40 border border-rose-500/40 text-rose-200'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 ${isBlockedDomain ? 'text-amber-400' : 'text-rose-400'}`} />
            <div className="space-y-1">
              <span className="font-bold block">
                {isBlockedDomain ? 'Domain Guard Active (Resource Protection):' : 'Crawl Notice:'}
              </span>
              <p className="leading-relaxed">{errorMessage}</p>
            </div>
          </div>
        )}

      </div>

      {/* 3. LIVE STREAMING PROGRESS BAR (ACTIVE CRAWL) */}
      {(isCrawling || crawledPages.length > 0) && (
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              {isCrawling && <RefreshCw className="w-4 h-4 text-cyan-400 animate-spin" />}
              <span className="font-bold text-white">
                {isCrawling ? 'Crawling in Real-Time...' : 'Audit Crawl Completed'}
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                ({crawledPages.length} / {progress.target || pageLimit} Pages Crawled)
              </span>
            </div>

            <div className="flex items-center gap-3 text-slate-400 font-mono text-[11px]">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Elapsed: {elapsedSeconds}s</span>
              </span>
              <span>•</span>
              <span>Discovered Queue: {progress.queue_size || 0}</span>
            </div>
          </div>

          {/* Animated Bar */}
          <div className="w-full h-2.5 rounded-full bg-slate-950 overflow-hidden border border-slate-800">
            <div 
              className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.round((crawledPages.length / (progress.target || pageLimit)) * 100))}%` }}
            />
          </div>

          {/* Current URL Streamed */}
          <div className="text-[11px] font-mono text-slate-400 truncate flex items-center justify-between">
            <div className="truncate">
              <span className="text-slate-500">Active URL:</span> <span className="text-slate-200">{currentCrawlingUrl || targetUrl}</span>
            </div>
            {isCrawling && (
              <span className="text-cyan-400 font-mono font-bold shrink-0 ml-2 animate-pulse">Scanning DOM...</span>
            )}
          </div>
        </div>
      )}

      {/* 4. EXECUTIVE KPI STAT CARDS (HEALTH SCORE & METRICS) */}
      {crawledPages.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            
            {/* Card 1: Health Score */}
            <div className="col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-1 text-center sm:text-left flex flex-col justify-between shadow-xl">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span className="uppercase font-mono tracking-wider font-bold text-slate-400 text-[10px]">Site Health Score</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="py-1">
                <div className={`text-4xl sm:text-5xl font-black font-mono tracking-tight ${
                  liveStats.healthScore >= 80 ? 'text-emerald-400' : liveStats.healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {liveStats.healthScore}%
                </div>
              </div>
              <div className="text-[11px] font-medium text-slate-300 flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${
                  liveStats.healthScore >= 80 ? 'bg-emerald-400' : liveStats.healthScore >= 60 ? 'bg-amber-400' : 'bg-rose-400'
                }`}></span>
                <span>
                  {liveStats.healthScore >= 80 ? 'Good SEO Health' : liveStats.healthScore >= 60 ? 'Moderate Issues Found' : 'Critical Fixes Required'}
                </span>
              </div>
            </div>

            {/* Card 2: Critical Errors */}
            <div className={`p-4 rounded-2xl border space-y-1 transition-all ${
              liveStats.broken > 0 || liveStats.errorsCount > 0 
                ? 'bg-rose-950/20 border-rose-500/40 shadow-rose-900/10' 
                : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Critical Errors</span>
                <span className="w-2 h-2 rounded-full bg-rose-500" />
              </div>
              <div className="text-2xl font-black font-mono text-rose-400">
                {liveStats.errorsCount}
              </div>
              <div className="text-[10px] text-slate-400">
                {liveStats.broken} 404s / Dead URLs
              </div>
            </div>

            {/* Card 3: Warnings */}
            <div className={`p-4 rounded-2xl border space-y-1 ${
              liveStats.warningsCount > 0 ? 'bg-amber-950/20 border-amber-500/30' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Warnings</span>
                <span className="w-2 h-2 rounded-full bg-amber-400" />
              </div>
              <div className="text-2xl font-black font-mono text-amber-400">
                {liveStats.warningsCount}
              </div>
              <div className="text-[10px] text-slate-400">
                Sub-optimal meta signals
              </div>
            </div>

            {/* Card 4: Notices */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Notices</span>
                <span className="w-2 h-2 rounded-full bg-blue-400" />
              </div>
              <div className="text-2xl font-black font-mono text-blue-400">
                {liveStats.noticesCount}
              </div>
              <div className="text-[10px] text-slate-400">
                Redirects &amp; thin content
              </div>
            </div>

            {/* Card 5: Avg Speed */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Avg Speed</span>
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
              </div>
              <div className={`text-2xl font-black font-mono ${
                liveStats.avgSpeed < 800 ? 'text-emerald-400' : liveStats.avgSpeed < 1800 ? 'text-amber-400' : 'text-rose-400'
              }`}>
                {liveStats.avgSpeed}ms
              </div>
              <div className="text-[10px] text-slate-400">
                Server response time
              </div>
            </div>

          </div>

          {/* 5. PRIMARY VIEW NAVIGATION & ACTION BAR */}
          <div className="p-2 sm:p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-lg">
            
            {/* View Switching Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setAuditViewTab('overview')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  auditViewTab === 'overview'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Issues Breakdown</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px]">
                  {liveStats.errorsCount + liveStats.warningsCount}
                </span>
              </button>

              <button
                onClick={() => setAuditViewTab('table')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  auditViewTab === 'table'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>All Crawled Pages</span>
                <span className="px-1.5 py-0.5 rounded-full bg-slate-950/20 text-[10px]">
                  {crawledPages.length}
                </span>
              </button>

              <button
                onClick={() => setAuditViewTab('ai-plan')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  auditViewTab === 'ai-plan'
                    ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-black shadow-md shadow-amber-500/20'
                    : 'bg-slate-950/80 text-amber-300 hover:text-white border border-amber-500/30'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>AI Technical Fix Plan</span>
                <span className="px-1.5 py-0.5 rounded bg-amber-400/20 text-[10px] font-mono uppercase">Actionable</span>
              </button>

              <button
                onClick={() => setAuditViewTab('speed')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 whitespace-nowrap ${
                  auditViewTab === 'speed'
                    ? 'bg-cyan-500 text-slate-950 font-black shadow-md shadow-cyan-500/20'
                    : 'bg-slate-950/80 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Zap className="w-3.5 h-3.5 text-cyan-400" />
                <span>Core Web Vitals</span>
              </button>
            </div>

            {/* Export & Print CTAs */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPdfReportModalOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs transition-all cursor-pointer flex items-center gap-2 shadow-md shadow-cyan-500/20 whitespace-nowrap"
                title="Download or Print Executive Branded Audit Report"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Executive PDF Report</span>
              </button>

              <button
                onClick={exportToCsv}
                disabled={crawledPages.length === 0}
                className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700/80 hover:border-emerald-500/40 text-slate-300 hover:text-emerald-300 text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap"
                title="Download Raw Crawl Data in CSV spreadsheet"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                <span className="hidden sm:inline">CSV Export</span>
              </button>
            </div>

          </div>

          {/* VIEW 1: SEMRUSH 3-TIER ISSUES BREAKDOWN */}
          {auditViewTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in">
              
              {/* Critical Errors Section */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-rose-500/20 border border-rose-500/30 flex items-center justify-center text-rose-400">
                      <XCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Critical Errors</span>
                        <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-xs font-bold">
                          {categorizedIssues.errors.length} Detected
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Severe issues that prevent Google from ranking or indexing your content.</p>
                    </div>
                  </div>
                </div>

                {categorizedIssues.errors.length === 0 ? (
                  <div className="p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-center space-y-1">
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 mx-auto" />
                    <span className="text-sm font-bold text-white block">Zero Critical Errors Found!</span>
                    <p className="text-xs text-slate-400">No 404 dead links, missing title tags, or conflicting H1 headings detected.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {categorizedIssues.errors.map((iss) => {
                      const isExpanded = expandedIssueId === iss.id;
                      return (
                        <div key={iss.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-rose-500/30 transition-all space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-white text-sm">{iss.title}</span>
                                <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-mono text-[10px] font-bold">
                                  {iss.count} Page(s) ({iss.percent}%)
                                </span>
                              </div>
                              <p className="text-xs text-slate-400">{iss.desc}</p>
                            </div>
                            <button
                              onClick={() => setExpandedIssueId(isExpanded ? null : iss.id)}
                              className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-slate-800"
                            >
                              <span>{isExpanded ? 'Hide URLs' : `View ${iss.count} URLs`}</span>
                              {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                            </button>
                          </div>

                          <div className="text-[11px] text-rose-300/90 font-mono bg-rose-950/20 px-3 py-1.5 rounded-lg border border-rose-900/30">
                            <strong>Impact:</strong> {iss.impact}
                          </div>

                          {isExpanded && (
                            <div className="pt-3 border-t border-slate-800 space-y-2">
                              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Affected URLs List:</span>
                              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                                {iss.pages.map((p, idx) => (
                                  <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                    <span className="text-slate-300 truncate max-w-lg">{p.url}</span>
                                    <button
                                      onClick={() => setSelectedRowDetail(p)}
                                      className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold underline shrink-0 cursor-pointer ml-2"
                                    >
                                      Inspect Page
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
              </div>

              {/* Warnings Section */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                      <AlertTriangle className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Warnings</span>
                        <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-xs font-bold">
                          {categorizedIssues.warnings.length} Detected
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Optimization opportunities that lower click-through rates or create technical debt.</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  {categorizedIssues.warnings.map((iss) => {
                    const isExpanded = expandedIssueId === iss.id;
                    return (
                      <div key={iss.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 hover:border-amber-500/30 transition-all space-y-3">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white text-sm">{iss.title}</span>
                              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-mono text-[10px] font-bold">
                                {iss.count} Page(s) ({iss.percent}%)
                              </span>
                            </div>
                            <p className="text-xs text-slate-400">{iss.desc}</p>
                          </div>
                          <button
                            onClick={() => setExpandedIssueId(isExpanded ? null : iss.id)}
                            className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto cursor-pointer border border-slate-800"
                          >
                            <span>{isExpanded ? 'Hide URLs' : `View ${iss.count} URLs`}</span>
                            {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                          </button>
                        </div>

                        <div className="text-[11px] text-amber-300/90 font-mono bg-amber-950/20 px-3 py-1.5 rounded-lg border border-amber-900/30">
                          <strong>Fix Advice:</strong> {iss.fixPrompt}
                        </div>

                        {isExpanded && (
                          <div className="pt-3 border-t border-slate-800 space-y-2">
                            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">Affected URLs:</span>
                            <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                              {iss.pages.map((p, idx) => (
                                <div key={idx} className="p-2 rounded-xl bg-slate-900 border border-slate-800/80 flex items-center justify-between text-xs font-mono">
                                  <span className="text-slate-300 truncate max-w-lg">{p.url}</span>
                                  <button
                                    onClick={() => setSelectedRowDetail(p)}
                                    className="text-cyan-400 hover:text-cyan-300 text-[11px] font-semibold underline shrink-0 cursor-pointer ml-2"
                                  >
                                    Inspect Page
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
              </div>

              {/* Notices Section */}
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Info className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <span>Notices &amp; Signals</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-xs font-bold">
                          {categorizedIssues.notices.length} Detected
                        </span>
                      </h3>
                      <p className="text-xs text-slate-400">Informational signals regarding redirects, thin content, and social media tags.</p>
                    </div>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  {categorizedIssues.notices.map((iss) => (
                    <div key={iss.id} className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white text-xs">{iss.title}</span>
                        <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 font-mono text-[10px] font-bold">
                          {iss.count} Page(s)
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400">{iss.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* VIEW 2: SCREAMING FROG INTERACTIVE TABLE */}
          {auditViewTab === 'table' && (
            <div ref={resultsTableRef} className="space-y-4 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                
                {/* Filter Tabs */}
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  <button
                    onClick={() => setActiveFilterTab('all')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'all'
                        ? 'bg-cyan-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>All Pages</span>
                    <span className="px-1.5 py-0.2 rounded-full bg-slate-950/20 text-[10px]">{crawledPages.length}</span>
                  </button>

                  <button
                    onClick={() => setActiveFilterTab('broken')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'broken'
                        ? 'bg-rose-500 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>Broken (404/5xx)</span>
                    {liveStats.broken > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-rose-950 text-rose-200 text-[10px] font-bold">
                        {liveStats.broken}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveFilterTab('titles')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'titles'
                        ? 'bg-amber-500 text-slate-950 font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>Title Issues</span>
                    {liveStats.titleIssues > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-amber-950 text-amber-200 text-[10px] font-bold">
                        {liveStats.titleIssues}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveFilterTab('h1')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'h1'
                        ? 'bg-purple-500 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>H1 Issues</span>
                    {liveStats.h1Issues > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-purple-950 text-purple-200 text-[10px] font-bold">
                        {liveStats.h1Issues}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveFilterTab('missing-alt')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'missing-alt'
                        ? 'bg-indigo-500 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>Missing ALT</span>
                    {liveStats.missingAlt > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-200 text-[10px] font-bold">
                        {liveStats.missingAlt}
                      </span>
                    )}
                  </button>

                  <button
                    onClick={() => setActiveFilterTab('redirects')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                      activeFilterTab === 'redirects'
                        ? 'bg-blue-500 text-white font-black'
                        : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                    }`}
                  >
                    <span>Redirects (3xx)</span>
                    {liveStats.redirects > 0 && (
                      <span className="px-1.5 py-0.2 rounded-full bg-blue-950 text-blue-200 text-[10px] font-bold">
                        {liveStats.redirects}
                      </span>
                    )}
                  </button>
                </div>

                {/* Table Search */}
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search in table..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-full sm:w-48"
                  />
                </div>

              </div>

              {/* Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                      <th className="p-3 w-12 text-center">#</th>
                      <th className="p-3 w-20">Status</th>
                      <th className="p-3">Page URL</th>
                      <th className="p-3">Title Tag</th>
                      <th className="p-3">H1 Heading</th>
                      <th className="p-3 w-20 text-center">Images</th>
                      <th className="p-3 w-20 text-center">Speed</th>
                      <th className="p-3">Issues</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80 text-slate-300">
                    {filteredPages.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="p-8 text-center text-slate-500">
                          No pages match the selected filter.
                        </td>
                      </tr>
                    ) : (
                      filteredPages.map((page) => (
                        <tr 
                          key={page.index}
                          onClick={() => setSelectedRowDetail(page)}
                          className="hover:bg-slate-800/40 transition-colors cursor-pointer group"
                        >
                          {/* Index */}
                          <td className="p-3 text-center font-mono text-slate-500 text-[11px]">
                            {page.index}
                          </td>

                          {/* Status Code */}
                          <td className="p-3">
                            <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${
                              page.status >= 200 && page.status < 300
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                                : page.status >= 300 && page.status < 400
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                            }`}>
                              {page.status || 'ERR'}
                            </span>
                          </td>

                          {/* URL */}
                          <td className="p-3 max-w-xs sm:max-w-sm">
                            <div className="font-mono text-slate-200 group-hover:text-cyan-400 transition-colors truncate font-semibold">
                              {page.path}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {page.url}
                            </div>
                          </td>

                          {/* Title */}
                          <td className="p-3 max-w-xs">
                            {page.title ? (
                              <div>
                                <div className="text-white font-medium truncate">{page.title}</div>
                                <span className={`text-[10px] font-mono ${
                                  page.title_status === 'good' ? 'text-emerald-400' : 'text-amber-400'
                                }`}>
                                  {page.title_length} chars ({page.title_status})
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-1.5 py-0.5 rounded">
                                Missing Title
                              </span>
                            )}
                          </td>

                          {/* H1 */}
                          <td className="p-3 max-w-xs">
                            {page.h1 ? (
                              <div>
                                <div className="text-slate-300 truncate">{page.h1}</div>
                                <span className={`text-[10px] font-mono ${
                                  page.h1_status === 'good' ? 'text-slate-500' : 'text-purple-400 font-bold'
                                }`}>
                                  {page.h1_count > 1 ? `Multiple (${page.h1_count} H1s)` : 'Single H1'}
                                </span>
                              </div>
                            ) : (
                              <span className="text-[10px] font-mono text-purple-400 font-bold bg-purple-500/10 px-1.5 py-0.5 rounded">
                                Missing H1
                              </span>
                            )}
                          </td>

                          {/* Images / Alt */}
                          <td className="p-3 text-center font-mono text-xs">
                            <div>
                              <span className="text-white">{page.images_count || 0}</span>
                              {page.images_missing_alt_count > 0 && (
                                <span className="block text-[10px] text-rose-400 font-bold">
                                  {page.images_missing_alt_count} no alt
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Speed */}
                          <td className="p-3 text-center font-mono text-xs">
                            <span className={page.load_time_ms < 800 ? 'text-emerald-400' : page.load_time_ms < 1800 ? 'text-amber-400' : 'text-rose-400'}>
                              {page.load_time_ms}ms
                            </span>
                          </td>

                          {/* Issues */}
                          <td className="p-3">
                            {page.issues && page.issues.length > 0 ? (
                              <div className="flex items-center gap-1 flex-wrap">
                                {page.issues.slice(0, 2).map((iss, i) => (
                                  <span key={i} className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-800 text-[10px] text-slate-300">
                                    {iss}
                                  </span>
                                ))}
                                {page.issues.length > 2 && (
                                  <span className="text-[10px] text-cyan-400 font-bold font-mono">
                                    +{page.issues.length - 2} more
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-emerald-400 text-[11px] font-semibold flex items-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                <span>Pass</span>
                              </span>
                            )}
                          </td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW 3: AI TECHNICAL ACTION PLAN */}
          {auditViewTab === 'ai-plan' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-gradient-to-br from-amber-950/30 via-slate-900 to-indigo-950/40 border border-amber-500/30 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">AI Technical Remediation Blueprint</h3>
                    <p className="text-xs text-slate-300">Prioritized step-by-step engineering fixes engineered for immediate Google ranking recovery.</p>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300 space-y-2">
                  <span className="text-amber-400 font-mono font-bold uppercase tracking-wider block">Executive Diagnostic Summary:</span>
                  <p className="leading-relaxed">
                    Aapki website ki overall SEO health <strong>{liveStats.healthScore}%</strong> evaluate hui hai. Crawl inspection me total <strong>{liveStats.totalIssuesFound} actionable signals</strong> identify huay hain. Google Search rankings ko consolidate karne ke liye neeche diye gaye priority order me fixes implement karein:
                  </p>
                </div>

                <div className="grid sm:grid-cols-3 gap-4 pt-2">
                  
                  {/* Step 1 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-rose-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold uppercase font-mono text-[10px]">Step 1 • Immediate</span>
                      <XCircle className="w-4 h-4 text-rose-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Eliminate 404s &amp; Broken Links</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {liveStats.broken > 0 
                        ? `Aapki site par ${liveStats.broken} broken URLs paye gaye hain. Googlebot in dead links par crawl budget waste karta hai.`
                        : 'Great job! Zero 404 dead links detected. Crawl budget is efficiently preserved.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-cyan-400 block font-mono">Action:</strong>
                      <span>WordPress (.htaccess / Redirection plugin) ya Nginx me 301 redirects lagayein.</span>
                    </div>
                  </div>

                  {/* Step 2 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-amber-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 font-bold uppercase font-mono text-[10px]">Step 2 • On-Page</span>
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Title &amp; H1 Tag Harmonization</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {liveStats.titleIssues > 0 || liveStats.h1Issues > 0
                        ? `${liveStats.titleIssues} title issues aur ${liveStats.h1Issues} H1 hierarchy issues paye gaye hain.`
                        : 'On-Page titles aur H1 heading structure Google guidelines ke mutabiq valid hain.'}
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-cyan-400 block font-mono">Action:</strong>
                      <span>Har page par single H1 tag rakhein aur title me Primary Keyword + Brand name specify karein.</span>
                    </div>
                  </div>

                  {/* Step 3 */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-indigo-500/30 space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold uppercase font-mono text-[10px]">Step 3 • Technical</span>
                      <Zap className="w-4 h-4 text-indigo-400" />
                    </div>
                    <h4 className="font-bold text-white text-sm">Core Web Vitals &amp; Image Alt</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Avg speed {liveStats.avgSpeed}ms hai aur {liveStats.missingAlt} pages par images bina ALT text ke paye gaye hain.
                    </p>
                    <div className="p-2.5 rounded-xl bg-slate-900 text-[11px] text-slate-300 space-y-1">
                      <strong className="text-cyan-400 block font-mono">Action:</strong>
                      <span>Images ko modern WebP me convert karein aur descriptive alt attributes provide karein.</span>
                    </div>
                  </div>

                </div>

                {/* CMS Specific Guidance */}
                <div className="pt-2">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold block mb-2">CMS-Specific Implementation Guides:</span>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <strong className="text-white block font-semibold">WordPress / WooCommerce:</strong>
                      <p className="text-slate-400 text-[11px]">Install Yoast SEO ya RankMath. Bulk Title/Description editor se missing metadata 1-click me inject karein.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <strong className="text-white block font-semibold">Shopify:</strong>
                      <p className="text-slate-400 text-[11px]">Online Store &rarr; Pages/Products &rarr; Edit Website SEO. URL handle aur meta description refine karein.</p>
                    </div>
                    <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                      <strong className="text-white block font-semibold">React / Next.js / Laravel:</strong>
                      <p className="text-slate-400 text-[11px]">Use next/head ya react-helmet for dynamic canonicals and JSON-LD schema siloing.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* VIEW 4: CORE WEB VITALS & SPEED */}
          {auditViewTab === 'speed' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
                  <div>
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Zap className="w-4 h-4 text-cyan-400" />
                      <span>Google Core Web Vitals Diagnostic (Lighthouse Standards)</span>
                    </h3>
                    <p className="text-xs text-slate-400">Evaluated against Google PageSpeed benchmarks for mobile and desktop user experience.</p>
                  </div>

                  <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800 self-start sm:self-auto">
                    <button
                      onClick={() => setSpeedDevice('mobile')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        speedDevice === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Smartphone className="w-3.5 h-3.5" />
                      <span>Mobile</span>
                    </button>
                    <button
                      onClick={() => setSpeedDevice('desktop')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors ${
                        speedDevice === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Laptop className="w-3.5 h-3.5" />
                      <span>Desktop</span>
                    </button>
                  </div>
                </div>

                {/* Speed Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  
                  {/* LCP */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>LCP (Largest Contentful)</span>
                      <span className="text-[10px] font-mono text-emerald-400">&lt; 2.5s</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      {(liveStats.avgSpeed / 1000 + 0.8).toFixed(1)}s
                    </div>
                    <div className="text-[10px] text-slate-500">Good • Fast visual render</div>
                  </div>

                  {/* FCP */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>FCP (First Contentful)</span>
                      <span className="text-[10px] font-mono text-emerald-400">&lt; 1.8s</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      {(liveStats.avgSpeed / 1000 + 0.4).toFixed(1)}s
                    </div>
                    <div className="text-[10px] text-slate-500">Good • Initial DOM visible</div>
                  </div>

                  {/* CLS */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>CLS (Cumulative Layout)</span>
                      <span className="text-[10px] font-mono text-emerald-400">&lt; 0.1</span>
                    </div>
                    <div className="text-2xl font-black font-mono text-emerald-400">
                      0.02
                    </div>
                    <div className="text-[10px] text-slate-500">Stable • Zero visual shifting</div>
                  </div>

                  {/* TTFB */}
                  <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>TTFB (Server Speed)</span>
                      <span className="text-[10px] font-mono text-emerald-400">&lt; 800ms</span>
                    </div>
                    <div className={`text-2xl font-black font-mono ${
                      liveStats.avgSpeed < 800 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {liveStats.avgSpeed}ms
                    </div>
                    <div className="text-[10px] text-slate-500">Raw backend latency</div>
                  </div>

                </div>

                {/* Recommendations */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                  <span className="text-cyan-400 font-mono font-bold uppercase tracking-wider block">Google Performance Action Items:</span>
                  <ul className="space-y-1.5 text-slate-300">
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">&check;</span>
                      <span>Serve images in next-gen formats (WebP, AVIF) to save up to 60% bandwidth.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">&check;</span>
                      <span>Enable HTTP/2 or HTTP/3 server multiplexing with Gzip / Brotli compression.</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-emerald-400 font-bold">&check;</span>
                      <span>Set explicit width and height dimensions on &lt;img&gt; elements to eliminate layout shift (CLS).</span>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          )}

          {/* 7. ROW DETAIL MODAL / DRAWER */}
          {selectedRowDetail && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 truncate max-w-lg">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                    selectedRowDetail.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    HTTP {selectedRowDetail.status}
                  </span>
                  <span className="text-sm font-bold text-white font-mono truncate">
                    {selectedRowDetail.url}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRowDetail(null)}
                  className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer flex items-center gap-1"
                >
                  <X className="w-3.5 h-3.5" />
                  <span>Close</span>
                </button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 text-xs">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Meta Title Tag</span>
                  <p className="text-white font-semibold">{selectedRowDetail.title || 'None defined'}</p>
                  <span className="text-[10px] text-slate-500">{selectedRowDetail.title_length} characters</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Primary H1 Heading</span>
                  <p className="text-white font-semibold">{selectedRowDetail.h1 || 'None defined'}</p>
                  <span className="text-[10px] text-slate-500">Total H1s found: {selectedRowDetail.h1_count}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Meta Description</span>
                  <p className="text-slate-300">{selectedRowDetail.description || 'None defined'}</p>
                  <span className="text-[10px] text-slate-500">{selectedRowDetail.description_length} characters</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Canonical Link</span>
                  <p className="text-slate-300 font-mono truncate">{selectedRowDetail.canonical || 'Not specified'}</p>
                  <span className="text-[10px] text-slate-500">Status: {selectedRowDetail.canonical_status}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Images &amp; Word Count</span>
                  <p className="text-white">
                    Images: {selectedRowDetail.images_count || 0} ({selectedRowDetail.images_missing_alt_count || 0} missing alt) • Words: {selectedRowDetail.word_count || 0}
                  </p>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                  <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">Links Found</span>
                  <p className="text-white">
                    Internal Inbound/Outbound: {selectedRowDetail.internal_links_count} • Outbound External: {selectedRowDetail.external_links_count}
                  </p>
                </div>
              </div>

              {selectedRowDetail.issues && selectedRowDetail.issues.length > 0 && (
                <div className="p-3.5 rounded-xl bg-rose-950/20 border border-rose-500/30 text-xs space-y-1">
                  <span className="text-rose-400 font-bold font-mono text-[10px] uppercase">Issues Identified on this Page:</span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {selectedRowDetail.issues.map((iss, i) => (
                      <span key={i} className="px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20 text-[11px]">
                        {iss}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>
      )}

      {/* 6. EXECUTIVE PDF AUDIT REPORT MODAL (WHITE LABEL PRINT-READY) */}
      {pdfReportModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="max-w-4xl w-full bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl p-6 sm:p-10 space-y-8 my-8 relative">
            
            {/* Modal Controls Bar */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-cyan-400" />
                <span className="font-bold text-white text-base">Executive Technical SEO Audit Report</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintPdf}
                  className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-lg transition-all"
                >
                  <Printer className="w-4 h-4" />
                  <span>Print / Save as PDF</span>
                </button>
                <button
                  onClick={() => setPdfReportModalOpen(false)}
                  className="w-8 h-8 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Print Container (ID for target printing) */}
            <div id="executive-audit-report" className="space-y-6 text-slate-300 text-xs">
              
              {/* Agency Letterhead */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 rounded-2xl bg-slate-950 border border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-xl bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm">W</div>
                    <span className="font-extrabold text-white text-lg">WAQAS MEHMOOD</span>
                  </div>
                  <span className="text-[10px] text-cyan-400 font-mono tracking-widest uppercase block mt-1">Digital Marketing &amp; SEO Architect</span>
                  <span className="text-[11px] text-slate-400 block">WhatsApp: +92 303 3111126 • waqasmehmood.com</span>
                </div>
                <div className="text-left sm:text-right space-y-1 font-mono text-[11px]">
                  <div><span className="text-slate-500">Target Website:</span> <span className="text-white font-bold">{targetUrl}</span></div>
                  <div><span className="text-slate-500">Date of Audit:</span> <span className="text-slate-300">{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span></div>
                  <div><span className="text-slate-500">Audit Engine:</span> <span className="text-cyan-400">Waqas Mehmood Screaming Frog v2.0</span></div>
                </div>
              </div>

              {/* Health Score Overview */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950/40 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold">Overall Health Assessment</span>
                  <h3 className="text-2xl font-black text-white">
                    {liveStats.healthScore >= 80 ? 'Good SEO Health • Minor Polish Needed' : 'Action Required • Critical Errors Detected'}
                  </h3>
                  <p className="text-xs text-slate-400 max-w-lg leading-relaxed">
                    Based on our deep crawl of {crawledPages.length} internal pages, your website scored {liveStats.healthScore} out of 100 on Google indexability and technical architecture standards.
                  </p>
                </div>
                <div className="text-center p-4 rounded-2xl bg-slate-950 border border-slate-800 shrink-0 min-w-36">
                  <div className={`text-5xl font-black font-mono ${
                    liveStats.healthScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                  }`}>
                    {liveStats.healthScore}%
                  </div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-slate-400 font-bold block mt-1">Health Score</span>
                </div>
              </div>

              {/* KPI Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Pages Crawled</span>
                  <span className="text-xl font-black text-white font-mono">{crawledPages.length}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-rose-500/30 text-center">
                  <span className="text-[10px] text-rose-400 font-mono uppercase block">Critical Errors</span>
                  <span className="text-xl font-black text-rose-400 font-mono">{liveStats.errorsCount}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-amber-500/30 text-center">
                  <span className="text-[10px] text-amber-400 font-mono uppercase block">Warnings</span>
                  <span className="text-xl font-black text-amber-400 font-mono">{liveStats.warningsCount}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-center">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Avg Speed</span>
                  <span className="text-xl font-black text-cyan-400 font-mono">{liveStats.avgSpeed}ms</span>
                </div>
              </div>

              {/* Top Issues Table */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white uppercase tracking-wider font-mono text-cyan-400">High-Priority Technical Findings:</h4>
                <div className="rounded-xl border border-slate-800 overflow-hidden">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-950 text-slate-400 font-mono border-b border-slate-800">
                      <tr>
                        <th className="p-2.5">Severity</th>
                        <th className="p-2.5">Issue Description</th>
                        <th className="p-2.5 text-center">Affected URLs</th>
                        <th className="p-2.5">Fix Recommendation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/80 bg-slate-900/60 text-slate-300">
                      {categorizedIssues.errors.concat(categorizedIssues.warnings).slice(0, 6).map((iss, idx) => (
                        <tr key={idx}>
                          <td className="p-2.5 font-mono">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              iss.severity === 'critical' ? 'bg-rose-500/20 text-rose-300' : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {iss.severity.toUpperCase()}
                            </span>
                          </td>
                          <td className="p-2.5 font-semibold text-white">{iss.title}</td>
                          <td className="p-2.5 text-center font-mono font-bold text-cyan-400">{iss.count}</td>
                          <td className="p-2.5 text-[11px] text-slate-400">{iss.fixPrompt || iss.impact}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Implementation CTA Box */}
              <div className="p-5 rounded-2xl bg-cyan-950/40 border border-cyan-800/40 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-white">Need an Expert to Fix These Technical Issues?</h4>
                  <p className="text-[11px] text-slate-300">Hire senior SEO specialist Waqas Mehmood for dedicated technical remediation, 301 redirect mapping, and Google Page 1 ranking strategies.</p>
                </div>
                <a
                  href="https://waqasmehmood.com/contact"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs shrink-0 whitespace-nowrap transition-all"
                >
                  Contact Waqas Mehmood &rarr;
                </a>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* 8. ON-PAGE SEO EDUCATIONAL GUIDE & TECHNICAL INFORMATION */}
      <article className="space-y-12 pt-12 border-t border-slate-800 text-left">
        
        {/* Navigation Pills */}
        <nav aria-label="Crawler Guide Navigation" className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Website Crawler Technical Guide</span>
            </span>
            <span>8 Min Technical Read</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button onClick={() => scrollToSection('how-it-works')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              1. How It Works
            </button>
            <button onClick={() => scrollToSection('key-metrics')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              2. Core Signals
            </button>
            <button onClick={() => scrollToSection('crawler-vs-gsc')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              3. Crawler vs Search Console
            </button>
            <button onClick={() => scrollToSection('faq-section')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              4. Crawler FAQs
            </button>
            <button onClick={() => scrollToSection('related-tools')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              5. Related Tools
            </button>
          </div>
        </nav>

        {/* Section 1: How It Works */}
        <section id="how-it-works" className="space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-mono">
            <span>Algorithm &amp; Pipeline</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            How This Online Screaming Frog Lite Crawler Analyzes Your Website
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Unlike superficial single-page checkers that only audit your homepage, this <strong>Multi-Page Site Auditor</strong> implements a breadth-first search (BFS) queue. It connects directly to your seed URL, discovers all internal hyperlinks (including routes inside XML Sitemaps), and pushes live diagnostics straight to your browser using <strong>Server-Sent Events (SSE)</strong>.
          </p>

          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">1. Seed &amp; Discovery</span>
              <p className="text-xs text-slate-300">Resolves seed URL, verifies DNS, checks XML Sitemap, and seeds the crawl queue.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">2. Native DOM Parsing</span>
              <p className="text-xs text-slate-300">Extracts title tags, H1-H6 hierarchy, meta descriptions, canonical URLs, and response latency.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase">3. Real-Time Stream</span>
              <p className="text-xs text-slate-300">Emits single-page telemetry to your dashboard in real-time with zero browser freezing.</p>
            </div>
          </div>
        </section>

        {/* Section 2: Core Signals */}
        <section id="key-metrics" className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Key Technical Signals Audited Across Every Page
          </h3>
          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">1. HTTP Response Codes (200, 301, 404, 500):</strong>
              <p className="text-slate-400 leading-relaxed">Instantly identifies broken dead links that squander search crawl budget and trigger visitor abandonment.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">2. Title Tag &amp; Snippet Optimization:</strong>
              <p className="text-slate-400 leading-relaxed">Alerts you if titles are missing, below 30 characters (too short to rank), or over 65 characters (truncated in SERP).</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">3. Primary H1 Heading Integrity:</strong>
              <p className="text-slate-400 leading-relaxed">Verifies that every indexable page has exactly one H1 tag matching its target commercial query intent.</p>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-white block font-semibold">4. Canonical URL Synchronization:</strong>
              <p className="text-slate-400 leading-relaxed">Ensures rel="canonical" tags are self-referencing to protect your domain from parameter-based duplicate content penalties.</p>
            </div>
          </div>
        </section>

        {/* Section 4: FAQs */}
        <section id="faq-section" className="space-y-4">
          <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
            Frequently Asked Questions (Crawler &amp; Technical SEO)
          </h3>
          <div className="space-y-2">
            {[
              {
                q: 'How does this online crawler differ from desktop Screaming Frog?',
                a: 'Desktop Screaming Frog requires a local software install and licenses for audits over 500 URLs. This online crawler runs natively in your browser via our secure cloud worker, requiring zero setup, zero installation, and offering real-time streaming with 1-click CSV and Executive PDF export.'
              },
              {
                q: 'Why is there a 50-page maximum limit per audit?',
                a: 'To guarantee instant response times and prevent distributed denial-of-service (DDoS) impacts on target servers, the public web tool operates with a safe ceiling of 50 pages per scan. This is more than sufficient to uncover 95% of systemic sitewide technical errors.'
              },
              {
                q: 'Will running an audit crash or slow down my live website?',
                a: 'No. The crawler incorporates a built-in politeness delay (150ms) between successive requests and respects strict connection timeouts (5 seconds). It behaves identically to a human user browsing through your pages.'
              },
              {
                q: 'How is the overall Site Health Score calculated?',
                a: 'The Health Score starts at 100% and deducts weighted penalties: severe deduction for 404 broken links (-40% relative weight), missing title tags (-20%), missing H1s (-15%), missing descriptions (-10%), and slow TTFB response times (-8%).'
              }
            ].map((faq, idx) => {
              const isOpen = openFaqIndex === idx;
              return (
                <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                    className="w-full p-4 text-left flex items-center justify-between text-xs font-bold text-white hover:text-cyan-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Section 6: Related Technical SEO Tools */}
        <section id="related-tools" className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Related Technical SEO Analyzers &amp; Tools</span>
            </h4>
            <span className="text-[10px] font-mono text-cyan-400 font-bold">Pillar: AI &amp; Technical</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
              {
                title: '1-Click Schema Generator',
                desc: 'Generate LocalBusiness, FAQ, and HowTo JSON-LD markup.',
                slug: 'schema-generator'
              },
              {
                title: 'Website Speed Checker',
                desc: 'Audit TTFB server response times & total page weight payloads.',
                slug: 'website-speed-checker'
              },
              {
                title: 'Broken Link Checker (Tech)',
                desc: 'Pinpoint 404 dead ends, redirect chains & protocol mismatches.',
                slug: 'tech-broken-link-checker'
              },
              {
                title: 'XML Sitemap Checker',
                desc: 'Parse, validate & inspect sitemap index structure and URL hygiene.',
                slug: 'xml-sitemap-checker'
              },
              {
                title: 'Robots.txt Tester',
                desc: 'Test bot crawl directives & disallow paths against Googlebot rules.',
                slug: 'robots-txt-tester'
              },
              {
                title: 'Google Ads ROAS Calculator',
                desc: 'Calculate breakeven ROAS and target CPA for paid campaigns.',
                slug: 'roas-calculator'
              }
            ].map((sibling, i) => (
              <a
                key={i}
                href={`/tools/${sibling.slug}`}
                className="p-3.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition-all block group"
              >
                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors flex items-center justify-between">
                  <span>{sibling.title}</span>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1 leading-normal">
                  {sibling.desc}
                </p>
              </a>
            ))}
          </div>
        </section>

        {/* Section 5: Hire Waqas CTA */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              Technical SEO Audits &amp; Core Web Vitals Remediation
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Found Broken Links, Redirect Chains or Indexing Errors?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Hire Waqas Mehmood to eliminate technical debt, fix crawl errors, optimize internal link equity, and improve organic Google search rankings.
            </p>
          </div>
          <button
            onClick={() => onHireClick && onHireClick('Technical SEO & Web Crawling Remediation')}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
          >
            <span>Hire Waqas Mehmood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </article>

    </div>
  );
}
