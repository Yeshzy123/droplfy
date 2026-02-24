"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Users, Search, Ban, CheckCircle2, Shield, ChevronDown } from "lucide-react";
import { formatDate, formatBytes } from "@/lib/utils";

interface User {
  id: string;
  name: string | null;
  email: string | null;
  plan: string;
  role: string;
  banned: boolean;
  createdAt: string;
  storageUsed: number;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [actionUserId, setActionUserId] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/users?page=${page}&search=${encodeURIComponent(search)}`);
    const data = await res.json();
    setUsers(data.users || []);
    setTotalPages(data.pages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const updateUser = async (id: string, updates: any) => {
    setActionUserId(id);
    const res = await fetch("/api/admin/users", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, ...updates }),
    });
    if (res.ok) {
      setUsers(prev => prev.map(u => u.id === id ? { ...u, ...updates } : u));
    }
    setActionUserId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Users size={22} className="text-blue-500" /> User Management
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">{total} users total</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] focus:border-blue-400 transition-all text-sm"
          />
        </div>
      </div>

      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[var(--muted)] border-b border-[var(--card-border)]">
              <tr>
                {["User", "Plan", "Role", "Storage", "Joined", "Status", "Actions"].map(h => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold text-[var(--muted-foreground)]">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                [...Array(8)].map((_, i) => (
                  <tr key={i}>
                    <td colSpan={7} className="px-4 py-3">
                      <div className="skeleton h-8 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : users.map((user, i) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--muted)] transition-colors"
                >
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                        {user.name?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-medium text-xs">{user.name || "No name"}</p>
                        <p className="text-[var(--muted-foreground)] text-xs">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium capitalize ${
                      user.plan === "pro" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                      user.plan === "business" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" :
                      "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>{user.plan}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                      user.role === "admin" ? "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400" : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                    }`}>{user.role}</span>
                  </td>
                  <td className="py-3 px-4 text-xs text-[var(--muted-foreground)]">{formatBytes(user.storageUsed)}</td>
                  <td className="py-3 px-4 text-xs text-[var(--muted-foreground)]">{formatDate(user.createdAt)}</td>
                  <td className="py-3 px-4">
                    {user.banned ? (
                      <span className="flex items-center gap-1 text-xs text-red-500"><Ban size={11} /> Banned</span>
                    ) : (
                      <span className="flex items-center gap-1 text-xs text-green-500"><CheckCircle2 size={11} /> Active</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => updateUser(user.id, { banned: !user.banned })}
                        disabled={actionUserId === user.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors disabled:opacity-50 ${
                          user.banned
                            ? "bg-green-100 text-green-700 hover:bg-green-200 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400"
                        }`}
                      >
                        {user.banned ? "Unban" : "Ban"}
                      </button>
                      {user.role !== "admin" && (
                        <button
                          onClick={() => updateUser(user.id, { role: "admin" })}
                          disabled={actionUserId === user.id}
                          className="px-2.5 py-1 rounded-lg text-xs font-medium bg-purple-100 text-purple-700 hover:bg-purple-200 dark:bg-purple-900/30 dark:text-purple-400 transition-colors disabled:opacity-50 flex items-center gap-1"
                        >
                          <Shield size={10} /> Admin
                        </button>
                      )}
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm disabled:opacity-40 hover:border-blue-300 transition-colors">
            Previous
          </button>
          <span className="text-sm text-[var(--muted-foreground)]">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm disabled:opacity-40 hover:border-blue-300 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
