import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Privacy Policy | ${SITE_NAME}`;
const description = "How EVERYFIGURECALC handles information when you use our free calculators.";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/privacy") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/privacy") }],
  }),
  component: PrivacyPage,
});

function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy">
      <LegalSection title="Scope">
        <p>
          This Privacy Policy explains how {SITE_NAME} (&ldquo;we,&rdquo; &ldquo;us&rdquo; or &ldquo;our&rdquo;)
          handles information when you visit everyfigurecalc.com and use our free online calculators. It applies to
          visitors from the United States and other countries.
        </p>
        <p>
          By using the Site, you acknowledge this Policy. If you do not agree, please do not use the Site.
        </p>
      </LegalSection>

      <LegalSection title="Information We Collect">
        <p>
          We collect limited information needed to operate, secure and maintain the Site. The categories below
          describe what may be processed.
        </p>
      </LegalSection>

      <LegalSection title="Calculator Inputs">
        <p>
          Calculator inputs are processed locally in the user&apos;s browser and are not intentionally transmitted
          to or stored by {SITE_NAME}.
        </p>
        <p>
          The numbers, dates, times, amounts and other values you enter into a calculator stay on your device for
          the purpose of producing a result in your browser session. We do not operate a user account system and do
          not ask you to submit calculator inputs to us.
        </p>
      </LegalSection>

      <LegalSection title="Technical and Log Information">
        <p>
          Like most websites, our hosting, content delivery and security infrastructure may automatically process
          technical information when you request a page or asset. This can include:
        </p>
        <ul className="list-disc space-y-1 pl-5">
          <li>IP address;</li>
          <li>browser type and version;</li>
          <li>device and operating system information;</li>
          <li>requested URL and referring URL;</li>
          <li>date and time of the request; and</li>
          <li>basic error, performance or security-related log data.</li>
        </ul>
        <p>
          This information is distinct from calculator inputs. It is generally used to deliver the Site, maintain
          reliability, diagnose problems and protect against abuse or attacks.
        </p>
      </LegalSection>

      <LegalSection title="Information You Voluntarily Provide">
        <p>
          If you contact us by email or through a contact form, we receive the information you choose to send, such
          as your email address, name (if provided) and message content. We use that information to respond to your
          inquiry.
        </p>
      </LegalSection>

      <LegalSection title="How We Use Information">
        <p>We use information to:</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>provide and maintain the Site and calculators;</li>
          <li>operate hosting, CDN and security services;</li>
          <li>respond to contact requests;</li>
          <li>understand general usage patterns and improve the Site;</li>
          <li>detect, prevent and address technical or security issues; and</li>
          <li>comply with applicable legal obligations.</li>
        </ul>
        <p>We do not sell personal information.</p>
      </LegalSection>

      <LegalSection title="Cookies and Similar Technologies">
        <p>
          Cookies and similar technologies may be used for essential site operation, security or infrastructure
          purposes. For more detail, see our{" "}
          <a href="/cookies" className="font-medium text-foreground underline underline-offset-2 hover:text-primary">
            Cookie Policy
          </a>
          .
        </p>
        <p>
          {SITE_NAME} does not currently use non-essential analytics or advertising cookies. If that changes, this
          Policy and our Cookie Policy will be updated.
        </p>
      </LegalSection>

      <LegalSection title="Analytics">
        <p>
          {SITE_NAME} does not currently use a third-party analytics service such as Google Analytics. If analytics
          is introduced, this Policy will be updated and any legally required consent mechanisms will be implemented
          before or when those services become active.
        </p>
      </LegalSection>

      <LegalSection title="Advertising">
        <p>
          {SITE_NAME} does not currently display third-party advertising. If advertising services such as Google
          AdSense are introduced, this Policy will be updated with applicable provider, cookie, personalization and
          opt-out disclosures before or when those services become active.
        </p>
      </LegalSection>

      <LegalSection title="Service Providers">
        <p>
          We use service providers such as hosting, CDN and security vendors to operate the Site. These providers
          process technical information on our behalf according to their services and our instructions, where
          applicable. They are not authorized to use personal information for their own marketing purposes.
        </p>
      </LegalSection>

      <LegalSection title="Security">
        <p>
          We use reasonable administrative, technical and organizational measures designed to protect information
          processed in connection with the Site. No method of transmission or storage is completely secure, and we
          cannot guarantee absolute security.
        </p>
      </LegalSection>

      <LegalSection title="Data Retention">
        <p>
          We retain information only for as long as reasonably necessary for the purposes described in this Policy,
          including to operate the Site, maintain security logs, resolve disputes and comply with legal obligations.
          Retention periods for server and security logs depend on our hosting and security providers&apos; practices.
        </p>
      </LegalSection>

      <LegalSection title="International Visitors">
        <p>
          The Site is accessible worldwide. If you access the Site from outside the United States, your information
          may be processed in the United States or other locations where our service providers operate. Data
          protection laws vary by country.
        </p>
      </LegalSection>

      <LegalSection title="Privacy Rights">
        <p>
          Depending on where you live, applicable law may provide rights such as access, correction, deletion or
          objection to certain processing. We will respond to valid requests in accordance with applicable law.
        </p>
        <p>
          To submit a privacy request, contact us at{" "}
          <a
            href="mailto:hello@everyfigurecalc.com"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            hello@everyfigurecalc.com
          </a>
          . We may need to verify your request before responding.
        </p>
      </LegalSection>

      <LegalSection title="Children&apos;s Privacy">
        <p>
          The Site is not directed to children under 13, and we do not knowingly collect personal information from
          children under 13. If you believe a child has provided us personal information, contact us and we will
          take appropriate steps to delete it where required.
        </p>
      </LegalSection>

      <LegalSection title="Do Not Track and Browser Controls">
        <p>
          Some browsers offer a &ldquo;Do Not Track&rdquo; signal. There is no uniform industry standard for
          responding to such signals. You can also manage cookies and similar technologies through your browser
          settings. See our Cookie Policy for more information.
        </p>
      </LegalSection>

      <LegalSection title="Changes to This Policy">
        <p>
          We may update this Privacy Policy from time to time. The Effective Date / Last Updated at the top of this
          page shows when it was last revised. Continued use of the Site after an update means you acknowledge the
          revised Policy.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Privacy questions or requests:{" "}
          <a
            href="mailto:hello@everyfigurecalc.com"
            className="font-medium text-foreground underline underline-offset-2 hover:text-primary"
          >
            hello@everyfigurecalc.com
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
