import type { FC } from "react";
import { CheckIcon } from "lucide-react";

import SectionHeading from "@components/ui/section-heading";
import ConsultForm from "@modules/consult/components/consult-form";

const BENEFITS = [
  "Pick a 30-minute slot that suits you",
  "Instant Google Meet link and calendar invite",
  "Talk to an IoT specialist about your use case",
];

const ConsultSection: FC = () => (
  <section
    id="consult"
    aria-labelledby="consult-heading"
    className="mx-auto grid max-w-7xl scroll-mt-24 grid-cols-1 gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2"
  >
    <div>
      <SectionHeading
        id="consult-heading"
        eyebrow="Consult Now"
        title="Talk to an IoT expert"
        description="Book a consultation with our team over Google Meet."
      />
      <ul className="mt-6 space-y-3">
        {BENEFITS.map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-ink">
            <CheckIcon
              size={20}
              className="mt-0.5 shrink-0 text-brand"
              aria-hidden
            />
            {benefit}
          </li>
        ))}
      </ul>
    </div>
    <ConsultForm />
  </section>
);

export default ConsultSection;
