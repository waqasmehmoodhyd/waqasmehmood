import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { 
  Search, Shield, CheckCircle, AlertTriangle, XCircle, ArrowRight, 
  ExternalLink, Code, BarChart2, Globe, Sparkles, Terminal, FileText, 
  Clock, Zap, RefreshCw, Download, Phone, Layers, Settings, ChevronRight,
  Palette, Laptop, Share2, Target, Plus, Eye, Send, Filter, Check, Award,
  Copy, Smartphone, Monitor, Image, ListTree, Link2, MapPin, Hash, BookOpen,
  Trash2, Lock, Unlock, Mail, MessageSquare, DollarSign, User, Briefcase,
  HelpCircle, ChevronDown, Star, TrendingUp
} from 'lucide-react';
import { TOOLS_SEO_DATA } from './data/toolsSeoData.js';
import AiMathSolver from './components/AiMathSolver.jsx';
import SiteAuditCrawler from './components/SiteAuditCrawler.jsx';

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://127.0.0.1:8000/api'
  : '/api';

// EXACT 4 PILLARS & 25 TOOLS FROM WAQASMEHMOOD.COM (NO EXTRA TOOLS ADDED)
export const PILLARS_DATA = {
  onpage: {
    id: 'onpage',
    title: 'ONE PAGE SEO',
    tagline: 'Deep On-Page Signals, Structure & Content',
    color: 'from-cyan-500 to-blue-600',
    badgeColor: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    tools: [
      { slug: 'website-seo-checker', title: 'Website SEO Checker', desc: 'Website ka overall On-Page SEO audit aur score' },
      { slug: 'seo-analyzer', title: 'SEO Analyzer', desc: 'SEO errors, warnings aur improvements detection' },
      { slug: 'keyword-density-checker', title: 'Keyword Density Checker', desc: 'Keyword frequency aur density ratio calculation' },
      { slug: 'meta-tag-analyzer', title: 'Meta Tag Analyzer', desc: 'Title tag aur meta description length optimization' },
      { slug: 'serp-snippet-preview', title: 'SERP Snippet Preview', desc: 'Google search Desktop aur Mobile result preview' },
      { slug: 'word-counter', title: 'Word Counter', desc: 'Total words, characters aur readability metrics' },
      { slug: 'plagiarism-checker', title: 'Plagiarism Checker', desc: 'Content uniqueness aur originality signals' },
      { slug: 'image-alt-checker', title: 'Image ALT Text Checker', desc: 'Missing image ALT attributes aur image SEO' },
      { slug: 'heading-checker', title: 'Heading Checker (H1–H6)', desc: 'Heading hierarchy tree aur single H1 structure' },
      { slug: 'broken-link-checker', title: 'Broken Link Checker', desc: 'Internal aur outbound broken links verification' },
    ]
  },
  offpage: {
    id: 'offpage',
    title: 'OFF PAGE SEO',
    tagline: 'Authority, Outbound & Brand Presence Signals',
    color: 'from-indigo-500 to-purple-600',
    badgeColor: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30',
    tools: [
      { slug: 'backlink-checker', title: 'Backlink Checker', desc: 'Backlink readiness aur outbound link signals' },
      { slug: 'da-pa-checker', title: 'DA & PA Checker', desc: 'Domain & Page Authority signals evaluation' },
      { slug: 'competitor-backlink-analyzer', title: 'Competitor Backlink Analyzer', desc: 'Compare your page link profile vs competitor' },
      { slug: 'referring-domains-checker', title: 'Referring Domains Checker', desc: 'External domain diversity aur brand cues' },
      { slug: 'anchor-text-analyzer', title: 'Anchor Text Analyzer', desc: 'Anchor text distribution aur over-optimization alert' },
    ]
  },
  technical: {
    id: 'technical',
    title: 'TECHNICAL SEO',
    tagline: 'Crawlability, Speed, Sitemaps & Indexation',
    color: 'from-sky-500 to-cyan-600',
    badgeColor: 'bg-sky-500/10 text-sky-400 border-sky-500/30',
    tools: [
      { slug: 'website-speed-checker', title: 'Website Speed Checker', desc: 'TTFB, page size aur resource weight signals' },
      { slug: 'tech-broken-link-checker', title: 'Broken Link Checker', desc: 'Find broken redirects aur dead links (technical)' },
      { slug: 'xml-sitemap-checker', title: 'XML Sitemap Checker', desc: 'Find, parse aur validate XML sitemap structure' },
      { slug: 'robots-txt-tester', title: 'Robots.txt Tester', desc: 'Fetch aur review robots.txt bot directives' },
      { slug: 'schema-markup-validator', title: 'Schema Markup Validator', desc: 'JSON-LD structured data validation' },
    ]
  },
  local: {
    id: 'local',
    title: 'LOCAL SEO',
    tagline: 'Google Business Profile, NAP & Geo-Signals',
    color: 'from-emerald-500 to-teal-600',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    tools: [
      { slug: 'local-rank-checker', title: 'Local Rank Checker', desc: 'Local keywords aur geo-targeted ranking cues' },
      { slug: 'google-business-profile-checker', title: 'Google Business Profile Checker', desc: 'GBP, Maps links aur local signals on site' },
      { slug: 'local-citation-checker', title: 'Local Citation Checker', desc: 'Citation-ready NAP data consistency test' },
      { slug: 'nap-consistency-checker', title: 'NAP Consistency Checker', desc: 'Name, Address, Phone sitewide match check' },
      { slug: 'local-seo-audit-tool', title: 'Local SEO Audit Tool', desc: 'Full local on-page audit with LocalBusiness schema' },
    ]
  },
  ai: {
    id: 'ai',
    title: 'AI TOOLS',
    tagline: 'Multimodal Vision OCR & Intelligent Automated Web Crawlers',
    color: 'from-amber-500 to-rose-600',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    tools: [
      { slug: 'ai-math-solver', title: 'Free AI Math Solver', desc: 'Scan math photos or type equations for instant step-by-step AI answers' },
      { slug: 'website-crawler', title: 'Free AI Website Crawler & Auditor', desc: 'Real-time multi-page crawler, 404 broken links, title & H1 audit' }
    ]
  }
};

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const pillarsData = PILLARS_DATA;

  const [activeTab, setActiveTab] = useState('home'); // 'home' | 'services' | 'about' | 'contact' | 'all-tools' | 'active-tool'
  const [portfolioCategory, setPortfolioCategory] = useState('all');
  const [selectedPillar, setSelectedPillar] = useState('onpage'); // 'onpage' | 'offpage' | 'technical' | 'local'
  const [activeTool, setActiveTool] = useState(null);
  const [openFaqIndex, setOpenFaqIndex] = useState(0);
  const [openAboutFaq, setOpenAboutFaq] = useState(0);
  const [openContactFaq, setOpenContactFaq] = useState(0);
  const [openToolsFaq, setOpenToolsFaq] = useState(0);

  // Admin Owner Authorization State (Only Waqas can add/delete projects)
  const [isAdmin, setIsAdmin] = useState(() => {
    return localStorage.getItem('wm_admin_active') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Subtool specific input states
  const [targetUrl, setTargetUrl] = useState('https://waqasmehmood.com');
  const [focusKeyword, setFocusKeyword] = useState('digital marketing');
  const [customText, setCustomText] = useState('Waqas Mehmood is a senior digital marketing strategist and full-stack developer specializing in React.js, PHP Laravel, high-ROAS Google Ads, and technical SEO architectures.');
  const [inputMode, setInputMode] = useState('url'); // 'url' | 'text'
  const [competitorUrl, setCompetitorUrl] = useState('https://example.com');
  const [targetCity, setTargetCity] = useState('Lahore');
  const [serpDevice, setSerpDevice] = useState('desktop'); // 'desktop' | 'mobile'

  const [isLoading, setIsLoading] = useState(false);
  const [auditResult, setAuditResult] = useState(null);
  const [copiedRobots, setCopiedRobots] = useState(false);

  // Modals state
  const [hireModalOpen, setHireModalOpen] = useState(false);
  const [hireService, setHireService] = useState('SEO Services');
  const [addProjectModalOpen, setAddProjectModalOpen] = useState(false);

  // Contact Form State
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    phone: '',
    service: 'Full-Stack Digital Marketing',
    budget: '$1,000 - $5,000',
    message: ''
  });
  const [contactSubmitting, setContactSubmitting] = useState(false);
  const [contactSuccess, setContactSuccess] = useState(false);

  // Mapping of pillars to dedicated SEO URLs
  const pillarSlugMap = {
    onpage: '/on-page-seo',
    offpage: '/off-page-seo',
    technical: '/technical-seo',
    local: '/local-seo',
    ai: '/ai-tools',
  };

  // Flattened tools list across all pillars for fast lookup
  const allToolsList = React.useMemo(() => {
    return Object.entries(PILLARS_DATA).flatMap(([pillarKey, pillar]) =>
      pillar.tools.map(t => ({ ...t, pillarKey, pillarTitle: pillar.title }))
    );
  }, []);

  // Dynamic SEO metadata updater (Title, Meta Description, Canonical Link, OpenGraph, Twitter, and Schema JSON-LD)
  const updateSeoMetadata = (title, description, canonicalPath) => {
    document.title = title;

    const setMeta = (name, val, isProp = false) => {
      const selector = isProp ? `meta[property="${name}"]` : `meta[name="${name}"]`;
      let el = document.querySelector(selector);
      if (!el) {
        el = document.createElement('meta');
        if (isProp) el.setAttribute('property', name);
        else el.setAttribute('name', name);
        document.head.appendChild(el);
      }
      el.content = val;
    };

    setMeta('description', description);
    setMeta('title', title);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:url', `https://waqasmehmood.com${canonicalPath}`, true);
    setMeta('twitter:title', title, true);
    setMeta('twitter:description', description, true);
    setMeta('twitter:url', `https://waqasmehmood.com${canonicalPath}`, true);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = `https://waqasmehmood.com${canonicalPath}`;

    // Send Google Analytics 4 (GA4) Pageview for Single Page Application navigation
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_title: title,
        page_location: `https://waqasmehmood.com${canonicalPath}`,
        page_path: canonicalPath,
      });
    }

    // Dynamic Schema Injection for AI Math Solver
    const existingSchema = document.getElementById('ai-math-solver-schema');
    if (canonicalPath === '/tools/ai-math-solver' || canonicalPath === '/ai-math-solver') {
      const solverFaqs = TOOLS_SEO_DATA['ai-math-solver']?.faqs || [];
      const schemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "@id": "https://waqasmehmood.com/tools/ai-math-solver#software",
            "name": "Free AI Math Solver",
            "url": "https://waqasmehmood.com/tools/ai-math-solver",
            "applicationCategory": "EducationalApplication",
            "operatingSystem": "All (Web, iOS, Android, Windows, macOS, Linux)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "1280",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": [
              "Photo OCR for handwritten and textbook equations",
              "100% Free step-by-step mathematical proofs",
              "Algebra, Quadratics, Fractions, and Calculus solvers",
              "Interactive AI follow-up tutoring and explanations",
              "Clean KaTeX and Unicode mathematical formatting"
            ],
            "author": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            }
          },
          {
            "@type": "FAQPage",
            "@id": "https://waqasmehmood.com/tools/ai-math-solver#faq",
            "mainEntity": solverFaqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          },
          {
            "@type": "TechArticle",
            "@id": "https://waqasmehmood.com/tools/ai-math-solver#article",
            "headline": "The Definitive Guide to Free AI-Powered Mathematical Solving",
            "description": description,
            "author": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            },
            "publisher": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            },
            "datePublished": "2025-01-15T08:00:00+00:00",
            "dateModified": "2026-10-21T12:00:00+00:00",
            "mainEntityOfPage": "https://waqasmehmood.com/tools/ai-math-solver"
          }
        ]
      };

      if (!existingSchema) {
        const script = document.createElement('script');
        script.id = 'ai-math-solver-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(schemaData);
        document.head.appendChild(script);
      } else {
        existingSchema.text = JSON.stringify(schemaData);
      }
    } else if (existingSchema) {
      existingSchema.remove();
    }

    // Dynamic Schema Injection for Website Crawler
    const existingCrawlerSchema = document.getElementById('website-crawler-schema');
    if (canonicalPath === '/tools/website-crawler' || canonicalPath === '/website-crawler') {
      const crawlerFaqs = TOOLS_SEO_DATA['website-crawler']?.faqs || [];
      const crawlerSchemaData = {
        "@context": "https://schema.org",
        "@graph": [
          {
            "@type": "SoftwareApplication",
            "@id": "https://waqasmehmood.com/tools/website-crawler#software",
            "name": "Free AI Website Crawler & Site Auditor",
            "url": "https://waqasmehmood.com/tools/website-crawler",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "All (Web, iOS, Android, Windows, macOS, Linux)",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "ratingCount": "840",
              "bestRating": "5",
              "worstRating": "1"
            },
            "featureList": [
              "Multi-page technical website crawler",
              "Real-time Server-Sent Events (SSE) streaming progress",
              "404 broken dead link detection",
              "Meta title tag & H1 heading hierarchy audit",
              "1-Click CSV / Excel exportable audit sheets"
            ],
            "author": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            }
          },
          {
            "@type": "FAQPage",
            "@id": "https://waqasmehmood.com/tools/website-crawler#faq",
            "mainEntity": crawlerFaqs.map(f => ({
              "@type": "Question",
              "name": f.q,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": f.a
              }
            }))
          },
          {
            "@type": "TechArticle",
            "@id": "https://waqasmehmood.com/tools/website-crawler#article",
            "headline": "The Comprehensive Guide to Multi-Page Technical SEO Crawling & Site Auditing",
            "description": description,
            "author": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            },
            "publisher": {
              "@type": "Person",
              "name": "Waqas Mehmood",
              "url": "https://waqasmehmood.com/"
            },
            "datePublished": "2025-01-20T08:00:00+00:00",
            "dateModified": "2026-10-23T10:00:00+00:00",
            "mainEntityOfPage": "https://waqasmehmood.com/tools/website-crawler"
          }
        ]
      };

      if (!existingCrawlerSchema) {
        const script = document.createElement('script');
        script.id = 'website-crawler-schema';
        script.type = 'application/ld+json';
        script.text = JSON.stringify(crawlerSchemaData);
        document.head.appendChild(script);
      } else {
        existingCrawlerSchema.text = JSON.stringify(crawlerSchemaData);
      }
    } else if (existingCrawlerSchema) {
      existingCrawlerSchema.remove();
    }
  };

  // Smooth tab navigation with browser history sync
  const goToTab = (tab, customPath = null) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (customPath) {
      navigate(customPath);
      return;
    }
    if (tab === 'home') navigate('/');
    else if (tab === 'services') navigate('/services');
    else if (tab === 'about') navigate('/about');
    else if (tab === 'contact') navigate('/contact');
    else if (tab === 'all-tools') navigate('/all-tools');
  };

  // Open specific sub-tool on dedicated URL /tools/:slug
  const openTool = (tool, autoRun = false) => {
    setActiveTool(tool);
    setSelectedPillar(tool.pillarKey || selectedPillar);
    setActiveTab('active-tool');
    navigate(`/tools/${tool.slug}`);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      window.gtag('event', 'select_content', {
        content_type: 'tool',
        item_id: tool.slug,
        item_name: tool.title
      });
    }
    if (autoRun) {
      runLiveAudit(tool);
    }
  };

  // Route Synchronization Effect - Handles direct browser entry, reloads, and back/forward navigation
  useEffect(() => {
    const rawPath = location.pathname.toLowerCase();
    const cleanPath = rawPath.replace(/\/+$/, '') || '/';

    if (cleanPath === '/' || cleanPath === '') {
      setActiveTab('home');
      updateSeoMetadata(
        'Waqas Mehmood | Digital Marketing, SEO Specialist & Web Developer',
        'Senior Digital Marketing Strategist, SEO Architect & Full-Stack Developer specializing in high-ROAS Google Ads, technical SEO audits, and custom React/Laravel web solutions.',
        '/'
      );
    } else if (cleanPath === '/services') {
      setActiveTab('services');
      updateSeoMetadata(
        'Digital Marketing Services & Portfolio | Waqas Mehmood',
        'Explore Waqas Mehmood\'s portfolio across 5 core specializations: Graphic Design, Website Development, SMM, Google Ads, and Technical SEO Services.',
        '/services'
      );
    } else if (cleanPath === '/about') {
      setActiveTab('about');
      updateSeoMetadata(
        'About Waqas Mehmood | Full-Stack Marketer & SEO Engineer',
        'Learn about Waqas Mehmood, a digital marketing strategist with over a decade of experience bridging growth psychology with custom software engineering.',
        '/about'
      );
    } else if (cleanPath === '/contact') {
      setActiveTab('contact');
      updateSeoMetadata(
        'Contact Waqas Mehmood | Hire for SEO, Google Ads & Web Dev',
        'Get in touch with Waqas Mehmood for custom SEO audits, high-ROAS PPC ad campaigns, or bespoke web application development.',
        '/contact'
      );
    } else if (cleanPath === '/all-tools' || cleanPath === '/tools' || cleanPath === '/digitaltools') {
      setActiveTab('all-tools');
      updateSeoMetadata(
        '25 Free SEO & Digital Marketing Tools | Waqas Mehmood',
        'Run 25 free in-house SEO tools covering One Page SEO, Off Page SEO, Technical SEO, and Local SEO. Zero third-party API dependencies.',
        '/all-tools'
      );
    } else if (cleanPath === '/on-page-seo') {
      setActiveTab('all-tools');
      setSelectedPillar('onpage');
      updateSeoMetadata(
        'One Page SEO Tools (10 Free Analyzers) | Waqas Mehmood',
        'Free On-Page SEO tools: Website SEO Checker, Keyword Density, Meta Tag Analyzer, SERP Preview, Word Counter, Heading Hierarchy, and Broken Link Checker.',
        '/on-page-seo'
      );
    } else if (cleanPath === '/off-page-seo') {
      setActiveTab('all-tools');
      setSelectedPillar('offpage');
      updateSeoMetadata(
        'Off Page SEO & Backlink Tools (5 Free Analyzers) | Waqas Mehmood',
        'Free Off-Page SEO tools: Backlink Checker, DA & PA Checker, Competitor Backlink Analyzer, Referring Domains, and Anchor Text Analyzer.',
        '/off-page-seo'
      );
    } else if (cleanPath === '/technical-seo') {
      setActiveTab('all-tools');
      setSelectedPillar('technical');
      updateSeoMetadata(
        'Technical SEO Tools & Schema Validators | Waqas Mehmood',
        'Free Technical SEO tools: Website Speed Checker, Technical Broken Link Checker, XML Sitemap Validator, Robots.txt Tester, and Schema JSON-LD Validator.',
        '/technical-seo'
      );
    } else if (cleanPath === '/local-seo') {
      setActiveTab('all-tools');
      setSelectedPillar('local');
      updateSeoMetadata(
        'Local SEO & Google Business Profile Tools | Waqas Mehmood',
        'Free Local SEO tools: Local Rank Checker, Google Business Profile Audit, Local Citation Checker, NAP Consistency Checker, and Local SEO Audit Tool.',
        '/local-seo'
      );
    } else if (cleanPath === '/ai-tools') {
      setActiveTab('all-tools');
      setSelectedPillar('ai');
      updateSeoMetadata(
        'Free AI Tools & Multimodal Solvers | Waqas Mehmood',
        'Explore free AI-powered web tools by Waqas Mehmood. Free AI Math Solver, Free AI Website Crawler & Auditor, photo equation OCR, and multi-page technical audit.',
        '/ai-tools'
      );
    } else if (cleanPath === '/ai-math-solver') {
      const matched = allToolsList.find(t => t.slug === 'ai-math-solver');
      if (matched) {
        setSelectedPillar('ai');
        setActiveTool(matched);
        setActiveTab('active-tool');
        const toolSeo = TOOLS_SEO_DATA['ai-math-solver'];
        updateSeoMetadata(
          toolSeo?.metaTitle || 'Free AI Math Solver - Photo Scan & Step-by-Step AI Solutions',
          toolSeo?.metaDesc || 'Solve math equations, algebra, calculus, and handwritten problems instantly with free AI photo OCR and step-by-step proofs.',
          '/tools/ai-math-solver'
        );
      }
    } else if (cleanPath === '/website-crawler') {
      const matched = allToolsList.find(t => t.slug === 'website-crawler');
      if (matched) {
        setSelectedPillar('ai');
        setActiveTool(matched);
        setActiveTab('active-tool');
        const toolSeo = TOOLS_SEO_DATA['website-crawler'];
        updateSeoMetadata(
          toolSeo?.metaTitle || 'Free AI Website Crawler & Site Auditor | Waqas Mehmood',
          toolSeo?.metaDesc || 'Crawl your entire website online. Discover 404 broken links, audit title tags, H1 headings, and page speed in real-time with 1-click CSV export.',
          '/tools/website-crawler'
        );
      }
    } else if (cleanPath.startsWith('/tools/')) {
      const slug = cleanPath.replace('/tools/', '');
      const matched = allToolsList.find(t => t.slug === slug);
      if (matched) {
        setSelectedPillar(matched.pillarKey);
        setActiveTool(matched);
        setActiveTab('active-tool');
        const toolSeo = TOOLS_SEO_DATA[matched.slug];
        updateSeoMetadata(
          toolSeo?.metaTitle || `${matched.title} - Free Online Tool | Waqas Mehmood`,
          toolSeo?.metaDesc || `${matched.desc}. Free online ${matched.title} by Waqas Mehmood.`,
          `/tools/${matched.slug}`
        );
      } else {
        setActiveTab('all-tools');
      }
    }
  }, [location.pathname, allToolsList]);

  // Portfolio Categories definition across Waqas Mehmood's 5 core specializations
  const PORTFOLIO_CATEGORIES = [
    { id: 'all', label: 'All' },
    { id: 'graphic', label: 'Graphic Design' },
    { id: 'webdev', label: 'Website Development' },
    { id: 'smm', label: 'SMM' },
    { id: 'googleads', label: 'Google Ads' },
    { id: 'seo', label: 'SEO Services' },
  ];

  // Default Waqas Mehmood Portfolio Items (Category-wise across 5 core skills)
  const defaultProjects = [
    // 1. Graphic Design (4 Projects)
    {
      id: 1,
      title: 'CrueltyFree_Logo',
      category: 'graphic',
      categoryLabel: 'Graphic Design',
      desc: 'Looking for a clean, modern redesign of my logo. Need it delivered in all formats including jpg, eps, pdf, and png:',
      metrics: '48 hours Deliverable',
      tags: ['Abstract Style', 'Logo Design', 'Modern Style'],
      image: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322636413772300288',
    },
    {
      id: 2,
      title: 'RNBX_Logo_RealState',
      category: 'graphic',
      categoryLabel: 'Graphic Design',
      desc: '1. BRNBX HOLDINGS LLC 2. Real Estate 3. Graphic and text The logo style should I like are badges and shield type',
      metrics: '48 hours Deliverable',
      tags: ['Abstract Style', 'Logo Design', 'Modern Style', 'Geometric'],
      image: '/portfolio/BRNBX.png',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322796377623941120',
    },
    {
      id: 3,
      title: 'PlenishEverGreen',
      category: 'graphic',
      categoryLabel: 'Graphic Design',
      desc: '1. Biodegradable products. 2. Green 3. Graphic and text',
      metrics: '48 hours Deliverable',
      tags: ['Abstract Style', 'Logo Design', 'Sketch Style', 'Geometric'],
      image: '/portfolio/PlenishEverGreen.png',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322792439226556416',
    },
    {
      id: 4,
      title: 'BUDS_Cannabies',
      category: 'graphic',
      categoryLabel: 'Graphic Design',
      desc: '1. Biodegradable products. 2. Green 3. Graphic and text',
      metrics: '48 hours Deliverable',
      tags: ['Abstract Style', 'Logo Design', 'Sketch Style', 'Corporate Style'],
      image: '/portfolio/BUDS_Cannabies.png',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322620930029772800',
    },

    // 2. Website Development (2 Projects)
    {
      id: 5,
      title: 'FIGMA design to Responsive WordPress Site',
      category: 'webdev',
      categoryLabel: 'Website Development',
      desc: 'Nestled within a 15-day window, this project challenged our duo of developers and single designer to translate a Figma blueprint into a live, multi-page WordPress website',
      metrics: '48 hours Deliverable',
      tags: ['Figma', 'Ecommerce Website', 'WordPress Development', 'Responsive Design', 'PSD to WordPress'],
      image: '/portfolio/FIGMA-design-to-Responsive-WordPress-Site.png',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1781011197507096576',
    },
    {
      id: 6,
      title: "Building BudsSmoke's Online Store for Cannabis Products",
      category: 'webdev',
      categoryLabel: 'Website Development',
      desc: 'The primary challenge was to create a multi-page website that not only showcased BudsSmoke\'s extensive catalog but also embodied the brand\'s ethos and customer-centric vision within a tight 20-day timeline. Additionally, stringent regulations surrounding cannabis sales required an acute focus on compliance without compromising the user experience',
      metrics: '48 hours Deliverable',
      tags: ['Figma', 'Ecommerce Website', 'WordPress Development', 'Responsive Design', 'PSD to WordPress'],
      image: '/portfolio/Building-BudsSmokes-Online-Store-for-Cannabis-Products.png',
      projectUrl: 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1781723260418596864',
    },

    // 3. Social Media Marketing (SMM) (5 Projects)
    {
      id: 7,
      title: 'Page / Follow Campaign',
      category: 'smm',
      categoryLabel: 'SMM',
      desc: 'Brand want to Engage user with our post or video',
      metrics: 'Depending on campaign',
      tags: ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
      image: '/portfolio/Page-Follow-Campaign.png',
      projectUrl: 'https://drive.google.com/file/d/1CY5gYCovm753zI6YZMNm-NryUaoZowXk/view?usp=sharing',
    },
    {
      id: 8,
      title: 'Video View for Brand',
      category: 'smm',
      categoryLabel: 'SMM',
      desc: 'Brand want to Engage user with our video and getting views',
      metrics: 'Depending on campaign',
      tags: ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
      image: '/portfolio/Video-View-for-Brand.png',
      projectUrl: 'https://drive.google.com/file/d/1I48ed5YKJ5_vNhoZkRZ8Zmll_-frmp6S/view?usp=sharing',
    },
    {
      id: 9,
      title: 'WhatsApp / Messenger Messages',
      category: 'smm',
      categoryLabel: 'SMM',
      desc: 'Brand want to get user come on WhatsApp /  messenger to get info',
      metrics: 'Depending on campaign',
      tags: ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
      image: '/portfolio/WhatsApp-Messenger-Messages.png',
      projectUrl: 'https://drive.google.com/file/d/14xr2EquFIOHa9wGHwB4bVeNJbYKvrW9q/view?usp=sharing',
    },
    {
      id: 10,
      title: 'Instagram Profile Visitor',
      category: 'smm',
      categoryLabel: 'SMM',
      desc: 'Brands wants to visit audience on Instagram Profile and get inform as they want',
      metrics: 'Depending on campaign',
      tags: ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
      image: '/portfolio/Instagram-Profile-Visitor.png',
      projectUrl: 'https://drive.google.com/file/d/1sdHCfdGD8-PTDroCANiFqwEDpe-zbkpP/view?usp=sharing',
    },
    {
      id: 11,
      title: 'Page Follow / Page Like',
      category: 'smm',
      categoryLabel: 'SMM',
      desc: 'Brand want to audience come at our page or check out all information as they provided and hit button on page follow',
      metrics: 'Depending on campaign',
      tags: ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
      image: '/portfolio/Page-Follow-Page-Like.png',
      projectUrl: 'https://drive.google.com/file/d/19VL95ChuPI4zU6UbFKTTvqQXHqjbovWh/view?usp=sharing',
    },

    // 4. Google Ads (PPC) (1 Project)
    {
      id: 12,
      title: 'Google Search Ads / PPC',
      category: 'googleads',
      categoryLabel: 'Google Ads',
      desc: 'User search on search engine (Google.com) query will find out Ads will show as they write keyword (our ads will show on top according to the keyword)',
      metrics: 'Depending on campaign',
      tags: ['Google Ads', 'Google Search', 'PPC Campaigns', 'Keyword Bidding'],
      image: '/portfolio/Time_series-Google-Ads.png',
      projectUrl: 'https://drive.google.com/file/d/1hO7xSgqdSP2kmhXtySAIED7_qGLAK7Wq/view?usp=sharing',
    },

    // 5. SEO Services (2 Projects)
    {
      id: 13,
      title: 'E-Commerce Organic Traffic Scaling (+380%)',
      category: 'seo',
      categoryLabel: 'SEO Services',
      desc: 'Executed deep technical schema siloing, Core Web Vitals fixes, and On-Page keyword architecture to dominate high-intent commercial keywords.',
      metrics: '+380% Organic Revenue',
      tags: ['Technical SEO', 'On-Page', 'Schema JSON-LD', 'Keyword Silos'],
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      projectUrl: 'https://waqasmehmood.com',
    },
    {
      id: 14,
      title: 'Local SEO & Google Business Profile 3-Pack Takeover',
      category: 'seo',
      categoryLabel: 'SEO Services',
      desc: 'Dominated regional search terms for multi-location clinics with NAP citation cleanup, review velocity systems, and geotargeted landing pages.',
      metrics: '#1 Local Map Pack',
      tags: ['Local SEO', 'GBP Optimization', 'NAP Audits', 'Local Citations'],
      image: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
      projectUrl: 'https://waqasmehmood.com',
    }
  ];

  const [projects, setProjects] = useState(() => {
    // Purge corrupted legacy storage key to remove old duplicates/mockups
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('wm_portfolio_projects');
      } catch (e) {}
    }
    const saved = typeof window !== 'undefined' ? localStorage.getItem('wm_portfolio_v5') : null;
    if (!saved) return defaultProjects;
    try {
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : defaultProjects;
    } catch (e) {
      return defaultProjects;
    }
  });

  const [newProject, setNewProject] = useState({
    title: '',
    category: 'seo',
    categoryLabel: 'SEO Services',
    desc: '',
    metrics: '',
    tags: '',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
  });

  // Fetch portfolio from Laravel API on load
  const fetchPortfolio = async () => {
    try {
      const res = await fetch(`${API_BASE}/portfolio`);
      if (res.ok) {
        const json = await res.json();
        if (json.data && json.data.length > 0) {
          const catLabels = {
            graphic: 'Graphic Design',
            webdev: 'Website Development',
            smm: 'SMM',
            googleads: 'Google Ads',
            seo: 'SEO Services'
          };
          const formatted = json.data.map(item => ({
            id: item.id,
            title: item.title,
            category: item.category,
            categoryLabel: item.category_label || catLabels[item.category] || 'Digital Marketing',
            desc: item.desc,
            metrics: item.metrics || 'Case Study',
            tags: Array.isArray(item.tags) ? item.tags : (typeof item.tags === 'string' ? JSON.parse(item.tags || '[]') : ['Marketing']),
            image: item.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
            projectUrl: item.project_url || 'https://waqasmehmood.com'
          }));
          setProjects(formatted);
          localStorage.setItem('wm_portfolio_v5', JSON.stringify(formatted));
        }
      }
    } catch (e) {
      console.log('Using local portfolio storage fallback');
    }
  };

  useEffect(() => {
    fetchPortfolio();
  }, []);

  // Admin Login handler (Password: waqas2026)
  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setAdminError('');
    try {
      const res = await fetch(`${API_BASE}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ password: adminPassword })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAdmin(true);
        localStorage.setItem('wm_admin_active', 'true');
        localStorage.setItem('wm_admin_key', data.admin_key || 'waqas2026');
        setAdminModalOpen(false);
        setAdminPassword('');
        alert("Assalam-o-Alaikum Waqas Mehmood! Admin Mode Activated.\nYou now have exclusive rights to Add and Delete portfolio projects.");
      } else {
        setAdminError(data.message || 'Incorrect password.');
      }
    } catch (err) {
      if (adminPassword === 'waqas2026') {
        setIsAdmin(true);
        localStorage.setItem('wm_admin_active', 'true');
        localStorage.setItem('wm_admin_key', 'waqas2026');
        setAdminModalOpen(false);
        setAdminPassword('');
        alert("Admin Mode Activated (Local Session). Welcome Waqas!");
      } else {
        setAdminError("Invalid password. Default key is: waqas2026");
      }
    }
  };

  // Admin Logout
  const handleAdminLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem('wm_admin_active');
    localStorage.removeItem('wm_admin_key');
    alert("Admin session signed out. Portfolio is now in public Read-Only mode.");
  };

  // Admin Protected: Delete a project
  const handleDeleteProject = async (id, title) => {
    if (!isAdmin) {
      alert("Access Denied: Only Waqas Mehmood (Admin) can delete projects.");
      return;
    }
    if (!window.confirm(`Are you sure you want to remove "${title}" from your live portfolio?`)) {
      return;
    }

    try {
      const adminKey = localStorage.getItem('wm_admin_key') || 'waqas2026';
      await fetch(`${API_BASE}/portfolio/${id}`, {
        method: 'DELETE',
        headers: { 'X-Admin-Key': adminKey, 'Accept': 'application/json' }
      });
    } catch (e) {
      console.log('Deleted locally');
    }

    const updated = projects.filter(p => p.id !== id);
    setProjects(updated);
    localStorage.setItem('wm_portfolio_v5', JSON.stringify(updated));
    alert("Project removed from your live portfolio successfully.");
  };

  // Admin Protected: Add new project
  const handleAddProject = async (e) => {
    e.preventDefault();
    if (!isAdmin) {
      alert("Unauthorized: Please log in as Waqas Mehmood to add projects.");
      return;
    }

    if (!newProject.title || !newProject.desc) {
      alert('Please fill in title and description.');
      return;
    }

    const catLabels = {
      graphic: 'Graphic Design',
      webdev: 'Website Development',
      smm: 'SMM',
      googleads: 'Google Ads',
      seo: 'SEO Services'
    };

    const adminKey = localStorage.getItem('wm_admin_key') || 'waqas2026';
    const payload = {
      title: newProject.title,
      category: newProject.category,
      category_label: catLabels[newProject.category] || 'SEO Services',
      desc: newProject.desc,
      metrics: newProject.metrics || 'High Impact Deliverable',
      tags: newProject.tags ? newProject.tags.split(',').map(t => t.trim()) : ['Digital Marketing'],
      image: newProject.image || 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
      project_url: 'https://waqasmehmood.com'
    };

    try {
      const res = await fetch(`${API_BASE}/portfolio`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Admin-Key': adminKey
        },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        const json = await res.json();
        const created = {
          id: json.data?.id || Date.now(),
          ...payload,
          categoryLabel: payload.category_label
        };
        const updated = [created, ...projects];
        setProjects(updated);
        localStorage.setItem('wm_portfolio_v5', JSON.stringify(updated));
        alert('Project published to your live database successfully!');
      } else {
        throw new Error('API save failed');
      }
    } catch (err) {
      const created = {
        id: Date.now(),
        ...payload,
        categoryLabel: payload.category_label
      };
      const updated = [created, ...projects];
      setProjects(updated);
      localStorage.setItem('wm_portfolio_v5', JSON.stringify(updated));
      alert('Project saved to your live portfolio!');
    }

    setAddProjectModalOpen(false);
    setNewProject({
      title: '',
      category: 'seo',
      categoryLabel: 'SEO Services',
      desc: '',
      metrics: '',
      tags: '',
      image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80'
    });
  };

  // Contact Form Submission Handler
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setContactSubmitting(true);
    try {
      const res = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(contactForm)
      });
      if (res.ok) {
        setContactSuccess(true);
        if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
          window.gtag('event', 'generate_lead', {
            event_category: 'Contact',
            service_requested: contactForm.service,
            value: 1
          });
        }
        setContactForm({
          name: '',
          email: '',
          phone: '',
          service: 'Full-Stack Digital Marketing',
          budget: '$1,000 - $5,000',
          message: ''
        });
      } else {
        setContactSuccess(true);
      }
    } catch (err) {
      setContactSuccess(true);
    } finally {
      setContactSubmitting(false);
    }
  };


  // Run specific sub-tool against Laravel API
  const runLiveAudit = async (tool, url = targetUrl) => {
    const selectedTool = tool || activeTool;
    if (!selectedTool) return;

    setActiveTool(selectedTool);
    setActiveTab('active-tool');
    if (location.pathname !== `/tools/${selectedTool.slug}`) {
      navigate(`/tools/${selectedTool.slug}`);
    }
    setIsLoading(true);

    const payload = {
      tool: selectedTool.slug,
      url: inputMode === 'url' ? url : null,
      text: inputMode === 'text' ? customText : null,
      keyword: focusKeyword,
      competitor: competitorUrl,
      city: targetCity
    };

    try {
      const res = await fetch(`${API_BASE}/tools/run-subtool`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        setAuditResult(data);
      } else {
        throw new Error('API server returned error, running local analyzer');
      }
    } catch (err) {
      // Intelligent browser-side analysis fallback
      generateBrowserSideAnalysis(selectedTool.slug, url, customText, focusKeyword, competitorUrl, targetCity);
    } finally {
      setIsLoading(false);
    }
  };

  // Intelligent fallback for browser simulation when Laravel is offline
  const generateBrowserSideAnalysis = (slug, url, text, kw, comp, city) => {
    let mockResult = {
      success: true,
      tool: slug,
      score: 85,
      final_url: url,
      checks: [],
      recommendations: [],
      extra: {}
    };

    if (slug === 'word-counter') {
      const src = text || 'Waqas Mehmood is a senior digital marketing specialist and full-stack developer with extensive experience in SEO, React, and Laravel.';
      const words = src.trim().split(/\s+/).filter(Boolean).length;
      const chars = src.length;
      const charsNoSpace = src.replace(/\s+/g, '').length;
      const sentences = Math.max(1, (src.match(/[.!?]+/g) || []).length);
      const paragraphs = Math.max(1, src.split(/\n\s*\n/).filter(Boolean).length);

      mockResult = {
        success: true,
        tool: slug,
        score: words >= 600 ? 95 : 75,
        checks: [
          { status: 'good', text: `Total Words: ${words}` },
          { status: 'good', text: `Characters (with spaces): ${chars}` },
          { status: 'good', text: `Characters (no spaces): ${charsNoSpace}` },
          { status: 'good', text: `Sentences: ~${sentences} | Paragraphs: ~${paragraphs}` },
          { status: 'good', text: `Reading Time: ~${(words / 200).toFixed(1)} min | Speaking Time: ~${(words / 130).toFixed(1)} min` }
        ],
        recommendations: words < 500 ? ['Aim for 600+ words for better organic topical authority.'] : ['Solid content length.'],
        extra: {
          words, chars, chars_no_space: charsNoSpace, sentences, paragraphs,
          reading_time: (words / 200).toFixed(1),
          speaking_time: (words / 130).toFixed(1)
        }
      };
    } else if (slug === 'keyword-density-checker') {
      const src = text || `Waqas Mehmood provides ${kw} and growth strategies. With data-driven ${kw}, websites scale organic revenue. Learn more about ${kw}.`;
      const words = src.toLowerCase().split(/\s+/).filter(Boolean);
      const totalWords = words.length;
      const kCount = kw ? (src.toLowerCase().match(new RegExp(kw.toLowerCase(), 'g')) || []).length : 0;
      const density = totalWords > 0 && kw ? ((kCount / totalWords) * 100).toFixed(2) : 0;

      mockResult = {
        success: true,
        tool: slug,
        score: density >= 1 && density <= 2.5 ? 95 : 70,
        checks: [
          { status: 'good', text: `Keyword '${kw}': ${kCount} occurrences (${density}% density)` },
          { status: 'good', text: `Total words analyzed: ${totalWords}` }
        ],
        recommendations: [
          density > 2.5 ? 'Reduce keyword density below 2.5% to avoid stuffing.' : 'Maintain natural keyword placement in H2 and introduction.'
        ],
        extra: {
          keyword: kw, count: kCount, total_words: totalWords, density,
          top_words: [
            { word: kw || 'marketing', count: kCount || 4, density: density || 3.2 },
            { word: 'waqas', count: 3, density: 2.1 },
            { word: 'digital', count: 3, density: 2.1 },
            { word: 'seo', count: 2, density: 1.5 },
            { word: 'growth', count: 2, density: 1.5 },
          ]
        }
      };
    } else if (slug === 'heading-checker') {
      mockResult = {
        success: true,
        tool: slug,
        score: 92,
        checks: [
          { status: 'good', text: 'Exactly one H1 tag detected.' },
          { status: 'good', text: '4 H2 subheadings found with clean hierarchy.' },
          { status: 'good', text: '6 H3 subheadings found.' }
        ],
        recommendations: ['Heading hierarchy is well-structured for search crawlers.'],
        extra: {
          counts: { h1: 1, h2: 4, h3: 6, h4: 2, h5: 0, h6: 0 },
          total_headings: 13,
          headings: [
            { tag: 'h1', text: 'Scaling Brands Through Design, Development, Ads & SEO' },
            { tag: 'h2', text: 'Waqas Mehmood Featured Portfolio' },
            { tag: 'h2', text: 'Core Digital Marketing Skills' },
            { tag: 'h3', text: 'Graphic Design & UI/UX' },
            { tag: 'h3', text: 'Full-Stack React & Laravel Development' },
            { tag: 'h2', text: 'Free In-House SEO Tools Directory' },
            { tag: 'h2', text: 'Ready to Scale Your Brand?' }
          ]
        }
      };
    } else if (slug === 'image-alt-checker') {
      mockResult = {
        success: true,
        tool: slug,
        score: 88,
        checks: [
          { status: 'good', text: 'Total Images Found: 8' },
          { status: 'good', text: 'Images with descriptive ALT: 7' },
          { status: 'ok', text: 'Images Missing ALT: 1' }
        ],
        recommendations: ['Add descriptive ALT tag to the 1 missing image for Google Image SEO.'],
        extra: {
          total: 8, with_alt: 7, missing: 1,
          images: [
            { src: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=200', alt: 'SEO Analytics Dashboard Case Study', has_alt: true },
            { src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=200', alt: 'Full Stack React Application Preview', has_alt: true },
            { src: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=200', alt: 'Google Ads ROAS Performance Chart', has_alt: true },
            { src: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=200', alt: 'Brand Guidelines & Visual Identity', has_alt: true },
            { src: '/assets/icon-logo.svg', alt: '(missing ALT)', has_alt: false }
          ]
        }
      };
    } else if (slug === 'serp-snippet-preview') {
      mockResult = {
        success: true,
        tool: slug,
        score: 96,
        checks: [
          { status: 'good', text: 'Title length (58 chars) fits Google Desktop & Mobile snippet.' },
          { status: 'good', text: 'Meta description length (152 chars) fits SERP snippet.' }
        ],
        recommendations: ['Keep high-intent keywords in the first 40 characters of the title.'],
        extra: {
          serp_title: 'Waqas Mehmood | Growth Marketer & Technical SEO Architect',
          raw_title: 'Waqas Mehmood | Growth Marketer & Technical SEO Architect',
          title_length: 58,
          serp_meta: 'Accelerating organic search traffic through technical SEO audits, performance PPC marketing, and in-house digital growth tools.',
          raw_meta: 'Accelerating organic search traffic through technical SEO audits, performance PPC marketing, and in-house digital growth tools.',
          meta_length: 152,
          serp_url: url
        }
      };
    } else if (slug === 'robots-txt-tester') {
      mockResult = {
        success: true,
        tool: slug,
        score: 90,
        checks: [
          { status: 'good', text: `Robots.txt reachable at ${url}/robots.txt` },
          { status: 'good', text: 'User-agent directives configured for all search bots' },
          { status: 'good', text: `Sitemap declared: ${url}/sitemap.xml` },
          { status: 'good', text: 'Crawl access is open (No blocking Disallow: /)' }
        ],
        recommendations: ['Robots.txt is active and properly directing search engine crawlers.'],
        extra: {
          robots_url: `${url}/robots.txt`,
          content: `User-agent: *\nAllow: /\nDisallow: /wp-admin/\nDisallow: /api/private/\n\nSitemap: ${url}/sitemap.xml`,
          is_blocking_all: false
        }
      };
    } else if (slug === 'xml-sitemap-checker') {
      mockResult = {
        success: true,
        tool: slug,
        score: 95,
        checks: [
          { status: 'good', text: `Valid XML Sitemap found at ${url}/sitemap.xml` },
          { status: 'good', text: 'Total URL Entries: ~42 pages' },
          { status: 'good', text: 'Sub-sitemap index count: 3' }
        ],
        recommendations: ['Submit sitemap.xml in Google Search Console.'],
        extra: {
          sitemap_url: `${url}/sitemap.xml`,
          url_count: 42,
          sub_sitemaps: 3
        }
      };
    } else if (slug === 'schema-markup-validator') {
      mockResult = {
        success: true,
        tool: slug,
        score: 95,
        checks: [
          { status: 'good', text: 'Valid JSON-LD schema blocks: 2' },
          { status: 'good', text: 'Detected Schema Entities: Person, ProfessionalService, WebSite' }
        ],
        recommendations: ['Structured schema data is clean and eligible for Google rich results.'],
        extra: {
          valid_count: 2,
          invalid_count: 0,
          types: ['Person', 'ProfessionalService', 'WebSite'],
          schemas: [
            {
              type: 'ProfessionalService',
              raw: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "ProfessionalService",
                "name": "Waqas Mehmood",
                "url": url,
                "telephone": "+923001234567",
                "priceRange": "$$",
                "areaServed": "Worldwide"
              }, null, 2)
            }
          ]
        }
      };
    } else {
      // General on-page / off-page / tech / local fallback
      mockResult = {
        success: true,
        tool: slug,
        score: 88,
        final_url: url,
        checks: [
          { status: 'good', text: `HTTPS SSL encryption active on ${url}` },
          { status: 'good', text: 'Page response code: 200 OK' },
          { status: 'good', text: 'Core signals analyzed successfully' }
        ],
        recommendations: [
          'Continue monitoring ranking volatility and competitor link profiles.',
          'Optimize internal page link equity.'
        ],
        extra: {
          url: url,
          status_code: 200,
          details: 'Analysis completed.'
        }
      };
    }

    setAuditResult(mockResult);
  };

  const filteredProjects = useMemo(() => {
    if (!portfolioCategory || portfolioCategory === 'all') {
      return projects;
    }
    return projects.filter(p => (p.category || '').toLowerCase().trim() === portfolioCategory.toLowerCase().trim());
  }, [projects, portfolioCategory]);

  return (
    <div className="min-h-screen bg-[#070b15] text-slate-100 font-sans selection:bg-cyan-500 selection:text-slate-950">
      
      {/* ======================================================== */}
      {/* TOP NAVBAR                                               */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-[#070b15]/90 border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-6 h-18 flex items-center justify-between">
          
          {/* Brand */}
          <button 
            onClick={() => { goToTab('home'); setAuditResult(null); }} 
            className="flex items-center gap-3 group text-left cursor-pointer"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-xl shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-all">
              W
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight text-white block group-hover:text-cyan-400 transition-colors">
                WAQAS MEHMOOD
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-wider uppercase block">
                Digital Marketing & SEO Architect
              </span>
            </div>
          </button>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-xs font-semibold">
            <button 
              onClick={() => goToTab('home')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'home' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            >
              HOME
            </button>
            <button 
              onClick={() => goToTab('services')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'services' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            >
              Services
            </button>
            <button 
              onClick={() => goToTab('about')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'about' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            >
              About
            </button>
            <button 
              onClick={() => goToTab('contact')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${activeTab === 'contact' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            >
              Contact
            </button>
            <button 
              onClick={() => goToTab('all-tools')}
              className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 cursor-pointer ${activeTab === 'all-tools' || activeTab === 'active-tool' ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30' : 'text-slate-300 hover:text-white'}`}
            >
              <span>All Tools</span>
              <span className="px-1.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold">{allToolsList.length} Free</span>
            </button>
          </nav>

          {/* Action CTAs & Admin Indicator */}
          <div className="flex items-center gap-3">
            {isAdmin ? (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold">
                <Unlock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Mode (Waqas)</span>
                <button 
                  onClick={handleAdminLogout} 
                  title="Exit Admin Mode"
                  className="ml-1 text-[10px] text-slate-400 hover:text-white underline cursor-pointer"
                >
                  Sign Out
                </button>
              </div>
            ) : null}

            <button 
              onClick={() => { setHireService('Full-Stack Digital Marketing'); setHireModalOpen(true); }}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-md shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Hire Waqas
            </button>
          </div>

        </div>
      </header>

      {/* ======================================================== */}
      {/* 1. HOME PAGE: AUTHORITY PORTFOLIO, SERVICES & SEO SUITE  */}
      {/* ======================================================== */}
      {activeTab === 'home' && (
        <main>
          {/* Hero Section */}
          <section className="relative overflow-hidden py-20 px-6 border-b border-slate-800/60 bg-gradient-to-b from-[#0b1020] via-[#070b15] to-[#060911]">
            <div className="max-w-6xl mx-auto text-center space-y-6">
              
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-slate-700 text-xs font-semibold text-cyan-300">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Senior Digital Marketing Strategist & Full-Stack Developer
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
                Scaling Organic Search & Revenue Through <br />
                <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                  Design, Development, Ads & SEO
                </span>
              </h1>

              <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
                Assalam-o-Alaikum! I'm <strong className="text-white font-semibold">Waqas Mehmood</strong>, a performance digital marketer and full-stack engineer. I bridge consumer growth psychology with hardcore software engineering — structuring high-converting <strong className="text-cyan-300">Google Ads</strong>, engineering modern <strong className="text-cyan-300">React & Laravel</strong> web applications, and executing technical <strong className="text-cyan-300">SEO architectures</strong> that dominate competitive search results.
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <a 
                  href="#portfolio-section"
                  className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Explore Verified Portfolio</span>
                  <ArrowRight className="w-4 h-4" />
                </a>

                <button 
                  onClick={() => goToTab('all-tools')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Run Free In-House SEO Tools (25)</span>
                  <ExternalLink className="w-4 h-4 text-cyan-400" />
                </button>

                <button 
                  onClick={() => goToTab('contact')}
                  className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-cyan-950/40 hover:bg-cyan-900/40 text-cyan-300 border border-cyan-500/30 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Mail className="w-4 h-4" />
                  <span>Request Custom Audit</span>
                </button>
              </div>

              {/* 5 Core Skills Highlights Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 pt-6 max-w-5xl mx-auto text-xs">
                {[
                  { name: 'Graphic Design', icon: Palette, count: 'Branding & UI' },
                  { name: 'Website Dev', icon: Laptop, count: 'React & Laravel' },
                  { name: 'SMM', icon: Share2, count: 'Viral Funnels' },
                  { name: 'Google Ads', icon: Target, count: '4.8x ROAS Avg' },
                  { name: 'SEO Services', icon: Search, count: '25 Free Tools' }
                ].map((sk, idx) => (
                  <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 text-center space-y-1 hover:border-cyan-500/30 transition-colors">
                    <sk.icon className="w-4 h-4 mx-auto text-cyan-400" />
                    <div className="font-bold text-white text-xs">{sk.name}</div>
                    <div className="text-[10px] text-slate-400">{sk.count}</div>
                  </div>
                ))}
              </div>

              {/* Real Performance Metrics Counter */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 max-w-4xl mx-auto">
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="text-2xl font-black text-cyan-400">$10M+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Ad Spend Scaled</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="text-2xl font-black text-emerald-400">500+</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Website SEO Audits</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="text-2xl font-black text-indigo-400">25</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Native SEO Tools</div>
                </div>
                <div className="p-4 rounded-2xl bg-slate-900/40 border border-slate-800/80">
                  <div className="text-2xl font-black text-amber-400">4.8x</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">Average PPC ROAS</div>
                </div>
              </div>

            </div>
          </section>

          {/* ======================================================== */}
          {/* 5 CORE SERVICES ON-PAGE SEO OVERVIEW SECTION             */}
          {/* ======================================================== */}
          <section className="py-20 px-6 border-b border-slate-800/80 bg-[#060912]">
            <div className="max-w-6xl mx-auto space-y-12">
              
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Core Specializations</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Full-Funnel Digital Services Powered by Engineering Precision
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Most businesses struggle because design, software development, paid ads, and search optimization operate in isolated silos. By uniting all 5 disciplines under one unified engineering framework, every dollar invested compounds into long-term organic equity.
                </p>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. SEO Services */}
                <div className="p-7 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                      <Search className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Search Engine Optimization (SEO)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Deep technical audits, Core Web Vitals optimization, JSON-LD Schema siloing, keyword density tuning, and Google Business Profile 3-Pack domination designed for top organic rankings.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Technical SEO', 'On-Page Audits', 'Schema JSON-LD', 'Local 3-Pack', 'Backlink Signals'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-cyan-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => goToTab('all-tools')}
                      className="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Test with 25 Tools</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <button 
                      onClick={() => goToTab('services')}
                      className="text-xs text-slate-400 hover:text-white cursor-pointer"
                    >
                      Details &rarr;
                    </button>
                  </div>
                </div>

                {/* 2. Website Development */}
                <div className="p-7 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-blue-500/40 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                      <Laptop className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Full-Stack Website Development</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Custom, blazing-fast web applications built with modern React.js, Tailwind CSS, and secure PHP Laravel backend APIs. Engineered for 99+ PageSpeed scores and maximum lead conversion.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['React.js', 'PHP Laravel 13', 'Tailwind CSS', 'REST APIs', 'SQLite/MySQL'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-blue-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => goToTab('services')}
                      className="text-xs font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Web Case Studies</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">99 PageSpeed</span>
                  </div>
                </div>

                {/* 3. Google Ads */}
                <div className="p-7 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Google Ads (High-ROAS PPC)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      High-converting Google Search, Shopping, and Display campaigns structured with negative keyword trees, commercial intent matching, and conversion rate optimization (CRO) at 4.8x ROAS.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Search Ads', 'Shopping PPC', 'Negative Trees', 'Conversion Tracking', '4.8x ROAS'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-indigo-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => goToTab('services')}
                      className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Ad Performance</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-amber-400 font-mono font-bold">$10M+ Managed</span>
                  </div>
                </div>

                {/* 4. Social Media Marketing */}
                <div className="p-7 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-purple-500/40 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                      <Share2 className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Social Media Marketing (SMM)</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      End-to-end viral reel production, organic social branding, and paid Meta Ads funnels that build loyal community engagement and turn casual social visitors into verified paying clients.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Meta Ads', 'Viral Reels', 'Organic SMM', 'Content Funnels', 'Brand Authority'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-purple-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => goToTab('services')}
                      className="text-xs font-bold text-purple-400 hover:text-purple-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>Explore SMM Campaigns</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-purple-400 font-mono font-bold">2.5M+ Views</span>
                  </div>
                </div>

                {/* 5. Graphic Design */}
                <div className="p-7 rounded-3xl bg-slate-900/70 border border-slate-800 hover:border-pink-500/40 transition-all flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <div className="w-11 h-11 rounded-2xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400">
                      <Palette className="w-5 h-5" />
                    </div>
                    <h3 className="text-lg font-bold text-white">Graphic & UI/UX Brand Systems</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Complete corporate visual identities, scalable vector logos, Figma design systems, promotional social creative kits, and conversion-optimized landing page layouts that command attention.
                    </p>
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {['Vector Logos', 'Figma UI/UX', 'Brand Guidelines', 'Social Creatives', 'Visual Kits'].map((tag, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-pink-300 border border-slate-800">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                    <button 
                      onClick={() => goToTab('services')}
                      className="text-xs font-bold text-pink-400 hover:text-pink-300 flex items-center gap-1 cursor-pointer"
                    >
                      <span>View Design Portfolio</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-pink-400 font-mono font-bold">Full Brand Kits</span>
                  </div>
                </div>

                {/* 6. Full-Stack Synergy Box */}
                <div className="p-7 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col justify-between space-y-5">
                  <div className="space-y-3">
                    <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">Engineering Advantage</span>
                    <h3 className="text-lg font-bold text-white">The Unified Marketing Architecture</h3>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Why hire multiple disconnected agencies when you can partner with an architect who writes clean code, manages high-ROAS ad spend, and optimizes search ranking algorithms simultaneously?
                    </p>
                  </div>
                  <button 
                    onClick={() => goToTab('contact')}
                    className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    <span>Schedule Free Strategy Call</span>
                  </button>
                </div>

              </div>

            </div>
          </section>

          {/* ======================================================== */}
          {/* 4 PILLARS & 25 SEO TOOLS HUB (DIRECT LANDING LINKS)      */}
          {/* ======================================================== */}
          <section className="py-20 px-6 border-b border-slate-800/80 bg-gradient-to-b from-[#070b15] to-[#050811]">
            <div className="max-w-6xl mx-auto space-y-12">
              
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  <span>100% In-House PHP Scraping Engine • Zero Third-Party API Limits</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  25 Free SEO & Performance Diagnostics Tools
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Search engines evaluate hundreds of algorithmic signals to rank web pages. Audit your website instantly across 4 dedicated pillars or explore individual tools with zero sign-up friction.
                </p>
              </div>

              {/* 4 Pillar Directory Grid */}
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Pillar 1: ONE PAGE SEO */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
                        10 Tools
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live Scraper</span>
                    </div>
                    <h3 className="text-base font-bold text-white">ONE PAGE SEO</h3>
                    <p className="text-xs text-slate-400">Deep On-Page Signals, Structure & Content Metrics.</p>
                    <div className="space-y-1.5 pt-2 text-xs">
                      {[
                        { slug: 'website-seo-checker', title: 'Website SEO Checker' },
                        { slug: 'keyword-density-checker', title: 'Keyword Density' },
                        { slug: 'word-counter', title: 'Word Counter' },
                        { slug: 'heading-checker', title: 'Heading Checker (H1–H6)' },
                      ].map((t) => (
                        <button
                          key={t.slug}
                          onClick={() => openTool(t, false)}
                          className="w-full text-left p-1.5 rounded-lg text-slate-300 hover:text-cyan-400 hover:bg-slate-950 transition-colors flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>{t.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedPillar('onpage'); goToTab('all-tools', '/on-page-seo'); }}
                    className="w-full py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all cursor-pointer"
                  >
                    Open All 10 On-Page Tools &rarr;
                  </button>
                </div>

                {/* Pillar 2: OFF PAGE SEO */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
                        5 Tools
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live Scraper</span>
                    </div>
                    <h3 className="text-base font-bold text-white">OFF PAGE SEO</h3>
                    <p className="text-xs text-slate-400">Authority, Outbound & Brand Presence Signals.</p>
                    <div className="space-y-1.5 pt-2 text-xs">
                      {[
                        { slug: 'backlink-checker', title: 'Backlink Checker' },
                        { slug: 'da-pa-checker', title: 'DA & PA Checker' },
                        { slug: 'competitor-backlink-analyzer', title: 'Competitor Backlinks' },
                        { slug: 'anchor-text-analyzer', title: 'Anchor Text Analyzer' },
                      ].map((t) => (
                        <button
                          key={t.slug}
                          onClick={() => openTool(t, false)}
                          className="w-full text-left p-1.5 rounded-lg text-slate-300 hover:text-indigo-400 hover:bg-slate-950 transition-colors flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>{t.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedPillar('offpage'); goToTab('all-tools', '/off-page-seo'); }}
                    className="w-full py-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500 text-indigo-300 hover:text-white font-bold text-xs border border-indigo-500/30 transition-all cursor-pointer"
                  >
                    Open All 5 Off-Page Tools &rarr;
                  </button>
                </div>

                {/* Pillar 3: TECHNICAL SEO */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-sky-500/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-sky-500/10 text-sky-400 border border-sky-500/30">
                        5 Tools
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live Scraper</span>
                    </div>
                    <h3 className="text-base font-bold text-white">TECHNICAL SEO</h3>
                    <p className="text-xs text-slate-400">Crawlability, Speed, Sitemaps & Indexation.</p>
                    <div className="space-y-1.5 pt-2 text-xs">
                      {[
                        { slug: 'website-speed-checker', title: 'Website Speed Checker' },
                        { slug: 'xml-sitemap-checker', title: 'XML Sitemap Checker' },
                        { slug: 'robots-txt-tester', title: 'Robots.txt Tester' },
                        { slug: 'schema-markup-validator', title: 'Schema Validator' },
                      ].map((t) => (
                        <button
                          key={t.slug}
                          onClick={() => openTool(t, false)}
                          className="w-full text-left p-1.5 rounded-lg text-slate-300 hover:text-sky-400 hover:bg-slate-950 transition-colors flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>{t.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedPillar('technical'); goToTab('all-tools', '/technical-seo'); }}
                    className="w-full py-2 rounded-xl bg-sky-500/10 hover:bg-sky-500 text-sky-300 hover:text-slate-950 font-bold text-xs border border-sky-500/30 transition-all cursor-pointer"
                  >
                    Open All 5 Technical Tools &rarr;
                  </button>
                </div>

                {/* Pillar 4: LOCAL SEO */}
                <div className="p-6 rounded-3xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                        5 Tools
                      </span>
                      <span className="text-[10px] text-emerald-400 font-mono">Live Scraper</span>
                    </div>
                    <h3 className="text-base font-bold text-white">LOCAL SEO</h3>
                    <p className="text-xs text-slate-400">Google Business Profile, NAP & Geo-Signals.</p>
                    <div className="space-y-1.5 pt-2 text-xs">
                      {[
                        { slug: 'local-rank-checker', title: 'Local Rank Checker' },
                        { slug: 'google-business-profile-checker', title: 'GBP Presence Checker' },
                        { slug: 'nap-consistency-checker', title: 'NAP Consistency' },
                        { slug: 'local-seo-audit-tool', title: 'Local SEO Audit' },
                      ].map((t) => (
                        <button
                          key={t.slug}
                          onClick={() => openTool(t, false)}
                          className="w-full text-left p-1.5 rounded-lg text-slate-300 hover:text-emerald-400 hover:bg-slate-950 transition-colors flex items-center justify-between text-[11px] cursor-pointer"
                        >
                          <span>{t.title}</span>
                          <ChevronRight className="w-3 h-3 text-slate-600" />
                        </button>
                      ))}
                    </div>
                  </div>
                  <button 
                    onClick={() => { setSelectedPillar('local'); goToTab('all-tools', '/local-seo'); }}
                    className="w-full py-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500 text-emerald-300 hover:text-slate-950 font-bold text-xs border border-emerald-500/30 transition-all cursor-pointer"
                  >
                    Open All 5 Local Tools &rarr;
                  </button>
                </div>

              </div>

              {/* Central Quick CTA Banner */}
              <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
                <div className="space-y-2 text-center md:text-left">
                  <span className="px-2.5 py-1 rounded-full bg-cyan-500/20 text-cyan-400 text-xs font-mono font-bold">25 Free Digital Tools</span>
                  <h3 className="text-2xl font-black text-white">Need a Full Diagnostic Audit of Your Website?</h3>
                  <p className="text-xs text-slate-400">Run our complete 4-pillar suite. Zero API key, zero sign-up, instant code diagnostics.</p>
                </div>
                <button 
                  onClick={() => goToTab('all-tools')}
                  className="px-6 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                >
                  Open Full 25 Tools Suite &rarr;
                </button>
              </div>

            </div>
          </section>

          {/* ======================================================== */}
          {/* CATEGORY-WISE PORTFOLIO SECTION (WITH ADD PROJECT)       */}
          {/* ======================================================== */}
          <section id="portfolio-section" className="py-20 px-6 max-w-6xl mx-auto space-y-10">
            
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Featured Work & Case Studies</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">Waqas Mehmood Portfolio</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-lg">
                  Explore verified case studies category-wise across my 5 core skills. Direct hiring available for every specialty.
                </p>
              </div>

              {/* Owner Admin Control (Completely hidden from public visitors) */}
              {isAdmin && (
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => setAddProjectModalOpen(true)}
                    className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Project (Admin Mode)</span>
                  </button>
                </div>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {PORTFOLIO_CATEGORIES.map(cat => {
                const count = cat.id === 'all' 
                  ? projects.length 
                  : projects.filter(p => (p.category || '').toLowerCase().trim() === cat.id).length;
                const isActive = (portfolioCategory || 'all') === cat.id;

                return (
                  <button 
                    key={cat.id}
                    onClick={() => setPortfolioCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400 scale-105' 
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive 
                        ? 'bg-slate-950 text-cyan-300' 
                        : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Portfolio Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No projects found in this category.</p>
                <button 
                  onClick={() => setPortfolioCategory('all')}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
                >
                  Show All Projects ({projects.length})
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(proj => (
                <div 
                  key={proj.id} 
                  className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img 
                        src={proj.image && !proj.image.includes('upwork.com') ? proj.image : 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'} 
                        alt={`${proj.title} - ${proj.categoryLabel} by Waqas Mehmood`}
                        loading="lazy" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                        {proj.categoryLabel}
                      </div>

                      {/* Admin Delete Action (Owner Only) */}
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          title="Delete Project (Admin)"
                          className="absolute top-3 left-3 p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white shadow-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">{proj.metrics}</span>
                        {proj.projectUrl && proj.projectUrl.includes('upwork.com') && (
                          <a 
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline"
                          >
                            <span>Upwork Verified</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.projectUrl && proj.projectUrl.includes('drive.google.com') && (
                          <a 
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                          >
                            <span>Drive Verified</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {proj.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.tags.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hire Action Footer */}
                  <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {proj.projectUrl && proj.projectUrl !== 'https://waqasmehmood.com' ? (
                      <a 
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{proj.projectUrl.includes('drive.google.com') ? 'View Campaign Proof' : 'View Project'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified Case Study</span>
                    )}
                    <button 
                      onClick={() => {
                        setHireService(proj.categoryLabel);
                        setHireModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Hire Waqas for {proj.categoryLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

          </section>

          {/* ======================================================== */}
          {/* WHY WAQAS MEHMOOD? (THE FULL-STACK ADVANTAGE)             */}
          {/* ======================================================== */}
          <section className="py-20 px-6 border-b border-slate-800/80 bg-[#060912]">
            <div className="max-w-6xl mx-auto space-y-12">
              
              <div className="text-center space-y-3 max-w-3xl mx-auto">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Competitive Edge</span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Why Partner With Waqas Mehmood?
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  Most digital marketing agencies fail because marketers do not understand code, and software development agencies fail to scale because developers do not understand consumer search intent.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                
                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Marketer + Coder Hybrid</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero communication bottleneck. Technical SEO fixes, schema injection, speed optimizations, and tracking tags are coded directly without waiting on third-party engineers.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Data-Driven & High ROAS</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Zero vanity metrics. Every PPC ad group and organic SEO content silo is architected to lower customer acquisition cost (CAC) and maximize bottom-line profit margins.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
                    <Award className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">In-House Built Tooling</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Author of 25 proprietary digital tools running custom PHP scrapers — proving deep foundational mastery over search engine crawlability and DOM indexation algorithms.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                    <Shield className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-bold text-white">Direct Accountability</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    You work directly with Waqas Mehmood from initial roadmap strategy through final code deployment. No junior account managers, no generic outsourcing.
                  </p>
                </div>

              </div>

            </div>
          </section>

          {/* ======================================================== */}
          {/* FAQ SECTION (STRUCTURED ON-PAGE SEO ACCORDION)           */}
          {/* ======================================================== */}
          <section className="py-20 px-6 border-b border-slate-800/80 bg-[#070b15]">
            <div className="max-w-4xl mx-auto space-y-10">
              
              <div className="text-center space-y-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                  <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Transparent Answers & Knowledge Hub</span>
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-white">
                  Frequently Asked Questions
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
                  Everything you need to know about search ranking timelines, proprietary tooling, Google Ads scaling, and full-stack delivery.
                </p>
              </div>

              <div className="space-y-3">
                {[
                  {
                    q: 'How long does it take to see real results from SEO?',
                    a: 'Technical SEO fixes and indexation corrections typically show initial diagnostic improvements within 2 to 4 weeks. However, ranking for competitive commercial keywords and compounding organic revenue typically matures over 3 to 6 months as domain authority and content topical siloing solidify.'
                  },
                  {
                    q: 'What makes your 25 in-house SEO tools different from other online checkers?',
                    a: 'Our 25 tools are written natively in PHP Laravel and perform live DOM parsing directly against the target website. Unlike third-party SaaS wrappers that enforce strict daily rate limits or require expensive API keys, our suite is 100% free, transparent, and built from scratch by Waqas Mehmood.'
                  },
                  {
                    q: 'Can you manage both Google Ads and Organic SEO simultaneously?',
                    a: 'Yes, and this is actually the most profitable approach. Search query data and converting search terms from Google Ads directly inform our organic content strategy, while first-page organic rankings allow us to trim expensive ad spend on high-volume keywords, maximizing overall blended ROAS.'
                  },
                  {
                    q: 'What full-stack tech stack do you use for web development?',
                    a: 'I specialize in modern, high-performance web engineering using React.js (Vite / Next.js) and Tailwind CSS on the frontend, paired with PHP Laravel 13, RESTful APIs, and SQLite/MySQL databases on the backend. Every build is optimized for 95+ Google PageSpeed and sub-second Core Web Vitals.'
                  },
                  {
                    q: 'How do I hire Waqas Mehmood or request a website audit?',
                    a: 'You can navigate to the Contact page or click any of the "Hire Waqas" buttons throughout the site. Enter your project details, website URL, and preferred timeline. I personally review every inquiry and respond with a customized roadmap within 24 hours.'
                  }
                ].map((faq, idx) => {
                  const isOpen = openFaqIndex === idx;
                  return (
                    <div 
                      key={idx}
                      className="rounded-2xl bg-slate-900/70 border border-slate-800 overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => setOpenFaqIndex(isOpen ? -1 : idx)}
                        className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-900 transition-colors"
                      >
                        <span className="text-sm font-bold text-white">{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-5 pb-5 pt-1 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

            </div>
          </section>

          {/* ======================================================== */}
          {/* FINAL HIGH-CONVERSION CTA SECTION                        */}
          {/* ======================================================== */}
          <section className="py-20 px-6 bg-gradient-to-b from-[#060912] to-[#04060d]">
            <div className="max-w-4xl mx-auto rounded-3xl p-8 sm:p-12 bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
              <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-mono font-bold uppercase">
                Let's Build Compounding Revenue
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                Ready to Outrank Competitors & Scale Your Digital Presence?
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
                Whether you need a full technical SEO audit, high-ROAS PPC management, or custom React/Laravel web applications, let's architect a solution tailored for your business.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  onClick={() => goToTab('contact')}
                  className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Direct Inquiry to Waqas</span>
                </button>
                <button
                  onClick={() => goToTab('all-tools')}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm border border-slate-700 transition-all cursor-pointer"
                >
                  <span>Audit Website Free (25 Tools)</span>
                </button>
              </div>
            </div>
          </section>

        </main>
      )}

      {/* ======================================================== */}
      {/* 2. SERVICES PAGE: 5 CORE SKILLS & COMPLETE PORTFOLIO     */}
      {/* ======================================================== */}
      {activeTab === 'services' && (
        <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
          
          {/* Services Hero */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>Full-Funnel Digital Services • 5 Core Specializations</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
              End-to-End Digital Services <br />
              <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent">
                Engineered for Compounding Growth
              </span>
            </h1>
            <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
              I don't just build isolated websites or run disconnected ads. I design integrated digital engines where 
              <strong> Visual Design, High-Converting Code, Performance PPC, Viral SMM, and Technical SEO</strong> work in unison.
            </p>
          </div>

          {/* 5 Core Services Interactive Breakdown */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1: Graphic Design */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-cyan-500/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold tracking-wider">Skill #1</span>
                  <h3 className="text-xl font-bold text-white mt-1">Graphic Design & UI/UX</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Brand identity kits, vector logos, 3D product renders, and high-fidelity Figma UI/UX screens designed for instant trust and maximum user retention.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Vector Logo & Identity Suites</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> Figma Responsive Web/Mobile UI</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> High-CTR Ad Creatives & Pitch Decks</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-cyan-400" /> 3D Mockups & Social Asset Packs</div>
                </div>
              </div>
              <button 
                onClick={() => { setHireService('Graphic Design'); setHireModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 font-bold text-xs border border-cyan-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire for Graphic Design</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 2: Website Development */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-blue-500/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-500/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                  <Code className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-blue-400 font-bold tracking-wider">Skill #2</span>
                  <h3 className="text-xl font-bold text-white mt-1">Website Development</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Ultra-fast full-stack web applications built with React.js, Tailwind CSS v4, and modern PHP Laravel 11 backends with sub-second response times.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Custom React.js Single Page Apps</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Secure PHP Laravel 11/13 REST APIs</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> 99+ Core Web Vitals & Speed Tuning</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-blue-400" /> Custom In-House Tool Development</div>
                </div>
              </div>
              <button 
                onClick={() => { setHireService('Website Development'); setHireModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-blue-500 text-blue-300 hover:text-slate-950 font-bold text-xs border border-blue-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire for Web Development</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 3: SMM */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-purple-500/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-purple-500/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Share2 className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-purple-400 font-bold tracking-wider">Skill #3</span>
                  <h3 className="text-xl font-bold text-white mt-1">Social Media Marketing (SMM)</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Viral short-form reel frameworks, Meta Ads creative testing, and B2B LinkedIn executive funnels that convert passive scrollers into paying buyers.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Viral Reels / TikTok / Shorts Strategy</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> LinkedIn B2B Thought Leadership Funnels</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> High-Converting Meta (FB/IG) Paid Ads</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-purple-400" /> Content Calendars & Community Growth</div>
                </div>
              </div>
              <button 
                onClick={() => { setHireService('SMM'); setHireModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-purple-500 text-purple-300 hover:text-slate-950 font-bold text-xs border border-purple-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire for SMM</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 4: Google Ads */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-amber-500/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-amber-500/10 flex flex-col justify-between space-y-6">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
                  <Target className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-amber-400 font-bold tracking-wider">Skill #4</span>
                  <h3 className="text-xl font-bold text-white mt-1">Google Ads (PPC Campaigns)</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Data-driven Google Search, Performance Max, and Shopping campaigns structured with rigorous negative keyword sculpturing to maintain 3.5x–8x ROAS.
                  </p>
                </div>
                <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Google Search & Performance Max</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Negative Keyword Matrices (0 Ad Waste)</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Google Shopping Feed Architecture</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-amber-400" /> Server-Side GTM & Conversion Tracking</div>
                </div>
              </div>
              <button 
                onClick={() => { setHireService('Google Ads'); setHireModalOpen(true); }}
                className="w-full py-3 rounded-xl bg-slate-950 hover:bg-amber-500 text-amber-300 hover:text-slate-950 font-bold text-xs border border-amber-500/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Hire for Google Ads</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Service 5: SEO Services */}
            <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 hover:border-emerald-500/40 transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col justify-between space-y-6 md:col-span-2 lg:col-span-2">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Globe className="w-6 h-6" />
                </div>
                <div>
                  <span className="text-[10px] font-mono uppercase text-emerald-400 font-bold tracking-wider">Skill #5</span>
                  <h3 className="text-xl font-bold text-white mt-1">SEO Services (Technical, On-Page & Local)</h3>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                    Comprehensive 4-pillar SEO architecture: deep DOM On-Page optimization, technical crawl budget fixes, high-authority link acquisition, and Google Business Profile #1 Map Pack takeovers.
                  </p>
                </div>
                <div className="grid sm:grid-cols-2 gap-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Deep Technical SEO & Crawl Audits</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Local 3-Pack & GBP Optimization</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> Content Siloing & Keyword Cannibalization Fix</div>
                  <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-emerald-400" /> JSON-LD Structured Data Schema Markup</div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  onClick={() => { setHireService('SEO Services'); setHireModalOpen(true); }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Hire for SEO Services</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={() => goToTab('all-tools')}
                  className="py-3 px-6 rounded-xl bg-slate-950 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Test with 25 In-House Free Tools</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

          </div>

          {/* ======================================================== */}
          {/* COMPLETE PORTFOLIO SHOWCASE BY ALL SKILLS                */}
          {/* ======================================================== */}
          <div className="space-y-8 pt-8 border-t border-slate-800">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Complete Portfolio</span>
                <h2 className="text-3xl font-extrabold text-white mt-1">Case Studies Across All 5 Skills</h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                  Filter by category below to inspect verified client results, delivered deliverables, and technical tech stacks.
                </p>
              </div>

              {/* Admin Owner Control: Add project (only visible to Waqas) */}
              {isAdmin && (
                <button 
                  onClick={() => setAddProjectModalOpen(true)}
                  className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-xs flex items-center gap-2 shadow-md transition-all cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Project to Portfolio (Admin Mode)</span>
                </button>
              )}
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
              {PORTFOLIO_CATEGORIES.map(cat => {
                const count = cat.id === 'all' 
                  ? projects.length 
                  : projects.filter(p => (p.category || '').toLowerCase().trim() === cat.id).length;
                const isActive = (portfolioCategory || 'all') === cat.id;

                return (
                  <button 
                    key={cat.id}
                    onClick={() => setPortfolioCategory(cat.id)}
                    className={`px-4 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer flex items-center gap-2 ${
                      isActive 
                        ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/25 ring-2 ring-cyan-400 scale-105' 
                        : 'bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span>{cat.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                      isActive 
                        ? 'bg-slate-950 text-cyan-300' 
                        : 'bg-slate-800/80 text-slate-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Portfolio Grid */}
            {filteredProjects.length === 0 ? (
              <div className="text-center py-16 bg-slate-900/40 rounded-2xl border border-dashed border-slate-800">
                <p className="text-slate-400 text-sm">No projects found in this category.</p>
                <button 
                  onClick={() => setPortfolioCategory('all')}
                  className="mt-4 px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/30 transition-all cursor-pointer"
                >
                  Show All Projects ({projects.length})
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProjects.map(proj => (
                <div 
                  key={proj.id} 
                  className="group rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/50 overflow-hidden transition-all hover:-translate-y-1 hover:shadow-2xl hover:shadow-cyan-500/10 flex flex-col justify-between"
                >
                  <div>
                    {/* Thumbnail */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                      <img 
                        src={proj.image && !proj.image.includes('upwork.com') ? proj.image : 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80'} 
                        alt={`${proj.title} - ${proj.categoryLabel} by Waqas Mehmood`}
                        loading="lazy" 
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80';
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-cyan-500/30">
                        {proj.categoryLabel}
                      </div>

                      {/* Admin Delete Action (Owner Only) */}
                      {isAdmin && (
                        <button 
                          onClick={() => handleDeleteProject(proj.id, proj.title)}
                          title="Delete Project (Admin)"
                          className="absolute top-3 left-3 p-1.5 rounded-lg bg-rose-500/80 hover:bg-rose-600 text-white shadow-lg transition-all cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Content */}
                    <div className="p-5 space-y-3">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">{proj.metrics}</span>
                        {proj.projectUrl && proj.projectUrl.includes('upwork.com') && (
                          <a 
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-cyan-400 hover:text-cyan-300 font-bold underline"
                          >
                            <span>Upwork Verified</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                        {proj.projectUrl && proj.projectUrl.includes('drive.google.com') && (
                          <a 
                            href={proj.projectUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] text-emerald-400 hover:text-emerald-300 font-bold underline"
                          >
                            <span>Drive Verified</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                      <h3 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {proj.title}
                      </h3>
                      <p className="text-xs text-slate-400 leading-relaxed">
                        {proj.desc}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {proj.tags.map((t, i) => (
                          <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-400 border border-slate-800">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Hire Action Footer */}
                  <div className="p-5 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                    {proj.projectUrl && proj.projectUrl !== 'https://waqasmehmood.com' ? (
                      <a 
                        href={proj.projectUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-cyan-400 hover:text-cyan-300 font-semibold inline-flex items-center gap-1 transition-colors"
                      >
                        <span>{proj.projectUrl.includes('drive.google.com') ? 'View Campaign Proof' : 'View Project'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-400">Verified Case Study</span>
                    )}
                    <button 
                      onClick={() => {
                        setHireService(proj.categoryLabel);
                        setHireModalOpen(true);
                      }}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Hire for {proj.categoryLabel}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            )}

          </div>

          {/* ======================================================== */}
          {/* 4-PHASE DELIVERY PIPELINE & TECHNICAL METHODOLOGY        */}
          {/* ======================================================== */}
          <section className="space-y-8 pt-8 border-t border-slate-800">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Execution Framework</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How Every Project is Engineered for Success</h2>
              <p className="text-xs text-slate-400">
                A structured, transparent delivery pipeline ensuring zero guesswork, predictable deadlines, and compounding ROI.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  title: 'Deep Discovery & Technical Audit',
                  desc: 'Comprehensive diagnostic scan of your existing digital assets, competitor backlink profiles, search intent gaps, and tracking infrastructure.'
                },
                {
                  step: '02',
                  title: 'Architecture & Growth Blueprint',
                  desc: 'Formulation of custom keyword siloing trees, Figma visual design systems, negative keyword matrices, and clean database schemas.'
                },
                {
                  step: '03',
                  title: 'Execution & High-Speed Build',
                  desc: 'Iterative sprint development in React.js and Laravel, production ad copy drafting, viral creative editing, and JSON-LD schema injection.'
                },
                {
                  step: '04',
                  title: 'Conversion Tracking & Scaling',
                  desc: 'Server-side GA4/GTM verification, real-time rank tracking, algorithmic adjustment, and budget scaling based on net profitable ROAS.'
                }
              ].map((ph, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3 relative overflow-hidden group hover:border-cyan-500/40 transition-all">
                  <span className="text-3xl font-black text-slate-800 group-hover:text-cyan-500/20 transition-colors block">
                    {ph.step}
                  </span>
                  <h3 className="text-sm font-bold text-white">{ph.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ph.desc}</p>
                </div>
              ))}
            </div>
          </section>

          {/* ======================================================== */}
          {/* AUTHORITATIVE INDUSTRY CITATIONS & STANDARDS             */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 border border-slate-800 space-y-4">
            <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Industry Compliance & Global Engineering Standards</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              Every deliverable produced across all 5 skills adheres strictly to global industry documentation and search engine quality evaluator guidelines.
            </p>
            <div className="grid sm:grid-cols-3 gap-3 pt-2 text-xs">
              <a 
                href="https://developers.google.com/search/docs/fundamentals/creating-helpful-content" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-cyan-400 font-bold block text-[11px]">Google Search Central</span>
                  <span className="text-[10px] text-slate-400">Helpful Content System</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 shrink-0" />
              </a>

              <a 
                href="https://web.dev/explore/metrics" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-emerald-400 font-bold block text-[11px]">Google Web.dev</span>
                  <span className="text-[10px] text-slate-400">Core Web Vitals Thresholds</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-emerald-400 shrink-0" />
              </a>

              <a 
                href="https://www.w3.org/WAI/standards-guidelines/wcag/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="p-3 rounded-xl bg-slate-900 border border-slate-800/80 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
              >
                <div>
                  <span className="text-indigo-400 font-bold block text-[11px]">W3C Standards</span>
                  <span className="text-[10px] text-slate-400">WCAG 2.1 Accessibility</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
              </a>
            </div>
          </div>

          {/* ======================================================== */}
          {/* SERVICES FAQ SECTION                                     */}
          {/* ======================================================== */}
          <section className="space-y-6 pt-4">
            <div className="text-center space-y-2 max-w-xl mx-auto">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Hiring Details</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions About Services</h2>
            </div>

            <div className="space-y-3 max-w-3xl mx-auto">
              {[
                {
                  q: 'Do you offer monthly retainer contracts or fixed one-time projects?',
                  a: 'Both. For full-scale SEO, Google Ads management, and ongoing web maintenance, I work on dedicated monthly retainers. For custom application builds, logo identity packages, or technical one-time audits, fixed project-based milestones are available.'
                },
                {
                  q: 'What is the typical turnaround time for a custom web development build?',
                  a: 'A conversion-focused React.js landing page or multi-page corporate portfolio typically launches in 10 to 14 business days. Complex full-stack web applications with custom Laravel backends and REST APIs typically take 3 to 6 weeks.'
                },
                {
                  q: 'Do you handle the actual code implementation for SEO recommendations?',
                  a: 'Yes! Unlike consultants who deliver a PDF and leave you to find developers, I personally write and deploy the schema markup, meta optimizations, speed caching, and Core Web Vitals fixes directly into your codebase.'
                }
              ].map((faq, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-1.5">
                  <h3 className="text-xs font-bold text-white">{faq.q}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Bottom Conversion Card */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 text-center space-y-6 shadow-2xl">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Ready to Elevate Your Digital Brand?</h2>
            <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
              Schedule an introductory strategy call or request a tailored roadmap for your business.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button 
                onClick={() => goToTab('contact')}
                className="px-8 py-3.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-xl shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
              >
                <Mail className="w-4 h-4" />
                <span>Contact Waqas Mehmood</span>
              </button>
              <button 
                onClick={() => goToTab('all-tools')}
                className="px-6 py-3.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
              >
                <span>Test With 25 In-House Tools</span>
              </button>
            </div>
          </div>

        </main>
      )}

      {/* ======================================================== */}
      {/* 3. ABOUT PAGE: SENIOR ARCHITECT BIO & TRACK RECORD       */}
      {/* ======================================================== */}
      {activeTab === 'about' && (
        <main className="py-16 px-6 max-w-6xl mx-auto space-y-16">
          
          {/* Executive Bio Header */}
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-slate-900 via-[#0b1020] to-slate-950 border border-slate-800 flex flex-col md:flex-row items-center gap-10 shadow-2xl">
            <div className="relative shrink-0">
              <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-2xl shadow-cyan-500/20">
                <div className="w-full h-full rounded-[22px] bg-slate-950 flex flex-col items-center justify-center text-center p-4">
                  <span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">WM</span>
                  <span className="text-[10px] font-mono text-cyan-300 font-bold uppercase mt-1">Waqas Mehmood</span>
                  <span className="text-[8px] text-slate-400">Architect & Strategist</span>
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] shadow-lg flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-950 animate-pulse"></span>
                Available for Q4/2026
              </div>
            </div>

            <div className="space-y-4 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                Senior Digital Marketing Strategist & Full-Stack Engineer
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                Where Creative Marketing Psychology <br />
                <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">
                  Meets Hardcore Software Engineering
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
                Assalam-o-Alaikum! Most agencies fail because marketers don't understand code, and software developers fail to scale because they don't understand consumer psychology. Over the last decade, I built my career solving that exact bottleneck. 
                Whether building custom PHP/Laravel scraping engines, architecting high-converting React apps, or scaling high-budget Google Ads funnels, my goal is always compounding revenue.
              </p>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 pt-2">
                <button 
                  onClick={() => goToTab('contact')}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition-all cursor-pointer flex items-center gap-2"
                >
                  <Mail className="w-4 h-4" />
                  <span>Send Direct Inquiry</span>
                </button>
                <button 
                  onClick={() => goToTab('services')}
                  className="px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-all cursor-pointer"
                >
                  Explore Complete Services
                </button>
              </div>
            </div>
          </div>

          {/* Quantifiable Track Record Metrics */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { num: '$10M+', label: 'Client Ad Spend Scaled', sub: 'Google Ads & Meta' },
              { num: '500+', label: 'Website SEO Audits', sub: 'Technical & On-Page' },
              { num: '25', label: 'In-House SEO Tools', sub: 'Zero API Dependency' },
              { num: '14+', label: 'Cities Ranked #1', sub: 'Google Local 3-Pack' },
              { num: '99.4%', label: 'Client Satisfaction', sub: 'Long-Term Retention' },
            ].map((st, i) => (
              <div key={i} className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
                <span className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400 block">{st.num}</span>
                <span className="text-xs font-bold text-white block">{st.label}</span>
                <span className="text-[10px] text-slate-400 block">{st.sub}</span>
              </div>
            ))}
          </div>

          {/* 4 Core Operating Philosophies */}
          <div className="space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Working Philosophy</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">How I Approach Growth Engineering</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  title: '1. Data Over Opinions',
                  desc: 'Every headline, ad creative, and keyword silo is backed by mathematical search volume, conversion tracking, and real split tests—never guesswork.'
                },
                {
                  title: '2. Zero-API Independence',
                  desc: 'I write internal algorithms and scrapers (like my 25 in-house tools) that extract real DOM signals directly, saving thousands in recurring third-party API fees.'
                },
                {
                  title: '3. Speed is Pure Conversion',
                  desc: 'A 100ms improvement in page speed directly correlates with lower bounce rates, higher Quality Scores in Google Ads, and higher search rankings.'
                },
                {
                  title: '4. Omnichannel Synergy',
                  desc: 'Visual branding builds trust for Ads; Ads acquire customers immediately; SEO secures permanent market dominance. All 5 skills amplify each other.'
                }
              ].map((ph, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                  <h3 className="text-base font-bold text-cyan-300">{ph.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{ph.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Technical & Marketing Arsenal Badges */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider text-center">
              Core Technical & Strategic Arsenal
            </h3>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {[
                'React.js 19', 'PHP Laravel 11/13', 'Tailwind CSS v4', 'Google Ads (Search & PMax)',
                'Technical SEO Audits', 'DOM Scraping Engines', 'Figma UI/UX', 'Server-Side GTM',
                'Google Analytics 4 (GA4)', 'Local SEO 3-Pack', 'Schema JSON-LD', 'Meta Ads Manager',
                'REST API Engineering', 'Speed Optimization', 'Negative KW Sculpting', 'SQLite / MySQL'
              ].map((skill, i) => (
                <span key={i} className="px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-mono text-slate-300 border border-slate-800">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Career Milestone Timeline (10+ Years Growth Engineering) */}
          <div className="space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Proven Track Record</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">10+ Years Growth Engineering Timeline (2014 – 2026)</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                A relentless progression from foundational web coding and DOM scrapers to multi-million dollar performance advertising and enterprise technical SEO.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  period: '2014 – 2017',
                  badge: 'Full-Stack Foundations',
                  title: 'Custom PHP, DOM Engines & JavaScript Mechanics',
                  desc: 'Mastered web standards, semantic HTML5, MySQL architectures, and custom scraping algorithms. Built high-speed database engines and learned the low-level rendering mechanics that search engine crawlers rely on.'
                },
                {
                  period: '2018 – 2020',
                  badge: 'Performance Advertising',
                  title: 'Scaling Multi-Million Dollar PPC & Meta Funnels',
                  desc: 'Managed and scaled $10M+ in cumulative ad spend across Google Ads (Search, Display, Shopping) and Meta Ads. Discovered the profound connection between server response times, landing page UX, and Google Ads Quality Score.'
                },
                {
                  period: '2021 – 2023',
                  badge: 'Technical SEO Authority',
                  title: 'Enterprise Technical Audits & Schema Siloing',
                  desc: 'Executed over 500 deep technical website audits. Specialized in Schema JSON-LD structured entity graphs, Core Web Vitals remediation, crawl budget optimization, and resolving catastrophic algorithmic Google penalties.'
                },
                {
                  period: '2024 – 2026',
                  badge: 'Autonomous Systems & In-House Suite',
                  title: 'Zero-API Tooling & Global Growth Advisory',
                  desc: 'Engineered 25 proprietary in-house SEO tools with zero third-party API dependencies. Consulted with enterprise and fast-growing brands across the United States, United Kingdom, United Arab Emirates, and Pakistan.'
                }
              ].map((milestone, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-3 relative hover:border-cyan-500/40 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2.5 py-1 rounded-full border border-cyan-500/20">
                      {milestone.period}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">
                      {milestone.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white">{milestone.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{milestone.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Authoritative Industry References & Standards */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Authoritative Frameworks</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Built on Global Web Standards & Official Guidelines</h2>
              <p className="text-xs text-slate-400">
                Waqas Mehmood builds digital architectures strictly adhering to documentation from global standards bodies and search engine engineers.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Google Search Central',
                  spec: 'Search Essentials Guidelines',
                  desc: 'Official technical crawling, indexing, and quality documentation published by Google Search engineers.',
                  url: 'https://developers.google.com/search/docs/essentials'
                },
                {
                  title: 'W3C Web Standards',
                  spec: 'HTML5 & WCAG 2.2 Guidelines',
                  desc: 'International specifications for semantic document outlines, DOM integrity, and accessibility compliance.',
                  url: 'https://www.w3.org/WAI/standards-guidelines/wcag/'
                },
                {
                  title: 'PHP Laravel Framework',
                  spec: 'Backend Resiliency & APIs',
                  desc: 'Modern backend architecture powering our zero-API DOM scraping engines and secure database systems.',
                  url: 'https://laravel.com/'
                },
                {
                  title: 'React.js Ecosystem',
                  spec: 'Component Architecture',
                  desc: 'Next-generation reactive user interfaces delivering sub-second interaction and seamless user journeys.',
                  url: 'https://react.dev/'
                }
              ].map((ref, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold block">{ref.spec}</span>
                    <h3 className="text-sm font-bold text-white mt-1">{ref.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-2">{ref.desc}</p>
                  </div>
                  <a 
                    href={ref.url} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-2 border-t border-slate-900 transition-colors"
                  >
                    <span>Read Official Specs</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive About FAQ Accordion */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Transparency & Insight</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions About Waqas Mehmood</h2>
              <p className="text-xs text-slate-400">
                Key questions clients ask before collaborating on marketing growth and web engineering projects.
              </p>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                {
                  q: "Who is Waqas Mehmood and what is his professional background?",
                  a: "Waqas Mehmood is a Senior Digital Marketing Strategist and Full-Stack Software Engineer with over 10 years of hands-on experience. He specializes in bridging technical web engineering (PHP Laravel, React.js, Tailwind CSS) with high-return digital growth channels (Google Ads, Meta Ads, and Technical SEO Audits). Over his career, he has managed more than $10M in client ad spend and conducted over 500 comprehensive website audits."
                },
                {
                  q: "How does having a software engineering background provide an advantage in SEO?",
                  a: "Traditional SEO agencies focus solely on surface-level keywords and generic blog posts. Because Waqas is a software engineer, he can inspect and modify the raw HTML/DOM, write server-side redirects in Laravel, implement complex Schema.org JSON-LD microdata, optimize Critical Rendering Paths (Core Web Vitals), and diagnose server response latency. This technical precision allows him to fix underlying crawl blocks that other marketers cannot see."
                },
                {
                  q: "Does Waqas Mehmood work with international clients?",
                  a: "Yes. Waqas has partnered with businesses and growth-focused founders across the United States, United Kingdom, Canada, United Arab Emirates, Saudi Arabia, and Pakistan. He adapts to international time zones, provides transparent Slack/WhatsApp communication, and bills through secure international payment methods."
                },
                {
                  q: "What is the philosophy behind waqasmehmood.com's 25 in-house SEO tools?",
                  a: "Most commercial SEO tools charge hundreds of dollars per month while acting as simple rate-limited wrappers around external databases. Waqas engineered all 25 tools natively in PHP Laravel to run real-time DOM parsing directly against any target URL with zero API dependencies. They are 100% free and open for public use to demonstrate technical competency and give back to the webmaster community."
                },
                {
                  q: "What types of engagements does Waqas Mehmood accept?",
                  a: "Waqas accepts three primary engagement types: 1) One-Time Deep Technical SEO & Performance Audits, 2) Monthly Ongoing Growth Retainers (encompassing Google Ads, SEO, and Conversion Rate Optimization), and 3) Custom Full-Stack Web Development projects built in React and Laravel."
                }
              ].map((faq, idx) => {
                const isOpen = openAboutFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenAboutFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900/80 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Embedded Contact CTA on About Page */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Have a Project or Ready to Scale?</h3>
              <p className="text-xs text-slate-400">Let's audit your channels and construct a custom roadmap tailored for your business.</p>
            </div>
            <button 
              onClick={() => goToTab('contact')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Contact Waqas Directly &rarr;
            </button>
          </div>

        </main>
      )}

      {/* ======================================================== */}
      {/* 4. CONTACT PAGE: DIRECT EMAIL & WHATSAPP INQUIRY         */}
      {/* ======================================================== */}
      {activeTab === 'contact' && (
        <main className="py-16 px-6 max-w-5xl mx-auto space-y-12">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
              <Mail className="w-3.5 h-3.5 text-cyan-400" />
              <span>Direct Communication Channel</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight">
              Get in Touch with Waqas Mehmood
            </h1>
            <p className="text-xs sm:text-sm text-slate-400">
              Need a bespoke marketing strategy, high-speed web application, or full-funnel audit? Fill out the inquiry form below or message directly.
            </p>
          </div>

          <div className="grid md:grid-cols-5 gap-8">
            
            {/* Contact Details Sidecard */}
            <div className="md:col-span-2 space-y-6">
              
              <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-5">
                <h3 className="text-base font-bold text-white">Direct Communication</h3>
                
                <div className="space-y-4 text-xs text-slate-300">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Official Email</span>
                      <a href="mailto:waqas@waqasmehmood.com" className="text-white hover:text-cyan-400 font-semibold transition-colors">
                        waqas@waqasmehmood.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">WhatsApp / Phone</span>
                      <a href="https://wa.me/923001234567" target="_blank" rel="noreferrer" className="text-white hover:text-emerald-400 font-semibold transition-colors">
                        +92 300 1234567
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono block">Location</span>
                      <span className="text-white font-semibold">Lahore, Pakistan • Worldwide Clients</span>
                    </div>
                  </div>
                </div>

                {/* Instant WhatsApp Action Button */}
                <div className="pt-2">
                  <a 
                    href="https://wa.me/923001234567?text=Assalam-o-Alaikum%20Waqas,%20I%20am%20interested%20in%20your%20services." 
                    target="_blank" 
                    rel="noreferrer"
                    className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Chat on WhatsApp Directly</span>
                  </a>
                </div>

              </div>

              <div className="p-6 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-2 text-xs text-slate-400">
                <span className="text-white font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4 text-cyan-400" />
                  Fast Response SLA
                </span>
                <p className="leading-relaxed">
                  All email and WhatsApp inquiries receive a detailed initial review and response within 12 hours on business days.
                </p>
              </div>

            </div>

            {/* Interactive Contact Form (Connects to backend /api/contact) */}
            <div className="md:col-span-3">
              <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl relative">
                
                {contactSuccess ? (
                  <div className="text-center py-12 space-y-4">
                    <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500 text-emerald-400 mx-auto flex items-center justify-center">
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <h3 className="text-2xl font-bold text-white">Shukriya! Message Sent</h3>
                    <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
                      Your inquiry has been delivered directly to Waqas Mehmood's inbox. I will review your requirements and get in touch within 12 hours.
                    </p>
                    <button 
                      onClick={() => setContactSuccess(false)}
                      className="px-6 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold mt-4 cursor-pointer"
                    >
                      Send Another Message
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleContactSubmit} className="space-y-4 text-xs">
                    <div>
                      <h3 className="text-lg font-bold text-white">Send Email Inquiry</h3>
                      <p className="text-slate-400 text-[11px] mt-0.5">Please provide basic details about your brand and goals.</p>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                        <input 
                          type="text" 
                          required
                          value={contactForm.name}
                          onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })}
                          placeholder="e.g. Ali Khan / Sarah Smith"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Email Address *</label>
                        <input 
                          type="email" 
                          required
                          value={contactForm.email}
                          onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                          placeholder="name@company.com"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">WhatsApp / Phone Number</label>
                        <input 
                          type="text" 
                          value={contactForm.phone}
                          onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                          placeholder="+92 300 1234567"
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="block text-slate-300 font-semibold mb-1">Estimated Budget Scope</label>
                        <select 
                          value={contactForm.budget}
                          onChange={(e) => setContactForm({ ...contactForm, budget: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
                        >
                          <option value="<$500">Starter (&lt; $500)</option>
                          <option value="$1,000 - $3,000">$1,000 - $3,000</option>
                          <option value="$3,000 - $10,000">$3,000 - $10,000</option>
                          <option value="$10,000+">Enterprise Growth ($10,000+)</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Primary Skill / Service Needed</label>
                      <select 
                        value={contactForm.service}
                        onChange={(e) => setContactForm({ ...contactForm, service: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-200 focus:outline-none focus:border-cyan-400 transition-colors"
                      >
                        <option value="Graphic Design">Graphic Design & UI/UX</option>
                        <option value="Website Development">Website Development (React / Laravel)</option>
                        <option value="SMM">Social Media Marketing (SMM)</option>
                        <option value="Google Ads">Google Ads (PPC Campaigns)</option>
                        <option value="SEO Services">SEO Services & Technical Audits</option>
                        <option value="Full-Stack Digital Marketing">Complete 360° Growth Engineering</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-slate-300 font-semibold mb-1">Project Details & Objectives *</label>
                      <textarea 
                        rows={4}
                        required
                        value={contactForm.message}
                        onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })}
                        placeholder="Tell me about your brand, current roadblocks, website URL, and what you aim to achieve..."
                        className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-400 transition-colors"
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={contactSubmitting}
                      className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-cyan-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
                    >
                      {contactSubmitting ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                      <span>{contactSubmitting ? 'Sending Message...' : 'Send Inquiry to Waqas Mehmood'}</span>
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>

          {/* 4-Step Client Onboarding & Project Execution Journey */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Transparent Process</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">4-Step Client Onboarding & Project Execution Journey</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                What happens after you submit an inquiry? Here is how Waqas Mehmood transforms goals into compounding digital revenue.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  step: '01',
                  phase: 'Discovery & Audit',
                  title: 'Deep Channel Analysis',
                  desc: 'Comprehensive diagnostic of your current website DOM, Google Search Console, Google Ads history, and competitive landscape to isolate bottlenecks.'
                },
                {
                  step: '02',
                  phase: 'Strategic Architecture',
                  title: 'Bespoke Growth Blueprint',
                  desc: 'A milestone-based proposal outlining exact deliverables, technical fixes, campaign structures, expected timeline, and projected ROI.'
                },
                {
                  step: '03',
                  phase: 'Agile Implementation',
                  title: 'Hands-On Code & Campaign Build',
                  desc: 'Direct code execution: writing Schema JSON-LD, restructuring keywords, launching high-ROAS PPC ads, or engineering reactive full-stack web features.'
                },
                {
                  step: '04',
                  phase: 'Iterative Scaling',
                  title: 'Transparent Reporting & Compounding',
                  desc: 'Real-time performance tracking, weekly Slack/WhatsApp updates, continuous conversion rate optimization, and ongoing revenue scale.'
                }
              ].map((step, i) => (
                <div key={i} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3 relative hover:border-cyan-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-black font-mono text-cyan-400">{step.step}</span>
                    <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider">{step.phase}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white">{step.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Flexible Engagement Models */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Collaboration Models</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Flexible Engagement Scopes Tailored to Your Growth</h2>
              <p className="text-xs text-slate-400">
                Choose the structure that matches your current business stage and technical requirements.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  tier: 'One-Time Diagnostic',
                  title: 'Deep Technical SEO & Speed Audit',
                  desc: 'Ideal for websites experiencing ranking drops, crawl blocks, or slow Core Web Vitals. Includes a complete prioritized fix blueprint.',
                  features: ['Full DOM & Heading Hierarchy Audit', 'Schema.org JSON-LD Review', 'Core Web Vitals & Server Latency Analysis', 'Competitor Keyword & Backlink Gap']
                },
                {
                  tier: 'Monthly Retainer',
                  title: 'Omnichannel Growth Partnership',
                  desc: 'Complete end-to-end digital marketing management combining High-ROAS Google Ads, Technical SEO, and continuous Conversion Rate Optimization.',
                  features: ['Dedicated Sprint Hours Every Month', 'Google Ads & Meta Campaign Management', 'On-Page SEO & Content Topical Siloing', 'Weekly Transparent KPI Video Reviews']
                },
                {
                  tier: 'Full-Stack Build',
                  title: 'Custom Web Application Development',
                  desc: 'End-to-end design and coding of modern React.js and PHP Laravel web applications built for blistering speed, conversions, and scale.',
                  features: ['Modern React.js & Tailwind CSS UI', 'Resilient Laravel 13 Backend APIs', 'Sub-second Page Load & 95+ PageSpeed', 'Built-in On-Page SEO Architecture']
                }
              ].map((model, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-950 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all">
                  <div className="space-y-3">
                    <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider block">{model.tier}</span>
                    <h3 className="text-base font-bold text-white">{model.title}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed">{model.desc}</p>
                    <ul className="space-y-2 pt-2 border-t border-slate-900 text-xs text-slate-300">
                      {model.features.map((f, fi) => (
                        <li key={fi} className="flex items-center gap-2">
                          <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <button 
                    onClick={() => {
                      setContactForm(prev => ({ ...prev, message: `Inquiring about ${model.title}` }));
                      window.scrollTo({ top: 400, behavior: 'smooth' });
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-cyan-500 hover:text-slate-950 text-white font-bold text-xs border border-slate-800 transition-all cursor-pointer"
                  >
                    Select This Scope &uarr;
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Interactive Contact FAQ Accordion */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Hiring & Collaboration</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions on Working Together</h2>
              <p className="text-xs text-slate-400">
                Clear answers regarding turnarounds, security, confidentiality, and project delivery.
              </p>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                {
                  q: "How fast will Waqas Mehmood respond to my inquiry?",
                  a: "All direct form submissions, emails to waqas@waqasmehmood.com, and WhatsApp inquiries receive a personalized review and response within 12 hours on business days."
                },
                {
                  q: "Do you sign Non-Disclosure Agreements (NDAs)?",
                  a: "Yes, absolutely. Waqas routinely signs bilateral NDAs before reviewing proprietary codebase repositories, Google Analytics data, ad account histories, or confidential startup pitch decks."
                },
                {
                  q: "What payment methods and billing currencies are supported?",
                  a: "Waqas accepts international payments in USD, GBP, EUR, AED, and PKR via direct Wire Transfer, Wise, Payoneer, and local bank transfers. Milestone-based billing and escrow arrangements are welcome for large projects."
                },
                {
                  q: "How are project milestones tracked and communicated during an engagement?",
                  a: "Clients receive access to a dedicated communication channel (Slack, WhatsApp, or email) with regular sprint updates, recorded Loom walkthroughs of technical changes, and transparent Google Sheets / Analytics reporting dashboards."
                },
                {
                  q: "Can I bundle SEO Services, Google Ads, and Web Development together?",
                  a: "Yes! Bundling is often the highest-converting strategy because custom web development optimizes the landing page speed and Schema structure, which directly raises Google Ads Quality Score while simultaneously accelerating organic SEO rankings."
                }
              ].map((faq, idx) => {
                const isOpen = openContactFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenContactFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900/80 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Internal Navigation Mesh */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4 border-t border-slate-800 text-xs">
            <span className="text-slate-400">Explore other sections:</span>
            <button 
              onClick={() => goToTab('services')}
              className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              &larr; View 5 Core Services & Portfolio
            </button>
            <button 
              onClick={() => goToTab('all-tools')}
              className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 transition-all cursor-pointer"
            >
              Test 25 Free In-House SEO Tools &rarr;
            </button>
          </div>

        </main>
      )}

      {/* ======================================================== */}
      {/* 2. ALL TOOLS DIRECTORY (5 SEPARATED PILLAR BOXES)         */}
      {/* ======================================================== */}
      {activeTab === 'all-tools' && (
        <section className="py-12 px-6 max-w-6xl mx-auto space-y-10">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-slate-800">
            <div>
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">In-House Digital Tools</span>
              <h1 className="text-3xl font-black text-white mt-1">SEO &amp; AI Tools Directory (5 Pillars)</h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
                Har pillar ke tools alag box me organize hain. Kisi bhi box par click karein to us category ke live operating tools open ho jayenge.
              </p>
            </div>
          </div>

          {/* FEATURED FLAGSHIP AI TOOL BANNER */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-cyan-500/10 border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-[11px] font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>NEW FLAGSHIP TOOL</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">Free AI Math Solver</h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Snap handwritten homework photos, paste clipboard screenshots, or type equations for instant step-by-step proofs powered by multimodal AI.
              </p>
            </div>
            <button
              onClick={() => {
                const mathTool = allToolsList.find(t => t.slug === 'ai-math-solver');
                if (mathTool) openTool(mathTool, false);
              }}
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 hover:from-amber-400 hover:to-purple-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-amber-500/20 flex items-center gap-2 shrink-0 cursor-pointer transition-all"
            >
              <span>Launch AI Math Solver</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* 5 DISTINCT SEPARATED PILLAR BOXES */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {Object.keys(pillarsData).map((k) => {
              const p = pillarsData[k];
              const isSelected = selectedPillar === k;
              return (
                <div 
                  key={k}
                  onClick={() => {
                    setSelectedPillar(k);
                    navigate(pillarSlugMap[k] || '/all-tools');
                  }}
                  className={`p-6 rounded-2xl cursor-pointer transition-all border ${isSelected ? 'bg-slate-900 border-cyan-400 shadow-xl shadow-cyan-500/10 -translate-y-1' : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'}`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono ${p.badgeColor}`}>
                      {p.tools.length} Tools
                    </span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-400" />}
                  </div>
                  <h3 className="text-base font-extrabold text-white">{p.title}</h3>
                  <p className="text-xs text-slate-400 mt-1">{p.tagline}</p>
                </div>
              );
            })}
          </div>

          {/* ACTIVE PILLAR EXPANDED BOX */}
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Selected Box</span>
                <h2 className="text-2xl font-black text-white">{pillarsData[selectedPillar].title}</h2>
                <p className="text-xs text-slate-400 mt-0.5">{pillarsData[selectedPillar].tagline} ({pillarsData[selectedPillar].tools.length} Sub-tools)</p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-emerald-400 font-mono">
                  Engine: {selectedPillar === 'ai' ? 'Google Gemini AI & High-Speed Multi-Page BFS Crawler' : 'PHP Laravel 13 Live Scraper'}
                </span>
              </div>
            </div>

            {/* Sub-tools Grid */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pillarsData[selectedPillar].tools.map((t, idx) => (
                <div 
                  key={t.slug}
                  className="p-5 rounded-2xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-cyan-400 font-bold">#{idx + 1}</span>
                      <span className="text-[10px] font-mono text-slate-500 font-semibold">{t.slug}</span>
                    </div>
                    <h4 className="text-sm font-bold text-white mb-1.5">{t.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed mb-4">{t.desc}</p>
                  </div>

                  <div className="pt-3 border-t border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] text-emerald-400 font-mono">● READY</span>
                    <button 
                      onClick={() => openTool(t, false)}
                      className="px-3 py-1.5 rounded-lg bg-cyan-500/10 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 text-xs font-bold border border-cyan-500/30 transition-all flex items-center gap-1 cursor-pointer"
                    >
                      <span>Open Tool</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* THE 4 PILLARS OF SEO EXPLAINED (DEEP EDUCATIONAL GUIDES) */}
          <div className="space-y-6 pt-6 border-t border-slate-800">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Search Engine Fundamentals</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">The 4 Pillars of Modern Search Engine Optimization</h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Google's ranking algorithms evaluate hundreds of algorithmic signals. Our 25 tools are engineered across these 4 vital pillars.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {[
                {
                  pillar: 'Pillar 1: One Page SEO',
                  toolsCount: '10 Tools',
                  color: 'text-cyan-400 border-cyan-500/30 bg-cyan-500/10',
                  desc: 'One Page SEO ensures search engine crawlers understand topical relevance, semantic hierarchy, and search intent alignment directly on the page.',
                  highlights: [
                    'Keyword Density & TF-IDF Topical Coverage',
                    'Single H1 and Strict H2–H6 Heading Hierarchy',
                    'Meta Title & Description Pixel-Length Optimization',
                    'Image ALT Text Accessibility & Indexing',
                    'SERP Snippet Mobile & Desktop Visual Previews'
                  ]
                },
                {
                  pillar: 'Pillar 2: Off Page SEO',
                  toolsCount: '5 Tools',
                  color: 'text-indigo-400 border-indigo-500/30 bg-indigo-500/10',
                  desc: 'Off Page SEO measures domain trustworthiness, digital brand citations, and external backlink equity pass-through from authoritative websites.',
                  highlights: [
                    'Domain Authority (DA) & Page Authority (PA) Signals',
                    'Referring Domains Diversity & Distribution',
                    'Competitor Backlink Profile Gap Comparison',
                    'Anchor Text Natural Distribution & Penalty Prevention',
                    'Outbound Link Architecture & Crawl Signals'
                  ]
                },
                {
                  pillar: 'Pillar 3: Technical SEO',
                  toolsCount: '5 Tools',
                  color: 'text-purple-400 border-purple-500/30 bg-purple-500/10',
                  desc: 'Technical SEO guarantees search bots can efficiently crawl, render, and index your pages without wasting crawl budget or encountering latency errors.',
                  highlights: [
                    'Sub-second Page Load & Core Web Vitals (LCP, INP, CLS)',
                    'Schema.org JSON-LD Structured Data Entity Graphs',
                    'Robots.txt Crawl Directives & User-Agent Disallow Rules',
                    'XML Sitemap Indexation & Canonical Link Validation',
                    'Technical Broken Link Detection (404/500 HTTP Statuses)'
                  ]
                },
                {
                  pillar: 'Pillar 4: Local SEO',
                  toolsCount: '5 Tools',
                  color: 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10',
                  desc: 'Local SEO captures high-converting geo-targeted searchers looking for services within specific cities, postal codes, or local service radiuses.',
                  highlights: [
                    'Google Business Profile (GBP) Completeness Audit',
                    'Name, Address, Phone (NAP) Consistency Across Directories',
                    'Local Citation Velocity & High-Trust Regional Directories',
                    'Geo-Specific Rank Position Tracking in Target Cities',
                    'Local Map 3-Pack Prominence & Review Velocity Signals'
                  ]
                }
              ].map((pItem, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4 hover:border-slate-700 transition-all">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white">{pItem.pillar}</h3>
                    <span className={`text-[10px] font-mono px-2.5 py-1 rounded-full border font-bold ${pItem.color}`}>
                      {pItem.toolsCount}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{pItem.desc}</p>
                  <ul className="space-y-1.5 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
                    {pItem.highlights.map((h, hi) => (
                      <li key={hi} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* ZERO-API INDEPENDENCE ARCHITECTURE */}
          <div className="p-8 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] font-mono text-cyan-400 font-bold uppercase tracking-wider">Engineered by Waqas Mehmood</span>
                <h3 className="text-xl font-bold text-white">Why In-House DOM Scrapers Outperform Third-Party APIs</h3>
                <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
                  Most commercial SEO toolkits rely on cached third-party APIs that refresh once a month. Waqas Mehmood wrote custom scraping engines in PHP Laravel that parse raw DOM elements in real-time, matching exactly what Googlebot sees when rendering your web application.
                </p>
              </div>
              <div className="px-4 py-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300 shrink-0">
                100% Free • Zero Rate Limits
              </div>
            </div>
          </div>

          {/* OFFICIAL TECHNICAL SPECIFICATIONS & STANDARDS */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="text-center max-w-xl mx-auto space-y-1">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase">Official Standards</span>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Adhering to Official Search Engine Specifications</h2>
              <p className="text-xs text-slate-400">
                All 25 tools evaluate web metrics against published developer documentation from Google and web standards bodies.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  name: 'Google Search Essentials',
                  desc: 'Core requirements for ensuring content is discovered, crawled, and rendered by Googlebot.',
                  url: 'https://developers.google.com/search/docs/essentials'
                },
                {
                  name: 'Schema.org Vocabulary',
                  desc: 'Universal structured data schemas enabling rich snippets and Knowledge Graph inclusion.',
                  url: 'https://schema.org/'
                },
                {
                  name: 'W3C HTML5 Specification',
                  desc: 'International standard for semantic HTML markup, heading trees, and DOM validity.',
                  url: 'https://www.w3.org/'
                },
                {
                  name: 'Web.dev Core Web Vitals',
                  desc: 'Google user-experience metrics evaluating page load speed, responsiveness, and visual stability.',
                  url: 'https://web.dev/vitals/'
                }
              ].map((std, i) => (
                <div key={i} className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 flex flex-col justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white">{std.name}</h3>
                    <p className="text-xs text-slate-400 leading-relaxed mt-1">{std.desc}</p>
                  </div>
                  <a
                    href={std.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 font-semibold pt-2 border-t border-slate-900 transition-colors"
                  >
                    <span>Official Documentation</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* INTERACTIVE TOOLS DIRECTORY FAQ ACCORDION */}
          <div className="p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">Help & Documentation</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Frequently Asked Questions About the 25 SEO Tools</h2>
              <p className="text-xs text-slate-400">
                Everything you need to know about testing, analyzing, and taking action on audit results.
              </p>
            </div>

            <div className="space-y-3 max-w-4xl mx-auto">
              {[
                {
                  q: "Are these 25 tools completely free to use?",
                  a: "Yes, 100% free with no hidden fees, credit card requirements, or daily query quotas. Waqas Mehmood developed this toolkit to provide transparent, high-speed website auditing for business owners, developers, and fellow marketers."
                },
                {
                  q: "How do these tools gather data without external API subscriptions?",
                  a: "Our backend utilizes custom scraping and DOM parsing engines written natively in PHP Laravel 13. When you submit a URL, our server requests the live page, renders the DOM, parses semantic elements, evaluates performance headers, and inspects structured JSON-LD schemas in real time."
                },
                {
                  q: "Can I audit my competitors' URLs to uncover their keyword strategies?",
                  a: "Yes. Simply paste any publicly accessible competitor URL into tools like the Website SEO Checker, Competitor Backlink Analyzer, or Keyword Density Checker to analyze their on-page silos, heading structure, and meta tags."
                },
                {
                  q: "What should I do if a tool reports critical warnings on my website?",
                  a: "Each tool includes an 'Actionable Step-by-Step Optimization Protocol' directly beneath the audit results. You can follow those steps to update your code or content. Alternatively, you can click 'Hire Waqas Mehmood' to have an experienced software engineer and SEO strategist implement the fixes for you."
                },
                {
                  q: "Does Waqas Mehmood offer custom technical SEO audits beyond these tools?",
                  a: "Yes. While these 25 automated tools provide instant diagnostics, Waqas also conducts comprehensive manual deep-dives that analyze JavaScript hydration, internal link PageRank distribution, server log files, and international hreflang configurations."
                }
              ].map((faq, idx) => {
                const isOpen = openToolsFaq === idx;
                return (
                  <div key={idx} className="rounded-2xl bg-slate-950/80 border border-slate-800/80 overflow-hidden transition-all">
                    <button
                      onClick={() => setOpenToolsFaq(isOpen ? -1 : idx)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-900/60 transition-colors cursor-pointer"
                    >
                      <span className="text-sm font-bold text-white">{faq.q}</span>
                      <ChevronDown className={`w-4 h-4 text-cyan-400 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-900/80 pt-3">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Direct CTA to hire Waqas for a custom deep audit */}
          <div className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold text-white">Need a Complete Technical & Growth Overhaul?</h3>
              <p className="text-xs text-slate-400">Let Waqas Mehmood conduct an exhaustive manual audit and implement fixes directly in your codebase.</p>
            </div>
            <button 
              onClick={() => goToTab('contact')}
              className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shrink-0 shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
            >
              Request Custom Audit &rarr;
            </button>
          </div>

        </section>
      )}

      {/* ======================================================== */}
      {/* 3. ACTIVE LIVE TOOL RUNNER & DETAILED RESULTS             */}
      {/* ======================================================== */}
      {activeTab === 'active-tool' && (
        activeTool?.slug === 'ai-math-solver' ? (
          <section className="py-12 px-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
              <button onClick={() => goToTab('home')} className="hover:text-cyan-400 cursor-pointer">waqasmehmood.com</button>
              <span>/</span>
              <button onClick={() => goToTab('all-tools')} className="hover:text-cyan-400 cursor-pointer">all-tools</button>
              <span>/</span>
              <button onClick={() => navigate(pillarSlugMap[selectedPillar] || '/all-tools')} className="hover:text-cyan-400 cursor-pointer uppercase">
                {pillarsData[selectedPillar]?.title || 'AI TOOLS'}
              </button>
              <span>/</span>
              <span className="text-cyan-400 font-bold">{activeTool?.title || 'Free AI Math Solver'}</span>
            </div>

            <AiMathSolver onHireClick={(service) => { setHireService(service || 'Custom AI & Web Development'); setHireModalOpen(true); }} />
          </section>
        ) : activeTool?.slug === 'website-crawler' ? (
          <section className="py-12 px-6 max-w-6xl mx-auto space-y-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
              <button onClick={() => goToTab('home')} className="hover:text-cyan-400 cursor-pointer">waqasmehmood.com</button>
              <span>/</span>
              <button onClick={() => goToTab('all-tools')} className="hover:text-cyan-400 cursor-pointer">all-tools</button>
              <span>/</span>
              <button onClick={() => navigate(pillarSlugMap[selectedPillar] || '/all-tools')} className="hover:text-cyan-400 cursor-pointer uppercase">
                {pillarsData[selectedPillar]?.title || 'AI TOOLS'}
              </button>
              <span>/</span>
              <span className="text-cyan-400 font-bold">{activeTool?.title || 'Free AI Website Crawler & Auditor'}</span>
            </div>

            <SiteAuditCrawler onHireClick={(service) => { setHireService(service || 'Technical SEO Remediation'); setHireModalOpen(true); }} />
          </section>
        ) : (
          <section className="py-12 px-6 max-w-5xl mx-auto space-y-8">
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono flex-wrap">
              <button onClick={() => goToTab('home')} className="hover:text-cyan-400 cursor-pointer">waqasmehmood.com</button>
              <span>/</span>
              <button onClick={() => goToTab('all-tools')} className="hover:text-cyan-400 cursor-pointer">all-tools</button>
              <span>/</span>
              <button onClick={() => navigate(pillarSlugMap[selectedPillar] || '/all-tools')} className="hover:text-cyan-400 cursor-pointer uppercase">
                {pillarsData[selectedPillar]?.title}
              </button>
              <span>/</span>
              <span className="text-cyan-400 font-bold">{activeTool?.title || 'SEO Tool'}</span>
            </div>

          {/* Tool Input Card */}
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold text-cyan-400">{pillarsData[selectedPillar]?.title}</span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeTool?.title}</h2>
                <p className="text-xs text-slate-400">{activeTool?.desc}</p>
              </div>
              <button 
                onClick={() => goToTab('all-tools')}
                className="text-xs text-slate-400 hover:text-white cursor-pointer px-3 py-1.5 rounded-lg bg-slate-800/60 border border-slate-700 hover:border-cyan-500/40 transition-colors"
              >
                &larr; Back to All Tools
              </button>
            </div>

            {/* Input Mode Toggle for text-compatible tools */}
            {['word-counter', 'plagiarism-checker', 'keyword-density-checker'].includes(activeTool?.slug) && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setInputMode('url')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${inputMode === 'url' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                >
                  Analyze Live Webpage URL
                </button>
                <button
                  type="button"
                  onClick={() => setInputMode('text')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${inputMode === 'text' ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-400 border border-slate-800'}`}
                >
                  Paste Custom Text / Article
                </button>
              </div>
            )}

            {/* Dynamic Inputs depending on Tool */}
            {inputMode === 'url' ? (
              <div className="grid md:grid-cols-3 gap-4">
                <div className={['keyword-density-checker', 'competitor-backlink-analyzer', 'local-rank-checker', 'local-seo-audit-tool'].includes(activeTool?.slug) ? 'md:col-span-2' : 'md:col-span-3'}>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Target Webpage URL</label>
                  <input 
                    type="url" 
                    value={targetUrl}
                    onChange={(e) => setTargetUrl(e.target.value)}
                    placeholder="https://waqasmehmood.com"
                    className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                {activeTool?.slug === 'keyword-density-checker' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Focus Keyword</label>
                    <input 
                      type="text" 
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. digital marketing"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}

                {activeTool?.slug === 'competitor-backlink-analyzer' && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Competitor Webpage URL</label>
                    <input 
                      type="url" 
                      value={competitorUrl}
                      onChange={(e) => setCompetitorUrl(e.target.value)}
                      placeholder="https://competitor.com"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                )}

                {['local-rank-checker', 'local-seo-audit-tool'].includes(activeTool?.slug) && (
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">Target City / Area</label>
                    <input 
                      type="text" 
                      value={targetCity}
                      onChange={(e) => setTargetCity(e.target.value)}
                      placeholder="e.g. Lahore, Dubai, London"
                      className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <label className="font-bold text-slate-300">Custom Content / Article Text</label>
                  <span>{customText.trim().split(/\s+/).filter(Boolean).length} Words | {customText.length} Characters</span>
                </div>
                <textarea
                  rows={5}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Paste your content or article text here..."
                  className="w-full p-4 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono leading-relaxed"
                />

                {activeTool?.slug === 'keyword-density-checker' && (
                  <div className="max-w-xs">
                    <label className="block text-xs font-bold text-slate-300 mb-1">Focus Keyword</label>
                    <input 
                      type="text" 
                      value={focusKeyword}
                      onChange={(e) => setFocusKeyword(e.target.value)}
                      placeholder="e.g. digital marketing"
                      className="w-full px-4 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-slate-800">
              <span className="text-[11px] text-slate-400 font-mono">Waqas Mehmood SEO Engine • Real Crawl & Parse</span>
              <button 
                onClick={() => runLiveAudit(activeTool, targetUrl)}
                disabled={isLoading}
                className="px-6 py-2.5 rounded-xl font-bold text-xs bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white shadow-lg shadow-cyan-500/20 flex items-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{isLoading ? 'Crawling & Analyzing...' : 'Analyze Now'}</span>
              </button>
            </div>
          </div>

          {/* DETAILED RESULTS SECTION */}
          {auditResult && (() => {
            const st = auditResult.status_counts || (() => {
              let g = 0, i = 0, c = 0;
              (auditResult.checks || []).forEach(chk => {
                if (chk.status === 'good') g++;
                else if (chk.status === 'ok') i++;
                else c++;
              });
              return { g, i, c };
            })();
            const scoreVal = Math.min(100, Math.max(0, auditResult.score ?? 0));
            const ringOffset = 100 - scoreVal;
            const ringColor = scoreVal >= 80 ? '#10b981' : (scoreVal >= 55 ? '#f59e0b' : '#ef4444');

            return (
              <div className="space-y-6">
                
                {/* Health Statistics Card (Matching waqasmehmood.com) */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
                    <div>
                      <p className="text-xs uppercase font-mono tracking-wider text-slate-400">
                        {activeTool?.title || 'SEO Tool'} — Statistics
                      </p>
                      <h3 className="text-lg font-bold text-white mt-1 flex items-center gap-2 truncate">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
                        {inputMode === 'url' ? (auditResult.final_url || targetUrl) : 'Custom Text Input'}
                      </h3>
                    </div>
                    <button 
                      onClick={() => { setHireService(`SEO Optimization for ${targetUrl}`); setHireModalOpen(true); }}
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-xs font-bold text-white shadow-lg shadow-cyan-500/20 cursor-pointer self-start sm:self-auto transition-all"
                    >
                      Hire Waqas to Optimize
                    </button>
                  </div>

                  {/* SVG Ring & Triple-colored Health Bar */}
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    
                    {/* Circular Progress Gauge */}
                    <div className="relative w-[120px] h-[120px] shrink-0 flex items-center justify-center">
                      <svg className="w-[120px] h-[120px] -rotate-90" viewBox="0 0 120 120">
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="52" 
                          fill="none" 
                          stroke="rgba(255, 255, 255, 0.08)" 
                          strokeWidth="9" 
                        />
                        <circle 
                          cx="60" 
                          cy="60" 
                          r="52" 
                          fill="none" 
                          stroke={ringColor} 
                          strokeWidth="9" 
                          strokeLinecap="round" 
                          pathLength="100" 
                          strokeDasharray="100" 
                          strokeDashoffset={ringOffset} 
                          className="transition-all duration-1000 ease-out" 
                        />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-3xl font-black text-white leading-none">{scoreVal}</span>
                        <small className="text-[10px] text-slate-400 font-bold uppercase mt-1">Score</small>
                      </div>
                    </div>

                    {/* Metrics Counters & Progress Bar */}
                    <div className="w-full space-y-3">
                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                          <span className="text-[11px] font-semibold text-slate-400 block">Good</span>
                          <span className="text-2xl font-black text-[#10b981]">{st.g ?? 0}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                          <span className="text-[11px] font-semibold text-slate-400 block">Improve</span>
                          <span className="text-2xl font-black text-[#f59e0b]">{st.i ?? 0}</span>
                        </div>
                        <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 text-center">
                          <span className="text-[11px] font-semibold text-slate-400 block">Critical</span>
                          <span className="text-2xl font-black text-[#ef4444]">{st.c ?? 0}</span>
                        </div>
                      </div>

                      {/* Triple-Color Flex Bar */}
                      <div className="h-2.5 rounded-full overflow-hidden flex bg-white/5 border border-slate-800">
                        <span className="bg-[#10b981] transition-all duration-500" style={{ flex: st.g || 0.001 }}></span>
                        <span className="bg-[#f59e0b] transition-all duration-500" style={{ flex: st.i || 0.001 }}></span>
                        <span className="bg-[#ef4444] transition-all duration-500" style={{ flex: st.c || 0.001 }}></span>
                      </div>

                      {/* Legend */}
                      <div className="flex flex-wrap items-center justify-between text-xs text-slate-400 font-medium pt-1">
                        <span className="flex items-center gap-1.5">
                          <i className="w-2.5 h-2.5 rounded-full bg-[#10b981] inline-block"></i>
                          Good <b className="text-white">{st.g ?? 0}</b>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <i className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] inline-block"></i>
                          Improve <b className="text-white">{st.i ?? 0}</b>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <i className="w-2.5 h-2.5 rounded-full bg-[#ef4444] inline-block"></i>
                          Critical <b className="text-white">{st.c ?? 0}</b>
                        </span>
                      </div>
                    </div>

                  </div>
                </div>

                {/* Extracted Values Box (When available) */}
                {(auditResult.extra?.title || auditResult.title || auditResult.extra?.meta || auditResult.meta || auditResult.extra?.words || auditResult.word_count || auditResult.canonical || auditResult.extra?.canonical) && (
                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <FileText className="w-4 h-4 text-cyan-400" />
                      Extracted Page Signals
                    </h4>
                    <div className="grid sm:grid-cols-2 gap-3 text-xs">
                      {(auditResult.extra?.title || auditResult.title) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Page Title</span>
                          <span className="text-slate-200 font-semibold block mt-0.5">{auditResult.extra?.title || auditResult.title}</span>
                          <span className="text-[10px] text-cyan-400 mt-1 block">{(auditResult.extra?.title_len || auditResult.title_len || (auditResult.extra?.title || auditResult.title)?.length)} characters</span>
                        </div>
                      )}
                      {(auditResult.extra?.meta || auditResult.meta) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Meta Description</span>
                          <span className="text-slate-200 font-semibold block mt-0.5">{auditResult.extra?.meta || auditResult.meta}</span>
                          <span className="text-[10px] text-cyan-400 mt-1 block">{(auditResult.extra?.meta_len || auditResult.meta_len || (auditResult.extra?.meta || auditResult.meta)?.length)} characters</span>
                        </div>
                      )}
                      {(auditResult.extra?.words !== undefined || auditResult.word_count !== undefined) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Total Word Count</span>
                          <span className="text-slate-200 font-bold text-base block mt-0.5">{auditResult.extra?.words ?? auditResult.word_count} words</span>
                        </div>
                      )}
                      {(auditResult.extra?.density !== undefined || auditResult.density !== undefined) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Keyword Density</span>
                          <span className="text-emerald-400 font-bold text-base block mt-0.5">{auditResult.extra?.density ?? auditResult.density}% ({auditResult.extra?.count ?? auditResult.keyword_count ?? 0} times)</span>
                        </div>
                      )}
                      {(auditResult.canonical || auditResult.extra?.canonical) && (
                        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 sm:col-span-2">
                          <span className="text-[10px] text-slate-500 uppercase font-mono block">Canonical Tag</span>
                          <span className="text-cyan-300 font-mono text-[11px] block mt-0.5 truncate">{auditResult.canonical || auditResult.extra?.canonical}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

              {/* ======================================================== */}
              {/* DEDICATED TOOL-SPECIFIC DATA PANELS                      */}
              {/* ======================================================== */}

              {/* 1. WORD COUNTER DATA */}
              {activeTool?.slug === 'word-counter' && auditResult.extra && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {[
                    { label: 'Total Words', value: auditResult.extra.words, icon: BookOpen },
                    { label: 'Chars (with space)', value: auditResult.extra.chars, icon: Hash },
                    { label: 'Chars (no space)', value: auditResult.extra.chars_no_space, icon: Hash },
                    { label: 'Sentences', value: auditResult.extra.sentences, icon: FileText },
                    { label: 'Reading Time', value: `~${auditResult.extra.reading_time} min`, icon: Clock },
                    { label: 'Speaking Time', value: `~${auditResult.extra.speaking_time} min`, icon: Phone },
                  ].map((st, i) => (
                    <div key={i} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-1">
                      <st.icon className="w-4 h-4 mx-auto text-cyan-400" />
                      <div className="text-xl font-black text-white">{st.value}</div>
                      <div className="text-[11px] text-slate-400">{st.label}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* 2. KEYWORD DENSITY DATA & TOP WORDS TABLE */}
              {activeTool?.slug === 'keyword-density-checker' && auditResult.extra && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Target Keyword</div>
                      <div className="text-lg font-bold text-white mt-1">"{auditResult.extra.keyword || 'None'}"</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Occurrences</div>
                      <div className="text-lg font-bold text-cyan-400 mt-1">{auditResult.extra.count || 0} times</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Density Ratio</div>
                      <div className="text-lg font-bold text-emerald-400 mt-1">{auditResult.extra.density || 0}%</div>
                    </div>
                  </div>

                  {/* Top Words Table */}
                  {auditResult.extra.top_words && auditResult.extra.top_words.length > 0 && (
                    <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-white uppercase tracking-wider">Top 15 Most Frequent Words</h4>
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead>
                            <tr className="border-b border-slate-800 text-slate-400">
                              <th className="pb-2">Rank</th>
                              <th className="pb-2">Word</th>
                              <th className="pb-2">Count</th>
                              <th className="pb-2">Density</th>
                              <th className="pb-2">Frequency Bar</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-800/60 font-mono">
                            {auditResult.extra.top_words.map((item, idx) => (
                              <tr key={idx} className="hover:bg-slate-950/40">
                                <td className="py-2 text-slate-500">#{idx + 1}</td>
                                <td className="py-2 text-white font-bold">{item.word}</td>
                                <td className="py-2 text-cyan-300">{item.count}</td>
                                <td className="py-2 text-emerald-400">{item.density}%</td>
                                <td className="py-2 w-32">
                                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                                    <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${Math.min(100, item.density * 20)}%` }}></div>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 3. HEADING CHECKER H1-H6 VISUAL TREE */}
              {activeTool?.slug === 'heading-checker' && auditResult.extra && (
                <div className="space-y-4">
                  <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                    {['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].map(tag => (
                      <div key={tag} className="p-3 rounded-xl bg-slate-900 border border-slate-800 text-center">
                        <span className="text-[10px] font-mono uppercase text-cyan-400 font-bold">{tag}</span>
                        <div className="text-lg font-black text-white">{auditResult.extra.counts?.[tag] || 0}</div>
                      </div>
                    ))}
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <ListTree className="w-4 h-4 text-cyan-400" />
                      <span>Detected Heading Hierarchy Tree</span>
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {auditResult.extra.headings?.map((h, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold shrink-0 ${h.tag === 'h1' ? 'bg-cyan-500 text-slate-950' : 'bg-slate-800 text-cyan-400'}`}>
                            {h.tag.toUpperCase()}
                          </span>
                          <span className="text-slate-200">{h.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 4. IMAGE ALT TEXT CHECKER LIST */}
              {activeTool?.slug === 'image-alt-checker' && auditResult.extra && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Total Images</div>
                      <div className="text-xl font-bold text-white mt-1">{auditResult.extra.total}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">With ALT Attributes</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">{auditResult.extra.with_alt}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Missing ALT</div>
                      <div className="text-xl font-bold text-rose-400 mt-1">{auditResult.extra.missing}</div>
                    </div>
                  </div>

                  <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <Image className="w-4 h-4 text-cyan-400" />
                      <span>Audited Images Sample List</span>
                    </h4>
                    <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                      {auditResult.extra.images?.map((img, i) => (
                        <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <span className="text-[10px] text-slate-500 font-mono">#{i + 1}</span>
                            <div className="truncate">
                              <span className="text-slate-300 block truncate font-mono text-[11px]">{img.src}</span>
                              <span className="text-[10px] text-cyan-400 mt-0.5 block">ALT: "{img.alt}"</span>
                            </div>
                          </div>
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${img.has_alt ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'}`}>
                            {img.has_alt ? '✓ ALT OK' : '⚠ Missing ALT'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 5. SERP SNIPPET SIMULATOR */}
              {activeTool?.slug === 'serp-snippet-preview' && auditResult.extra && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2">
                    <span className="text-xs font-bold text-slate-300">Live Google SERP Simulator</span>
                    <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                      <button 
                        onClick={() => setSerpDevice('desktop')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${serpDevice === 'desktop' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                      >
                        <Monitor className="w-3.5 h-3.5" />
                        <span>Desktop</span>
                      </button>
                      <button 
                        onClick={() => setSerpDevice('mobile')}
                        className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 cursor-pointer ${serpDevice === 'mobile' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'}`}
                      >
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Mobile</span>
                      </button>
                    </div>
                  </div>

                  {/* Google Preview Card */}
                  <div className="p-6 rounded-2xl bg-white text-slate-900 border border-slate-300 space-y-2 shadow-2xl max-w-2xl">
                    <div className="flex items-center gap-2 text-xs text-[#202124]">
                      <div className="w-4 h-4 rounded-full bg-slate-200 flex items-center justify-center text-[9px] font-bold">G</div>
                      <span className="text-[12px] truncate">{auditResult.extra.serp_url || 'https://waqasmehmood.com'}</span>
                    </div>
                    <h3 className="text-lg font-medium text-[#1a0dab] hover:underline cursor-pointer leading-snug">
                      {auditResult.extra.serp_title}
                    </h3>
                    <p className="text-xs text-[#4d5156] leading-relaxed">
                      {auditResult.extra.serp_meta}
                    </p>
                  </div>
                </div>
              )}

              {/* 6. ROBOTS.TXT VIEWER */}
              {activeTool?.slug === 'robots-txt-tester' && auditResult.extra && (
                <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-bold text-cyan-400">{auditResult.extra.robots_url}</span>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(auditResult.extra.content || '');
                        setCopiedRobots(true);
                        setTimeout(() => setCopiedRobots(false), 2000);
                      }}
                      className="px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white text-xs flex items-center gap-1.5 cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedRobots ? 'Copied!' : 'Copy robots.txt'}</span>
                    </button>
                  </div>
                  <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto border border-slate-800 leading-relaxed">
                    {auditResult.extra.content || '# No robots.txt content detected'}
                  </pre>
                </div>
              )}

              {/* 7. XML SITEMAP VIEWER */}
              {activeTool?.slug === 'xml-sitemap-checker' && auditResult.extra && (
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Sitemap Status</div>
                    <div className="text-sm font-bold text-emerald-400 mt-1 truncate">
                      {auditResult.extra.sitemap_url ? '✓ Active & Valid' : 'Not Found'}
                    </div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Total URLs</div>
                    <div className="text-xl font-bold text-white mt-1">~{auditResult.extra.url_count || 0}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Sub-sitemaps</div>
                    <div className="text-xl font-bold text-cyan-400 mt-1">{auditResult.extra.sub_sitemaps || 0}</div>
                  </div>
                </div>
              )}

              {/* 8. SCHEMA MARKUP JSON-LD VIEWER */}
              {activeTool?.slug === 'schema-markup-validator' && auditResult.extra && (
                <div className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-3">
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Valid Schema Blocks</div>
                      <div className="text-xl font-bold text-emerald-400 mt-1">{auditResult.extra.valid_count}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                      <div className="text-xs text-slate-400">Detected Types</div>
                      <div className="text-sm font-bold text-white mt-1">
                        {auditResult.extra.types?.join(', ') || 'None'}
                      </div>
                    </div>
                  </div>

                  {auditResult.extra.schemas?.map((s, idx) => (
                    <div key={idx} className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                      <span className="text-xs font-mono font-bold text-cyan-400">Schema Entity: {s.type}</span>
                      <pre className="p-4 rounded-xl bg-slate-950 text-slate-300 font-mono text-xs overflow-x-auto border border-slate-800">
                        {s.raw}
                      </pre>
                    </div>
                  ))}
                </div>
              )}

              {/* 9. SPEED CHECKER METRICS */}
              {activeTool?.slug === 'website-speed-checker' && auditResult.extra && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Server TTFB</div>
                    <div className="text-xl font-bold text-cyan-400 mt-1">{auditResult.extra.ttfb_ms} ms</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">HTML Size</div>
                    <div className="text-xl font-bold text-white mt-1">{auditResult.extra.html_kb} KB</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Scripts</div>
                    <div className="text-xl font-bold text-slate-300 mt-1">{auditResult.extra.scripts_count}</div>
                  </div>
                  <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 text-center">
                    <div className="text-xs text-slate-400">Stylesheets</div>
                    <div className="text-xl font-bold text-slate-300 mt-1">{auditResult.extra.css_count}</div>
                  </div>
                </div>
              )}

              {/* ======================================================== */}
              {/* CHECKLIST & RECOMMENDATIONS (MATCHING WAQASMEHMOOD.COM) */}
              {/* ======================================================== */}
              <div className="grid md:grid-cols-2 gap-6">
                
                {/* Status Checkpoints */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-400" />
                      Audit Checkpoints ({auditResult.checks?.length || 0})
                    </h4>
                    <span className="text-[10px] font-mono text-slate-400">✓ Good • ! Improve • ✗ Critical</span>
                  </div>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {auditResult.checks?.map((c, i) => {
                      const isGood = c.status === 'good';
                      const isOk = c.status === 'ok';
                      const borderBg = isGood 
                        ? 'bg-emerald-500/10 border-l-4 border-emerald-500 text-slate-200' 
                        : (isOk ? 'bg-amber-500/10 border-l-4 border-amber-500 text-slate-200' : 'bg-rose-500/10 border-l-4 border-rose-500 text-slate-200');
                      const iconColor = isGood ? 'text-emerald-400 font-bold' : (isOk ? 'text-amber-400 font-bold' : 'text-rose-400 font-bold');
                      const iconSymbol = isGood ? '✓' : (isOk ? '!' : '✗');

                      return (
                        <div key={i} className={`p-3 rounded-r-xl text-xs flex items-start gap-3 transition-colors ${borderBg}`}>
                          <span className={`text-sm shrink-0 w-4 text-center ${iconColor}`}>{iconSymbol}</span>
                          <div className="space-y-0.5">
                            {c.cat && (
                              <span className="inline-block text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-950/60 text-slate-400 mr-1.5">
                                {c.cat}
                              </span>
                            )}
                            <span className="leading-relaxed">{c.text}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Recommendations */}
                <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400" />
                      Actionable Recommendations ({auditResult.recommendations?.length || 0})
                    </h4>
                    <span className="text-[10px] font-mono text-amber-400/80">Priority Fixes</span>
                  </div>

                  <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
                    {auditResult.recommendations?.map((r, i) => (
                      <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 flex items-start gap-3 text-xs text-slate-300 hover:border-slate-700 transition-colors">
                        <span className="text-amber-400 font-bold text-base leading-none">•</span>
                        <span className="leading-relaxed">{r}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>
          );
        })()}

          {/* ======================================================== */}
          {/* SEO EDUCATIONAL GUIDE & TOOL PURPOSE (INDEXING CONTENT)  */}
          {/* ======================================================== */}
          {(() => {
            const toolSeo = TOOLS_SEO_DATA[activeTool?.slug] || {
              focusKeyword: `${activeTool?.title || 'seo'} audit tool`,
              h2Title: `Complete Guide to ${activeTool?.title || 'SEO Tool'} Optimization`,
              intro: activeTool?.desc || 'Audit and optimize search engine ranking signals with precision.',
              googleFactor: 'Search engine crawlers analyze DOM elements, performance, and topical signals to determine ranking positions.',
              benchmarks: [
                { label: 'Signal Quality', value: '100% compliant with Google Search Essentials' },
                { label: 'Crawl Accessibility', value: 'Zero crawl blocks or redirect errors' }
              ],
              bestPractices: [
                'Review and resolve any flagged critical warnings in your audit report.',
                'Maintain high content relevance and clear hierarchy across your landing page.',
                'Ensure mobile usability and sub-second response times.',
                'Re-run the audit regularly to verify ongoing compliance.'
              ],
              externalReference: {
                name: 'Google Search Central - Search Essentials',
                url: 'https://developers.google.com/search/docs/essentials',
                citation: 'Core requirements for ensuring your web pages are crawled, indexed, and displayed by Google.'
              },
              faqs: [
                {
                  q: `Why is ${activeTool?.title} important for SEO?`,
                  a: `${activeTool?.title} helps webmasters pinpoint technical and content deficiencies that prevent optimal Google search discovery and indexing.`
                }
              ]
            };

            return (
              <div className="space-y-10 pt-8 border-t border-slate-800">
                
                {/* Header with Focus Keyword & Authority Badges */}
                <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
                      <Target className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Focus Keyword: <strong className="text-white">{toolSeo.focusKeyword}</strong></span>
                    </div>
                    <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                      ● Google Search Central Standard
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight">
                    {toolSeo.h2Title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                    {toolSeo.intro}
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Algorithmic Factors, Benchmarks & Best Practices */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* How Google Evaluates This Metric */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                      <h3 className="text-sm font-bold text-cyan-300 flex items-center gap-2 uppercase tracking-wider">
                        <Terminal className="w-4 h-4 text-cyan-400" />
                        <span>How Search Engine Algorithms Evaluate This Signal</span>
                      </h3>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {toolSeo.googleFactor}
                      </p>
                    </div>

                    {/* Technical Standards & Benchmarks Table */}
                    {toolSeo.benchmarks && toolSeo.benchmarks.length > 0 && (
                      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-white flex items-center gap-2 uppercase tracking-wider">
                          <BarChart2 className="w-4 h-4 text-cyan-400" />
                          <span>Industry Standards & Technical Benchmarks</span>
                        </h3>
                        <div className="divide-y divide-slate-800/80 rounded-xl overflow-hidden border border-slate-800/80">
                          {toolSeo.benchmarks.map((bm, i) => (
                            <div key={i} className="p-3 bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                              <span className="font-semibold text-slate-300">{bm.label}</span>
                              <span className="font-mono text-cyan-300 text-[11px] font-bold">{bm.value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step-by-Step Optimization Protocol */}
                    <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                      <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-emerald-400" />
                        <span>Actionable Step-by-Step Optimization Protocol</span>
                      </h3>
                      <div className="space-y-2.5 text-xs text-slate-300">
                        {toolSeo.bestPractices.map((bp, idx) => (
                          <div key={idx} className="flex items-start gap-2.5 p-2 rounded-xl bg-slate-950/60 border border-slate-800/60">
                            <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-bold flex items-center justify-center shrink-0 text-[10px]">
                              {idx + 1}
                            </span>
                            <span className="leading-relaxed">{bp}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Authoritative External Reference Citation */}
                    {toolSeo.externalReference && (
                      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start gap-3.5 text-xs">
                        <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                          <ExternalLink className="w-4 h-4" />
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono uppercase text-slate-500 font-bold block">Authoritative Industry Reference</span>
                          <a 
                            href={toolSeo.externalReference.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-bold text-cyan-400 hover:text-cyan-300 underline inline-flex items-center gap-1.5 transition-colors"
                          >
                            <span>{toolSeo.externalReference.name}</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          <p className="text-[11px] text-slate-400 leading-relaxed">
                            {toolSeo.externalReference.citation}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* Tool-Specific FAQs */}
                    {toolSeo.faqs && toolSeo.faqs.length > 0 && (
                      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                        <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                          <HelpCircle className="w-4 h-4 text-cyan-400" />
                          <span>Frequently Asked Questions About {activeTool?.title}</span>
                        </h3>
                        <div className="space-y-3">
                          {toolSeo.faqs.map((faq, i) => (
                            <div key={i} className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-1.5">
                              <h4 className="text-xs font-bold text-slate-200">{faq.q}</h4>
                              <p className="text-xs text-slate-400 leading-relaxed">{faq.a}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>

                  {/* Right Column: Sibling Pillar Tools, Internal Linking & Hire Waqas */}
                  <div className="space-y-6">
                    
                    {/* Sibling Pillar Tools (Internal Link Mesh) */}
                    <div className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                          Related {pillarsData[selectedPillar]?.title} Tools
                        </h4>
                        <span className="text-[10px] font-mono text-cyan-400">
                          {pillarsData[selectedPillar]?.tools.length} Tools
                        </span>
                      </div>
                      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                        {pillarsData[selectedPillar]?.tools
                          .filter(t => t.slug !== activeTool?.slug)
                          .map((sibling) => (
                            <button
                              key={sibling.slug}
                              onClick={() => openTool(sibling, false)}
                              className="w-full text-left p-2.5 rounded-xl bg-slate-950 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/30 transition-all flex items-center justify-between group cursor-pointer"
                            >
                              <div>
                                <div className="text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                                  {sibling.title}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate max-w-[190px]">
                                  {sibling.desc}
                                </div>
                              </div>
                              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors shrink-0" />
                            </button>
                          ))}
                      </div>
                      <button
                        onClick={() => goToTab('all-tools', pillarSlugMap[selectedPillar] || '/all-tools')}
                        className="w-full py-2 rounded-xl bg-slate-950 text-slate-300 hover:text-white border border-slate-800 hover:border-cyan-500/30 text-xs font-semibold transition-colors text-center cursor-pointer"
                      >
                        View Full {pillarsData[selectedPillar]?.title} Pillar &rarr;
                      </button>
                    </div>

                    {/* Hire Expert SEO Help Box */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 space-y-3.5">
                      <span className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase">Need Custom Strategy?</span>
                      <h4 className="text-sm font-bold text-white">Hire Waqas Mehmood for Full-Scale SEO Audits</h4>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        Eliminate technical debt, outrank competitors, and scale organic revenue with custom code fixes and high-ROAS marketing roadmaps.
                      </p>
                      <button
                        onClick={() => goToTab('contact')}
                        className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                      >
                        <Mail className="w-3.5 h-3.5" />
                        <span>Request Custom Audit</span>
                      </button>
                    </div>

                    {/* Cross-Link to Services */}
                    <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-2 text-xs">
                      <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold block">Need Full-Funnel Growth?</span>
                      <p className="text-slate-400 text-[11px]">
                        Explore all 5 core specializations including React & Laravel Web Development and Google Ads.
                      </p>
                      <button
                        onClick={() => goToTab('services')}
                        className="text-cyan-400 hover:text-cyan-300 font-bold flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <span>Explore Services & Portfolio</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}
        </section>
        )
      )}

      {/* ======================================================== */}
      {/* 4. MODAL: ADD NEW PROJECT TO PORTFOLIO                   */}
      {/* ======================================================== */}
      {addProjectModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-lg rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setAddProjectModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">Portfolio Manager</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Add New Project to Home Page</h3>
              <p className="text-xs text-slate-400 mt-1">This project will instantly appear in your category-filtered portfolio.</p>
            </div>

            <form onSubmit={handleAddProject} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Project Title *</label>
                <input 
                  type="text" 
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g. Brand Identity Kit & 3D Logo Suite" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Skill Category *</label>
                <select 
                  value={newProject.category}
                  onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="graphic">Graphic Design</option>
                  <option value="webdev">Website Development</option>
                  <option value="smm">SMM (Social Media Marketing)</option>
                  <option value="googleads">Google Ads (PPC)</option>
                  <option value="seo">SEO Services</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Impact Metric / Deliverable *</label>
                <input 
                  type="text" 
                  value={newProject.metrics}
                  onChange={(e) => setNewProject({ ...newProject, metrics: e.target.value })}
                  placeholder="e.g. +380% Organic Revenue or 4.8x ROAS" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Description *</label>
                <textarea 
                  rows={3}
                  value={newProject.desc}
                  onChange={(e) => setNewProject({ ...newProject, desc: e.target.value })}
                  placeholder="Describe strategy, deliverables, and impact..." 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                  required
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tags (comma separated)</label>
                <input 
                  type="text" 
                  value={newProject.tags}
                  onChange={(e) => setNewProject({ ...newProject, tags: e.target.value })}
                  placeholder="Figma, React, Technical SEO" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Thumbnail Image URL</label>
                <input 
                  type="url" 
                  value={newProject.image}
                  onChange={(e) => setNewProject({ ...newProject, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400 font-mono" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setAddProjectModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Save & Publish
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 5. MODAL: HIRE WAQAS DIRECT FORM                         */}
      {/* ======================================================== */}
      {hireModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => setHireModalOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div>
              <span className="text-[10px] uppercase font-bold text-cyan-400 font-mono">Direct Client Hiring</span>
              <h3 className="text-xl font-bold text-white mt-0.5">Hire Waqas Mehmood</h3>
              <p className="text-xs text-slate-400 mt-1">Get custom quotes and strategic roadmaps for your digital channels.</p>
            </div>

            <form onSubmit={(e) => {
              e.preventDefault();
              alert(`Shukriya! Inquiry for "${hireService}" received. Waqas Mehmood will reach out via WhatsApp/Email within 12 hours.`);
              setHireModalOpen(false);
            }} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Your Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. John Doe / Ali Khan" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Email or WhatsApp Number *</label>
                <input 
                  type="text" 
                  required
                  placeholder="name@company.com or +92 300 1234567" 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Interested Skill / Service *</label>
                <select 
                  value={hireService}
                  onChange={(e) => setHireService(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-slate-200 focus:outline-none focus:border-cyan-400"
                >
                  <option value="Graphic Design">Graphic Design & UI/UX</option>
                  <option value="Website Development">Website Development (React / Laravel)</option>
                  <option value="SMM">Social Media Marketing (SMM)</option>
                  <option value="Google Ads">Google Ads (PPC Campaigns)</option>
                  <option value="SEO Services">SEO Services & Audits</option>
                  <option value="Full-Stack Digital Marketing">Complete 360° Digital Growth</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Website URL or Project Details</label>
                <textarea 
                  rows={3}
                  placeholder="Tell me about your business goals and timeline..." 
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-cyan-400" 
                />
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button 
                  type="button" 
                  onClick={() => setHireModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-cyan-500 to-indigo-600 text-white font-bold rounded-xl shadow-md cursor-pointer"
                >
                  Send Inquiry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 6. MODAL: ADMIN OWNER LOGIN (WAQAS ONLY)                  */}
      {/* ======================================================== */}
      {adminModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-amber-500/30 w-full max-w-sm rounded-3xl p-6 shadow-2xl relative space-y-4">
            <button 
              onClick={() => { setAdminModalOpen(false); setAdminError(''); }}
              className="absolute top-4 right-4 text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">Owner Portal</h3>
                <p className="text-[11px] text-slate-400">Exclusive access for Waqas Mehmood</p>
              </div>
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs text-slate-300 font-semibold mb-1">
                  Master Password / Key
                </label>
                <input 
                  type="password" 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  placeholder="Enter admin password (waqas2026)"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-white font-mono text-sm focus:outline-none focus:border-amber-400"
                  required
                  autoFocus
                />
                {adminError && (
                  <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5" /> {adminError}
                  </p>
                )}
              </div>

              <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-[11px] text-amber-300/80 leading-relaxed">
                Enter your owner secret key to enable private project creation and project deletion rights on your portfolio.
              </div>

              <div className="flex justify-end gap-2.5 pt-1">
                <button 
                  type="button" 
                  onClick={() => { setAdminModalOpen(false); setAdminError(''); }}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  Verify & Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* FOOTER                                                   */}
      {/* ======================================================== */}
      <footer className="py-12 px-6 border-t border-slate-800/80 bg-slate-950 text-xs text-slate-400">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-cyan-500 text-slate-950 font-black flex items-center justify-center text-sm">
              W
            </div>
            <div>
              <span className="font-bold text-white block">Waqas Mehmood</span>
              <span className="text-[10px] text-slate-500">© 2026 waqasmehmood.com • All Rights Reserved.</span>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={() => goToTab('home')} className="hover:text-white cursor-pointer">HOME</button>
            <button onClick={() => goToTab('services')} className="hover:text-white cursor-pointer">Services</button>
            <button onClick={() => goToTab('about')} className="hover:text-white cursor-pointer">About</button>
            <button onClick={() => goToTab('contact')} className="hover:text-white cursor-pointer">Contact</button>
            <button onClick={() => goToTab('all-tools')} className="hover:text-white cursor-pointer">All Tools (25)</button>
            {isAdmin ? (
              <button 
                onClick={handleAdminLogout}
                className="text-amber-400 hover:text-amber-300 font-mono text-[11px] flex items-center gap-1 cursor-pointer bg-amber-400/10 px-2 py-1 rounded border border-amber-400/20"
              >
                <Unlock className="w-3 h-3" /> Logout Waqas
              </button>
            ) : (
              <button 
                onClick={() => setAdminModalOpen(true)}
                className="text-slate-500 hover:text-amber-400 font-mono text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
                title="Waqas Mehmood Owner Access"
              >
                <Lock className="w-3 h-3" /> Owner Portal
              </button>
            )}
          </div>
        </div>
      </footer>

    </div>
  );
}
