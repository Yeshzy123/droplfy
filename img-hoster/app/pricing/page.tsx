"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Check, Star, Zap, ArrowRight } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const plans = [
  {
    name: "Free", key: "free", price: 0, yearlyPrice: 0,
    desc: "For personal use and testing",
    features: [
      "1GB Storage", "5GB Bandwidth/mo", "Up to 5MB per file",
      "Basic image hosting", "Direct URL generation",
      "HTML / Markdown / BBCode embeds", "Community support",
    ],
    notIncluded: ["No ads removal", "No WebP conversion", "No API access", "No custom domain"],
    cta: "Get Started Free", href: "/auth/register", highlight: false, badge: null,
    color: "from-gray-400 to-gray-500",
  },
  {
    name: "Pro", key: "pro", price: 9, yearlyPrice: 7,
    desc: "For creators and professionals",
    features: [
      "100GB Storage", "500GB Bandwidth/mo", "Up to 50MB per file",
      "No advertisements", "Auto WebP conversion",
      "Image optimization", "REST API access",
      "Folder organization", "Priority processing",
      "Priority support",
    ],
    notIncluded: [],
    cta: "Start Pro Plan", href: "/auth/register?plan=pro", highlight: true, badge: "Most Popular",
    color: "from-green-400 to-green-600",
  },
  {
    name: "Business", key: "business", price: 29, yearlyPrice: 23,
    desc: "For teams and growing businesses",
    features: [
      "1TB Storage", "5TB Bandwidth/mo", "Up to 200MB per file",
      "No advertisements", "Auto WebP conversion",
      "Custom domain support", "Team accounts (up to 10)",
      "Full REST API access", "Advanced analytics",
      "Malware scanning", "Custom branding", "Dedicated support",
      "Webhook integration",
    ],
    notIncluded: [],
    cta: "Start Business Plan", href: "/auth/register?plan=business", highlight: false, badge: null,
    color: "from-purple-400 to-purple-600",
  },
  {
    name: "Lifetime",
    monthly: 100,
    yearly: 100,
    description: "One-time payment, forever access",
    features: [
      "2TB Storage", "10TB Bandwidth", "Up to 500MB per file",
      "No advertisements forever", "Auto WebP conversion",
      "Custom domain support", "Unlimited team accounts",
      "Full REST API access", "Advanced analytics",
      "Malware scanning", "Custom branding", "Priority support",
      "Lifetime updates", "Early access to new features",
    ],
    notIncluded: [],
    cta: "Get Lifetime Access", href: "/dashboard/billing?plan=lifetime", highlight: true, badge: "BEST VALUE",
    color: "from-amber-400 to-orange-500",
  },
];

const faqs = [
  { q: "Can I upgrade or downgrade anytime?", a: "Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately and billing is prorated." },
  { q: "What payment methods do you accept?", a: "We accept all major credit cards (Visa, Mastercard, Amex), debit cards, and PayPal via our Stripe-powered payment system." },
  { q: "Is there a free trial for paid plans?", a: "We offer a free plan with 1GB storage so you can test the platform. Paid plans come with a 14-day money-back guarantee." },
  { q: "What happens if I exceed my storage limit?", a: "Uploads will be paused until you upgrade your plan or delete existing images to free up space." },
  { q: "Do you support team accounts?", a: "Team accounts are available on the Business plan, supporting up to 10 team members with shared storage and management." },
  { q: "Is my data secure?", a: "Yes. All images are stored with SHA-256 hashing, files are scanned for malware, and you can toggle images between public and private at any time." },
];

export default function PricingPage() {
  const [yearly, setYearly] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />

      <main className="flex-1 pt-24 pb-20 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl sm:text-5xl font-bold mb-4">
              Simple, transparent
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent"> pricing</span>
            </h1>
            <p className="text-[var(--muted-foreground)] text-lg max-w-xl mx-auto mb-8">
              No hidden fees. No setup costs. Cancel anytime.
            </p>

            {/* Billing toggle */}
            <div className="inline-flex items-center gap-1 bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setYearly(false)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all ${!yearly ? "bg-white dark:bg-[var(--card)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
              >Monthly</button>
              <button
                onClick={() => setYearly(true)}
                className={`px-5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${yearly ? "bg-white dark:bg-[var(--card)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
              >
                Yearly
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full font-semibold">Save 20%</span>
              </button>
            </div>
          </motion.div>

          {/* Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.key}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-2xl p-7 flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/25 md:scale-105"
                    : "card"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-green-600 text-xs font-bold px-4 py-1.5 rounded-full shadow-lg flex items-center gap-1.5">
                      <Star size={11} fill="currentColor" /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-5">
                  <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center mb-3 shadow-md ${plan.highlight ? "opacity-80" : ""}`}>
                    <Zap size={18} className="text-white" />
                  </div>
                  <h2 className={`text-xl font-bold mb-1 ${plan.highlight ? "text-white" : ""}`}>{plan.name}</h2>
                  <p className={`text-sm ${plan.highlight ? "text-green-100" : "text-[var(--muted-foreground)]"}`}>{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <div className="flex items-baseline gap-1">
                    <span className="text-4xl font-bold">${yearly ? plan.yearlyPrice : plan.price}</span>
                    {plan.price > 0 && (
                      <span className={`text-sm ${plan.highlight ? "text-green-100" : "text-[var(--muted-foreground)]"}`}>/mo</span>
                    )}
                  </div>
                  {yearly && plan.price > 0 && (
                    <p className={`text-xs mt-0.5 ${plan.highlight ? "text-green-200" : "text-[var(--muted-foreground)]"}`}>
                      Billed annually (${plan.yearlyPrice * 12}/yr)
                    </p>
                  )}
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${plan.highlight ? "bg-white/25" : "bg-green-100 dark:bg-green-900/30"}`}>
                        <Check size={10} className={plan.highlight ? "text-white" : "text-green-600"} />
                      </div>
                      <span className={plan.highlight ? "text-green-50" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href="/dashboard/billing"
                  className={`w-full text-center py-3.5 rounded-xl font-semibold text-sm transition-all duration-200 flex items-center justify-center gap-2 ${
                    plan.highlight
                      ? "bg-white text-green-600 hover:bg-green-50 shadow-lg"
                      : "btn-primary"
                  }`}
                >
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Feature comparison */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-20"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Full Feature Comparison</h2>
            <div className="card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--muted)] border-b border-[var(--card-border)]">
                    <tr>
                      <th className="text-left py-4 px-5 font-semibold">Feature</th>
                      {["Free", "Pro", "Business"].map(p => (
                        <th key={p} className="text-center py-4 px-4 font-semibold">{p}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["Storage", "1 GB", "100 GB", "1 TB"],
                      ["Bandwidth/mo", "5 GB", "500 GB", "5 TB"],
                      ["Max file size", "5 MB", "50 MB", "200 MB"],
                      ["Advertisements", "Yes", "No", "No"],
                      ["WebP conversion", "No", "Yes", "Yes"],
                      ["API access", "No", "Yes", "Yes"],
                      ["Custom domain", "No", "No", "Yes"],
                      ["Team accounts", "No", "No", "Yes"],
                      ["Malware scanning", "No", "No", "Yes"],
                      ["Custom branding", "No", "No", "Yes"],
                      ["Priority support", "No", "Yes", "Dedicated"],
                    ].map(([feature, free, pro, biz], i) => (
                      <tr key={i} className={`border-b border-[var(--card-border)] last:border-0 ${i % 2 === 0 ? "" : "bg-[var(--muted)]/30"}`}>
                        <td className="py-3.5 px-5 font-medium">{feature}</td>
                        {[free, pro, biz].map((val, j) => (
                          <td key={j} className="py-3.5 px-4 text-center">
                            {val === "Yes" || val === "Dedicated" ? (
                              <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 mx-auto">
                                <Check size={11} className="text-green-600" />
                              </span>
                            ) : val === "No" ? (
                              <span className="text-[var(--muted-foreground)]">—</span>
                            ) : (
                              <span className="font-medium">{val}</span>
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto"
          >
            <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="card overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-sm pr-4">{faq.q}</span>
                    <span className={`text-[var(--muted-foreground)] transition-transform flex-shrink-0 ${openFaq === i ? "rotate-180" : ""}`}>
                      ▾
                    </span>
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-[var(--muted-foreground)] leading-relaxed border-t border-[var(--card-border)] pt-4">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
