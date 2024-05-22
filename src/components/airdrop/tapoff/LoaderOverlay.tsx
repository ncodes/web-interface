import { ReactNode } from "react";
import IconSpaceship from "../../icons/IconSpaceship.tsx";

export default function LoaderOverlay({ icon }: { icon?: ReactNode }) {
  if (!icon) {
    icon = (
      <IconSpaceship width="30" className="text-yellow-400 animate-spin" />
    );
  }

  return (
    <div className="absolute rounded-3xl rounded-t-none w-full bottom-0 h-full bg-black z-20 flex justify-center items-center">
      {icon}
    </div>
  );
}
