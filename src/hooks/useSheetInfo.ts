import { useMediaQuery } from "usehooks-ts";

/**
 * useSheetHeight returns the height and the position of the sheet
 * @returns [height, position, styles]
 */
export function useSheetInfo(): [string, "right" | "bottom", string] {
  const isSm = useMediaQuery("(max-width: 640px)");
  return isSm
    ? [
        "h-[60vh]",
        "bottom",
        "rounded-t-2xl !border-l-0 border-t !border-t-gray-600",
      ]
    : ["h-full", "right", ""];
}
