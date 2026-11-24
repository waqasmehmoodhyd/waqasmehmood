import fs from 'fs';
import path from 'path';

const nicheCitations = [
  // ==========================================
  // SECTION 1: REAL ESTATE AGENT / REALTOR
  // ==========================================
  {
    id: 1,
    targetCategory: 'Real Estate Agent',
    platform: 'Zillow Agent Directory',
    da: 94,
    cost: '100% Free Agent Profile',
    directUrl: 'https://www.zillow.com/agent-resources/',
    platformCategory: 'Real Estate Agent / Broker',
    region: 'USA & Global',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'The #1 real estate marketplace. Free agent profile showcases active listings, past sales, and client reviews.'
  },
  {
    id: 2,
    targetCategory: 'Real Estate Agent',
    platform: 'Realtor.com Agent Profiles',
    da: 93,
    cost: '100% Free Agent Profile',
    directUrl: 'https://www.realtor.com/realestateagents/',
    platformCategory: 'Real Estate Agent / Realtor',
    region: 'USA & Global',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'Direct MLS synchronization. Exceptional domain authority and local Google search prominence.'
  },
  {
    id: 3,
    targetCategory: 'Real Estate Agent',
    platform: 'Homes.com Agent Directory',
    da: 86,
    cost: '100% Free Basic Profile',
    directUrl: 'https://www.homes.com/real-estate-agents/',
    platformCategory: 'Real Estate Broker / Agent',
    region: 'Global & USA',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Fast growing CoStar-owned portal. High-authority local link and neighborhood bio.'
  },
  {
    id: 4,
    targetCategory: 'Real Estate Agent',
    platform: 'ActiveRain Real Estate Network',
    da: 75,
    cost: '100% Free Member Profile',
    directUrl: 'https://activerain.com/',
    platformCategory: 'Real Estate Professional',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'The largest social network and blogging community specifically for real estate professionals.'
  },
  {
    id: 5,
    targetCategory: 'Real Estate Agent',
    platform: 'Real Estate Bees',
    da: 58,
    cost: '100% Free Listing',
    directUrl: 'https://realestatebees.com/join-as-a-pro/',
    platformCategory: 'Real Estate Agent / Specialist',
    region: 'Global & USA',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Dedicated platform matching home buyers and sellers with verified regional agents.'
  },
  {
    id: 6,
    targetCategory: 'Real Estate Agent',
    platform: 'BiggerPockets Pro Directory',
    da: 85,
    cost: '100% Free Account',
    directUrl: 'https://www.biggerpockets.com/real-estate-agents',
    platformCategory: 'Investor-Friendly Real Estate Agent',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Huge community of real estate investors looking for investor-savvy local agents.'
  },
  {
    id: 7,
    targetCategory: 'Real Estate Agent',
    platform: 'Zameen.com (Pakistan)',
    da: 62,
    cost: '100% Free Agency Profile',
    directUrl: 'https://www.zameen.com/agencies/',
    platformCategory: 'Real Estate Agency / Consultant',
    region: 'Pakistan',
    priority: 'Urgent (For PK Real Estate)',
    status: 'Pending Submission',
    notes: 'Pakistan\'s undisputed #1 real estate network. Add agency address, contact, and city coverage.'
  },
  {
    id: 8,
    targetCategory: 'Real Estate Agent',
    platform: 'Graana.com (Pakistan)',
    da: 54,
    cost: '100% Free Listing',
    directUrl: 'https://www.graana.com/',
    platformCategory: 'Real Estate Broker / Agent',
    region: 'Pakistan',
    priority: 'High Priority (PK)',
    status: 'Pending Submission',
    notes: 'Major smart property portal in Pakistan. Free registration for property consultants.'
  },
  {
    id: 9,
    targetCategory: 'Real Estate Agent',
    platform: 'Bayut Pakistan',
    da: 50,
    cost: '100% Free Profile',
    directUrl: 'https://www.bayut.pk/agencies/',
    platformCategory: 'Property Consultant',
    region: 'Pakistan & UAE',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Premium property portal connecting buyers and overseas investors with local verified agents.'
  },

  // ==========================================
  // SECTION 2: ROOFING CONTRACTOR
  // ==========================================
  {
    id: 10,
    targetCategory: 'Roofing contractor',
    platform: 'Angi (Angie\'s List / HomeAdvisor)',
    da: 89,
    cost: '100% Free Business Listing',
    directUrl: 'https://www.angi.com/pro/join',
    platformCategory: 'Roofing Contractor / Roof Repair',
    region: 'USA, UK & Global',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'The undisputed heavy-hitter for roofing citations. Create free business profile to get listed.'
  },
  {
    id: 11,
    targetCategory: 'Roofing contractor',
    platform: 'Houzz Pro (Roofing)',
    da: 91,
    cost: '100% Free Pro Profile',
    directUrl: 'https://www.houzz.com/professionals/join',
    platformCategory: 'Roofing & Gutters / General Construction',
    region: 'Global',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'Massive domain authority. Upload photos of completed roofing projects, shingle work, and license info.'
  },
  {
    id: 12,
    targetCategory: 'Roofing contractor',
    platform: 'Thumbtack Pro',
    da: 88,
    cost: '100% Free Profile Creation',
    directUrl: 'https://www.thumbtack.com/pro',
    platformCategory: 'Roof Repair & Replacement',
    region: 'USA & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Instant matching for emergency roof leak repair and full shingle replacement citations.'
  },
  {
    id: 13,
    targetCategory: 'Roofing contractor',
    platform: 'Directorii',
    da: 52,
    cost: '100% Free Listing',
    directUrl: 'https://directorii.com/',
    platformCategory: 'Certified Roofing Contractor',
    region: 'USA & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Curated directory specifically for verified, insured roofing contractors and exterior specialists.'
  },
  {
    id: 14,
    targetCategory: 'Roofing contractor',
    platform: 'National Roofing Directory (US Roofing Co)',
    da: 45,
    cost: '100% Free Entry',
    directUrl: 'https://www.usroofingcompany.com/',
    platformCategory: 'Commercial & Residential Roofing',
    region: 'USA & Global',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Targeted niche directory passing high topical relevance signals directly for roofing keywords.'
  },

  // ==========================================
  // SECTION 3: CONSTRUCTION COMPANY & CONTRACTOR
  // ==========================================
  {
    id: 15,
    targetCategory: 'Construction company / Contractor',
    platform: 'The Blue Book Building & Construction',
    da: 72,
    cost: '100% Free Pro Listing',
    directUrl: 'https://www.thebluebook.com/proview/',
    platformCategory: 'General Contractor / Commercial Builder',
    region: 'Global & USA',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'The largest B2B construction and contractor network in the world. Essential for commercial builders.'
  },
  {
    id: 16,
    targetCategory: 'Construction company / Contractor',
    platform: 'BuildZoom',
    da: 73,
    cost: '100% Free Profile',
    directUrl: 'https://www.buildzoom.com/claim',
    platformCategory: 'Licensed General Contractor',
    region: 'Global & USA',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'Pulls municipal building permits and license records. Builds unmatched algorithmic trust.'
  },
  {
    id: 17,
    targetCategory: 'Construction company / Contractor',
    platform: 'Porch for Pros',
    da: 81,
    cost: '100% Free Profile',
    directUrl: 'https://porch.com/pro',
    platformCategory: 'General Construction & Remodeling',
    region: 'USA & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Major home service contractor platform partnered with inspection networks.'
  },
  {
    id: 18,
    targetCategory: 'Construction company / Contractor',
    platform: 'ConstructConnect',
    da: 68,
    cost: '100% Free Subcontractor Entry',
    directUrl: 'https://www.constructconnect.com/',
    platformCategory: 'Subcontractor / Construction Management',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Connects general contractors and subcontractors on bid boards and commercial projects.'
  },
  {
    id: 19,
    targetCategory: 'Construction company / Contractor',
    platform: 'Networx Pros',
    da: 60,
    cost: '100% Free Directory Entry',
    directUrl: 'https://www.networx.com/signup',
    platformCategory: 'Building Contractor',
    region: 'Global',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'High volume home improvement directory connecting local property owners with builders.'
  },
  {
    id: 20,
    targetCategory: 'Construction company / Contractor',
    platform: 'Contractors.com',
    da: 55,
    cost: '100% Free Listing',
    directUrl: 'https://www.contractors.com/',
    platformCategory: 'Residential & Commercial Contractor',
    region: 'Global',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Direct match trade portal for building, framing, masonry, and full turnkey construction.'
  },

  // ==========================================
  // SECTION 4: CHIMNEY SERVICES
  // ==========================================
  {
    id: 21,
    targetCategory: 'Chimney services',
    platform: 'Angi / HomeAdvisor (Chimney Sweep)',
    da: 89,
    cost: '100% Free Profile',
    directUrl: 'https://www.angi.com/pro/join',
    platformCategory: 'Chimney Sweep, Cleaning & Repair',
    region: 'USA & Global',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'The primary place homeowners search for local annual chimney inspection and flue cleaning.'
  },
  {
    id: 22,
    targetCategory: 'Chimney services',
    platform: 'Chimney Safety Institute of America (CSIA)',
    da: 65,
    cost: 'Directory Registry Listing',
    directUrl: 'https://www.csia.org/',
    platformCategory: 'Certified Chimney Sweep',
    region: 'USA & Global',
    priority: 'High Authority',
    status: 'Pending Submission',
    notes: 'Industry gold standard. Having a listing or citation here provides maximum topical authority.'
  },
  {
    id: 23,
    targetCategory: 'Chimney services',
    platform: 'Houzz (Fireplace & Chimney Specialists)',
    da: 91,
    cost: '100% Free Pro Profile',
    directUrl: 'https://www.houzz.com/professionals/join',
    platformCategory: 'Fireplace & Chimney Contractors',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Select sub-specialization "Fireplace & Chimney" under Contractor category.'
  },
  {
    id: 24,
    targetCategory: 'Chimney services',
    platform: 'Thumbtack (Chimney Cleaning)',
    da: 88,
    cost: '100% Free Profile',
    directUrl: 'https://www.thumbtack.com/pro',
    platformCategory: 'Chimney Cleaning & Flue Cap Repair',
    region: 'USA & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'High-intent emergency repair and seasonal winter cleaning leads.'
  },

  // ==========================================
  // SECTION 5: SCAFFOLDING RENTAL SERVICE
  // ==========================================
  {
    id: 25,
    targetCategory: 'Scaffolding rental service',
    platform: 'The Blue Book Construction (Scaffolding)',
    da: 72,
    cost: '100% Free Supplier Profile',
    directUrl: 'https://www.thebluebook.com/proview/',
    platformCategory: 'Scaffolding Rental, Erection & Shoring',
    region: 'Global & USA',
    priority: 'Urgent / Foundation',
    status: 'Pending Submission',
    notes: 'The single most important B2B directory for scaffolding rental suppliers and staging equipment.'
  },
  {
    id: 26,
    targetCategory: 'Scaffolding rental service',
    platform: 'RentalHQ (American Rental Association)',
    da: 55,
    cost: '100% Free Directory Search',
    directUrl: 'https://www.rentalhq.com/',
    platformCategory: 'Scaffolding & Heavy Equipment Rental',
    region: 'USA & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Powered by the American Rental Association. Home of equipment and staging rental providers.'
  },
  {
    id: 27,
    targetCategory: 'Scaffolding rental service',
    platform: 'Machinio (Heavy Equipment & Scaffolding)',
    da: 60,
    cost: '100% Free Dealer Registration',
    directUrl: 'https://www.machinio.com/sellers',
    platformCategory: 'Scaffolding Towers & Construction Staging',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Global marketplace for construction machinery, modular scaffolding, and shoring rental.'
  },
  {
    id: 28,
    targetCategory: 'Scaffolding rental service',
    platform: 'ThomasNet (Industrial Scaffolding)',
    da: 80,
    cost: '100% Free Supplier Listing',
    directUrl: 'https://www.thomasnet.com/register.html',
    platformCategory: 'Scaffolding Equipment & Supplies',
    region: 'Global & USA',
    priority: 'High Authority',
    status: 'Pending Submission',
    notes: 'Premier North American industrial B2B sourcing platform for heavy scaffolding and safety rigs.'
  },

  // ==========================================
  // SECTION 6: UNIVERSAL CITATIONS (FOR ALL 6 NICHES)
  // ==========================================
  {
    id: 29,
    targetCategory: 'All Categories (Universal)',
    platform: 'Google Business Profile',
    da: 100,
    cost: '100% Free',
    directUrl: 'https://business.google.com/',
    platformCategory: 'Real Estate / Contractor / Roofer / Chimney / Scaffolding',
    region: 'Global & Pakistan',
    priority: 'Mandatory / Core',
    status: 'Must Be Verified First',
    notes: 'Set the EXACT primary category matching the client (e.g. "Roofing contractor" or "Real estate agent").'
  },
  {
    id: 30,
    targetCategory: 'All Categories (Universal)',
    platform: 'Bing Places for Business',
    da: 93,
    cost: '100% Free',
    directUrl: 'https://www.bingplaces.com/',
    platformCategory: 'Sync with GBP Category',
    region: 'Global & Pakistan',
    priority: 'Urgent',
    status: 'Pending Submission',
    notes: 'Use 1-Click Import from Google Business Profile.'
  },
  {
    id: 31,
    targetCategory: 'All Categories (Universal)',
    platform: 'Apple Business Connect',
    da: 100,
    cost: '100% Free',
    directUrl: 'https://businessconnect.apple.com/',
    platformCategory: 'Local Business Listing',
    region: 'Global & Pakistan',
    priority: 'Urgent',
    status: 'Pending Submission',
    notes: 'Crucial for Apple Maps, iOS Siri search, and CarPlay directions.'
  },
  {
    id: 32,
    targetCategory: 'All Categories (Universal)',
    platform: 'Nextdoor for Business',
    da: 90,
    cost: '100% Free Business Page',
    directUrl: 'https://business.nextdoor.com/',
    platformCategory: 'Home Services / Real Estate / Contractor',
    region: 'Global (USA, UK, CA, AU)',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'The #1 neighborhood app for contractors, roofers, real estate agents, and home services.'
  },
  {
    id: 33,
    targetCategory: 'All Categories (Universal)',
    platform: 'Better Business Bureau (BBB)',
    da: 91,
    cost: '100% Free Standard Listing',
    directUrl: 'https://www.bbb.org/get-listed',
    platformCategory: 'Contractors / Construction / Real Estate',
    region: 'USA, Canada & Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Essential trust signal. Standard directory entry is free (Accreditation is optional).'
  },
  {
    id: 34,
    targetCategory: 'All Categories (Universal)',
    platform: 'Yelp for Business',
    da: 93,
    cost: '100% Free Claim',
    directUrl: 'https://biz.yelp.com/',
    platformCategory: 'Contractors / Real Estate / Roofing',
    region: 'Global',
    priority: 'High Priority',
    status: 'Pending Submission',
    notes: 'Massive review and consumer search hub. Free claim allows adding hours, photos, and phone.'
  },
  {
    id: 35,
    targetCategory: 'All Categories (Universal)',
    platform: 'YellowPages (YP.com)',
    da: 89,
    cost: '100% Free Basic Listing',
    directUrl: 'https://www.yellowpages.com/',
    platformCategory: 'General Contractors / Real Estate / Roofers',
    region: 'Global & USA',
    priority: 'Medium Priority',
    status: 'Pending Submission',
    notes: 'Classic directory authority. Claim free basic listing with phone and address.'
  },
  {
    id: 36,
    targetCategory: 'All Categories (Universal - Pakistan)',
    platform: 'BizBranches.pk',
    da: 42,
    cost: '100% Free',
    directUrl: 'https://bizbranches.pk/add-business',
    platformCategory: 'Construction / Real Estate / Services',
    region: 'Pakistan',
    priority: 'High Priority (PK)',
    status: 'Pending Submission',
    notes: 'Active local Pakistani directory with real estate, construction, and equipment hire categories.'
  },
  {
    id: 37,
    targetCategory: 'All Categories (Universal - Pakistan)',
    platform: 'BusinessList.pk',
    da: 48,
    cost: '100% Free',
    directUrl: 'https://www.businesslist.pk/',
    platformCategory: 'Building Contractors & Property',
    region: 'Pakistan',
    priority: 'High Priority (PK)',
    status: 'Pending Submission',
    notes: 'Comprehensive Pakistani directory covering builders, real estate agencies, and hire trades.'
  },
  {
    id: 38,
    targetCategory: 'All Categories (Universal - Pakistan)',
    platform: 'Jamal\'s Yellow Pages (Jamals.com)',
    da: 55,
    cost: '100% Free Basic',
    directUrl: 'https://www.jamals.com/',
    platformCategory: 'Construction & Real Estate Suppliers',
    region: 'Pakistan',
    priority: 'High Priority (PK)',
    status: 'Pending Submission',
    notes: 'Premier Pakistani trade index for contractors, scaffolding fabricators, and property brokers.'
  }
];

function escapeCsv(value) {
  if (value === null || value === undefined) return '""';
  const str = String(value).replace(/"/g, '""');
  return `"${str}"`;
}

const headers = [
  'ID',
  'Target Business Category',
  'Directory / Platform Name',
  'Domain Authority (DA)',
  'Pricing / Free Tier',
  'Direct Submission URL',
  'Recommended Platform Category',
  'Geographic Region',
  'Submission Priority',
  'Current Status',
  'Execution Notes & Tips'
];

let csvContent = '\uFEFF'; // UTF-8 BOM for Excel
csvContent += headers.map(escapeCsv).join(',') + '\r\n';

nicheCitations.forEach(item => {
  const row = [
    item.id,
    item.targetCategory,
    item.platform,
    item.da,
    item.cost,
    item.directUrl,
    item.platformCategory,
    item.region,
    item.priority,
    item.status,
    item.notes
  ];
  csvContent += row.map(escapeCsv).join(',') + '\r\n';
});

const outputPath = path.resolve('d:/waqasmehmood/Niche_Citations_RealEstate_Construction_Contractors.csv');
fs.writeFileSync(outputPath, csvContent, 'utf8');

console.log(`Successfully generated Niche Citation Master List with ${nicheCitations.length} entries at: ${outputPath}`);
