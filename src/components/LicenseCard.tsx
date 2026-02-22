import type { License } from "../api/client";

const statusColors: Record<License["status"], string> = {
  active: "bg-emerald-100 text-emerald-700",
  expired: "bg-red-100 text-red-700",
  inactive: "bg-yellow-100 text-yellow-700",
  cancelled: "bg-gray-100 text-gray-500",
};

function daysLeft(expiresAt?: string): string {
  if (!expiresAt) return "—";
  const d = Math.ceil(
    (new Date(expiresAt).getTime() - Date.now()) / 86_400_000
  );
  if (d <= 0) return "Expired";
  return `${d} day${d === 1 ? "" : "s"} left`;
}

interface Props {
  license: License;
  onRenew?: (licenseId: string) => void;
}

export function LicenseCard({ license, onRenew }: Props) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">License Key</p>
          <code className="font-mono text-sm text-gray-800 break-all">{license.key}</code>
        </div>
        <span
          className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${statusColors[license.status]}`}
        >
          {license.status.charAt(0).toUpperCase() + license.status.slice(1)}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm">
        <div>
          <p className="text-gray-400 text-xs">Plan</p>
          <p className="font-medium capitalize">{license.plan}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Expires</p>
          <p className="font-medium">
            {license.expiresAt
              ? new Date(license.expiresAt).toLocaleDateString()
              : "—"}
          </p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Time remaining</p>
          <p className="font-medium">{daysLeft(license.expiresAt)}</p>
        </div>
        <div>
          <p className="text-gray-400 text-xs">Activated</p>
          <p className="font-medium">
            {license.activatedAt
              ? new Date(license.activatedAt).toLocaleDateString()
              : "Not yet"}
          </p>
        </div>
      </div>

      {(license.status === "active" || license.status === "expired") && onRenew && (
        <button
          onClick={() => onRenew(license.id)}
          className="mt-2 w-full rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 transition-colors"
        >
          {license.status === "expired" ? "Renew License" : "Extend License"}
        </button>
      )}
    </div>
  );
}
