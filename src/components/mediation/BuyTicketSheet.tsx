import React, { useEffect, useState } from "react";
import useStore from "../../hooks/store/useStore.ts";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { StatCard } from "../market/StatCard.tsx";
import { Button } from "../ui/Button.tsx";

export function BuyTicketSheet(props: {
  children?: React.ReactNode;
  onOpen?: (open: boolean) => void;
}) {
  const [open, setOpen] = useState(false);
  const openState = useStore((state) => state.openState);
  const toggleOpenState = useStore((state) => state.toggleOpenState);

  useEffect(() => {
    setOpen(openState.buyTicketSheet ?? open);
  }, [openState.buyTicketSheet]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        props.onOpen && props.onOpen(open);
        toggleOpenState && toggleOpenState("buyTicketSheet");
      }}
    >
      <SheetTrigger>{props.children}</SheetTrigger>
      <SheetContent
        className="flex py-0 flex-col gap-0 justify-between w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <div className="flex-1">
          <SheetHeader className="flex pr-[50px] border-b border-gray-800">
            <div className="text-white">
              <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
                Purchase Ticket
              </SheetTitle>
            </div>
          </SheetHeader>
          <div className="px-3 text-white h-full mt-3">
            <div className="flex gap-2">
              <StatCard
                title={`Pool ID`}
                tip={`The unique ID of the pool this ticket will belong to.`}
              >
                1
              </StatCard>
              <StatCard
                title={`Ticket Price`}
                tip={`The unique ID of the pool this ticket will belong to.`}
              >
                450 <span className="text-gray-300">P2P</span>
              </StatCard>
            </div>
            <div className="flex gap-2 mt-2">
              <StatCard
                title={`Pool Bond`}
                tip={`The amount of security deposit required to join the pool.`}
              >
                35,400 <span className="text-gray-300">P2P</span>
              </StatCard>
              <StatCard
                title={`Total Cost`}
                tip={`The total ticket cost (ticket price + pool bond).`}
                className="border-chinese-green animate-pulse hover:animate-none"
              >
                35,850 <span className="text-gray-300">P2P</span>
              </StatCard>
            </div>
          </div>
          <div
            className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
            onClick={() => {
              toggleOpenState && toggleOpenState("buyTicketSheet");
            }}
          >
            <Cross2Icon className="h-6 w-6" />
            <span className="sr-only">Close</span>
          </div>
        </div>
        <div className="flex flex-col gap-1 text-white p-2 py-3 border-t border-gray-800">
          <Button variant="secondary" size="full">
            Unlock
          </Button>
          <Button size="full" disabled>
            Purchase
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
