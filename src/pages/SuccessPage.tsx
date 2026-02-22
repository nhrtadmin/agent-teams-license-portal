import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { apiClient, type License } from "../api/client";
import { useAuthStore } from "../store/useAuthStore";

const KEYFRAMES = `
@keyframes scaleIn {
  from { transform: scale(0.5); opacity: 0; }
  to   { transform: scale(1);   opacity: 1; }
}
@keyframes fadeUp {
  from { opacity: 0; transform: translateY(16px); }
  to   { opacity: 1; transform: translateY(0); }
}
@keyframes confetti {
  0%   { transform: translateY(0) rotate(0deg);   opacity: 1; }
  100% { transform: translateY(80px) rotate(720deg); opacity: 0; }
}
`;

function ConfettiDot({ color, left, delay }: { color: string; left: string; delay: string }) {
  return (
    <div
      className="absolute top-0 w-2 h-2 rounded-sm pointer-events-none"
      style={{
        background: color,
        left,
        animationName: "confetti",
        animationDuration: "1.2s",
        animationDelay: delay,
        animationTimingFunction: "ease-out",
        animationFillMode: "both",
      }}
    />
  );
}

export function SuccessPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { token, fetchMe } = useAuthStore();

  const isDemo = params.get("demo") === "1";
  const sessionId = params.get("session_id");

  // Demo license built from query params
  const demoLicense: License | null = isDemo
    ? {
        id: "demo",
        key: params.get("key") ?? "",
        plan: (params.get("plan") ?? "monthly") as License["plan"],
        status: "active",
        expiresAt: params.get("expires") ?? undefined,
        createdAt: new Date().toISOString(),
      }
    : null;

  const [license, setLicense] = useState<License | null>(demoLicense);
  const [loading, setLoading] = useState(!isDemo);
  const [copied, setCopied] = useState(false);
  const [redirecting, setRedirecting] = useState(false);

  // Poll for Stripe-created license
  useEffect(() => {
    if (isDemo || !sessionId || !token) return;
    let attempts = 0;
    async function poll() {
      try {
        const { data, status } = await apiClient.get<{ license: License }>(
          `/licenses/session/${sessionId}`,
          { validateStatus: (s) => s < 500 }
        );
        if (status === 200) { setLicense(data.license); setLoading(false); return; }
      } catch { /* ignore */ }
      attempts++;
      if (attempts < 10) setTimeout(poll, 2000);
      else setLoading(false);
    }
    poll();
  }, [isDemo, sessionId, token]);

  // Auto-redirect to dashboard after 6s once license is shown
  useEffect(() => {
    if (!license) return;
    fetchMe(); // refresh dashboard data
    const t = setTimeout(() => {
      setRedirecting(true);
      setTimeout(() => navigate("/dashboard"), 1200);
    }, 5000);
    return () => clearTimeout(t);
  }, [license, fetchMe, navigate]);

  function copyKey() {
    if (!license) return;
    navigator.clipboard.writeText(license.key).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  const confettiColors = ["#6366f1", "#8b5cf6", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"];
  const confettiDots = Array.from({ length: 12 }, (_, i) => ({
    color: confettiColors[i % confettiColors.length],
    left: `${8 + i * 7}%`,
    delay: `${i * 0.07}s`,
  }));

  return (
    <div className="min-h-screen bg-[#06080f] flex items-center justify-center p-4 overflow-hidden">
      <style>{KEYFRAMES}</style>

      <div className="w-full max-w-lg text-center space-y-6">

        {/* animated tick */}
        <div className="relative inline-flex items-center justify-center">
          <div
            className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center"
            style={{ animation: "scaleIn 0.5s cubic-bezier(0.34,1.56,0.64,1) both" }}
          >
            <svg className="w-10 h-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {/* confetti */}
          <div className="absolute inset-x-0 top-0 h-0">
            {confettiDots.map((d, i) => (
              <ConfettiDot key={i} {...d} />
            ))}
          </div>
        </div>

        <div style={{ animation: "fadeUp 0.6s ease 0.3s both" }}>
          <h1 className="text-3xl font-extrabold text-white mb-1">
            {isDemo ? "License activated!" : "Payment successful!"}
          </h1>
          <p className="text-gray-400 text-sm">
            {isDemo
              ? "Your 30-day demo license is ready to use."
              : "Your Agent Teams license has been created."}
          </p>
        </div>

        {/* license card */}
        {loading ? (
          <div
            className="rounded-2xl border border-white/10 bg-white/5 p-8 flex flex-col items-center gap-4"
            style={{ animation: "fadeUp 0.6s ease 0.4s both" }}
          >
            <div className="w-8 h-8 rounded-full border-4 border-emerald-500 border-t-transparent animate-spin" />
            <p className="text-sm text-gray-500">Generating your license key…</p>
          </div>
        ) : license ? (
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-6 space-y-4 text-left"
            style={{ animation: "fadeUp 0.6s ease 0.4s both" }}
          >
            {/* key */}
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-widest mb-2">Your license key</p>
              <div className="flex items-center gap-3 bg-black/40 border border-white/10 rounded-xl px-4 py-3">
                <code className="flex-1 font-mono text-sm text-emerald-300 break-all">{license.key}</code>
                <button
                  onClick={copyKey}
                  className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-lg transition-all ${
                    copied
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-white/10 text-gray-300 hover:bg-white/20"
                  }`}
                >
                  {copied ? "✓ Copied!" : "Copy"}
                </button>
              </div>
            </div>

            {/* meta */}
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Plan</p>
                <p className="font-semibold text-white capitalize">{license.plan}</p>
              </div>
              <div className="rounded-xl bg-black/30 border border-white/[0.06] px-4 py-3">
                <p className="text-xs text-gray-500 mb-0.5">Expires</p>
                <p className="font-semibold text-white">
                  {license.expiresAt ? new Date(license.expiresAt).toLocaleDateString() : "—"}
                </p>
              </div>
            </div>

            {/* activation hint */}
            <div className="rounded-xl bg-indigo-600/10 border border-indigo-500/20 px-4 py-3 text-sm text-indigo-300">
              <strong className="text-indigo-200">Next step:</strong> Open Agent Teams, paste this key on
              the license screen, and click <strong className="text-white">Activate</strong>.
            </div>
          </div>
        ) : (
          <div
            className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-sm text-gray-400"
            style={{ animation: "fadeUp 0.6s ease 0.4s both" }}
          >
            We couldn't load your key right now. Check your{" "}
            <Link to="/dashboard" className="text-indigo-400 underline">dashboard</Link> — it will appear there shortly.
          </div>
        )}

        {/* countdown redirect */}
        {license && (
          <div style={{ animation: "fadeUp 0.6s ease 0.6s both" }}>
            <p className="text-xs text-gray-600 mb-4">
              {redirecting ? "Redirecting to dashboard…" : "Redirecting to dashboard in 5 seconds…"}
            </p>
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-xl text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-indigo-900/40"
            >
              Go to Dashboard
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
