import type { HTMLAttributes } from "react";
import { handleDefaultClassName } from "./utils/props";

type ButtonProps = HTMLAttributes<HTMLButtonElement>;

const BaseIconButton = (props: ButtonProps) => (
  <button
    {...handleDefaultClassName(
      "relative flex p-2 rounded-full focus-visible:outline outline-2 outline-transparent transition-all duration-200",
      props
    )}
  >
    {props.children}
  </button>
);

export const IconButton = {
  default: (props: ButtonProps) => (
    <BaseIconButton
      {...handleDefaultClassName(
        "hover:bg-dp-6 focus:bg-dp-6 active:bg-dp-24 focus-visible:outline-dp-24",
        props
      )}
    >
      {props.children}
    </BaseIconButton>
  ),
  primary: (props: ButtonProps) => (
    <BaseIconButton
      {...handleDefaultClassName(
        "bg-primary-500 hover:bg-primary-600 focus:bg-primary-600 active:bg-primary-500 focus-visible:outline-primary-300",
        props
      )}
    >
      {props.children}
    </BaseIconButton>
  ),
  secondary: (props: ButtonProps) => (
    <BaseIconButton
      {...handleDefaultClassName(
        "bg-secondary-500 hover:bg-secondary-600 focus:bg-secondary-600 active:bg-secondary-500 focus-visible:outline-secondary-300",
        props
      )}
    >
      {props.children}
    </BaseIconButton>
  ),
};
