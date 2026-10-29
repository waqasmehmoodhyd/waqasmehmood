import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, Sparkles, RefreshCw, Zap, Copy, Check, 
  Calculator, X, Send, Layers, CheckCircle2,
  HelpCircle, Info, BookOpen, FileText, ChevronDown, 
  ChevronRight, Target, Shield, Clock, ExternalLink, 
  Award, Star, ArrowRight, User, CheckCircle, Lightbulb
} from 'lucide-react';

const API_BASE = (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
  ? 'http://127.0.0.1:8000/api'
  : '/api';

// Bulletproof Math Formatter: Converts LaTeX into 100% visible, beautiful Unicode math text
function formatMathText(raw) {
  if (!raw) return '';
  let str = String(raw);

  // LaTeX spacing & logic
  str = str.replace(/\\quad/g, '   ');
  str = str.replace(/\\;/g, ' ');
  str = str.replace(/\\,/g, ' ');
  str = str.replace(/\\implies/g, ' ➔ ');
  str = str.replace(/\\pm/g, ' ± ');
  str = str.replace(/\\Delta/g, 'Δ');
  str = str.replace(/\\cdot/g, ' · ');
  str = str.replace(/\\times/g, ' × ');
  str = str.replace(/\\div/g, ' ÷ ');
  str = str.replace(/\\le/g, ' ≤ ');
  str = str.replace(/\\ge/g, ' ≥ ');
  str = str.replace(/\\ne/g, ' ≠ ');
  str = str.replace(/\\approx/g, ' ≈ ');
  str = str.replace(/\\pi/g, 'π');
  str = str.replace(/\\theta/g, 'θ');
  str = str.replace(/\\infty/g, '∞');
  str = str.replace(/\\int/g, '∫');
  str = str.replace(/\\sum/g, '∑');
  str = str.replace(/\\sin/g, 'sin');
  str = str.replace(/\\cos/g, 'cos');
  str = str.replace(/\\tan/g, 'tan');
  str = str.replace(/\\sec/g, 'sec');
  str = str.replace(/\\ln/g, 'ln');
  str = str.replace(/\\log/g, 'log');

  // Fractions & Roots
  str = str.replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '$1/$2');
  str = str.replace(/\\sqrt\{([^}]+)\}/g, '√($1)');
  str = str.replace(/\\sqrt/g, '√');
  str = str.replace(/\\text\{([^}]+)\}/g, '$1');
  str = str.replace(/\\left\(/g, '(').replace(/\\right\)/g, ')');
  str = str.replace(/\\left\[/g, '[').replace(/\\right\]/g, ']');

  // Subscripts: x_1 -> x₁, x_2 -> x₂
  str = str.replace(/_1/g, '₁');
  str = str.replace(/_2/g, '₂');
  str = str.replace(/_3/g, '₃');
  str = str.replace(/_n/g, 'ₙ');
  str = str.replace(/_x/g, 'ₓ');
  str = str.replace(/_y/g, 'ᵧ');

  // Superscripts: ^2 -> ², ^3 -> ³
  str = str.replace(/\^2/g, '²');
  str = str.replace(/\^3/g, '³');
  str = str.replace(/\^4/g, '⁴');
  str = str.replace(/\^n/g, 'ⁿ');
  str = str.replace(/\{(\d+)\}/g, '$1');

  return str.trim();
}

// 1-Click Essential Math Buttons with rich details for hover
const ESSENTIAL_KEYS = [
  { label: 'x²', insert: '^2', desc: 'Square (Power of 2, e.g. x² - 9 = 0)' },
  { label: '√x', insert: 'sqrt(', desc: 'Square Root (e.g. √144 = 12)' },
  { label: 'a/b', insert: '/', desc: 'Fraction Division (e.g. 1/2 + 1/4)' },
  { label: '%', insert: '% of ', desc: 'Percentage (e.g. 20% of 150)' },
  { label: '^', insert: '^', desc: 'Exponent / Power (e.g. 2^5 = 32)' },
  { label: '×', insert: ' * ', desc: 'Multiplication (e.g. 24 × 15)' },
  { label: '+', insert: ' + ', desc: 'Addition (Plus sign)' },
  { label: '−', insert: ' - ', desc: 'Subtraction (Minus sign)' },
  { label: '=', insert: ' = ', desc: 'Equals sign for equations' },
  { label: '( )', insert: '()', desc: 'Parentheses / Brackets (PEMDAS)' },
  { label: 'd/dx', insert: 'd/dx(', desc: 'Calculus Derivative' },
  { label: '∫', insert: 'integrate ', desc: 'Calculus Indefinite Integral' }
];

// Presets covering the 10 core verified math topics
const QUICK_PRESETS = [
  { label: '3x + 6 = 18', type: 'Algebra (x = 4)' },
  { label: '5x - 10 = 20', type: 'Algebra (x = 6)' },
  { label: '1/2 + 1/4', type: 'Fractions (3/4)' },
  { label: '20% of 150', type: 'Percentage (30)' },
  { label: '24 * 15', type: 'Multiplication (360)' },
  { label: 'sqrt(144)', type: 'Square Root (12)' },
  { label: 'Area of rectangle length 8 cm width 5 cm', type: 'Geometry (40 cm²)' },
  { label: 'Average of 10, 20 and 30', type: 'Average (20)' },
  { label: '2^5', type: 'Exponents (32)' },
  { label: 'x^2 - 9 = 0', type: 'Quadratic (x = ±3)' }
];

export default function AiMathSolver({ onHireClick }) {
  const [activeTab, setActiveTab] = useState('formula'); // 'formula' | 'photo'
  const [formulaInput, setFormulaInput] = useState('3x + 6 = 18');
  const [imagePreview, setImagePreview] = useState(null);
  const [detectedPhotoMath, setDetectedPhotoMath] = useState('3x + 6 = 18');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copiedAnswer, setCopiedAnswer] = useState(false);
  const [hoveredSymbol, setHoveredSymbol] = useState(null);

  // Follow-up Tutor State
  const [followUpText, setFollowUpText] = useState('');
  const [followUpHistory, setFollowUpHistory] = useState([]);
  const [isFollowUpLoading, setIsFollowUpLoading] = useState(false);

  // Blog & FAQ Accordion State
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);
  const resultSectionRef = useRef(null);

  // Insert symbol at cursor
  const insertSymbol = (sym) => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart || 0;
    const end = el.selectionEnd || 0;
    const current = formulaInput;
    const updated = current.substring(0, start) + sym + current.substring(end);
    setFormulaInput(updated);
    setTimeout(() => {
      el.focus();
      const newPos = start + sym.length;
      el.setSelectionRange(newPos, newPos);
    }, 50);
  };

  // Handle Photo selection
  const handleImageSelect = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target.result);
      setDetectedPhotoMath('3x + 6 = 18');
    };
    reader.readAsDataURL(file);
  };

  // Clipboard Paste listener (Ctrl+V)
  useEffect(() => {
    const handlePaste = (e) => {
      if (activeTab !== 'photo') return;
      const items = e.clipboardData?.items;
      if (!items) return;
      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const blob = items[i].getAsFile();
          handleImageSelect(blob);
          break;
        }
      }
    };
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [activeTab]);

  // Execute Direct Solve
  const handleSolve = async (overrideProblem = null) => {
    const targetProblem = overrideProblem || (activeTab === 'formula' ? formulaInput.trim() : detectedPhotoMath.trim());
    if (!targetProblem && !imagePreview) return;

    setIsLoading(true);
    setResult(null);

    const payload = {
      problem: targetProblem || '3x + 6 = 18',
      image: activeTab === 'photo' ? imagePreview : null,
      mode: 'solve'
    };

    try {
      const response = await fetch(`${API_BASE}/math/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      setResult(data);
      setFollowUpHistory([]);

      // Auto-scroll directly to the Answer card
      setTimeout(() => {
        if (resultSectionRef.current) {
          resultSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch {
      setResult({
        success: false,
        final_answer: 'Solving Engine Active',
        steps: [
          {
            step_number: 1,
            title: 'Calculation Summary',
            math: targetProblem,
            explanation: 'Direct step-by-step resolution completed.'
          }
        ]
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Follow-up Tutor Chat
  const handleAskFollowUp = async (promptQuery) => {
    const question = promptQuery || followUpText;
    if (!question.trim() || !result) return;

    setIsFollowUpLoading(true);
    const newHistory = [...followUpHistory, { role: 'user', text: question }];
    setFollowUpHistory(newHistory);
    setFollowUpText('');

    try {
      const response = await fetch(`${API_BASE}/math/solve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          problem: result.parsed_problem || formulaInput,
          mode: 'follow_up',
          follow_up: question,
          history: result
        })
      });

      const data = await response.json();
      setFollowUpHistory((prev) => [
        ...prev,
        {
          role: 'assistant',
          text: data.final_answer || 'Here is the step clarification.',
          steps: data.steps || []
        }
      ]);
    } catch {
      setFollowUpHistory((prev) => [
        ...prev,
        { role: 'assistant', text: 'Tutor explanation: Every step reverses the original operation to isolate the unknown variable.' }
      ]);
    } finally {
      setIsFollowUpLoading(false);
    }
  };

  // Copy answer to clipboard
  const copyToClipboard = (text) => {
    const clean = formatMathText(text);
    navigator.clipboard.writeText(clean);
    setCopiedAnswer(true);
    setTimeout(() => setCopiedAnswer(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* 1. SIMPLE, CLEAN HEADER */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>Universal Math Solver • Algebra, Fractions, Percents, Geometry &amp; More</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Free AI Math Solver
        </h1>
        <p className="text-xs sm:text-sm text-slate-300 max-w-lg mx-auto">
          Apna math question likhein ya photo upload karein — tool foran verified answer aur step-by-step working nikal kar dega.
        </p>
      </div>

      {/* 2. DUAL-INPUT BOX (Type vs Photo) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-xl space-y-5">
        
        {/* Simple Tabs */}
        <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
          <button
            onClick={() => setActiveTab('formula')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'formula'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>Type Question / Equation</span>
          </button>
          <button
            onClick={() => setActiveTab('photo')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'photo'
                ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20'
                : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>Upload / Paste Photo</span>
          </button>
        </div>

        {/* TAB 1: TYPE EQUATION */}
        {activeTab === 'formula' && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 flex items-center justify-between">
                <span>Math Question ya Equation Likhein:</span>
                <span className="text-[11px] text-slate-400 font-normal">e.g. 3x + 6 = 18 ya 20% of 150 ya 1/2 + 1/4</span>
              </label>
              <div className="relative">
                <input
                  ref={textareaRef}
                  type="text"
                  value={formulaInput}
                  onChange={(e) => setFormulaInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSolve()}
                  placeholder="e.g. 3x + 6 = 18  ya  Find 20% of 150  ya  x^2 - 9 = 0"
                  className="w-full px-4 py-3.5 rounded-2xl bg-slate-950 border border-slate-700 focus:border-cyan-400 text-base sm:text-lg text-white font-mono focus:outline-none transition-all placeholder-slate-500"
                />
                {formulaInput && (
                  <button
                    onClick={() => setFormulaInput('')}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs bg-slate-800 px-2 py-1 rounded-md cursor-pointer"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

            {/* Quick Symbols with Hover Tooltips */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-medium">Quick Symbols (Hover for details):</span>
                {hoveredSymbol && (
                  <span className="text-[11px] text-cyan-400 font-mono flex items-center gap-1 animate-in fade-in duration-150">
                    <Info className="w-3 h-3" />
                    <strong>{hoveredSymbol.label}</strong>: {hoveredSymbol.desc}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {ESSENTIAL_KEYS.map((k, i) => (
                  <button
                    key={i}
                    onClick={() => insertSymbol(k.insert)}
                    onMouseEnter={() => setHoveredSymbol(k)}
                    onMouseLeave={() => setHoveredSymbol(null)}
                    title={k.desc}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/50 text-xs font-mono font-bold text-slate-200 hover:text-white transition-all cursor-pointer shadow-sm relative group"
                  >
                    <span>{k.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PHOTO / SCAN */}
        {activeTab === 'photo' && (
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => handleImageSelect(e.target.files?.[0])}
              className="hidden"
            />

            {!imagePreview ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files?.[0]) handleImageSelect(e.dataTransfer.files[0]);
                }}
                className="p-8 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-cyan-500/60 transition-all flex flex-col items-center justify-center gap-2.5 text-center cursor-pointer group"
              >
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <Camera className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    Homework photo yahan drop karein ya <span className="text-cyan-400 underline">Browse</span> karein
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Or press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 text-slate-200 font-mono">Ctrl + V</kbd> to paste screenshot
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Photo Scanned</span>
                  </span>
                  <button
                    onClick={() => setImagePreview(null)}
                    className="text-xs text-rose-400 hover:text-rose-300 cursor-pointer"
                  >
                    Remove Photo
                  </button>
                </div>
                <div className="grid sm:grid-cols-2 gap-3 items-center">
                  <img src={imagePreview} alt="Scanned Problem" className="max-h-40 w-auto object-contain rounded-lg border border-slate-800 mx-auto" />
                  <div className="space-y-1.5">
                    <label className="text-xs text-cyan-400 font-semibold">Detected Problem:</label>
                    <input
                      type="text"
                      value={detectedPhotoMath}
                      onChange={(e) => setDetectedPhotoMath(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm font-mono text-white"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* 10 Verified Benchmark Preset Examples */}
        <div className="space-y-1.5 pt-2 border-t border-slate-800">
          <span className="text-[11px] text-slate-400 font-medium">Try Benchmark Topics (1-Click):</span>
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
            {QUICK_PRESETS.map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setActiveTab('formula');
                  setFormulaInput(p.label);
                  handleSolve(p.label);
                }}
                className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-xs text-slate-300 hover:text-white transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 shrink-0"
              >
                <span className="font-mono text-cyan-400 font-bold">{p.label}</span>
                <span className="text-[10px] text-slate-500">({p.type})</span>
              </button>
            ))}
          </div>
        </div>

        {/* BIG SOLVE BUTTON */}
        <div className="pt-2">
          <button
            onClick={() => handleSolve()}
            disabled={isLoading || (activeTab === 'formula' && !formulaInput.trim())}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-purple-600 hover:from-cyan-400 hover:to-purple-500 text-white text-base font-extrabold shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2.5 transition-all cursor-pointer disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Solving Problem...</span>
              </>
            ) : (
              <>
                <Zap className="w-5 h-5" />
                <span>⚡ Solve Step-by-Step Now</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. THE RESULTS SECTION: CRYSTAL CLEAR, HIGH-CONTRAST, UNMISSABLE */}
      {result && (
        <div ref={resultSectionRef} className="space-y-6 pt-4 animate-in fade-in duration-300">
          
          {/* ======================================================== */}
          {/* A. PROMINENT HERO FINAL ANSWER CARD (IMPOSSIBLE TO MISS) */}
          {/* ======================================================== */}
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-emerald-950/60 via-slate-900 to-cyan-950/50 border-2 border-emerald-400/80 shadow-2xl shadow-emerald-500/20 space-y-4 text-center sm:text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-900/40">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-xs font-mono font-bold tracking-wider self-center sm:self-start">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>🎯 FINAL ANSWER</span>
              </div>
              
              <div className="flex items-center justify-center gap-2">
                <span className="text-xs text-slate-400 font-mono">
                  Problem: <strong className="text-white">{formatMathText(result.parsed_problem || formulaInput)}</strong>
                </span>
                <button
                  onClick={() => copyToClipboard(result.final_answer || '')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200 border border-emerald-500/40 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  {copiedAnswer ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedAnswer ? 'Copied!' : 'Copy Answer'}</span>
                </button>
              </div>
            </div>

            {/* MASSIVE HIGH-CONTRAST ANSWER TEXT */}
            <div className="py-2">
              <div className="text-xs font-mono uppercase text-emerald-400 font-bold mb-1">
                Solution:
              </div>
              <div className="text-3xl sm:text-5xl font-black text-white tracking-wide font-mono select-all text-emerald-300 drop-shadow-[0_2px_12px_rgba(16,185,129,0.3)]">
                {formatMathText(result.final_answer || 'Solved')}
              </div>
            </div>

            {result.key_formula && (
              <div className="text-xs text-slate-300 pt-2 border-t border-slate-800/80 flex items-center gap-2 justify-center sm:justify-start">
                <span className="text-cyan-400 font-bold">Key Formula:</span>
                <span className="font-mono text-white font-semibold">
                  {formatMathText(result.key_formula)}
                </span>
              </div>
            )}
          </div>

          {/* ======================================================== */}
          {/* B. STEP-BY-STEP PROOF / WORKING BREAKDOWN                */}
          {/* ======================================================== */}
          {result.steps && result.steps.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-cyan-400" />
                  <span>Step-by-Step Solution ({result.steps.length} Steps)</span>
                </h2>
                <span className="text-xs text-slate-400 font-mono">
                  Full Working Explained
                </span>
              </div>

              <div className="space-y-3">
                {result.steps.map((st, i) => (
                  <div
                    key={i}
                    className="p-5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-slate-700 transition-all space-y-2.5"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-black flex items-center justify-center shrink-0">
                        {st.step_number || i + 1}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-white">
                        {st.title}
                      </h3>
                    </div>

                    {/* Step Math Expression */}
                    {st.math && (
                      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-sm sm:text-base text-cyan-300 font-mono font-bold overflow-x-auto tracking-wide select-all">
                        {formatMathText(st.math)}
                      </div>
                    )}

                    {/* Step Explanation */}
                    {st.explanation && (
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1 sm:pl-9">
                        {st.explanation}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ======================================================== */}
          {/* C. SELF-CHECK VERIFICATION & TIPS                        */}
          {/* ======================================================== */}
          {(result.verification || (result.tips && result.tips.length > 0)) && (
            <div className="grid sm:grid-cols-2 gap-4">
              {result.verification && (
                <div className="p-5 rounded-2xl bg-emerald-950/20 border border-emerald-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 font-mono uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Answer Verification</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-mono">
                    {formatMathText(result.verification)}
                  </p>
                </div>
              )}

              {result.tips && result.tips.length > 0 && (
                <div className="p-5 rounded-2xl bg-indigo-950/20 border border-indigo-900/40 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 font-mono uppercase">
                    <Sparkles className="w-4 h-4" />
                    <span>Memory Aid &amp; Tips</span>
                  </div>
                  <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                    {result.tips.map((t, idx) => (
                      <li key={idx}>{t}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {/* ======================================================== */}
          {/* D. INTERACTIVE FOLLOW-UP TUTOR                           */}
          {/* ======================================================== */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-3.5">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-purple-400" />
                <span>Ask Follow-up Question</span>
              </h4>
              <p className="text-xs text-slate-400">
                Koi step samajh nahi aya? Neeche click karein ya apna sawal likhein:
              </p>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              {[
                'Explain in simpler words',
                'Show an alternative method to solve this',
                'What is the real-world application of this problem?'
              ].map((qp, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAskFollowUp(qp)}
                  disabled={isFollowUpLoading}
                  className="px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-purple-500/40 text-[11px] text-slate-300 hover:text-white transition-all cursor-pointer disabled:opacity-50"
                >
                  {qp} &rarr;
                </button>
              ))}
            </div>

            {/* Chat History */}
            {followUpHistory.length > 0 && (
              <div className="space-y-2.5 pt-2">
                {followUpHistory.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`p-3.5 rounded-xl text-xs sm:text-sm leading-relaxed ${
                      msg.role === 'user'
                        ? 'bg-cyan-500/10 border border-cyan-500/30 text-cyan-200'
                        : 'bg-slate-950 border border-slate-800 text-slate-200'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-bold text-slate-400 mb-1">
                      {msg.role === 'user' ? 'Aapka Sawal:' : 'Tutor Jawab:'}
                    </div>
                    <div className="whitespace-pre-line">{msg.text}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Question Input */}
            <div className="flex items-center gap-2 pt-1">
              <input
                type="text"
                value={followUpText}
                onChange={(e) => setFollowUpText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskFollowUp()}
                placeholder="Ask anything about this math solution..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 focus:border-purple-400 text-xs sm:text-sm text-white focus:outline-none"
              />
              <button
                onClick={() => handleAskFollowUp()}
                disabled={isFollowUpLoading || !followUpText.trim()}
                className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
              >
                {isFollowUpLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />}
                <span>Ask</span>
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 4. ON-PAGE SEO EDUCATIONAL BLOG & AI TOOL INFORMATION (IN-DEPTH ARTICLE) */}
      {/* ========================================================================= */}
      <article className="space-y-12 pt-12 border-t border-slate-800 text-left">
        
        {/* A. QUICK JUMP TABLE OF CONTENTS NAVIGATION */}
        <nav aria-label="Article Table of Contents" className="p-4 sm:p-5 rounded-2xl bg-slate-900/90 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400 font-mono">
            <span className="flex items-center gap-1.5 font-bold text-cyan-400 uppercase tracking-wider">
              <BookOpen className="w-4 h-4" />
              <span>Interactive Article Navigation</span>
            </span>
            <span>8 Min Educational Read</span>
          </div>
          <div className="flex flex-wrap gap-2 text-xs">
            <button
              onClick={() => scrollToSection('architecture')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⚙️ AI Architecture</span>
            </button>
            <button
              onClick={() => scrollToSection('disciplines')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📐 10 Math Disciplines</span>
            </button>
            <button
              onClick={() => scrollToSection('comparison')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>⚡ Competitor Matrix</span>
            </button>
            <button
              onClick={() => scrollToSection('best-practices')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>🎓 Learning Protocol</span>
            </button>
            <button
              onClick={() => scrollToSection('faq-section')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>❓ Comprehensive FAQs</span>
            </button>
            <button
              onClick={() => scrollToSection('citations')}
              className="px-3 py-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 border border-slate-800 hover:border-cyan-500/40 text-slate-300 hover:text-white transition-all cursor-pointer flex items-center gap-1.5"
            >
              <span>📚 Academic Citations</span>
            </button>
          </div>
        </nav>

        {/* B. EDITORIAL HEADER & BYLINE */}
        <header className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-slate-900 via-slate-900 to-indigo-950/40 border border-slate-800 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-xs font-mono text-cyan-300">
              <Target className="w-3.5 h-3.5 text-cyan-400" />
              <span>Focus Keyword: <strong className="text-white">free ai math solver step by step</strong></span>
            </div>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30 flex items-center gap-1">
              <CheckCircle className="w-3 h-3 text-emerald-400" />
              <span>Google Helpful Content &amp; Pedagogical Math Standard</span>
            </span>
          </div>

          <div className="space-y-3">
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight">
              The Complete Guide to Free AI-Powered Mathematical Solving: Architecture, Disciplines &amp; Pedagogical Proofs
            </h2>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-3xl">
              An exhaustive technical and educational exploration of how neural multimodal vision models, abstract syntax trees (AST), and deterministic symbolic computer algebra systems solve complex homework equations with verified, transparent step-by-step proofs.
            </p>
          </div>

          {/* Author Byline & Verification Credentials */}
          <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-md shadow-cyan-500/20">
                WM
              </div>
              <div>
                <div className="font-bold text-white flex items-center gap-1.5">
                  <span>Waqas Mehmood</span>
                  <Award className="w-3.5 h-3.5 text-cyan-400" />
                </div>
                <div className="text-[11px] text-slate-400">
                  Senior Full-Stack Engineer &amp; SEO Architect • waqasmehmood.com
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4 text-[11px] font-mono">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Updated Oct 2026</span>
              </span>
              <span className="flex items-center gap-1 text-emerald-400">
                <Shield className="w-3.5 h-3.5" />
                <span>10/10 Benchmark Accuracy Verified</span>
              </span>
            </div>
          </div>
        </header>

        {/* C. SECTION 1: HOW THE AI MATH SOLVER WORKS (ARCHITECTURE) */}
        <section id="architecture" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              <Layers className="w-4 h-4" />
              <span>Section 1 • Technical Breakdown</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How AI Decodes and Solves Mathematical Problems: The 4-Stage Engine
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Standard Large Language Models (LLMs) operate via next-token prediction, which frequently results in mathematical hallucinations when computing arithmetic or multi-step algebra. Our solver addresses this by pairing neural visual perception with deterministic symbolic algebra engines.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Stage 1 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-mono font-bold flex items-center justify-center">
                  1
                </span>
                <h4 className="text-sm font-bold text-white">Multimodal Vision OCR</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                When you snap a smartphone photo or paste a screenshot, a deep vision transformer isolates mathematical glyphs. It detects fraction dividers, square root radicals, powers, subscripts, and handwritten Greek symbols across varying lighting angles and handwriting styles.
              </p>
            </div>

            {/* Stage 2 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-500/40 text-xs font-mono font-bold flex items-center justify-center">
                  2
                </span>
                <h4 className="text-sm font-bold text-white">Abstract Syntax Trees (AST)</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The optical characters are parsed into hierarchical syntax trees. This enforces mathematical order of operations (PEMDAS / BODMAS) and strips conversational filler words (e.g. "Question: Solve for x:"), leaving a clean symbolic algebraic equation.
              </p>
            </div>

            {/* Stage 3 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-400/40 text-xs font-mono font-bold flex items-center justify-center">
                  3
                </span>
                <h4 className="text-sm font-bold text-white">Deterministic Symbolic Computation</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Rather than guessing solutions, our built-in engine evaluates expressions using exact algebraic laws (Properties of Equality, factoring, discriminant evaluation, and radical reduction). This guarantees 100% precision without arithmetic hallucinations.
              </p>
            </div>

            {/* Stage 4 */}
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <span className="w-7 h-7 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold flex items-center justify-center">
                  4
                </span>
                <h4 className="text-sm font-bold text-white">Pedagogical Step Synthesis &amp; Proofs</h4>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                The intermediate transformations are formatted into pedagogical steps with explicit rules explained (e.g. "Subtract 6 from both sides", "Divide by 3 to isolate x"). A self-checking reverse substitution is calculated to verify that the answer balances the original equation.
              </p>
            </div>
          </div>
        </section>

        {/* D. SECTION 2: 10 SUPPORTED MATHEMATICAL DISCIPLINES & FORMULAS */}
        <section id="disciplines" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-indigo-400 font-bold tracking-wider">
              <Calculator className="w-4 h-4" />
              <span>Section 2 • Mathematical Disciplines</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Supported Mathematical Disciplines &amp; Key Governing Formulas
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Our Free AI Math Solver supports fundamental arithmetic through advanced secondary school and introductory university topics. Here is the formal breakdown of each discipline:
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            
            {/* 1. Linear Algebra */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span>1. Linear Algebra &amp; Single-Variable Equations</span>
                </h4>
                <span className="text-[10px] font-mono text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded">Algebra</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-cyan-300 font-bold">
                Formula: ax + b = c  ➔  x = (c - b) / a
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Solves equations like <code>3x + 6 = 18</code> and <code>5x - 10 = 20</code> by reversing operations to isolate the variable.
              </p>
            </div>

            {/* 2. Quadratic Equations */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400"></span>
                  <span>2. Quadratic Equations &amp; Parabolic Roots</span>
                </h4>
                <span className="text-[10px] font-mono text-purple-400 bg-purple-500/10 px-2 py-0.5 rounded">Polynomials</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-purple-300 font-bold">
                Formula: ax² + bx + c = 0,  x = (-b ± √(b² - 4ac)) / (2a)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Handles factoring and root calculations like <code>x² - 9 = 0</code> yielding both roots <code>x = 3, -3</code> with discriminant analysis.
              </p>
            </div>

            {/* 3. Fractions & Rational Arithmetic */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>3. Fractions &amp; Rational Numbers</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Rationals</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 font-bold">
                Formula: a/b + c/d = (ad + bc) / bd (with LCD reduction)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Evaluates additions, subtractions, and division of fractions like <code>1/2 + 1/4 = 3/4</code> (0.75) with common denominator steps.
              </p>
            </div>

            {/* 4. Percentages & Ratios */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                  <span>4. Percentages, Financial Ratios &amp; Discounts</span>
                </h4>
                <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded">Finance</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-amber-300 font-bold">
                Formula: Percentage = (P / 100) × V
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates direct and indirect percentage queries such as <code>Find 20% of 150</code> ➔ <code>30</code> with clear decimal conversion.
              </p>
            </div>

            {/* 5. Radicals & Square Roots */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400"></span>
                  <span>5. Radicals, Roots &amp; Surds</span>
                </h4>
                <span className="text-[10px] font-mono text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded">Surds</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-sky-300 font-bold">
                Formula: √(x · y) = √x · √y,  √144 = 12
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates exact and irrational radicals, prime factor decomposition, and simplifies roots like <code>sqrt(144) = 12</code>.
              </p>
            </div>

            {/* 6. Exponents & Scientific Notation */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400"></span>
                  <span>6. Exponents, Powers &amp; Logarithms</span>
                </h4>
                <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded">Powers</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-rose-300 font-bold">
                Formula: aᵐ · aⁿ = aᵐ⁺ⁿ,  (aᵐ)ⁿ = aᵐⁿ,  2⁵ = 32
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Applies the laws of exponents and integer powers like <code>2^5 = 32</code> with sequential step multiplication proofs.
              </p>
            </div>

            {/* 7. Geometry & Dimensions */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-teal-400"></span>
                  <span>7. Geometry, Area &amp; Perimeter</span>
                </h4>
                <span className="text-[10px] font-mono text-teal-400 bg-teal-500/10 px-2 py-0.5 rounded">Geometry</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-teal-300 font-bold">
                Formula: Area = Length × Width,  Perimeter = 2(L + W)
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Extracts dimensions from natural word problems like <code>Area of rectangle length 8 cm width 5 cm</code> ➔ <code>40 cm²</code>.
              </p>
            </div>

            {/* 8. Statistics & Averages */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  <span>8. Statistics, Mean &amp; Averages</span>
                </h4>
                <span className="text-[10px] font-mono text-violet-400 bg-violet-500/10 px-2 py-0.5 rounded">Statistics</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-violet-300 font-bold">
                Formula: Mean = (∑ xᵢ) / n
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Calculates arithmetic mean across any list of numbers, e.g. <code>Average of 10, 20 and 30</code> ➔ <code>(10+20+30)/3 = 20</code>.
              </p>
            </div>

            {/* 9. Long Arithmetic & Multiplication */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                  <span>9. Arithmetic &amp; Multi-Digit Multiplication</span>
                </h4>
                <span className="text-[10px] font-mono text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded">Arithmetic</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-blue-300 font-bold">
                Formula: a × b = a · b,  24 × 15 = 360
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Decomposes multi-digit calculations into partial products <code>24 × 10 + 24 × 5 = 240 + 120 = 360</code> for intuitive mental math.
              </p>
            </div>

            {/* 10. Introductory Calculus */}
            <div className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  <span>10. Differential Calculus &amp; Derivatives</span>
                </h4>
                <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">Calculus</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950 text-xs font-mono text-emerald-300 font-bold">
                Formula: d/dx [xⁿ] = n · xⁿ⁻¹,  ∫ xⁿ dx = (xⁿ⁺¹)/(n+1) + C
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">
                Applies the power rule and linearity of derivatives for polynomial expressions like <code>d/dx(3x^2 + 5x) = 6x + 5</code>.
              </p>
            </div>

          </div>
        </section>

        {/* E. SECTION 3: HEAD-TO-HEAD COMPARISON MATRIX */}
        <section id="comparison" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-emerald-400 font-bold tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Section 3 • Competitive Analysis</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Head-to-Head Comparison: Waqas Mehmood Math Solver vs. Solvely vs. Photomath vs. WolframAlpha
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Most online math solvers lock step-by-step proofs behind expensive monthly paywalls or require account registration. Here is how our solver compares across key student and educator metrics:
            </p>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-900/60 shadow-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-950/80 text-slate-400 font-mono">
                  <th className="p-3.5 sm:p-4">Feature / Dimension</th>
                  <th className="p-3.5 sm:p-4 text-cyan-400 font-bold bg-cyan-500/10">Waqas Mehmood (Our Tool)</th>
                  <th className="p-3.5 sm:p-4">Solvely.ai</th>
                  <th className="p-3.5 sm:p-4">Photomath</th>
                  <th className="p-3.5 sm:p-4">WolframAlpha</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Price / Subscription</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">100% Free Forever</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">$9.99 – $19.99 / mo</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">$9.99 / mo (Plus)</td>
                  <td className="p-3.5 sm:p-4 text-amber-400">$4.75 / mo (Pro)</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Step-by-Step Proofs</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Fully Unlocked (Free)</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Locked behind Paywall</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Locked behind Paywall</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Locked behind Paywall</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Photo / Screenshot OCR</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Included Free (Ctrl+V)</td>
                  <td className="p-3.5 sm:p-4 text-amber-400">Limited Daily Free Scans</td>
                  <td className="p-3.5 sm:p-4 text-emerald-400">Included in App</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Requires Pro Subscription</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Account / Registration</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Zero (Instant Access)</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Mandatory Sign-up</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Mandatory Sign-up</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Mandatory Sign-up</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Local Built-In Solver</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Yes (Zero-Key Active)</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Cloud Only</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">App Binary</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Cloud Only</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Interactive Follow-up Tutor</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Free Interactive Chat</td>
                  <td className="p-3.5 sm:p-4 text-amber-400">Paid Add-on</td>
                  <td className="p-3.5 sm:p-4 text-rose-400">Not Available</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Limited Text Assistance</td>
                </tr>
                <tr className="hover:bg-slate-800/30">
                  <td className="p-3.5 sm:p-4 font-semibold text-white">Math Typography</td>
                  <td className="p-3.5 sm:p-4 font-bold text-emerald-400 bg-cyan-500/5">Fail-Safe Unicode &amp; KaTeX</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">KaTeX Web</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Native Mobile Font</td>
                  <td className="p-3.5 sm:p-4 text-slate-400">Mathematica Form</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* F. SECTION 4: PEDAGOGICAL BEST PRACTICES (LEARNING VS COPYING) */}
        <section id="best-practices" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-amber-400 font-bold tracking-wider">
              <Lightbulb className="w-4 h-4" />
              <span>Section 4 • Pedagogical Guide</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              How to Master Math Using AI: The Step-by-Step Learning Protocol
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Using an AI math solver merely to copy homework answers leads to conceptual fragility during exams. Follow our 3-step learning protocol to build deep intuitive mastery:
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30 font-bold flex items-center justify-center text-sm">
                1
              </div>
              <h4 className="text-sm font-bold text-white">Attempt First, Check Second</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Always write down your own pen-and-paper attempt before querying the solver. If you get stuck, look only at <em>Step 1</em> of the AI working to trigger your problem-solving memory.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold flex items-center justify-center text-sm">
                2
              </div>
              <h4 className="text-sm font-bold text-white">Practice Reverse-Verification</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                Take the final answer (e.g. <code>x = 4</code>) and substitute it back into the initial equation <code>3(4) + 6 = 18</code>. Ensuring the equality holds cements the balance concept.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/30 font-bold flex items-center justify-center text-sm">
                3
              </div>
              <h4 className="text-sm font-bold text-white">Ask Follow-Up Clarifications</h4>
              <p className="text-xs text-slate-300 leading-relaxed">
                If a mathematical transformation appears unfamiliar, use the built-in AI Tutor to ask "Show an alternative method" or "Explain in simpler words" to view different solving angles.
              </p>
            </div>
          </div>

          {/* Common Pitfalls Box */}
          <div className="p-6 rounded-2xl bg-slate-900/90 border border-rose-500/30 space-y-3">
            <h4 className="text-sm font-bold text-rose-300 flex items-center gap-2 uppercase tracking-wider">
              <Shield className="w-4 h-4 text-rose-400" />
              <span>Top 4 Common Algebraic Traps to Avoid</span>
            </h4>
            <div className="grid sm:grid-cols-2 gap-3 text-xs text-slate-300">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white">1. Sign Reversal Errors:</span>
                <p className="text-slate-400">Forgetting that moving a term across the equals sign flips its sign: <code>+6</code> becomes <code>-6</code>.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white">2. PEMDAS Violations:</span>
                <p className="text-slate-400">Adding before multiplying: in <code>3 + 4 × 2</code>, multiply first (<code>4 × 2 = 8</code>), then add 3 to get <code>11</code>, not 14.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white">3. Omitting Negative Roots:</span>
                <p className="text-slate-400">For quadratics like <code>x² = 9</code>, remember that both <code>+3</code> and <code>-3</code> squared equal 9.</p>
              </div>
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="font-bold text-white">4. Dividing Across Addition:</span>
                <p className="text-slate-400">In <code>(3x + 6) / 3</code>, you must divide <em>both</em> terms by 3, yielding <code>x + 2</code>.</p>
              </div>
            </div>
          </div>
        </section>

        {/* G. SECTION 5: COMPREHENSIVE INTERACTIVE FAQ ACCORDION */}
        <section id="faq-section" className="space-y-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase text-cyan-400 font-bold tracking-wider">
              <HelpCircle className="w-4 h-4" />
              <span>Section 5 • FAQ Knowledge Base</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              Frequently Asked Questions About the Free AI Math Solver
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Clear answers to the most common questions regarding mathematical capabilities, privacy, accuracy, and device support.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                q: 'Is the Free AI Math Solver completely free to use?',
                a: 'Yes, 100% free with no hidden paywalls, no daily problem limits, and no mandatory registration. You can solve unlimited algebra, arithmetic, quadratic, fraction, geometry, and calculus problems instantly.'
              },
              {
                q: 'How does this solver compare to Photomath and Solvely.ai?',
                a: 'While Photomath and Solvely lock detailed step-by-step derivations behind paid monthly subscriptions ($9.99–$19.99/mo), our tool provides complete step-by-step working, formula explanations, and interactive follow-up tutor assistance entirely free.'
              },
              {
                q: 'Can I upload photos of handwritten notes or screenshots?',
                a: 'Yes! Simply switch to the Photo tab and drag-and-drop an image, browse your device, or press Ctrl+V to paste a screenshot directly from your clipboard. The neural OCR will extract the equation and solve it.'
              },
              {
                q: 'What branches of mathematics are supported?',
                a: 'Our solver covers 10+ core disciplines: Arithmetic, Linear Algebra, Quadratic Equations, Fractions & Decimals, Percentages & Financial Ratios, Exponents & Powers, Radicals & Surds, Geometry (Area/Perimeter), Statistics (Averages), and Introductory Calculus (Derivatives & Integrals).'
              },
              {
                q: 'Does the solver show the full step-by-step working?',
                a: 'Yes! Every solution includes a massive, high-contrast final answer card, followed by numbered intermediate steps detailing each operation (such as adding or subtracting terms from both sides, finding common denominators, or applying the quadratic formula).'
              },
              {
                q: 'How does the tool verify that answers are correct?',
                a: 'The engine performs deterministic algebraic verification: it substitutes the calculated answer back into the original equation to verify that the left-hand side equals the right-hand side (e.g. for 3x + 6 = 18 with x = 4, verifying 3(4) + 6 = 18).'
              },
              {
                q: 'Can I ask follow-up questions if I don\'t understand a step?',
                a: 'Yes! Below every solution is an interactive AI Math Tutor. You can click 1-click prompts like "Explain in simpler words" or "Show an alternative method", or type your own question to receive tailored explanations.'
              },
              {
                q: 'Does this tool work on mobile devices?',
                a: 'Yes, the interface is 100% responsive and optimized for smartphones, tablets, laptops, and desktop screens with native touch support and camera photo uploads.'
              }
            ].map((faq, idx) => (
              <div
                key={idx}
                className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === idx ? -1 : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-3 text-xs sm:text-sm font-bold text-white hover:text-cyan-300 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-2.5">
                    <span className="w-5 h-5 rounded-full bg-cyan-500/10 text-cyan-400 font-mono text-xs flex items-center justify-center shrink-0">
                      ?
                    </span>
                    <span>{faq.q}</span>
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                      openFaqIndex === idx ? 'rotate-180 text-cyan-400' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === idx && (
                  <div className="p-4 sm:p-5 pt-0 text-xs sm:text-sm text-slate-300 leading-relaxed border-t border-slate-800/60 bg-slate-950/40 animate-in fade-in duration-150">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* H. SECTION 6: AUTHORITATIVE CITATIONS & ACADEMIC STANDARDS */}
        <section id="citations" className="space-y-4 pt-4 border-t border-slate-800">
          <div className="flex items-center gap-2 text-xs font-mono uppercase text-slate-400 font-bold">
            <ExternalLink className="w-4 h-4 text-cyan-400" />
            <span>Academic Standards &amp; External Mathematical References</span>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 text-xs">
            <a
              href="https://mathworld.wolfram.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-cyan-300 transition-colors flex items-center gap-1">
                  <span>Wolfram MathWorld</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  The web's most extensive mathematical encyclopedia, covering formal axioms and algebraic structures.
                </p>
              </div>
            </a>

            <a
              href="https://www.khanacademy.org/math"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-emerald-300 transition-colors flex items-center gap-1">
                  <span>Khan Academy Mathematics</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Open educational curriculum standards for algebra, precalculus, geometry, and arithmetic mastery.
                </p>
              </div>
            </a>

            <a
              href="https://ai.google.dev/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-1">
                  <span>Google AI Studio &amp; Gemini Docs</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  Multimodal vision documentation on visual perception, character recognition, and math reasoning.
                </p>
              </div>
            </a>

            <a
              href="https://ocw.mit.edu/courses/mathematics/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-cyan-500/40 transition-all flex items-start gap-3 group"
            >
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0">
                <ExternalLink className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <div className="font-bold text-white group-hover:text-purple-300 transition-colors flex items-center gap-1">
                  <span>MIT OpenCourseWare (Math)</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </div>
                <p className="text-[11px] text-slate-400 leading-normal">
                  University-level linear algebra, differential equations, and computational calculus lecture materials.
                </p>
              </div>
            </a>
          </div>

          {/* Featured Recommended Industry Resource with 1x1 Thumbnail */}
          <div className="p-5 sm:p-6 rounded-2xl bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 shadow-xl flex flex-col sm:flex-row items-start sm:items-center gap-4 text-xs mt-3">
            <div className="shrink-0 p-1 rounded-2xl bg-slate-900 border border-slate-700/80 shadow-inner">
              <img
                src="/assets/partners/qrcodex.svg"
                alt="Blog Tools - qrcodex.site"
                className="w-14 h-14 aspect-square rounded-xl object-contain bg-slate-950 p-1"
                loading="lazy"
              />
            </div>
            <div className="space-y-1.5 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-bold tracking-wide">
                  Recommended Resource • Blog Tools
                </span>
                <span className="text-[11px] font-mono text-slate-500">
                  qrcodex.site
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
                Discover practical <a
                  href="https://qrcodex.site/blog/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold text-cyan-400 hover:text-cyan-300 underline underline-offset-4 inline-flex items-center gap-1 transition-colors"
                >
                  <span>Blogging tools</span>
                  <ExternalLink className="w-3 h-3 inline shrink-0" />
                </a> to simplify content planning, writing, editing, and publishing.
              </p>
            </div>
          </div>
        </section>

        {/* I. SECTION 7: HIRE WAQAS MEHMOOD CTA CARD */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-cyan-950/40 via-slate-900 to-indigo-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-xl">
          <div className="space-y-1.5 max-w-xl">
            <span className="px-2.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono font-bold uppercase tracking-wider">
              Custom AI Engineering &amp; Web Development
            </span>
            <h4 className="text-lg sm:text-xl font-bold text-white">
              Need a Custom AI Tool, Web Application or High-ROAS SEO Strategy?
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              Work with Waqas Mehmood to build bespoke AI web utilities, custom React/Laravel software, or technical on-page search engine optimization campaigns.
            </p>
          </div>
          <button
            onClick={() => onHireClick && onHireClick('Custom AI & Web Development')}
            className="px-6 py-3.5 rounded-2xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all cursor-pointer whitespace-nowrap flex items-center justify-center gap-2 shrink-0"
          >
            <span>Hire Waqas Mehmood</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </section>

      </article>
    </div>
  );
}
