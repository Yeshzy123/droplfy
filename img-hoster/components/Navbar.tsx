"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useTheme } from "@/app/providers";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sun, Moon, Menu, X, Upload, LayoutDashboard,
  LogOut, User, Settings, ChevronDown, Zap
} from "lucide-react";

export default function Navbar() {
  const { data: session } = useSession();
  const { dark, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <>
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "glass shadow-lg shadow-black/5"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shadow-md group-hover:shadow-green-400/40 transition-all duration-200">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                ImgHoster
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-6">
              <Link href="/pricing" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Pricing</Link>
              <Link href="/docs" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">API Docs</Link>
              {session?.user && (
                <Link href="/dashboard" className="text-sm font-medium text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Dashboard</Link>
              )}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-3">
              <button
                onClick={toggle}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--muted)] hover:bg-green-50 dark:hover:bg-green-900/20 text-[var(--muted-foreground)] hover:text-green-500 transition-all duration-200"
              >
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>

              {session?.user ? (
                <div className="relative">
                  <button
                    onClick={() => setUserMenuOpen(!userMenuOpen)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl bg-[var(--muted)] hover:bg-green-50 dark:hover:bg-green-900/20 transition-all duration-200"
                  >
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold">
                      {session.user.name?.[0]?.toUpperCase() || "U"}
                    </div>
                    <span className="text-sm font-medium">{session.user.name?.split(" ")[0]}</span>
                    <ChevronDown size={14} className={`transition-transform ${userMenuOpen ? "rotate-180" : ""}`} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 mt-2 w-52 glass rounded-2xl shadow-xl overflow-hidden p-1"
                      >
                        <Link href="/dashboard" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-sm transition-colors">
                          <LayoutDashboard size={15} className="text-green-500" />
                          Dashboard
                        </Link>
                        <Link href="/dashboard/upload" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-sm transition-colors">
                          <Upload size={15} className="text-green-500" />
                          Upload
                        </Link>
                        <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-green-50 dark:hover:bg-green-900/20 text-sm transition-colors">
                          <Settings size={15} className="text-green-500" />
                          Settings
                        </Link>
                        <div className="h-px bg-[var(--card-border)] my-1" />
                        <button
                          onClick={() => { signOut({ callbackUrl: "/" }); setUserMenuOpen(false); }}
                          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-500 transition-colors"
                        >
                          <LogOut size={15} />
                          Sign Out
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <>
                  <Link href="/auth/login"
                    className="text-sm font-medium px-4 py-2 rounded-xl text-[var(--foreground)] hover:bg-[var(--muted)] transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/register"
                    className="btn-primary text-sm px-5 py-2 inline-flex items-center gap-2">
                    <Upload size={14} />
                    Get Started
                  </Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center gap-2">
              <button onClick={toggle}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)]">
                {dark ? <Sun size={16} /> : <Moon size={16} />}
              </button>
              <button onClick={() => setMobileOpen(!mobileOpen)}
                className="w-9 h-9 rounded-xl flex items-center justify-center bg-[var(--muted)] text-[var(--muted-foreground)]">
                {mobileOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-16 left-0 right-0 z-40 glass shadow-lg md:hidden"
          >
            <div className="p-4 flex flex-col gap-2">
              <Link href="/pricing" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-[var(--muted)] text-sm font-medium transition-colors">Pricing</Link>
              <Link href="/docs" onClick={() => setMobileOpen(false)}
                className="px-4 py-3 rounded-xl hover:bg-[var(--muted)] text-sm font-medium transition-colors">API Docs</Link>
              {session?.user ? (
                <>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl hover:bg-[var(--muted)] text-sm font-medium transition-colors flex items-center gap-2">
                    <LayoutDashboard size={15} className="text-green-500" /> Dashboard
                  </Link>
                  <Link href="/dashboard/upload" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl hover:bg-[var(--muted)] text-sm font-medium transition-colors flex items-center gap-2">
                    <Upload size={15} className="text-green-500" /> Upload
                  </Link>
                  <button onClick={() => signOut({ callbackUrl: "/" })}
                    className="px-4 py-3 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium text-red-500 text-left flex items-center gap-2">
                    <LogOut size={15} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/login" onClick={() => setMobileOpen(false)}
                    className="px-4 py-3 rounded-xl hover:bg-[var(--muted)] text-sm font-medium transition-colors">Sign In</Link>
                  <Link href="/auth/register" onClick={() => setMobileOpen(false)}
                    className="btn-primary text-sm px-4 py-3 text-center mt-1">Get Started Free</Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
