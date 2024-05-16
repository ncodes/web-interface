import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, Copy, Link, Share, Share2, X } from "lucide-react";
import moment from "moment";
import { useState } from "react";
import CopyToClipboard from "react-copy-to-clipboard";
import { useNavigate } from "react-router-dom";
import * as ReactShare from "react-share";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext";
import { useReferralService } from "../../../hooks/services/backend/useReferralService";
import useStore from "../../../hooks/store/useStore";
import { useToast } from "../../../hooks/useToast";
import EmojiAvatar from "../../avatar/EmojiAvatar";
import { AvatarSize } from "../../avatar/useAvatar";
import IconFriends from "../../icons/IconFriends";
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
import { InfoResult } from "./useTapSocketService";

export function RefDialog({ playerInfo }: { playerInfo: InfoResult }) {
  const { address } = useConnectorContext();
  const nav = useNavigate();
  const user = useStore((state) => state.user);
  const [open, setOpen] = useState(false);
  const [openDetails, setOpenDetails] = useState(false);
  const [curDetailId, setCurDetailId] = useState("");
  const { getRecentReferrees, getInfo } = useReferralService();
  const { simpleSuccess } = useToast();

  const recentRefsQuery = useQuery({
    queryKey: ["getRecentReferrees"],
    initialData: [],
    queryFn: getRecentReferrees,
    enabled: open,
  });

  const getReferredInfo = useQuery({
    queryKey: ["getReferredInfo", { address }],
    queryFn: getInfo,
    enabled: open,
  });

  if (!playerInfo) return null;

  function showDetail(id: string) {
    setCurDetailId(id);
    setOpenDetails(true);
  }

  function getMessage(platform: string) {
    switch (platform) {
      case "x":
        return `Hey Cadet! $JOIN the fight. \nCommand a ship in @0xJoint's new game.\n🎁 3K TAPs enlist reward.\n`;
      case "telegram":
        return `\nHey Cadet! $JOIN the fight. \nCommand a ship in @JointHQ's new game. \n🎁 3K TAPs enlist reward.\n`;
      default:
        return "Hey Cadet! $JOIN the fight. Command a ship in https://x.com/0xJoint new game. \n🎁 3K TAPs enlist reward.\n";
    }
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
            className="hover:bg-transparent h-auto p-0 hover:scale-110 hover:rotate-2"
          >
            <div className="flex w-[50px] xs:w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
              <span>
                <IconFriends width="20" className="" />
              </span>
              <span className="text-black font-jersey25 tracking-wider">
                Ref
              </span>
            </div>
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none w-[310px] xxs:w-[350px] md:w-[350px] sm:max-w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b border-gray-800 space-y-0">
            <DialogTitle className="text-center  text-black font-jersey20 text-2xl tracking-wide bg-gradient-to-b from-yellow-200  to-yellow-600 rounded-t-lg py-1">
              Referrals
            </DialogTitle>
            <DialogDescription className="text-gray-500 font-light px-2 py-2 text-center flex justify-center items-center gap-1">
              <IconFriends className="text-gray-100" width="20" />
              <span className="text-xl font-jersey25 text-gray-200">
                {getReferredInfo.data?.numReferred} Referrals
              </span>
            </DialogDescription>
          </DialogHeader>
          <div className="min-h-[200px]">
            {!user?.twitterUserId && !user?.discordId && (
              <div className="flex flex-col justify-center my-10 text-gray-400 font-light items-center">
                <span className="flex items-center gap-2">
                  <AlertTriangle size="14" />
                  <span>Social account not connected</span>
                </span>
                <Button
                  variant="link"
                  onClick={() => {
                    nav("/airdrop");
                  }}
                >
                  Go to Home to Connect
                </Button>
              </div>
            )}

            {(user?.twitterUserId || user?.discordId) && (
              <>
                <div className="px-5 pt-2 pb-0">
                  <Label className="text-gray-400 font-jersey25 text-xl tracking-wider">
                    Your Referral link
                  </Label>
                </div>

                <div className="flex p-1 m-2 mt-1 mb-1 gap-3">
                  <div className="flex-1 flex items-center p-2 gap-1 border rounded-xl border-gray-800">
                    <div className="">
                      <Link className="text-yellow-500 w-[25px] md:w-[35px]" />
                    </div>
                    <div className="flex w-full flex-col items-start justify-start font-jersey25 tracking-wider">
                      <div className="flex  w-full justify-between">
                        <span className="label text-gray-200 text-sm md:text-lg flex items-center">
                          <span className="font-mitr font-extralight">
                            https://jntl.ink/
                          </span>
                          <span>{user?.refCode}</span>
                          <CopyToClipboard
                            text={`https://jntl.ink/${user?.refCode}`}
                            onCopy={() => {
                              simpleSuccess("Copied", {
                                position: "top-center",
                              });
                            }}
                          >
                            <span className="text-gray-400 opacity-80 mr-2 hover:opacity-100 cursor-pointer hover:text-yellow-400 transition-all duration-300 active:scale-110">
                              <Copy className="w-4 inline-block ml-1 " />
                            </span>
                          </CopyToClipboard>
                        </span>
                        <div>
                          <Button
                            variant="ghost"
                            className="m-0 h-auto items-center flex gap-1 p-1 px-1 pl-0 pr-0 md:pr-4 md:pl-3 border border-transparent hover:bg-transparent hover:border hover:border-gray-500 hover:text-gray-100"
                            onClick={() => {
                              showDetail("share");
                            }}
                          >
                            <Share width="20" className="text-gray-200" />
                            <span className="text-lg hidden xxs:inline">
                              Share
                            </span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="px-5 pt-2 pb-0">
              <Label className="text-gray-400 font-jersey25 text-xl tracking-wider">
                My Referrals
              </Label>
            </div>

            <div className="flex pt-2 flex-col p-1 m-2 mt-1 mb-1 gap-3 overflow-auto h-[320px]">
              {recentRefsQuery.data.map((ref) => (
                <div className="flex gap-2 items-center">
                  <div className="bg-gray-600 rounded-full">
                    <EmojiAvatar
                      size={AvatarSize.Medium}
                      randomStr={ref.address}
                    />
                  </div>
                  <div className="text-sm">{ref.address}</div>
                  <div className="flex-1 text-right font-light text-xs text-gray-400">
                    {moment(ref.joinedAt).fromNow()}
                  </div>
                </div>
              ))}

              {recentRefsQuery.isSuccess &&
                recentRefsQuery.data.length == 0 && (
                  <div className="flex justify-center items-center h-full">
                    <Button
                      variant="ghost"
                      className="m-0 h-auto items-center flex gap-1 p-2 -mt-10 px-3 border border-gray-800 hover:bg-transparent hover:border hover:border-gray-500 hover:text-gray-100"
                      onClick={() => {
                        showDetail("share");
                      }}
                    >
                      <Share width="20" className="text-gray-200" />
                      <span className="text-lg">Share</span>
                    </Button>
                  </div>
                )}
            </div>
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

              {curDetailId === "share" && (
                <div className="absolute rounded-b-2xl w-full h-[70%] shadow-[0_-10px_20px_-15px_rgba(255,255,255,0.4)] rounded-t-2xl bg-black border-t border-gray-600 z-10 bottom-0">
                  <div className="w-full text-center p-2 text-xl font-jersey25">
                    Share
                  </div>
                  <div className="flex justify-center items-center mt-7 mb-5 w-24 p-2 rounded-2xl bg-yellow-900/30 mx-auto">
                    <Share2 size="60" className="text-yellow-500 " />
                  </div>
                  <div className="text-center text-sm p-5 pb-2 font-extralight tracking-wider">
                    Invite your friends to come play the game and receive up to
                    100,000,000 TAPS as reward.
                  </div>

                  <div className=" flex justify-center items-center mt-4 xs:mt-6">
                    <ul className="flex gap-2 ">
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.TwitterShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                          title={getMessage("x")}
                        >
                          <ReactShare.XIcon
                            size={32}
                            round
                            className="rounded-full"
                          />
                        </ReactShare.TwitterShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.TelegramShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                          title={getMessage("telegram")}
                        >
                          <ReactShare.TelegramIcon
                            size={32}
                            round
                            className="rounded-full"
                          />
                        </ReactShare.TelegramShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.WhatsappShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                          title={getMessage("whatsapp")}
                        >
                          <ReactShare.WhatsappIcon size={32} round />
                        </ReactShare.WhatsappShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.FacebookShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                        >
                          <ReactShare.FacebookIcon size={32} round />
                        </ReactShare.FacebookShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.FacebookMessengerShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                          appId="1089905982307068"
                        >
                          <ReactShare.FacebookMessengerIcon size={32} round />
                        </ReactShare.FacebookMessengerShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.LinkedinShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                          title={getMessage("linkedin")}
                        >
                          <ReactShare.LinkedinIcon size={32} round />
                        </ReactShare.LinkedinShareButton>
                      </li>
                      <li className="[&_svg]:hover:scale-150 [&_svg]:transition-all [&_svg]:duration-300">
                        <ReactShare.VKShareButton
                          url={`https://jntl.ink/${user?.refCode}`}
                        >
                          <ReactShare.VKIcon size={32} round />
                        </ReactShare.VKShareButton>
                      </li>
                    </ul>
                  </div>

                  <div className="text-center xs:px-3 md:px-10 text-xs font-extralight tracking-wider mt-4 xs:mt-5 text-gray-400">
                    Friends must connect their Twitter/X or Discord account to
                    be counted as a valid invite.
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
