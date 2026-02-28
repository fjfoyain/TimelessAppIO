"use client";

import LegalLayout from "@/components/legal/LegalLayout";

export default function TermsPage() {
  return (
    <LegalLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
            <span className="material-icons text-primary text-sm">history</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">
              Current Version
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-sm">
            Last updated: February 27, 2026
          </p>
        </div>

        {/* Content */}
        <article className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                1
              </span>
              Acceptance of Terms
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              Welcome to Timeless. By accessing or using our website, services, applications, and
              tools (collectively, the &quot;Services&quot;), you agree to comply with and be bound by these
              Terms of Service. If you do not agree to these terms, please do not use our Services.
            </p>
            <p className="text-slate-300 leading-7 mb-4">
              We reserve the right to update or modify these terms at any time without prior notice.
              Your continued use of the Services after any changes indicates your acceptance of the
              new Terms.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-primary">
              <li>You must be at least 13 years old to use our Services.</li>
              <li>
                You are responsible for maintaining the security of your account credentials.
              </li>
              <li>
                You agree not to use the Services for any illegal or unauthorized purpose.
              </li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                2
              </span>
              User Accounts
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              When you create an account with us, you must provide information that is accurate,
              complete, and current at all times. Failure to do so constitutes a breach of the Terms,
              which may result in immediate termination of your account on our Services.
            </p>
            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-white text-lg font-bold mb-3">Account Security</h3>
              <p className="text-slate-300 text-sm leading-6">
                You are responsible for safeguarding the password that you use to access the Services
                and for any activities or actions under your password. We encourage you to use a
                strong password (a combination of upper and lower case letters, numbers, and symbols)
                with your account.
              </p>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                3
              </span>
              User Content
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              Our Services allow you to post, link, store, share, and otherwise make available
              certain information, text, graphics, videos, or other material (&quot;Content&quot;). You are
              responsible for the Content that you post on or through the Service, including its
              legality, reliability, and appropriateness.
            </p>
            <p className="text-slate-300 leading-7">
              By posting Content on or through the Service, you grant us the right to use, modify,
              publicly perform, publicly display, reproduce, and distribute such Content on and
              through the Service solely for the purpose of operating and providing the Services.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                4
              </span>
              Payments & Transactions
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              Timeless facilitates transactions between clients and talent/service providers. All
              payments are processed through our secure payment system. By using our payment
              services, you agree to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-primary">
              <li>Provide accurate billing information for all transactions.</li>
              <li>
                Pay all fees and charges incurred through your account at the prices in effect when
                such charges are incurred.
              </li>
              <li>
                Acknowledge that Timeless may charge a service fee for facilitating transactions.
              </li>
              <li>
                Understand that refund policies may vary depending on the service provider&apos;s terms.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                5
              </span>
              Intellectual Property
            </h2>
            <p className="text-slate-300 leading-7">
              The Service and its original content (excluding Content provided by users), features,
              and functionality are and will remain the exclusive property of Timeless and its
              licensors. The Service is protected by copyright, trademark, and other laws. Our
              trademarks and trade dress may not be used in connection with any product or service
              without the prior written consent of Timeless.
            </p>
          </section>

          {/* Section 6 - Contact */}
          <section id="community">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                6
              </span>
              Community Guidelines
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              Timeless is committed to creating a safe and respectful community for all users.
              Users must not engage in harassment, discrimination, fraud, or any behavior that
              disrupts the platform experience. Violations may result in account suspension or
              permanent removal.
            </p>
          </section>

          {/* Section 7 - Contact */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                7
              </span>
              Contact Us
            </h2>
            <p className="text-slate-300 leading-7 mb-6">
              If you have any questions about these Terms, please contact us via email or support
              ticket.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:legal@timeless.com"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                legal@timeless.com
              </a>
            </div>
          </section>
        </article>
      </div>
    </LegalLayout>
  );
}
