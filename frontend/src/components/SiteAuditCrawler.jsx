import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Play, Square, RefreshCw, Download, CheckCircle2, 
  AlertTriangle, XCircle, ArrowRight, ExternalLink, Filter, 
  HelpCircle, Layers, Clock, Zap, BookOpen, Target, Award, 
  Info, ChevronDown, ChevronRight, FileSpreadsheet, Sparkles,
  Shield, Check, Search
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
  const [activeFilterTab, setActiveFilterTab] = useState('all'); // 'all' | 'broken' | 'titles' | 'h1' | 'redirects'
  const [searchFilter, setSearchFilter] = useState('');
  const [selectedRowDetail, setSelectedRowDetail] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const eventSourceRef = useRef(null);
  const timerRef = useRef(null);
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
    setCrawledPages([]);
    setSummary(null);
    setErrorMessage('');
    setIsBlockedDomain(false);
    setSelectedRowDetail(null);
    setElapsedSeconds(0);
    setProgress({ current: 0, target: pageLimit, percent: 0, queue_size: 0 });
    setIsCrawling(true);

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
      const sum = JSON.parse(e.data);
      setSummary(sum);
      handleStopCrawl(false);
    });

    es.addEventListener('error_event', (e) => {
      const err = JSON.parse(e.data);
      setErrorMessage(err.message || 'An error occurred during crawling.');
      if (err.blocked) {
        setIsBlockedDomain(true);
      }
      handleStopCrawl(false);
    });

    es.onerror = () => {
      if (isCrawling) {
        setErrorMessage('Connection closed or website timeout reached.');
      }
      handleStopCrawl(false);
    };
  };

  // Stop Crawling
  const handleStopCrawl = (manual = true) => {
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

  // Filtered pages
  const filteredPages = crawledPages.filter((p) => {
    // 1. Tab filter
    let tabMatch = true;
    if (activeFilterTab === 'broken') tabMatch = p.status >= 400 || p.status === 0;
    else if (activeFilterTab === 'titles') tabMatch = p.title_status !== 'good';
    else if (activeFilterTab === 'h1') tabMatch = p.h1_status !== 'good';
    else if (activeFilterTab === 'redirects') tabMatch = p.status >= 300 && p.status < 400;

    if (!tabMatch) return false;

    // 2. Search query filter
    if (searchFilter.trim()) {
      const q = searchFilter.toLowerCase();
      return (
        p.url.toLowerCase().includes(q) ||
        p.title.toLowerCase().includes(q) ||
        p.h1.toLowerCase().includes(q) ||
        String(p.status).includes(q)
      );
    }
    return true;
  });

  // Calculate stats from live pages
  const liveStats = {
    total: crawledPages.length,
    broken: crawledPages.filter((p) => p.status >= 400 || p.status === 0).length,
    redirects: crawledPages.filter((p) => p.status >= 300 && p.status < 400).length,
    titleIssues: crawledPages.filter((p) => p.title_status !== 'good').length,
    h1Issues: crawledPages.filter((p) => p.h1_status !== 'good').length,
    avgSpeed: crawledPages.length > 0 
      ? Math.round(crawledPages.reduce((acc, p) => acc + (p.load_time_ms || 0), 0) / crawledPages.length)
      : 0,
    healthScore: summary?.health_score ?? (
      crawledPages.length > 0
        ? Math.max(10, Math.min(100, Math.round(100 - (crawledPages.filter(p => p.status >= 400).length * 20 + crawledPages.filter(p => p.title_status === 'missing').length * 10))))
        : 100
    )
  };

  // 1-Click CSV Export
  const exportToCsv = () => {
    if (crawledPages.length === 0) return;

    const headers = [
      'Index', 'Status Code', 'Status Text', 'URL', 'Load Time (ms)', 
      'Meta Title', 'Title Length', 'Title Status', 
      'Meta Description', 'Description Length', 'Description Status', 
      'H1 Heading', 'H1 Count', 'H1 Status', 
      'Canonical URL', 'Canonical Status', 
      'Internal Inlinks Found', 'Outbound Links', 'Issues'
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

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* 1. HERO HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>AI Tool • Multi-Page Website Crawler &amp; Screaming Frog Lite</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Free AI Website Crawler &amp; Site Auditor
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-2xl mx-auto">
          Apni website ka URL dalein — crawler live internal links traverse karke HTTP status codes, 404 broken links, meta tags, H1 structure aur page speed real-time table me dikhayega.
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
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Start Crawl</span>
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
            <span>Zero Server Crash Guarantee • Smart 50-Page Safe Ceiling</span>
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
                {isCrawling ? 'Crawling in Real-Time...' : 'Crawl Completed'}
              </span>
              <span className="font-mono text-cyan-400">
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
              className="h-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 transition-all duration-300 rounded-full"
              style={{ width: `${Math.min(100, Math.round((crawledPages.length / (progress.target || pageLimit)) * 100))}%` }}
            />
          </div>

          {/* Current URL Streamed */}
          <div className="text-[11px] font-mono text-slate-400 truncate">
            <span className="text-slate-500">Active URL:</span> <span className="text-slate-200">{currentCrawlingUrl || targetUrl}</span>
          </div>
        </div>
      )}

      {/* 4. EXECUTIVE KPI STAT CARDS (HEALTH SCORE & METRICS) */}
      {crawledPages.length > 0 && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
            
            {/* Card 1: Health Score */}
            <div className="col-span-2 p-5 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-1 text-center sm:text-left flex flex-col justify-between">
              <div className="flex items-center justify-between text-xs text-slate-400 font-medium">
                <span>Site Health Score</span>
                <Sparkles className="w-4 h-4 text-cyan-400" />
              </div>
              <div className="py-1">
                <div className={`text-4xl sm:text-5xl font-black font-mono ${
                  liveStats.healthScore >= 80 ? 'text-emerald-400' : liveStats.healthScore >= 60 ? 'text-amber-400' : 'text-rose-400'
                }`}>
                  {liveStats.healthScore}%
                </div>
              </div>
              <div className="text-[11px] text-slate-400">
                {liveStats.healthScore >= 80 ? 'Good SEO Health' : liveStats.healthScore >= 60 ? 'Moderate Issues Found' : 'Critical Fixes Required'}
              </div>
            </div>

            {/* Card 2: Total Crawled */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Pages Crawled</div>
              <div className="text-2xl font-black text-white font-mono">{liveStats.total}</div>
              <div className="text-[10px] text-slate-500">Internal HTML URLs</div>
            </div>

            {/* Card 3: Broken 404s */}
            <div className={`p-4 rounded-2xl border space-y-1 ${
              liveStats.broken > 0 ? 'bg-rose-950/20 border-rose-500/40' : 'bg-slate-900 border-slate-800'
            }`}>
              <div className="text-[11px] text-slate-400 font-medium flex items-center justify-between">
                <span>Broken (404/5xx)</span>
                {liveStats.broken > 0 && <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />}
              </div>
              <div className={`text-2xl font-black font-mono ${liveStats.broken > 0 ? 'text-rose-400' : 'text-slate-200'}`}>
                {liveStats.broken}
              </div>
              <div className="text-[10px] text-slate-500">Dead / Failed Links</div>
            </div>

            {/* Card 4: Title Issues */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">Title Issues</div>
              <div className={`text-2xl font-black font-mono ${liveStats.titleIssues > 0 ? 'text-amber-400' : 'text-slate-200'}`}>
                {liveStats.titleIssues}
              </div>
              <div className="text-[10px] text-slate-500">Missing or Short/Long</div>
            </div>

            {/* Card 5: H1 Issues */}
            <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-1">
              <div className="text-[11px] text-slate-400 font-medium">H1 Issues</div>
              <div className={`text-2xl font-black font-mono ${liveStats.h1Issues > 0 ? 'text-purple-400' : 'text-slate-200'}`}>
                {liveStats.h1Issues}
              </div>
              <div className="text-[10px] text-slate-500">Missing or Multiple</div>
            </div>

          </div>

          {/* 5. FILTER TABS & SEARCH & 1-CLICK CSV EXPORT */}
          <div ref={resultsTableRef} className="space-y-3">
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

              {/* Actions: Search & 1-Click CSV Download */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    placeholder="Search in table..."
                    className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:outline-none focus:border-cyan-400 w-36 sm:w-48"
                  />
                </div>

                <button
                  onClick={exportToCsv}
                  disabled={crawledPages.length === 0}
                  className="px-3.5 py-1.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 shrink-0"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Download CSV</span>
                </button>
              </div>

            </div>

            {/* 6. INTERACTIVE REAL-TIME CRAWL TABLE */}
            <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950 text-slate-400 font-mono text-[11px]">
                    <th className="p-3 w-12 text-center">#</th>
                    <th className="p-3 w-20">Status</th>
                    <th className="p-3">Page URL</th>
                    <th className="p-3">Title Tag</th>
                    <th className="p-3">H1 Heading</th>
                    <th className="p-3 w-20 text-center">Speed</th>
                    <th className="p-3">Issues</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 text-slate-300">
                  {filteredPages.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="p-8 text-center text-slate-500">
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

          {/* 7. ROW DETAIL MODAL / DRAWER */}
          {selectedRowDetail && (
            <div className="p-6 rounded-3xl bg-slate-900 border border-cyan-500/40 shadow-2xl space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded font-mono font-bold text-xs ${
                    selectedRowDetail.status === 200 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                  }`}>
                    HTTP {selectedRowDetail.status}
                  </span>
                  <span className="text-sm font-bold text-white font-mono truncate max-w-md">
                    {selectedRowDetail.url}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedRowDetail(null)}
                  className="text-slate-400 hover:text-white text-xs bg-slate-800 px-2.5 py-1 rounded-lg cursor-pointer"
                >
                  Close Details
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
              </div>
            </div>
          )}

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
              ⚙️ Crawling Algorithm
            </button>
            <button onClick={() => scrollToSection('critical-errors')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              🚨 5 Critical Errors
            </button>
            <button onClick={() => scrollToSection('comparison')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              ⚡ Screaming Frog Comparison
            </button>
            <button onClick={() => scrollToSection('faqs')} className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer">
              ❓ Crawler FAQs
            </button>
          </div>
        </nav>

        {/* Editorial Header */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Focus Keyword: <strong className="text-white">free online website crawler site audit tool</strong></span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>Googlebot Traversal Standard</span>
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
              The Comprehensive Guide to Multi-Page Technical SEO Crawling &amp; Site Auditing
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-3xl">
              How automated web bots traverse website link architectures, evaluate HTTP status headers, detect broken links, and prevent indexing bottlenecks before search engine algorithms drop your organic rankings.
            </p>
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                WM
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Waqas Mehmood</span>
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-400">Senior SEO Architect &amp; Software Engineer</div>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400">
              <span>Updated October 2026</span>
              <span>•</span>
              <span className="text-cyan-400">Real-Time Streaming Engine</span>
            </div>
          </div>
        </header>

        {/* Section 1: How It Works */}
        <section id="how-it-works" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-cyan-400 font-bold">Section 1 • Algorithmic Architecture</div>
            <h3 className="text-xl font-bold text-white">How the Breadth-First Search (BFS) Web Crawler Operates</h3>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed">
            Unlike simple single-page checkers that inspect only a homepage, our crawler mimics Googlebot using a <strong>Breadth-First Search (BFS)</strong> traversal loop. It starts at your seed URL, discovers all internal <code>&lt;a href&gt;</code> links, and recursively queues subsequent pages level-by-level (Depth 1, Depth 2, Depth 3).
          </p>
          <div className="grid sm:grid-cols-3 gap-3 pt-2">
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-bold text-xs flex items-center justify-center">1</span>
              <h4 className="text-xs font-bold text-white">Queue &amp; Deduplication</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                URLs are normalized, stripped of <code>#anchors</code>, and hashed in memory to prevent crawling the same page twice or getting trapped in loops.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-indigo-500/20 text-indigo-300 font-bold text-xs flex items-center justify-center">2</span>
              <h4 className="text-xs font-bold text-white">Fast HTTP Stream</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Strict 3.0s timeouts and Server-Sent Events (SSE) immediately push each page's data to your screen without holding heavy objects in memory.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
              <span className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-300 font-bold text-xs flex items-center justify-center">3</span>
              <h4 className="text-xs font-bold text-white">DOM Signal Extraction</h4>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                DOMXPath parses the HTML for meta titles, descriptions, H1 tags, canonical tags, and internal link counts to calculate an overall health score.
              </p>
            </div>
          </div>
        </section>

        {/* Section 2: 5 Critical Technical SEO Errors */}
        <section id="critical-errors" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-rose-400 font-bold">Section 2 • Technical Deficiencies</div>
            <h3 className="text-xl font-bold text-white">Top 5 Critical Errors Found During Multi-Page Crawls</h3>
          </div>
          <div className="space-y-2.5 text-xs text-slate-300">
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-rose-400 block font-bold">1. 404 Not Found Dead Links (Wasted Crawl Budget &amp; Bad UX)</strong>
              <p className="text-slate-400 leading-relaxed">
                When search engine crawlers encounter dead internal links, they waste finite crawl budget and drop user trust. Broken internal links must be updated or 301 redirected.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-amber-400 block font-bold">2. Missing or Truncated Meta Title Tags</strong>
              <p className="text-slate-400 leading-relaxed">
                Titles shorter than 30 characters lack topical keywords, while titles longer than 65 characters get abruptly truncated in Google desktop and mobile SERPs.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-purple-400 block font-bold">3. Missing or Multiple H1 Headings</strong>
              <p className="text-slate-400 leading-relaxed">
                Every page should have exactly one H1 representing the core subject. Having multiple H1s dilutes keyword relevance and confuses assistive screen readers.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-blue-400 block font-bold">4. Canonical Tag Mismatches</strong>
              <p className="text-slate-400 leading-relaxed">
                If page A has a canonical pointing to page B, Google may index page B instead. Accidental canonical errors are a leading cause of sudden de-indexation.
              </p>
            </div>
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-1">
              <strong className="text-cyan-400 block font-bold">5. Slow Server Response (TTFB &gt; 1800ms)</strong>
              <p className="text-slate-400 leading-relaxed">
                High Time-to-First-Byte (TTFB) directly hurts Google Core Web Vitals (INP and LCP), driving up bounce rates and depressing organic rankings.
              </p>
            </div>
          </div>
        </section>

        {/* Section 3: Screaming Frog vs Online Web Crawler */}
        <section id="comparison" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-emerald-400 font-bold">Section 3 • Tool Comparison</div>
            <h3 className="text-xl font-bold text-white">Desktop Screaming Frog vs. Online Web Crawler</h3>
          </div>
          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                  <th className="p-3.5">Feature</th>
                  <th className="p-3.5 text-cyan-400 font-bold bg-cyan-500/10">Waqas Mehmood Web Crawler</th>
                  <th className="p-3.5">Screaming Frog Desktop</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr>
                  <td className="p-3.5 font-semibold text-white">Software Installation</td>
                  <td className="p-3.5 font-bold text-emerald-400 bg-cyan-500/5">Zero (Runs 100% in Browser)</td>
                  <td className="p-3.5 text-slate-400">Requires Heavy PC Installation</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">Computer RAM &amp; CPU Usage</td>
                  <td className="p-3.5 font-bold text-emerald-400 bg-cyan-500/5">0% (Processed on Cloud Engine)</td>
                  <td className="p-3.5 text-rose-400">High (Consumes several GBs of RAM)</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">Live Real-Time Streaming</td>
                  <td className="p-3.5 font-bold text-emerald-400 bg-cyan-500/5">Instant SSE Stream to Browser</td>
                  <td className="p-3.5 text-slate-400">Desktop GUI table</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">1-Click CSV / Excel Export</td>
                  <td className="p-3.5 font-bold text-emerald-400 bg-cyan-500/5">Included Free (Formatted CSV)</td>
                  <td className="p-3.5 text-emerald-400">Included</td>
                </tr>
                <tr>
                  <td className="p-3.5 font-semibold text-white">Price</td>
                  <td className="p-3.5 font-bold text-emerald-400 bg-cyan-500/5">100% Free Forever</td>
                  <td className="p-3.5 text-amber-400">Free version capped at 500 URLs / $259/yr</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4: FAQs */}
        <section id="faqs" className="space-y-4">
          <div className="space-y-1">
            <div className="text-xs font-mono uppercase text-cyan-400 font-bold">Section 4 • Frequently Asked Questions</div>
            <h3 className="text-xl font-bold text-white">Frequently Asked Questions About the Website Crawler</h3>
          </div>
          <div className="space-y-3">
            {[
              {
                q: 'How does the free online website crawler discover pages on my site?',
                a: 'The crawler starts at your seed URL (e.g. your homepage) and parses internal links using Breadth-First Search (BFS). If your website is a JavaScript SPA (like React or Vue) or has few static links, the crawler automatically auto-discovers and ingests your XML sitemap to queue and audit your pages seamlessly.'
              },
              {
                q: 'How does this online crawler compare to desktop Screaming Frog?',
                a: 'Desktop Screaming Frog requires installation on your computer and consumes heavy CPU and RAM. Our web tool runs directly in your browser, streams data in real-time, and exports clean CSV sheets without any installation.'
              },
              {
                q: 'Why are enterprise platforms like Amazon or Daraz blocked from crawling?',
                a: 'Enterprise e-commerce and social networks contain millions of faceted URLs and aggressive Cloudflare CAPTCHAs that block automated bots. Capping out these domains ensures our free cloud crawler remains fast, reliable, and available for business, agency, and portfolio sites.'
              },
              {
                q: 'What does the SEO Health Score measure and how is it calculated?',
                a: 'The SEO Health Score (0–100%) evaluates page accessibility (HTTP 200 vs 404 errors), metadata compliance (title and description presence and length), heading structure (single H1 tags), and server response times (TTFB).'
              },
              {
                q: 'Can I export the audit report to Excel or Google Sheets?',
                a: 'Yes! Simply click the "Download CSV" button after or during the crawl. It generates a clean, spreadsheet-ready CSV file containing all crawled URLs, status codes, titles, H1s, speed metrics, and detected issues.'
              },
              {
                q: 'How often should I run a multi-page crawl audit on my website?',
                a: 'We recommend running a crawl audit at least once per month for active commercial blogs, and immediately after any CMS migration, theme revamp, or major content publishing cycle to catch 404 broken links early.'
              }
            ].map((faq, idx) => (
              <div key={idx} className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">?</span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${openFaqIndex === idx ? 'rotate-180 text-cyan-400' : ''}`} />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Authoritative Academic & Search Engine Citations */}
        <section id="citations" className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-bold">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>Official Search Engine Standards &amp; Crawling Documentation</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <a
              href="https://developers.google.com/search/docs/crawling-indexing"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Google Search Central - Crawling &amp; Indexing</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Official Google guidelines on Googlebot crawling, robots.txt directives, and HTTP status codes.
                </p>
              </div>
            </a>

            <a
              href="https://web.dev/vitals/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                  <span>Web.dev - Core Web Vitals Standard</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Google user-experience performance benchmarks for server response times (TTFB), LCP, and CLS.
                </p>
              </div>
            </a>

            <a
              href="https://www.w3.org/standards/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <span>W3C Semantic HTML Standards</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  World Wide Web Consortium specifications for heading hierarchies (H1–H6), title tags, and valid DOM elements.
                </p>
              </div>
            </a>

            <a
              href="https://schema.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                  <span>Schema.org Vocabulary</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Standardized JSON-LD schemas powering Google Rich Snippets, entity recognition, and knowledge graphs.
                </p>
              </div>
            </a>
          </div>
        </section>

        {/* Section 6: Related Technical SEO Tools (Internal Link Mesh) */}
        <section id="related-tools" className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-cyan-400" />
              <span>Related Technical SEO Analyzers &amp; Tools</span>
            </h4>
            <span className="text-[10px] font-mono text-amber-400">Pillar: AI Tools</span>
          </div>

          <div className="grid sm:grid-cols-3 gap-3">
            {[
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
                title: 'Schema Markup Validator',
                desc: 'Validate JSON-LD structured data for Google Rich Snippets.',
                slug: 'schema-markup-validator'
              },
              {
                title: 'Website SEO Checker',
                desc: 'Run a deep holistic on-page audit on any single landing page.',
                slug: 'website-seo-checker'
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
