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
        ];

        PortfolioItem::truncate();
        foreach ($items as $item) {
            PortfolioItem::create($item);
        }
    }
}
