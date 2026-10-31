import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { TOOLS_SEO_DATA, PARTNER_RESOURCES } from '../src/data/toolsSeoData.js';
import { CITIES_DATA } from '../src/data/citiesData.js';

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
      <p class="leading-relaxed mb-4">Senior SEO Specialist, Growth Engineer & Full-Stack Developer providing high-impact SEO management, technical audits, and 27 free in-house digital marketing tools.</p>
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
  html = html.replace(/<title>.*?<\/title>/s, `<title>${title}</title>`);
  html = html.replace(/<meta name="title" content=".*?" \/>/s, `<meta name="title" content="${title}" />`);
  html = html.replace(/<meta property="og:title" content=".*?" \/>/s, `<meta property="og:title" content="${title}" />`);
  html = html.replace(/<meta property="twitter:title" content=".*?" \/>/s, `<meta property="twitter:title" content="${title}" />`);

  // 2. Replace Description
  html = html.replace(/<meta name="description" content=".*?" \/>/s, `<meta name="description" content="${description}" />`);
  html = html.replace(/<meta property="og:description" content=".*?" \/>/s, `<meta property="og:description" content="${description}" />`);
  html = html.replace(/<meta property="twitter:description" content=".*?" \/>/s, `<meta property="twitter:description" content="${description}" />`);

  // 3. Replace Canonical & OG URL (Self-referencing!)
  const fullCanonicalUrl = `https://waqasmehmood.com${canonicalPath === '/' ? '' : canonicalPath}`;
  html = html.replace(/<link rel="canonical" href=".*?" \/>/s, `<link rel="canonical" href="${fullCanonicalUrl}" />`);
  html = html.replace(/<meta property="og:url" content=".*?" \/>/s, `<meta property="og:url" content="${fullCanonicalUrl}" />`);
  html = html.replace(/<meta property="twitter:url" content=".*?" \/>/s, `<meta property="twitter:url" content="${fullCanonicalUrl}" />`);

  // 4. Replace Robots
  html = html.replace(/<meta name="robots" content=".*?" \/>/s, `<meta name="robots" content="${robots}" />`);

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
    Welcome to the official portfolio and digital engineering platform of Waqas Mehmood. With over a decade of hands-on experience, I deliver developer-level Technical SEO audits, full-funnel organic search optimization, Local SEO map pack domination, and 27 proprietary in-house SEO tools built natively from scratch.
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

<section class="mb-16">
  <h2 class="text-2xl font-bold text-white mb-6">Frequently Asked Questions</h2>
  <div class="space-y-4">
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">How long does it take to see real results from SEO?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Technical SEO fixes and indexation corrections show diagnostic improvements within 2 to 4 weeks. High-intent commercial rankings typically mature within 3 to 6 months as topical authority builds.</p>
    </div>
    <div class="p-6 rounded-2xl bg-slate-900/40 border border-slate-800">
      <h3 class="font-bold text-white text-base mb-2">What makes your 27 in-house SEO tools different?</h3>
      <p class="text-slate-300 text-sm leading-relaxed">Our 27 tools are custom written without third-party API dependencies or paywalls. They perform direct live DOM parsing, providing transparent and instant SEO insights.</p>
    </div>
  </div>
</section>
`;

writeRouteFile('/', generatePageHtml({
  path: '/',
  title: 'Waqas Mehmood | Best SEO Expert & SEO Specialist',
  description: 'Hire Waqas Mehmood - Best SEO expert & specialist offering top SEO services, local SEO management, technical audits & web development.',
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
  title: 'Best SEO Services & SEO Management | Waqas Mehmood',
  description: 'Hire Waqas Mehmood for high-ROAS SEO management, technical audits, link building, and organic scaling. Custom data-driven growth strategies.',
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
  description: 'Learn about Waqas Mehmood, senior SEO specialist & engineer delivering full-funnel SEO services, technical audits, and organic revenue scaling.',
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
  title: 'Contact Waqas Mehmood | Hire Best SEO Expert',
  description: 'Get in touch with Waqas Mehmood for custom SEO audits, best SEO services, high-ROAS PPC ad campaigns, or full-stack web application development.',
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
  title: '27 Free SEO Tools & Digital Analyzers | Waqas Mehmood',
  description: 'Run 27 free in-house SEO tools covering One Page SEO, Off Page SEO, Technical SEO, Local SEO, and AI Tools. Zero third-party API dependencies.',
  contentHtml: allToolsHtml
}));
generatedRoutes.push('/all-tools');

// =========================================================================
// 6-10. THE 4 PILLARS & AI TOOLS
// =========================================================================
const PILLARS_CONFIG = [
  {
    path: '/on-page-seo',
    title: 'One Page SEO Tools - 10 Free Analyzers | Waqas',
    description: 'Free On-Page SEO tools: Website SEO Checker, Keyword Density, Meta Tag Analyzer, SERP Preview, Word Counter, Heading Hierarchy, and Broken Link Checker.',
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
    title: 'Off Page SEO Tools & Backlink Analyzers | Waqas',
    description: 'Free Off-Page SEO tools: Backlink Checker, DA & PA Checker, Competitor Backlink Analyzer, Referring Domains, and Anchor Text Analyzer.',
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
    title: 'Technical SEO Tools & Schema Analyzers | Waqas',
    description: 'Free Technical SEO tools: Website Speed Checker, Technical Broken Link Checker, XML Sitemap Validator, Robots.txt Tester, and Schema JSON-LD Validator.',
    h1: 'Technical SEO Tools & Schema Analyzers',
    tools: [
      { slug: 'website-speed-checker', name: 'Website Speed Checker' },
      { slug: 'tech-broken-link-checker', name: 'Technical Broken Link Checker' },
      { slug: 'xml-sitemap-checker', name: 'XML Sitemap Checker' },
      { slug: 'robots-txt-tester', name: 'Robots.txt Tester' },
      { slug: 'schema-markup-validator', name: 'Schema Markup Validator' }
    ]
  },
  {
    path: '/local-seo',
    title: 'Local SEO & Google Business Profile Tools | Waqas',
    description: 'Free Local SEO tools: Local Rank Checker, Google Business Profile Audit, Local Citation Checker, NAP Consistency Checker, and Local SEO Audit Tool.',
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
    title: 'Free AI Tools & Multimodal Solvers | Waqas Mehmood',
    description: 'Explore free AI web tools by Waqas Mehmood: Free AI Math Solver, Free AI Website Crawler & Auditor, photo equation OCR, and multi-page technical audit.',
    h1: 'Free AI Tools & Multimodal Problem Solvers',
    tools: [
      { slug: 'ai-math-solver', name: 'Free AI Math Solver' },
      { slug: 'website-crawler', name: 'Free AI Website Crawler & Auditor' }
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

  writeRouteFile(toolRoute, generatePageHtml({
    path: toolRoute,
    title: toolTitle,
    description: toolDesc,
    canonicalPath: toolRoute,
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

  writeRouteFile(cityRoute, generatePageHtml({
    path: cityRoute,
    title: cityTitle,
    description: cityDesc,
    canonicalPath: cityRoute,
    contentHtml: cityHtml
  }));
  generatedRoutes.push(cityRoute);

  // If hyderabad, also generate /seo-expert-in-hyderabad with its own unique title & description
  if (slug === 'hyderabad') {
    writeRouteFile('/seo-expert-in-hyderabad', generatePageHtml({
      path: '/seo-expert-in-hyderabad',
      title: 'SEO Expert in Hyderabad Sindh | Waqas Mehmood',
      description: 'Looking for the top SEO Expert in Hyderabad, Sindh? Waqas Mehmood helps businesses in Latifabad, Qasimabad & Sindh dominate Google Page 1 & Map Pack.',
      canonicalPath: '/seo-expert-in-hyderabad',
      contentHtml: cityHtml
    }));
    generatedRoutes.push('/seo-expert-in-hyderabad');
  }
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
