import type { FC } from "react";
import Link from "next/link";

import { buttonVariants } from "@components/ui/button/consts";

import type { ButtonLinkProps } from "./type";

const ButtonLink: FC<ButtonLinkProps> = ({
  theme,
  size,
  className,
  ...linkProps
}) => (
  <Link {...linkProps} className={buttonVariants({ theme, size, className })} />
);

export default ButtonLink;
