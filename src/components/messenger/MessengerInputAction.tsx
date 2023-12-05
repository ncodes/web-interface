import { ReactNode } from "react";
import { Button } from "../ui/Button.tsx";

export function MessengerInputAction({
  children,
  disabled,
  onClick,
}: {
  children: ReactNode;
  disabled?: boolean;
  onClick?: () => void;
}) {
  return (
    <Button
      variant="link"
      className="p-0 h-auto"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="text-gray-400 hover:text-gray-100 transition-all duration-500 cursor-pointer">
        {children}
      </span>
    </Button>
  );
}
