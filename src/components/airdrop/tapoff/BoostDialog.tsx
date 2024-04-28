import { ExternalLink, Fan, LucideFlame, X } from "lucide-react";
import moment from "moment";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../../../hooks/useToast";
import { formatToMoney, toDec } from "../../../libs/helpers";
import { CountDown } from "../../Countdown";
import ScrollOverflowIndicator from "../../ScrollOverflowIndicator";
import IconCoinGold from "../../icons/IconCoinGold";
import IconConflict from "../../icons/IconConflict";
import IconSpinner from "../../icons/IconSpinner";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";
import { Label } from "../../ui/label";
import { ScrollArea } from "../../ui/scroll-area";
import useTapSocketService, { InfoResult } from "./useTapSocketService";

export function BoostDialog({ playerInfo }: { playerInfo: InfoResult }) {
  const navigate = useNavigate();
  const defaultBoostState = {
    rapidFire: false,
    instantCool: false,
    hyperFire: false,
    antiOverheat: false,
    hyperCool: false,
    multiplier: false,
  };
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [curDetailId, setCurDetailId] = useState("");
  const {
    applyInstantCool,
    applyRapidFire,
    buyHyperFire,
    buyAntiOverheat,
    buyHyperCool,
    applyMultiplier,
  } = useTapSocketService();
  const [loading, setLoading] = useState({ ...defaultBoostState });
  const [done, setDone] = useState({ ...defaultBoostState });
  const { simpleSuccess } = useToast();

  useEffect(() => {
    if (!open || !openDetails) {
      setLoading({ ...defaultBoostState });
      setDone(defaultBoostState);
    }
  }, [open, openDetails]);

  if (!playerInfo) return null;

  function showDetail(id: string) {
    setCurDetailId(id);
    setOpenDetails(true);
  }

  function doApplyRapidFire() {
    if (playerInfo.rapidFire.numUsed >= playerInfo.rapidFire.maxPerWindow)
      return;

    setLoading({ ...loading, rapidFire: true });
    applyRapidFire()
      .then(() => {
        setDone({ ...done, rapidFire: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Rapid Fire Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, rapidFire: false });
      });
  }

  function doApplyInstantCool() {
    if (playerInfo.instantCool.numUsed >= playerInfo.instantCool.maxPerWindow)
      return;

    setLoading({ ...loading, instantCool: true });
    applyInstantCool()
      .then(() => {
        setDone({ ...done, instantCool: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Instant Cool Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, instantCool: false });
      });
  }

  function doBuyHyperFire() {
    if (toDec(playerInfo.hyperFire.nextLevelCost).gt(playerInfo.tapCount))
      return;

    setLoading({ ...loading, hyperFire: true });
    buyHyperFire()
      .then(() => {
        setDone({ ...done, hyperFire: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Hyper Fire Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, hyperFire: false });
      });
  }

  function doBuyAntiOverheat() {
    if (toDec(playerInfo.antiOverheat.nextLevelCost).gt(playerInfo.tapCount))
      return;

    setLoading({ ...loading, antiOverheat: true });
    buyAntiOverheat()
      .then(() => {
        setDone({ ...done, antiOverheat: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Anti Overheat Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, antiOverheat: false });
      });
  }

  function doBuyHyperCool() {
    if (toDec(playerInfo.hyperCool.nextLevelCost).gt(playerInfo.tapCount))
      return;

    setLoading({ ...loading, hyperCool: true });
    buyHyperCool()
      .then(() => {
        setDone({ ...done, hyperCool: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Hyper Cool Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, hyperCool: false });
      });
  }

  function doApplyMultiplier() {
    if (toDec(playerInfo.multiplier.balance).lte(1)) return;

    setLoading({ ...loading, multiplier: true });
    applyMultiplier(playerInfo.multiplier.balance)
      .then(() => {
        setDone({ ...done, multiplier: true });
        setTimeout(() => {
          setOpenDetails(false);
          setOpen(false);
          simpleSuccess("Tap Multiplier Applied", { position: "top-center" });
        }, 2000);
      })
      .finally(() => {
        setLoading({ ...loading, multiplier: false });
      });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (openDetails) {
          setOpenDetails(false);
        }
      }}
    >
      <div className="flex justify-center items-center select-none">
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            className="hover:bg-transparent p-0 hover:scale-110 hover:rotate-2"
          >
            <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
              <span>
                <LucideFlame />
              </span>
              <span className="text-black font-jersey25 tracking-wider">
                Boost
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none w-[310px] xxs:w-[350px] sm:max-w-[425px] top-[10%] md:top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Boost
            </DialogTitle>
            <DialogDescription className="hidden md:flex text-gray-500 font-light px-2 py-2 text-center justify-center items-center gap-1">
              <IconCoinGold width="20" />
              <span className="text-xl font-jersey25 text-yellow-200">
                {formatToMoney(playerInfo.tapCount)}
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[200px]">
            <div className="px-5 pt-2 pb-0">
              <Label className="text-gray-400 font-jersey25 text-xl tracking-wider">
                Daily Boosters
              </Label>
            </div>

            <div className="flex p-1 m-2 mt-1 mb-1 gap-3">
              <Button
                variant="ghost"
                className="flex-1 block p-0 m-0 h-auto border-none hover:bg-transparent border-none "
                disabled={
                  playerInfo.rapidFire.numUsed ==
                  playerInfo.rapidFire.maxPerWindow
                }
                onClick={() => {
                  showDetail("rapid-fire");
                }}
              >
                <div className="flex-1 flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                  <div className="">
                    <IconConflict width="35" className="fill-yellow-500 " />
                  </div>
                  <div className="flex flex-col items-start justify-start font-jersey25 tracking-wider">
                    <span className="label text-gray-200 text-sm xs:text-lg">
                      Rapid Fire
                    </span>
                    {playerInfo.rapidFire.numUsed <
                      playerInfo.rapidFire.maxPerWindow && (
                      <span className="text-gray-400 font-abrilFatFace block relative -top-1">
                        {playerInfo.rapidFire.maxPerWindow -
                          playerInfo.rapidFire.numUsed}
                        /{playerInfo.rapidFire.maxPerWindow}
                      </span>
                    )}
                    {playerInfo.rapidFire.numUsed ==
                      playerInfo.rapidFire.maxPerWindow && (
                      <span className="text-gray-400 font-abrilFatFace block relative -top-1">
                        use in{" "}
                        <CountDown
                          full={true}
                          isoDate={moment(playerInfo.rapidFire.lastUsedAt)
                            .add(playerInfo.rapidFire.windowDur, "s")
                            .toISOString()}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </Button>

              <Button
                variant="ghost"
                className="flex-1 block p-0 border-none m-0 h-auto hover:bg-transparent border-none"
                onClick={() => {
                  showDetail("instant-cool");
                }}
                disabled={
                  playerInfo.instantCool.numUsed ==
                  playerInfo.instantCool.maxPerWindow
                }
              >
                <div className="flex-1 flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                  <div className="">
                    <Fan size="35" className="text-yellow-500" />
                  </div>
                  <div className="flex flex-col items-start justify-start font-jersey25 tracking-wider">
                    <span className="label text-gray-200 xs:text-lg">
                      Instant Cool
                    </span>
                    {playerInfo.instantCool.numUsed <
                      playerInfo.instantCool.maxPerWindow && (
                      <span className="text-gray-400 font-abrilFatFace block relative -top-1">
                        {playerInfo.instantCool.maxPerWindow -
                          playerInfo.instantCool.numUsed}
                        /{playerInfo.instantCool.maxPerWindow}
                      </span>
                    )}
                    {playerInfo.instantCool.numUsed ==
                      playerInfo.instantCool.maxPerWindow && (
                      <span className="text-gray-400 font-abrilFatFace block relative -top-1">
                        use in{" "}
                        <CountDown
                          full={true}
                          isoDate={moment(playerInfo.instantCool.lastUsedAt)
                            .add(playerInfo.instantCool.windowDur, "s")
                            .toISOString()}
                        />
                      </span>
                    )}
                  </div>
                </div>
              </Button>
            </div>

            <div className="px-5 pt-2 pb-0">
              <Label className="text-gray-400 font-jersey25 text-xl tracking-wider">
                Boosters
              </Label>
            </div>

            <ScrollOverflowIndicator side="bottom">
              <ScrollArea type="scroll" className="h-[250px] md:h-[280px]">
                <div className="[&_button]:w-full space-y-2  p-1 m-2 mt-1 overflow-auto">
                  <Button
                    variant="ghost"
                    className="flex-1 block p-0 m-0 h-auto hover:bg-transparent border-none"
                    onClick={() => {
                      showDetail("hyper-fire");
                    }}
                  >
                    <div className="flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                      <div className="">
                        <img width="40" src="/images/hyper_fire.svg" />
                      </div>
                      <div className="flex w-full flex-col font-jersey25 tracking-wider gap-1">
                        <span className="w-full label flex justify-between text-gray-200 text-lg">
                          <span>Hyper Fire</span>
                          <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <IconCoinGold width="20" />
                            <span>2000</span>
                            <span className="text-gray-400">(Lvl: 2)</span>
                          </span>
                        </span>
                        <span className="flex font-['Mitr'] font-light text-xs text-gray-400 relative -top-1">
                          Get more TAPs for one tap.
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex-1 block p-0 m-0 h-auto hover:bg-transparent border-none"
                    onClick={() => {
                      showDetail("anti-overheat");
                    }}
                  >
                    <div className="flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                      <div className="">
                        <img width="40" src="/images/icon_multi_ice.svg" />
                      </div>
                      <div className="flex w-full flex-col font-jersey25 tracking-wider gap-1">
                        <span className="w-full label flex justify-between text-gray-200 text-lg">
                          <span>Anti-Overheat</span>
                          <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <IconCoinGold width="20" />
                            <span>2000</span>
                            <span className="text-gray-400">(Lvl: 2)</span>
                          </span>
                        </span>
                        <span className="flex font-['Mitr'] font-light text-xs text-gray-400 relative -top-1">
                          Increase the overheat limit.
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex-1 block p-0 m-0 h-auto hover:bg-transparent border-none"
                    onClick={() => {
                      showDetail("hyper-cool");
                    }}
                  >
                    <div className="flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                      <div className="">
                        <img
                          width="40"
                          src="/images/icon_engine_cold_oil.svg"
                        />
                      </div>
                      <div className="flex w-full flex-col font-jersey25 tracking-wider gap-1">
                        <span className="w-full label flex justify-between text-gray-200 text-lg">
                          <span>Hyper Cool</span>
                          <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <IconCoinGold width="20" />
                            <span>2000</span>
                            <span className="text-gray-400">(Lvl: 2)</span>
                          </span>
                        </span>
                        <span className="flex font-['Mitr'] font-light text-xs text-gray-400 relative -top-1">
                          Fast recovery from overheat.
                        </span>
                      </div>
                    </div>
                  </Button>

                  <Button
                    variant="ghost"
                    className="flex-1 block p-0 m-0 h-auto hover:bg-transparent border-none"
                    onClick={() => {
                      showDetail("tap-multiplier");
                    }}
                  >
                    <div className="flex items-center p-2 gap-2 border rounded-xl transition-all duration-500 cursor-pointer border-gray-800 hover:border-yellow-400 [&_.label]:hover:text-yellow-400 hover:scale-[1.01]">
                      <div className="">
                        <img width="40" src="/images/icon_coin_x10.svg" />
                      </div>
                      <div className="flex w-full flex-col font-jersey25 tracking-wider gap-1">
                        <span className="w-full label flex justify-between text-gray-200 text-lg">
                          <span>Tap Multiplier</span>
                          <span className="flex items-center gap-1 text-gray-300 text-sm">
                            <img src="/images/icon_coin_usdc.svg" width="18" />
                            <span>100</span>
                            <span className="text-gray-400">(per 10x)</span>
                          </span>
                        </span>
                        <span className="flex font-['Mitr'] font-light text-xs text-gray-400 relative -top-1">
                          Multiply your overall TAPs
                        </span>
                      </div>
                    </div>
                  </Button>
                </div>
              </ScrollArea>
            </ScrollOverflowIndicator>
          </div>

          <X
            className="absolute right-0 mr-2 top-2 cursor-pointer opacity-80 hover:opacity-100 text-gray-900"
            onClick={() => {
              setOpen(false);
            }}
          />

          {openDetails && (
            <>
              <div
                className="absolute w-full h-[92%] bottom-0 rounded-b-2xl backdrop-blur-[2px] z-0 bg-gray-500/10"
                onClick={() => {
                  setOpenDetails(false);
                }}
              ></div>

              {curDetailId === "rapid-fire" && (
                <div className="absolute rounded-b-2xl w-full h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Apply Rapid Fire
                  </div>
                  <div className="flex justify-center items-center mt-6 md:mt-10 mb-5 w-24 p-2 rounded-2xl bg-yellow-900/30 mx-auto">
                    <IconConflict className="fill-yellow-500 w-[50px] md:w-[70px]" />
                  </div>
                  <div className="text-center text-sm md:text-lg p-4 md:p-10 font-extralight tracking-wider">
                    For 20 seconds, multiply each TAP you get from one tap by
                    5x.
                  </div>
                  <div className="mx-10">
                    <Button
                      className="w-full bg-gradient-to-b from-yellow-300 to-yellow-600   transition-all duration-200 hover:scale-[1.02]"
                      disabled={loading.rapidFire || done.rapidFire}
                      onClick={() => {
                        doApplyRapidFire();
                      }}
                    >
                      {loading.rapidFire && (
                        <IconSpinner
                          width="20"
                          className="animate-spin text-gray-800"
                        />
                      )}

                      {!done.rapidFire ? (
                        <> {!loading.rapidFire && <>Apply</>}</>
                      ) : (
                        <>Done</>
                      )}
                    </Button>
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}

              {curDetailId === "instant-cool" && (
                <div className="absolute rounded-b-2xl w-full h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Apply Instant Cool
                  </div>
                  <div className="flex justify-center items-center mt-5 md:mt-10 mb-5 w-24 p-2 rounded-2xl bg-yellow-900/30 mx-auto">
                    <Fan className="text-yellow-500 w-[50px] h-[60px] md:w-[70px] md:h-[80px]" />
                  </div>
                  <div className="text-center text-sm md:text-lg p-5 md:p-10 font-extralight tracking-wider">
                    Instantly recover from overheat.
                  </div>
                  <div className="mx-10">
                    <Button
                      className="w-full text-lg bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                      disabled={loading.instantCool || done.instantCool}
                      onClick={() => {
                        doApplyInstantCool();
                      }}
                    >
                      {loading.instantCool && (
                        <IconSpinner
                          width="20"
                          className="animate-spin text-gray-900"
                        />
                      )}

                      {!done.instantCool ? (
                        <> {!loading.instantCool && <>Apply</>}</>
                      ) : (
                        <>Done</>
                      )}
                    </Button>
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}

              {curDetailId === "hyper-fire" && (
                <div className="absolute flex flex-col gap-2 rounded-b-2xl w-full h-[80%] md:h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Buy Hyper Fire
                  </div>
                  <div className="flex justify-center items-center mt-2 mb-5 w-24 p-4 rounded-2xl bg-yellow-900/30 mx-auto">
                    <img width="40" src="/images/hyper_fire.svg" />
                  </div>
                  <div className="text-center text-sm px-10 pb-1 font-extralight tracking-wider">
                    Increase the amount of TAPs you get from one tap.
                  </div>
                  <div className="text-center font-extralight tracking-wider pb-1 md:pb-5 font-jersey20">
                    +1 per tap for each level
                  </div>
                  <div className="text-center gap-1 flex justify-center items-center tracking-wider pb-2 md:pb-5 font-jersey20">
                    {playerInfo.hyperFire.nextLevelCost ? (
                      <>
                        <span>
                          <IconCoinGold width="20" />
                        </span>
                        <span className="text-xl">
                          {playerInfo.hyperFire.nextLevelCost}
                        </span>
                        <span>for</span>
                        <span className="text-yellow-200">
                          {" "}
                          Level {playerInfo.hyperFire.level + 1}
                        </span>
                      </>
                    ) : (
                      <span>
                        No new level (current: {playerInfo.hyperFire.level})
                      </span>
                    )}
                  </div>
                  <div className="mx-10">
                    {playerInfo.hyperFire.nextLevelCost && (
                      <>
                        {toDec(playerInfo.tapCount).gte(
                          playerInfo.hyperFire.nextLevelCost,
                        ) ? (
                          <Button
                            className="w-full text-lg bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                            disabled={loading.hyperFire || done.hyperFire}
                            onClick={() => {
                              doBuyHyperFire();
                            }}
                          >
                            {loading.hyperFire && (
                              <IconSpinner
                                width="20"
                                className="animate-spin text-gray-800"
                              />
                            )}

                            {!done.hyperFire ? (
                              <> {!loading.hyperFire && <>Buy</>}</>
                            ) : (
                              <>Done</>
                            )}
                          </Button>
                        ) : (
                          <span className="block text-center tracking-wider text-gray-600">
                            Insufficient Balance
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}

              {curDetailId === "anti-overheat" && (
                <div className="absolute flex flex-col gap-2 rounded-b-2xl w-full h-[80%] md:h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Buy Anti-Overheat
                  </div>
                  <div className="flex justify-center items-center mt-2 mb-5 w-24 p-4 rounded-2xl bg-gray-900 mx-auto">
                    <img width="40" src="/images/icon_multi_ice.svg" />
                  </div>
                  <div className="text-center px-5 md:px-10 pb-1 font-extralight tracking-wider">
                    Increase the overheat limit.
                  </div>
                  <div className="text-center font-extralight tracking-wider pb-2 md:pb-5 font-jersey20">
                    +500 per level
                  </div>
                  <div className="text-center gap-1 flex justify-center items-center tracking-wider pb-4 md:pb-5 font-jersey20">
                    {playerInfo.antiOverheat.nextLevelCost ? (
                      <>
                        <span>
                          <IconCoinGold width="20" />
                        </span>
                        <span className="text-xl">
                          {playerInfo.antiOverheat.nextLevelCost}
                        </span>
                        <span>for</span>
                        <span className="text-yellow-200">
                          {" "}
                          Level {playerInfo.antiOverheat.level + 1}
                        </span>
                      </>
                    ) : (
                      <span>
                        No new level (current: {playerInfo.antiOverheat.level})
                      </span>
                    )}
                  </div>
                  <div className="mx-10">
                    {playerInfo.antiOverheat.nextLevelCost && (
                      <>
                        {toDec(playerInfo.tapCount).gte(
                          playerInfo.antiOverheat.nextLevelCost,
                        ) ? (
                          <Button
                            className="w-full text-lg bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                            disabled={loading.antiOverheat || done.antiOverheat}
                            onClick={() => {
                              doBuyAntiOverheat();
                            }}
                          >
                            {loading.antiOverheat && (
                              <IconSpinner
                                width="20"
                                className="animate-spin text-gray-800"
                              />
                            )}

                            {!done.antiOverheat ? (
                              <> {!loading.antiOverheat && <>Buy</>}</>
                            ) : (
                              <>Done</>
                            )}
                          </Button>
                        ) : (
                          <span className="block text-center tracking-wider text-gray-600">
                            Insufficient Balance
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}

              {curDetailId === "hyper-cool" && (
                <div className="absolute flex flex-col gap-2 rounded-b-2xl w-full h-[80%] md:h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Buy Hyper Cool
                  </div>
                  <div className="flex justify-center items-center mt-2 mb-5 w-24 p-4 rounded-2xl bg-red-900/30 mx-auto">
                    <img width="40" src="/images/icon_engine_cold_oil.svg" />
                  </div>
                  <div className="text-center px-2 md:px-10 pb-1 font-extralight tracking-wider">
                    Fast recovery from overheat.
                  </div>
                  <div className="text-center font-extralight tracking-wider pb-2 md:pb-5 font-jersey20">
                    +1 per second for each level
                  </div>
                  <div className="text-center gap-1 flex justify-center items-center tracking-wider pb-4 md:pb-5 font-jersey20">
                    {playerInfo.hyperCool.nextLevelCost ? (
                      <>
                        <span>
                          <IconCoinGold width="20" />
                        </span>
                        <span className="text-xl">
                          {playerInfo.hyperCool.nextLevelCost}
                        </span>
                        <span>for</span>
                        <span className="text-yellow-200">
                          {" "}
                          Level {playerInfo.hyperCool.level + 1}
                        </span>
                      </>
                    ) : (
                      <span>
                        No new level (current: {playerInfo.hyperCool.level})
                      </span>
                    )}
                  </div>
                  <div className="mx-10">
                    {playerInfo.hyperCool.nextLevelCost && (
                      <>
                        {toDec(playerInfo.tapCount).gte(
                          playerInfo.hyperCool.nextLevelCost,
                        ) ? (
                          <Button
                            className="w-full text-lg bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                            disabled={loading.hyperCool || done.hyperCool}
                            onClick={() => {
                              doBuyHyperCool();
                            }}
                          >
                            {loading.hyperCool && (
                              <IconSpinner
                                width="20"
                                className="animate-spin text-gray-800"
                              />
                            )}

                            {!done.hyperCool ? (
                              <> {!loading.hyperCool && <>Buy</>}</>
                            ) : (
                              <>Done</>
                            )}
                          </Button>
                        ) : (
                          <span className="block text-center tracking-wider text-gray-600">
                            Insufficient Balance
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}

              {curDetailId === "tap-multiplier" && (
                <div className="absolute flex flex-col gap-1.5 rounded-b-2xl w-full h-[90%] md:h-[80%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Buy Tap Multiplier
                  </div>
                  <div className="flex justify-center items-center mt-2 mb-5 w-24 p-4 rounded-2xl bg-yellow-900/30 mx-auto">
                    <img
                      src="/images/icon_coin_x10.svg"
                      className="w-[30px] md:w-[40px]"
                    />
                  </div>
                  <div className="text-center px-10 pb-1 font-extralight tracking-wider">
                    Multiply your overall TAPs.
                  </div>
                  <div className="text-center font-extralight tracking-wider pb-1 md:pb-3 font-jersey20">
                    Apply once per 12 hours
                  </div>
                  <div className="text-center gap-1 flex justify-center items-center tracking-wider pb-1 font-jersey20">
                    <span>
                      <img src="/images/icon_coin_usdc.svg" width="18" />
                    </span>
                    <span className="text-xl">100 USDC</span>
                    <span>per</span>
                    <span className="text-green-400"> 10x</span>
                  </div>
                  <div className="text-center gap-1 flex justify-center items-center tracking-wider pb-1 md:pb-5 font-jersey20">
                    <span className="text-gray-400">Balance:</span>
                    <span className="text-xl">
                      {formatToMoney(
                        parseFloat(playerInfo.multiplier.balance) || "0",
                      )}
                    </span>
                  </div>
                  <div className="mx-10">
                    <Button
                      className="w-full text-lg gap-1 bg-gradient-to-b from-yellow-300 to-yellow-600 transition-all duration-200 hover:scale-[1.02]"
                      onClick={() => {
                        navigate(
                          `/liquidity/${import.meta.env.VITE_DISCORD_TAPOFF_MULTIPLIER_MKT}/${import.meta.env.VITE_DISCORD_TAPOFF_MULTIPLIER_PROVIDER}/${import.meta.env.VITE_DISCORD_TAPOFF_MULTIPLIER_LID}`,
                        );
                      }}
                    >
                      Buy <ExternalLink size="15" />
                    </Button>
                    <Button
                      className="w-full text-lg bg-gradient-to-b mt-3 from-green-300 to-green-600 transition-all duration-200 hover:scale-[1.02]"
                      disabled={
                        !playerInfo.multiplier.canSpend ||
                        loading.multiplier ||
                        done.multiplier
                      }
                      onClick={() => {
                        doApplyMultiplier();
                      }}
                    >
                      {loading.multiplier && (
                        <IconSpinner
                          width="20"
                          className="animate-spin text-gray-900"
                        />
                      )}

                      {!done.multiplier ? (
                        <>
                          {!loading.multiplier && (
                            <>
                              {(playerInfo.multiplier.canSpend ||
                                playerInfo.multiplier.balance) && <>Apply</>}
                              {!playerInfo.multiplier.canSpend &&
                                playerInfo.multiplier.balance != "0" && (
                                  <span className="flex items-center gap-2">
                                    <span>Apply in</span>
                                    <CountDown
                                      full={true}
                                      isoDate={
                                        playerInfo.multiplier
                                          .curWindowEndsAt as string
                                      }
                                    />
                                  </span>
                                )}
                            </>
                          )}
                        </>
                      ) : (
                        <>Done</>
                      )}
                    </Button>
                  </div>

                  <X
                    className="absolute right-0 mr-3 top-3 cursor-pointer opacity-80 hover:opacity-100 text-gray-100"
                    onClick={() => {
                      setOpenDetails(false);
                    }}
                  />
                </div>
              )}
            </>
          )}
        </DialogContent>
      </div>
    </Dialog>
  );
}
