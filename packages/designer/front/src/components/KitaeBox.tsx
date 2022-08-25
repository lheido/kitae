export const KitaeBox = (props: { children: JSX.Element[] | JSX.Element }) => (
  <div className="relative p-1 bg-gradient-to-r from-kitae-start to-kitae-end rounded-2xl w-[339px] h-[399px] flex">
    <div className="flex flex-col justify-center items-center gap-11 bg-neutral-900 rounded-2xl flex-1">
      {props.children}
    </div>
  </div>
);
