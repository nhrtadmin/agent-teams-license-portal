import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";

/* ─── tiny hook: intersection observer for scroll-reveal ─── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── reveal wrapper ─── */
function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.7s ease ${delay}ms, transform 0.7s ease ${delay}ms`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── animated counter ─── */
function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0);
  const { ref, visible } = useInView();
  useEffect(() => {
    if (!visible) return;
    let start = 0;
    const step = Math.ceil(to / 60);
    const id = setInterval(() => {
      start += step;
      if (start >= to) { setVal(to); clearInterval(id); }
      else setVal(start);
    }, 16);
    return () => clearInterval(id);
  }, [visible, to]);
  return (
    <span ref={ref}>
      {val.toLocaleString()}{suffix}
    </span>
  );
}

/* ─── nav ─── */
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav
      className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 py-4 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(6,8,15,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-indigo-900/50">
          AT
        </div>
        <span className="text-white font-semibold text-sm tracking-wide">Agent Teams</span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm text-gray-400">
        {["Features", "Pricing", "How it works"].map((l) => (
          <a
            key={l}
            href={`#${l.toLowerCase().replace(/ /g, "-")}`}
            className="hover:text-white transition-colors"
          >
            {l}
          </a>
        ))}
      </div>
      <div className="flex items-center gap-3">
        <Link
          to="/login"
          className="text-sm text-gray-300 hover:text-white transition-colors px-3 py-1.5"
        >
          Sign in
        </Link>
        <Link
          to="/register"
          className="text-sm font-semibold bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-1.5 rounded-lg transition-colors shadow-lg shadow-indigo-900/40"
        >
          Get Started
        </Link>
      </div>
    </nav>
  );
}

/* ─── hero ─── */
function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* ambient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute w-[600px] h-[600px] rounded-full opacity-20 blur-3xl"
          style={{
            background: "radial-gradient(circle, #6366f1 0%, transparent 70%)",
            top: "10%",
            left: "20%",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute w-[400px] h-[400px] rounded-full opacity-15 blur-3xl"
          style={{
            background: "radial-gradient(circle, #8b5cf6 0%, transparent 70%)",
            bottom: "20%",
            right: "15%",
            animation: "float 10s ease-in-out infinite reverse",
          }}
        />
        <div
          className="absolute w-[300px] h-[300px] rounded-full opacity-10 blur-3xl"
          style={{
            background: "radial-gradient(circle, #06b6d4 0%, transparent 70%)",
            top: "50%",
            right: "30%",
            animation: "float 12s ease-in-out infinite",
          }}
        />
      </div>

      {/* grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 text-center px-6 max-w-5xl mx-auto">
        <div
          className="inline-flex items-center gap-2 bg-indigo-600/10 border border-indigo-500/20 rounded-full px-4 py-1.5 mb-8 text-xs text-indigo-400 font-medium"
          style={{ animation: "fadeDown 0.8s ease both" }}
        >
          <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" />
          AI-Powered Multi-Agent Development Platform
        </div>

        <h1
          className="text-5xl md:text-7xl font-extrabold tracking-tight text-white leading-[1.05] mb-6"
          style={{ animation: "fadeDown 0.8s ease 0.1s both" }}
        >
          Build software with
          <br />
          <span
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            an AI team
          </span>
        </h1>

        <p
          className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          style={{ animation: "fadeDown 0.8s ease 0.2s both" }}
        >
          Agent Teams orchestrates a full crew of specialised AI agents — Product Owner,
          Architect, Coder, QA Engineer — working in parallel to ship your projects faster
          than ever.
        </p>

        <div
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
          style={{ animation: "fadeDown 0.8s ease 0.3s both" }}
        >
          <Link
            to="/register"
            className="group relative inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-2xl shadow-indigo-900/50 hover:shadow-indigo-700/50 hover:-translate-y-0.5"
          >
            Get Started Free
            <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </Link>
          <a
            href="#how-it-works"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white text-sm font-medium transition-colors px-4 py-3.5"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.91 11.672a.375.375 0 010 .656l-5.603 3.113a.375.375 0 01-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112z" />
            </svg>
            See it in action
          </a>
        </div>

        {/* mock terminal window */}
        <div
          className="mt-20 mx-auto max-w-3xl rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl shadow-black/60"
          style={{ animation: "fadeUp 1s ease 0.5s both" }}
        >
          <div className="flex items-center gap-2 px-4 py-3 bg-white/[0.04] border-b border-white/[0.06]">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <span className="ml-2 text-xs text-gray-600 font-mono">agent-teams — run</span>
          </div>
          <div className="bg-[#0a0d14] p-6 text-left font-mono text-xs leading-6 space-y-1">
            <p><span className="text-gray-600">$</span> <span className="text-green-400">agent-teams run</span> <span className="text-gray-300">"Build a REST API with authentication"</span></p>
            <p className="text-gray-600">─────────────────────────────────────────</p>
            <p><span className="text-indigo-400">📋 Product Owner</span> <span className="text-gray-500">→ Analysing requirements...</span></p>
            <p><span className="text-violet-400">🏗  Architect</span>     <span className="text-gray-500">→ Designing system structure...</span></p>
            <p><span className="text-cyan-400">💻 Coder</span>         <span className="text-gray-500">→ Generating 14 files...</span></p>
            <p><span className="text-emerald-400">✅ QA Engineer</span>   <span className="text-gray-500">→ Writing test suite...</span></p>
            <p className="text-gray-600">─────────────────────────────────────────</p>
            <p><span className="text-emerald-400">✓ Done</span> <span className="text-gray-400">in 47s · 14 files saved · 0 errors</span></p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── stats ─── */
function Stats() {
  const stats = [
    { value: 10, suffix: "x", label: "Faster than solo development" },
    { value: 14, suffix: "+", label: "Specialised AI agents" },
    { value: 99, suffix: "%", label: "Code accuracy rate" },
    { value: 5000, suffix: "+", label: "Projects shipped" },
  ];
  return (
    <section className="py-16 border-y border-white/[0.05]">
      <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {stats.map((s, i) => (
          <Reveal key={s.label} delay={i * 80} className="text-center">
            <p className="text-3xl md:text-4xl font-extrabold text-white">
              <Counter to={s.value} suffix={s.suffix} />
            </p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── features ─── */
const FEATURES = [
  {
    icon: "🧠",
    title: "Multi-Agent Orchestration",
    desc: "A full software team runs in parallel — product owner, architect, coder, QA, reviewer — each with specialised prompts and context.",
    color: "from-indigo-600/20 to-transparent",
    border: "border-indigo-500/20",
  },
  {
    icon: "⚡",
    title: "Real-Time Code Generation",
    desc: "Watch agents stream tokens live in the feed. Files are extracted and saved to your workspace automatically as they're generated.",
    color: "from-violet-600/20 to-transparent",
    border: "border-violet-500/20",
  },
  {
    icon: "📋",
    title: "Kanban Task Tracking",
    desc: "Every task gets a Kanban card with agent comments, deliverables, file counts, and a full status timeline — all generated automatically.",
    color: "from-cyan-600/20 to-transparent",
    border: "border-cyan-500/20",
  },
  {
    icon: "🔒",
    title: "Machine-Locked Licensing",
    desc: "Each license key is locked to one machine on first activation, preventing abuse while keeping renewals instant from your portal.",
    color: "from-emerald-600/20 to-transparent",
    border: "border-emerald-500/20",
  },
  {
    icon: "🎯",
    title: "Product Owner Chat",
    desc: "Refine requirements through a conversational interface before kicking off a run — the PO agent turns your chat into structured tasks.",
    color: "from-orange-600/20 to-transparent",
    border: "border-orange-500/20",
  },
  {
    icon: "🔧",
    title: "Fully Configurable Agents",
    desc: "Swap models, rewrite system prompts, enable or disable individual agents, and set per-agent model overrides — all from the UI.",
    color: "from-pink-600/20 to-transparent",
    border: "border-pink-500/20",
  },
];

function Features() {
  return (
    <section id="features" className="py-28 px-6 max-w-6xl mx-auto">
      <Reveal className="text-center mb-16">
        <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Features</p>
        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
          Everything you need to ship
        </h2>
        <p className="text-gray-400 max-w-xl mx-auto text-lg">
          Agent Teams handles the entire software development lifecycle — from idea to working code.
        </p>
      </Reveal>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => (
          <Reveal key={f.title} delay={i * 60}>
            <div
              className={`group h-full rounded-2xl border ${f.border} bg-gradient-to-br ${f.color} p-6 hover:scale-[1.02] transition-transform duration-300 cursor-default`}
              style={{ background: `linear-gradient(135deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))` }}
            >
              <div className={`w-12 h-12 rounded-xl border ${f.border} flex items-center justify-center text-2xl mb-4 bg-white/5`}>
                {f.icon}
              </div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ─── how it works ─── */
const STEPS = [
  { step: "01", title: "Describe your project", desc: "Chat with the Product Owner agent or type a requirement directly. It refines your idea into structured tasks." },
  { step: "02", title: "Agents spin up", desc: "The Architect, Coder, QA Engineer, and Code Reviewer spawn in parallel, each reading the other's output in real time." },
  { step: "03", title: "Code streams live", desc: "Watch tokens flow in the feed. Files are parsed and saved to your workspace automatically — no copy-paste." },
  { step: "04", title: "Review the Kanban", desc: "Every task card shows agent comments, deliverables, file counts, and a status timeline for full visibility." },
];

function HowItWorks() {
  return (
    <section id="how-it-works" className="py-28 px-6 border-t border-white/[0.05]">
      <div className="max-w-4xl mx-auto">
        <Reveal className="text-center mb-16">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">How it works</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            From idea to code in minutes
          </h2>
        </Reveal>

        <div className="relative">
          {/* vertical line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-gradient-to-b from-indigo-600/50 via-violet-600/30 to-transparent hidden md:block" />

          <div className="space-y-10">
            {STEPS.map((s, i) => (
              <Reveal key={s.step} delay={i * 100}>
                <div className="flex gap-6 items-start">
                  <div className="relative shrink-0 w-16 h-16 rounded-2xl border border-indigo-500/30 bg-indigo-600/10 flex items-center justify-center">
                    <span className="text-indigo-400 font-mono font-bold text-sm">{s.step}</span>
                    {i < STEPS.length - 1 && (
                      <div className="absolute -bottom-10 left-1/2 -translate-x-1/2 w-px h-10 bg-indigo-500/20 hidden md:block" />
                    )}
                  </div>
                  <div className="pt-1">
                    <h3 className="text-white font-semibold text-lg mb-1">{s.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── pricing ─── */
function Pricing() {
  const [annual, setAnnual] = useState(true);

  const plans = [
    {
      name: "Monthly",
      price: annual ? null : 19,
      annualPrice: null,
      period: "/month",
      desc: "Perfect for individuals and small projects.",
      cta: "Get started",
      highlight: false,
      features: [
        "Unlimited agent runs",
        "Full code generation",
        "File auto-save to workspace",
        "Kanban task tracking",
        "1 machine per license",
        "Email support",
      ],
    },
    {
      name: "Annual",
      price: annual ? 12 : null,
      annualPrice: 149,
      period: annual ? "/month" : null,
      desc: "Best value — save 37% vs monthly.",
      cta: "Get started",
      highlight: true,
      badge: "Most popular",
      features: [
        "Everything in Monthly",
        "Priority support",
        "Early access to new agents",
        "Usage analytics dashboard",
        "Custom model overrides",
        "Team onboarding call",
      ],
    },
    {
      name: "Enterprise",
      price: null,
      period: null,
      desc: "Custom deployment for teams and organisations.",
      cta: "Contact us",
      highlight: false,
      features: [
        "Everything in Annual",
        "Unlimited machines",
        "Self-hosted option",
        "SSO / SAML",
        "Custom agent personas",
        "SLA & dedicated support",
      ],
    },
  ];

  return (
    <section id="pricing" className="py-28 px-6 border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-10">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Pricing</p>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
            Simple, transparent pricing
          </h2>
          <p className="text-gray-400 text-lg">No seat fees. No usage caps. One license per machine.</p>
        </Reveal>

        {/* toggle */}
        <Reveal className="flex justify-center mb-12">
          <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl p-1">
            <button
              onClick={() => setAnnual(false)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!annual ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setAnnual(true)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${annual ? "bg-indigo-600 text-white shadow-lg" : "text-gray-400 hover:text-white"}`}
            >
              Annual
              <span className="text-xs bg-emerald-500 text-white px-1.5 py-0.5 rounded-md font-bold">-37%</span>
            </button>
          </div>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 items-start">
          {plans.map((p, i) => (
            <Reveal key={p.name} delay={i * 80}>
              <div
                className={`relative rounded-2xl p-7 border transition-transform hover:-translate-y-1 duration-300 ${
                  p.highlight
                    ? "border-indigo-500/50 bg-gradient-to-b from-indigo-600/20 to-transparent shadow-2xl shadow-indigo-900/30"
                    : "border-white/[0.08] bg-white/[0.03]"
                }`}
              >
                {p.highlight && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-indigo-600 text-white text-xs font-bold px-4 py-1 rounded-full shadow-lg">
                      {(p as { badge?: string }).badge}
                    </span>
                  </div>
                )}

                <p className="text-white font-semibold mb-1">{p.name}</p>
                <p className="text-gray-500 text-sm mb-5">{p.desc}</p>

                <div className="mb-6">
                  {p.price !== null ? (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">${p.price}</span>
                      <span className="text-gray-500 text-sm mb-1">{p.period}</span>
                      {annual && p.annualPrice === null && (
                        <span className="text-gray-600 text-xs mb-1 ml-1">billed ${149}/yr</span>
                      )}
                    </div>
                  ) : p.name === "Enterprise" ? (
                    <p className="text-3xl font-extrabold text-white">Custom</p>
                  ) : (
                    <div className="flex items-end gap-1">
                      <span className="text-4xl font-extrabold text-white">$19</span>
                      <span className="text-gray-500 text-sm mb-1">/month</span>
                    </div>
                  )}
                </div>

                <Link
                  to={p.name === "Enterprise" ? "#" : "/register"}
                  className={`block text-center rounded-xl py-2.5 text-sm font-semibold mb-6 transition-all ${
                    p.highlight
                      ? "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/40"
                      : "bg-white/10 hover:bg-white/20 text-white"
                  }`}
                >
                  {p.cta} →
                </Link>

                <ul className="space-y-2.5">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2.5 text-sm text-gray-400">
                      <svg className="w-4 h-4 shrink-0 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                      </svg>
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── testimonials ─── */
const TESTIMONIALS = [
  {
    quote: "I shipped a full SaaS backend in 3 hours. The QA agent caught bugs I would have missed for days.",
    name: "Sarah K.",
    role: "Indie hacker",
    avatar: "SK",
  },
  {
    quote: "The Kanban view is a game-changer. I can see exactly what every agent did and review the code inline.",
    name: "James T.",
    role: "Senior Engineer",
    avatar: "JT",
  },
  {
    quote: "Replaced two junior contractors with Agent Teams. Quality went up, cost went down dramatically.",
    name: "Priya M.",
    role: "CTO, Startup",
    avatar: "PM",
  },
];

function Testimonials() {
  return (
    <section className="py-28 px-6 border-t border-white/[0.05]">
      <div className="max-w-5xl mx-auto">
        <Reveal className="text-center mb-14">
          <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-3">Testimonials</p>
          <h2 className="text-4xl font-extrabold text-white">Loved by developers</h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 80}>
              <div className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 hover:border-indigo-500/30 hover:bg-indigo-600/5 transition-all duration-300">
                <div className="flex mb-4 gap-0.5">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-5">"{t.quote}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-indigo-600/30 border border-indigo-500/30 flex items-center justify-center text-xs text-indigo-300 font-bold">
                    {t.avatar}
                  </div>
                  <div>
                    <p className="text-white text-sm font-medium">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── CTA ─── */
function CTA() {
  return (
    <section className="py-28 px-6 border-t border-white/[0.05]">
      <Reveal className="max-w-2xl mx-auto text-center">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-3xl blur-3xl opacity-20"
            style={{ background: "radial-gradient(ellipse, #6366f1 0%, transparent 70%)" }}
          />
          <div className="relative rounded-3xl border border-indigo-500/20 bg-indigo-600/5 p-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
              Ready to build faster?
            </h2>
            <p className="text-gray-400 text-lg mb-8">
              Join thousands of developers shipping with an AI team.
              Get started in under 2 minutes.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl text-sm transition-all shadow-2xl shadow-indigo-900/50 hover:-translate-y-0.5"
            >
              Create your free account
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
            <p className="mt-4 text-xs text-gray-600">No credit card required to get started.</p>
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ─── footer ─── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.05] py-10 px-6">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white text-xs font-bold">
            AT
          </div>
          <span className="text-gray-400 text-sm">Agent Teams</span>
        </div>
        <p className="text-gray-600 text-xs">© 2026 Agent Teams. All rights reserved.</p>
        <div className="flex gap-5 text-xs text-gray-600">
          <a href="#" className="hover:text-gray-400 transition-colors">Privacy</a>
          <a href="#" className="hover:text-gray-400 transition-colors">Terms</a>
          <Link to="/login" className="hover:text-gray-400 transition-colors">Sign in</Link>
        </div>
      </div>
    </footer>
  );
}

/* ─── global keyframe animations injected once ─── */
const KEYFRAMES = `
@keyframes float {
  0%, 100% { transform: translateY(0px) scale(1); }
  50% { transform: translateY(-30px) scale(1.05); }
}
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
}
`;

/* ─── page ─── */
export function LandingPage() {
  return (
    <div className="min-h-screen bg-[#06080f] text-white font-sans">
      <style>{KEYFRAMES}</style>
      <Nav />
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Pricing />
      <Testimonials />
      <CTA />
      <Footer />
    </div>
  );
}
