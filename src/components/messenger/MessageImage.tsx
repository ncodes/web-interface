import { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "../ui/Dialog";

export function MessageImage({ type, data }: { type: string; data: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full mb-3">
      <Dialog
        open={open}
        onOpenChange={(open) => {
          setOpen(open);
        }}
      >
        <DialogTrigger asChild>
          <div className="w-full cursor-zoom-in hover:scale-[1.005] transition-all duration-500">
            <img src={`data:${type};base64,${data}`} alt={type} />
          </div>
        </DialogTrigger>
        <DialogContent
          className="flex py-4 items-center justify-center bg-transparent outline-none border-0 cursor-zoom-out"
          overlayClass="cursor-zoom-out"
          onClick={() => {
            setOpen(false);
          }}
        >
          <img src={`data:${type};base64,${data}`} alt={type} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
