export const DecoRight = () => {
  const width = window.innerWidth / 2;
  return (
    <svg width={width} height="44" viewBox={`0 0 ${width} 44`}>
      <defs>
        <linearGradient id="DecoRightGradient" gradientUnits="userSpaceOnUse">
          <stop offset="5%" stopColor="#1D8660" />
          <stop offset="95%" stopColor="#1D6686" />
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
