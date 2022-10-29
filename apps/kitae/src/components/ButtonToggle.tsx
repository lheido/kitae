import { useEffect, useRef, useState } from "react";

export interface ButtonToggleGroupProps {
  label?: string;
  name: string;
  selected?: string;
  states: { label: string; value: string }[];
  tpl?: any;
  onChange: (value: string) => void;
}

export const ButtonToggleGroup = ({
  label,
  name,
  selected,
  states,
  tpl,
  onChange,
}: ButtonToggleGroupProps) => {
  const Tpl = tpl ?? ButtonToggle;
  const groupRef = useRef<any>();
  const inkRef = useRef<any>();
  const [inkStyle, setInkStyle] = useState({
    width: 0,
    height: 0,
    left: 0,
  });
  useEffect(() => {
    const selected = groupRef.current.querySelector(`[aria-pressed="true"]`);
    if (selected) {
      const groupRect = groupRef.current.getBoundingClientRect();
      const rect = selected.getBoundingClientRect();
      setInkStyle({
        width: rect.width,
        height: rect.height,
        left: rect.left - groupRect.left,
      });
    }
  }, [selected, groupRef, inkRef]);
  return (
    <div
      role="group"
      ref={groupRef}
      aria-label={label ?? name}
      className="flex relative bg-dp-0 p-1 gap-2 rounded-lg"
    >
      <div
        ref={inkRef}
        style={inkStyle}
        aria-hidden="true"
        className="absolute top-1/2 -translate-y-1/2 left-0 h-full bg-secondary-500 transition-all duration-300 rounded-md"
      ></div>
      {states.map((state) => (
        <div role="presentation" key={state.value} className="relative">
          <Tpl
            pressed={state.value === selected}
            value={state.value}
            onChange={onChange}
            name={name}
          >
            {state.label}
          </Tpl>
        </div>
      ))}
    </div>
  );
};

export const ButtonToggle = ({
  children,
  pressed,
  name,
  value,
  onChange,
}: any) => {
  const clickHandler = () => {
    if (!pressed) {
      onChange(value);
    }
  };
  return (
    <button
      type="button"
      className="px-4 py-2 focus-visible:outline rounded-md outline-2 focus-visible:outline-secondary-300"
      aria-pressed={pressed}
      name={name}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};
