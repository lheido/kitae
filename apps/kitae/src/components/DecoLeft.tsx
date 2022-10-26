export const DecoLeft = () => {
  const width = window.innerWidth / 2;
  const angleX = width / 1.7;
  return (
    <svg width={width} height="206" viewBox={`0 0 ${width} 206`}>
      <defs>
        <linearGradient id="DecoLeftGradient" gradientUnits="userSpaceOnUse">
          <stop offset="5%" className="stop-color-primary-500" />
          <stop offset="95%" className="stop-color-secondary-500" />
        </linearGradient>
      </defs>
      <path
        d={`M0 2 H ${angleX} L ${width} 164`}
        fill="transparent"
        stroke="url(#DecoLeftGradient)"
        strokeWidth="4"
      />
      <path
        d={`M0 18 H ${angleX} L ${width} 180`}
        fill="transparent"
        stroke="url(#DecoLeftGradient)"
        strokeWidth="4"
      />
      <path
        d={`M0 33 H ${angleX} L ${width} 195`}
        fill="transparent"
        stroke="url(#DecoLeftGradient)"
        strokeWidth="4"
      />
    </svg>
  );
};
