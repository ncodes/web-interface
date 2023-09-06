import { shortenAddress } from "../libs/helpers.ts";

export function ShortenAddress(props: {
  address: string;
  className?: string;
  suffix?: string;
}) {
  return (
    <span className={props.className}>
      {shortenAddress(props.address)}
      {props.suffix}
    </span>
  );
}
