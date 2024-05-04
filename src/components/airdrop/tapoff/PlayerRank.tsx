import { ChevronRight, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { shipImages } from "../../../constants";
import useImagePreloader from "../../../hooks/useImagePreloader";
import { toDec } from "../../../libs/helpers";
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
  CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../ui/carousel";
import { Progress } from "../../ui/progress";
import { RankInfo } from "./useTapSocketService";

export function PlayerRank({
  rank,
  rankInfo,
  tapCount,
}: {
  rank: string;
  rankInfo: RankInfo;
  tapCount: string;
}) {
  const { imagesPreloaded } = useImagePreloader(shipImages);
  const [api, setApi] = useState<CarouselApi>();
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState(rankInfo ? rank : "");
  const [next, setNext] = useState(getNextRank(rankInfo ? rank : ""));
  const [defaultSet, setDefaultSet] = useState(false);

  useEffect(() => {
    if (!api) {
      return;
    }

    api.on("select", () => {
      setSelected(getRank(api.selectedScrollSnap()));

      if (api.selectedScrollSnap() + 1 != getRanks().length) {
        setNext(getRanks()[api.selectedScrollSnap() + 1]);
      }
    });
  }, [api]);

  useEffect(() => {
    if (!api || defaultSet || !open) return;
    api.reInit({ active: true, startIndex: getRankIndex(selected) });
  }, [api, open, rankInfo]);

  function getNextRank(rank: string) {
    if (!rank) return "";
    const ranks = getRanks();
    const curRankIdx = getCurrentRankIndex();
    if (curRankIdx + 1 == ranks.length) return "";
    return ranks[curRankIdx + 1];
  }

  function getRankIndex(rank: string) {
    return getRanks().indexOf(rank);
  }

  function getCurrentRankIndex() {
    return getRanks().indexOf(rank);
  }

  function getRanks() {
    return Object.keys(rankInfo) || [];
  }

  function getRank(idx: number) {
    return getRanks()[idx];
  }

  function progessPct(max: number) {
    return toDec(tapCount).div(max).mul(100).toNumber();
  }

  if (!imagesPreloaded) return null;
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          api?.scrollTo(getCurrentRankIndex());
          setDefaultSet(false);
        }
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

        <DialogContent className="p-0 w-[310px] xxs:w-[350px] select-none xs:w-[370px] sm:max-w-[425px] top-[10%] md:top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className=" space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-500  to-yellow-300 rounded-t-lg py-1">
              Rank
            </DialogTitle>
            <DialogDescription className="text-gray-300 font-abrilFatFace tracking-wider font-light px-2 py-2 text-center text-xs xs:text-sm">
              Your rank is based on your TAP count
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="flex justify-center items-center">
              <Carousel
                setApi={setApi}
                className="w-full max-w-xs [&_button]:active:bg-yellow-400"
              >
                <CarouselContent className="p-5 pt-2">
                  {Object.keys(rankInfo).map((r, index) => (
                    <CarouselItem key={index} className="basis-full h-[220px]">
                      <div className="p-1">
                        <Card className="bg-black border-transparent text-gray-400">
                          <CardContent className="flex items-center justify-center p-6">
                            <span className="text-4xl font-semibold">
                              <img
                                src={`/images/rank-ships/${r}.png`}
                                className="h-[150px] select-none"
                              />
                              <div className="text-lg text-center tracking-wider text-gray-100 font-jersey25">
                                {r}
                              </div>
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
                  {rankInfo[selected].taps}{" "}
                  {selected != next ? <>- {rankInfo[next].taps - 1}</> : ""}
                </span>
              </div>
              {rank == selected && (
                <span className="text-blue-400 tracking-wider text-sm">
                  Current Rank
                </span>
              )}
              {rank != selected && (
                <div className="block w-full bg-gray-900 border border-gray-800 p-1 rounded-full bg-gradient-to-b from-gray-900 to-gray-700">
                  <Progress
                    value={progessPct(rankInfo[next]?.taps)}
                    className="w-full h-4 
      bg-gray-900
      [&_.indicator]:border-t [&_.indicator]:border-green-500 [&_.indicator]:bg-gradient-to-b [&_.indicator]:from-green-300 [&_.indicator]:via-green-400 [&_.indicator]:to-green-600 [&_.indicator]:rounded-full"
                  />
                </div>
              )}
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
