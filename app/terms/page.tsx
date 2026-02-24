import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto prose prose-sm dark:prose-invert">
          <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
          <p className="text-[var(--muted-foreground)] mb-8">Last updated: January 1, 2025</p>
          <div className="space-y-6 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">1. Acceptance of Terms</h2><p>By using ImgHoster, you agree to these Terms of Service. If you do not agree, do not use our service.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">2. Acceptable Use</h2><p>You may not upload illegal content, malware, or content that violates third-party rights. We reserve the right to remove any content and terminate accounts that violate these terms.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">3. Storage & Bandwidth</h2><p>Storage and bandwidth limits apply per plan. Exceeding limits may result in upload restrictions until your plan is upgraded.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">4. Payment & Refunds</h2><p>Paid plans are billed monthly or annually. We offer a 14-day money-back guarantee for new subscribers. Cancellations take effect at period end.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">5. Limitation of Liability</h2><p>ImgHoster is provided "as is." We are not liable for data loss or service interruptions beyond our reasonable control.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">6. Contact</h2><p>Questions? Email <a href="mailto:legal@imghoster.com" className="text-green-500">legal@imghoster.com</a></p></section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
