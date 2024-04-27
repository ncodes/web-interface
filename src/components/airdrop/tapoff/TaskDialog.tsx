import { CheckCircle, Globe, X } from "lucide-react";
import { useEffect, useState } from "react";
import { XIcon } from "react-share";
import { useToast } from "../../../hooks/useToast";
import { cn, formatToMoney, toDec } from "../../../libs/helpers";
import ScrollOverflowIndicator from "../../ScrollOverflowIndicator";
import IconCoinGold from "../../icons/IconCoinGold";
import IconFriends from "../../icons/IconFriends";
import IconRank from "../../icons/IconRank";
import IconSpinner from "../../icons/IconSpinner";
import IconTask from "../../icons/IconTask";
import { IconTelegram } from "../../icons/IconTelegram";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";
import { Progress } from "../../ui/progress";
import useTapSocketService, { InfoResult } from "./useTapSocketService";

const ranks = [
  "Cadet",
  "Ensign",
  "Lieutenant Jnr",
  "Lieutenant",
  "Commander",
  "Captain",
  "Commodore",
  "Rear Admiral",
  "Vice Admiral",
  "Admiral",
];

const defaultState = {
  x: false,
  telegram: false,
  webvisit: false,
  claiming: false,
  claimingCadet: false,
  claimingEnsign: false,
  ["claimingLieutenant Jnr"]: false,
  claimingLieutenant: false,
  claimingCommander: false,
  claimingCaptain: false,
  claimingCommodore: false,
  ["claimingRear Admiral"]: false,
  ["claimingVice Admiral"]: false,
  claimingAdmiral: false,
  claimingReferralBonus1: false,
  claimingReferralBonus3: false,
  claimingReferralBonus10: false,
  claimingReferralBonus25: false,
  claimingReferralBonus50: false,
  claimingReferralBonus100: false,
  claimingReferralBonus500: false,
  claimingReferralBonus1000: false,
  claimingReferralBonus10000: false,
  claimingReferralBonus100000: false,
};

export function TaskDialog({ playerInfo }: { playerInfo: InfoResult }) {
  const connectDiscordLink = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_DISCORD_CALLBACK_URL}&scope=identify+guilds+guilds.members.read&state=discord`;
  const { notifyError, simpleSuccess } = useToast();
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [loading, setLoading] = useState({ ...defaultState });
  const { markFollows, claimQuestsReward, claimRankBonus, claimReferralBonus } =
    useTapSocketService();
  const [xFollowError, setXFollowError] = useState("");
  const [xFollowErrorClicked, setXFollowErrorClicked] = useState(false);
  const [xFollowVerified, setXFollowVerified] = useState(false);
  const [telegramFollowError, setTelegramFollowError] = useState("");
  const [telegramFollowErrorClicked, setTelegramFollowErrorClicked] =
    useState(false);
  const [telegramFollowVerified, setTelegramFollowVerified] = useState(false);
  const [webVistError, setWebVisitError] = useState("");
  const [webVistErrorClicked, setWebVisitErrorClicked] = useState(false);
  const [webVistVerified, setWebVisitVerified] = useState(false);
  const [clicked, setClicked] = useState({ ...defaultState });
  const [selectedTab, setSelectedTab] = useState("socials");

  useEffect(() => {
    if (!open) {
      setSelectedTab("socials");
    }
  }, [open]);

  if (!playerInfo) return null;

  function verifyFollowX() {
    if (!xFollowErrorClicked) {
      setLoading({ ...loading, x: true });
      setXFollowErrorClicked(true);
      setTimeout(() => {
        setXFollowError("Failed. Did you follow us?");
        setLoading({ ...loading, x: false });
      }, 3000);
    } else {
      setLoading({ ...loading, x: true });
      setXFollowErrorClicked(false);
      setXFollowError("");
      setTimeout(() => {
        markFollows("x").then(() => {
          setLoading({ ...loading, x: false });
          setXFollowVerified(true);
          simpleSuccess("Action verified", { position: "top-center" });
        });
      }, 3000);
    }
  }

  function verifyFollowTelegram() {
    if (!telegramFollowErrorClicked) {
      setLoading({ ...loading, telegram: true });
      setTelegramFollowErrorClicked(true);
      setTimeout(() => {
        setTelegramFollowError("Failed. Did you join us?");
        setLoading({ ...loading, telegram: false });
      }, 3000);
    } else {
      setLoading({ ...loading, telegram: true });
      setTelegramFollowErrorClicked(false);
      setTelegramFollowError("");
      setTimeout(() => {
        markFollows("telegram").then(() => {
          setLoading({ ...loading, telegram: false });
          setTelegramFollowVerified(true);
          simpleSuccess("Action verified", { position: "top-center" });
        });
      }, 3000);
    }
  }

  function verifyWebVisit() {
    if (!webVistErrorClicked) {
      setLoading({ ...loading, webvisit: true });
      setWebVisitErrorClicked(true);
      setTimeout(() => {
        setWebVisitError("Failed. Did you visit us?");
        setLoading({ ...loading, webvisit: false });
      }, 3000);
    } else {
      setLoading({ ...loading, webvisit: true });
      setWebVisitErrorClicked(false);
      setWebVisitError("");
      setTimeout(() => {
        markFollows("webvisit").then(() => {
          setLoading({ ...loading, webvisit: false });
          setWebVisitVerified(true);
          simpleSuccess("Action verified", { position: "top-center" });
        });
      }, 3000);
    }
  }

  function doClaimRankBonus(rank: string) {
    setLoading({ ...loading, [`claiming${rank}`]: true });
    claimRankBonus(rank)
      .then(() => {
        setTimeout(() => {
          setLoading({ ...loading, [`claiming${rank}`]: false });
          simpleSuccess("Rank reward claimed", { position: "top-center" });
        }, 2000);
      })
      .catch(() => {
        setLoading({ ...loading, [`claiming${rank}`]: false });
        notifyError("Failed to claim rank bonus");
      });
  }

  function doClaimReferralBonus(count: number) {
    setLoading({ ...loading, [`claimingReferralBonus${count}`]: true });
    claimReferralBonus(count)
      .then(() => {
        setTimeout(() => {
          setLoading({ ...loading, [`claimingReferralBonus${count}`]: false });
          simpleSuccess("Referral reward claimed", { position: "top-center" });
        }, 2000);
      })
      .catch((e) => {
        setLoading({ ...loading, [`claimingReferralBonus${count}`]: false });
        console.log(e);
        notifyError("Failed to claim referral bonus");
      });
  }

  function claimSocialReward() {
    setLoading({ ...loading, claiming: true });
    claimQuestsReward()
      .then(() => {
        setTimeout(() => {
          setLoading({ ...loading, claiming: false });
          simpleSuccess("Social reward claimed", { position: "top-center" });
        }, 2000);
      })
      .catch(() => {
        setLoading({ ...loading, claiming: false });
        notifyError("Failed to claim social reward");
      });
  }

  function getRankPct(targetRank: string) {
    const rankInfo = playerInfo.rankInfo[targetRank];
    if (!rankInfo) return 0;
    const { taps } = rankInfo;
    if (toDec(taps).lt(playerInfo.tapCount)) return 100;
    return toDec(playerInfo.tapCount).div(taps).mul(100).toNumber();
  }

  return (
    <Dialog
      open={open}
      modal={true}
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
            className="hover:bg-transparent p-0 hover:scale-110 hover:-rotate-2"
          >
            <div
              className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r
   from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50"
            >
              <span>
                <IconTask width="20" className="" />
              </span>
              <span className="text-black font-jersey25 tracking-wider">
                Quests
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 select-none sm:min-w-[425px] sm:max-w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Quests
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-light px-2 py-5 text-center flex justify-center items-center gap-1">
              <ul className="flex gap-2">
                <li>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "border-none font-jersey25 text-lg hover:bg-gray-800 hover:text-gray-300",
                      {
                        "bg-yellow-500 text-gray-900 hover:bg-yellow-500 hover:text-gray-900":
                          selectedTab == "socials",
                      },
                    )}
                    onClick={() => {
                      setSelectedTab("socials");
                    }}
                  >
                    Socials
                  </Button>
                </li>
                <li>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "border-none font-jersey25 text-lg hover:bg-gray-800 hover:text-gray-300",
                      {
                        "bg-yellow-500 text-gray-900 hover:bg-yellow-500 hover:text-gray-900":
                          selectedTab == "rank",
                      },
                    )}
                    onClick={() => {
                      setSelectedTab("rank");
                    }}
                  >
                    Ranks
                  </Button>
                </li>

                <li>
                  <Button
                    size="sm"
                    variant="outline"
                    className={cn(
                      "border-none font-jersey25 text-lg hover:bg-gray-800 hover:text-gray-300",
                      {
                        "bg-yellow-500 text-gray-900 hover:bg-yellow-500 hover:text-gray-900":
                          selectedTab == "referrals",
                      },
                    )}
                    onClick={() => {
                      setSelectedTab("referrals");
                    }}
                  >
                    Referrals
                  </Button>
                </li>
              </ul>
            </DialogDescription>
          </DialogHeader>
          <ScrollOverflowIndicator
            side="bottom"
            disabled={selectedTab == "socials"}
          >
            <div className=" max-h-[400px] overflow-auto">
              {selectedTab == "socials" && (
                <div className="pb-5">
                  <div className="px-5 py-3 text-center font-light border-b border-gray-900 tracking-wide text-sm text-gray-400">
                    <div className="flex items-center flex-col justify-center p-1 py-1 border border-gray-800 rounded-full w-[200px] mx-auto">
                      <span className="text-gray-300 font-jersey25 text-md">
                        Reward
                      </span>
                      <span className="flex gap-1">
                        <IconCoinGold className="text-gray-100" width="20" />{" "}
                        <span className="font-medium text-xl text-yellow-200">
                          {formatToMoney(playerInfo.followQuestReward)}
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="px-5 pt-4 pb-0 flex flex-col gap-3">
                    <div className="flex gap-2 items-center border rounded-full px-1 pl-0.5  border-gray-800">
                      <Button
                        variant="ghost"
                        disabled={playerInfo.isDiscordConnected}
                        className="flex border-none flex-1 gap-2 text-left justify-start p-0 hover:bg-transparent hover:text-gray-100 hover:scale-[1.02]"
                        onClick={() => {
                          window.open(
                            "https://jntl.ink/joint-discord",
                            "_blank",
                          );
                        }}
                      >
                        <div className="rounded-full pl-2">
                          <img
                            src="/public/images/airdrop-icons/discord.svg"
                            className="h-[20px] w-[25px]"
                          />
                        </div>
                        <div className="text-md font-medium tracking-wider">
                          <div>Join our Discord Community</div>
                        </div>
                      </Button>
                      <div className="text-right font-light text-xs text-gray-400">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={playerInfo.isDiscordConnected}
                          className={cn(
                            "px-5 bg-gradient-to-b border-none transition-all duration-300 hover:scale-[1.02]",
                            {
                              "from-green-400 to-green-600":
                                !playerInfo.isDiscordConnected,
                              "bg-transparent text-gray-400":
                                playerInfo.isDiscordConnected,
                            },
                          )}
                          onClick={() => {
                            window.open(connectDiscordLink, "_blank");
                          }}
                        >
                          {playerInfo.isDiscordConnected ? (
                            <>
                              <CheckCircle size="20" />
                            </>
                          ) : (
                            "Verify"
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center border rounded-full px-1 pl-2 border-gray-800">
                      <div className="flex flex-1 gap-2 items-center">
                        <Button
                          variant="ghost"
                          disabled={playerInfo.markedTwitterFollow}
                          className="flex h-auto flex-1 gap-1 border-none text-left justify-start p-0 hover:bg-transparent hover:text-gray-100 hover:scale-[1.02]"
                          onClick={() => {
                            window.open("https://x.com/0xJoint", "_blank");
                            setClicked({ ...clicked, x: true });
                          }}
                        >
                          <div className="rounded-full">
                            <XIcon
                              size="32"
                              className="relative -left-1 h-[40px] rounded-2xl"
                            />
                          </div>
                          <div className="text-md font-medium tracking-wider">
                            <div>Follow us on X</div>
                            {xFollowError && (
                              <div className="text-red-500 text-xs pb-1 font-extralight">
                                {xFollowError}
                              </div>
                            )}
                          </div>
                        </Button>
                      </div>
                      <div className="text-right font-light text-xs text-gray-400">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={
                            playerInfo.markedTwitterFollow || !clicked.x
                          }
                          className={cn(
                            "px-5 bg-gradient-to-b border-none transition-all duration-300 hover:scale-[1.02]",
                            {
                              "from-green-400 to-green-600":
                                !playerInfo.markedTwitterFollow,
                              "bg-transparent text-gray-400":
                                playerInfo.markedTwitterFollow,
                            },
                          )}
                          onClick={verifyFollowX}
                        >
                          {!xFollowVerified &&
                            !loading.x &&
                            !playerInfo.markedTwitterFollow && (
                              <>
                                {!xFollowError &&
                                  !xFollowErrorClicked &&
                                  "Verify"}
                                {xFollowErrorClicked &&
                                  !xFollowError &&
                                  "Verifying"}
                                {xFollowErrorClicked &&
                                  xFollowError &&
                                  "Verify"}
                              </>
                            )}

                          {((xFollowVerified && !loading.x) ||
                            playerInfo.markedTwitterFollow) && (
                            <>
                              <CheckCircle size="20" />
                            </>
                          )}

                          {loading.x && (
                            <IconSpinner
                              width="20"
                              className="text-gray-800 animate-spin"
                            />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center border rounded-full px-1 pl-0.5 py-1 border-gray-800">
                      <div className="flex flex-1 gap-2 items-center">
                        <Button
                          variant="ghost"
                          disabled={playerInfo.markedTelegramFollow}
                          className="flex h-auto flex-1 gap-1 border-none text-left justify-start p-0 hover:bg-transparent hover:text-gray-100 hover:scale-[1.02]"
                          onClick={() => {
                            window.open("https://t.me/jointproto", "_blank");
                            setClicked({ ...clicked, telegram: true });
                          }}
                        >
                          <div className="rounded-full">
                            <IconTelegram className="w-[33px] h-[33px]" />
                          </div>
                          <div className="text-md font-medium tracking-wider">
                            <div>Join our Telegram channel</div>
                            {telegramFollowError && (
                              <div className="text-red-500 text-xs pb-1 font-extralight">
                                {telegramFollowError}
                              </div>
                            )}
                          </div>
                        </Button>
                      </div>
                      <div className="text-right font-light text-xs text-gray-400">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={
                            playerInfo.markedTelegramFollow || !clicked.telegram
                          }
                          className={cn(
                            "px-5 bg-gradient-to-b border-none transition-all duration-300 hover:scale-[1.02]",
                            {
                              "from-green-400 to-green-600":
                                !playerInfo.markedTelegramFollow,
                              "bg-transparent text-gray-400":
                                playerInfo.markedTelegramFollow,
                            },
                          )}
                          onClick={verifyFollowTelegram}
                        >
                          {!telegramFollowVerified &&
                            !loading.telegram &&
                            !playerInfo.markedTelegramFollow && (
                              <>
                                {!telegramFollowError &&
                                  !telegramFollowErrorClicked &&
                                  "Verify"}
                                {telegramFollowErrorClicked &&
                                  !telegramFollowError &&
                                  "Verifying"}
                                {telegramFollowErrorClicked &&
                                  telegramFollowError &&
                                  "Verify"}
                              </>
                            )}

                          {((telegramFollowVerified && !loading.telegram) ||
                            playerInfo.markedTelegramFollow) && (
                            <>
                              <CheckCircle size="20" />
                            </>
                          )}

                          {loading.telegram && (
                            <IconSpinner
                              width="20"
                              className="text-gray-800 animate-spin"
                            />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div className="flex gap-2 items-center border rounded-full px-1 pl-0.5 py-1 border-gray-800">
                      <div className="flex flex-1 gap-2 items-center">
                        <Button
                          variant="ghost"
                          disabled={playerInfo.markedWebVisitFollow}
                          className="flex h-auto flex-1 gap-1 border-none text-left justify-start p-0 hover:bg-transparent hover:text-gray-100 hover:scale-[1.02]"
                          onClick={() => {
                            window.open("https://joint.exchange", "_blank");
                            setClicked({ ...clicked, webvisit: true });
                          }}
                        >
                          <div className="rounded-full mr-[4px] ml-1">
                            <Globe size="25" className="h-[33px]" />
                          </div>
                          <div className="text-md font-medium tracking-wider">
                            <div>Visit our website</div>
                            {webVistError && (
                              <div className="text-red-500 text-xs pb-1 font-extralight">
                                {webVistError}
                              </div>
                            )}
                          </div>
                        </Button>
                      </div>
                      <div className="text-right font-light text-xs text-gray-400">
                        <Button
                          variant="default"
                          size="sm"
                          disabled={
                            playerInfo.markedWebVisitFollow || !clicked.webvisit
                          }
                          className={cn(
                            "px-5 bg-gradient-to-b border-none transition-all duration-300 hover:scale-[1.02]",
                            {
                              "from-green-400 to-green-600":
                                !playerInfo.markedWebVisitFollow,
                              "bg-transparent text-gray-400":
                                playerInfo.markedWebVisitFollow,
                            },
                          )}
                          onClick={verifyWebVisit}
                        >
                          {!webVistVerified &&
                            !loading.webvisit &&
                            !playerInfo.markedWebVisitFollow && (
                              <>
                                {!webVistError &&
                                  !webVistErrorClicked &&
                                  "Verify"}
                                {webVistErrorClicked &&
                                  !webVistError &&
                                  "Verifying"}
                                {webVistErrorClicked &&
                                  webVistError &&
                                  "Verify"}
                              </>
                            )}

                          {((webVistVerified && !loading.webvisit) ||
                            playerInfo.markedWebVisitFollow) && (
                            <>
                              <CheckCircle size="20" />
                            </>
                          )}

                          {loading.webvisit && (
                            <IconSpinner
                              width="20"
                              className="text-gray-800 animate-spin"
                            />
                          )}
                        </Button>
                      </div>
                    </div>

                    <div>
                      <Button
                        size="full"
                        disabled={
                          !playerInfo.followQuestCompleted ||
                          playerInfo.followQuestBonusAwarded ||
                          loading.claiming
                        }
                        className="px-5 hover:scale-105 transition-all duration-300 bg-gradient-to-b border-none from-yellow-400 to-yellow-600 mt-2"
                        onClick={claimSocialReward}
                      >
                        {!loading.claiming && (
                          <>
                            {!playerInfo.followQuestBonusAwarded &&
                              "Claim Reward"}
                            {playerInfo.followQuestBonusAwarded && "Claimed"}
                          </>
                        )}

                        {loading.claiming && (
                          <>
                            <IconSpinner className="w-[20px] animate-spin text-gray-800" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {selectedTab == "rank" && (
                <div className="divide-y divide-gray-900">
                  {Object.keys(playerInfo.rankInfo).map((rank, i) => (
                    <div>
                      <div
                        key={i}
                        className="flex gap-2 items-center p-2 px-5 pl-3  border-gray-800"
                      >
                        <div className="rounded-full pl-2">
                          <IconRank width="35" className="text-gray-700" />
                        </div>
                        <div className="text-md font-light tracking-wider ">
                          <div className="font-medium">{rank}</div>
                          <div className="text-gray-400 text-xs flex gap-1 items-center">
                            <IconCoinGold
                              className="text-gray-100"
                              width="20"
                            />
                            {playerInfo.rankInfo[rank].reward}
                          </div>
                        </div>
                        <div className="text-right flex-1 font-light text-xs text-gray-400">
                          <Button
                            variant="default"
                            size="sm"
                            className="px-5 hover:scale-105 transition-all duration-300 bg-gradient-to-b border-none from-yellow-400 to-yellow-600"
                            disabled={
                              toDec(playerInfo.rankInfo[rank].taps).gt(
                                playerInfo.tapCount,
                              ) ||
                              playerInfo.rankBonusClaimStatus[rank] ||
                              loading[`claiming${rank}`]
                            }
                            onClick={() => {
                              doClaimRankBonus(rank);
                            }}
                          >
                            {!loading[`claiming${rank}`] && (
                              <>
                                {!playerInfo.rankBonusClaimStatus[rank] &&
                                  "Claim"}
                                {playerInfo.rankBonusClaimStatus[rank] &&
                                  "Claimed"}
                              </>
                            )}
                            {loading[`claiming${rank}`] && (
                              <IconSpinner
                                width="20"
                                className="text-gray-800 animate-spin"
                              />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="px-5 pb-2">
                        {getRankPct(rank) != 100 && (
                          <>
                            <Progress
                              value={getRankPct(rank)}
                              className="w-full h-3 bg-gray-900 border border-gray-700/50  [&_.indicator]:border-green-500 [&_.indicator]:bg-gradient-to-b [&_.indicator]:from-green-300 [&_.indicator]:via-green-400 [&_.indicator]:to-green-600 [&_.indicator]:rounded-full"
                            />
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {selectedTab == "referrals" && (
                <div className="divide-y divide-gray-900">
                  {playerInfo.referralInfo.map((info, i) => (
                    <div>
                      <div
                        key={i}
                        className="flex gap-2 items-center p-2 px-5 pl-3  border-gray-800"
                      >
                        <div className="rounded-full pl-2">
                          <IconFriends width="35" className="text-gray-700" />
                        </div>
                        <div className="text-md font-light tracking-wider ">
                          <div className="text-sm font-medium">
                            Invite {info.count} friend
                            {info.count > 1 ? "s" : ""}
                          </div>
                          <div className="text-gray-400 text-xs flex gap-1 items-center">
                            <IconCoinGold
                              className="text-gray-100"
                              width="20"
                            />
                            {info.reward}
                          </div>
                        </div>
                        <div className="text-right flex-1 font-light text-xs text-gray-400">
                          <Button
                            variant="default"
                            size="sm"
                            className="px-5 hover:scale-105 transition-all duration-300 bg-gradient-to-b border-none from-yellow-400 to-yellow-600"
                            disabled={
                              playerInfo.claimableReferrals < info.count ||
                              loading[`claimingReferralBonus${info.count}`]
                            }
                            onClick={() => {
                              doClaimReferralBonus(info.count);
                            }}
                          >
                            {playerInfo.claimableReferrals < info.count ? (
                              "Claim"
                            ) : (
                              <>
                                {loading[
                                  `claimingReferralBonus${info.count}`
                                ] ? (
                                  <IconSpinner
                                    width="20"
                                    className="text-gray-800 animate-spin"
                                  />
                                ) : (
                                  <>Claim</>
                                )}
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </ScrollOverflowIndicator>
          <X
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
