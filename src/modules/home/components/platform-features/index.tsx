import type { FC } from "react";

import SectionHeading from "@components/ui/section-heading";

import { PLATFORM_FEATURES } from "./consts";

const PlatformFeatures: FC = () => (
  <section
    id="platform"
    aria-labelledby="platform-heading"
    className="scroll-mt-24 bg-surface"
  >
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
      <SectionHeading
        id="platform-heading"
        eyebrow="Platform"
        title="The Hubble platform"
        description="Connectivity and device management for every module, from first deployment to the last firmware update."
      />
      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {PLATFORM_FEATURES.map(({ icon: Icon, title, description }) => (
          <li
            key={title}
            className="rounded-2xl border border-line bg-white p-6"
          >
            <span className="grid size-11 place-items-center rounded-xl bg-brand-soft text-brand">
              <Icon size={22} aria-hidden />
            </span>
            <h3 className="mt-4 text-lg font-bold text-navy">{title}</h3>
            <p className="mt-2 text-sm text-muted">{description}</p>
          </li>
        ))}
      </ul>
    </div>
  </section>
);

export default PlatformFeatures;
