import { Link, useParams } from "react-router-dom";

const legalContent = {
  "privacy-policy": {
    title: "Privacy Policy",
    summary:
      "We respect your privacy and protect your personal information in line with applicable healthcare and data protection standards.",
    sections: [
      {
        heading: "Information we collect",
        body:
          "We may collect personal details such as your name, email, phone number, service requirements, and healthcare-related preferences when you contact us or request a consultation.",
      },
      {
        heading: "How we use it",
        body:
          "This information is used to route your request to a suitable provider, respond to your query, and help maintain a secure, high-quality healthcare network.",
      },
      {
        heading: "Sharing",
        body:
          "We do not sell personal data. We may share information only with verified service partners or internal teams required to process and fulfill a request, and only when legally and operationally necessary.",
      },
      {
        heading: "Security",
        body:
          "We use access controls, secure cookies, and encrypted transport channels to protect your data from unauthorized access and misuse.",
      },
    ],
  },
  "terms-of-service": {
    title: "Terms of Service",
    summary:
      "These terms describe how you may use the GMAA platform and the responsibilities of both the platform and its users.",
    sections: [
      {
        heading: "Eligibility",
        body:
          "You must be at least 18 years old or have valid authority to act on behalf of an organization when using the platform.",
      },
      {
        heading: "Use of services",
        body:
          "The site is intended for legitimate healthcare sourcing, vendor discovery, and coordination activities. Misuse, fraud, or abusive behavior is not permitted.",
      },
      {
        heading: "No guarantee",
        body:
          "GMAA provides platform access and coordination tools, but we do not guarantee outcome, availability, or final clinical results for third-party vendors or providers.",
      },
      {
        heading: "Accountability",
        body:
          "Users are responsible for the accuracy of the information they submit and must ensure they have the rights to share any data or credentials they provide.",
      },
    ],
  },
  "cookie-policy": {
    title: "Cookie Policy",
    summary:
      "Cookies help us manage sessions securely, remember preferences, and keep the platform functioning reliably.",
    sections: [
      {
        heading: "What we use",
        body:
          "We use session cookies for authentication and CSRF protection, along with a small preference cookie to remember your cookie settings.",
      },
      {
        heading: "Essential cookies",
        body:
          "These are required for security, access control, and feature stability. Without them, secure login and protected actions may not work.",
      },
      {
        heading: "Optional cookies",
        body:
          "Optional cookies may be used to improve performance and remember choices such as consent preferences. These are disabled unless you explicitly accept them.",
      },
      {
        heading: "Managing preferences",
        body:
          "You can adjust your cookie choice anytime from the cookie banner or by clearing site data in your browser settings.",
      },
    ],
  },
};

export default function LegalPage() {
  const { page } = useParams();
  const key = (page ?? "privacy-policy") as keyof typeof legalContent;
  const content = legalContent[key] ?? legalContent["privacy-policy"];

  return (
    <main className="mx-auto max-w-4xl px-4 pb-20 pt-28 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
        <div className="mb-8 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-cyan">Legal</p>
            <h1 className="mt-3 text-3xl font-semibold text-navy sm:text-4xl">{content.title}</h1>
          </div>
          <Link to="/" className="rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-400">
            Back home
          </Link>
        </div>

        <p className="mb-8 text-base leading-7 text-slate-600">{content.summary}</p>

        <div className="space-y-6">
          {content.sections.map((section) => (
            <section key={section.heading} className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
              <h2 className="text-lg font-semibold text-navy">{section.heading}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-600">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
