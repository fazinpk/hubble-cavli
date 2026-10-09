import type { FC } from "react";

import type { SectionHeadingProps } from "./type";

const SectionHeading: FC<SectionHeadingProps> = ({
  eyebrow,
  title,
  description,
  id,
}) => (
  <div className="max-w-2xl">
    <p className="text-sm font-semibold tracking-wider text-brand uppercase">
      {eyebrow}
    </p>
    <h2 id={id} className="mt-2 text-3xl font-bold text-navy sm:text-4xl">
      {title}
    </h2>
    {description && <p className="mt-3 text-base text-muted">{description}</p>}
  </div>
);

export default SectionHeading;
