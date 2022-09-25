import { Context, useEffect, useState } from "react";
import { interpolate } from "./utils/animation";

export interface FlexibleHeaderPanelProps {
  height: number;
  expandedHeight: number;
  context?: Context<number>;
  scroll: number;
  title: string;
  icon?: JSX.Element;
}

export default function FlexibleHeaderPanel({
  height,
  expandedHeight,
  scroll,
  icon,
  title,
}: FlexibleHeaderPanelProps) {
  const [animate, setAnimation] = useState({
    height: expandedHeight,
    shadow: 0,
    fontSize: 24,
    title: {
      top: expandedHeight / 2,
      left: 155,
    },
    icon: {
      top: expandedHeight / 2,
      left: 50,
      opacity: 0.2,
      scale: 8,
      rotate: 10,
    },
  });

  useEffect(() => {
    const coef = expandedHeight - height;
    const offset = 1 - Math.max(coef - scroll, 0) / coef;
    const top = interpolate(offset, expandedHeight / 2, 16);
    setAnimation({
      height: expandedHeight - coef * offset,
      fontSize: interpolate(offset, 24, 16),
      shadow: interpolate(offset, 0, 8),
      title: {
        top,
        left: interpolate(offset, 155, 16 + 24 + 8),
      },
      icon: {
        top,
        left: interpolate(offset, 50, 16),
        opacity: interpolate(offset, 0.2, 1),
        scale: interpolate(offset, 8, 1),
        rotate: interpolate(offset, 10, 0),
      },
    });
  }, [scroll]);

  return (
    <header className="sticky w-full top-0">
      <div
        className="absolute w-full overflow-hidden bg-kitae-panel-bg"
        style={{
          height: animate.height,
          boxShadow: `0 0 ${animate.shadow}px rgba(0,0,0, 0.5)`,
        }}
      >
        <div
          className="absolute text-kitae-icon"
          style={{
            top: animate.icon.top,
            left: animate.icon.left,
            opacity: animate.icon.opacity,
            transform: `scale(${animate.icon.scale}) rotate(${animate.icon.rotate}deg)`,
          }}
        >
          {icon}
        </div>
        <div
          className="absolute"
          style={{
            fontSize: animate.fontSize,
            top: animate.title.top,
            left: animate.title.left,
          }}
        >
          {title}
        </div>
      </div>
    </header>
  );
}
