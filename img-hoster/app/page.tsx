"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Upload, Zap, Shield, Globe, Image as ImageIcon,
  Check, ArrowRight, Star, Code, Users, BarChart3,
  Lock, Cpu, Layers
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParticleBackground from "@/components/ParticleBackground";
import { useState } from "react";

const features = [
  { icon: Upload, title: "Drag & Drop Upload", desc: "Instantly upload images with our smooth drag & drop interface. Bulk upload supported.", color: "from-green-400 to-green-600" },
  { icon: Zap, title: "Lightning Fast CDN", desc: "Your images delivered at blazing speed from our global CDN network.", color: "from-yellow-400 to-orange-500" },
  { icon: Shield, title: "Secure & Private", desc: "SHA-256 file hashing, malware scanning, and private/public toggle on every image.", color: "from-blue-400 to-blue-600" },
  { icon: Globe, title: "Embed Anywhere", desc: "Get direct URLs, HTML embed codes, Markdown, and BBCode with one click.", color: "from-purple-400 to-purple-600" },
  { icon: Code, title: "Powerful REST API", desc: "Full API access with key management, rate limiting, and detailed usage stats.", color: "from-pink-400 to-rose-500" },
  { icon: Layers, title: "Folder Organization", desc: "Keep your images tidy with folders. Rename, move, delete with ease.", color: "from-teal-400 to-teal-600" },
  { icon: Lock, title: "2FA Security", desc: "Two-factor authentication keeps your account and images secure.", color: "from-indigo-400 to-indigo-600" },
  { icon: Cpu, title: "Auto Optimization", desc: "Automatic WebP conversion and compression without losing quality.", color: "from-amber-400 to-amber-600" },
  { icon: BarChart3, title: "Usage Analytics", desc: "Monitor storage, bandwidth, and view counts with beautiful charts.", color: "from-green-400 to-teal-500" },
];

const plans = [
  {
    name: "Free",
    price: 0,
    desc: "Perfect for personal use",
    features: ["1GB Storage", "5GB Bandwidth/mo", "Up to 5MB per file", "Basic support", "Ads enabled"],
    cta: "Get Started Free",
    href: "/auth/register",
    highlight: false,
    badge: null,
  },
  {
    name: "Pro",
    price: 9,
    desc: "For creators & professionals",
    features: ["100GB Storage", "500GB Bandwidth/mo", "Up to 50MB per file", "No ads", "WebP conversion", "API access", "Priority support"],
    cta: "Start Pro",
    href: "/auth/register?plan=pro",
    highlight: true,
    badge: "Most Popular",
  },
  {
    name: "Business",
    price: 29,
    desc: "For teams & businesses",
    features: ["1TB Storage", "5TB Bandwidth/mo", "Up to 200MB per file", "No ads", "Custom domain", "Team accounts", "Full API", "Dedicated support"],
    cta: "Start Business",
    href: "/auth/register?plan=business",
    highlight: false,
    badge: null,
  },
];

const stats = [
  { value: "50M+", label: "Images Hosted" },
  { value: "99.9%", label: "Uptime SLA" },
  { value: "180+", label: "CDN Nodes" },
  { value: "10ms", label: "Avg Load Time" },
];

export default function Home() {
  const [billingYearly, setBillingYearly] = useState(false);

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      <ParticleBackground />
      <Navbar />

      {/* Hero */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-green-200/50 text-sm font-medium text-green-600 dark:text-green-400 mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            Free plan available — No credit card required
          </motion.div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            <span className="text-[var(--foreground)]">Host Images.</span>
            <br />
            <span className="bg-gradient-to-r from-green-500 via-green-400 to-teal-400 bg-clip-text text-transparent">
              Instantly. Securely.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-[var(--muted-foreground)] max-w-2xl mx-auto mb-10 leading-relaxed">
            The modern image hosting platform built for speed, security, and simplicity.
            Upload in seconds, share anywhere, manage everything from one beautiful dashboard.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/register"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-4 text-base animate-glow">
              <Upload size={18} />
              Start Hosting Free
            </Link>
            <Link href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-[var(--foreground)] font-semibold hover:border-green-400 hover:bg-green-50 dark:hover:bg-green-900/10 transition-all duration-200 text-base">
              View Pricing
              <ArrowRight size={16} />
            </Link>
          </div>
        </motion.div>

        {/* Hero preview card */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.7, ease: "easeOut" }}
          className="mt-16 w-full max-w-3xl mx-auto"
        >
          <div className="glass rounded-3xl p-6 shadow-2xl shadow-green-500/10 border border-green-200/30">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-yellow-400" />
              <div className="w-3 h-3 rounded-full bg-green-400" />
              <div className="flex-1 h-6 rounded-lg bg-[var(--muted)] mx-2 flex items-center px-3">
                <span className="text-xs text-[var(--muted-foreground)]">imghoster.com/uploads/your-image.png</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className={`rounded-xl bg-gradient-to-br ${
                  i % 3 === 0 ? "from-green-100 to-green-200 dark:from-green-900/30 dark:to-green-800/30" :
                  i % 3 === 1 ? "from-pink-100 to-pink-200 dark:from-pink-900/30 dark:to-pink-800/30" :
                  "from-teal-100 to-teal-200 dark:from-teal-900/30 dark:to-teal-800/30"
                } aspect-video flex items-center justify-center`}>
                  <ImageIcon size={24} className={`${
                    i % 3 === 0 ? "text-green-500" : i % 3 === 1 ? "text-pink-400" : "text-teal-500"
                  } opacity-60`} />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="relative z-10 py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="card p-6 text-center"
              >
                <div className="text-3xl font-bold bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--muted-foreground)] mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-20 px-4" id="features">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Everything you need to
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent"> host & share</span>
            </h2>
            <p className="text-[var(--muted-foreground)] max-w-xl mx-auto">
              Powerful features wrapped in a clean, intuitive interface. Built for individuals, creators, and teams.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07, duration: 0.5 }}
                className="card p-6 group cursor-default"
              >
                <div className={`w-11 h-11 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-200`}>
                  <feature.icon size={20} className="text-white" />
                </div>
                <h3 className="font-semibold text-base mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--muted-foreground)] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="relative z-10 py-20 px-4" id="pricing">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Simple, transparent
              <span className="bg-gradient-to-r from-green-500 to-teal-500 bg-clip-text text-transparent"> pricing</span>
            </h2>
            <p className="text-[var(--muted-foreground)] mb-8">No hidden fees. Cancel anytime.</p>

            {/* Toggle */}
            <div className="inline-flex items-center gap-3 bg-[var(--muted)] rounded-xl p-1">
              <button
                onClick={() => setBillingYearly(false)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!billingYearly ? "bg-white dark:bg-[var(--card)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
              >Monthly</button>
              <button
                onClick={() => setBillingYearly(true)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2 ${billingYearly ? "bg-white dark:bg-[var(--card)] shadow text-[var(--foreground)]" : "text-[var(--muted-foreground)]"}`}
              >
                Yearly
                <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">Save 20%</span>
              </button>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className={`relative rounded-2xl p-6 flex flex-col ${
                  plan.highlight
                    ? "bg-gradient-to-br from-green-500 to-green-600 text-white shadow-2xl shadow-green-500/30 scale-105"
                    : "card"
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <span className="bg-white text-green-600 text-xs font-bold px-4 py-1 rounded-full shadow-md flex items-center gap-1">
                      <Star size={10} fill="currentColor" /> {plan.badge}
                    </span>
                  </div>
                )}

                <div className="mb-4">
                  <h3 className={`text-lg font-bold mb-1 ${plan.highlight ? "text-white" : ""}`}>{plan.name}</h3>
                  <p className={`text-sm ${plan.highlight ? "text-green-100" : "text-[var(--muted-foreground)]"}`}>{plan.desc}</p>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold">
                    ${billingYearly ? Math.floor(plan.price * 0.8) : plan.price}
                  </span>
                  <span className={`text-sm ml-1 ${plan.highlight ? "text-green-100" : "text-[var(--muted-foreground)]"}`}>/mo</span>
                </div>

                <ul className="flex flex-col gap-2.5 mb-8 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-2 text-sm">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${plan.highlight ? "bg-white/20" : "bg-green-100 dark:bg-green-900/30"}`}>
                        <Check size={11} className={plan.highlight ? "text-white" : "text-green-600"} />
                      </div>
                      <span className={plan.highlight ? "text-green-50" : ""}>{f}</span>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.href}
                  className={`w-full text-center py-3 rounded-xl font-semibold transition-all duration-200 ${
                    plan.highlight
                      ? "bg-white text-green-600 hover:bg-green-50"
                      : "btn-primary"
                  }`}
                >
                  {plan.cta}
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative z-10 py-20 px-4">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-br from-green-500 to-teal-600 p-10 text-center text-white shadow-2xl shadow-green-500/30"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Ready to get started?</h2>
            <p className="text-green-100 mb-8 text-lg">Join thousands of creators hosting images on ImgHoster. Free forever plan available.</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth/register"
                className="bg-white text-green-600 font-bold px-8 py-3 rounded-xl hover:bg-green-50 transition-all inline-flex items-center gap-2 justify-center">
                <Upload size={18} />
                Start Free Today
              </Link>
              <Link href="/pricing"
                className="border-2 border-white/40 text-white font-semibold px-8 py-3 rounded-xl hover:bg-white/10 transition-all inline-flex items-center gap-2 justify-center">
                See All Plans <ArrowRight size={16} />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
