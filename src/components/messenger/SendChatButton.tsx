import { Send } from "lucide-react";
import { cn } from "../../libs/helpers.ts";
import { Button } from "../ui/Button.tsx";

export function SendChatButton({
  onSend,
  className,
  disabled,
}: {
  onSend: (() => void) | undefined;
  className?: string;
  disabled?: boolean;
}) {
  return (
    <Button
      variant="ghost"
      disabled={disabled}
      onClick={() => {
        onSend?.();
      }}
      className={cn(
        "p-0 px-2 relative top-1.5 left-1.5 h-auto hover:bg-transparent text-gray-400 hover:text-gray-200 hover:scale-110 active:text-chinese-green",
        className
      )}
    >
      <Send width="20" className="rotate-[45deg]" />
    </Button>
  );
}
