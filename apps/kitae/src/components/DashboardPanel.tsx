import { useCallback, useState } from "react";
import FlexibleHeaderPanel from "./FlexibleHeaderPanel";

export interface DashboardPanelProps {
  title: string;
  icon?: JSX.Element;
  expandedHeight: number;
  height: number;
  className: string;
  children: JSX.Element | JSX.Element[];
}

export default function DashboardPanel({
  icon,
  title,
  height,
  expandedHeight,
  className,
  children,
}: DashboardPanelProps) {
  const [scroll, setScroll] = useState(0);
  const onScroll = useCallback((e: any) => {
    setScroll(e.target.scrollTop);
  }, []);
  return (
    <section
      onScroll={onScroll}
      className={`bg-kitae-panel-bg rounded-lg text-kitae-text overflow-y-auto ${
        className ?? ""
      }`.trim()}
    >
      <FlexibleHeaderPanel
        scroll={scroll}
        height={height}
        expandedHeight={expandedHeight}
        title={title}
        icon={icon}
      />
      <div style={{ paddingTop: expandedHeight }}>{children}</div>
    </section>
  );
}
