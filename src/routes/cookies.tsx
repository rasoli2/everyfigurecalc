import { createFileRoute } from "@tanstack/react-router";
import { LegalPage, LegalSection } from "@/components/legal/legal-page";
import { SITE_NAME, absoluteUrl } from "@/data/site";

const title = `Cookie Policy | ${SITE_NAME}`;
const description = "How EVERYFIGURECALC uses cookies and similar technologies.";

export const Route = createFileRoute("/cookies")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: "website" },
      { property: "og:url", content: absoluteUrl("/cookies") },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/cookies") }],
  }),
  component: CookiePolicyPage,
});

function CookiePolicyPage() {
  return (
    <LegalPage title="Cookie Policy">
      <LegalSection title="What Cookies Are">
        <p>
          Cookies are small text files stored on your device when you visit a website. Similar technologies include
          local storage, session storage and pixels. They can help a site function, remember preferences or, in
          some cases, support analytics or advertising.
        </p>
      </LegalSection>

      <LegalSection title={`How ${SITE_NAME} Currently Uses Cookies`}>
        <p>
          {SITE_NAME} is designed to keep calculator use private in your browser. At this time, we do not operate
          non-essential analytics or advertising cookie systems on the Site.
        </p>
        <p>
          Some cookies or similar technologies may still be set by our hosting, content delivery or security
          infrastructure for essential operation, performance or security purposes. We describe the main categories
          below.
        </p>
      </LegalSection>

      <LegalSection title="Essential Technologies">
        <p>
          Essential cookies and similar technologies are those reasonably necessary to deliver the Site, maintain
          security, load pages and protect against abuse. These may be set by our infrastructure providers as part
          of normal website operation.
        </p>
        <p>
          Because the Site does not require login, we do not use cookies to authenticate user accounts.
        </p>
      </LegalSection>

      <LegalSection title="Analytics Cookies">
        <p>
          {SITE_NAME} does not currently use analytics cookies from services such as Google Analytics. If analytics
          is added in the future, this Cookie Policy will be updated and any legally required consent controls will
          be implemented before or when those cookies become active.
        </p>
      </LegalSection>

      <LegalSection title="Advertising Cookies">
        <p>
          {SITE_NAME} does not currently use advertising cookies from services such as Google AdSense. If third-party
          advertising is added in the future, this Cookie Policy will be updated with provider-specific information,
          and consent or opt-out mechanisms will be implemented as required by applicable law.
        </p>
      </LegalSection>

      <LegalSection title="Local Storage">
        <p>
          Calculators may use browser storage only within your device to support normal page behavior during your
          session. Calculator inputs are processed locally in your browser and are not intentionally transmitted to or
          stored by {SITE_NAME}.
        </p>
        <p>
          We do not use local storage to build cross-site profiles or to track you across unrelated websites.
        </p>
      </LegalSection>

      <LegalSection title="Third-Party Technologies">
        <p>
          Third-party infrastructure providers involved in hosting, CDN delivery or security may process technical
          request data and set strictly necessary technologies as part of providing those services. We do not
          currently embed third-party analytics or advertising scripts that set non-essential tracking cookies.
        </p>
      </LegalSection>

      <LegalSection title="Your Choices">
        <p>
          You can control cookies and similar technologies through your browser settings, including blocking,
          deleting or limiting cookies. Essential technologies required for basic site delivery may still be used
          when you visit the Site.
        </p>
        <p>
          Because we do not currently run non-essential analytics or advertising cookies, there is no separate cookie
          consent banner on the Site at this time.
        </p>
      </LegalSection>

      <LegalSection title="Future Changes">
        <p>
          If we introduce analytics, advertising or other non-essential technologies, we will update this Cookie
          Policy and our Privacy Policy. Where required, we will implement a consent management platform or other
          appropriate consent controls before or when those services become active.
        </p>
      </LegalSection>

      <LegalSection title="Contact">
        <p>
          Questions about this Cookie Policy:{" "}
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
