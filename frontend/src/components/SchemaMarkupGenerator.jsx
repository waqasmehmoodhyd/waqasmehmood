import React, { useState, useMemo } from 'react';
import { 
  Code, Copy, Check, Download, ExternalLink, Plus, Trash2, 
  HelpCircle, Sparkles, Eye, ArrowRight, ShieldCheck, 
  Layers, MapPin, FileText, CheckCircle, ChevronDown, ChevronUp, AlertCircle
} from 'lucide-react';

export default function SchemaMarkupGenerator({ onHireClick }) {
  const [schemaType, setSchemaType] = useState('faq'); // 'faq' | 'local' | 'howto' | 'article' | 'breadcrumb'
  const [copiedFormat, setCopiedFormat] = useState(null); // 'json' | 'script' | null

  // -------------------------------------------------------------
  // 1. FAQ SCHEMA STATE
  // -------------------------------------------------------------
  const [faqs, setFaqs] = useState([
    {
      q: 'What is the best SEO strategy for local businesses in 2026?',
      a: 'The most effective strategy combines LocalBusiness JSON-LD schema, Google Business Profile optimization, localized landmark content, and high-authority citation consistency.'
    },
    {
      q: 'How long does it take to see results from technical SEO audits?',
      a: 'Technical SEO fixes like resolving 404 crawl errors, optimizing Core Web Vitals, and implementing structured data typically show positive Google ranking improvements within 2 to 6 weeks.'
    }
  ]);

  // -------------------------------------------------------------
  // 2. LOCAL BUSINESS SCHEMA STATE
  // -------------------------------------------------------------
  const [localBiz, setLocalBiz] = useState({
    subType: 'ProfessionalService',
    name: 'Waqas Mehmood - Digital Marketing & SEO Architect',
    url: 'https://waqasmehmood.com',
    logo: 'https://waqasmehmood.com/assets/logo.png',
    telephone: '+92 303 3111126',
    priceRange: '$$',
    street: 'Auto Bhan Road, Latifabad',
    city: 'Hyderabad',
    region: 'Sindh',
    postalCode: '71000',
    country: 'PK',
    latitude: '25.3960',
    longitude: '68.3578',
    openingDays: 'Mo,Tu,We,Th,Fr,Sa',
    opens: '09:00',
    closes: '19:00'
  });

  // -------------------------------------------------------------
  // 3. HOW-TO SCHEMA STATE
  // -------------------------------------------------------------
  const [howTo, setHowTo] = useState({
    name: 'How to Implement JSON-LD Schema Markup in React',
    desc: 'Step-by-step technical guide to creating, testing, and inserting Google-compliant JSON-LD structured data into modern web applications.',
    totalTime: 'PT15M',
    estimatedCost: '0',
    currency: 'USD',
    steps: [
      { name: 'Choose Relevant Schema Type', text: 'Identify whether your content represents a FAQ, LocalBusiness, Article, or Product based on Schema.org standards.' },
      { name: 'Generate Clean JSON-LD Object', text: 'Structure your data into valid JSON with @context and @type definitions matching Google Search Central specifications.' },
      { name: 'Inject Script into Document Head', text: 'Embed the JSON-LD string inside a script tag with type="application/ld+json" or dynamically via React Helmet.' }
    ]
  });

  // -------------------------------------------------------------
  // 4. ARTICLE SCHEMA STATE
  // -------------------------------------------------------------
  const [article, setArticle] = useState({
    type: 'BlogPosting',
    headline: 'Ultimate Guide to Full-Funnel SEO & High-ROAS Google Ads',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&q=80',
    author: 'Waqas Mehmood',
    authorUrl: 'https://waqasmehmood.com/about',
    publisher: 'Waqas Mehmood Engineering',
    publisherLogo: 'https://waqasmehmood.com/assets/logo.png',
    datePublished: '2026-10-30',
    dateModified: '2026-11-01',
    description: 'Learn how unifying technical SEO, programmatic local siloing, and negative keyword PPC trees produces compounding organic business revenue.'
  });

  // -------------------------------------------------------------
  // 5. BREADCRUMB SCHEMA STATE
  // -------------------------------------------------------------
  const [breadcrumbs, setBreadcrumbs] = useState([
    { name: 'Home', url: 'https://waqasmehmood.com' },
    { name: 'All Tools', url: 'https://waqasmehmood.com/all-tools' },
    { name: 'Schema Generator', url: 'https://waqasmehmood.com/tools/schema-generator' }
  ]);

  // =============================================================
  // GENERATE DYNAMIC JSON-LD OBJECT
  // =============================================================
  const jsonLdObject = useMemo(() => {
    if (schemaType === 'faq') {
      return {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        'mainEntity': faqs.map(f => ({
          '@type': 'Question',
          'name': f.q || 'Question',
          'acceptedAnswer': {
            '@type': 'Answer',
            'text': f.a || 'Answer'
          }
        }))
      };
    }

    if (schemaType === 'local') {
      return {
        '@context': 'https://schema.org',
        '@type': localBiz.subType || 'LocalBusiness',
        'name': localBiz.name,
        'image': localBiz.logo,
        'url': localBiz.url,
        'telephone': localBiz.telephone,
        'priceRange': localBiz.priceRange,
        'address': {
          '@type': 'PostalAddress',
          'streetAddress': localBiz.street,
          'addressLocality': localBiz.city,
          'addressRegion': localBiz.region,
          'postalCode': localBiz.postalCode,
          'addressCountry': localBiz.country
        },
        'geo': {
          '@type': 'GeoCoordinates',
          'latitude': Number(localBiz.latitude) || 0,
          'longitude': Number(localBiz.longitude) || 0
        },
        'openingHoursSpecification': [
          {
            '@type': 'OpeningHoursSpecification',
            'dayOfWeek': localBiz.openingDays.split(','),
            'opens': localBiz.opens,
            'closes': localBiz.closes
          }
        ]
      };
    }

    if (schemaType === 'howto') {
      return {
        '@context': 'https://schema.org',
        '@type': 'HowTo',
        'name': howTo.name,
        'description': howTo.desc,
        'totalTime': howTo.totalTime,
        'step': howTo.steps.map((st, i) => ({
          '@type': 'HowToStep',
          'position': i + 1,
          'name': st.name || `Step ${i + 1}`,
          'itemListElement': [{
            '@type': 'HowToDirection',
            'text': st.text
          }]
        }))
      };
    }

    if (schemaType === 'article') {
      return {
        '@context': 'https://schema.org',
        '@type': article.type || 'BlogPosting',
        'headline': article.headline,
        'image': [article.image],
        'datePublished': article.datePublished,
        'dateModified': article.dateModified,
        'author': [{
          '@type': 'Person',
          'name': article.author,
          'url': article.authorUrl
        }],
        'publisher': {
          '@type': 'Organization',
          'name': article.publisher,
          'logo': {
            '@type': 'ImageObject',
            'url': article.publisherLogo
          }
        },
        'description': article.description
      };
    }

    if (schemaType === 'breadcrumb') {
      return {
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.map((crumb, i) => ({
          '@type': 'ListItem',
          'position': i + 1,
          'name': crumb.name,
          'item': crumb.url
        }))
      };
    }

    return {};
  }, [schemaType, faqs, localBiz, howTo, article, breadcrumbs]);

  const jsonString = useMemo(() => {
    return JSON.stringify(jsonLdObject, null, 2);
  }, [jsonLdObject]);

  const scriptTagString = useMemo(() => {
    return `<script type="application/ld+json">\n${jsonString}\n</script>`;
  }, [jsonString]);

  // Handlers for dynamic lists
  const handleAddFaq = () => {
    setFaqs([...faqs, { q: '', a: '' }]);
  };

  const handleRemoveFaq = (index) => {
    setFaqs(faqs.filter((_, i) => i !== index));
  };

  const handleUpdateFaq = (index, field, val) => {
    const updated = [...faqs];
    updated[index][field] = val;
    setFaqs(updated);
  };

  const handleAddStep = () => {
    setHowTo({
      ...howTo,
      steps: [...howTo.steps, { name: '', text: '' }]
    });
  };

  const handleRemoveStep = (index) => {
    setHowTo({
      ...howTo,
      steps: howTo.steps.filter((_, i) => i !== index)
    });
  };

  const handleUpdateStep = (index, field, val) => {
    const updated = [...howTo.steps];
    updated[index][field] = val;
    setHowTo({ ...howTo, steps: updated });
  };

  const handleAddCrumb = () => {
    setBreadcrumbs([...breadcrumbs, { name: '', url: 'https://' }]);
  };

  const handleRemoveCrumb = (index) => {
    setBreadcrumbs(breadcrumbs.filter((_, i) => i !== index));
  };

  const handleUpdateCrumb = (index, field, val) => {
    const updated = [...breadcrumbs];
    updated[index][field] = val;
    setBreadcrumbs(updated);
  };

  // Copy Handlers
  const handleCopy = (format) => {
    const text = format === 'script' ? scriptTagString : jsonString;
    navigator.clipboard.writeText(text);
    setCopiedFormat(format);
    setTimeout(() => setCopiedFormat(null), 2000);
  };

  // Download Handler
  const handleDownload = () => {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${schemaType}-schema.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Open Google Rich Results Tester
  const handleTestGoogle = () => {
    window.open('https://search.google.com/test/rich-results', '_blank');
  };

  return (
    <div className="space-y-10">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-mono font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Google Rich Results & SERP Enhancer</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              1-Click Schema JSON-LD Generator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Build 100% valid Schema.org structured data code for FAQs, Local Businesses, How-To steps, and Articles with instant copy and live Google Rich Snippet preview.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleTestGoogle}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Test code in Google Rich Results Test Tool"
            >
              <span>Google Test Tool</span>
              <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Schema Type Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-bold">
          {[
            { id: 'faq', label: 'FAQ Page', badge: 'High CTR' },
            { id: 'local', label: 'Local Business', badge: 'Maps 3-Pack' },
            { id: 'howto', label: 'How-To Guide', badge: 'Snippets' },
            { id: 'article', label: 'Article / Blog', badge: 'News' },
            { id: 'breadcrumb', label: 'Breadcrumbs', badge: 'Sitewide' }
          ].map((tab) => {
            const isSelected = schemaType === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSchemaType(tab.id)}
                className={`p-3 rounded-2xl flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                  isSelected
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 font-black'
                    : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
                }`}
              >
                <span className="text-xs">{tab.label}</span>
                <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded ${
                  isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'text-slate-500'
                }`}>
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Split Grid: Left Editor + Right Output */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* ======================================================== */}
        {/* LEFT COLUMN: INTERACTIVE FORM FIELDS (7 Cols)            */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 p-6 sm:p-7 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
          
          {/* TAB 1: FAQ FORM */}
          {schemaType === 'faq' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-cyan-400" />
                    <span>Frequently Asked Questions</span>
                  </h2>
                  <span className="text-[11px] text-slate-400">Add Q&A pairs to trigger accordion drop-downs in Google search</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddFaq}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Question</span>
                </button>
              </div>

              <div className="space-y-4 max-h-[550px] overflow-y-auto pr-1">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-cyan-400 font-bold">
                        Question #{idx + 1}
                      </span>
                      {faqs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveFaq(idx)}
                          className="text-slate-500 hover:text-rose-400 text-xs transition-colors p-1 cursor-pointer"
                          title="Delete this question"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">Question Text</label>
                      <input
                        type="text"
                        value={faq.q}
                        onChange={(e) => handleUpdateFaq(idx, 'q', e.target.value)}
                        placeholder="e.g. How much do SEO services cost in Pakistan?"
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-slate-300 font-semibold block">Accepted Answer</label>
                      <textarea
                        rows="3"
                        value={faq.a}
                        onChange={(e) => handleUpdateFaq(idx, 'a', e.target.value)}
                        placeholder="Detailed answer text that directly solves user intent..."
                        className="w-full px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: LOCAL BUSINESS FORM */}
          {schemaType === 'local' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-emerald-400" />
                  <span>Local Business & NAP Parameters</span>
                </h2>
                <span className="text-[11px] text-slate-400">Anchor your Google Maps 3-Pack geo-coordinates and hours</span>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Business Type</label>
                  <select
                    value={localBiz.subType}
                    onChange={(e) => setLocalBiz({ ...localBiz, subType: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  >
                    <option value="ProfessionalService">ProfessionalService (Agency / Consultant)</option>
                    <option value="LocalBusiness">General LocalBusiness</option>
                    <option value="Organization">Organization</option>
                    <option value="MedicalBusiness">MedicalBusiness / Clinic</option>
                    <option value="RealEstateAgent">RealEstateAgent</option>
                    <option value="LegalService">LegalService / Law Firm</option>
                    <option value="Store">Retail Store</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Business Name</label>
                  <input
                    type="text"
                    value={localBiz.name}
                    onChange={(e) => setLocalBiz({ ...localBiz, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Website URL</label>
                  <input
                    type="url"
                    value={localBiz.url}
                    onChange={(e) => setLocalBiz({ ...localBiz, url: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Official Telephone</label>
                  <input
                    type="text"
                    value={localBiz.telephone}
                    onChange={(e) => setLocalBiz({ ...localBiz, telephone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Street Address</label>
                  <input
                    type="text"
                    value={localBiz.street}
                    onChange={(e) => setLocalBiz({ ...localBiz, street: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">City / Locality</label>
                  <input
                    type="text"
                    value={localBiz.city}
                    onChange={(e) => setLocalBiz({ ...localBiz, city: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Region / State</label>
                  <input
                    type="text"
                    value={localBiz.region}
                    onChange={(e) => setLocalBiz({ ...localBiz, region: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Latitude</label>
                  <input
                    type="text"
                    value={localBiz.latitude}
                    onChange={(e) => setLocalBiz({ ...localBiz, latitude: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Longitude</label>
                  <input
                    type="text"
                    value={localBiz.longitude}
                    onChange={(e) => setLocalBiz({ ...localBiz, longitude: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HOW-TO FORM */}
          {schemaType === 'howto' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-amber-400" />
                    <span>How-To Guide Steps</span>
                  </h2>
                  <span className="text-[11px] text-slate-400">Trigger step-by-step visual rich cards in search</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddStep}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Guide Title</label>
                  <input
                    type="text"
                    value={howTo.name}
                    onChange={(e) => setHowTo({ ...howTo, name: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Description</label>
                  <textarea
                    rows="2"
                    value={howTo.desc}
                    onChange={(e) => setHowTo({ ...howTo, desc: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-3 pt-2 max-h-[350px] overflow-y-auto pr-1">
                  {howTo.steps.map((st, i) => (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[11px] font-mono text-amber-400 font-bold">Step {i + 1}</span>
                        {howTo.steps.length > 1 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveStep(i)}
                            className="text-slate-500 hover:text-rose-400 transition-colors p-1 cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => handleUpdateStep(i, 'name', e.target.value)}
                        placeholder={`Step ${i + 1} Headline`}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      />
                      <textarea
                        rows="2"
                        value={st.text}
                        onChange={(e) => handleUpdateStep(i, 'text', e.target.value)}
                        placeholder="Instructions for this step..."
                        className="w-full px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ARTICLE FORM */}
          {schemaType === 'article' && (
            <div className="space-y-4">
              <div className="pb-3 border-b border-slate-800">
                <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-cyan-400" />
                  <span>Article & Blog Meta Parameters</span>
                </h2>
                <span className="text-[11px] text-slate-400">Establish Google E-E-A-T authorship and fresh publication dates</span>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Headline</label>
                  <input
                    type="text"
                    value={article.headline}
                    onChange={(e) => setArticle({ ...article, headline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Author Name</label>
                    <input
                      type="text"
                      value={article.author}
                      onChange={(e) => setArticle({ ...article, author: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Publisher Name</label>
                    <input
                      type="text"
                      value={article.publisher}
                      onChange={(e) => setArticle({ ...article, publisher: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Date Published</label>
                    <input
                      type="date"
                      value={article.datePublished}
                      onChange={(e) => setArticle({ ...article, datePublished: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-300 font-semibold block mb-1">Date Modified</label>
                    <input
                      type="date"
                      value={article.dateModified}
                      onChange={(e) => setArticle({ ...article, dateModified: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] text-slate-300 font-semibold block mb-1">Article Summary Description</label>
                  <textarea
                    rows="3"
                    value={article.description}
                    onChange={(e) => setArticle({ ...article, description: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: BREADCRUMBS FORM */}
          {schemaType === 'breadcrumb' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    <Layers className="w-4 h-4 text-cyan-400" />
                    <span>Breadcrumb Hierarchy Levels</span>
                  </h2>
                  <span className="text-[11px] text-slate-400">Show navigational category paths in Google SERPs</span>
                </div>
                <button
                  type="button"
                  onClick={handleAddCrumb}
                  className="px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Level</span>
                </button>
              </div>

              <div className="space-y-3 text-xs">
                {breadcrumbs.map((crumb, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center font-mono text-[10px] text-cyan-400 font-bold shrink-0">
                      {idx + 1}
                    </span>
                    <input
                      type="text"
                      value={crumb.name}
                      onChange={(e) => handleUpdateCrumb(idx, 'name', e.target.value)}
                      placeholder="Page Label"
                      className="w-1/3 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
                    />
                    <input
                      type="url"
                      value={crumb.url}
                      onChange={(e) => handleUpdateCrumb(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white font-mono"
                    />
                    {breadcrumbs.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveCrumb(idx)}
                        className="text-slate-500 hover:text-rose-400 p-1 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* ======================================================== */}
        {/* RIGHT COLUMN: CODE GENERATOR + SERP PREVIEW (5 Cols)     */}
        {/* ======================================================== */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Live Google Search Snippet Preview Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-3">
            <div className="flex items-center justify-between text-xs font-mono pb-2 border-b border-slate-800">
              <span className="text-slate-400 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-cyan-400" />
                <span>Google SERP Rich Snippet Simulation</span>
              </span>
              <span className="text-emerald-400 font-bold">100% Valid</span>
            </div>

            {/* Google SERP Card Preview */}
            <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/80 space-y-2 text-left font-sans">
              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <span className="w-4 h-4 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center text-[10px] font-bold">W</span>
                <span className="text-slate-300 font-medium">waqasmehmood.com</span>
                <span>&rsaquo;</span>
                <span className="text-slate-500">{schemaType}</span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-blue-400 hover:underline cursor-pointer leading-snug">
                {schemaType === 'faq' ? 'Frequently Asked Questions & Expert Answers | Waqas Mehmood' :
                 schemaType === 'local' ? `${localBiz.name} - ${localBiz.city}, ${localBiz.region}` :
                 schemaType === 'howto' ? howTo.name :
                 schemaType === 'article' ? article.headline :
                 'Waqas Mehmood - Structured Navigation Path'}
              </h3>

              <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                {schemaType === 'faq' ? (faqs[0]?.a || 'Browse authoritative questions and answers.') :
                 schemaType === 'local' ? `Top-rated ${localBiz.subType} located at ${localBiz.street}, ${localBiz.city}. Call ${localBiz.telephone}.` :
                 schemaType === 'howto' ? howTo.desc :
                 schemaType === 'article' ? article.description :
                 'Explore internal pages and category hierarchy.'}
              </p>

              {/* Rich Result Features Simulation */}
              {schemaType === 'faq' && faqs.length > 0 && (
                <div className="pt-2 border-t border-slate-800/60 space-y-1.5 text-xs">
                  {faqs.slice(0, 2).map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-[11px] text-slate-300 py-1 px-2 rounded-lg bg-slate-900/60">
                      <span className="truncate pr-2 font-medium">{f.q || `Question #${i + 1}`}</span>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    </div>
                  ))}
                </div>
              )}

              {schemaType === 'local' && (
                <div className="pt-2 border-t border-slate-800/60 flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="text-amber-400">★★★★★ 5.0</span>
                  <span>•</span>
                  <span>Price: {localBiz.priceRange}</span>
                  <span>•</span>
                  <span>Hours: {localBiz.opens} - {localBiz.closes}</span>
                </div>
              )}
            </div>
          </div>

          {/* Generated Code Display Box */}
          <div className="p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-mono font-bold text-white uppercase">Google-Ready JSON-LD</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleCopy('script')}
                  className="px-2.5 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
                  title="Copy ready-to-paste <script> tag"
                >
                  {copiedFormat === 'script' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFormat === 'script' ? 'Copied Tag!' : 'Copy <script> Tag'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownload}
                  className="px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold border border-slate-700 flex items-center gap-1 transition-all cursor-pointer"
                  title="Download .json file"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>.JSON</span>
                </button>
              </div>
            </div>

            {/* Syntax Box */}
            <div className="relative">
              <pre className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-[380px] leading-relaxed">
                <code>{scriptTagString}</code>
              </pre>
            </div>

            {/* Direct Hire CTA Banner */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => onHireClick && onHireClick('Technical SEO & Schema Architecture')}
                className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-600 hover:from-cyan-400 hover:to-indigo-500 text-white font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
              >
                <span>Need Custom Schema Siloing for Your Site? Hire Waqas</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* FREQUENTLY ASKED QUESTIONS & SCHEMA BEST PRACTICES       */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <HelpCircle className="w-5 h-5 text-cyan-400" />
          <span>Schema Markup & Structured Data Knowledge Base</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">Where do I paste the generated JSON-LD code?</h3>
            <p className="text-slate-400">
              Paste the code directly inside the <code>&lt;head&gt;</code> tag of your HTML document, or anywhere in the <code>&lt;body&gt;</code>. If using WordPress, paste it via any Header/Footer Code plugin or into your theme header.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">Does JSON-LD Schema guarantee Google Rich Snippets?</h3>
            <p className="text-slate-400">
              Schema is required for rich snippets (accordions, stars, breadcrumbs), but Google's algorithmic quality filters decide whether to display them based on page authority, content relevance, and technical compliance.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">Why is JSON-LD preferred over Microdata and RDFa?</h3>
            <p className="text-slate-400">
              Google explicitly recommends JSON-LD because it separates structured data from your visual HTML markup, preventing rendering glitches, improving developer velocity, and allowing easy programmatic updates.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">Can I test this code before putting it on my live site?</h3>
            <p className="text-slate-400">
              Yes! Click the <strong>Google Test Tool</strong> button above to open Google's official Rich Results Test. Click the "Code" tab, paste the generated JSON-LD, and Google will validate it against all current live search guidelines.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
