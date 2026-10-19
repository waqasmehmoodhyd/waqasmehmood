<?php

namespace Database\Seeders;

use App\Models\PortfolioItem;
use Illuminate\Database\Seeder;

class PortfolioSeeder extends Seeder
{
    public function run(): void
    {
        $items = [
            // 1. Graphic Design (4 Projects)
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

            // 2. Website Development (2 Projects)
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

            // 3. Social Media Marketing (SMM) (5 Projects)
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

            // 4. Google Ads (PPC) (1 Project)
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

            // 5. SEO Services (2 Projects)
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
