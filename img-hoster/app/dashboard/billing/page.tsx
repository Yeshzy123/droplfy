"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { CreditCard, Check, ExternalLink, AlertCircle, Receipt, Zap, Star } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface BillingItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description: string;
  invoiceUrl: string | null;
  createdAt: string;
}

interface SubInfo {
  plan: string;
  status: string;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId: string | null;
}

const plans = [
  {
    name: "Free", key: "free", price: 0, color: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
    features: ["1GB Storage", "5GB Bandwidth", "5MB max file", "Basic support"],
  },
  {
    name: "Pro", key: "pro", price: 9, color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    features: ["100GB Storage", "500GB Bandwidth", "50MB max file", "No ads", "API access", "Priority support"],
  },
  {
    name: "Business", key: "business", price: 29, color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
    features: ["1TB Storage", "5TB Bandwidth", "200MB max file", "Custom domain", "Team accounts", "Dedicated support"],
  },
];

export default function BillingPage() {
  const { data: session } = useSession();
  const [sub, setSub] = useState<SubInfo | null>(null);
  const [history, setHistory] = useState<BillingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [upgrading, setUpgrading] = useState<string | null>(null);
  const [portalLoading, setPortalLoading] = useState(false);

  const currentPlan = (session?.user as any)?.plan || "free";

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then(r => r.json()),
      fetch("/api/billing/history").then(r => r.json()),
    ]).then(([profile, hist]) => {
      setSub(profile.subscription);
      setHistory(Array.isArray(hist) ? hist : []);
      setLoading(false);
    });
  }, []);

  const handleUpgrade = async (planKey: string) => {
    setUpgrading(planKey);
    try {
      const res = await fetch("/api/billing/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan: planKey, interval: "monthly" }),
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Checkout API error:", errorText);
        setUpgrading(null);
        return;
      }
      
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        console.error("No URL returned from checkout");
        setUpgrading(null);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setUpgrading(null);
    }
  };

  const handlePortal = async () => {
    setPortalLoading(true);
    const res = await fetch("/api/billing/portal", { method: "POST" });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
    else setPortalLoading(false);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <CreditCard size={22} className="text-green-500" /> Billing & Plans
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Manage your subscription and billing history.</p>
      </motion.div>

      {/* Current plan status */}
      {sub && currentPlan !== "free" && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="card p-5 border-green-200 dark:border-green-800/50"
        >
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Zap size={18} className="text-white" />
              </div>
              <div>
                <p className="font-semibold capitalize">{currentPlan} Plan — Active</p>
                {sub.currentPeriodEnd && (
                  <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
                    {sub.cancelAtPeriodEnd ? "Cancels" : "Renews"} on {formatDate(sub.currentPeriodEnd)}
                  </p>
                )}
              </div>
            </div>
            {sub.stripeSubscriptionId && (
              <button
                onClick={handlePortal}
                disabled={portalLoading}
                className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm font-medium hover:border-green-300 transition-colors disabled:opacity-60"
              >
                <ExternalLink size={14} />
                {portalLoading ? "Loading..." : "Manage Subscription"}
              </button>
            )}
          </div>
          {sub.cancelAtPeriodEnd && (
            <div className="mt-3 p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 flex items-center gap-2 text-amber-700 dark:text-amber-400 text-sm">
              <AlertCircle size={15} />
              Your subscription will be canceled at the end of the current billing period.
            </div>
          )}
        </motion.div>
      )}

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {plans.map((plan, i) => {
          const isCurrent = currentPlan === plan.key;
          return (
            <motion.div
              key={plan.key}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
              className={`card p-6 flex flex-col relative ${plan.key === "pro" ? "border-green-300 dark:border-green-700/50 shadow-lg shadow-green-500/10" : ""}`}
            >
              {plan.key === "pro" && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-gradient-to-r from-green-500 to-green-600 text-white text-xs font-bold px-4 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star size={10} fill="white" /> Most Popular
                  </span>
                </div>
              )}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold text-lg">{plan.name}</h3>
                  {isCurrent && (
                    <span className={`text-xs px-2.5 py-1 rounded-full font-semibold ${plan.color}`}>
                      Current
                    </span>
                  )}
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-bold">${plan.price}</span>
                  {plan.price > 0 && <span className="text-[var(--muted-foreground)] text-sm">/month</span>}
                </div>
              </div>

              <ul className="flex flex-col gap-2 mb-6 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm">
                    <div className="w-4 h-4 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                      <Check size={10} className="text-green-600" />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <div className="w-full py-2.5 rounded-xl text-center text-sm font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                  Current Plan
                </div>
              ) : plan.key === "free" ? (
                <div className="w-full py-2.5 rounded-xl text-center text-sm font-medium bg-[var(--muted)] text-[var(--muted-foreground)]">
                  Downgrade
                </div>
              ) : (
                <button
                  onClick={() => handleUpgrade(plan.key)}
                  disabled={upgrading === plan.key}
                  className="btn-primary w-full py-2.5 text-sm disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {upgrading === plan.key ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                      </svg>
                      Redirecting...
                    </span>
                  ) : `Upgrade to ${plan.name}`}
                </button>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Billing History */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Receipt size={18} className="text-green-500" />
          <h3 className="font-semibold">Billing History</h3>
        </div>

        {loading ? (
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-10 text-[var(--muted-foreground)]">
            <Receipt size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm">No billing history yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {history.map(item => (
              <div key={item.id}
                className="flex items-center justify-between p-3 rounded-xl hover:bg-[var(--muted)] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <Receipt size={14} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{item.description}</p>
                    <p className="text-xs text-[var(--muted-foreground)]">{formatDate(item.createdAt)}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                    item.status === "paid"
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {item.status}
                  </span>
                  <span className="font-semibold text-sm">
                    ${(item.amount / 100).toFixed(2)}
                  </span>
                  {item.invoiceUrl && (
                    <a href={item.invoiceUrl} target="_blank" rel="noreferrer"
                      className="p-1.5 rounded-lg hover:bg-[var(--card-border)] text-[var(--muted-foreground)] hover:text-green-500 transition-colors">
                      <ExternalLink size={13} />
                    </a>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
