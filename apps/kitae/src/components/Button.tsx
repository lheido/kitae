import type { HTMLAttributes } from "react";

export const Button = (props: HTMLAttributes<HTMLButtonElement>) => {
  return (
    <button
      {...{
        className:
          "flex p-4 rounded bg-neutral-700 hover:bg-neutral-600 focus:bg-neutral-600 active:bg-kitae-start focus:outline-none transition-colors duration-200",
        ...props,
      }}
    >
      <span>{props.children}</span>
    </button>
  );
};
