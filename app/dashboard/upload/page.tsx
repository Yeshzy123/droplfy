"use client";

import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDropzone } from "react-dropzone";
import {
  Upload, X, CheckCircle2, Copy, ExternalLink, AlertCircle,
  FileImage, Link2, Code, Hash, ChevronDown, Loader2
} from "lucide-react";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  progress: number;
  result?: {
    id: string;
    url: string;
    directUrl: string;
    htmlEmbed: string;
    markdownEmbed: string;
    bbcodeEmbed: string;
  };
  error?: string;
  preview?: string;
}

function CopyField({ label, value, icon: Icon }: { label: string; value: string; icon: any }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-[var(--muted-foreground)] font-medium">
        <Icon size={12} /> {label}
      </div>
      <div className="flex items-center gap-2">
        <input readOnly value={value}
          className="flex-1 text-xs bg-[var(--muted)] border border-[var(--card-border)] rounded-lg px-3 py-2 font-mono truncate" />
        <button onClick={copy}
          className={`flex-shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-all ${
            copied ? "bg-green-100 text-green-600 dark:bg-green-900/30" : "bg-[var(--muted)] hover:bg-[var(--card-border)] text-[var(--muted-foreground)]"
          }`}>
          {copied ? "Copied!" : <Copy size={12} />}
        </button>
      </div>
    </div>
  );
}

export default function UploadPage() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);

  const uploadFile = async (file: File, id: string, preview: string) => {
    setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "uploading", progress: 10 } : f));

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error", error: data.error, progress: 0 } : f));
        return;
      }

      setFiles(prev => prev.map(f => f.id === id ? {
        ...f, status: "done", progress: 100,
        result: {
          id: data.id,
          url: data.url,
          directUrl: data.directUrl,
          htmlEmbed: data.htmlEmbed,
          markdownEmbed: data.markdownEmbed,
          bbcodeEmbed: data.bbcodeEmbed,
        }
      } : f));
      setExpanded(id);
    } catch {
      setFiles(prev => prev.map(f => f.id === id ? { ...f, status: "error", error: "Upload failed", progress: 0 } : f));
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => {
      const id = `${Date.now()}-${Math.random()}`;
      const preview = URL.createObjectURL(file);
      return { id, name: file.name, size: file.size, status: "uploading", progress: 0, preview };
    });
    setFiles(prev => [...newFiles, ...prev]);
    newFiles.forEach(f => {
      const file = acceptedFiles.find(af => af.name === f.name)!;
      uploadFile(file, f.id, f.preview!);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif", ".webp", ".svg", ".bmp"] },
    multiple: true,
  });

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (expanded === id) setExpanded(null);
  };

  const formatBytes = (b: number) => {
    if (b < 1024) return b + " B";
    if (b < 1048576) return (b / 1024).toFixed(1) + " KB";
    return (b / 1048576).toFixed(1) + " MB";
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="text-2xl font-bold">Upload Images</h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Drag & drop or click to upload. Bulk upload supported.</p>
      </motion.div>

      {/* Drop zone */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }}>
      <div
        {...getRootProps()}
        className={`relative rounded-2xl border-2 border-dashed p-12 text-center cursor-pointer transition-all duration-200 ${
          isDragActive
            ? "border-green-400 bg-green-50 dark:bg-green-900/20 scale-[1.01]"
            : "border-[var(--card-border)] hover:border-green-300 hover:bg-[var(--muted)] bg-[var(--card)]"
        }`}
      >
        <input {...getInputProps()} />
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-all ${
          isDragActive ? "bg-green-100 dark:bg-green-900/30 scale-110" : "bg-[var(--muted)]"
        }`}>
          <Upload size={28} className={isDragActive ? "text-green-500" : "text-[var(--muted-foreground)]"} />
        </div>
        <p className="text-base font-semibold mb-1">
          {isDragActive ? "Drop images here!" : "Drag & drop images here"}
        </p>
        <p className="text-sm text-[var(--muted-foreground)] mb-4">
          or click to browse · JPG, PNG, GIF, WebP, SVG, BMP
        </p>
        <button className="btn-primary inline-flex items-center gap-2 px-6 py-2.5 text-sm pointer-events-none">
          <FileImage size={15} /> Browse Files
        </button>
        <p className="text-xs text-[var(--muted-foreground)] mt-3">Max file size depends on your plan</p>
      </div>
      </motion.div>

      {/* File list */}
      <AnimatePresence>
        {files.map((file, i) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, x: 20, height: 0 }}
            transition={{ duration: 0.3 }}
            className="card overflow-hidden"
          >
            {/* File row */}
            <div className="p-4 flex items-center gap-4">
              {/* Thumbnail */}
              <div className="w-14 h-14 rounded-xl overflow-hidden bg-[var(--muted)] flex-shrink-0">
                {file.preview ? (
                  <img src={file.preview} alt={file.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <FileImage size={20} className="text-[var(--muted-foreground)]" />
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{file.name}</p>
                <p className="text-xs text-[var(--muted-foreground)]">{formatBytes(file.size)}</p>

                {file.status === "uploading" && (
                  <div className="mt-2 h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: "0%" }}
                      animate={{ width: "85%" }}
                      transition={{ duration: 2, ease: "easeOut" }}
                      className="h-full bg-gradient-to-r from-green-400 to-green-500 rounded-full"
                    />
                  </div>
                )}

                {file.status === "done" && (
                  <p className="text-xs text-green-500 mt-1 flex items-center gap-1">
                    <CheckCircle2 size={11} /> Upload complete
                  </p>
                )}

                {file.status === "error" && (
                  <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={11} /> {file.error}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 flex-shrink-0">
                {file.status === "uploading" && (
                  <Loader2 size={18} className="text-green-500 animate-spin" />
                )}
                {file.status === "done" && (
                  <>
                    <a href={file.result?.url} target="_blank" rel="noreferrer"
                      className="p-2 rounded-xl hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)] hover:text-green-500">
                      <ExternalLink size={15} />
                    </a>
                    <button
                      onClick={() => setExpanded(expanded === file.id ? null : file.id)}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-green-50 dark:bg-green-900/20 text-green-600 text-xs font-medium hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      Links <ChevronDown size={12} className={`transition-transform ${expanded === file.id ? "rotate-180" : ""}`} />
                    </button>
                  </>
                )}
                <button onClick={() => removeFile(file.id)}
                  className="p-2 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 text-[var(--muted-foreground)] hover:text-red-500 transition-colors">
                  <X size={15} />
                </button>
              </div>
            </div>

            {/* Expanded embed links */}
            <AnimatePresence>
              {expanded === file.id && file.result && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-[var(--card-border)] p-4 bg-[var(--muted)]/50 overflow-hidden"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <CopyField label="Direct URL" value={file.result.directUrl} icon={Link2} />
                    <CopyField label="HTML Embed" value={file.result.htmlEmbed} icon={Code} />
                    <CopyField label="Markdown" value={file.result.markdownEmbed} icon={Hash} />
                    <CopyField label="BBCode" value={file.result.bbcodeEmbed} icon={Code} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
