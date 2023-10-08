import { FileIcon } from "lucide-react";

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

  return (
    <div className="mb-3 w-full">
      <div
        className="flex rounded-xl py-1 bg-gray-800 border hover:border hover:border-gray-700 border-transparent
       cursor-pointer transition-all duration-500 hover:scale-[1.005]"
        onClick={openFile}
      >
        <div className="flex justify-center items-center px-1 text-chinese-green">
          <FileIcon width="30" />
        </div>
        <div className="flex flex-col text-sm">
          <div>{filename || type}</div>
          <div className="text-xs text-gray-500">{type}</div>
        </div>
      </div>
    </div>
  );
}
