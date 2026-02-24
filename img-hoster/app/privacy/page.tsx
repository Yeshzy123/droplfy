import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 pt-24 pb-16 px-4">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold mb-2">Privacy Policy</h1>
          <p className="text-[var(--muted-foreground)] mb-8 text-sm">Last updated: January 1, 2025</p>
          <div className="space-y-6 text-sm text-[var(--muted-foreground)] leading-relaxed">
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">1. Data We Collect</h2><p>We collect your email address, name, and uploaded images. We also collect usage data like bandwidth and storage usage to manage your plan.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">2. How We Use Your Data</h2><p>Your data is used to provide the service, process payments via Stripe, and send account-related emails. We do not sell your data.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">3. Data Storage</h2><p>Images are stored on our servers. You can delete your images and account at any time from your dashboard.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">4. Third Parties</h2><p>We use Stripe for payments and Google for OAuth authentication. These services have their own privacy policies.</p></section>
            <section><h2 className="text-lg font-semibold text-[var(--foreground)] mb-2">5. Contact</h2><p>Questions? Email <a href="mailto:privacy@imghoster.com" className="text-green-500">privacy@imghoster.com</a></p></section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
