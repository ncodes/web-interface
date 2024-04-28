import { ChevronRight, XIcon } from "lucide-react";
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
      <div className="flex justify-center items-center md:mt-2 select-none">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="p-0 h-auto hover:bg-transparent opacity-80 hover:opacity-100 hover:text-white"
          >
            <div className="tracking-wider font-abrilFatFace text-sm md:text-md text-gray-100">
              {rank}
            </div>
            <ChevronRight size="20" className="relative top-0.5 opacity-60" />
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 w-[310px] xxs:w-[350px] xs:w-[370px] sm:max-w-[425px] top-[10%] md:top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-900 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-500  to-yellow-300 rounded-t-lg py-1">
              Rank
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-light px-2 py-2 text-center text-xs xs:text-sm">
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
                        <Card className="bg-black border-transparent text-gray-400">
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
                  className="xs:scale-100 hover:border-yellow-500 hover:bg-yellow-500 ml-14 xs:ml-8 md:ml-10 disabled:bg-transparent disabled:text-gray-400 disabled:border-gray-500"
                  variant="outline"
                />
                <CarouselNext className="mr-14 xss:mr-9 xs:mr-8 md:mr-10 bg-transparent hover:border-yellow-500 hover:bg-yellow-500" />
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
      [&_.indicator]:border-t [&_.indicator]:border-green-500 [&_.indicator]:bg-gradient-to-b [&_.indicator]:from-green-300 [&_.indicator]:via-green-400 [&_.indicator]:to-green-600 [&_.indicator]:rounded-full"
                />
              </div>
            </div>
          </div>
          <XIcon
            className="absolute right-0 mr-2 top-2 cursor-pointer opacity-80 hover:opacity-100 text-gray-900"
            onClick={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
