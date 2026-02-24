"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Images, HardDrive, Upload, Key, TrendingUp, Plus,
  ArrowUpRight, Clock, Zap
} from "lucide-react";
import { formatBytes, getStoragePercent, getStorageLimit } from "@/lib/utils";

interface Profile {
  name: string;
  email: string;
  plan: string;
  storageUsed: number;
  imageCount: number;
  apiKeyCount: number;
  subscription: any;
}

interface Image {
  id: string;
  url: string;
  originalName: string;
  size: number;
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [recentImages, setRecentImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/user/profile").then(r => r.json()),
      fetch("/api/images?limit=6").then(r => r.json()),
    ]).then(([prof, imgs]) => {
      setProfile(prof);
      setRecentImages(imgs.images || []);
      setLoading(false);
    });
  }, []);

  const planColors: Record<string, string> = {
    free: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
    pro: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
    business: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400",
  };

  const storagePercent = profile ? getStoragePercent(profile.storageUsed, profile.plan) : 0;
  const storageLimit = profile ? getStorageLimit(profile.plan) : 1073741824;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold">
              Welcome back, {session?.user?.name?.split(" ")[0]} 👋
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Here&apos;s what&apos;s happening with your images.</p>
          </div>
          <Link href="/dashboard/upload"
            className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
            <Plus size={16} /> Upload Images
          </Link>
        </div>
      </motion.div>

      {/* Stats cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            icon: Images, label: "Total Images", value: loading ? "—" : profile?.imageCount ?? 0,
            sub: "All time uploads", color: "from-green-400 to-green-600", delay: 0
          },
          {
            icon: HardDrive, label: "Storage Used", value: loading ? "—" : formatBytes(profile?.storageUsed ?? 0),
            sub: `of ${formatBytes(storageLimit)}`, color: "from-blue-400 to-blue-600", delay: 0.07
          },
          {
            icon: Key, label: "API Keys", value: loading ? "—" : profile?.apiKeyCount ?? 0,
            sub: "Active keys", color: "from-purple-400 to-purple-600", delay: 0.14
          },
          {
            icon: TrendingUp, label: "Current Plan",
            value: loading ? "—" : <span className={`text-sm px-2 py-0.5 rounded-full font-semibold capitalize ${planColors[profile?.plan || "free"]}`}>{profile?.plan || "free"}</span>,
            sub: "Subscription tier", color: "from-pink-400 to-rose-500", delay: 0.21
          },
        ].map(card => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: card.delay, duration: 0.4 }}
            className="card p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md`}>
                <card.icon size={18} className="text-white" />
              </div>
            </div>
            <div className="text-2xl font-bold mb-0.5">{card.value}</div>
            <div className="text-xs text-[var(--muted-foreground)]">{card.label}</div>
            <div className="text-xs text-[var(--muted-foreground)] mt-0.5 opacity-70">{card.sub}</div>
          </motion.div>
        ))}
      </div>

      {/* Storage bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28, duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-semibold text-sm">Storage Usage</h3>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">
              {formatBytes(profile?.storageUsed ?? 0)} used of {formatBytes(storageLimit)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2.5 py-1 rounded-full font-semibold capitalize ${planColors[profile?.plan || "free"]}`}>
              {profile?.plan || "free"}
            </span>
            {profile?.plan === "free" && (
              <Link href="/pricing" className="text-xs text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
                Upgrade <ArrowUpRight size={12} />
              </Link>
            )}
          </div>
        </div>
        <div className="h-2.5 rounded-full bg-[var(--muted)] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${storagePercent}%` }}
            transition={{ delay: 0.4, duration: 0.8, ease: "easeOut" }}
            className={`h-full rounded-full ${
              storagePercent > 90 ? "bg-gradient-to-r from-red-400 to-red-500" :
              storagePercent > 70 ? "bg-gradient-to-r from-yellow-400 to-orange-400" :
              "bg-gradient-to-r from-green-400 to-green-500"
            }`}
          />
        </div>
        <p className="text-xs text-[var(--muted-foreground)] mt-2">{storagePercent.toFixed(1)}% used</p>
      </motion.div>

      {/* Recent uploads */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35, duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-green-500" />
            <h3 className="font-semibold">Recent Uploads</h3>
          </div>
          <Link href="/dashboard/images" className="text-xs text-green-500 hover:text-green-600 flex items-center gap-1 font-medium">
            View all <ArrowUpRight size={12} />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="skeleton rounded-xl aspect-video" />
            ))}
          </div>
        ) : recentImages.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-3">
              <Upload size={24} className="text-[var(--muted-foreground)]" />
            </div>
            <p className="text-[var(--muted-foreground)] text-sm mb-3">No images yet</p>
            <Link href="/dashboard/upload" className="btn-primary text-sm px-5 py-2 inline-flex items-center gap-2">
              <Plus size={14} /> Upload your first image
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {recentImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="group relative rounded-xl overflow-hidden aspect-video bg-[var(--muted)] cursor-pointer"
              >
                <img src={img.url} alt={img.originalName} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-200 flex items-center justify-center">
                  <Link href={`/dashboard/images`}
                    className="opacity-0 group-hover:opacity-100 transition-all bg-white text-gray-900 text-xs font-medium px-3 py-1.5 rounded-lg">
                    View
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick actions */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.42, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
      >
        {[
          { href: "/dashboard/upload", icon: Upload, label: "Upload Images", desc: "Drag & drop or browse", color: "from-green-400 to-green-600" },
          { href: "/dashboard/api-keys", icon: Key, label: "Manage API Keys", desc: "Generate & manage keys", color: "from-purple-400 to-purple-600" },
          { href: "/pricing", icon: Zap, label: "Upgrade Plan", desc: "More storage & features", color: "from-pink-400 to-rose-500" },
        ].map(action => (
          <Link key={action.href} href={action.href}
            className="card p-5 flex items-center gap-4 group hover:border-green-300 transition-colors">
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-md flex-shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <action.icon size={18} className="text-white" />
            </div>
            <div>
              <p className="font-semibold text-sm">{action.label}</p>
              <p className="text-xs text-[var(--muted-foreground)]">{action.desc}</p>
            </div>
            <ArrowUpRight size={14} className="ml-auto text-[var(--muted-foreground)] group-hover:text-green-500 transition-colors" />
          </Link>
        ))}
      </motion.div>
    </div>
  );
}
