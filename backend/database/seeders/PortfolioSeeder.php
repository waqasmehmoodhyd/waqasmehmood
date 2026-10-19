<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // 1. Graphic Design
            [
                'title' => 'RNBX_Logo_RealState',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => '48 hours Deliverable',
                'desc' => '1. BRNBX HOLDINGS LLC 2. Real Estate 3. Graphic and text The logo style should I like are badges and shield type',
                'tags' => ['Abstract Style', 'Logo Design', 'Modern Style', 'Geometric'],
                'image' => '/portfolio/BRNBX.png',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322796377623941120',
            ],
            [
                'title' => 'PlenishEverGreen',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => '48 hours Deliverable',
                'desc' => '1. Biodegradable products. 2. Green 3. Graphic and text',
                'tags' => ['Abstract Style', 'Logo Design', 'Sketch Style', 'Geometric'],
                'image' => '/portfolio/PlenishEverGreen.png',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322792439226556416',
            ],
            [
                'title' => 'BUDS_Cannabies',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => '48 hours Deliverable',
                'desc' => '1. Biodegradable products. 2. Green 3. Graphic and text',
                'tags' => ['Abstract Style', 'Logo Design', 'Sketch Style', 'Corporate Style'],
                'image' => '/portfolio/BUDS_Cannabies.png',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322620930029772800',
            ],
            [
                'title' => 'CrueltyFree_Logo',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => '48 hours Deliverable',
                'desc' => 'Looking for a clean, modern redesign of my logo. Need it delivered in all formats including jpg, eps, pdf, and png:',
                'tags' => ['Abstract Style', 'Logo Design', 'Modern Style'],
                'image' => 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1322636413772300288',
            ],
            [
                'title' => 'Nexus Fintech - 3D Brand Identity & Design System',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => 'Global Rebrand • 40+ Assets',
                'desc' => 'Designed complete visual identity, typography system, 3D product illustrations, and design guidelines for a Series-A UK fintech brand.',
                'tags' => ['Figma', 'Brand Identity', '3D Modeling', 'Vector Art', 'Styleguide'],
                'image' => 'https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'Aura Luxury Skincare - E-Commerce Packaging & UI/UX',
                'category' => 'graphic',
                'category_label' => 'Graphic Design',
                'metrics' => 'Packaging Suite + 18 Mobile UI Screens',
                'desc' => 'Crafted minimalist cosmetic packaging labels, social launch aesthetic kit, and responsive Figma mobile shopping prototypes.',
                'tags' => ['UI/UX', 'Packaging Design', 'Adobe Illustrator', 'Luxury Branding'],
                'image' => 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],

            // 2. Website Development
            [
                'title' => 'FIGMA design to Responsive WordPress Site',
                'category' => 'webdev',
                'category_label' => 'Website Development',
                'metrics' => '48 hours Deliverable',
                'desc' => 'Nestled within a 15-day window, this project challenged our duo of developers and single designer to translate a Figma blueprint into a live, multi-page WordPress website',
                'tags' => ['Figma', 'Ecommerce Website', 'WordPress Development', 'Responsive Design', 'PSD to WordPress'],
                'image' => '/portfolio/FIGMA-design-to-Responsive-WordPress-Site.png',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1781011197507096576',
            ],
            [
                'title' => 'Building BudsSmoke\'s Online Store for Cannabis Products',
                'category' => 'webdev',
                'category_label' => 'Website Development',
                'metrics' => '48 hours Deliverable',
                'desc' => 'The primary challenge was to create a multi-page website that not only showcased BudsSmoke\'s extensive catalog but also embodied the brand\'s ethos and customer-centric vision within a tight 20-day timeline. Additionally, stringent regulations surrounding cannabis sales required an acute focus on compliance without compromising the user experience',
                'tags' => ['Figma', 'Ecommerce Website', 'WordPress Development', 'Responsive Design', 'PSD to WordPress'],
                'image' => '/portfolio/Building-BudsSmokes-Online-Store-for-Cannabis-Products.png',
                'project_url' => 'https://www.upwork.com/freelancers/~0194e2aaf57cdb94e2?p=1781723260418596864',
            ],
            [
                'title' => 'Waqas Mehmood SEO Engine - Full-Stack React & Laravel 11',
                'category' => 'webdev',
                'category_label' => 'Website Development',
                'metrics' => '99.8% Lighthouse Speed • 0 API Dependency',
                'desc' => 'Engineered custom high-speed DOM scraping engine with 25 real-time diagnostic tools, Tailwind CSS v4 reactive UI, and sub-second crawl processing.',
                'tags' => ['React.js', 'PHP Laravel 11', 'Tailwind v4', 'DOM Scraper', 'REST API'],
                'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'Apex Logistics - Headless Fleet Management Portal',
                'category' => 'webdev',
                'category_label' => 'Website Development',
                'metrics' => 'Real-Time Dispatching • 10k+ Monthly Bookings',
                'desc' => 'Custom client management portal with real-time GPS tracking dashboard, automated invoice generation, and client portal access.',
                'tags' => ['Laravel API', 'Vue/React', 'PostgreSQL', 'Tailwind', 'Docker'],
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],

            // 3. Social Media Marketing (SMM)
            [
                'title' => 'Page / Follow Campaign',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => 'Depending on campaign',
                'desc' => 'Brand want to Engage user with our post or video',
                'tags' => ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
                'image' => '/portfolio/Page-Follow-Campaign.png',
                'project_url' => 'https://drive.google.com/file/d/1CY5gYCovm753zI6YZMNm-NryUaoZowXk/view?usp=sharing',
            ],
            [
                'title' => 'Video View for Brand',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => 'Depending on campaign',
                'desc' => 'Brand want to Engage user with our video and getting views',
                'tags' => ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
                'image' => '/portfolio/Video-View-for-Brand.png',
                'project_url' => 'https://drive.google.com/file/d/1I48ed5YKJ5_vNhoZkRZ8Zmll_-frmp6S/view?usp=sharing',
            ],
            [
                'title' => 'WhatsApp / Messenger Messages',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => 'Depending on campaign',
                'desc' => 'Brand want to get user come on WhatsApp /  messenger to get info',
                'tags' => ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
                'image' => '/portfolio/WhatsApp-Messenger-Messages.png',
                'project_url' => 'https://drive.google.com/file/d/14xr2EquFIOHa9wGHwB4bVeNJbYKvrW9q/view?usp=sharing',
            ],
            [
                'title' => 'Instagram Profile Visitor',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => 'Depending on campaign',
                'desc' => 'Brands wants to visit audience on Instagram Profile and get inform as they want',
                'tags' => ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
                'image' => '/portfolio/Instagram-Profile-Visitor.png',
                'project_url' => 'https://drive.google.com/file/d/1sdHCfdGD8-PTDroCANiFqwEDpe-zbkpP/view?usp=sharing',
            ],
            [
                'title' => 'Page Follow / Page Like',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => 'Depending on campaign',
                'desc' => 'Brand want to audience come at our page or check out all information as they provided and hit button on page follow',
                'tags' => ['Facebook', 'Instagram', 'Snapchat', 'Tiktok'],
                'image' => '/portfolio/Page-Follow-Page-Like.png',
                'project_url' => 'https://drive.google.com/file/d/19VL95ChuPI4zU6UbFKTTvqQXHqjbovWh/view?usp=sharing',
            ],
            [
                'title' => 'Elevate Fitness - Viral Reel Strategy & TikTok Growth',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => '+1.4M Organic Views • 34k Follower Gain',
                'desc' => 'Developed high-retention video content calendar, hook scripts, and influencer collab campaign resulting in 18x organic engagement.',
                'tags' => ['Social Strategy', 'Reels / Shorts', 'Community Growth', 'Viral Hook Framework'],
                'image' => 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'Zenith SaaS - B2B LinkedIn Thought Leadership Funnel',
                'category' => 'smm',
                'category_label' => 'SMM',
                'metrics' => '420+ Inbound Sales DMs • $85k Closed Pipeline',
                'desc' => 'Positioned founder as top industry voice through weekly data breakdown carousels, executive copywriting, and targeted outreach.',
                'tags' => ['B2B Marketing', 'LinkedIn Growth', 'Executive Ghostwriting', 'Lead Generation'],
                'image' => 'https://images.unsplash.com/photo-1579389083078-4e7018379f7e?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],

            // 4. Google Ads (PPC)
            [
                'title' => 'Google Search Ads / PPC',
                'category' => 'googleads',
                'category_label' => 'Google Ads',
                'metrics' => 'Depending on campaign',
                'desc' => 'User search on search engine (Google.com) query will find out Ads will show as they write keyword (our ads will show on top according to the keyword)',
                'tags' => ['Google Ads', 'Google Search', 'PPC Campaigns', 'Keyword Bidding'],
                'image' => '/portfolio/Time_series-Google-Ads.png',
                'project_url' => 'https://drive.google.com/file/d/1hO7xSgqdSP2kmhXtySAIED7_qGLAK7Wq/view?usp=sharing',
            ],
            [
                'title' => 'Nordic Gear E-commerce - Performance Max & Search Scale',
                'category' => 'googleads',
                'category_label' => 'Google Ads',
                'metrics' => '5.2x Blended ROAS • $240k Revenue / Month',
                'desc' => 'Restructured shopping feed, implemented server-side conversion tracking, and segmented high-intent generic search keywords.',
                'tags' => ['Performance Max', 'Google Search', 'Merchant Center', 'Server-Side GTM'],
                'image' => 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'Dental Care Clinics - Local Call-Only & Geo-Targeted PPC',
                'category' => 'googleads',
                'category_label' => 'Google Ads',
                'metrics' => '$14.20 CPA • 380+ Monthly Emergency Bookings',
                'desc' => 'Targeted high-intent local dental pain points with radius bid adjustments, negative keyword hygiene, and call extension tracking.',
                'tags' => ['Local PPC', 'Call-Only Ads', 'Negative KW Sculpting', 'Landing Page A/B'],
                'image' => 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],

            // 5. SEO Services
            [
                'title' => 'SaaS Migration & Technical SEO Audit - 250k Page Portal',
                'category' => 'seo',
                'category_label' => 'SEO Services',
                'metrics' => '+320% Organic Traffic • 0 Index Loss',
                'desc' => 'Led enterprise URL redesign with 1-to-1 regex redirects, solved canonical pagination loops, and deployed automated JSON-LD schema.',
                'tags' => ['Technical Audit', '301 Redirect Mapping', 'Crawl Budget', 'Core Web Vitals'],
                'image' => 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'National Home Services - Local Pack Domination (#1 in 14 Cities)',
                'category' => 'seo',
                'category_label' => 'SEO Services',
                'metrics' => '#1 Map Pack Rank • +610% Phone Calls',
                'desc' => 'Built localized city landing pages with localized schema, cleaned up 80+ citation inconsistencies, and automated review generation funnels.',
                'tags' => ['Local SEO', 'GBP Optimization', 'NAP Consistency', 'Schema JSON-LD'],
                'image' => 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'E-Commerce Organic Traffic Scaling (+380%)',
                'category' => 'seo',
                'category_label' => 'SEO Services',
                'metrics' => '+380% Organic Revenue',
                'desc' => 'Executed deep technical schema siloing, Core Web Vitals fixes, and On-Page keyword architecture to dominate high-intent commercial keywords.',
                'tags' => ['Technical SEO', 'On-Page', 'Schema JSON-LD', 'Keyword Silos'],
                'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
            [
                'title' => 'Local SEO & Google Business Profile 3-Pack Takeover',
                'category' => 'seo',
                'category_label' => 'SEO Services',
                'metrics' => '#1 Local Map Pack',
                'desc' => 'Dominated regional search terms for multi-location clinics with NAP citation cleanup, review velocity systems, and geotargeted landing pages.',
                'tags' => ['Local SEO', 'GBP Optimization', 'NAP Audits', 'Local Citations'],
                'image' => 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=800&q=80',
                'project_url' => 'https://waqasmehmood.com',
            ],
        ];

        PortfolioItem::truncate();
        foreach ($items as $item) {
            PortfolioItem::create($item);
        }
    }
}
