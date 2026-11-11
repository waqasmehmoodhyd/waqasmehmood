Add-Type -AssemblyName System.Drawing

$outDir = "d:\waqasmehmood\extensions\store-assets\detailed-seo-ai"

function Save-ImageNoAlpha($bmp, $filePath) {
    # Ensure 24bpp RGB without alpha channel to strictly satisfy Chrome Web Store requirement
    $bmp24 = New-Object System.Drawing.Bitmap($bmp.Width, $bmp.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp24)
    $g.DrawImage($bmp, 0, 0, $bmp.Width, $bmp.Height)
    $g.Dispose()
    $bmp24.Save($filePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $bmp24.Dispose()
    $bmp.Dispose()
    Write-Host "Created: $filePath"
}

# ==========================================
# 1. STORE ICON (128 x 128)
# ==========================================
$icon = New-Object System.Drawing.Bitmap(128, 128)
$g = [System.Drawing.Graphics]::FromImage($icon)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Solid dark blue/slate background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$g.FillRectangle($bgBrush, 0, 0, 128, 128)
$bgBrush.Dispose()

# Glowing border
$borderPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 189, 248), 3)
$g.DrawRectangle($borderPen, 6, 6, 115, 115)
$borderPen.Dispose()

# Inner subtle border
$innerPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(99, 102, 241), 1)
$g.DrawRectangle($innerPen, 10, 10, 107, 107)
$innerPen.Dispose()

# WM Text
$fontWM = New-Object System.Drawing.Font("Segoe UI", 36, [System.Drawing.FontStyle]::Bold)
$textBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$sf = New-Object System.Drawing.StringFormat
$sf.Alignment = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center
$g.DrawString("WM", $fontWM, $textBrush, 64, 52, $sf)

# Subtitle SEO & AI
$fontSub = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$subBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
$g.DrawString("SEO & AI", $fontSub, $subBrush, 64, 98, $sf)

# Gold sparkle dot
$goldBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 158, 11))
$g.FillEllipse($goldBrush, 98, 20, 10, 10)
$goldBrush.Dispose()

$g.Dispose()
Save-ImageNoAlpha $icon "$outDir\store-icon-128x128.png"

# Helper for drawing rounded-style cards
function Draw-Card($g, $x, $y, $w, $h, $bgColor, $borderColor) {
    $brush = New-Object System.Drawing.SolidBrush($bgColor)
    $g.FillRectangle($brush, $x, $y, $w, $h)
    $brush.Dispose()
    if ($borderColor -ne $null) {
        $pen = New-Object System.Drawing.Pen($borderColor, 1)
        $g.DrawRectangle($pen, $x, $y, $w, $h)
        $pen.Dispose()
    }
}

# ==========================================
# 2. SCREENSHOT 1: OVERVIEW (1280 x 800)
# ==========================================
$s1 = New-Object System.Drawing.Bitmap(1280, 800)
$g = [System.Drawing.Graphics]::FromImage($s1)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Background #f8fafc
$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bg, 0, 0, 1280, 800)
$bg.Dispose()

# Top Hero Banner in screenshot
Draw-Card $g 0 0 1280 100 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$fH1 = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$fSub = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)
$wBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
$cyanBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(56, 189, 248))
$g.DrawString("1-Click Instant On-Page SEO Inspection", $fH1, $wBr, 40, 20)
$g.DrawString("Title pixel-width check, Meta Description, Canonical validation, Robots directives & Real-time SERP readiness.", $fSub, $cyanBr, 40, 60)

# Browser Frame
Draw-Card $g 40 130 1200 630 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(226, 232, 240))
# Browser Titlebar
Draw-Card $g 40 130 1200 45 ([System.Drawing.Color]::FromArgb(241, 245, 249)) ([System.Drawing.Color]::FromArgb(226, 232, 240))
# Traffic lights
$redBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(239, 68, 68))
$yelBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(245, 158, 11))
$grnBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(16, 185, 129))
$g.FillEllipse($redBr, 60, 147, 12, 12)
$g.FillEllipse($yelBr, 80, 147, 12, 12)
$g.FillEllipse($grnBr, 100, 147, 12, 12)
# URL Bar
Draw-Card $g 140 138 700 28 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$fUrl = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$darkBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(51, 65, 85))
$g.DrawString("https://waqasmehmood.com/services/seo-ai-optimization", $fUrl, $darkBr, 150, 142)

# Extension Popup Container Mockup inside Browser
Draw-Card $g 720 185 500 560 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(99, 102, 241))
# Extension Header
Draw-Card $g 720 185 500 65 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$fExtH = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Bold)
$fExtSub = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Regular)
$g.DrawString("WAQAS MEHMOOD  [PRO 2026]", $fExtH, $wBr, 740, 195)
$g.DrawString("DETAILED SEO • AEO • GEO ENGINE", $fExtSub, $cyanBr, 740, 220)

# Quick Score Ribbon
Draw-Card $g 720 250 500 45 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$fScore = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$g.DrawString("SEO: 96%    AEO: 92%    GEO: 88%    OVERALL: 93/100", $fScore, $grnBr, 740, 262)

# Tab Bar
Draw-Card $g 720 295 500 35 ([System.Drawing.Color]::FromArgb(241, 245, 249)) ([System.Drawing.Color]::FromArgb(226, 232, 240))
$fTab = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$blueBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(37, 99, 235))
$g.DrawString("[Overview]", $fTab, $blueBr, 735, 305)
$g.DrawString("Headings   Schema   Links   Images   AI & AEO 2026", $fTab, $darkBr, 810, 305)

# Overview Cards inside popup
# Card 1: Title
Draw-Card $g 735 340 470 70 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$fCardLbl = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$fCardVal = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$g.DrawString("PAGE TITLE  |  54 chars  |  498 px  [OK]", $fCardLbl, $blueBr, 745, 345)
$g.DrawString("Waqas Mehmood - Full Stack Web Developer & SEO Expert", $fCardVal, $darkBr, 745, 368)

# Card 2: Meta Description
Draw-Card $g 735 420 470 80 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$g.DrawString("META DESCRIPTION  |  142 chars  [OPTIMAL]", $fCardLbl, $grnBr, 745, 425)
$g.DrawString("Hire Waqas Mehmood for high-converting custom web apps, Next.js architecture, and top-ranking 2026 AI-driven SEO strategies.", $fCardVal, $darkBr, 745, 448)

# Card 3: Canonical & Robots
Draw-Card $g 735 510 470 65 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$g.DrawString("CANONICAL URL & ROBOTS DIRECTIVES", $fCardLbl, $blueBr, 745, 515)
$g.DrawString("Canonical: MATCHED (Self)  |  Robots: index, follow, max-snippet:-1", $fCardVal, $darkBr, 745, 538)

# Card 4: Metrics (Word count, etc)
Draw-Card $g 735 585 470 55 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$g.DrawString("PAGE METRICS", $fCardLbl, $blueBr, 745, 590)
$g.DrawString("Words: 1,840  |  Reading Time: 7 mins  |  Lang: en-US", $fCardVal, $darkBr, 745, 612)

# Left Column (Highlights Showcase on screenshot)
$fCalloutH = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$fCalloutB = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Regular)
$g.DrawString("Full On-Page Visibility in 1 Click", $fCalloutH, $darkBr, 70, 220)
$bullets = @(
    "V  Google SERP Pixel Width & Character Gauge",
    "V  Meta Description Length & Snippet Validation",
    "V  Canonical Match & Duplicate URL Alert",
    "V  Robots Directives (Index, Follow, Noarchive)",
    "V  Word Count, Reading Time & OpenGraph Status",
    "V  Zero-Latency: 100% In-Browser Execution"
)
$curY = 270
foreach ($b in $bullets) {
    $g.DrawString($b, $fCalloutB, $darkBr, 70, $curY)
    $curY += 40
}

# Feature pill at bottom left
Draw-Card $g 70 580 580 75 ([System.Drawing.Color]::FromArgb(238, 242, 255)) ([System.Drawing.Color]::FromArgb(199, 210, 254))
$fPillH = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$fPillB = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$purpleBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(79, 70, 229))
$g.DrawString("LIGHTWEIGHT & ZERO-TELEMETRY GUARANTEE", $fPillH, $purpleBr, 90, 592)
$g.DrawString("No tracking scripts, no external API lag, and no data sharing. Works completely offline & private.", $fPillB, $darkBr, 90, 618)

$g.Dispose()
Save-ImageNoAlpha $s1 "$outDir\screenshot-1-overview-1280x800.png"

# ==========================================
# 3. SCREENSHOT 2: AI & AEO 2026 ENGINE (1280 x 800)
# ==========================================
$s2 = New-Object System.Drawing.Bitmap(1280, 800)
$g = [System.Drawing.Graphics]::FromImage($s2)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bg, 0, 0, 1280, 800)
$bg.Dispose()

# Banner
Draw-Card $g 0 0 1280 100 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$g.DrawString("World's 1st AEO & AI Citability Engine (2026 Ready)", $fH1, $wBr, 40, 20)
$g.DrawString("Audit ChatGPT Search, Perplexity AI, Google Gemini & Claude citation readiness in real-time.", $fSub, $cyanBr, 40, 60)

# Left Column: AI Feature Highlights
$g.DrawString("Prepare Your Content for AI Search Engines", $fCalloutH, $darkBr, 70, 160)
$aiBullets = @(
    "V  AI Citability Score (0-100%): Answer Engine Readiness",
    "V  Direct-Answer & Q&A Block Detection for Snippets",
    "V  Entity Richness & Topic Density Analysis",
    "V  Hallucination Risk Prevention Check",
    "V  Perplexity & ChatGPT Search Citation Optimization",
    "V  Actionable Suggestions to Rank in AI Overviews"
)
$curY = 220
foreach ($b in $aiBullets) {
    $g.DrawString($b, $fCalloutB, $darkBr, 70, $curY)
    $curY += 42
}

# Mini Comparison Card
Draw-Card $g 70 510 560 210 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(226, 232, 240))
$fCmpH = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$fCmpB = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Regular)
$g.DrawString("Detailed.com vs. Detailed SEO & AI Engine", $fCmpH, $darkBr, 90, 525)
$g.DrawString("x  Detailed.com: Only checks 2015-era meta tags. No AI/AEO metrics.", $fCmpB, $redBr, 90, 560)
$g.DrawString("V  Detailed SEO & AI: Full On-Page + AI & AEO Citability Engine.", $fCmpB, $grnBr, 90, 595)
$g.DrawString("V  Includes 1-Click Client PDF Reports + JSON-LD Tree Explorer.", $fCmpB, $grnBr, 90, 630)
$g.DrawString("V  Direct WhatsApp & Email SEO Consultation Built-In.", $fCmpB, $blueBr, 90, 665)

# Right Column: Big AI Score Mockup Card
Draw-Card $g 680 140 540 610 ([System.Drawing.Color]::FromArgb(15, 23, 42)) ([System.Drawing.Color]::FromArgb(56, 189, 248))
$fAiCardH = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Bold)
$g.DrawString("AI & ANSWER ENGINE AUDIT (AEO 2026)", $fAiCardH, $cyanBr, 710, 165)

# Score Circle Mockup
Draw-Card $g 710 215 480 90 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$fBigScore = New-Object System.Drawing.Font("Segoe UI", 32, [System.Drawing.FontStyle]::Bold)
$g.DrawString("94 / 100", $fBigScore, $grnBr, 730, 225)
$fScoreLbl = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString("EXCELLENT AI CITABILITY STATUS", $fScoreLbl, $wBr, 920, 235)
$g.DrawString("High probability of being cited by LLMs", $fSub, $cyanBr, 920, 260)

$slateLightBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(203, 213, 225))
$slateLighterBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(226, 232, 240))
$slateDimBr = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(148, 163, 184))

# AI Criteria Breakdown Cards
$aiCards = @(
    @("Entity Density & Knowledge Graph", "96%", "Strong semantic relationships detected with Schema.org entities."),
    @("Direct-Answer Q&A Block Structure", "92%", "Clear H2/H3 question headers paired with direct factual answers."),
    @("Structured Summary & Fact Density", "95%", "Key takeaways formatted in parseable bullet points."),
    @("Hallucination Risk Prevention", "Low", "Content contains cited dates, exact author specs, and source URLs.")
)
$cardY = 325
foreach ($c in $aiCards) {
    Draw-Card $g 710 $cardY 480 80 ([System.Drawing.Color]::FromArgb(30, 41, 59)) ([System.Drawing.Color]::FromArgb(51, 65, 85))
    $g.DrawString($c[0], $fCardLbl, $wBr, 725, $cardY + 10)
    $g.DrawString($c[1], $fCardLbl, $cyanBr, 1120, $cardY + 10)
    $g.DrawString($c[2], $fCardVal, $slateLightBr, 725, $cardY + 38)
    $cardY += 92
}

$g.Dispose()
Save-ImageNoAlpha $s2 "$outDir\screenshot-2-ai-aeo-1280x800.png"

# ==========================================
# 4. SCREENSHOT 3: HEADINGS TREE VISUALIZER (1280 x 800)
# ==========================================
$s3 = New-Object System.Drawing.Bitmap(1280, 800)
$g = [System.Drawing.Graphics]::FromImage($s3)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bg, 0, 0, 1280, 800)
$bg.Dispose()

# Banner
Draw-Card $g 0 0 1280 100 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$g.DrawString("Interactive H1 - H6 Heading Hierarchy Visualizer", $fH1, $wBr, 40, 20)
$g.DrawString("Identify structural flaws, missing H1s, improper nesting, and export full heading outlines instantly.", $fSub, $cyanBr, 40, 60)

# Left Column
$g.DrawString("Audit Your Document Content Architecture", $fCalloutH, $darkBr, 70, 160)
$hBullets = @(
    "V  Complete H1 - H6 Visual Hierarchy Tree",
    "V  Automatic Warnings for Missing or Multiple H1s",
    "V  Skipped Heading Level Detection (e.g. H2 -> H4)",
    "V  Character & Word Counts for Every Subheading",
    "V  1-Click Copy Full Heading Outline for Reporting",
    "V  Highlights Heading Structure for Search Spiders"
)
$curY = 220
foreach ($b in $hBullets) {
    $g.DrawString($b, $fCalloutB, $darkBr, 70, $curY)
    $curY += 42
}

Draw-Card $g 70 520 540 180 ([System.Drawing.Color]::FromArgb(238, 242, 255)) ([System.Drawing.Color]::FromArgb(199, 210, 254))
$g.DrawString("WHY HEADING HIERARCHY MATTERS IN 2026", $fPillH, $purpleBr, 90, 540)
$g.DrawString("Search engines and AI models rely on clean heading hierarchies to comprehend topic relationships and extract answers for SERP snippets.", $fCalloutB, $darkBr, 90, 575)

# Right Column: Headings Tree Mockup
Draw-Card $g 660 140 560 610 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(203, 213, 225))
Draw-Card $g 660 140 560 55 ([System.Drawing.Color]::FromArgb(241, 245, 249)) ([System.Drawing.Color]::FromArgb(203, 213, 225))
$g.DrawString("HEADINGS TREE (18 Total)  -  [H1: 1  |  H2: 6  |  H3: 11]", $fCardLbl, $blueBr, 680, 158)

$headItems = @(
    @("H1", "Waqas Mehmood - Full Stack Web Developer & SEO Engineer", 0, $grnBr),
    @("H2", "High-Converting Custom Web Application Development", 20, $blueBr),
    @("H3", "Next.js & React Full-Stack Architecture", 40, $darkBr),
    @("H3", "Cloud Database Design & API Integrations", 40, $darkBr),
    @("H2", "Next-Gen SEO, AEO & AI Citability Optimization", 20, $blueBr),
    @("H3", "Semantic Search & Topic Cluster Architecture", 40, $darkBr),
    @("H3", "Schema.org Structured Data & Entity Graph", 40, $darkBr),
    @("H2", "Proven Portfolio & Client Case Studies", 20, $blueBr),
    @("H3", "E-Commerce Revenue Growth: 340% Case Study", 40, $darkBr),
    @("H2", "Frequently Asked Questions (FAQ)", 20, $blueBr),
    @("H2", "Get In Touch For A Strategic Consultation", 20, $blueBr)
)

$treeY = 210
foreach ($item in $headItems) {
    $tag = $item[0]
    $text = $item[1]
    $indent = $item[2]
    $color = $item[3]

    Draw-Card $g (680 + $indent) $treeY (520 - $indent) 38 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(226, 232, 240))
    $g.DrawString("[$tag]", $fCardLbl, $color, (690 + $indent), $treeY + 10)
    $g.DrawString($text, $fCardVal, $darkBr, (740 + $indent), $treeY + 9)
    $treeY += 46
}

$g.Dispose()
Save-ImageNoAlpha $s3 "$outDir\screenshot-3-headings-1280x800.png"

# ==========================================
# 5. SCREENSHOT 4: SCHEMA & STRUCTURED DATA (1280 x 800)
# ==========================================
$s4 = New-Object System.Drawing.Bitmap(1280, 800)
$g = [System.Drawing.Graphics]::FromImage($s4)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bg, 0, 0, 1280, 800)
$bg.Dispose()

# Banner
Draw-Card $g 0 0 1280 100 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$g.DrawString("JSON-LD & Microdata Schema Structured Data Inspector", $fH1, $wBr, 40, 20)
$g.DrawString("Inspect nested rich snippets, validate Schema.org entities, and copy formatted JSON with 1 click.", $fSub, $cyanBr, 40, 60)

# Left Column
$g.DrawString("Unlock Google Rich Results & Knowledge Panels", $fCalloutH, $darkBr, 70, 160)
$sBullets = @(
    "V  Detects All JSON-LD and Microdata Schemas",
    "V  Collapsible Nested Tree for Complex Objects",
    "V  Instant Validation of Required Schema Attributes",
    "V  Supports Article, Organization, Product, FAQ & Person",
    "V  1-Click Formatted JSON-LD Clipboard Copy",
    "V  Detects Broken Syntax & Missing @context Tags"
)
$curY = 220
foreach ($b in $sBullets) {
    $g.DrawString($b, $fCalloutB, $darkBr, 70, $curY)
    $curY += 42
}

Draw-Card $g 70 520 540 180 ([System.Drawing.Color]::FromArgb(240, 253, 244)) ([System.Drawing.Color]::FromArgb(187, 247, 208))
$g.DrawString("RICH SNIPPETS & KNOWLEDGE GRAPH", $fPillH, $grnBr, 90, 540)
$g.DrawString("Correct JSON-LD schema unlocks Google Star ratings, FAQ accordions, author trust badges, and direct citation in AI answers.", $fCalloutB, $darkBr, 90, 575)

# Right Column: Schema Inspector Card
Draw-Card $g 660 140 560 610 ([System.Drawing.Color]::FromArgb(15, 23, 42)) ([System.Drawing.Color]::FromArgb(51, 65, 85))
Draw-Card $g 660 140 560 55 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$g.DrawString("DETECTED SCHEMAS: 3 Entities Found  [VALID]", $fCardLbl, $grnBr, 680, 158)

$fCode = New-Object System.Drawing.Font("Consolas", 10, [System.Drawing.FontStyle]::Regular)
$schemaLines = @(
    "{",
    '  "@context": "https://schema.org",',
    '  "@graph": [',
    '    {',
    '      "@type": "Person",',
    '      "name": "Waqas Mehmood",',
    '      "jobTitle": "Full Stack Developer & SEO Specialist",',
    '      "url": "https://waqasmehmood.com",',
    '      "sameAs": ["https://github.com/waqasmehmood"]',
    '    },',
    '    {',
    '      "@type": "FAQPage",',
    '      "mainEntity": [',
    '        {',
    '          "@type": "Question",',
    '          "name": "What is AI & AEO Citability?",',
    '          "acceptedAnswer": { "@type": "Answer", "text": "..." }',
    '        }',
    '      ]',
    '    }',
    '  ]',
    "}"
)
$codeY = 210
foreach ($line in $schemaLines) {
    $g.DrawString($line, $fCode, $cyanBr, 680, $codeY)
    $codeY += 24
}

$g.Dispose()
Save-ImageNoAlpha $s4 "$outDir\screenshot-4-schema-1280x800.png"

# ==========================================
# 6. SCREENSHOT 5: PDF REPORT & LINK AUDIT (1280 x 800)
# ==========================================
$s5 = New-Object System.Drawing.Bitmap(1280, 800)
$g = [System.Drawing.Graphics]::FromImage($s5)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

$bg = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(248, 250, 252))
$g.FillRectangle($bg, 0, 0, 1280, 800)
$bg.Dispose()

# Banner
Draw-Card $g 0 0 1280 100 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$g.DrawString("1-Click Client PDF Export & Complete Link Auditor", $fH1, $wBr, 40, 20)
$g.DrawString("Generate professional client audit reports and inspect internal vs. external links with no external SaaS.", $fSub, $cyanBr, 40, 60)

# Left Column
$g.DrawString("Agency-Grade Client Audits In Seconds", $fCalloutH, $darkBr, 70, 160)
$pBullets = @(
    "V  Generate Client-Ready Branded PDF Audit Reports",
    "V  Total Links Breakdown: Internal vs. External Count",
    "V  Follow vs. Nofollow, Sponsored & UGC Link Badges",
    "V  Export Link Lists & Anchor Texts to CSV",
    "V  Missing Image Alt Tag Inspector with Dimensions",
    "V  Direct Consultation Booking with Waqas Mehmood"
)
$curY = 220
foreach ($b in $pBullets) {
    $g.DrawString($b, $fCalloutB, $darkBr, 70, $curY)
    $curY += 42
}

Draw-Card $g 70 520 540 180 ([System.Drawing.Color]::FromArgb(238, 242, 255)) ([System.Drawing.Color]::FromArgb(199, 210, 254))
$g.DrawString("AGENCY & FREELANCER FAVORITE", $fPillH, $purpleBr, 90, 540)
$g.DrawString("Impress your clients on sales calls. Click 'Export PDF' while sharing your screen to deliver an instant professional on-page SEO assessment.", $fCalloutB, $darkBr, 90, 575)

# Right Column: PDF Report Mockup Card
Draw-Card $g 660 140 560 610 ([System.Drawing.Color]::White) ([System.Drawing.Color]::FromArgb(203, 213, 225))
Draw-Card $g 660 140 560 60 ([System.Drawing.Color]::FromArgb(15, 23, 42)) $null
$g.DrawString("WAQAS MEHMOOD - ON-PAGE SEO AUDIT REPORT", $fCardLbl, $wBr, 680, 155)
$g.DrawString("Client-Ready PDF Document  •  Auto-Generated", $fSub, $cyanBr, 680, 175)

# Mini Mockup of PDF Content
Draw-Card $g 680 220 520 80 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(226, 232, 240))
$g.DrawString("AUDIT TARGET: https://waqasmehmood.com", $fCardLbl, $blueBr, 695, 230)
$g.DrawString("Overall Health Score: 93/100  |  Status: Highly Optimized", $fCardVal, $grnBr, 695, 255)

Draw-Card $g 680 320 520 180 ([System.Drawing.Color]::FromArgb(248, 250, 252)) ([System.Drawing.Color]::FromArgb(226, 232, 240))
$g.DrawString("LINKS ANALYSIS SUMMARY", $fCardLbl, $blueBr, 695, 330)
$g.DrawString("Total Links: 68  |  Internal: 52  |  External: 16", $fCardVal, $darkBr, 695, 355)
$g.DrawString("Follow Links: 61  |  Nofollow / Sponsored: 7", $fCardVal, $darkBr, 695, 385)
$g.DrawString("Missing Anchor Text: 0 (All Valid)  [CSV Exported]", $fCardVal, $grnBr, 695, 415)
$g.DrawString("Images Checked: 14  |  Missing Alt Tags: 0", $fCardVal, $grnBr, 695, 445)

Draw-Card $g 680 520 520 90 ([System.Drawing.Color]::FromArgb(37, 99, 235)) $null
$fBtnBig = New-Object System.Drawing.Font("Segoe UI", 14, [System.Drawing.FontStyle]::Bold)
$g.DrawString("[v] DOWNLOAD CLIENT PDF REPORT (READY)", $fBtnBig, $wBr, 720, 550)

$g.Dispose()
Save-ImageNoAlpha $s5 "$outDir\screenshot-5-pdf-export-1280x800.png"

# ==========================================
# 7. SMALL PROMO TILE (440 x 280)
# ==========================================
$promoSmall = New-Object System.Drawing.Bitmap(440, 280)
$g = [System.Drawing.Graphics]::FromImage($promoSmall)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Deep rich slate background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15, 23, 42))
$g.FillRectangle($bgBrush, 0, 0, 440, 280)
$bgBrush.Dispose()

# Glowing border
$pPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 189, 248), 2)
$g.DrawRectangle($pPen, 4, 4, 431, 271)
$pPen.Dispose()

# Badge PRO 2026
Draw-Card $g 24 22 90 24 ([System.Drawing.Color]::FromArgb(37, 99, 235)) $null
$fBadge = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Bold)
$g.DrawString("PRO 2026", $fBadge, $wBr, 40, 27)

# Title
$fTitle = New-Object System.Drawing.Font("Segoe UI", 18, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Detailed SEO & AI", $fTitle, $wBr, 24, 55)

# Subtitle
$fSubtitle = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$g.DrawString("AEO & Citability Engine In 1-Click", $fSubtitle, $cyanBr, 24, 90)

# Feature Badges
$badges = @("V On-Page SEO", "V AI Citability (AEO)", "V JSON-LD Schema", "V 1-Click PDF Report")
$bY = 125
foreach ($b in $badges) {
    Draw-Card $g 24 $bY 190 26 ([System.Drawing.Color]::FromArgb(30, 41, 59)) ([System.Drawing.Color]::FromArgb(51, 65, 85))
    $g.DrawString($b, $fBadge, $slateLighterBr, 32, $bY + 6)
    $bY += 32
}

# Mini Score Box on the right
Draw-Card $g 245 125 170 120 ([System.Drawing.Color]::FromArgb(30, 41, 59)) ([System.Drawing.Color]::FromArgb(56, 189, 248))
$fBoxH = New-Object System.Drawing.Font("Segoe UI", 9, [System.Drawing.FontStyle]::Bold)
$g.DrawString("AUDIT SCORE", $fBoxH, $cyanBr, 260, 135)
$fScoreNum = New-Object System.Drawing.Font("Segoe UI", 24, [System.Drawing.FontStyle]::Bold)
$g.DrawString("94%", $fScoreNum, $grnBr, 260, 155)
$g.DrawString("AI Search Ready", $fBadge, $slateLightBr, 260, 205)

# Footer signature
$fFoot = New-Object System.Drawing.Font("Segoe UI", 8, [System.Drawing.FontStyle]::Regular)
$g.DrawString("Engineered by Waqas Mehmood", $fFoot, $slateDimBr, 24, 255)

$g.Dispose()
Save-ImageNoAlpha $promoSmall "$outDir\small-promo-tile-440x280.png"

# ==========================================
# 8. MARQUEE PROMO TILE (1400 x 560)
# ==========================================
$marquee = New-Object System.Drawing.Bitmap(1400, 560)
$g = [System.Drawing.Graphics]::FromImage($marquee)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit

# Rich Dark Background
$bgBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(11, 15, 25))
$g.FillRectangle($bgBrush, 0, 0, 1400, 560)
$bgBrush.Dispose()

# Glowing Border
$mPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(56, 189, 248), 3)
$g.DrawRectangle($mPen, 6, 6, 1387, 547)
$mPen.Dispose()

# Badge
Draw-Card $g 70 50 140 32 ([System.Drawing.Color]::FromArgb(37, 99, 235)) $null
$fMarqBadge = New-Object System.Drawing.Font("Segoe UI", 10, [System.Drawing.FontStyle]::Bold)
$g.DrawString("2026 EDITION", $fMarqBadge, $wBr, 95, 57)

# Big Headline
$fMarqH1 = New-Object System.Drawing.Font("Segoe UI", 36, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Detailed SEO & AI Engine", $fMarqH1, $wBr, 70, 95)

# Subtitle
$fMarqSub = New-Object System.Drawing.Font("Segoe UI", 16, [System.Drawing.FontStyle]::Regular)
$g.DrawString("The Next-Gen On-Page SEO, AEO & AI Citability Inspector for Modern Webmasters.", $fMarqSub, $cyanBr, 70, 165)

# Left Column Bullets
$mBullets = @(
    "V  Google SERP Pixel-Width & Real-Time Meta Tags",
    "V  AEO & Citability Score for ChatGPT, Perplexity & Gemini",
    "V  Interactive H1 - H6 Heading Hierarchy Visualizer",
    "V  Nested JSON-LD & Microdata Schema Explorer",
    "V  1-Click Client-Ready PDF Report & CSV Links Auditor",
    "V  100% Client-Side In-Browser Execution & Zero Telemetry"
)
$mY = 225
$fMBullet = New-Object System.Drawing.Font("Segoe UI", 13, [System.Drawing.FontStyle]::Regular)
foreach ($b in $mBullets) {
    $g.DrawString($b, $fMBullet, $slateLighterBr, 70, $mY)
    $mY += 38
}

# Footer branding
$fDev = New-Object System.Drawing.Font("Segoe UI", 11, [System.Drawing.FontStyle]::Bold)
$g.DrawString("Developed with passion by WAQAS MEHMOOD  |  waqasmehmood.com", $fDev, $slateDimBr, 70, 485)

# Right Column: Big Preview Mockup Card
Draw-Card $g 820 60 520 440 ([System.Drawing.Color]::FromArgb(15, 23, 42)) ([System.Drawing.Color]::FromArgb(56, 189, 248))
# Header of mockup
Draw-Card $g 820 60 520 50 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$g.DrawString("DETAILED SEO & AI ENGINE  [ACTIVE SCAN]", $fBadge, $cyanBr, 840, 78)

# Score cards inside mockup
Draw-Card $g 845 130 470 70 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$g.DrawString("OVERALL AUDIT SCORE", $fBadge, $wBr, 860, 142)
$g.DrawString("94 / 100", $fTitle, $grnBr, 860, 162)
$g.DrawString("SEO: 96%  •  AEO: 92%  •  GEO: 88%", $fCardLbl, $cyanBr, 1020, 165)

# Feature summary row
Draw-Card $g 845 220 470 65 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$g.DrawString("PAGE TITLE: 54 chars  |  498 px (OPTIMAL)", $fCardLbl, $grnBr, 860, 235)
$g.DrawString("Waqas Mehmood - Full Stack Web Developer & SEO", $fBadge, $slateLightBr, 860, 258)

Draw-Card $g 845 305 470 65 ([System.Drawing.Color]::FromArgb(30, 41, 59)) $null
$g.DrawString("AI CITABILITY & DIRECT-ANSWER STATUS", $fCardLbl, $cyanBr, 860, 320)
$g.DrawString("High entity density, Q&A blocks, and JSON-LD schema detected.", $fBadge, $slateLightBr, 860, 342)

Draw-Card $g 845 390 470 80 ([System.Drawing.Color]::FromArgb(37, 99, 235)) $null
$fBtnMarq = New-Object System.Drawing.Font("Segoe UI", 12, [System.Drawing.FontStyle]::Bold)
$g.DrawString("[v] 1-CLICK EXPORT CLIENT PDF REPORT", $fBtnMarq, $wBr, 920, 420)

$g.Dispose()
Save-ImageNoAlpha $marquee "$outDir\marquee-promo-tile-1400x560.png"

Write-Host "ALL ASSETS GENERATED SUCCESSFULLY!"
