import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import { LicenseCard } from "../components/LicenseCard";
import { apiClient } from "../api/client";

export function DashboardPage() {
  const navigate = useNavigate();
  const { user, token, loading, fetchMe, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }
    fetchMe();
  }, [token, navigate, fetchMe]);

  async function handleRenew(licenseId: string) {
    try {
      const { data } = await apiClient.post<{ url: string }>("/licenses/renew", {
        licenseId,
      });
      window.location.href = data.url;
    } catch {
      alert("Failed to create renewal session. Please try again.");
    }
  }

  if (loading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  const licenses = user?.licenses ?? [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Nav */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center">
              <span className="text-white text-sm font-bold">AT</span>
            </div>
            <span className="font-semibold text-gray-800">Agent Teams Licenses</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.email}</span>
            <button
              onClick={() => {
                logout();
                navigate("/login");
              }}
              className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-10 space-y-8">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-900">Your licenses</h2>
          <Link
            to="/purchase"
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            + Buy license
          </Link>
        </div>

        {licenses.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 bg-white p-12 text-center">
            <p className="text-gray-400 text-sm mb-4">You don't have any licenses yet.</p>
            <Link
              to="/purchase"
              className="inline-block rounded-lg bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              Purchase your first license
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {licenses.map((lic) => (
              <LicenseCard key={lic.id} license={lic} onRenew={handleRenew} />
            ))}
          </div>
        )}

        {/* How to use */}
        <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-6 space-y-2">
          <h3 className="font-semibold text-indigo-900">How to activate</h3>
          <ol className="text-sm text-indigo-800 list-decimal list-inside space-y-1">
            <li>Open the Agent Teams desktop application.</li>
            <li>Copy the license key from the card above.</li>
            <li>Paste it in the "Enter license key" field on the welcome screen.</li>
            <li>Click <strong>Activate</strong>. The app will verify it with our servers.</li>
          </ol>
        </div>
      </main>
    </div>
  );
}
