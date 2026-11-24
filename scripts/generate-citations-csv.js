import fs from 'fs';
import path from 'path';

const citations = [
  // TIER 1: CORE SEARCH ENGINES & MAPS (ABSOLUTE MUST-HAVES)
  {
    id: 1,
    platform: 'Google Business Profile',
    tier: 'Tier 1 (Core)',
    region: 'Pakistan & Global',
    da: 100,
    cost: '100% Free',
    directUrl: 'https://business.google.com/',
    category: 'Internet Marketing Service / SEO Agency',
    priority: 'Urgent / Foundation',
    status: 'Verified (CID: 11016835510682739502)',
    notes: 'Already verified! Foundation of all local citations.'
  },
  {
    id: 2,
    platform: 'Bing Places for Business',
    tier: 'Tier 1 (Core)',
    region: 'Pakistan & Global',
    da: 93,
    cost: '100% Free',
    directUrl: 'https://www.bingplaces.com/',
    category: 'Marketing Agency / Internet Services',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Use 1-Click Import from your verified Google Business Profile. Takes 2 minutes!'
  },
  {
    id: 3,
    platform: 'Apple Business Connect',
    tier: 'Tier 1 (Core)',
    region: 'Pakistan & Global',
    da: 100,
    cost: '100% Free',
    directUrl: 'https://businessconnect.apple.com/',
    category: 'Professional Services / Internet Marketing',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Powers Apple Maps, Siri, and iOS Safari local search results.'
  },
  {
    id: 4,
    platform: 'LinkedIn Company Page',
    tier: 'Tier 1 (Core)',
    region: 'Global & Pakistan',
    da: 99,
    cost: '100% Free',
    directUrl: 'https://www.linkedin.com/company/setup/new/',
    category: 'Marketing Services / IT Services',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'High authority entity backlink + business address proof for Googlebot.'
  },
  {
    id: 5,
    platform: 'Facebook Professional Business Page',
    tier: 'Tier 1 (Core)',
    region: 'Pakistan & Global',
    da: 96,
    cost: '100% Free',
    directUrl: 'https://www.facebook.com/pages/create/',
    category: 'Internet Marketing Service',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Add exact Latifabad address and phone number for local social citation signals.'
  },
  {
    id: 6,
    platform: 'Foursquare for Business',
    tier: 'Tier 1 (Core)',
    region: 'Global & Pakistan',
    da: 92,
    cost: '100% Free',
    directUrl: 'https://foursquare.com/add-place',
    category: 'Advertising & Marketing Agency',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Global data aggregator that feeds location info to Uber, Twitter, and navigation apps.'
  },

  // TIER 2: TOP GLOBAL B2B & DIGITAL MARKETING AGENCY DIRECTORIES
  {
    id: 7,
    platform: 'Clutch.co',
    tier: 'Tier 2 (Agency B2B)',
    region: 'Global',
    da: 90,
    cost: '100% Free Basic Profile',
    directUrl: 'https://clutch.co/get-listed',
    category: 'SEO Companies / Digital Marketing',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'The #1 B2B agency directory in the world. Drastically boosts SEO consultant authority.'
  },
  {
    id: 8,
    platform: 'GoodFirms',
    tier: 'Tier 2 (Agency B2B)',
    region: 'Global',
    da: 85,
    cost: '100% Free Basic Profile',
    directUrl: 'https://www.goodfirms.co/get-listed',
    category: 'Digital Marketing & SEO Services',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'High-authority tech & agency research directory. Add portfolio and client reviews.'
  },
  {
    id: 9,
    platform: 'DesignRush',
    tier: 'Tier 2 (Agency B2B)',
    region: 'Global',
    da: 88,
    cost: '100% Free Listing',
    directUrl: 'https://www.designrush.com/agency-registration',
    category: 'SEO Agency / Web Development',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Global agency directory connecting enterprise clients with digital service providers.'
  },
  {
    id: 10,
    platform: 'Crunchbase',
    tier: 'Tier 2 (Authority)',
    region: 'Global',
    da: 91,
    cost: '100% Free Account',
    directUrl: 'https://www.crunchbase.com/register',
    category: 'Information Technology / Digital Agency',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Create both Founder profile (Waqas Mehmood) and Company profile (waqasmehmood.com).'
  },
  {
    id: 11,
    platform: 'Trustpilot Business',
    tier: 'Tier 2 (Reviews & Citation)',
    region: 'Global',
    da: 93,
    cost: '100% Free Plan',
    directUrl: 'https://business.trustpilot.com/',
    category: 'Marketing & Advertising',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Claim your domain waqasmehmood.com. Collect client feedback for high trust score.'
  },
  {
    id: 12,
    platform: 'Sortlist',
    tier: 'Tier 2 (Agency B2B)',
    region: 'Global',
    da: 72,
    cost: '100% Free Profile',
    directUrl: 'https://www.sortlist.com/for-agencies',
    category: 'SEO & Online Advertising Agency',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'International agency marketplace where businesses post digital marketing tenders.'
  },
  {
    id: 13,
    platform: 'Digital Agency Network (DAN)',
    tier: 'Tier 2 (Agency B2B)',
    region: 'Global',
    da: 76,
    cost: '100% Free Submission',
    directUrl: 'https://digitalagencynetwork.com/agencies/',
    category: 'Digital Marketing Agency',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Curated global network showcasing independent digital agencies.'
  },
  {
    id: 14,
    platform: 'Bark.com',
    tier: 'Tier 2 (Lead Gen & Citation)',
    region: 'Global & Pakistan',
    da: 82,
    cost: '100% Free Registration',
    directUrl: 'https://www.bark.com/en/pk/sellers/create/',
    category: 'SEO Specialists & Web Designers',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Free public profile with direct client lead matching in Pakistan and internationally.'
  },

  // TIER 3: VERIFIED 100% FREE PAKISTAN LOCAL DIRECTORIES
  {
    id: 15,
    platform: 'BizBranches.pk',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan (Hyderabad/Sindh)',
    da: 42,
    cost: '100% Free (No Hidden Fees)',
    directUrl: 'https://bizbranches.pk/add-business',
    category: 'Information Technology / SEO & Marketing',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Active local Pakistani directory with dedicated city filtering (Hyderabad, Sindh).'
  },
  {
    id: 16,
    platform: 'BusinessList.pk',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 48,
    cost: '100% Free Basic Listing',
    directUrl: 'https://www.businesslist.pk/',
    category: 'Internet Marketing & Advertising',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'One of the most active Pakistani directories. Submit business details with contact info.'
  },
  {
    id: 17,
    platform: 'ListPak.com',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 35,
    cost: '100% Free Listing',
    directUrl: 'https://www.listpak.com/',
    category: 'Services / Computers & Internet',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Free structured Pakistani business directory with category and city breakdown.'
  },
  {
    id: 18,
    platform: 'Enic.pk',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 38,
    cost: '100% Free Listing',
    directUrl: 'https://www.enic.pk/',
    category: 'Advertising & Marketing Services',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Longstanding online business registry and yellow pages for Pakistani enterprises.'
  },
  {
    id: 19,
    platform: 'HamariWeb Business Directory',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 68,
    cost: '100% Free',
    directUrl: 'https://hamariweb.com/business-directory/',
    category: 'IT & Internet Marketing Services',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'High-traffic mainstream Pakistani portal. Listing provides authoritative local brand signals.'
  },
  {
    id: 20,
    platform: 'Jamal\'s Yellow Pages (Jamals.com)',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 55,
    cost: '100% Free Basic Entry',
    directUrl: 'https://www.jamals.com/',
    category: 'Advertising Agencies & Internet Consultants',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Pakistan\'s oldest and most respected trade index. Select free basic company registration.'
  },
  {
    id: 21,
    platform: 'B2BMAP (Pakistan Section)',
    tier: 'Tier 3 (Pakistan B2B)',
    region: 'Pakistan',
    da: 45,
    cost: '100% Free Listing',
    directUrl: 'https://b2bmap.com/pakistan',
    category: 'Computer & IT Services / Web & SEO',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Local and international B2B directory with free company profile creation.'
  },
  {
    id: 22,
    platform: 'TradeKey Pakistan',
    tier: 'Tier 3 (Pakistan B2B)',
    region: 'Pakistan',
    da: 65,
    cost: '100% Free Free Member',
    directUrl: 'https://pakistan.tradekey.com/',
    category: 'Services / IT & Marketing Solutions',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Major Pakistani B2B trade marketplace with free service provider listing.'
  },
  {
    id: 23,
    platform: 'Cylex Pakistan',
    tier: 'Tier 3 (Pakistan Local)',
    region: 'Pakistan',
    da: 75,
    cost: '100% Free Listing',
    directUrl: 'https://www.cylex.net.pk/',
    category: 'Marketing Consultants & SEO',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Pakistani branch of international directory Cylex. Provides instant map integration.'
  },

  // TIER 4: GLOBAL HIGH-DA GENERAL BUSINESS DIRECTORIES
  {
    id: 24,
    platform: 'Brownbook.net',
    tier: 'Tier 4 (Global General)',
    region: 'Global',
    da: 76,
    cost: '100% Free',
    directUrl: 'https://www.brownbook.net/add-business/',
    category: 'Internet Marketing / SEO Specialist',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Global crowdsourced business directory. Allows full NAP, description, and website URL.'
  },
  {
    id: 25,
    platform: 'Hotfrog International',
    tier: 'Tier 4 (Global General)',
    region: 'Global',
    da: 74,
    cost: '100% Free',
    directUrl: 'https://www.hotfrog.com/add-my-business',
    category: 'Marketing & Public Relations',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Worldwide business index. Useful for establishing international entity presence.'
  },
  {
    id: 26,
    platform: 'About.me',
    tier: 'Tier 4 (Personal Entity)',
    region: 'Global',
    da: 91,
    cost: '100% Free Profile',
    directUrl: 'https://about.me/',
    category: 'SEO Expert & Growth Engineer',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Creates an authoritative personal entity hub for Waqas Mehmood linking to waqasmehmood.com.'
  },
  {
    id: 27,
    platform: 'Gravatar Profile',
    tier: 'Tier 4 (Personal Entity)',
    region: 'Global',
    da: 94,
    cost: '100% Free',
    directUrl: 'https://gravatar.com/',
    category: 'SEO Strategist & Developer',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Verified web profile by Automattic (WordPress). Add verified links, bio, and contact info.'
  },
  {
    id: 28,
    platform: 'TopDesignFirms',
    tier: 'Tier 4 (Agency)',
    region: 'Global',
    da: 75,
    cost: '100% Free Listing',
    directUrl: 'https://topdesignfirms.com/get-listed',
    category: 'Search Engine Optimization / Web Design',
    priority: 'Low Priority',
    status: 'Pending Submission',
    notes: 'Sister directory to Clutch for design, web development, and digital marketing.'
  },
  {
    id: 29,
    platform: 'Agency Spotter',
    tier: 'Tier 4 (Agency)',
    region: 'Global',
    da: 64,
    cost: '100% Free Profile',
    directUrl: 'https://www.agencyspotter.com/for-agencies',
    category: 'Digital Marketing & SEO Agencies',
    priority: 'Low Priority',
    status: 'Pending Submission',
    notes: 'International directory for marketing and creative service providers.'
  },
  {
    id: 30,
    platform: 'Hyderabad Chamber of Commerce (HCCI)',
    tier: 'Tier 3 (Local Authority)',
    region: 'Hyderabad, Sindh',
    da: 32,
    cost: 'Chamber Member / Local Listing',
    directUrl: 'http://www.hcci.org.pk/',
    category: 'Local Professional Services',
    priority: 'Local Authority',
    status: 'Recommended / In-Person',
    notes: 'Local trade body listing in Hyderabad. Exceptional local trust signal for Google Maps.'
  }
];

// Helper to escape CSV cell content
function escapeCsv(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

// Generate CSV content with UTF-8 BOM so Excel opens it with zero encoding glitch
const headers = [
  'ID',
  'Directory / Platform Name',
  'Tier / Classification',
  'Geographic Region',
  'Domain Authority (DA)',
  'Pricing / Cost',
  'Direct Submission URL',
  'Recommended Category',
  'Submission Priority',
  'Current Status',
  'Execution Notes & Action Guide'
];

let csvContent = '\uFEFF'; // UTF-8 BOM
csvContent += headers.map(escapeCsv).join(',') + '\r\n';

citations.forEach(item => {
  const row = [
    item.id,
    item.platform,
    item.tier,
    item.region,
    item.da,
    item.cost,
    item.directUrl,
    item.category,
    item.priority,
    item.status,
    item.notes
  ];
  csvContent += row.map(escapeCsv).join(',') + '\r\n';
});

const outputPath = path.resolve('d:/waqasmehmood/Local_SEO_Citations_Master_List.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`Successfully generated citation master list with ${citations.length} platforms at: ${outputPath}`);
