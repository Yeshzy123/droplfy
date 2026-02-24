"use client";

import Link from "next/link";
import { Zap, Github, Twitter, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-[var(--card-border)] bg-[var(--card)] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent">
                ImgHoster
              </span>
            </Link>
            <p className="text-sm text-[var(--muted-foreground)] max-w-xs leading-relaxed">
              The fastest, most secure image hosting platform. Upload, share, and manage images with ease.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <a href="#" className="w-8 h-8 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                <Github size={15} />
              </a>
              <a href="#" className="w-8 h-8 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                <Twitter size={15} />
              </a>
              <a href="mailto:hello@imghoster.com" className="w-8 h-8 rounded-xl bg-[var(--muted)] flex items-center justify-center text-[var(--muted-foreground)] hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                <Mail size={15} />
              </a>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Product</h4>
            <div className="flex flex-col gap-2">
              <Link href="/pricing" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Pricing</Link>
              <Link href="/docs" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">API Docs</Link>
              <Link href="/dashboard" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Dashboard</Link>
              <Link href="/dashboard/upload" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Upload</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-3">Legal</h4>
            <div className="flex flex-col gap-2">
              <Link href="/terms" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Terms of Service</Link>
              <Link href="/privacy" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Privacy Policy</Link>
              <Link href="/dmca" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">DMCA</Link>
              <a href="mailto:abuse@imghoster.com" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--primary)] transition-colors">Report Abuse</a>
            </div>
          </div>
        </div>

        <div className="border-t border-[var(--card-border)] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-[var(--muted-foreground)]">
            © {new Date().getFullYear()} ImgHoster. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-[var(--muted-foreground)]">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            All systems operational
          </div>
        </div>
      </div>
    </footer>
  );
}
