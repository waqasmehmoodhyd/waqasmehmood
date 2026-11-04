import React, { useState, useMemo } from 'react';
import { 
  Calculator, DollarSign, TrendingUp, Target, BarChart3, ArrowRight, 
  ShieldCheck, Copy, Check, Download, Info, Sparkles, RefreshCw, 
  Zap, PieChart, Layers, HelpCircle, ExternalLink, Award
} from 'lucide-react';

export default function MarketingRoiCalculator({ onHireClick, initialTab = 'roas' }) {
  const [activeTab, setActiveTab] = useState(initialTab); // 'roas' | 'seo-roi'
  const [copied, setCopied] = useState(false);

  // -------------------------------------------------------------
  // TAB 1: GOOGLE ADS ROAS & BREAKEVEN CALCULATOR STATE
  // -------------------------------------------------------------
  const [adSpend, setAdSpend] = useState(3000);
  const [cpc, setCpc] = useState(1.80);
  const [conversionRate, setConversionRate] = useState(3.5); // %
  const [aov, setAov] = useState(120); // Average Order / Deal Value ($)
  const [grossMargin, setGrossMargin] = useState(65); // % profit margin

  // -------------------------------------------------------------
  // TAB 2: SEO ROI & ORGANIC REVENUE CALCULATOR STATE
  // -------------------------------------------------------------
  const [currentTraffic, setCurrentTraffic] = useState(5000);
  const [targetGrowth, setTargetGrowth] = useState(150); // % growth
  const [seoConversionRate, setSeoConversionRate] = useState(2.2); // %
  const [customerLtv, setCustomerLtv] = useState(450); // $
  const [monthlySeoCost, setMonthlySeoCost] = useState(800); // $
  const [timeHorizon, setTimeHorizon] = useState(12); // months (6 or 12)

  // =============================================================
  // ROAS & PPC CALCULATIONS
  // =============================================================
  const roasMetrics = useMemo(() => {
    const validSpend = Math.max(1, Number(adSpend) || 0);
    const validCpc = Math.max(0.01, Number(cpc) || 0.01);
    const validCr = Math.max(0.01, Number(conversionRate) || 0) / 100;
    const validAov = Math.max(1, Number(aov) || 0);
    const validMargin = Math.min(100, Math.max(1, Number(grossMargin) || 1)) / 100;

    const clicks = Math.round(validSpend / validCpc);
    const conversions = Math.round(clicks * validCr);
    const grossRevenue = conversions * validAov;
    const roas = validSpend > 0 ? (grossRevenue / validSpend) : 0;
    const grossProfitBeforeAds = grossRevenue * validMargin;
    const netProfit = grossProfitBeforeAds - validSpend;
    const breakevenRoas = validMargin > 0 ? (1 / validMargin) : 1;
    const breakevenCpa = validAov * validMargin;
    const actualCpa = conversions > 0 ? (validSpend / conversions) : validSpend;
    const profitMarginOnAdSpend = validSpend > 0 ? ((netProfit / validSpend) * 100) : 0;

    return {
      clicks,
      conversions,
      grossRevenue,
      roas: Number(roas.toFixed(2)),
      grossProfitBeforeAds,
      netProfit: Math.round(netProfit),
      breakevenRoas: Number(breakevenRoas.toFixed(2)),
      breakevenCpa: Number(breakevenCpa.toFixed(2)),
      actualCpa: Number(actualCpa.toFixed(2)),
      profitMarginOnAdSpend: Math.round(profitMarginOnAdSpend),
      isProfitable: netProfit > 0,
      isBreakeven: roas >= breakevenRoas
    };
  }, [adSpend, cpc, conversionRate, aov, grossMargin]);

  // =============================================================
  // SEO ROI & REVENUE CALCULATIONS
  // =============================================================
  const seoMetrics = useMemo(() => {
    const current = Math.max(100, Number(currentTraffic) || 0);
    const growthPercent = Math.max(10, Number(targetGrowth) || 0) / 100;
    const cr = Math.max(0.1, Number(seoConversionRate) || 0) / 100;
    const ltv = Math.max(10, Number(customerLtv) || 0);
    const monthlyCost = Math.max(100, Number(monthlySeoCost) || 0);
    const months = Number(timeHorizon) || 12;

    const projectedTraffic = Math.round(current * (1 + growthPercent));
    const trafficGained = projectedTraffic - current;
    const totalAdditionalConversionsPerMonth = Math.round(trafficGained * cr);
    const additionalMonthlyRevenue = totalAdditionalConversionsPerMonth * ltv;
    
    // Cumulative calculation over timeframe (compounding ramp)
    // Month 1 to N ramp: average 60% of peak over the period
    const totalNewRevenueOverPeriod = Math.round(additionalMonthlyRevenue * months * 0.65);
    const totalInvestment = monthlyCost * months;
    const netProfit = totalNewRevenueOverPeriod - totalInvestment;
    const roiPercentage = totalInvestment > 0 ? Math.round((netProfit / totalInvestment) * 100) : 0;
    
    // Equivalent Google Ads PPC value (if you paid $1.50/click for gained traffic)
    const ppcValueEquivalent = Math.round(trafficGained * 1.50 * months * 0.65);
    const paybackMonths = additionalMonthlyRevenue > 0 ? (totalInvestment / additionalMonthlyRevenue).toFixed(1) : 'N/A';

    return {
      projectedTraffic,
      trafficGained,
      additionalConversionsPerMonth: totalAdditionalConversionsPerMonth,
      additionalMonthlyRevenue,
      totalNewRevenueOverPeriod,
      totalInvestment,
      netProfit,
      roiPercentage,
      ppcValueEquivalent,
      paybackMonths
    };
  }, [currentTraffic, targetGrowth, seoConversionRate, customerLtv, monthlySeoCost, timeHorizon]);

  // Copy Summary Handler
  const handleCopySummary = () => {
    let summary = '';
    if (activeTab === 'roas') {
      summary = `--- WAQAS MEHMOOD GOOGLE ADS ROAS AUDIT ---
Monthly Ad Spend: $${adSpend.toLocaleString()}
Average CPC: $${cpc}
Target Conversion Rate: ${conversionRate}%
Average Order Value: $${aov}
Gross Margin: ${grossMargin}%
-------------------------------------------
Projected ROAS: ${roasMetrics.roas}x
Projected Conversions: ${roasMetrics.conversions} orders/mo
Projected Gross Revenue: $${roasMetrics.grossRevenue.toLocaleString()}
Projected Net Profit: $${roasMetrics.netProfit.toLocaleString()}
Breakeven ROAS: ${roasMetrics.breakevenRoas}x
Breakeven CPA: $${roasMetrics.breakevenCpa}
Generated via waqasmehmood.com Free Marketing ROI Calculator`;
    } else {
      summary = `--- WAQAS MEHMOOD SEO ROI FORECAST ---
Current Organic Visitors: ${currentTraffic.toLocaleString()}/mo
Projected Traffic (${targetGrowth}% Growth): ${seoMetrics.projectedTraffic.toLocaleString()}/mo
Conversion Rate: ${seoConversionRate}%
Customer LTV / Deal Size: $${customerLtv}
Timeframe: ${timeHorizon} Months
-------------------------------------------
Additional Monthly Revenue: $${seoMetrics.additionalMonthlyRevenue.toLocaleString()}/mo
Total Forecast Revenue: $${seoMetrics.totalNewRevenueOverPeriod.toLocaleString()}
Total SEO Investment: $${seoMetrics.totalInvestment.toLocaleString()}
Net SEO ROI: ${seoMetrics.roiPercentage}%
PPC Equivalent Ad Spend Saved: $${seoMetrics.ppcValueEquivalent.toLocaleString()}
Generated via waqasmehmood.com Free Marketing ROI Calculator`;
    }

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* Tool Header & Tab Switcher */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl backdrop-blur-xl space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-mono font-bold uppercase mb-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Executive Financial Modeling Suite</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Marketing & Revenue ROI Calculator
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mt-1">
              Estimate real-time Return on Ad Spend (ROAS), breakeven CPA, and compounding organic traffic revenue before investing a single dollar.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all cursor-pointer"
              title="Copy formatted summary to clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-cyan-400" />}
              <span>{copied ? 'Copied!' : 'Copy Summary'}</span>
            </button>
          </div>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-2 gap-3 max-w-xl">
          <button
            onClick={() => setActiveTab('roas')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === 'roas'
                ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/20 font-black'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Google Ads ROAS & Breakeven</span>
          </button>

          <button
            onClick={() => setActiveTab('seo-roi')}
            className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 transition-all cursor-pointer border ${
              activeTab === 'seo-roi'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 border-cyan-400 shadow-lg shadow-cyan-500/20 font-black'
                : 'bg-slate-950/80 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>SEO ROI & Revenue Forecast</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: GOOGLE ADS ROAS CALCULATOR                        */}
      {/* ======================================================== */}
      {activeTab === 'roas' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls & Inputs (Left 7 Columns) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <Target className="w-5 h-5 text-amber-400" />
                <span>PPC Campaign Parameters</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Real-time dynamic</span>
            </div>

            {/* Input 1: Monthly Ad Spend */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Monthly Ad Budget ($)</span>
                <span className="font-mono text-cyan-400">${Number(adSpend).toLocaleString()}</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="250"
                value={adSpend}
                onChange={(e) => setAdSpend(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">$</span>
                <input
                  type="number"
                  min="100"
                  value={adSpend}
                  onChange={(e) => setAdSpend(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Input 2: Cost Per Click (CPC) */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Estimated Cost Per Click (CPC)</span>
                <span className="font-mono text-cyan-400">${cpc.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.20"
                max="15.00"
                step="0.10"
                value={cpc}
                onChange={(e) => setCpc(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500">$</span>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  value={cpc}
                  onChange={(e) => setCpc(Math.max(0.01, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Input 3: Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Conversion Rate (%)</span>
                  <span className="font-mono text-cyan-400">{conversionRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={conversionRate}
                  onChange={(e) => setConversionRate(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Input 4: Average Order Value */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Avg Order / Deal Value ($)</span>
                  <span className="font-mono text-cyan-400">${aov}</span>
                </div>
                <input
                  type="number"
                  min="5"
                  value={aov}
                  onChange={(e) => setAov(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Input 5: Gross Margin */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Product / Service Gross Margin (%)</span>
                <span className="font-mono text-amber-400">{grossMargin}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="95"
                step="5"
                value={grossMargin}
                onChange={(e) => setGrossMargin(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[11px] text-slate-500">
                Gross margin is critical to calculate your exact breakeven point so you never scale unprofitable ads.
              </p>
            </div>
          </div>

          {/* Real-Time Live Results Cards (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary ROAS Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl relative overflow-hidden space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Target ROAS Ratio
                </span>
                <span className={`px-2.5 py-1 rounded-full text-xs font-bold font-mono ${
                  roasMetrics.isProfitable 
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' 
                    : 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                }`}>
                  {roasMetrics.isProfitable ? 'Profitable' : 'Below Breakeven'}
                </span>
              </div>

              <div className="flex items-baseline gap-3">
                <span className="text-5xl sm:text-6xl font-black tracking-tight text-white font-mono">
                  {roasMetrics.roas}x
                </span>
                <span className="text-xs text-slate-400 leading-tight">
                  For every $1 spent, <br />you generate <strong>${roasMetrics.roas}</strong>
                </span>
              </div>

              {/* Progress bar vs Breakeven */}
              <div className="space-y-2 pt-2">
                <div className="flex justify-between text-xs font-mono">
                  <span className="text-slate-400">Breakeven Threshold:</span>
                  <span className="text-amber-400 font-bold">{roasMetrics.breakevenRoas}x</span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-950 border border-slate-800 overflow-hidden flex">
                  <div 
                    style={{ width: `${Math.min(100, (roasMetrics.roas / (roasMetrics.breakevenRoas * 2)) * 100)}%` }}
                    className={`h-full transition-all duration-500 ${
                      roasMetrics.roas >= roasMetrics.breakevenRoas 
                        ? 'bg-gradient-to-r from-emerald-500 to-cyan-400' 
                        : 'bg-gradient-to-r from-rose-500 to-amber-500'
                    }`}
                  />
                </div>
              </div>

              {/* Detailed Breakdown Grid */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-800 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Gross Revenue</span>
                  <span className="text-base font-black text-cyan-300 font-mono mt-0.5 block">
                    ${roasMetrics.grossRevenue.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Net Profit</span>
                  <span className={`text-base font-black font-mono mt-0.5 block ${roasMetrics.netProfit >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {roasMetrics.netProfit >= 0 ? `+$${roasMetrics.netProfit.toLocaleString()}` : `-$${Math.abs(roasMetrics.netProfit).toLocaleString()}`}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Target Clicks</span>
                  <span className="text-sm font-bold text-slate-200 font-mono mt-0.5 block">
                    {roasMetrics.clicks.toLocaleString()}
                  </span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Max Breakeven CPA</span>
                  <span className="text-sm font-bold text-amber-300 font-mono mt-0.5 block">
                    ${roasMetrics.breakevenCpa}
                  </span>
                </div>
              </div>

              {/* Action Conversion Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => onHireClick && onHireClick('High-ROAS Google Ads (PPC)')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Scale to {Math.max(4, roasMetrics.roas)}x ROAS with Waqas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Strategic Engineering Note */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Info className="w-4 h-4" />
                <span>Waqas's PPC Scaling Rule</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                To scale past $5K/mo profitably, structure negative keyword trees first. Eliminating 20% wasted clicks drops your effective CPA by 18% without increasing ad budget.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: SEO ROI & ORGANIC REVENUE CALCULATOR              */}
      {/* ======================================================== */}
      {activeTab === 'seo-roi' && (
        <div className="grid lg:grid-cols-12 gap-8 items-start">
          
          {/* Controls & Inputs (Left 7 Columns) */}
          <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                <span>Organic Search Growth Inputs</span>
              </h2>
              <span className="text-[11px] font-mono text-slate-400">Compounding growth model</span>
            </div>

            {/* Input 1: Current Traffic */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Current Monthly Organic Visitors</span>
                <span className="font-mono text-cyan-400">{currentTraffic.toLocaleString()} visitors/mo</span>
              </div>
              <input
                type="range"
                min="500"
                max="50000"
                step="500"
                value={currentTraffic}
                onChange={(e) => setCurrentTraffic(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
              <input
                type="number"
                min="100"
                value={currentTraffic}
                onChange={(e) => setCurrentTraffic(Math.max(10, Number(e.target.value)))}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
              />
            </div>

            {/* Input 2: Target Growth Rate */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-slate-300">Target Organic Traffic Growth (%)</span>
                <span className="font-mono text-cyan-400">+{targetGrowth}%</span>
              </div>
              <input
                type="range"
                min="25"
                max="400"
                step="25"
                value={targetGrowth}
                onChange={(e) => setTargetGrowth(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Input 3: Conversion Rate */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Organic Conversion Rate (%)</span>
                  <span className="font-mono text-cyan-400">{seoConversionRate}%</span>
                </div>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  value={seoConversionRate}
                  onChange={(e) => setSeoConversionRate(Math.max(0.1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Input 4: Customer Lifetime Value (LTV) */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Customer LTV / Deal Size ($)</span>
                  <span className="font-mono text-cyan-400">${customerLtv}</span>
                </div>
                <input
                  type="number"
                  min="20"
                  value={customerLtv}
                  onChange={(e) => setCustomerLtv(Math.max(1, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4 pt-2">
              {/* Input 5: Monthly SEO Retainer */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Monthly SEO Investment ($)</span>
                  <span className="font-mono text-cyan-400">${monthlySeoCost}</span>
                </div>
                <input
                  type="number"
                  min="200"
                  step="100"
                  value={monthlySeoCost}
                  onChange={(e) => setMonthlySeoCost(Math.max(50, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs font-mono text-white focus:outline-none focus:border-cyan-400"
                />
              </div>

              {/* Input 6: Time Horizon */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-300">Planning Horizon</span>
                  <span className="font-mono text-cyan-400">{timeHorizon} Months</span>
                </div>
                <div className="flex gap-2">
                  {[6, 12, 24].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTimeHorizon(m)}
                      className={`flex-1 py-2 rounded-xl text-xs font-semibold border cursor-pointer transition-all ${
                        timeHorizon === m
                          ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400'
                          : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                      }`}
                    >
                      {m} Mo
                    </button>
                  ))}
                </div>
              </div>
            </div>

          </div>

          {/* Real-Time Live Results Cards (Right 5 Columns) */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Primary SEO ROI Forecast Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 shadow-2xl space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-400">
                  Forecasted Net SEO ROI
                </span>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  +{seoMetrics.roiPercentage}% ROI
                </span>
              </div>

              <div className="flex items-baseline gap-2">
                <span className="text-4xl sm:text-5xl font-black tracking-tight text-white font-mono">
                  ${seoMetrics.totalNewRevenueOverPeriod.toLocaleString()}
                </span>
                <span className="text-xs text-slate-400">
                  Gross new revenue over {timeHorizon} months
                </span>
              </div>

              {/* Metric Highlights Grid */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-800 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Peak Monthly Traffic</span>
                  <span className="text-base font-black text-cyan-300 font-mono mt-0.5 block">
                    {seoMetrics.projectedTraffic.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-emerald-400">+{seoMetrics.trafficGained.toLocaleString()} gained</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Additional Leads / Mo</span>
                  <span className="text-base font-black text-amber-300 font-mono mt-0.5 block">
                    +{seoMetrics.additionalConversionsPerMonth} orders
                  </span>
                  <span className="text-[10px] text-slate-400">${seoMetrics.additionalMonthlyRevenue.toLocaleString()}/mo</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">PPC Ad Value Saved</span>
                  <span className="text-sm font-bold text-indigo-300 font-mono mt-0.5 block">
                    ${seoMetrics.ppcValueEquivalent.toLocaleString()}
                  </span>
                  <span className="text-[10px] text-slate-500">Free equivalent clicks</span>
                </div>
                <div className="p-3.5 rounded-2xl bg-slate-950/70 border border-slate-800/80">
                  <span className="text-[11px] text-slate-400 block">Est. Payback Period</span>
                  <span className="text-sm font-bold text-emerald-300 font-mono mt-0.5 block">
                    {seoMetrics.paybackMonths} Months
                  </span>
                  <span className="text-[10px] text-slate-500">Break-even speed</span>
                </div>
              </div>

              {/* Action Conversion Trigger */}
              <div className="pt-2">
                <button
                  onClick={() => onHireClick && onHireClick('Best SEO Services & Management')}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Build This SEO Growth Plan with Waqas</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
              </div>
            </div>

            {/* Strategic Organic Equity Note */}
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 text-xs space-y-2">
              <div className="flex items-center gap-2 text-cyan-400 font-bold">
                <Award className="w-4 h-4" />
                <span>Why Organic ROI Compounds</span>
              </div>
              <p className="text-slate-400 leading-relaxed text-[11px]">
                Unlike Google Ads where traffic stops the minute ad spend stops, technical SEO & content rankings become permanent assets that continue generating traffic month after month for zero marginal cost.
              </p>
            </div>

          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* FREQUENTLY ASKED QUESTIONS & BENCHMARKS                  */}
      {/* ======================================================== */}
      <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/60 border border-slate-800 space-y-6">
        <div className="flex items-center gap-2 text-white font-bold text-base">
          <HelpCircle className="w-5 h-5 text-amber-400" />
          <span>Marketing & Revenue ROI Frequently Asked Questions</span>
        </div>

        <div className="grid md:grid-cols-2 gap-6 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">How is ROAS calculated?</h3>
            <p className="text-slate-400">
              ROAS (Return on Ad Spend) is calculated as: <code>Gross Revenue / Total Ad Spend</code>. For example, generating $12,000 revenue from $3,000 ad spend equals a 4.0x ROAS (or 400%).
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">What is Breakeven CPA?</h3>
            <p className="text-slate-400">
              Breakeven CPA is the maximum amount you can pay to acquire one customer without losing money: <code>Average Order Value × Gross Profit Margin</code>. Any CPA below this number generates net profit.
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">What is a good benchmark ROAS?</h3>
            <p className="text-slate-400">
              A 3x to 4x ROAS is typically strong for eCommerce brands with 50-70% profit margins. High-ticket B2B and service businesses can be massively profitable even at 2x ROAS due to high customer lifetime values (LTV).
            </p>
          </div>

          <div className="space-y-1.5 p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
            <h3 className="font-bold text-white text-sm">How does SEO ROI compare to Google Ads?</h3>
            <p className="text-slate-400">
              Google Ads delivers immediate fast cash flow within 24-48 hours. SEO takes 3-6 months to gain momentum, but achieves a 5x to 10x higher long-term ROI because organic search clicks carry zero cost-per-click.
            </p>
          </div>
        </div>
      </div>

    </div>
  );
}
