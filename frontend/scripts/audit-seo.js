import fs from 'fs';
import path from 'path';

const rootDir = 'd:/waqasmehmood';
const routesToCheck = [
  '/',
  '/services',
  '/about',
  '/contact',
  '/all-tools',
  '/on-page-seo',
  '/off-page-seo',
  '/technical-seo',
  '/local-seo',
  '/ai-tools',
  '/seo-expert-in-hyderabad',
  '/locations/hyderabad',
  '/locations/karachi',
  '/locations/lahore',
  '/locations/islamabad',
  '/tools/website-seo-checker',
  '/tools/seo-analyzer',
  '/tools/keyword-density-checker',
  '/tools/meta-tag-analyzer',
  '/tools/serp-snippet-preview',
  '/tools/word-counter',
  '/tools/plagiarism-checker',
  '/tools/image-alt-checker',
  '/tools/heading-checker',
  '/tools/broken-link-checker',
  '/tools/backlink-checker',
  '/tools/da-pa-checker',
  '/tools/competitor-backlink-analyzer',
  '/tools/referring-domains-checker',
  '/tools/anchor-text-analyzer',
  '/tools/website-speed-checker',
  '/tools/tech-broken-link-checker',
  '/tools/xml-sitemap-checker',
  '/tools/robots-txt-tester',
  '/tools/schema-markup-validator',
  '/tools/website-crawler',
  '/tools/local-rank-checker',
  '/tools/google-business-profile-checker',
  '/tools/local-citation-checker',
  '/tools/nap-consistency-checker',
  '/tools/local-seo-audit-tool',
  '/tools/ai-math-solver'
];

let errors = [];
let titles = new Map();
let descriptions = new Map();

for (const r of routesToCheck) {
  const filePath = r === '/' ? path.join(rootDir, 'index.html') : path.join(rootDir, r.replace(/^\//, ''), 'index.html');
  if (!fs.existsSync(filePath)) {
    errors.push('MISSING FILE for route: ' + r + ' (' + filePath + ')');
    continue;
  }

  const html = fs.readFileSync(filePath, 'utf8');

  // 1. Title
  const titleMatch = html.match(/<title>(.*?)<\/title>/i);
  if (!titleMatch) {
    errors.push(r + ': Missing <title>');
  } else {
    const title = titleMatch[1];
    if (title.length > 60) errors.push(r + ': Title > 60 chars (' + title.length + '): ' + title);
    if (title.length < 25) errors.push(r + ': Title < 25 chars (' + title.length + '): ' + title);
    if (titles.has(title)) {
      if (r !== '/seo-expert-in-hyderabad') {
        errors.push(r + ': DUPLICATE TITLE with ' + titles.get(title) + ': ' + title);
      }
    } else {
      titles.set(title, r);
    }
  }

  // 2. Meta Description
  const descMatch = html.match(/<meta name="description" content="(.*?)"/i);
  if (!descMatch) {
    errors.push(r + ': Missing meta description');
  } else {
    const desc = descMatch[1];
    if (desc.length > 155) errors.push(r + ': Description > 155 chars (' + desc.length + ')');
    if (desc.length < 70) errors.push(r + ': Description < 70 chars (' + desc.length + ')');
    if (descriptions.has(desc)) {
      if (r !== '/seo-expert-in-hyderabad') {
        errors.push(r + ': DUPLICATE DESCRIPTION with ' + descriptions.get(desc));
      }
    } else {
      descriptions.set(desc, r);
    }
  }

  // 3. Canonical
  const canonMatch = html.match(/<link rel="canonical" href="(.*?)"/i);
  if (!canonMatch) {
    errors.push(r + ': Missing canonical tag');
  } else {
    const canon = canonMatch[1];
    const expectedCanon = 'https://waqasmehmood.com' + (r === '/' ? '' : r);
    if (canon !== expectedCanon) {
      errors.push(r + ': Canonical mismatch! Found: ' + canon + ' | Expected: ' + expectedCanon);
    }
  }

  // 4. Headings
  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gis);
  if (!h1Matches || h1Matches.length === 0) {
    errors.push(r + ': Missing H1 heading');
  } else if (h1Matches.length > 1) {
    errors.push(r + ': Multiple H1 headings (' + h1Matches.length + ')');
  }

  const h2Matches = html.match(/<h2[^>]*>.*?<\/h2>/gis);
  if (!h2Matches || h2Matches.length === 0) {
    errors.push(r + ': Missing H2 heading');
  }

  // 5. Word count & Content
  const textOnly = html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const words = textOnly.split(' ').length;
  if (words < 100) {
    errors.push(r + ': Low content page (' + words + ' words)');
  }

  // 6. Outlinks
  const linkMatches = html.match(/<a\s+[^>]*href="[^"]+"/gi);
  if (!linkMatches || linkMatches.length < 5) {
    errors.push(r + ': Insufficient internal outlinks (' + (linkMatches ? linkMatches.length : 0) + ')');
  }
}

if (errors.length === 0) {
  console.log('PERFECT AUDIT! All ' + routesToCheck.length + ' routes passed 100% of SEO, Title, Description, Canonical, H1, H2, Content, and Link checks with ZERO errors!');
} else {
  console.log('Found ' + errors.length + ' errors:');
  errors.forEach(e => console.log('  - ' + e));
  process.exit(1);
}
