"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Home, ArrowLeft, Search, Zap } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-transparent to-pink-50 dark:from-green-950/20 dark:to-pink-950/20 pointer-events-none" />

      {/* Floating blobs */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-200/20 dark:bg-green-900/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-pink-200/20 dark:bg-pink-900/10 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative text-center max-w-lg"
      >
        {/* Logo */}
        <Link href="/" className="inline-flex items-center gap-2 mb-10">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-lg">
            <Zap size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
            ImgHoster
          </span>
        </Link>

        {/* Big 404 */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
          className="relative mb-6"
        >
          <div className="text-9xl font-black bg-gradient-to-br from-green-200 to-green-400 dark:from-green-800 dark:to-green-600 bg-clip-text text-transparent select-none leading-none">
            404
          </div>
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-4 -right-4 w-14 h-14 rounded-2xl bg-gradient-to-br from-pink-300 to-rose-400 flex items-center justify-center shadow-xl shadow-pink-300/30"
          >
            <Search size={22} className="text-white" />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.4 }}
        >
          <h1 className="text-2xl font-bold mb-3">Page not found</h1>
          <p className="text-[var(--muted-foreground)] mb-8 leading-relaxed">
            Oops! The page you&apos;re looking for doesn&apos;t exist or has been moved.
            Let&apos;s get you back on track.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/"
              className="btn-primary inline-flex items-center justify-center gap-2 px-6 py-3 text-sm">
              <Home size={16} /> Go Home
            </Link>
            <button onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-sm font-medium hover:border-green-300 transition-colors">
              <ArrowLeft size={16} /> Go Back
            </button>
          </div>
        </motion.div>

        {/* Fun links */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.4 }}
          className="mt-10 flex flex-wrap gap-3 justify-center"
        >
          {[
            { label: "Upload Images", href: "/dashboard/upload" },
            { label: "View Pricing", href: "/pricing" },
            { label: "API Docs", href: "/docs" },
            { label: "Dashboard", href: "/dashboard" },
          ].map(link => (
            <Link key={link.href} href={link.href}
              className="text-sm text-[var(--muted-foreground)] hover:text-green-500 transition-colors px-3 py-1.5 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20">
              {link.label}
            </Link>
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
