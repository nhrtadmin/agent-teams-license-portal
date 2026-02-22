interface Props {
  selected: "monthly" | "annual";
  onChange: (plan: "monthly" | "annual") => void;
}

const plans = [
  {
    id: "monthly" as const,
    label: "Monthly",
    price: "$19",
    period: "/month",
    description: "Billed monthly. Cancel anytime.",
    badge: null,
  },
  {
    id: "annual" as const,
    label: "Annual",
    price: "$149",
    period: "/year",
    description: "Save 35% vs monthly.",
    badge: "Best value",
  },
];

export function PlanSelector({ selected, onChange }: Props) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {plans.map((plan) => (
        <button
          key={plan.id}
          onClick={() => onChange(plan.id)}
          className={`relative rounded-2xl border-2 p-5 text-left transition-all ${
            selected === plan.id
              ? "border-indigo-600 bg-indigo-50"
              : "border-gray-200 bg-white hover:border-indigo-300"
          }`}
        >
          {plan.badge && (
            <span className="absolute -top-3 right-4 bg-indigo-600 text-white text-xs font-bold px-3 py-0.5 rounded-full">
              {plan.badge}
            </span>
          )}
          <p className="text-lg font-bold text-gray-900">
            {plan.price}
            <span className="text-sm font-normal text-gray-500">{plan.period}</span>
          </p>
          <p className="mt-1 font-semibold text-gray-800">{plan.label}</p>
          <p className="mt-0.5 text-xs text-gray-500">{plan.description}</p>
          <div
            className={`mt-3 h-4 w-4 rounded-full border-2 ${
              selected === plan.id
                ? "border-indigo-600 bg-indigo-600"
                : "border-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}
