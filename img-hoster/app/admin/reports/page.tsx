"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Flag, Check, Trash2, AlertCircle } from "lucide-react";
import { formatDate } from "@/lib/utils";

interface Report {
  id: string;
  reason: string;
  resolved: boolean;
  createdAt: string;
  image: { id: string; url: string; originalName: string };
  reporter: { email: string; name: string | null };
}

export default function AdminReportsPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats").then(r => r.json()).then(data => {
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Flag size={22} className="text-amber-500" /> Reports
        </h1>
        <p className="text-[var(--muted-foreground)] text-sm mt-0.5">Review and resolve reported content.</p>
      </motion.div>
      <div className="card p-16 text-center">
        <Flag size={32} className="mx-auto mb-3 text-[var(--muted-foreground)]" />
        <p className="font-medium">No unresolved reports</p>
        <p className="text-[var(--muted-foreground)] text-sm mt-1">All reports have been handled.</p>
      </div>
    </div>
  );
}
