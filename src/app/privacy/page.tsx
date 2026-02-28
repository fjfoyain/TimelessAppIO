"use client";

import LegalLayout from "@/components/legal/LegalLayout";

export default function PrivacyPage() {
  return (
    <LegalLayout>
      <div className="max-w-3xl">
        {/* Header */}
        <div className="flex flex-col gap-4 border-b border-white/5 pb-8 mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 w-fit">
            <span className="material-icons text-primary text-sm">verified_user</span>
            <span className="text-primary text-xs font-bold uppercase tracking-wide">
              Privacy First
            </span>
          </div>
          <h1 className="text-white text-3xl md:text-4xl font-black tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-500 text-sm">
            Last updated: February 27, 2026
          </p>
        </div>

        <p className="text-slate-300 leading-7 mb-10">
          At Timeless, we take your privacy seriously. This Privacy Policy describes how we
          collect, use, and disclose your information when you use our website, mobile application,
          and related services. By accessing or using our Services, you signify that you have read,
          understood, and agree to our collection, storage, use, and disclosure of your personal
          information as described in this Privacy Policy and our Terms of Service.
        </p>

        {/* Content */}
        <article className="space-y-10">
          {/* Section 1 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                1
              </span>
              Information We Collect
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              We collect information to provide better services to all our users. We collect
              information in the following ways:
            </p>
            <div className="bg-white/5 rounded-xl p-6 mb-6 border border-white/10">
              <h3 className="text-white text-lg font-bold mb-3">Information you give us</h3>
              <p className="text-slate-300 text-sm leading-6">
                For example, many of our services require you to sign up for a Timeless account.
                When you do, we collect personal information like your name, email address, phone
                number, and payment information. We also collect the content you create, upload, or
                receive from others when using our services, such as profile information, portfolio
                items, and messages.
              </p>
            </div>
            <div className="bg-white/5 rounded-xl p-6 border border-white/10">
              <h3 className="text-white text-lg font-bold mb-3">Information we get from your use</h3>
              <p className="text-slate-300 text-sm leading-6">
                We collect information about the services that you use and how you use them, like
                when you visit our website, view or interact with our content, and the frequency and
                duration of your activities. We also collect device information and log data such as
                your IP address, browser type, and operating system.
              </p>
            </div>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                2
              </span>
              How We Use Information
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              We use the information we collect from all our services to provide, maintain, protect,
              and improve them, to develop new ones, and to protect Timeless and our users. We also
              use this information to offer you tailored content — like giving you more relevant
              search results and recommendations.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-primary">
              <li>Provide, maintain, and improve our Services.</li>
              <li>Process transactions and send related information.</li>
              <li>
                Send you technical notices, updates, security alerts, and support messages.
              </li>
              <li>Respond to your comments, questions, and requests.</li>
              <li>
                Monitor and analyze trends, usage, and activities in connection with our Services.
              </li>
              <li>
                Personalize the Services and provide content and features that match your profile
                and interests.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                3
              </span>
              Information We Share
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              We do not share personal information with companies, organizations, and individuals
              outside of Timeless unless one of the following circumstances applies:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">check_circle</span>
                  With your consent
                </h4>
                <p className="text-slate-400 text-sm leading-6">
                  We will share personal information with companies, organizations, or individuals
                  outside of Timeless when we have your consent to do so.
                </p>
              </div>
              <div className="bg-white/5 rounded-xl p-5 border border-white/10">
                <h4 className="text-white font-bold mb-2 flex items-center gap-2">
                  <span className="material-icons text-primary text-sm">gavel</span>
                  For legal reasons
                </h4>
                <p className="text-slate-400 text-sm leading-6">
                  We will share personal information if we have a good-faith belief that access,
                  use, preservation, or disclosure is reasonably necessary to meet any applicable
                  law, regulation, legal process, or enforceable governmental request.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4 */}
          <section id="cookies">
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                4
              </span>
              Data Security
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              We work hard to protect Timeless and our users from unauthorized access to or
              unauthorized alteration, disclosure, or destruction of information we hold. In
              particular:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-primary">
              <li>We encrypt many of our services using SSL.</li>
              <li>
                We review our information collection, storage, and processing practices, including
                physical security measures, to guard against unauthorized access to systems.
              </li>
              <li>
                We restrict access to personal information to Timeless employees and agents who
                need to know that information in order to process it for us.
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                5
              </span>
              Your Rights
            </h2>
            <p className="text-slate-300 leading-7 mb-4">
              You have the right to access, update, or delete the personal information we have on
              you. You can do this through your account settings or by contacting us directly. You
              also have the right to:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300 marker:text-primary">
              <li>Request a copy of all personal data we hold about you.</li>
              <li>Request correction of inaccurate personal data.</li>
              <li>Request deletion of your personal data.</li>
              <li>Object to or restrict processing of your personal data.</li>
              <li>Request data portability.</li>
            </ul>
          </section>

          {/* Section 6 - Contact */}
          <section>
            <h2 className="text-white text-xl font-bold mb-4 flex items-center gap-3">
              <span className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/20 text-primary text-sm font-bold">
                6
              </span>
              Contact Us
            </h2>
            <p className="text-slate-300 leading-7 mb-6">
              If you have any questions about this Privacy Policy or our data practices, please
              contact us.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="/contact"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg bg-primary hover:bg-primary-dark text-white font-bold transition-colors"
              >
                Contact Support
              </a>
              <a
                href="mailto:privacy@timeless.com"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-white/10 text-white font-bold hover:bg-white/5 transition-colors"
              >
                privacy@timeless.com
              </a>
            </div>
          </section>
        </article>
      </div>
    </LegalLayout>
  );
}
