"use client";

import { useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Upload, Images, FolderOpen, CreditCard,
  Key, Settings, Shield, Zap, Menu, X, ChevronRight, LogOut
} from "lucide-react";
import { signOut } from "next-auth/react";

const navItems = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/upload", label: "Upload", icon: Upload },
  { href: "/dashboard/images", label: "My Images", icon: Images },
  { href: "/dashboard/folders", label: "Folders", icon: FolderOpen },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
];

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--background)]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center animate-pulse">
            <Zap size={20} className="text-white" />
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) return null;

  const isAdmin = (session.user as any)?.role === "admin";

  return (
    <div className="min-h-screen flex bg-[var(--background)]">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-60 border-r border-[var(--card-border)] bg-[var(--card)] min-h-screen sticky top-0 h-screen">
        <div className="p-5 border-b border-[var(--card-border)]">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Zap size={15} className="text-white" />
            </div>
            <span className="font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">ImgHoster</span>
          </Link>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
          <div className="space-y-0.5">
            {navItems.map(item => {
              const active = pathname === item.href;
              return (
                <Link key={item.href} href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    active
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}>
                  <item.icon size={16} className={active ? "text-green-500" : ""} />
                  {item.label}
                  {active && <ChevronRight size={14} className="ml-auto text-green-400" />}
                </Link>
              );
            })}

            {isAdmin && (
              <>
                <div className="h-px bg-[var(--card-border)] my-2" />
                <Link href="/admin"
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                    pathname.startsWith("/admin")
                      ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)] hover:text-[var(--foreground)]"
                  }`}>
                  <Shield size={16} className={pathname.startsWith("/admin") ? "text-purple-500" : ""} />
                  Admin Panel
                </Link>
              </>
            )}
          </div>
        </nav>

        <div className="p-3 border-t border-[var(--card-border)]">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-[var(--muted)] mb-1">
            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {session.user?.name?.[0]?.toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">{session.user?.name}</p>
              <p className="text-xs text-[var(--muted-foreground)] truncate">{session.user?.email}</p>
            </div>
          </div>
          <button onClick={() => signOut({ callbackUrl: "/" })}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-[var(--muted-foreground)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut size={15} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 z-40 md:hidden"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }} animate={{ x: 0 }} exit={{ x: -280 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed left-0 top-0 bottom-0 w-64 bg-[var(--card)] z-50 md:hidden flex flex-col border-r border-[var(--card-border)]"
            >
              <div className="p-5 flex items-center justify-between border-b border-[var(--card-border)]">
                <Link href="/" className="flex items-center gap-2" onClick={() => setSidebarOpen(false)}>
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                    <Zap size={15} className="text-white" />
                  </div>
                  <span className="font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">ImgHoster</span>
                </Link>
                <button onClick={() => setSidebarOpen(false)} className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
                  <X size={16} />
                </button>
              </div>
              <nav className="flex-1 p-3 overflow-y-auto">
                {navItems.map(item => {
                  const active = pathname === item.href;
                  return (
                    <Link key={item.href} href={item.href} onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all mb-0.5 ${
                        active ? "bg-green-50 dark:bg-green-900/20 text-green-600" : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                      }`}>
                      <item.icon size={16} />
                      {item.label}
                    </Link>
                  );
                })}
              </nav>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar (mobile) */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-[var(--card-border)] bg-[var(--card)]">
          <button onClick={() => setSidebarOpen(true)} className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors">
            <Menu size={20} />
          </button>
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
              <Zap size={13} className="text-white" />
            </div>
            <span className="font-bold text-sm bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">ImgHoster</span>
          </Link>
          <div className="w-9" />
        </div>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
