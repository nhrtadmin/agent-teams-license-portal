import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { PlanSelector } from "../components/PlanSelector";
import { apiClient, type License } from "../api/client";

export function PurchasePage() {
  const navigate = useNavigate();
  const { token } = useAuthStore();
  const [plan, setPlan] = useState<"monthly" | "annual">("annual");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  async function handleCheckout() {
    setBusy(true);
    setError("");

    // ── Demo mode: monthly plan creates a real license instantly ──
    if (plan === "monthly") {
      try {
        const { data } = await apiClient.post<{ license: License }>("/licenses/demo");
        // Pass license data to success page via query params
        const params = new URLSearchParams({
          demo: "1",
          key: data.license.key,
          plan: data.license.plan,
          expires: data.license.expiresAt ?? "",
        });
        navigate(`/success?${params.toString()}`);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
          "Failed to create demo license. Please try again.";
        setError(msg);
        setBusy(false);
      }
      return;
    }

    // ── Annual plan → Stripe checkout ──
    try {
      const { data } = await apiClient.post<{ url: string }>("/licenses/checkout", { plan });
      window.location.href = data.url;
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { error?: string } } })?.response?.data?.error ??
        "Failed to start checkout. Please try again.";
      setError(msg);
      setBusy(false);
    }
  }

  const isDemo = plan === "monthly";

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-600 mb-4">
            <span className="text-white text-2xl font-bold">AT</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Choose a plan</h1>
          <p className="text-gray-500 mt-1 text-sm">
            One license key per machine. Activate in the desktop app.
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 space-y-6">
          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 text-red-700 px-4 py-3 text-sm">
              {error}
            </div>
          )}

          <PlanSelector selected={plan} onChange={setPlan} />

          {/* Demo badge — only when monthly selected */}
          {isDemo && (
            <div className="flex items-center gap-2 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2.5 text-sm text-emerald-700">
              <span className="text-lg">🎉</span>
              <span>
                <strong>Demo mode:</strong> Monthly plan activates instantly — no payment needed.
              </span>
            </div>
          )}

          <ul className="text-sm text-gray-600 space-y-1.5">
            {[
              "Unlimited agent runs",
              "Full code generation & file saving",
              "Kanban task tracking",
              "Priority support",
            ].map((feat) => (
              <li key={feat} className="flex items-center gap-2">
                <span className="text-emerald-500 font-bold">✓</span>
                {feat}
              </li>
            ))}
          </ul>

          <button
            onClick={handleCheckout}
            disabled={busy}
            className="w-full rounded-lg bg-indigo-600 px-4 py-3 text-sm font-semibold text-white hover:bg-indigo-700 disabled:opacity-60 transition-colors"
          >
            {busy
              ? isDemo
                ? "Activating license…"
                : "Redirecting to Stripe…"
              : isDemo
                ? "Activate Monthly Plan (Demo) →"
                : "Continue with Annual Plan →"}
          </button>

          <p className="text-center text-xs text-gray-400">
            {isDemo
              ? "Demo license · 30 days · no credit card required"
              : "Payments powered by Stripe. Secure checkout."}
          </p>
        </div>
      </div>
    </div>
  );
}
