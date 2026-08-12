import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Terms of Use | ${SITE_NAME}`;
const description = "Terms of Use for EVERYFIGURECALC free online calculators.";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/terms") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/terms") }],
  }),
  component: TermsPage,
});

function TermsPage() {
  return (
    <LegalPage title="Terms of Use">
      <LegalSection title="Acceptance of Terms">
        <p>
          By accessing or using {SITE_NAME} at everyfigurecalc.com (the &ldquo;Site&rdquo;), you agree to these
          Terms of Use. If you do not agree, please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection title={`About ${SITE_NAME}`}>
        <p>
          {SITE_NAME} is a free English-language website offering online calculators for everyday math, time and
          date calculations, work hours, pay-related estimates, money calculations and similar tools. The Site is
          intended primarily for users in the United States but is accessible worldwide. There is no user account,
          login or registration.
        </p>
        <p>
          Calculator inputs are processed locally in your browser and are not intentionally transmitted to or
          stored by {SITE_NAME}.
        </p>
      </LegalSection>

      <LegalSection title="Eligibility and General Use">
        <p>
          You may use the Site if you are able to form a binding agreement and are not prohibited from using the
          Site under applicable law. If you are using the Site on behalf of another person or organization, you
          represent that you have authority to bind that person or organization to these Terms.
        </p>
        <p>
          You are responsible for your use of the Site and for any decisions you make based on calculator results.
        </p>
      </LegalSection>

      <LegalSection title="Informational Purpose Only">
        <p>
          The Site and its calculators are provided for general informational and convenience purposes. Results are
          estimates and general information, not definitive answers for your specific situation.
        </p>
        <p>
          You must independently verify any result that matters to you before relying on it for payroll, billing,
          tax, legal, financial, employment or other important decisions.
        </p>
      </LegalSection>

      <LegalSection title="No Professional Advice">
        <p>
          {SITE_NAME} does not provide professional, financial, tax, legal, payroll, accounting, medical or other
          regulated advice. Using the Site does not create a professional-client, advisor-client, employer-employee
          or similar relationship between you and {SITE_NAME}.
        </p>
        <p>
          For advice tailored to your circumstances, consult a qualified professional.
        </p>
      </LegalSection>

      <LegalSection title="Calculator Accuracy and Limitations">
        <p>
          We work to keep the calculators accurate and useful, but we do not guarantee that any result is complete,
          current, error-free or suitable for your purpose.
        </p>
        <p>Results may not reflect:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>employer policies, union rules or employment contracts;</li>
          <li>overtime rules, rounding practices or payroll systems;</li>
          <li>tax laws, filing requirements or regulatory guidance;</li>
          <li>local, state, federal or international legal requirements;</li>
          <li>bank holidays, leap seconds, timezone rules or calendar exceptions; or</li>
          <li>your individual circumstances.</li>
        </ul>
        <p>
          Calculator behavior may change when we update formulas, defaults, labels or underlying logic. Always
          treat outputs as starting points, not final determinations.
        </p>
      </LegalSection>

      <LegalSection title="User Responsibility">
        <p>
          You are solely responsible for how you use the Site and any results it produces. Before acting on a
          result, compare it with your own records, official sources, employer guidance or qualified advisers as
          appropriate.
        </p>
      </LegalSection>

      <LegalSection title="Work, Pay and Payroll Calculators">
        <p>
          Calculators related to hours worked, time cards, overtime, shifts, decimal hours, hourly-to-salary
          conversion and similar tools produce mathematical estimates based on the values you enter. They do not
          know your employer&apos;s pay rules, break policies, rounding methods, premium pay rates, exempt/non-exempt
          status or actual timekeeping records.
        </p>
        <p>
          Do not use these calculators as a substitute for official payroll records, approved timesheets or
          employer payroll systems.
        </p>
      </LegalSection>

      <LegalSection title="Financial Calculators">
        <p>
          Calculators related to discounts, percentages, raises, credit card payoff and similar topics provide
          simplified mathematical outputs. They do not account for fees, compounding variations, promotional terms,
          credit agreements, interest-rate changes or other real-world factors unless explicitly stated in the tool.
        </p>
        <p>
          Do not use these calculators as a substitute for statements from your bank, lender, employer or financial
          adviser.
        </p>
      </LegalSection>

      <LegalSection title="Tax and Legal Matters">
        <p>
          Nothing on the Site should be interpreted as tax guidance, legal guidance or compliance advice. Tax rules,
          filing obligations and legal requirements vary by jurisdiction and change over time.
        </p>
      </LegalSection>

      <LegalSection title="No Warranty">
        <p>
          The Site is provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo; basis, without warranties
          of any kind, whether express or implied, including implied warranties of merchantability, fitness for a
          particular purpose, accuracy or non-infringement, to the fullest extent permitted by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Limitation of Liability">
        <p>
          To the fullest extent permitted by applicable law, {SITE_NAME} and its operators will not be liable for
          any indirect, incidental, special, consequential or punitive damages, or for any loss of profits, data,
          goodwill or business opportunities, arising out of or related to your use of the Site or reliance on
          calculator results.
        </p>
        <p>
          To the fullest extent permitted by applicable law, our total liability for any claim arising out of or
          relating to the Site will not exceed the greater of (a) the amount you paid to use the Site in the twelve
          months before the claim or (b) USD $100. Because the Site is free, (a) will typically be zero.
        </p>
        <p>
          Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.
        </p>
      </LegalSection>

      <LegalSection title="Permitted Use">
        <p>
          You may use the Site for lawful personal, educational and work-related purposes in accordance with these
          Terms.
        </p>
      </LegalSection>

      <LegalSection title="Prohibited Use">
        <p>You agree not to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>use the Site in any unlawful manner or for an unlawful purpose;</li>
          <li>attempt to interfere with the Site&apos;s operation, security or availability;</li>
          <li>attempt to gain unauthorized access to systems connected to the Site;</li>
          <li>misrepresent your affiliation with {SITE_NAME} or mislead others about the source of Site content;</li>
          <li>use the Site to distribute malware or harmful code; or</li>
          <li>use automated means to access the Site in a way that imposes an unreasonable load or bypasses normal use.</li>
        </ul>
      </LegalSection>

      <LegalSection title="Automated Access and Bulk Copying">
        <p>
          You may not scrape, crawl, harvest or bulk copy Site content, calculator outputs, page structure or
          branding for republication, resale, dataset creation or competing services without prior written
          permission, except where allowed by applicable law.
        </p>
        <p>
          Limited indexing by search engines in the ordinary course is permitted.
        </p>
      </LegalSection>

      <LegalSection title="Intellectual Property">
        <p>
          The Site, including its name, branding, layout, text, design and original content, is owned by or
          licensed to {SITE_NAME} and is protected by applicable intellectual property laws. These Terms do not
          grant you any ownership rights in the Site.
        </p>
        <p>
          You may share links to pages on the Site. You may not copy or republish substantial portions of the Site
          as your own work.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Services and Links">
        <p>
          The Site may reference or link to third-party websites or services. We do not control and are not
          responsible for third-party content, policies or practices. Your use of third-party services is at your
          own risk and subject to their terms and policies.
        </p>
      </LegalSection>

      <LegalSection title="Service Availability">
        <p>
          We aim to keep the Site available, but we do not guarantee uninterrupted or error-free operation.
          Maintenance, updates, hosting issues or events outside our control may cause downtime or temporary
          unavailability.
        </p>
      </LegalSection>

      <LegalSection title="Changes to Calculators and the Site">
        <p>
          We may add, modify, remove or reorganize calculators, pages, features or content at any time without
          notice. We are not obligated to maintain any particular calculator or result format.
        </p>
      </LegalSection>

      <LegalSection title="Changes to These Terms">
        <p>
          We may update these Terms from time to time. The Effective Date / Last Updated at the top of this page
          will reflect the latest version. Your continued use of the Site after changes are posted means you accept
          the updated Terms.
        </p>
      </LegalSection>

      <LegalSection title="Severability">
        <p>
          If any provision of these Terms is found invalid or unenforceable, the remaining provisions will remain
          in full force and effect.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about these Terms:{" "}
          <a
            href="mailto:noxfbusiness@gmail.com"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            noxfbusiness@gmail.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
