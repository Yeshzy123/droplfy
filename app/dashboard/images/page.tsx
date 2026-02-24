"use client";

import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Images, Trash2, Eye, EyeOff, Link2, Copy, Search,
  FolderOpen, Plus, Check, X, MoreHorizontal, ExternalLink, Filter
} from "lucide-react";
import { formatBytes, formatDate } from "@/lib/utils";

interface Image {
  id: string;
  url: string;
  originalName: string;
  filename: string;
  size: number;
  isPublic: boolean;
  views: number;
  createdAt: string;
  folderId: string | null;
}

export default function ImagesPage() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkDeleting, setBulkDeleting] = useState(false);

  const fetchImages = useCallback(async (p = 1) => {
    setLoading(true);
    const res = await fetch(`/api/images?page=${p}&limit=20`);
    const data = await res.json();
    setImages(data.images || []);
    setTotalPages(data.pages || 1);
    setTotal(data.total || 0);
    setLoading(false);
  }, []);

  useEffect(() => { fetchImages(page); }, [fetchImages, page]);

  const filtered = images.filter(img =>
    img.originalName.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const selectAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map(i => i.id)));
    }
  };

  const copyUrl = (img: Image) => {
    navigator.clipboard.writeText(`${window.location.origin}${img.url}`);
    setCopiedId(img.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const deleteImage = async (id: string) => {
    await fetch(`/api/images/${id}`, { method: "DELETE" });
    setImages(prev => prev.filter(i => i.id !== id));
    setDeleteConfirm(null);
    setMenuOpen(null);
    setTotal(t => t - 1);
  };

  const bulkDelete = async () => {
    setBulkDeleting(true);
    await fetch("/api/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: Array.from(selected) }),
    });
    setImages(prev => prev.filter(i => !selected.has(i.id)));
    setTotal(t => t - selected.size);
    setSelected(new Set());
    setBulkDeleting(false);
  };

  const togglePublic = async (img: Image) => {
    await fetch(`/api/images/${img.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic: !img.isPublic }),
    });
    setImages(prev => prev.map(i => i.id === img.id ? { ...i, isPublic: !i.isPublic } : i));
    setMenuOpen(null);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Images size={22} className="text-green-500" /> My Images
            </h1>
            <p className="text-[var(--muted-foreground)] text-sm mt-0.5">{total} image{total !== 1 ? "s" : ""} total</p>
          </div>
          <div className="flex items-center gap-2">
            {selected.size > 0 && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={bulkDelete}
                disabled={bulkDeleting}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-500 border border-red-200 dark:border-red-800 text-sm font-medium hover:bg-red-100 transition-colors disabled:opacity-60"
              >
                <Trash2 size={14} />
                {bulkDeleting ? "Deleting..." : `Delete ${selected.size}`}
              </motion.button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Search & Filter bar */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="relative flex-1 min-w-60">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--muted-foreground)]" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search images..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] focus:border-green-400 focus:ring-2 focus:ring-green-400/20 transition-all text-sm"
          />
        </div>
        <button
          onClick={selectAll}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[var(--card-border)] bg-[var(--card)] text-sm font-medium hover:border-green-300 transition-colors"
        >
          <Check size={14} className={selected.size === filtered.length && filtered.length > 0 ? "text-green-500" : "text-[var(--muted-foreground)]"} />
          {selected.size === filtered.length && filtered.length > 0 ? "Deselect All" : "Select All"}
        </button>
      </motion.div>

      {/* Images grid */}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {[...Array(15)].map((_, i) => (
            <div key={i} className="skeleton rounded-2xl aspect-square" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="card p-16 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[var(--muted)] flex items-center justify-center mx-auto mb-4">
            <Images size={28} className="text-[var(--muted-foreground)]" />
          </div>
          <p className="font-semibold text-lg mb-2">{search ? "No results found" : "No images yet"}</p>
          <p className="text-[var(--muted-foreground)] text-sm mb-4">
            {search ? "Try a different search term" : "Upload your first image to get started"}
          </p>
          {!search && (
            <a href="/dashboard/upload" className="btn-primary inline-flex items-center gap-2 px-5 py-2.5 text-sm">
              <Plus size={14} /> Upload Images
            </a>
          )}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        >
          {filtered.map((img, i) => (
            <motion.div
              key={img.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.03, duration: 0.3 }}
              className={`group relative rounded-2xl overflow-hidden bg-[var(--muted)] aspect-square cursor-pointer border-2 transition-all duration-150 ${
                selected.has(img.id) ? "border-green-400 ring-2 ring-green-400/30" : "border-transparent hover:border-green-200"
              }`}
              onClick={() => toggleSelect(img.id)}
            >
              <img src={img.url} alt={img.originalName} className="w-full h-full object-cover" loading="lazy" />

              {/* Selection check */}
              <div className={`absolute top-2 left-2 w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                selected.has(img.id) ? "bg-green-500 opacity-100" : "bg-black/40 opacity-0 group-hover:opacity-100"
              }`}>
                <Check size={12} className="text-white" />
              </div>

              {/* Private badge */}
              {!img.isPublic && (
                <div className="absolute top-2 right-2 bg-black/60 text-white text-xs px-2 py-0.5 rounded-lg flex items-center gap-1">
                  <EyeOff size={10} /> Private
                </div>
              )}

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex flex-col items-center justify-end pb-3 opacity-0 group-hover:opacity-100">
                <p className="text-white text-xs font-medium px-2 text-center truncate w-full px-2 mb-2">{img.originalName}</p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={e => { e.stopPropagation(); copyUrl(img); }}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Copy URL"
                  >
                    {copiedId === img.id ? <Check size={13} /> : <Copy size={13} />}
                  </button>
                  <a
                    href={img.url} target="_blank" rel="noreferrer"
                    onClick={e => e.stopPropagation()}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                    title="Open"
                  >
                    <ExternalLink size={13} />
                  </a>
                  <button
                    onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === img.id ? null : img.id); }}
                    className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors"
                  >
                    <MoreHorizontal size={13} />
                  </button>
                </div>
              </div>

              {/* Dropdown menu */}
              <AnimatePresence>
                {menuOpen === img.id && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="absolute bottom-12 right-2 bg-[var(--card)] border border-[var(--card-border)] rounded-xl shadow-lg z-10 overflow-hidden w-40"
                    onClick={e => e.stopPropagation()}
                  >
                    <button onClick={() => togglePublic(img)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-[var(--muted)] transition-colors">
                      {img.isPublic ? <EyeOff size={12} /> : <Eye size={12} />}
                      {img.isPublic ? "Make Private" : "Make Public"}
                    </button>
                    <button onClick={() => copyUrl(img)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs hover:bg-[var(--muted)] transition-colors">
                      <Link2 size={12} /> Copy URL
                    </button>
                    <div className="h-px bg-[var(--card-border)]" />
                    <button
                      onClick={() => setDeleteConfirm(img.id)}
                      className="w-full flex items-center gap-2 px-3 py-2.5 text-xs text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                      <Trash2 size={12} /> Delete
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-4">
          <button disabled={page === 1} onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm font-medium disabled:opacity-40 hover:border-green-300 transition-colors">
            Previous
          </button>
          <span className="text-sm text-[var(--muted-foreground)] px-3">
            Page {page} of {totalPages}
          </span>
          <button disabled={page === totalPages} onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 rounded-xl border border-[var(--card-border)] text-sm font-medium disabled:opacity-40 hover:border-green-300 transition-colors">
            Next
          </button>
        </div>
      )}

      {/* Delete confirm modal */}
      <AnimatePresence>
        {deleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setDeleteConfirm(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="card p-6 max-w-sm w-full"
              onClick={e => e.stopPropagation()}
            >
              <h3 className="font-bold text-lg mb-2">Delete Image?</h3>
              <p className="text-[var(--muted-foreground)] text-sm mb-6">This action cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setDeleteConfirm(null)}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[var(--card-border)] text-sm font-medium hover:bg-[var(--muted)] transition-colors">
                  Cancel
                </button>
                <button onClick={() => deleteImage(deleteConfirm)}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors">
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
