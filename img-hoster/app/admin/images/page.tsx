"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { Images, Flag, Trash2, Search, Check, Eye, EyeOff, AlertCircle } from "lucide-react";
import { formatDate, formatBytes } from "@/lib/utils";

interface AdminImage {
  id: string;
  url: string;
  originalName: string;
  size: number;
  flagged: boolean;
  createdAt: string;
  user: { email: string; name: string | null };
  _count: { reports: number };
}

export default function AdminImagesPage() {
  const [images, setImages] = useState<AdminImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFlagged, setShowFlagged] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actingId, setActingId] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/images?page=${page}&flagged=${showFlagged}`);
    const data = await res.json();
    setImages(data.images || []);
    setTotalPages(data.pages || 1);
    setLoading(false);
  }, [page, showFlagged]);

  useEffect(() => { fetchImages(); }, [fetchImages]);

  const toggleFlag = async (id: string, flagged: boolean) => {
    setActingId(id);
    await fetch("/api/admin/images", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, flagged }),
    });
    setImages(prev => prev.map(img => img.id === id ? { ...img, flagged } : img));
    setActingId(null);
  };

  const deleteImage = async (id: string) => {
    setActingId(id);
    await fetch("/api/admin/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setImages(prev => prev.filter(img => img.id !== id));
    setActingId(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Images size={22} className="text-green-500" /> Image Moderation
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Review, flag, and remove images platform-wide.</p>
      </motion.div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => { setShowFlagged(false); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border ${!showFlagged ? "border-green-400 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400" : "border-[var(--card-border)] text-[var(--muted-foreground)]"}`}
        >
          All Images
        </button>
        <button
          onClick={() => { setShowFlagged(true); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition-all border flex items-center gap-2 ${showFlagged ? "border-red-400 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" : "border-[var(--card-border)] text-[var(--muted-foreground)]"}`}
        >
          <Flag size={13} /> Flagged Only
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(10)].map((_, i) => <div key={i} className="skeleton rounded-2xl aspect-square" />)}
        </div>
      ) : images.length === 0 ? (
        <div className="card p-16 text-center">
          <Images size={32} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
          <p className="font-medium">No {showFlagged ? "flagged " : ""}images found</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03 }}
              className={`relative group rounded-2xl overflow-hidden aspect-square bg-[var(--muted)] ${img.flagged ? "ring-2 ring-red-400" : ""}`}
            >
              <img src={img.url} alt={img.originalName} className="w-full h-full object-cover" loading="lazy" />

              {img.flagged && (
                <div className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <Flag size={9} /> Flagged
                </div>
              )}
              {img._count.reports > 0 && (
                <div className="absolute top-2 right-2 bg-amber-500 text-white text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <AlertCircle size={9} /> {img._count.reports}
                </div>
              )}

              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-200 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs text-center px-2 truncate w-full">{img.user.email}</p>
                <p className="text-white/70 text-xs">{formatBytes(img.size)}</p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => toggleFlag(img.id, !img.flagged)}
                    disabled={actingId === img.id}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition-colors ${
                      img.flagged ? "bg-green-500 text-white" : "bg-amber-500 text-white"
                    } disabled:opacity-50`}
                  >
                    {img.flagged ? <><Check size={10} /> Unflag</> : <><Flag size={10} /> Flag</>}
                  </button>
                  <button
                    onClick={() => deleteImage(img.id)}
                    disabled={actingId === img.id}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-red-500 text-white flex items-center gap-1 disabled:opacity-50"
                  >
                    <Trash2 size={10} /> Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm disabled:opacity-40 hover:border-green-300 transition-colors">
            Previous
          </button>
          <span className="text-sm text-[var(--muted-foreground)]">Page {page} of {totalPages}</span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm disabled:opacity-40 hover:border-green-300 transition-colors">
            Next
          </button>
        </div>
      )}
    </div>
  );
}
