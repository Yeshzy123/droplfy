"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, Images, CreditCard, HardDrive, Flag,
  TrendingUp, AlertTriangle, CheckCircle2, Ban
} from "lucide-react";
import { formatBytes } from "@/lib/utils";

interface Stats {
  totalUsers: number;
  totalImages: number;
  activeSubscriptions: number;
  flaggedImages: number;
  unresolvedReports: number;
  totalStorageUsed: number;
  recentUsers: any[];
  recentImages: any[];
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(data => {
      setStats(data);
      setLoading(false);
    });
  }, []);

  const cards = [
    { label: "Total Users", value: stats?.totalUsers ?? 0, icon: Users, color: "from-blue-400 to-blue-600" },
    { label: "Total Images", value: stats?.totalImages ?? 0, icon: Images, color: "from-green-400 to-green-600" },
    { label: "Paid Subscribers", value: stats?.activeSubscriptions ?? 0, icon: CreditCard, color: "from-purple-400 to-purple-600" },
    { label: "Storage Used", value: formatBytes(stats?.totalStorageUsed ?? 0), icon: HardDrive, color: "from-orange-400 to-orange-600" },
    { label: "Flagged Images", value: stats?.flaggedImages ?? 0, icon: Flag, color: "from-red-400 to-red-600" },
    { label: "Open Reports", value: stats?.unresolvedReports ?? 0, icon: AlertTriangle, color: "from-amber-400 to-amber-600" },
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold">Admin Overview</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Platform-wide statistics and management.</p>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {cards.map((card, i) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="card p-5"
          >
            {loading ? (
              <div className="skeleton h-16 rounded-xl" />
            ) : (
              <>
                <div className={`w-10 h-10 rounded-2xl bg-gradient-to-br ${card.color} flex items-center justify-center mb-3 shadow-md`}>
                  <card.icon size={18} className="text-white" />
                </div>
                <div className="text-2xl font-bold">{card.value}</div>
                <div className="text-xs text-[var(--muted-foreground)] mt-0.5">{card.label}</div>
              </>
            )}
          </motion.div>
        ))}
      </div>

      {/* Recent Users */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold flex items-center gap-2">
            <Users size={16} className="text-blue-500" /> Recent Users
          </h3>
          <a href="/admin/users" className="text-xs text-blue-500 hover:underline font-medium">View all →</a>
        </div>
        {loading ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="skeleton h-10 rounded-xl" />)}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--card-border)]">
                  <th className="text-left py-2 px-3 text-xs font-medium text-[var(--muted-foreground)]">User</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-[var(--muted-foreground)]">Plan</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-[var(--muted-foreground)]">Storage</th>
                  <th className="text-left py-2 px-3 text-xs font-medium text-[var(--muted-foreground)]">Status</th>
                </tr>
              </thead>
              <tbody>
                {(stats?.recentUsers || []).map((user: any) => (
                  <tr key={user.id} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                    <td className="py-2.5 px-3">
                      <div>
                        <p className="font-medium text-xs">{user.name || "—"}</p>
                        <p className="text-[var(--muted-foreground)] text-xs">{user.email}</p>
                      </div>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                        user.plan === "pro" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                        user.plan === "business" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                        "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}>{user.plan}</span>
                    </td>
                    <td className="py-2.5 px-3 text-xs text-[var(--muted-foreground)]">{formatBytes(user.storageUsed)}</td>
                    <td className="py-2.5 px-3">
                      {user.banned ? (
                        <span className="flex items-center gap-1 text-xs text-red-500">
                          <Ban size={11} /> Banned
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-xs text-green-500">
                          <CheckCircle2 size={11} /> Active
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
}
