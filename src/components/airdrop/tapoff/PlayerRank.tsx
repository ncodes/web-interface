import { Cross1Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";

export function PlayerRank({ rank }: { rank: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <div className="flex justify-center items-center mt-2">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent opacity-80 hover:opacity-100 hover:text-white"
          >
            <div className="tracking-wider font-abrilFatFace text-lg text-gray-100">
              {rank}
            </div>
            <ChevronRight size="20" className="relative top-0.5 opacity-60" />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle className="text-center font-jersey20 text-2xl tracking-wide">
              Rank
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              Share a link to your twitter post so other community members
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </div>
    </Dialog>
  );
}
