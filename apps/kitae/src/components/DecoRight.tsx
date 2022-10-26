export const DecoRight = () => {
  const width = window.innerWidth / 2;
  return (
    <svg width={width} height="44" viewBox={`0 0 ${width} 44`}>
      <defs>
        <linearGradient id="DecoRightGradient" gradientUnits="userSpaceOnUse">
          <stop offset="5%" className="stop-color-secondary-500" />
          <stop offset="95%" className="stop-color-primary-500" />
        </linearGradient>
      </defs>
      <path
        d={`M0 2 H${width}`}
        fill="none"
        stroke="url(#DecoRightGradient)"
        strokeWidth="4"
      />
      <path
        d={`M0 18 H${width}`}
        fill="none"
        stroke="url(#DecoRightGradient)"
        strokeWidth="4"
      />
      <path
        d={`M0 33 H${width}`}
        fill="none"
        stroke="url(#DecoRightGradient)"
        strokeWidth="4"
      />
    </svg>
  );
};
