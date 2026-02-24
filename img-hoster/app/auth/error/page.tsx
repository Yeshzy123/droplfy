"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Zap } from "lucide-react";
import { Suspense } from "react";

function AuthErrorContent() {
  const params = useSearchParams();
  const error = params.get("error");

  const messages: Record<string, string> = {
    OAuthAccountNotLinked: "This email is already linked to a different sign-in method.",
    OAuthSignin: "Error starting the OAuth sign-in. Please try again.",
    OAuthCallback: "Error during OAuth callback. Please try again.",
    SessionRequired: "You must be signed in to access this page.",
    Default: "An authentication error occurred. Please try again.",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <div className="card p-10 max-w-md w-full text-center">
        <div className="w-14 h-14 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
          <AlertCircle size={28} className="text-red-500" />
        </div>
        <h1 className="text-xl font-bold mb-2">Authentication Error</h1>
        <p className="text-[var(--muted-foreground)] text-sm mb-6">
          {messages[error || "Default"] || messages.Default}
        </p>
        <div className="flex flex-col gap-3">
          <Link href="/auth/login" className="btn-primary py-3 text-sm">Try Again</Link>
          <Link href="/" className="text-sm text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors">
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense>
      <AuthErrorContent />
    </Suspense>
  );
}
