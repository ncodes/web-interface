import { Cross1Icon } from "@radix-ui/react-icons";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import IconCoinGold from "../../icons/IconCoinGold";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";
import { Card, CardContent } from "../../ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Progress } from "../../ui/progress";

export function PlayerRank({ rank }: { rank: string }) {
  const [open, setOpen] = useState(false);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <div className="flex justify-center items-center mt-2 select-none">
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

        <DialogContent className="p-0 sm:min-w-[425px] sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-500  to-yellow-300 rounded-t-lg py-1">
              Rank
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-light px-2 py-2 text-center">
              Your rank is based on number of taps you made
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex justify-center items-center">
              <Carousel className="w-full max-w-xs [&_button]:active:bg-yellow-400">
                <CarouselContent className="p-5">
                  {Array.from({ length: 5 }).map((_, index) => (
                    <CarouselItem key={index} className="basis-full">
                      <div className="p-1">
                        <Card className="bg-black border-gray-800 text-gray-400">
                          <CardContent className="flex   aspect-square items-center justify-center p-6">
                            <span className="text-4xl font-semibold">
                              {index + 1}
                            </span>
                          </CardContent>
                        </Card>
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious
                  className="ml-5 disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-500"
                  variant="outline"
                />
                <CarouselNext className="mr-5" />
              </Carousel>
            </div>
            <div className="flex flex-col justify-center items-center px-10 pb-6 gap-2">
              <div className="flex gap-2 items-center">
                <span>
                  <IconCoinGold width="20" />
                </span>
                <span className="font-jersey25 text-2xl text-gray-300">
                  0 - 30,000
                </span>
              </div>
              <div className="block w-full bg-gray-900 border border-gray-800 p-1 rounded-full bg-gradient-to-b from-gray-900 to-gray-700">
                <Progress
                  value={50}
                  className="w-full h-4 
      bg-gray-900
      [&_.indicator]:border-t [&_.indicator]:border-yellow-100 [&_.indicator]:bg-gradient-to-b [&_.indicator]:from-gray-300 [&_.indicator]:via-gray-400 [&_.indicator]:to-gray-600 [&_.indicator]:rounded-full"
                />
              </div>
            </div>
          </div>
          <Cross1Icon
            className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-900"
            onClick={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
