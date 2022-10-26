import type { HTMLAttributes } from "react";

export const handleDefaultClassName = <T extends HTMLAttributes<unknown>>(
  defaultClassName: string,
  props: T
): T => {
  if ("className" in props && props.className) {
    const className: string[] = props.className
      .split(" ")
      .reduce((acc, value) => {
        if (acc.includes(value)) return acc;
        acc.push(value);
        return acc;
      }, defaultClassName.split(" "));
    return {
      ...props,
      className: className.join(" "),
    };
  }
  return {
    ...props,
    className: defaultClassName,
  };
};
