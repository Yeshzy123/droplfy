"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Code, Copy, Check, Key, Upload, Images, Trash2, BookOpen, Zap } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

function CodeBlock({ code, lang = "bash" }: { code: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group rounded-xl bg-gray-900 dark:bg-black border border-gray-700 dark:border-gray-800 overflow-hidden my-3">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 dark:bg-gray-900 border-b border-gray-700">
        <span className="text-xs text-gray-400 font-mono">{lang}</span>
        <button onClick={copy}
          className={`text-xs flex items-center gap-1.5 px-2 py-1 rounded transition-colors ${copied ? "text-green-400" : "text-gray-400 hover:text-white"}`}>
          {copied ? <Check size={12} /> : <Copy size={12} />}
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre className="p-4 text-sm text-gray-100 overflow-x-auto font-mono leading-relaxed"><code>{code}</code></pre>
    </div>
  );
}

const sections = [
  { id: "auth", label: "Authentication" },
  { id: "upload", label: "Upload Image" },
  { id: "list", label: "List Images" },
  { id: "delete", label: "Delete Image" },
  { id: "errors", label: "Error Codes" },
];

export default function DocsPage() {
  const [active, setActive] = useState("auth");

  return (
    <div className="min-h-screen flex flex-col bg-[var(--background)]">
      <Navbar />
      <main className="flex-1 pt-20">
        <div className="max-w-6xl mx-auto px-4 py-8 flex gap-8">

          {/* Sidebar */}
          <aside className="hidden md:block w-56 flex-shrink-0 sticky top-24 self-start">
            <div className="flex items-center gap-2 mb-4 px-3">
              <BookOpen size={16} className="text-green-500" />
              <span className="font-semibold text-sm">API Reference</span>
            </div>
            <nav className="space-y-0.5">
              {sections.map(s => (
                <button key={s.id} onClick={() => setActive(s.id)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                    active === s.id
                      ? "bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 font-medium"
                      : "text-[var(--muted-foreground)] hover:bg-[var(--muted)]"
                  }`}>
                  {s.label}
                </button>
              ))}
            </nav>
            <div className="mt-6 p-3 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
              <p className="text-xs text-green-700 dark:text-green-400 font-medium mb-1">Base URL</p>
              <code className="text-xs font-mono text-green-600 dark:text-green-500">https://imghoster.com/api/v1</code>
            </div>
          </aside>

          {/* Content */}
          <div className="flex-1 min-w-0 space-y-10">
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                  <Zap size={18} className="text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">API Documentation</h1>
                  <p className="text-sm text-[var(--muted-foreground)]">REST API for programmatic image management</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                <span className="text-xs px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 font-medium">v1.0</span>
                <span className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 font-medium">REST</span>
                <span className="text-xs px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 font-medium">JSON</span>
              </div>
            </motion.div>

            {/* Authentication */}
            <section id="auth">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Key size={18} className="text-green-500" /> Authentication</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4 leading-relaxed">
                All API requests require an API key. Include it in the <code className="font-mono bg-[var(--muted)] px-1.5 py-0.5 rounded text-xs">x-api-key</code> request header.
                API keys can be generated from your <a href="/dashboard/api-keys" className="text-green-500 hover:underline">dashboard</a>.
                API access requires a <strong>Pro</strong> or <strong>Business</strong> plan.
              </p>
              <div className="card p-4 border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/10 mb-4">
                <p className="text-xs text-amber-700 dark:text-amber-400">
                  <strong>Rate Limits:</strong> 60 requests per minute per API key. Exceeding this returns a <code>429</code> status.
                </p>
              </div>
              <CodeBlock lang="bash" code={`curl -X GET https://imghoster.com/api/v1/images \\
  -H "x-api-key: ihk_YOUR_API_KEY_HERE"`} />
            </section>

            {/* Upload */}
            <section id="upload">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Upload size={18} className="text-green-500" /> Upload Image</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">Upload an image file. Returns the image URL and embed codes.</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">POST</span>
                <code className="text-sm font-mono">/api/v1/upload</code>
              </div>
              <h4 className="text-sm font-semibold mb-2">Request (multipart/form-data)</h4>
              <div className="card overflow-hidden mb-3">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--muted)] border-b border-[var(--card-border)]">
                    <tr>
                      <th className="text-left py-2 px-4 font-semibold">Field</th>
                      <th className="text-left py-2 px-4 font-semibold">Type</th>
                      <th className="text-left py-2 px-4 font-semibold">Required</th>
                      <th className="text-left py-2 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr><td className="py-2 px-4 font-mono">file</td><td className="py-2 px-4">File</td><td className="py-2 px-4 text-green-600">Yes</td><td className="py-2 px-4 text-[var(--muted-foreground)]">Image file to upload</td></tr>
                  </tbody>
                </table>
              </div>
              <h4 className="text-sm font-semibold mb-2">Example</h4>
              <CodeBlock lang="bash" code={`curl -X POST https://imghoster.com/api/v1/upload \\
  -H "x-api-key: ihk_YOUR_API_KEY" \\
  -F "file=@/path/to/image.jpg"`} />
              <h4 className="text-sm font-semibold mb-2 mt-4">Response</h4>
              <CodeBlock lang="json" code={`{
  "success": true,
  "data": {
    "id": "clxyz123abc",
    "url": "https://imghoster.com/uploads/uuid.jpg",
    "directUrl": "https://imghoster.com/uploads/uuid.jpg",
    "htmlEmbed": "<img src=\\"https://imghoster.com/uploads/uuid.jpg\\" alt=\\"image.jpg\\" />",
    "markdownEmbed": "![image.jpg](https://imghoster.com/uploads/uuid.jpg)",
    "bbcodeEmbed": "[img]https://imghoster.com/uploads/uuid.jpg[/img]",
    "size": 204800,
    "filename": "uuid.jpg",
    "createdAt": "2025-01-15T10:30:00.000Z"
  }
}`} />
            </section>

            {/* List */}
            <section id="list">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Images size={18} className="text-green-500" /> List Images</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">Retrieve a paginated list of your uploaded images.</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold font-mono bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded">GET</span>
                <code className="text-sm font-mono">/api/v1/images</code>
              </div>
              <h4 className="text-sm font-semibold mb-2">Query Parameters</h4>
              <div className="card overflow-hidden mb-3">
                <table className="w-full text-xs">
                  <thead className="bg-[var(--muted)] border-b border-[var(--card-border)]">
                    <tr>
                      <th className="text-left py-2 px-4 font-semibold">Param</th>
                      <th className="text-left py-2 px-4 font-semibold">Default</th>
                      <th className="text-left py-2 px-4 font-semibold">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-[var(--card-border)]"><td className="py-2 px-4 font-mono">page</td><td className="py-2 px-4">1</td><td className="py-2 px-4 text-[var(--muted-foreground)]">Page number</td></tr>
                    <tr><td className="py-2 px-4 font-mono">limit</td><td className="py-2 px-4">20</td><td className="py-2 px-4 text-[var(--muted-foreground)]">Results per page (max 100)</td></tr>
                  </tbody>
                </table>
              </div>
              <CodeBlock lang="bash" code={`curl -X GET "https://imghoster.com/api/v1/images?page=1&limit=10" \\
  -H "x-api-key: ihk_YOUR_API_KEY"`} />
            </section>

            {/* Delete */}
            <section id="delete">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Trash2 size={18} className="text-red-500" /> Delete Image</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">Permanently delete an image by its ID.</p>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold font-mono bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-2 py-0.5 rounded">DELETE</span>
                <code className="text-sm font-mono">/api/v1/images</code>
              </div>
              <CodeBlock lang="bash" code={`curl -X DELETE https://imghoster.com/api/v1/images \\
  -H "x-api-key: ihk_YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"id": "clxyz123abc"}'`} />
              <CodeBlock lang="json" code={`{
  "success": true,
  "message": "Image deleted"
}`} />
            </section>

            {/* Errors */}
            <section id="errors">
              <h2 className="text-xl font-bold mb-1 flex items-center gap-2"><Code size={18} className="text-orange-500" /> Error Codes</h2>
              <p className="text-sm text-[var(--muted-foreground)] mb-4">Standard HTTP status codes are used throughout the API.</p>
              <div className="card overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-[var(--muted)] border-b border-[var(--card-border)]">
                    <tr>
                      <th className="text-left py-3 px-4 font-semibold text-xs">Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-xs">Meaning</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ["200", "OK – Request successful"],
                      ["201", "Created – Resource created"],
                      ["400", "Bad Request – Invalid parameters"],
                      ["401", "Unauthorized – Invalid or missing API key"],
                      ["403", "Forbidden – Account banned or insufficient plan"],
                      ["404", "Not Found – Resource not found"],
                      ["429", "Too Many Requests – Rate limit exceeded"],
                      ["500", "Internal Server Error – Contact support"],
                    ].map(([code, meaning]) => (
                      <tr key={code} className="border-b border-[var(--card-border)] last:border-0 hover:bg-[var(--muted)] transition-colors">
                        <td className="py-3 px-4">
                          <code className={`text-xs font-bold font-mono px-2 py-0.5 rounded ${
                            code.startsWith("2") ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" :
                            code.startsWith("4") ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400" :
                            "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400"
                          }`}>{code}</code>
                        </td>
                        <td className="py-3 px-4 text-sm text-[var(--muted-foreground)]">{meaning}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
