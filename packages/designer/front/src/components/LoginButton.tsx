export const LoginButton = (props: {
  label: string;
  icon: JSX.Element;
  onClick?: () => void;
}) => (
  <button
    onClick={() => props.onClick && props.onClick()}
    className="relative flex flex-start gap-2 p-2 w-full rounded bg-neutral-700 kitae-gradient"
  >
    <span className="relative">{props.icon}</span>
    <span className="relative">{props.label}</span>
  </button>
);
