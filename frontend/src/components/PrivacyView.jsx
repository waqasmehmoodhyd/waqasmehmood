import React from 'react';
import { Shield, Lock, Eye, Database, Globe, FileText, CheckCircle, ArrowLeft, Mail, Phone, ExternalLink } from 'lucide-react';

export default function PrivacyView({ goToTab }) {
  return (
    <main className="py-14 px-4 sm:px-6 max-w-5xl mx-auto space-y-12">
      {/* Header Banner */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950 border border-slate-800 p-8 sm:p-12 text-center sm:text-left">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-6">
          <Shield className="w-3.5 h-3.5" />
          <span>Official Privacy Policy • waqasmehmood.com</span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight mb-4">
          Privacy Policy &amp; Data Protection
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl leading-relaxed">
          Transparent details on how Waqas Mehmood respects your privacy. Learn about our 100% Zero-Telemetry guarantee for diagnostic SEO tools, client communications, and data protection practices.
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-4 text-xs font-mono text-slate-400">
          <span className="flex items-center gap-1.5 text-cyan-400">
            <CheckCircle className="w-4 h-4 text-cyan-400" /> 100% Zero-Telemetry Guarantee
          </span>
          <span className="text-slate-600">•</span>
          <span>Effective: November 2026</span>
          <span className="text-slate-600">•</span>
          <span>Data Controller: Waqas Mehmood</span>
        </div>
      </section>

      {/* Core Privacy Summary Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">Zero Tool Telemetry</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Our 32 in-house SEO tools, crawlers, and AI solvers parse pages live in memory. We never sell, log, or leak your target URLs or audit reports to third parties.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
            <Eye className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">No Tracking Cookies</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            We do not run invasive behavioral cross-site tracking or third-party ad retargeting pixels. Local storage is strictly used for UI preferences like Dark/Light theme.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-slate-900/50 border border-slate-800/80 hover:border-cyan-500/40 transition-all space-y-3">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
            <Database className="w-5 h-5" />
          </div>
          <h2 className="text-base font-bold text-white">GDPR &amp; CCPA Rights</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            You retain complete ownership over your data. Request instant removal or review of any submitted contact inquiry with a single email or WhatsApp message.
          </p>
        </div>
      </section>

      {/* Detailed Legal Content */}
      <article className="space-y-10 rounded-2xl bg-slate-900/30 border border-slate-800 p-8 sm:p-10 text-slate-300 text-sm leading-relaxed">
        
        {/* Section 1 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">01.</span>
            Identity &amp; Data Controller
          </h2>
          <p>
            This website (<a href="https://waqasmehmood.com" className="text-cyan-400 hover:underline">waqasmehmood.com</a>) and the official subdomain extension (<a href="https://ext.waqasmehmood.com" className="text-cyan-400 hover:underline" target="_blank" rel="noopener noreferrer">ext.waqasmehmood.com</a>) are owned and operated by <strong>Waqas Mehmood</strong>, Senior SEO Specialist &amp; Growth Engineer located in Auto Bhan Road, Hyderabad, Sindh, Pakistan.
          </p>
          <p>
            For any inquiries regarding data protection, privacy terms, or tool diagnostics, you can contact Waqas Mehmood directly at <a href="mailto:waqasmehmoodhyd@gmail.com" className="text-cyan-400 hover:underline font-mono">waqasmehmoodhyd@gmail.com</a>.
          </p>
        </section>

        {/* Section 2 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">02.</span>
            100% Zero-Telemetry Diagnostic Guarantee
          </h2>
          <p>
            Unlike many commercial SaaS tools that capture and sell audited URLs, our 32 native SEO tools (including Website SEO Checker, Keyword Density Analyzer, Schema Validator, Broken Link Checkers, and Free AI Website Crawler) operate with strict privacy standards:
          </p>
          <ul className="list-disc list-inside space-y-1.5 text-slate-400 pl-2">
            <li><strong>Live Memory Execution:</strong> Diagnosed pages and crawl results are processed ephemerally in real-time.</li>
            <li><strong>Zero Data Selling:</strong> We never distribute, syndicate, or broker your website audit data to marketing databases.</li>
            <li><strong>Client-Side Protection:</strong> Client-side tools and browser utilities execute directly within your browser without background surveillance.</li>
          </ul>
        </section>

        {/* Section 3 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">03.</span>
            Information We Collect &amp; How It Is Used
          </h2>
          <p>
            We only collect personal information that you voluntarily provide when contacting us for custom SEO proposals, technical consultations, or digital marketing retainers:
          </p>
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left text-xs border border-slate-800 rounded-lg overflow-hidden">
              <thead className="bg-slate-900 text-slate-200 uppercase font-mono">
                <tr>
                  <th className="p-3 border-b border-slate-800">Information Type</th>
                  <th className="p-3 border-b border-slate-800">Source</th>
                  <th className="p-3 border-b border-slate-800">Purpose</th>
                  <th className="p-3 border-b border-slate-800">Retention Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-slate-400">
                <tr>
                  <td className="p-3 font-medium text-white">Full Name</td>
                  <td className="p-3">Contact &amp; Hire Forms</td>
                  <td className="p-3">Direct personalized business correspondence</td>
                  <td className="p-3">Duration of business relation</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Email Address</td>
                  <td className="p-3">Contact &amp; Hire Forms</td>
                  <td className="p-3">Sending customized SEO proposals &amp; audit reports</td>
                  <td className="p-3">Duration of business relation</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Phone / WhatsApp Number</td>
                  <td className="p-3">Contact Form / WhatsApp button</td>
                  <td className="p-3">Real-time client project coordination</td>
                  <td className="p-3">Until deletion requested</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium text-white">Website URL &amp; Project Scope</td>
                  <td className="p-3">Inquiry Form</td>
                  <td className="p-3">Conducting customized technical SEO audit analysis</td>
                  <td className="p-3">Until proposal closed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Section 4 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">04.</span>
            Google Analytics 4 &amp; Usage Telemetry
          </h2>
          <p>
            We employ Google Analytics 4 (Measurement ID: <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono">G-GJ5ZJKLLT0</code>) strictly to monitor aggregated, non-personally identifiable traffic metrics such as page response times, geographic country breakdown, and viewport resolutions. IP anonymization is enabled by default. You can opt out of Google Analytics tracking across the web via Google's official browser opt-out add-on.
          </p>
        </section>

        {/* Section 5 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">05.</span>
            Cookies &amp; Local Browser Storage
          </h2>
          <p>
            This website does not use tracking or advertising cookies. We only use browser <code className="text-cyan-400 bg-slate-950 px-1.5 py-0.5 rounded text-xs font-mono">localStorage</code> for essential client-side user experience preferences:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><code className="text-slate-300 font-mono text-xs">wm_theme_preference</code>: Saves your preferred visual theme (Dark, Light, OLED, System).</li>
            <li><code className="text-slate-300 font-mono text-xs">wm_admin_active</code>: Session flag for verified owner login.</li>
          </ul>
        </section>

        {/* Section 6 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">06.</span>
            Detailed SEO &amp; AI Engine Chrome Extension
          </h2>
          <p>
            The official Chrome Extension (<a href="https://ext.waqasmehmood.com/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 hover:underline">Detailed SEO &amp; AI Engine</a>) distributed via the Chrome Web Store operates under a strict Zero-Data-Collection manifest:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li>Does NOT read or transmit personal browsing history.</li>
            <li>Analyzes DOM structures, schema tags, and heading hierarchy exclusively on the user's active tab when clicked.</li>
            <li>Has zero background analytics or third-party tracking scripts.</li>
          </ul>
        </section>

        {/* Section 7 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">07.</span>
            Your Rights (GDPR, CCPA &amp; Global Privacy)
          </h2>
          <p>
            Regardless of your country of residence, you maintain full control over your personal communication records:
          </p>
          <ul className="list-disc list-inside space-y-1 text-slate-400 pl-2">
            <li><strong>Right to Access:</strong> Request a full copy of any contact message or proposal data stored in our communication archives.</li>
            <li><strong>Right to Rectification:</strong> Request corrections to any outdated phone, email, or domain records.</li>
            <li><strong>Right to Erasure ("Right to Be Forgotten"):</strong> Request immediate permanent deletion of all your contact information and audit history.</li>
          </ul>
        </section>

        {/* Section 8 */}
        <section className="space-y-3">
          <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
            <span className="text-cyan-400 font-mono text-base">08.</span>
            Contact &amp; Data Protection Officer
          </h2>
          <p>
            If you have any questions, wish to exercise your data rights, or want to report a security vulnerability, please reach out directly:
          </p>
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs text-slate-300">
            <div><strong>Controller:</strong> Waqas Mehmood (SEO &amp; Growth Architect)</div>
            <div><strong>Location:</strong> Auto Bhan Road, Hyderabad, Sindh 71000, Pakistan</div>
            <div><strong>Direct Email:</strong> <a href="mailto:waqasmehmoodhyd@gmail.com" className="text-cyan-400 hover:underline">waqasmehmoodhyd@gmail.com</a></div>
            <div><strong>WhatsApp:</strong> <a href="https://wa.me/923033111126" target="_blank" rel="noopener noreferrer" className="text-emerald-400 hover:underline">+92 303 3111126</a></div>
          </div>
        </section>
      </article>

      {/* Action Footer Navigation */}
      <section className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-slate-800/80">
        <button
          onClick={() => goToTab('home')}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-slate-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-cyan-400" />
          <span>Back to Home</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => goToTab('all-tools')}
            className="px-4 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-all cursor-pointer"
          >
            Explore 32 Free SEO Tools
          </button>
          <button
            onClick={() => goToTab('contact')}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold transition-all shadow-lg shadow-cyan-500/20 cursor-pointer"
          >
            Contact Waqas
          </button>
        </div>
      </section>
    </main>
  );
}
