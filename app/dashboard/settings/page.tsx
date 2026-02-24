"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import {
  Settings, User, Lock, Save, CheckCircle2, AlertCircle,
  Shield, Trash2
} from "lucide-react";

export default function SettingsPage() {
  const { data: session } = useSession();
  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileMsg, setProfileMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (session?.user?.name) setName(session.user.name);
  }, [session]);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    const res = await fetch("/api/user/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    setSavingProfile(false);
    if (res.ok) {
      setProfileMsg({ type: "success", text: "Profile updated successfully" });
    } else {
      setProfileMsg({ type: "error", text: "Failed to update profile" });
    }
    setTimeout(() => setProfileMsg(null), 3000);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Settings size={22} className="text-green-500" /> Settings
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Manage your account settings and preferences.</p>
      </motion.div>

      {/* Profile */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <User size={17} className="text-green-500" />
          <h3 className="font-semibold">Profile Information</h3>
        </div>

        {profileMsg && (
          <div className={`mb-4 p-3 rounded-xl flex items-center gap-2 text-sm border ${
            profileMsg.type === "success"
              ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400"
              : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-600 dark:text-red-400"
          }`}>
            {profileMsg.type === "success" ? <CheckCircle2 size={15} /> : <AlertCircle size={15} />}
            {profileMsg.text}
          </div>
        )}

        <form onSubmit={saveProfile} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Display Name</label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your name"
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--muted)] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Email Address</label>
            <input
              value={session?.user?.email || ""}
              disabled
              className="w-full px-4 py-3 rounded-xl border border-[var(--card-border)] bg-[var(--muted)] text-sm opacity-60 cursor-not-allowed"
            />
            <p className="text-xs text-[var(--muted-foreground)] mt-1">Email cannot be changed here.</p>
          </div>
          <button
            type="submit"
            disabled={savingProfile}
            className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60"
          >
            {savingProfile ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <Save size={14} />}
            {savingProfile ? "Saving..." : "Save Changes"}
          </button>
        </form>
      </motion.div>

      {/* Security */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="card p-6"
      >
        <div className="flex items-center gap-2 mb-5">
          <Shield size={17} className="text-green-500" />
          <h3 className="font-semibold">Security</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)] border border-[var(--card-border)]">
            <div>
              <p className="text-sm font-medium">Two-Factor Authentication</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Add an extra layer of security to your account</p>
            </div>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 font-medium">
              Coming Soon
            </span>
          </div>
          <div className="flex items-center justify-between p-4 rounded-xl bg-[var(--muted)] border border-[var(--card-border)]">
            <div>
              <p className="text-sm font-medium">Change Password</p>
              <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Update your account password</p>
            </div>
            <button className="text-xs px-3 py-2 rounded-xl border border-[var(--card-border)] hover:border-green-300 hover:bg-[var(--card)] transition-colors font-medium flex items-center gap-1.5">
              <Lock size={12} /> Change
            </button>
          </div>
        </div>
      </motion.div>

      {/* Danger zone */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="card p-6 border-red-200 dark:border-red-900/50"
      >
        <div className="flex items-center gap-2 mb-5">
          <AlertCircle size={17} className="text-red-500" />
          <h3 className="font-semibold text-red-600 dark:text-red-400">Danger Zone</h3>
        </div>
        <div className="flex items-center justify-between p-4 rounded-xl bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/50">
          <div>
            <p className="text-sm font-medium">Delete Account</p>
            <p className="text-xs text-[var(--muted-foreground)] mt-0.5">Permanently delete your account and all data. This cannot be undone.</p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors flex-shrink-0 ml-4">
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}
