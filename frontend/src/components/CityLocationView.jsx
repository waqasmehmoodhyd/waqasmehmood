import React, { useState } from 'react';
import { 
  MapPin, ShieldCheck, CheckCircle2, Star, TrendingUp, Search, 
  ExternalLink, ArrowRight, Phone, Mail, Award, HelpCircle, 
  ChevronDown, Globe, Sparkles, Building2, Check
} from 'lucide-react';
import { CITIES_DATA } from '../data/citiesData.js';

export default function CityLocationView({ 
  citySlug, 
  onNavigateHome, 
  onNavigateTools, 
  onNavigateTool, 
  onOpenHire,
  onSwitchCity 
}) {
  const city = CITIES_DATA[citySlug] || CITIES_DATA['hyderabad'];
  const [openFaq, setOpenFaq] = useState(0);

  return (
    <div className="space-y-16 py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-slate-400">
        <button 
          onClick={onNavigateHome}
          className="hover:text-cyan-400 transition-colors font-medium cursor-pointer"
        >
          Best SEO Expert
        </button>
        <span>/</span>
        <span className="text-slate-500">Locations</span>
        <span>/</span>
        <span className="text-cyan-400 font-semibold">{city.cityName}</span>
      </nav>

      {/* Hero Section */}
      <header className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-semibold text-cyan-300">
          <MapPin className="w-3.5 h-3.5 text-cyan-400 animate-bounce" />
          <span>{city.heroBadge}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-4xl mx-auto">
          {city.headline}
        </h1>

        <p className="text-sm sm:text-base text-slate-300 max-w-3xl mx-auto leading-relaxed">
          {city.intro}
        </p>

        {/* Action CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <button 
            onClick={() => onOpenHire(`Local SEO in ${city.cityName}`)}
            className="px-6 py-3.5 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-xl shadow-cyan-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span>Hire Local SEO Expert in {city.cityName}</span>
          </button>

          <button 
            onClick={() => onNavigateTool('local-seo-audit-tool')}
            className="px-6 py-3.5 rounded-xl font-semibold text-xs sm:text-sm bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4 text-cyan-400" />
            <span>Run Free Local SEO Audit</span>
          </button>
        </div>

        {/* Local Performance Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pt-6 max-w-3xl mx-auto">
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-cyan-400">{city.stats.clientsServed}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">{city.cityName} Businesses Ranked</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
            <div className="text-2xl sm:text-3xl font-black text-emerald-400">{city.stats.avgRankingBoost}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Average Ranking Growth</div>
          </div>
          <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 col-span-2 sm:col-span-1">
            <div className="text-2xl sm:text-3xl font-black text-indigo-400">{city.stats.mapTop3Rate}</div>
            <div className="text-[11px] text-slate-400 mt-0.5">Google Maps Top-3 Win Rate</div>
          </div>
        </div>
      </header>

      {/* Local Coverage Areas */}
      <section className="space-y-4 p-6 sm:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80">
        <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase tracking-wider">
          <Building2 className="w-4 h-4" />
          <span>Local Service Coverage in {city.cityName}, {city.province}</span>
        </div>
        <p className="text-xs text-slate-300">
          We provide dedicated on-page, local citations, and Google Business Profile optimization across key districts:
        </p>
        <div className="flex flex-wrap gap-2 pt-2">
          {city.localAreas.map((area, idx) => (
            <span 
              key={idx}
              className="px-3 py-1.5 rounded-xl bg-slate-950 text-xs font-semibold text-slate-200 border border-slate-800 flex items-center gap-1.5"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>{area}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Tailored Local Services */}
      <section className="space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Localized Strategy</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Tailored SEO Services for {city.cityName} Businesses
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Engineered to dominate Google Local 3-Pack, local organic keywords, and high-converting commercial searches.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {city.services.map((svc, idx) => (
            <div 
              key={idx}
              className="p-6 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all space-y-3"
            >
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 font-bold text-xs font-mono">
                0{idx + 1}
              </div>
              <h3 className="text-base font-bold text-white">{svc}</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Full technical execution including localized schema structured data, hyper-local backlink citations, and DOM optimizations designed specifically for {city.cityName}.
              </p>
            </div>
          ))}

          {/* Local Free Tool Teaser */}
          <div className="p-6 rounded-2xl bg-gradient-to-br from-cyan-950/40 to-blue-950/40 border border-cyan-500/30 flex flex-col justify-between space-y-4">
            <div className="space-y-2">
              <span className="text-[10px] font-mono text-cyan-400 uppercase font-bold tracking-wider">Free Diagnostic</span>
              <h3 className="text-base font-bold text-white">Audit Your {city.cityName} Business</h3>
              <p className="text-xs text-slate-300">
                Check your Name, Address, Phone (NAP) consistency and Google Business Profile signals instantly with our in-house tools.
              </p>
            </div>
            <button 
              onClick={() => onNavigateTool('nap-consistency-checker')}
              className="w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Launch NAP Checker</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </section>

      {/* Localized FAQ Accordion */}
      <section className="space-y-6 pt-6 border-t border-slate-800">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-cyan-400">Frequently Asked Questions</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Common Questions About SEO in {city.cityName}
          </h2>
        </div>

        <div className="max-w-3xl mx-auto space-y-3">
          {city.faqs.map((faq, idx) => (
            <div 
              key={idx}
              className="rounded-2xl bg-slate-900/60 border border-slate-800 overflow-hidden transition-all"
            >
              <button 
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/40 transition-colors"
              >
                <span className="font-semibold text-sm text-white">{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-cyan-400 transition-transform ${openFaq === idx ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === idx && (
                <div className="px-4 sm:px-5 pb-5 text-xs text-slate-300 leading-relaxed border-t border-slate-800/60 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* City Switcher Banner */}
      <section className="p-6 rounded-2xl bg-slate-900/90 border border-slate-800 text-center space-y-3">
        <span className="text-xs text-slate-400">Looking for SEO Services in other cities across Pakistan?</span>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
          {Object.values(CITIES_DATA).map((c) => (
            <button
              key={c.slug}
              onClick={() => onSwitchCity(c.slug)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${c.slug === city.slug ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-950 text-slate-300 hover:text-white border border-slate-800'}`}
            >
              {c.cityName}
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
