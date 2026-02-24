"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Key, Plus, Trash2, Copy, Check, Eye, EyeOff,
  AlertCircle, Clock, Activity, Lock
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface ApiKey {
  id: string;
  name: string;
  key: string;
  requests: number;
  lastUsed: string | null;
  active: boolean;
  createdAt: string;
}

export default function ApiKeysPage() {
  const { data: session } = useSession();
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [revealedId, setRevealedId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const plan = (session?.user as any)?.plan || "free";
  const hasApiAccess = plan !== "free";

  useEffect(() => {
    fetch("/api/api-keys").then(r => r.json()).then(data => {
      setKeys(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const createKey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    const res = await fetch("/api/api-keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName.trim() }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.error);
      setCreating(false);
      return;
    }
    setKeys(prev => [data, ...prev]);
    setNewName("");
    setShowCreateForm(false);
    setCreating(false);
    setRevealedId(data.id);
  };

  const deleteKey = async (id: string) => {
    await fetch("/api/api-keys", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setKeys(prev => prev.filter(k => k.id !== id));
    setDeleteConfirm(null);
  };

  const copyKey = (id: string, key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const maskKey = (key: string) => key.slice(0, 12) + "••••••••••••••••••••••••••••••••••••";

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Key size={22} className="text-green-500" /> API Keys
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-0.5">
              Manage your API keys for programmatic access.
            </p>
          </div>
          {hasApiAccess && (
            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="btn-primary inline-flex items-center gap-2 px-4 py-2.5 text-sm"
            >
              <Plus size={15} /> New API Key
            </button>
          )}
        </div>
      </motion.div>

      {/* No API access notice */}
      {!hasApiAccess && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card p-8 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <Lock size={24} className="text-[var(--muted-foreground)]" />
          </div>
          <h3 className="font-semibold text-lg mb-2">API Access Requires Pro or Business</h3>
          <p className="text-[var(--muted-foreground)] text-sm mb-5 max-w-xs mx-auto">
            Upgrade your plan to unlock API access, generate keys, and automate your workflow.
          </p>
          <a href="/dashboard/billing" className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm">
            <Key size={15} /> Upgrade Plan
          </a>
        </motion.div>
      )}

      {/* Create form */}
      <AnimatePresence>
        {showCreateForm && hasApiAccess && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <div className="card p-5">
              <h3 className="font-semibold mb-4">Create New API Key</h3>
              {error && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={15} /> {error}
                </div>
              )}
              <form onSubmit={createKey} className="flex gap-3">
                <input
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder="Key name (e.g. My App)"
                  required
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--muted)] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-sm"
                />
                <button type="submit" disabled={creating}
                  className="btn-primary px-5 py-2.5 text-sm disabled:opacity-60 flex items-center gap-2">
                  {creating ? (
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                  ) : <Plus size={15} />}
                  Create
                </button>
                <button type="button" onClick={() => setShowCreateForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-sm hover:bg-[var(--muted)] transition-colors">
                  Cancel
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* API Keys list */}
      {hasApiAccess && (
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15, duration: 0.4 }}>
          {loading ? (
            <div className="space-y-3">
              {[...Array(2)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
            </div>
          ) : keys.length === 0 ? (
            <div className="card p-12 text-center">
              <Key size={28} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
              <p className="font-medium mb-1">No API keys yet</p>
              <p className="text-[var(--muted-foreground)] text-sm mb-4">Create your first API key to start building.</p>
              <button onClick={() => setShowCreateForm(true)} className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
                <Plus size={14} /> Create API Key
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {keys.map((apiKey, i) => (
                <motion.div
                  key={apiKey.id}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.06, duration: 0.3 }}
                  className="card p-5"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-400 to-purple-600 flex items-center justify-center">
                        <Key size={16} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{apiKey.name}</p>
                        <div className="flex items-center gap-3 mt-0.5">
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            apiKey.active
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400"
                          }`}>
                            {apiKey.active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs text-[var(--muted-foreground)] flex items-center gap-1">
                            <Clock size={10} /> Created {formatDate(apiKey.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setDeleteConfirm(apiKey.id)}
                      className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--muted-foreground)] hover:text-red-500 transition-colors flex-shrink-0"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  {/* Key display */}
                  <div className="flex items-center gap-2 mt-2">
                    <code className="flex-1 text-xs bg-[var(--muted)] border border-[var(--card-border)] rounded-xl px-3 py-2.5 font-mono truncate">
                      {revealedId === apiKey.id ? apiKey.key : maskKey(apiKey.key)}
                    </code>
                    <button
                      onClick={() => setRevealedId(revealedId === apiKey.id ? null : apiKey.id)}
                      className="p-2.5 rounded-xl bg-[var(--muted)] hover:bg-[var(--card-border)] text-[var(--muted-foreground)] transition-colors flex-shrink-0"
                      title={revealedId === apiKey.id ? "Hide" : "Reveal"}
                    >
                      {revealedId === apiKey.id ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button
                      onClick={() => copyKey(apiKey.id, apiKey.key)}
                      className={`p-2.5 rounded-xl transition-colors flex-shrink-0 ${
                        copiedId === apiKey.id
                          ? "bg-green-100 dark:bg-green-900/30 text-green-600"
                          : "bg-[var(--muted)] hover:bg-[var(--card-border)] text-[var(--muted-foreground)]"
                      }`}
                      title="Copy key"
                    >
                      {copiedId === apiKey.id ? <Check size={14} /> : <Copy size={14} />}
                    </button>
                  </div>

                  <div className="flex items-center gap-4 mt-3 text-xs text-[var(--muted-foreground)]">
                    <span className="flex items-center gap-1">
                      <Activity size={11} /> {apiKey.requests.toLocaleString()} requests
                    </span>
                    {apiKey.lastUsed && (
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> Last used {formatDate(apiKey.lastUsed)}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* Docs card */}
      {hasApiAccess && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="card p-5 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border-purple-200 dark:border-purple-800/30"
        >
          <h3 className="font-semibold mb-1 text-sm">Quick API Reference</h3>
          <p className="text-xs text-[var(--muted-foreground)] mb-3">Use your API key in the <code className="font-mono bg-[var(--muted)] px-1.5 py-0.5 rounded">x-api-key</code> header.</p>
          <div className="space-y-2">
            {[
              { method: "POST", path: "/api/v1/upload", desc: "Upload an image" },
              { method: "GET", path: "/api/v1/images", desc: "List your images" },
              { method: "DELETE", path: "/api/v1/images", desc: "Delete an image" },
            ].map(ep => (
              <div key={ep.path} className="flex items-center gap-3 text-xs">
                <span className={`px-2 py-0.5 rounded font-bold font-mono flex-shrink-0 ${
                  ep.method === "POST" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                  ep.method === "GET" ? "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400" :
                  "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}>{ep.method}</span>
                <code className="font-mono text-[var(--foreground)]">{ep.path}</code>
                <span className="text-[var(--muted-foreground)]">{ep.desc}</span>
              </div>
            ))}
          </div>
          <a href="/docs" className="text-xs text-purple-600 dark:text-purple-400 hover:underline mt-3 inline-block font-medium">
            View full API documentation →
          </a>
        </motion.div>
      )}

      {/* Delete confirm */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-2">Revoke API Key?</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-6">This key will stop working immediately. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors">
                  Cancel
                </button>
                <button onClick={() => deleteKey(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                  Revoke Key
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
