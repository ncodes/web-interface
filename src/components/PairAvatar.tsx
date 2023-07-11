export function PairAvatar(props: { baseSrc: string; quoteSrc: string }) {
  return (
    <div className="flex [&>img]:w-[30px] ">
      <img src={props.baseSrc} alt="btc" className="z-[2]" />
      <img src={props.quoteSrc} alt="uni" className="relative -ml-1 z-[1]" />
    </div>
  );
}
