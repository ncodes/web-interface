import { FileIcon } from "lucide-react";
import { Button } from "../ui/Button";

export function MessageFile({
  data,
  type,
  filename,
}: {
  data: string;
  type: string;
  filename: string;
}) {
  function openFile() {
    const blob = new Blob([Buffer.from(data, "base64")], { type: type });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.target = "_blank";
    link.click();
  }

  function shortName(name: string) {
    if (name.length > 31) {
      return name.substring(0, 31) + "...";
    }
    return name;
  }

  return (
    <div className="mb-3 w-full">
      <Button
        variant="ghost"
        className="w-full px-0 flex  text-left justify-start rounded-xl h-auto hover:text-gray-300 !bg-gray-800 border hover:border hover:border-gray-700 border-transparent
       cursor-pointer transition-all duration-500 hover:scale-[1.005]"
        onClick={openFile}
      >
        <div className="flex justify-center items-center px-1 text-chinese-green">
          <FileIcon width="30" />
        </div>
        <div className="flex flex-col text-sm">
          <div>{shortName(filename || type)}</div>
          <div className="text-xs text-gray-500">{type}</div>
        </div>
      </Button>
    </div>
  );
}
