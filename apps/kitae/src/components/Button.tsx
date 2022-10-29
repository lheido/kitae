import type { AnchorHTMLAttributes, HTMLAttributes } from "react";
import { handleDefaultClassName } from "./utils/props";

type ButtonProps = HTMLAttributes<HTMLButtonElement>;
type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement>;

const BaseButton = (props: ButtonProps) => (
  <button
    {...handleDefaultClassName(
      "relative flex gap-2 px-4 py-2 rounded focus-visible:outline outline-2 outline-transparent transition-all duration-200",
      props
    )}
  >
    {props.children}
  </button>
);

const BaseLinkButton = (props: LinkProps) => (
  <a
    {...handleDefaultClassName(
      "relative flex gap-2 px-4 py-2 rounded focus-visible:outline outline-2 outline-transparent transition-all duration-200",
      props
    )}
  >
    {props.children}
  </a>
);

export const Button = {
  default: (props: ButtonProps) => (
    <BaseButton
      {...handleDefaultClassName(
        "bg-dp-8 hover:bg-dp-6 focus:bg-dp-6 active:bg-dp-24 focus-visible:outline-dp-24",
        props
      )}
    >
      {props.children}
    </BaseButton>
  ),
  primary: (props: ButtonProps) => (
    <BaseButton
      {...handleDefaultClassName(
        "bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-500 focus-visible:outline-primary-300",
        props
      )}
    >
      {props.children}
    </BaseButton>
  ),
  secondary: (props: ButtonProps) => (
    <BaseButton
      {...handleDefaultClassName(
        "bg-secondary-500 hover:bg-secondary-600 focus:bg-secondary-600 active:bg-secondary-500 focus-visible:outline-secondary-300",
        props
      )}
    >
      {props.children}
    </BaseButton>
  ),
  kitae: (props: ButtonProps) => (
    <BaseButton
      {...handleDefaultClassName(
        "bg-dp-8 kitae-gradient focus-visible:outline-secondary-300",
        props
      )}
    >
      <div className="relative flex gap-2">{props.children}</div>
    </BaseButton>
  ),
  link: {
    default: (props: LinkProps) => (
      <BaseLinkButton
        {...handleDefaultClassName(
          "bg-dp-8 hover:bg-dp-6 focus:bg-dp-6 active:bg-dp-24 focus-visible:outline-dp-24",
          props
        )}
      >
        {props.children}
      </BaseLinkButton>
    ),
    primary: (props: LinkProps) => (
      <BaseLinkButton
        {...handleDefaultClassName(
          "bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-500 focus-visible:outline-primary-300",
          props
        )}
      >
        {props.children}
      </BaseLinkButton>
    ),
    secondary: (props: LinkProps) => (
      <BaseLinkButton
        {...handleDefaultClassName(
          "bg-secondary-500 hover:bg-secondary-600 focus:bg-secondary-600 active:bg-secondary-500 focus-visible:outline-secondary-300",
          props
        )}
      >
        {props.children}
      </BaseLinkButton>
    ),
  },
};
