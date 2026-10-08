import type { ComponentProps } from "react";
import type Link from "next/link";

import type { ButtonVariantProps } from "@components/ui/button/type";

export type ButtonLinkProps = ComponentProps<typeof Link> & ButtonVariantProps;
