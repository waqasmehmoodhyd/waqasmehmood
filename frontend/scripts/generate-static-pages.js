import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_SEO_DATA, PARTNER_RESOURCES } from '../src/data/toolsSeoData.js';
import { CITIES_DATA } from '../src/data/citiesData.js';
import { BLOG_POSTS } from '../src/data/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const ROOT_DIR = path.resolve(__dirname, '../../');

if (!fs.existsSync(DIST_DIR)) {
  console.error('Error: dist directory does not exist. Run vite build first.');
  process.exit(1);
}

const templatePath = path.join(DIST_DIR, 'index.html');
const baseTemplate = fs.readFileSync(templatePath, 'utf8');

// Global navigation header for crawlable pre-rendered HTML
const renderHeader = (currentPath) => `
<a href="#main-content" class="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:px-4 focus:py-2 focus:bg-cyan-500 focus:text-slate-950 font-bold rounded-lg shadow-lg">Skip to main content</a>
<header class="w-full border-b border-slate-800 bg-[#070b15]/90 py-4 px-6 sticky top-0 z-50">
  <div class="max-w-7xl mx-auto flex items-center justify-between">
    <a href="/" class="flex items-center gap-3 text-white font-bold text-lg hover:text-cyan-400 transition-colors">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-black text-sm">WM</div>
      <span>Waqas Mehmood</span>
    </a>
    <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300" aria-label="Main Navigation">
      <a href="/" class="hover:text-cyan-400 transition-colors ${currentPath === '/' ? 'text-cyan-400 font-semibold' : ''}">Home</a>
      <a href="/services" class="hover:text-cyan-400 transition-colors ${currentPath === '/services' ? 'text-cyan-400 font-semibold' : ''}">Services</a>
      <a href="/all-tools" class="hover:text-cyan-400 transition-colors ${currentPath === '/all-tools' ? 'text-cyan-400 font-semibold' : ''}">All Tools</a>
      <a href="/blog" class="hover:text-cyan-400 transition-colors ${currentPath === '/blog' ? 'text-cyan-400 font-semibold' : ''}">Blog</a>
      <a href="/on-page-seo" class="hover:text-cyan-400 transition-colors ${currentPath === '/on-page-seo' ? 'text-cyan-400 font-semibold' : ''}">On-Page</a>
      <a href="/technical-seo" class="hover:text-cyan-400 transition-colors ${currentPath === '/technical-seo' ? 'text-cyan-400 font-semibold' : ''}">Technical</a>
      <a href="/local-seo" class="hover:text-cyan-400 transition-colors ${currentPath === '/local-seo' ? 'text-cyan-400 font-semibold' : ''}">Local SEO</a>
      <a href="/about" class="hover:text-cyan-400 transition-colors ${currentPath === '/about' ? 'text-cyan-400 font-semibold' : ''}">About</a>
      <a href="/contact" class="hover:text-cyan-400 transition-colors ${currentPath === '/contact' ? 'text-cyan-400 font-semibold' : ''}">Contact</a>
    </nav>
    <a href="/contact" class="px-4 py-2 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white hover:opacity-90 transition-all">Hire Waqas</a>
  </div>
</header>
`;

// Global crawlable footer with extensive contextual internal links
const renderFooter = () => `
<footer class="w-full border-t border-slate-800 bg-[#050811] py-12 px-6 text-slate-400 text-xs">
  <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
    <div>
      <div class="flex items-center gap-2 text-white font-bold text-base mb-3">
        <span class="w-6 h-6 rounded-lg bg-cyan-500 text-slate-950 flex items-center justify-center text-xs font-black">WM</span>
        Waqas Mehmood
      </div>
      <p class="leading-relaxed mb-4">Senior SEO Specialist, Growth Engineer & Full-Stack Developer providing high-impact SEO management, technical audits, and 28 free in-house digital marketing tools.</p>
      
      <div class="mb-4">
        <span class="text-[11px] font-mono text-slate-400 uppercase tracking-wider block mb-2 font-bold text-cyan-400">Connect & Follow:</span>
        <div class="flex items-center gap-3">
          <a href="https://linkedin.com/in/waqasmehmood" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors" title="LinkedIn">LinkedIn</a>
          <span>•</span>
          <a href="https://wa.me/923003083161" target="_blank" rel="noopener noreferrer" class="hover:text-emerald-400 transition-colors" title="WhatsApp">WhatsApp</a>
          <span>•</span>
          <a href="https://x.com/waqasmehmood" target="_blank" rel="noopener noreferrer" class="hover:text-cyan-400 transition-colors" title="X (Twitter)">X</a>
          <span>•</span>
          <a href="https://github.com/waqasmehmood" target="_blank" rel="noopener noreferrer" class="hover:text-white transition-colors" title="GitHub">GitHub</a>
        </div>
      </div>

      <p class="text-slate-500">&copy; ${new Date().getFullYear()} Waqas Mehmood. All rights reserved.</p>
    </div>
    <div>
      <h3 class="text-white font-semibold text-sm mb-3">Core Pillars</h3>
      <ul class="space-y-2">
        <li><a href="/on-page-seo" class="hover:text-cyan-400">One Page SEO Tools</a></li>
        <li><a href="/off-page-seo" class="hover:text-cyan-400">Off Page & Backlink Tools</a></li>
        <li><a href="/technical-seo" class="hover:text-cyan-400">Technical SEO & Schema</a></li>
        <li><a href="/local-seo" class="hover:text-cyan-400">Local SEO & Google Business</a></li>
        <li><a href="/ai-tools" class="hover:text-cyan-400">Free AI Tools</a></li>
        <li><a href="/blog" class="hover:text-cyan-400 font-semibold text-cyan-400">SEO & Growth Blog &rarr;</a></li>
      </ul>
    </div>
    <div>
      <h3 class="text-white font-semibold text-sm mb-3">Featured Free Tools</h3>
      <ul class="space-y-2">
        <li><a href="/tools/website-seo-checker" class="hover:text-cyan-400">Website SEO Checker</a></li>
        <li><a href="/tools/keyword-density-checker" class="hover:text-cyan-400">Keyword Density Checker</a></li>
        <li><a href="/tools/heading-checker" class="hover:text-cyan-400">Heading Checker (H1-H6)</a></li>
        <li><a href="/tools/broken-link-checker" class="hover:text-cyan-400">Broken Link Checker</a></li>
        <li><a href="/tools/schema-markup-validator" class="hover:text-cyan-400">Schema Markup Validator</a></li>
        <li><a href="/tools/website-crawler" class="hover:text-cyan-400">Free AI Website Crawler</a></li>
        <li><a href="/tools/ai-math-solver" class="hover:text-cyan-400">Free AI Math Solver</a></li>
      </ul>
    </div>
    <div>
      <h3 class="text-white font-semibold text-sm mb-3">Local SEO Locations</h3>
      <ul class="space-y-2">
        <li><a href="/seo-expert-in-hyderabad" class="hover:text-cyan-400">SEO Expert in Hyderabad</a></li>
        <li><a href="/locations/karachi" class="hover:text-cyan-400">SEO Expert in Karachi</a></li>
        <li><a href="/locations/lahore" class="hover:text-cyan-400">SEO Specialist Lahore</a></li>
        <li><a href="/locations/islamabad" class="hover:text-cyan-400">SEO Consultant Islamabad</a></li>
        <li><a href="/contact" class="hover:text-cyan-400 font-semibold text-cyan-400">Request Custom SEO Audit &rarr;</a></li>
      </ul>
    </div>
  </div>
</footer>
`;

// Helper to assemble full HTML for any route
function generatePageHtml(options) {
  const {
    path: pagePath,
    title,
    description,
    canonicalPath = pagePath,
    robots = 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    schemaJson,
    contentHtml
  } = options;

  let html = baseTemplate;

  // 1. Replace Title
  html = html.replace(/<title>.*?<\/title>/s, () => `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/s, () => `<meta name="title" content="${title}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, () => `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta property="twitter:title" content=".*?" \/>/s, () => `<meta property="twitter:title" content="${title}" />`);

  // 2. Replace Description
  html = html.replace(/<meta name="description" content=".*?" \/>/s, () => `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, () => `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta property="twitter:description" content=".*?" \/>/s, () => `<meta property="twitter:description" content="${description}" />`);

  // 3. Replace Canonical & OG URL (Self-referencing!)
  const fullCanonicalUrl = `https://waqasmehmood.com${canonicalPath === '/' ? '' : canonicalPath}`;
  html = html.replace(/<link rel="canonical" href=".*?" \/>/s, () => `<link rel="canonical" href="${fullCanonicalUrl}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, () => `<meta property="og:url" content="${fullCanonicalUrl}" />`);
  html = html.replace(/<meta property="twitter:url" content=".*?" \/>/s, () => `<meta property="twitter:url" content="${fullCanonicalUrl}" />`);

  // 4. Replace Robots
  html = html.replace(/<meta name="robots" content=".*?" \/>/s, `<meta name="robots" content="${robots}" />`);

  // 4.5 Ensure Open Graph & Twitter Social Image Cards (1200x630)
  const ogImageUrl = options.image || 'https://waqasmehmood.com/og-image.png';
  if (html.includes('property="og:image"')) {
    html = html.replace(/<meta property="og:image" content=".*?" \/>/s, `<meta property="og:image" content="${ogImageUrl}" />`);
  } else {
    html = html.replace('</head>', `  <meta property="og:image" content="${ogImageUrl}" />\n  <meta property="og:image:width" content="1200" />\n  <meta property="og:image:height" content="630" />\n  <meta property="og:image:alt" content="Waqas Mehmood - Best SEO Expert, Specialist & Growth Architect" />\n</head>`);
  }
  if (html.includes('name="twitter:image"') || html.includes('property="twitter:image"')) {
    html = html.replace(/<meta (name|property)="twitter:image" content=".*?" \/>/s, `<meta name="twitter:image" content="${ogImageUrl}" />`);
  } else {
    html = html.replace('</head>', `  <meta name="twitter:image" content="${ogImageUrl}" />\n</head>`);
  }

  // 5. Injected JSON-LD schema if provided
  if (schemaJson) {
    const schemaTag = `<script type="application/ld+json">\n${JSON.stringify(schemaJson, null, 2)}\n</script>`;
    html = html.replace('</head>', `  ${schemaTag}\n</head>`);
  }

  // 6. Inject crawlable semantic pre-rendered HTML into <div id="root">
  const rootContent = `
<div id="root">
  ${renderHeader(pagePath)}
  <main class="w-full max-w-7xl mx-auto px-6 py-12 min-h-screen text-slate-200" id="main-content">
    ${contentHtml}
  </main>
  ${renderFooter()}
</div>
  `.trim();

  html = html.replace(/<div id="root"><\/div>/s, rootContent);

  return html;
}

// Write file helper ensuring parent directory exists
function writeRouteFile(routePath, htmlContent) {
  let targetPath;
  if (routePath === '/' || routePath === '') {
    targetPath = path.join(DIST_DIR, 'index.html');
  } else if (routePath === '/404' || routePath === '404.html') {
    targetPath = path.join(DIST_DIR, '404.html');
  } else {
    const cleanRoute = routePath.replace(/^\//, '').replace(/\/$/, '');
    const dirPath = path.join(DIST_DIR, cleanRoute);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
    targetPath = path.join(dirPath, 'index.html');
  }

  fs.writeFileSync(targetPath, htmlContent, 'utf8');
}

console.log('--- Starting Waqas Mehmood SSG & Pre-Rendering Engine ---');

const generatedRoutes = [];

// =========================================================================
// 1. HOMEPAGE (/)
// =========================================================================
const homeHtml = `
<section class="mb-16">
  <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
    <span>Verified Senior SEO Specialist & Growth Engineer</span>
  </div>
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6 leading-tight">
    Waqas Mehmood - Best SEO Expert, SEO Specialist & Growth Engineer
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    Waqas Mehmood is a Senior SEO Specialist and Growth Engineer based in Pakistan, helping global B2B, SaaS, and regional businesses scale compounding search traffic. Specializations include developer-level technical SEO audits, on-page topical siloing, Local SEO 3-Pack rankings, and 27 proprietary in-house SEO diagnostic tools.
  </p>
  <div class="flex flex-wrap items-center gap-4 mb-12">
    <a href="/services" class="px-6 py-3 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white shadow-lg hover:shadow-cyan-500/25 transition-all">Explore SEO Services</a>
    <a href="/all-tools" class="px-6 py-3 rounded-xl font-bold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-white transition-all">Launch 27 Free SEO Tools</a>
    <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-slate-900 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-white transition-all">Get in Touch</a>
  </div>
</section>

<section class="mb-16 grid grid-cols-1 md:grid-cols-4 gap-6">
  <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div class="text-3xl font-black text-cyan-400 mb-1">10+ Years</div>
    <div class="text-xs text-slate-400 font-medium">Digital Marketing & SEO Engineering</div>
  </div>
  <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div class="text-3xl font-black text-indigo-400 mb-1">27 In-House</div>
    <div class="text-xs text-slate-400 font-medium">Native Free On-Page & Technical SEO Tools</div>
  </div>
  <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div class="text-3xl font-black text-emerald-400 mb-1">340% Avg</div>
    <div class="text-xs text-slate-400 font-medium">Organic Revenue & Ranking Growth</div>
  </div>
  <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
    <div class="text-3xl font-black text-amber-400 mb-1">Sub-Second</div>
    <div class="text-xs text-slate-400 font-medium">Core Web Vitals & PageSpeed Architecture</div>
  </div>
</section>

<!-- AEO DIRECT ANSWER: WHAT SEO SERVICES -->
<section class="mb-16" id="what-seo-services">
  <div class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
    <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">Direct Answer • AEO & Search Intent</span>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">What SEO Services Does Waqas Mehmood Provide?</h2>
    <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
      Waqas Mehmood provides end-to-end SEO services covering comprehensive technical SEO audits, Core Web Vitals optimization, on-page topical keyword siloing, high-intent Local SEO Google Maps 3-Pack rankings, and dedicated monthly SEO management. Every retainer is paired with 27 free proprietary in-house diagnostic tools built natively for deep DOM analysis.
    </p>
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-xs">
      <a href="/technical-seo" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all block">
        <div class="font-bold text-cyan-400 mb-1">Technical SEO Audits</div>
        <div class="text-slate-400 text-[11px]">Crawl budget, status codes & schema</div>
      </a>
      <a href="/local-seo" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all block">
        <div class="font-bold text-emerald-400 mb-1">Local SEO 3-Pack</div>
        <div class="text-slate-400 text-[11px]">Google Business & NAP citations</div>
      </a>
      <a href="/on-page-seo" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all block">
        <div class="font-bold text-indigo-400 mb-1">On-Page Architecture</div>
        <div class="text-slate-400 text-[11px]">Keyword clusters & semantic headings</div>
      </a>
      <a href="/off-page-seo" class="p-4 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-slate-200 hover:text-white transition-all block">
        <div class="font-bold text-amber-400 mb-1">White-Hat Authority</div>
        <div class="text-slate-400 text-[11px]">Contextual backlinks & link audits</div>
      </a>
    </div>
  </div>
</section>

<!-- AEO DIRECT ANSWER: TECHNICAL SEO AUDIT -->
<section class="mb-16" id="technical-seo-audit">
  <div class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
    <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">Definition & Diagnostic Standards</span>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">What Is a Technical SEO Audit?</h2>
    <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
      A technical SEO audit is a review of website infrastructure factors that affect how search engine bots crawl, render, index, and rank web pages. It evaluates indexability status codes, robots.txt directives, XML sitemaps, canonical tags, redirect chains, JSON-LD structured data, and mobile Core Web Vitals (LCP, INP, CLS) to eliminate architectural bottlenecks.
    </p>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs text-slate-300">
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">✓ Crawlability & Indexation</div>
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">✓ Canonical & Redirect Paths</div>
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">✓ JSON-LD Schema Validation</div>
      <div class="p-3 rounded-lg bg-slate-950 border border-slate-800">✓ Core Web Vitals & Speed</div>
    </div>
  </div>
</section>

<!-- AEO DIRECT ANSWER: LOCAL SEO -->
<section class="mb-16" id="local-seo-ranking">
  <div class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800">
    <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">Actionable Local Strategy</span>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">How Can Local SEO Help a Business?</h2>
    <p class="text-slate-300 text-sm md:text-base leading-relaxed mb-6">
      Local SEO helps physical and service-area businesses capture high-converting customers searching in their immediate geographic market. Waqas Mehmood executes a proven 3-stage local search roadmap:
    </p>
    <ol class="space-y-4 text-xs sm:text-sm text-slate-300 list-decimal list-inside">
      <li class="p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
        <strong class="text-white">Google Business Profile (GBP) Optimization:</strong> Selecting dominant primary categories, creating complete geo-attribute profiles, and publishing regular product updates.
      </li>
      <li class="p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
        <strong class="text-white">100% Consistent NAP Citations:</strong> Aligning Name, Address, and Phone Number across all major business directories to build unbreakable local entity confidence.
      </li>
      <li class="p-3 rounded-xl bg-slate-950 border border-slate-800 leading-relaxed">
        <strong class="text-white">Localized Landing Pages & Schema:</strong> Structuring city-specific landing pages (such as <a href="/seo-expert-in-hyderabad" class="text-cyan-400 hover:underline">Hyderabad</a>, <a href="/locations/karachi" class="text-cyan-400 hover:underline">Karachi</a>, <a href="/locations/lahore" class="text-cyan-400 hover:underline">Lahore</a>, and <a href="/locations/islamabad" class="text-cyan-400 hover:underline">Islamabad</a>) with nested LocalBusiness schema markup.
      </li>
    </ol>
  </div>
</section>

<!-- AEO COMPARISON TABLE: SEO VS GOOGLE ADS -->
<section class="mb-16" id="seo-vs-google-ads">
  <div class="p-8 rounded-3xl bg-slate-900/70 border border-slate-800 overflow-x-auto">
    <span class="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400 mb-2 block">Strategic Comparison Table</span>
    <h2 class="text-2xl md:text-3xl font-bold text-white mb-4">SEO vs. Google Ads: What Is the Difference?</h2>
    <p class="text-slate-300 text-xs sm:text-sm leading-relaxed mb-6">
      Understanding when to deploy organic search optimization versus paid search advertising maximizes total marketing blended return on investment (ROAS):
    </p>
    <table class="w-full text-left text-xs sm:text-sm text-slate-300 border-collapse min-w-[550px]">
      <thead>
        <tr class="border-b border-slate-800 text-white font-mono text-xs uppercase bg-slate-950/60">
          <th class="p-3 font-semibold text-cyan-400">Evaluation Metric</th>
          <th class="p-3 font-semibold text-white">Organic Search (SEO)</th>
          <th class="p-3 font-semibold text-indigo-400">Google Ads (PPC)</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-slate-800/60">
        <tr>
          <td class="p-3 font-medium text-white">Time to Results</td>
          <td class="p-3">2–4 weeks (technical), 3–6 months (commercial keywords)</td>
          <td class="p-3">Instant (traffic begins within hours of campaign launch)</td>
        </tr>
        <tr>
          <td class="p-3 font-medium text-white">Cost Structure</td>
          <td class="p-3">Fixed investment with zero per-click media fees</td>
          <td class="p-3">Pay-Per-Click (PPC) media fees on every user visit</td>
        </tr>
        <tr>
          <td class="p-3 font-medium text-white">Traffic Longevity</td>
          <td class="p-3">Compounding equity; rankings persist without monthly ad spend</td>
          <td class="p-3">Immediate stop; traffic ceases the moment daily budget depletes</td>
        </tr>
        <tr>
          <td class="p-3 font-medium text-white">Click-Through Rate (CTR)</td>
          <td class="p-3">60%–70% of search clicks go to organic organic listings</td>
          <td class="p-3">2%–5% average CTR across competitive search keywords</td>
        </tr>
        <tr>
          <td class="p-3 font-medium text-white">Recommended Strategy</td>
          <td class="p-3 text-cyan-300" colspan="2">Combine Google Ads search query intelligence with long-term Organic SEO siloing for maximum blended ROAS.</td>
        </tr>
      </tbody>
    </table>
  </div>
</section>

<!-- 4 PILLARS DIRECTORY -->
<section class="mb-16">
  <h2 class="text-2xl md:text-3xl font-bold text-white mb-6">Four Pillars of Organic Search Dominance</h2>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div class="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all">
      <h3 class="text-xl font-bold text-cyan-400 mb-3"><a href="/on-page-seo" class="hover:underline">1. One Page SEO (10 Free Analyzers)</a></h3>
      <p class="text-slate-300 text-sm leading-relaxed mb-4">Deep DOM keyword density checks, meta tag length analysis, H1-H6 heading hierarchy validation, SERP visualizers, and content uniqueness scoring.</p>
      <a href="/on-page-seo" class="text-xs font-semibold text-cyan-400 hover:text-cyan-300">Open One-Page SEO Suite &rarr;</a>
    </div>
    <div class="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all">
      <h3 class="text-xl font-bold text-indigo-400 mb-3"><a href="/off-page-seo" class="hover:underline">2. Off Page SEO & Backlink Analyzers</a></h3>
      <p class="text-slate-300 text-sm leading-relaxed mb-4">Backlink readiness testing, domain authority signals, referring domain diversity, and anchor text over-optimization risk detection.</p>
      <a href="/off-page-seo" class="text-xs font-semibold text-indigo-400 hover:text-indigo-300">Explore Backlink Tools &rarr;</a>
    </div>
    <div class="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all">
      <h3 class="text-xl font-bold text-emerald-400 mb-3"><a href="/technical-seo" class="hover:underline">3. Technical SEO & Schema Markup</a></h3>
      <p class="text-slate-300 text-sm leading-relaxed mb-4">Core Web Vitals TTFB testing, XML sitemap validation, robots.txt bot directives analysis, and JSON-LD structured data validation.</p>
      <a href="/technical-seo" class="text-xs font-semibold text-emerald-400 hover:text-emerald-300">Run Technical SEO Tools &rarr;</a>
    </div>
    <div class="p-8 rounded-2xl bg-slate-900/50 border border-slate-800 hover:border-cyan-500/40 transition-all">
      <h3 class="text-xl font-bold text-amber-400 mb-3"><a href="/local-seo" class="hover:underline">4. Local SEO & Google Business Profile</a></h3>
      <p class="text-slate-300 text-sm leading-relaxed mb-4">Google Maps 3-Pack rank tracking, NAP consistency verification across citations, and LocalBusiness schema generators.</p>
      <a href="/local-seo" class="text-xs font-semibold text-amber-400 hover:text-amber-300">Audit Local SEO Signals &rarr;</a>
    </div>
  </div>
</section>

<!-- FREQUENTLY ASKED QUESTIONS (AEO STRUCTURED) -->
<section class="mb-16" id="faq">
  <h2 class="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
  <div class="space-y-4">
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">What SEO services does Waqas Mehmood provide?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Waqas Mehmood provides end-to-end SEO services including comprehensive technical SEO audits, Core Web Vitals remediation, on-page topical siloing, Local SEO Google Maps 3-Pack rankings, and 27 proprietary in-house diagnostic tools.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">What is a technical SEO audit and how often should it be conducted?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">A technical SEO audit evaluates infrastructure factors affecting crawlability, indexation, rendering, and Core Web Vitals. An in-depth audit should be performed quarterly or before any major website redesign or CMS migration.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">How long does it take to see real results from SEO?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Technical SEO fixes and indexation corrections show diagnostic improvements within 2 to 4 weeks. High-intent commercial rankings typically mature within 3 to 6 months as topical authority builds.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">What makes your 27 in-house SEO tools different from SaaS tools?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Our 27 tools are custom written natively in PHP Laravel without third-party API dependencies or paywalls. They perform direct live DOM parsing, providing transparent and instant SEO insights without sign-up friction.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">Can you manage both Google Ads and Organic SEO simultaneously?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Yes, combining PPC with organic SEO is optimal. Converting search query data from Google Ads directly informs the organic content strategy, while first-page organic rankings allow reducing expensive ad spend on high-volume terms.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">How does Generative Engine Optimization (GEO) differ from traditional SEO?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Generative Engine Optimization (GEO) focuses on structuring content with direct factual definitions, semantic JSON-LD schema, and verifiable entity proof so AI answer engines like ChatGPT, Perplexity, and Google AI Overviews can accurately cite your website as an authoritative source.</p>
    </div>
  </div>
</section>
`;

writeRouteFile('/', generatePageHtml({
  path: '/',
  title: 'Best SEO Expert & SEO Specialist in 2026 | Waqas Mehmood',
  description: "Hire Waqas Mehmood, Pakistan's top SEO expert & specialist providing proven enterprise SEO services, technical audits, and 28 free tools. Get a free proposal today!",
  contentHtml: homeHtml
}));
generatedRoutes.push('/');

// =========================================================================
// 2. SERVICES (/services)
// =========================================================================
const servicesHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">Services</li>
  </ol>
</nav>
<section class="mb-16">
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
    Best SEO Services & Dedicated SEO Management
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    Looking for a reliable, technical partner to take complete ownership of your search engine rankings? Waqas Mehmood provides end-to-end SEO services and monthly SEO management retainers that bridge the gap between technical software development and aggressive growth marketing.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
    <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
      <h2 class="text-lg font-bold text-cyan-400 mb-2">Technical SEO Audits</h2>
      <p class="text-slate-300 text-xs leading-relaxed">Fix crawl errors, JavaScript rendering issues, redirect loops, and Core Web Vitals to maximize Google crawl budget efficiency.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
      <h2 class="text-lg font-bold text-indigo-400 mb-2">On-Page Content Siloing</h2>
      <p class="text-slate-300 text-xs leading-relaxed">Topical authority clustering, keyword intent mapping, meta optimization, and internal anchor text hierarchy.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800">
      <h2 class="text-lg font-bold text-emerald-400 mb-2">White-Hat Link Authority</h2>
      <p class="text-slate-300 text-xs leading-relaxed">High-relevance contextual backlinks, digital PR outreach, and competitor link profile interception.</p>
    </div>
  </div>
  <div class="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40">
    <h3 class="text-xl font-bold text-white mb-2">Ready to scale your organic search traffic?</h3>
    <p class="text-slate-300 text-sm mb-6">Schedule a 1-on-1 discovery session with Waqas Mehmood and receive a customized 6-month growth roadmap.</p>
    <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 transition-all inline-block">Contact Waqas Now</a>
  </div>
</section>
`;

writeRouteFile('/services', generatePageHtml({
  path: '/services',
  title: 'Best SEO Services & SEO Management (2026) | Waqas Mehmood',
  description: 'Hire Waqas Mehmood for high-ROAS SEO management, technical audits, link building, and organic scaling. Get your custom data-driven SEO proposal today!',
  contentHtml: servicesHtml
}));
generatedRoutes.push('/services');

// =========================================================================
// 3. ABOUT (/about)
// =========================================================================
const aboutHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">About</li>
  </ol>
</nav>
<section class="mb-16">
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
    About Waqas Mehmood | Senior SEO Specialist & Engineer
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    Waqas Mehmood is a Senior SEO Strategist, Full-Stack Software Engineer, and Digital Growth Architect with more than 10 years of experience delivering high-converting organic acquisition funnels.
  </p>
  <div class="space-y-6 text-slate-300 text-sm leading-relaxed max-w-3xl">
    <p>Unlike traditional SEO consultants who rely solely on third-party PDF generators, Waqas is a software developer fluent in React.js, Vite, PHP Laravel, Apache, and Linux server environments. He personally diagnoses source code bottlenecks, implements JSON-LD rich snippet schema, and fine-tunes Core Web Vitals to sub-second load times.</p>
    <h2 class="text-xl font-bold text-white mt-8 mb-3">Proven Technical & Organic Capabilities</h2>
    <ul class="list-disc pl-5 space-y-2">
      <li><strong>Architectural Technical SEO:</strong> Solving JavaScript rendering bloat, canonical loops, 404 dead ends, and HTTP 410 permanent spam de-indexing.</li>
      <li><strong>Programmatic & Local SEO:</strong> Dominating Google Map Pack 3-Pack and geo-targeted keywords across Hyderabad, Karachi, Lahore, and Islamabad.</li>
      <li><strong>Full-Stack Tool Development:</strong> Built the 27-tool native suite on waqasmehmood.com with zero third-party API dependencies.</li>
    </ul>
    <div class="mt-8 pt-6 border-t border-slate-800">
      <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 inline-block transition-all">Work with Waqas</a>
    </div>
  </div>
</section>
`;

writeRouteFile('/about', generatePageHtml({
  path: '/about',
  title: 'About Waqas Mehmood | Best SEO Expert & Specialist',
  description: 'Learn about Waqas Mehmood, senior SEO specialist & engineer delivering full-funnel SEO services, technical audits, and organic revenue scaling. Work with us!',
  contentHtml: aboutHtml
}));
generatedRoutes.push('/about');

// =========================================================================
// 4. CONTACT (/contact)
// =========================================================================
const contactHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">Contact</li>
  </ol>
</nav>
<section class="mb-16">
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
    Contact Waqas Mehmood | Hire Best SEO Expert
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    Ready to discuss your website audit, ongoing SEO management retainer, or custom web engineering project? Get in touch directly.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
    <div class="p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
      <h2 class="text-xl font-bold text-white mb-4">Direct Contact Channels</h2>
      <div class="space-y-4 text-sm text-slate-300">
        <div>
          <span class="block text-xs text-slate-500 font-mono uppercase">Direct Email</span>
          <a href="mailto:waqasmehmoodhyd@gmail.com" class="text-cyan-400 font-semibold hover:underline">waqasmehmoodhyd@gmail.com</a>
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-mono uppercase">Direct WhatsApp</span>
          <a href="https://wa.me/923003083161" class="text-emerald-400 font-semibold hover:underline">+92 300 3083161</a>
        </div>
        <div>
          <span class="block text-xs text-slate-500 font-mono uppercase">Location</span>
          <span class="text-slate-200">Hyderabad & Karachi, Sindh, Pakistan (Available Worldwide)</span>
        </div>
      </div>
    </div>
    <div class="p-8 rounded-2xl bg-slate-900/70 border border-slate-800">
      <h2 class="text-xl font-bold text-white mb-4">Inquiry Scope</h2>
      <p class="text-xs text-slate-400 mb-4">You can reach out for:</p>
      <ul class="text-xs text-slate-300 space-y-2 list-disc pl-4">
        <li>Comprehensive Website Technical & On-Page SEO Audits</li>
        <li>Monthly Full-Service SEO Management Retainers</li>
        <li>Local SEO & Google Business Profile 3-Pack Takeover</li>
        <li>React, Vite & PHP Laravel Web Development</li>
      </ul>
    </div>
  </div>
</section>
`;

writeRouteFile('/contact', generatePageHtml({
  path: '/contact',
  title: 'Contact Waqas Mehmood | Hire Best SEO Expert (2026)',
  description: 'Get in touch with Waqas Mehmood for custom SEO audits, expert SEO services, and high-ROAS digital campaigns. Request a free consultation & quote today!',
  contentHtml: contactHtml
}));
generatedRoutes.push('/contact');

// =========================================================================
// 5. ALL TOOLS (/all-tools)
// =========================================================================
const allToolsHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">All Tools</li>
  </ol>
</nav>
<section class="mb-16">
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
    27 Free SEO Tools & Digital Analyzers
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    Explore 27 native, high-performance SEO and digital marketing tools developed by Waqas Mehmood. Free forever, zero third-party API dependencies, with instant live DOM parsing.
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    <a href="/on-page-seo" class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all">
      <h2 class="font-bold text-cyan-400 mb-1">One-Page SEO (10)</h2>
      <p class="text-xs text-slate-400">Keyword density, meta tags, SERP preview, headings, word counter.</p>
    </a>
    <a href="/off-page-seo" class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-indigo-500/50 transition-all">
      <h2 class="font-bold text-indigo-400 mb-1">Off-Page SEO (5)</h2>
      <p class="text-xs text-slate-400">Backlink checker, DA/PA, competitor backlink analyzer, anchor text.</p>
    </a>
    <a href="/technical-seo" class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-emerald-500/50 transition-all">
      <h2 class="font-bold text-emerald-400 mb-1">Technical SEO (5)</h2>
      <p class="text-xs text-slate-400">Speed check, sitemap validator, robots.txt tester, JSON-LD schema.</p>
    </a>
    <a href="/local-seo" class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-amber-500/50 transition-all">
      <h2 class="font-bold text-amber-400 mb-1">Local SEO (5)</h2>
      <p class="text-xs text-slate-400">Local rank, Google Business Profile audit, NAP consistency checker.</p>
    </a>
  </div>
</section>
`;

writeRouteFile('/all-tools', generatePageHtml({
  path: '/all-tools',
  title: '28 Free SEO Tools & Digital Analyzers | Waqas Mehmood',
  description: 'Run 28 free in-house SEO tools covering On Page SEO, Off Page SEO, Technical SEO, Local SEO, and AI Tools. 100% free with zero third-party dependencies!',
  contentHtml: allToolsHtml
}));
generatedRoutes.push('/all-tools');

// =========================================================================
// 6-10. THE 4 PILLARS & AI TOOLS
// =========================================================================
const PILLARS_CONFIG = [
  {
    path: '/on-page-seo',
    title: 'Best On-Page SEO Tools & Page Analyzers | Waqas Mehmood',
    description: 'Free On-Page SEO tools: Website SEO checker, keyword density, meta tag analyzer, SERP preview, heading checker, and broken link audit. Test your URLs free!',
    h1: 'One Page SEO Tools - 10 Free On-Page Analyzers',
    tools: [
      { slug: 'website-seo-checker', name: 'Website SEO Checker' },
      { slug: 'seo-analyzer', name: 'SEO Analyzer' },
      { slug: 'keyword-density-checker', name: 'Keyword Density Checker' },
      { slug: 'meta-tag-analyzer', name: 'Meta Tag Analyzer' },
      { slug: 'serp-snippet-preview', name: 'SERP Snippet Preview' },
      { slug: 'word-counter', name: 'Word Counter' },
      { slug: 'plagiarism-checker', name: 'Plagiarism Checker' },
      { slug: 'image-alt-checker', name: 'Image ALT Text Checker' },
      { slug: 'heading-checker', name: 'Heading Checker (H1-H6)' },
      { slug: 'broken-link-checker', name: 'Broken Link Checker' }
    ]
  },
  {
    path: '/off-page-seo',
    title: 'Off Page SEO Tools & Backlink Analyzers | Waqas Mehmood',
    description: 'Free Off-Page SEO tools: Backlink checker, DA & PA analyzer, competitor backlinks, referring domains, and anchor text analysis. Analyze backlinks free now!',
    h1: 'Off Page SEO Tools & Backlink Analyzers',
    tools: [
      { slug: 'backlink-checker', name: 'Backlink Checker' },
      { slug: 'da-pa-checker', name: 'DA & PA Checker' },
      { slug: 'competitor-backlink-analyzer', name: 'Competitor Backlink Analyzer' },
      { slug: 'referring-domains-checker', name: 'Referring Domains Checker' },
      { slug: 'anchor-text-analyzer', name: 'Anchor Text Analyzer' }
    ]
  },
  {
    path: '/technical-seo',
    title: 'Technical SEO Tools & Schema Analyzers | Waqas Mehmood',
    description: 'Free Technical SEO tools: Website speed check, technical broken links, XML sitemap validator, robots.txt tester, and Schema JSON-LD. Audit technical SEO free!',
    h1: 'Technical SEO Tools & Schema Analyzers',
    tools: [
      { slug: 'website-speed-checker', name: 'Website Speed Checker' },
      { slug: 'tech-broken-link-checker', name: 'Technical Broken Link Checker' },
      { slug: 'xml-sitemap-checker', name: 'XML Sitemap Checker' },
      { slug: 'robots-txt-tester', name: 'Robots.txt Tester' },
      { slug: 'schema-markup-validator', name: 'Schema Markup Validator' },
      { slug: 'schema-generator', name: '1-Click Schema JSON-LD Generator' }
    ]
  },
  {
    path: '/local-seo',
    title: 'Local SEO & Google Maps Ranking Tools | Waqas Mehmood',
    description: 'Free Local SEO tools: Local rank checker, Google Business Profile audit, local citation checker, and NAP consistency analyzer. Dominate Google Maps 3-Pack free!',
    h1: 'Local SEO Tools & Google Business Profile Analyzers',
    tools: [
      { slug: 'local-rank-checker', name: 'Local Rank Checker' },
      { slug: 'google-business-profile-checker', name: 'Google Business Profile Checker' },
      { slug: 'local-citation-checker', name: 'Local Citation Checker' },
      { slug: 'nap-consistency-checker', name: 'NAP Consistency Checker' },
      { slug: 'local-seo-audit-tool', name: 'Local SEO Audit Tool' }
    ]
  },
  {
    path: '/ai-tools',
    title: 'Free AI Tools & Multimodal Solvers (2026) | Waqas Mehmood',
    description: 'Explore free AI web tools by Waqas Mehmood: AI AEO & GEO Analyzer, Free AI Math Solver, Free AI Website Crawler, and PPC Calculators. Try free AI tools now!',
    h1: 'Free AI Tools & Multimodal Problem Solvers',
    tools: [
      { slug: 'ai-aeo-geo-analyzer', name: 'AI, AEO & GEO Search Engine Analyzer' },
      { slug: 'ai-math-solver', name: 'Free AI Math Solver' },
      { slug: 'website-crawler', name: 'Free AI Website Crawler & Auditor' },
      { slug: 'roas-calculator', name: 'Google Ads ROAS & Breakeven Calculator' },
      { slug: 'seo-roi-calculator', name: 'SEO ROI & Revenue Calculator' }
    ]
  }
];

for (const p of PILLARS_CONFIG) {
  const pillarHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li><a href="/all-tools" class="hover:text-cyan-400">All Tools</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">${p.h1}</li>
  </ol>
</nav>
<section class="mb-16">
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-6">
    ${p.h1}
  </h1>
  <p class="text-base md:text-lg text-slate-300 max-w-3xl mb-8 leading-relaxed">
    ${p.description}
  </p>
  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${p.tools.map(t => `
      <div class="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/50 transition-all">
        <h2 class="text-lg font-bold text-white mb-2"><a href="/tools/${t.slug}" class="hover:text-cyan-400">${t.name}</a></h2>
        <p class="text-xs text-slate-400 mb-4">Run live DOM audit and diagnostic checks directly in your browser.</p>
        <a href="/tools/${t.slug}" class="text-xs font-semibold text-cyan-400 hover:underline">Launch Tool &rarr;</a>
      </div>
    `).join('')}
  </div>
</section>
  `;

  writeRouteFile(p.path, generatePageHtml({
    path: p.path,
    title: p.title,
    description: p.description,
    contentHtml: pillarHtml
  }));
  generatedRoutes.push(p.path);
}

// =========================================================================
// 11. ALL 27 TOOLS (/tools/:slug)
// =========================================================================
for (const [slug, data] of Object.entries(TOOLS_SEO_DATA)) {
  const toolRoute = `/tools/${slug}`;
  const toolTitle = data.metaTitle;
  const toolDesc = data.metaDesc;

  const toolHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li><a href="/all-tools" class="hover:text-cyan-400">Tools</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">${slug}</li>
  </ol>
</nav>

<article class="mb-16">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
    <span>Free In-House SEO Tool by Waqas Mehmood</span>
  </div>
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
    ${toolTitle.split(' | ')[0].split(' - ')[0]} - Free Online Tool
  </h1>
  <p class="text-base text-slate-300 max-w-3xl mb-8 leading-relaxed">
    ${data.intro || toolDesc}
  </p>

  <section class="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 mb-10">
    <h2 class="text-xl md:text-2xl font-bold text-white mb-4">
      ${data.h2Title || 'Comprehensive Audit & Optimization Guide'}
    </h2>
    <p class="text-sm text-slate-300 leading-relaxed mb-6">
      ${data.googleFactor || 'Google algorithms continuously evaluate on-page semantic markers, performance signals, and DOM accuracy to rank web pages.'}
    </p>

    ${data.benchmarks && data.benchmarks.length > 0 ? `
      <h3 class="text-sm font-mono uppercase text-cyan-400 font-bold mb-3 tracking-wider">Target SEO Benchmarks</h3>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        ${data.benchmarks.map(b => `
          <div class="p-4 rounded-xl bg-slate-950 border border-slate-800">
            <div class="text-xs text-slate-400">${b.label}</div>
            <div class="text-sm font-bold text-white mt-1">${b.ideal}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}

    ${data.faqs && data.faqs.length > 0 ? `
      <h3 class="text-lg font-bold text-white mb-4">Frequently Asked Questions</h3>
      <div class="space-y-4">
        ${data.faqs.map(f => `
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div class="font-semibold text-white text-sm mb-1">${f.q}</div>
            <div class="text-xs text-slate-400 leading-relaxed">${f.a}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </section>

  <section class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800 flex flex-wrap items-center justify-between gap-4">
    <div>
      <h3 class="text-sm font-bold text-white">Need a professional custom audit or full-service SEO management?</h3>
      <p class="text-xs text-slate-400">Hire Waqas Mehmood to audit and fix your code, content, and rankings directly.</p>
    </div>
    <a href="/contact" class="px-5 py-2.5 rounded-xl font-bold bg-gradient-to-r from-cyan-500 to-indigo-600 text-white text-xs hover:opacity-95 transition-all">Request Full Audit</a>
  </section>
</article>
  `;

  const toolSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        "@id": `https://waqasmehmood.com${toolRoute}#app`,
        "name": toolTitle.split(' | ')[0],
        "description": toolDesc,
        "url": `https://waqasmehmood.com${toolRoute}`,
        "applicationCategory": "SEOApplication",
        "operatingSystem": "All modern browsers",
        "browserRequirements": "Requires JavaScript. Requires HTML5.",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        },
        "author": {
          "@type": "Person",
          "name": "Waqas Mehmood",
          "url": "https://waqasmehmood.com/about"
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://waqasmehmood.com${toolRoute}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waqasmehmood.com/" },
          { "@type": "ListItem", "position": 2, "name": "Tools", "item": "https://waqasmehmood.com/all-tools" },
          { "@type": "ListItem", "position": 3, "name": toolTitle.split(' | ')[0], "item": `https://waqasmehmood.com${toolRoute}` }
        ]
      },
      ...(data.faqs && data.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `https://waqasmehmood.com${toolRoute}#faq`,
        "mainEntity": data.faqs.map(f => ({
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

  writeRouteFile(toolRoute, generatePageHtml({
    path: toolRoute,
    title: toolTitle,
    description: toolDesc,
    canonicalPath: toolRoute,
    schemaJson: toolSchema,
    contentHtml: toolHtml
  }));
  generatedRoutes.push(toolRoute);
}

// =========================================================================
// 12. CITIES LOCAL SEO (/locations/:city & /seo-expert-in-hyderabad)
// =========================================================================
for (const [slug, city] of Object.entries(CITIES_DATA)) {
  const cityRoute = `/locations/${city.slug}`;
  const cityTitle = city.metaTitle;
  const cityDesc = city.metaDesc;

  const cityHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li><a href="/local-seo" class="hover:text-cyan-400">Local SEO</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">${city.cityName}</li>
  </ol>
</nav>

<article class="mb-16">
  <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-4">
    <span>${city.heroBadge}</span>
  </div>
  <h1 class="text-3xl md:text-5xl font-black text-white tracking-tight mb-4">
    ${city.headline}
  </h1>
  <p class="text-base text-slate-300 max-w-3xl mb-8 leading-relaxed">
    ${city.intro}
  </p>

  <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div class="text-2xl font-black text-cyan-400 mb-1">${city.stats.clientsServed}</div>
      <div class="text-xs text-slate-400">Local ${city.cityName} Businesses Served</div>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div class="text-2xl font-black text-indigo-400 mb-1">${city.stats.avgRankingBoost}</div>
      <div class="text-xs text-slate-400">Average Organic Traffic Increase</div>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/60 border border-slate-800">
      <div class="text-2xl font-black text-emerald-400 mb-1">${city.stats.mapTop3Rate}</div>
      <div class="text-xs text-slate-400">Google Map Pack 3-Pack Rate</div>
    </div>
  </div>

  <section class="p-8 rounded-2xl bg-slate-900/80 border border-slate-800 mb-10">
    <h2 class="text-xl md:text-2xl font-bold text-white mb-4">
      Local SEO Services in ${city.cityName}, ${city.province}
    </h2>
    <ul class="space-y-3 mb-8">
      ${city.services.map(s => `
        <li class="flex items-center gap-2 text-sm text-slate-300">
          <span class="text-cyan-400 font-bold">&check;</span>
          <span>${s}</span>
        </li>
      `).join('')}
    </ul>

    <h3 class="text-sm font-mono uppercase text-slate-400 font-bold mb-3 tracking-wider">Key Neighborhoods & Commercial Hubs Covered</h3>
    <div class="flex flex-wrap gap-2 mb-8">
      ${city.localAreas.map(a => `
        <span class="px-3 py-1 rounded-lg bg-slate-950 border border-slate-800 text-xs text-slate-300">${a}</span>
      `).join('')}
    </div>

    ${city.faqs && city.faqs.length > 0 ? `
      <h3 class="text-lg font-bold text-white mb-4">${city.cityName} Local SEO FAQs</h3>
      <div class="space-y-4">
        ${city.faqs.map(f => `
          <div class="p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div class="font-semibold text-white text-sm mb-1">${f.q}</div>
            <div class="text-xs text-slate-400 leading-relaxed">${f.a}</div>
          </div>
        `).join('')}
      </div>
    ` : ''}
  </section>

  <div class="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 flex flex-wrap items-center justify-between gap-6">
    <div>
      <h3 class="text-xl font-bold text-white mb-1">Rank your ${city.cityName} business on Google Page 1</h3>
      <p class="text-xs text-slate-300">Get a complimentary local audit and competitor gap analysis from Waqas Mehmood.</p>
    </div>
    <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs transition-all">Schedule Consultation</a>
  </div>
</article>
  `;

  const citySchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "LocalBusiness",
        "@id": `https://waqasmehmood.com${cityRoute}#business`,
        "name": `Waqas Mehmood - Best SEO Expert in ${city.cityName}`,
        "description": cityDesc,
        "url": `https://waqasmehmood.com${cityRoute}`,
        "telephone": "+923003083161",
        "priceRange": "$$",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Latifabad",
          "addressLocality": city.cityName,
          "addressRegion": city.province,
          "postalCode": city.postalCode,
          "addressCountry": "PK"
        },
        "geo": {
          "@type": "GeoCoordinates",
          "latitude": city.geo.lat,
          "longitude": city.geo.lng
        },
        "areaServed": city.localAreas.map(area => ({
          "@type": "AdministrativeArea",
          "name": area
        })),
        "openingHoursSpecification": [
          {
            "@type": "OpeningHoursSpecification",
            "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
            "opens": "09:00",
            "closes": "18:00"
          }
        ]
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://waqasmehmood.com${cityRoute}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waqasmehmood.com/" },
          { "@type": "ListItem", "position": 2, "name": "Local SEO", "item": "https://waqasmehmood.com/local-seo" },
          { "@type": "ListItem", "position": 3, "name": city.cityName, "item": `https://waqasmehmood.com${cityRoute}` }
        ]
      },
      ...(city.faqs && city.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `https://waqasmehmood.com${cityRoute}#faq`,
        "mainEntity": city.faqs.map(f => ({
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

  writeRouteFile(cityRoute, generatePageHtml({
    path: cityRoute,
    title: cityTitle,
    description: cityDesc,
    canonicalPath: cityRoute,
    schemaJson: citySchema,
    contentHtml: cityHtml
  }));
  generatedRoutes.push(cityRoute);

  // If hyderabad, also generate /seo-expert-in-hyderabad with its own unique title & description
  if (slug === 'hyderabad') {
    writeRouteFile('/seo-expert-in-hyderabad', generatePageHtml({
      path: '/seo-expert-in-hyderabad',
      title: 'Best SEO Expert in Hyderabad Sindh (2026) | Waqas Mehmood',
      description: 'Looking for the top SEO expert in Hyderabad, Sindh? Waqas Mehmood helps businesses in Latifabad and Qasimabad dominate Google Page 1. Book a free audit!',
      canonicalPath: '/seo-expert-in-hyderabad',
      schemaJson: citySchema,
      contentHtml: cityHtml
    }));
    generatedRoutes.push('/seo-expert-in-hyderabad');
  }
}

// =========================================================================
// 12.5. BLOG HUB (/blog) & CASE STUDIES (/blog/:slug)
// =========================================================================

// A. Blog Hub (/blog)
const blogHubHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold">Blog</li>
  </ol>
</nav>
<section class="py-6 max-w-5xl mx-auto space-y-12">
  <div class="text-center space-y-4 max-w-3xl mx-auto">
    <div class="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
      <span>Engineering-Grade Insights & Playbooks</span>
    </div>
    <h1 class="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
      SEO, PPC & Growth Architecture <br />
      <span class="text-cyan-400">Technical Knowledge Base</span>
    </h1>
    <p class="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl mx-auto">
      Battle-tested frameworks, local Google Maps ranking playbooks, and negative keyword PPC methodologies engineered by established Best SEO Expert <strong>Waqas Mehmood</strong>.
    </p>
  </div>

  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    ${BLOG_POSTS.map(post => `
      <article class="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex flex-col justify-between space-y-4">
        <div class="space-y-3">
          <div class="flex items-center justify-between text-[11px] font-mono text-slate-400">
            <span class="px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-bold uppercase">${post.categoryLabel}</span>
            <span>${post.readTime}</span>
          </div>
          <h2 class="text-lg font-bold text-white hover:text-cyan-300 transition-colors">
            <a href="/blog/${post.slug}">${post.title}</a>
          </h2>
          <p class="text-xs text-slate-400 leading-relaxed">${post.excerpt}</p>
        </div>
        <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <span class="text-[11px] text-slate-500">Updated: ${post.updatedAt}</span>
          <a href="/blog/${post.slug}" class="text-xs font-bold text-cyan-400 hover:text-cyan-300 flex items-center gap-1">Read Guide &rarr;</a>
        </div>
      </article>
    `).join('')}
  </div>

  <div class="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 flex flex-wrap items-center justify-between gap-6">
    <div>
      <h3 class="text-xl font-bold text-white mb-1">Need a custom SEO & growth strategy for your business?</h3>
      <p class="text-xs text-slate-300">Hire Waqas Mehmood for full-funnel organic search management and high-ROAS PPC campaigns.</p>
    </div>
    <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs transition-all">Request Custom Audit</a>
  </div>
</section>
`;

const blogHubSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "CollectionPage",
      "@id": "https://waqasmehmood.com/blog#collection",
      "name": "SEO & Growth Engineering Blog",
      "description": "In-depth technical SEO case studies, Google Ads scaling blueprints, and modern web growth engineering by Waqas Mehmood.",
      "url": "https://waqasmehmood.com/blog",
      "author": {
        "@type": "Person",
        "name": "Waqas Mehmood",
        "url": "https://waqasmehmood.com/about"
      }
    },
    {
      "@type": "BreadcrumbList",
      "@id": "https://waqasmehmood.com/blog#breadcrumb",
      "itemListElement": [
        { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waqasmehmood.com/" },
        { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://waqasmehmood.com/blog" }
      ]
    }
  ]
};

writeRouteFile('/blog', generatePageHtml({
  path: '/blog',
  title: 'SEO & Growth Engineering Blog (2026) | Waqas Mehmood',
  description: 'Read actionable technical SEO guides, Google Ads scaling playbooks, Local SEO maps blueprints, and AI search case studies. Explore expert growth articles!',
  canonicalPath: '/blog',
  schemaJson: blogHubSchema,
  contentHtml: blogHubHtml
}));
generatedRoutes.push('/blog');

// B. Individual Blog Posts (/blog/:slug)
for (const post of BLOG_POSTS) {
  const postRoute = `/blog/${post.slug}`;
  const rawTitle = post.seoTitle || post.title;
  const postTitle = rawTitle.includes('Waqas Mehmood') ? rawTitle : `${rawTitle} | Waqas Mehmood`;
  const postDesc = post.seoDesc || post.excerpt;

  const postSchema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BlogPosting",
        "@id": `https://waqasmehmood.com${postRoute}#article`,
        "headline": post.title,
        "description": post.excerpt,
        "url": `https://waqasmehmood.com${postRoute}`,
        "image": post.coverImage || "https://waqasmehmood.com/favicon.svg",
        "datePublished": `${post.publishedAt}T08:00:00+05:00`,
        "dateModified": `${post.updatedAt}T08:00:00+05:00`,
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
          "url": "https://waqasmehmood.com",
          "logo": {
            "@type": "ImageObject",
            "url": "https://waqasmehmood.com/favicon.svg"
          }
        },
        "mainEntityOfPage": {
          "@type": "WebPage",
          "@id": `https://waqasmehmood.com${postRoute}`
        }
      },
      {
        "@type": "BreadcrumbList",
        "@id": `https://waqasmehmood.com${postRoute}#breadcrumb`,
        "itemListElement": [
          { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://waqasmehmood.com/" },
          { "@type": "ListItem", "position": 2, "name": "Blog", "item": "https://waqasmehmood.com/blog" },
          { "@type": "ListItem", "position": 3, "name": post.title, "item": `https://waqasmehmood.com${postRoute}` }
        ]
      },
      ...(post.faqs && post.faqs.length > 0 ? [{
        "@type": "FAQPage",
        "@id": `https://waqasmehmood.com${postRoute}#faq`,
        "mainEntity": post.faqs.map(f => ({
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

  const postHtml = `
<nav aria-label="Breadcrumb" class="mb-6 text-xs text-slate-400 max-w-4xl mx-auto">
  <ol class="flex items-center gap-2">
    <li><a href="/" class="hover:text-cyan-400">Home</a></li>
    <li>/</li>
    <li><a href="/blog" class="hover:text-cyan-400">Blog</a></li>
    <li>/</li>
    <li class="text-cyan-400 font-semibold truncate max-w-xs">${post.title}</li>
  </ol>
</nav>

<article class="max-w-4xl mx-auto py-6 px-4 sm:px-6 space-y-10">
  <div class="flex items-center justify-between text-xs font-mono text-slate-400 pb-4 border-b border-slate-800">
    <a href="/blog" class="text-cyan-400 hover:text-cyan-300 font-semibold">&larr; Back to Blog Hub</a>
    <span>Published: ${post.publishedAt} • Updated: ${post.updatedAt}</span>
  </div>

  <header class="space-y-4">
    <span class="px-3 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 text-xs font-bold uppercase">${post.categoryLabel}</span>
    <h1 class="text-3xl sm:text-4xl font-extrabold text-white leading-tight">${post.title}</h1>
    <p class="text-base text-slate-300 leading-relaxed">${post.excerpt}</p>
    <div class="flex items-center gap-3 pt-2 text-xs text-slate-400 font-mono">
      <span>By Waqas Mehmood (Senior SEO Specialist)</span>
      <span>•</span>
      <span>${post.readTime}</span>
    </div>
  </header>

  <div class="space-y-8 text-sm text-slate-300 leading-relaxed">
    ${post.sections.map(section => `
      <section id="${section.id}" class="space-y-4">
        <h2 class="text-2xl font-bold text-white tracking-tight border-b border-slate-800/80 pb-2">${section.title}</h2>
        <p class="leading-relaxed text-slate-300">${section.content}</p>
        
        ${section.checklist ? `
          <ul class="space-y-2.5 my-4">
            ${section.checklist.map(item => `
              <li class="flex items-start gap-2.5">
                <span class="text-cyan-400 font-bold">&check;</span>
                <span class="text-slate-200">${item}</span>
              </li>
            `).join('')}
          </ul>
        ` : ''}

        ${section.callout ? `
          <div class="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-xs my-4">
            <strong class="text-cyan-300 block mb-1 uppercase font-mono">${section.callout.title}</strong>
            <p class="text-slate-300">${section.callout.text}</p>
          </div>
        ` : ''}
      </section>
    `).join('')}
  </div>

  ${post.toolCta ? `
    <div class="p-6 rounded-2xl bg-slate-900 border border-cyan-500/30 flex flex-wrap items-center justify-between gap-4">
      <div>
        <h3 class="text-base font-bold text-white mb-1">Recommended In-House Tool: ${post.toolCta.toolTitle}</h3>
        <p class="text-xs text-slate-400">Put this strategy to work immediately with 100% free browser execution.</p>
      </div>
      <a href="/tools/${post.toolCta.toolSlug}" class="px-5 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs transition-all">${post.toolCta.buttonText} &rarr;</a>
    </div>
  ` : ''}

  ${post.faqs && post.faqs.length > 0 ? `
    <section class="space-y-4 pt-6 border-t border-slate-800">
      <h3 class="text-xl font-bold text-white">Frequently Asked Questions</h3>
      <div class="space-y-3">
        ${post.faqs.map(faq => `
          <div class="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <h4 class="font-bold text-white text-sm mb-1">${faq.q}</h4>
            <p class="text-xs text-slate-400 leading-relaxed">${faq.a}</p>
          </div>
        `).join('')}
      </div>
    </section>
  ` : ''}

  <div class="p-8 rounded-2xl bg-gradient-to-r from-cyan-950/40 to-indigo-950/40 border border-cyan-800/40 flex flex-wrap items-center justify-between gap-6">
    <div>
      <h3 class="text-xl font-bold text-white mb-1">Dominate Google Rankings with Waqas Mehmood</h3>
      <p class="text-xs text-slate-300">Hire senior digital marketing management with direct ROI accountability.</p>
    </div>
    <a href="/contact" class="px-6 py-3 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs transition-all">${post.serviceCta ? post.serviceCta.buttonText : 'Contact Waqas Mehmood'}</a>
  </div>
</article>
  `;

  writeRouteFile(postRoute, generatePageHtml({
    path: postRoute,
    title: postTitle,
    description: postDesc,
    canonicalPath: postRoute,
    schemaJson: postSchema,
    contentHtml: postHtml
  }));
  generatedRoutes.push(postRoute);
}

// =========================================================================
// 13. 404 NOT FOUND (/404)
// =========================================================================
const notFoundHtml = `
<section class="py-20 text-center">
  <div class="text-6xl font-black text-cyan-500 mb-4">404</div>
  <h1 class="text-3xl font-bold text-white mb-4">Page Not Found</h1>
  <p class="text-slate-400 max-w-md mx-auto mb-8 text-sm">
    The page you are looking for does not exist, has been moved, or has been permanently removed.
  </p>
  <div class="flex flex-wrap justify-center gap-4">
    <a href="/" class="px-5 py-2.5 rounded-xl font-bold bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs">Back to Home</a>
    <a href="/all-tools" class="px-5 py-2.5 rounded-xl font-bold bg-slate-900 border border-slate-700 text-white text-xs hover:border-cyan-500/50">Explore SEO Tools</a>
  </div>
</section>
`;

writeRouteFile('/404', generatePageHtml({
  path: '/404',
  title: '404: Page Not Found | Waqas Mehmood',
  description: 'The page you are looking for does not exist or has been permanently removed.',
  robots: 'noindex, follow',
  contentHtml: notFoundHtml
}));
generatedRoutes.push('/404');

console.log(`\nSuccessfully pre-rendered ${generatedRoutes.length} static HTML routes with full SEO!`);

// =========================================================================
// COPY PRE-RENDERED FILES & ASSETS TO ROOT DIRECTORY (FOR APACHE SERVING)
// =========================================================================
function copyDirRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

console.log('Syncing dist files to project root for Apache direct delivery...');
copyDirRecursive(DIST_DIR, ROOT_DIR);
console.log('Project root updated with pre-rendered pages & static assets successfully!');
