import type { Metadata } from "next";

import { CONTACT_EMAIL } from "@consts/config.const";

export const metadata: Metadata = {
  title: "Privacy policy | Hubble by Cavli Wireless",
  description: "How this demo site collects, uses and stores your data.",
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
      <article className="text-ink[&_a]:font-semibold [&_a]:text-brand [&_a]:underline [&_h2]:mt-10 [&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-navy [&_li]:mt-1 [&_p]:mt-3 [&_ul]:mt-3 [&_ul]:list-disc [&_ul]:pl-5">
        <p className="text-sm font-semibold tracking-wider text-brand uppercase">
          Legal
        </p>
        <h1 className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
          Privacy policy
        </h1>
        <p className="text-muted">Last updated: 12 October 2026</p>

        <p>
          This site is a demo built by Fazin P K for a Cavli Wireless
          assessment. It is not an official Cavli Wireless website, and this
          policy covers only this demo.
        </p>

        <h2>What we collect</h2>
        <p>
          When you request a consultation, we collect your name, email address
          and message, plus your phone number and company if you choose to give
          them, and the time slot you book.
        </p>

        <h2>How we use it</h2>
        <p>
          Only to schedule and confirm your consultation. We do not sell your
          data, share it for marketing or use it for anything else.
        </p>

        <h2>Where it is stored and who processes it</h2>
        <ul>
          <li>
            Your request is stored in a PostgreSQL database hosted by Neon.
          </li>
          <li>The site is hosted by Vercel.</li>
          <li>
            Booking creates an event with a Google Meet link in the site
            owner&apos;s Google Calendar, with your name and email added as an
            attendee.
          </li>
          <li>The confirmation email is sent through Gmail.</li>
        </ul>

        <h2>Google Calendar</h2>
        <p>
          You don&apos;t sign in with Google on this site. The site uses only
          its owner&apos;s Google Calendar: it checks when the owner is free to
          show open time slots, and adds your booked consultation to that
          calendar. Nothing from Google is shared with anyone else.
        </p>

        <h2>Exhibitor data</h2>
        <p>
          The exhibitor details shown on this site come from the public
          exhibitor directory on mmiconnect.in.
        </p>

        <h2>Cookies and tracking</h2>
        <p>This site uses no analytics and no tracking cookies.</p>

        <h2>Retention and your rights</h2>
        <p>
          All consultation data is deleted after the assessment ends. You can
          ask to see or delete your data at any time by emailing{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </article>
    </div>
  );
}
