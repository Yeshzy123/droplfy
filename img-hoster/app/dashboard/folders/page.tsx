"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FolderOpen, Plus, Trash2, X, Folder, Images, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Folder {
  id: string;
  name: string;
  createdAt: string;
  _count: { images: number };
}

export default function FoldersPage() {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [newName, setNewName] = useState("");
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/folders").then(r => r.json()).then(data => {
      setFolders(Array.isArray(data) ? data : []);
      setLoading(false);
    });
  }, []);

  const createFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setCreating(true);
    setError("");
    const res = await fetch("/api/folders", {
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
    setFolders(prev => [{ ...data, _count: { images: 0 } }, ...prev]);
    setNewName("");
    setCreating(false);
  };

  const deleteFolder = async (id: string) => {
    await fetch("/api/folders", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setFolders(prev => prev.filter(f => f.id !== id));
    setDeleteConfirm(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <FolderOpen size={22} className="text-green-500" /> Folders
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Organize your images into folders.</p>
      </motion.div>

      {/* Create folder */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-5">
        <h3 className="font-semibold mb-4 text-sm">Create New Folder</h3>
        {error && (
          <div className="mb-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2 text-red-600 text-sm">
            <AlertCircle size={14} /> {error}
          </div>
        )}
        <form onSubmit={createFolder} className="flex gap-3">
          <input
            value={newName}
            onChange={e => setNewName(e.target.value)}
            placeholder="Folder name..."
            required
            className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--muted)] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-sm"
          />
          <button type="submit" disabled={creating}
            className="btn-primary px-5 py-2.5 text-sm inline-flex items-center gap-2 disabled:opacity-60">
            {creating ? (
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
              </svg>
            ) : <Plus size={15} />}
            Create
          </button>
        </form>
      </motion.div>

      {/* Folders grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
        </div>
      ) : folders.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-14 h-14 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <Folder size={26} className="text-[var(--muted-foreground)]" />
          </div>
          <p className="font-semibold mb-1">No folders yet</p>
          <p className="text-[var(--muted-foreground)] text-sm">Create a folder to organize your images.</p>
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.15 }}
          className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {folders.map((folder, i) => (
            <motion.div
              key={folder.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="card p-5 group flex flex-col gap-3 relative"
            >
              <div className="flex items-start justify-between">
                <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-amber-300 to-amber-500 flex items-center justify-center shadow-md">
                  <Folder size={20} className="text-white" />
                </div>
                <button
                  onClick={() => setDeleteConfirm(folder.id)}
                  className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--muted-foreground)] hover:text-red-500 transition-all"
                >
                  <Trash2 size={14} />
                </button>
              </div>
              <div>
                <p className="font-semibold text-sm truncate">{folder.name}</p>
                <div className="flex items-center gap-3 mt-1 text-xs text-[var(--muted-foreground)]">
                  <span className="flex items-center gap-1"><Images size={11} /> {folder._count.images} images</span>
                  <span>{formatDate(folder.createdAt)}</span>
                </div>
              </div>
            </motion.div>
          ))}
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
              initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
              className="card p-6 max-w-sm w-full" onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-2">Delete Folder?</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-6">Images inside will not be deleted — only the folder will be removed.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors">Cancel</button>
                <button onClick={() => deleteFolder(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">Delete</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
