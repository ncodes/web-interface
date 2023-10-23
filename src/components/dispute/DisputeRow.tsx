import {
  DotsVerticalIcon,
  LockOpen1Icon,
  TimerIcon,
} from "@radix-ui/react-icons";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CheckCircle,
  FileLock,
  FilePlus,
  FileQuestion,
  Gavel,
  UserPlus2,
  XCircle,
} from "lucide-react";
import moment from "moment/moment";
import { BaseSyntheticEvent, useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import { useUserService } from "../../hooks/services/backend/useUserService.ts";
import useDisputeManagerContract from "../../hooks/services/contracts/useDisputeManagerContract.ts";
import useStore from "../../hooks/store/useStore.ts";
import { useToast } from "../../hooks/useToast.tsx";
import {
  getDisputeOutcome,
  getDisputeStatus,
  isCommitter,
  isDisputeDraftee,
  isRevealer,
} from "../../libs/api_utils.ts";
import { delay, isDev } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { CountDown } from "../Countdown.tsx";
import { IDBadge } from "../IDBadge.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { UserHoverCard } from "../UserHoverCard.tsx";
import EmojiAvatar from "../avatar/EmojiAvatar.tsx";
import { AvatarSize } from "../avatar/useAvatar.tsx";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { InfoCard } from "../market/InfoCard.tsx";
import CommitVotePopOver from "../swap/CommitVotePopOver.tsx";
import RevealVotePopOver from "../swap/RevealVotePopOver.tsx";
import { Button } from "../ui/Button.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu.tsx";
import { ScrollAreaHorizontal } from "../ui/scroll-area.tsx";
import {
  DisputeStatusBadge,
  DisputeTipAbandoned,
  DisputeTipAwaitExec,
  DisputeTipCancelled,
  DisputeTipCommit,
  DisputeTipDraft,
  DisputeTipEvidence,
  DisputeTipReleased,
  DisputeTipReveal,
  DisputeTipStalled,
} from "./DisputeStatusBadge.tsx";

interface ButtonEnableState {
  commit: boolean;
  reveal: boolean;
}

export function DisputeRow({
  dispute,
  noFocus,
  className,
}: {
  dispute: Dispute;
  noFocus?: boolean;
  className?: string;
}) {
  const { address, getChainInfo } = useConnectorContext();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);
  const { getUser } = useUserService();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { commitVote, revealVote, humanizeErrors } =
    useDisputeManagerContract();
  const { notifySuccess, notifyError } = useToast();
  const setPageSwapState = useStore((state) => state.setPageSwapState);
  const [loading, setLoading] = useState<LoadingState>({});
  const [enableButtons, setEnableButtons] = useState<ButtonEnableState>({
    commit: false,
    reveal: false,
  });
  const [committed, setCommitted] = useState<boolean | undefined>(undefined);
  const [revealed, setRevealed] = useState<boolean | undefined>(undefined);

  const getDefendant = useQuery({
    queryKey: ["getUser", { address: dispute.defendant, noAuth: true }],
    queryFn: getUser,
    enabled: !!dispute.defendant,
  });

  const getCreator = useQuery({
    queryKey: ["getUser", { address: dispute.creator, noAuth: true }],
    queryFn: getUser,
    enabled: !!dispute.creator,
  });

  useInterval(
    () => {
      setCommitted(isCommitter(dispute, address));
    },
    committed == false ? 5000 : null
  );

  useInterval(
    () => {
      setRevealed(isRevealer(dispute, address));
    },
    revealed == false ? 5000 : null
  );

  async function doCommit(hash: string) {
    try {
      setLoading({ ...loading, commitVote: true });

      const [txHash] = await commitVote(
        dispute.orderId,
        dispute.ticketIndex,
        hash
      );
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Vote successfully committed`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      if (location.pathname.includes("disputes")) {
        await queryClient.refetchQueries(["getDisputesAsParticipant"]);
      } else if (location.pathname.includes("swap/")) {
        await queryClient.refetchQueries(["getSwap"]);
      }

      setCommitted(isCommitter(dispute, address));
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading({ ...loading, commitVote: false });
    }
  }

  async function doReveal(vote: string, hash: string) {
    try {
      setLoading({ ...loading, revealVote: true });

      const [txHash] = await revealVote(
        dispute.orderId,
        dispute.ticketIndex,
        vote,
        hash
      );
      await delay(5000);

      const explorer = getChainInfo().blockExplorer;
      notifySuccess(`Vote successfully revealed`, {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${explorer}/tx/${txHash}` },
        ],
      });

      if (location.pathname.includes("disputes")) {
        await queryClient.refetchQueries(["getDisputesAsParticipant"]);
      } else if (location.pathname.includes("swap/")) {
        await queryClient.refetchQueries(["getSwap"]);
      }

      setRevealed(isRevealer(dispute, address));
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading({ ...loading, revealVote: false });
    }
  }

  return (
    <div
      onClick={(e: BaseSyntheticEvent) => {
        const canTrigger = e.target.getAttribute("data-click-trigger");
        if (canTrigger && canTrigger == "1" && !noFocus) {
          // do something
        }
      }}
    >
      <div
        data-click-trigger="1"
        className={cn(
          "border bg-card-background border-card-border transition-all duration-300 rounded-xl border-b-gray-600",
          {
            "hover:border-chinese-green cursor-pointer": !noFocus,
          },
          className
        )}
      >
        {/* Level 1 */}
        <div className="flex flex-col md:flex-row" data-click-trigger="1">
          <div
            data-click-trigger="1"
            className="flex gap-2 p-5 px-3 md:px-3 py-0 items-center shrink-0 md:border-r border-gray-800"
          >
            <div className="flex w-full items-center gap-2 md:gap-2 md:px-0 md:py-2 pt-2 md:pt-2">
              <div className="flex ">
                <UserHoverCard user={getCreator?.data as User}>
                  <EmojiAvatar
                    size={AvatarSize.Small}
                    randomStr={dispute.creator}
                  />
                </UserHoverCard>
                <span className="-ml-1">
                  <UserHoverCard user={getDefendant?.data as User}>
                    <EmojiAvatar
                      size={AvatarSize.Small}
                      randomStr={dispute.defendant}
                    />
                  </UserHoverCard>
                </span>
              </div>
              <div className="flex md:flex-col text-sm gap-1 w-full justify-between md:justify-start">
                <span>
                  {dispute.creator.substring(0, 6)}{" "}
                  <span className="text-gray-400">vs</span>{" "}
                  {dispute.defendant.substring(0, 6)}
                </span>
                {/* STATUS */}
                <DisputeStatusBadge address={address} dispute={dispute} />
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-hidden shrink-0">
            <ScrollOverflowIndicator>
              <ScrollAreaHorizontal className="flex mr-[1px]">
                <div
                  className="flex-1 flex py-2 px-2 gap-2"
                  data-click-trigger="1"
                >
                  <InfoCard
                    title={`Disputer Request`}
                    tip={`The outcome the dispute creator is seeking (release or cancel)`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200">
                      {dispute.wantRelease ? "RELEASE" : "CANCEL"}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`No. of Mediators`}
                    tip={`The total number of mediators required for this dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 flex gap-2 items-center">
                      <span>{dispute.numMediators}</span>
                      <span className="font-light text-gray-400 text-sm">
                        ({dispute.numMediatorsDrafted} drafted)
                      </span>
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Current Phase`}
                    tip={`The current phase of the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 text-[13px]">
                      {getDisputeStatus(dispute) == "draft" && (
                        <>Drafting Mediators</>
                      )}
                      {getDisputeStatus(dispute) == "evidence" && (
                        <>Evidence Sharing</>
                      )}
                      {getDisputeStatus(dispute) == "commit" && (
                        <>Vote Commit</>
                      )}
                      {getDisputeStatus(dispute) == "reveal" && (
                        <>Vote Reveal</>
                      )}
                      {getDisputeStatus(dispute) == "abandoned" && (
                        <>Awaiting Execution</>
                      )}
                      {getDisputeStatus(dispute) == "awaiting_exec" && (
                        <>Awaiting Execution</>
                      )}
                      {["released", "stalled", "cancelled"].includes(
                        getDisputeStatus(dispute)
                      ) && <>Verdict Executed</>}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Next Phase`}
                    tip={`The next phase of the dispute`}
                    width="min-w-[160px]"
                  >
                    <span className="text-gray-200 text-[13px]">
                      {getDisputeStatus(dispute) == "draft" && (
                        <>Evidence Sharing</>
                      )}
                      {getDisputeStatus(dispute) == "evidence" && (
                        <>Vote Commit</>
                      )}
                      {getDisputeStatus(dispute) == "commit" && (
                        <>Vote Reveal</>
                      )}
                      {getDisputeStatus(dispute) == "reveal" && (
                        <>Awaiting Execution</>
                      )}
                      {getDisputeStatus(dispute) == "awaiting_exec" && <>-</>}
                      {getDisputeStatus(dispute) == "abandoned" && <>-</>}
                      {["released", "stalled", "cancelled"].includes(
                        getDisputeStatus(dispute)
                      ) && <>-</>}
                    </span>
                  </InfoCard>
                  <InfoCard
                    title={`Next Phase In`}
                    tip={`The countdown to the next phase of the dispute`}
                    width="w-[150px]"
                  >
                    {getDisputeStatus(dispute) == "draft" && <span>-</span>}
                    {getDisputeStatus(dispute) == "evidence" && (
                      <span>
                        <CountDown isoDate={dispute.evidenceEndAt} full />
                      </span>
                    )}
                    {getDisputeStatus(dispute) == "commit" && (
                      <span>
                        <CountDown isoDate={dispute.commitEndAt} full />
                      </span>
                    )}
                    {getDisputeStatus(dispute) == "reveal" && (
                      <span>
                        <CountDown isoDate={dispute.revealEndAt} full />
                      </span>
                    )}
                    {["awaiting_exec", "executed", "abandoned"].includes(
                      getDisputeStatus(dispute) || ""
                    ) && <span className="text-gray-200">-</span>}
                    {["released", "stalled", "cancelled"].includes(
                      getDisputeStatus(dispute)
                    ) && <>-</>}
                  </InfoCard>
                </div>
              </ScrollAreaHorizontal>
            </ScrollOverflowIndicator>
          </div>
        </div>

        {/* Level 2 */}
        <div className="border-t border-gray-800 text-gray-400 px-3 py-1 flex flex-col md:flex-row md:justify-between">
          {address && getDisputeStatus(dispute) == "abandoned" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" className="" />{" "}
              <ToolTip
                tip={
                  <DisputeTipAbandoned dispute={dispute} address={address} />
                }
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>Swap was released</span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "released" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <CheckCircle width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipReleased />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>Swap released by mediators</span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}
          {getDisputeStatus(dispute) == "cancelled" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <XCircle width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipCancelled />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>Swap was cancelled by mediators</span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "stalled" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <FileQuestion width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipStalled dispute={dispute} address={address} />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>No verdict reached</span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "draft" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <UserPlus2 width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipDraft dispute={dispute} />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>Mediators are being drafted</span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "evidence" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <FilePlus width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipEvidence dispute={dispute} address={address} />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                {isDisputeDraftee(dispute, address) ? (
                  <span>Ask swap counterparts for evidence</span>
                ) : (
                  <span>Send evidence to mediators</span>
                )}
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "commit" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <FileLock width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipCommit dispute={dispute} address={address} />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                {isDisputeDraftee(dispute, address) ? (
                  <span>Time to issue your verdict</span>
                ) : (
                  <span>Time for mediators to submit their decision</span>
                )}
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "reveal" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <LockOpen1Icon width="15" className="" />{" "}
              <ToolTip
                tip={<DisputeTipReveal dispute={dispute} address={address} />}
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                {isDisputeDraftee(dispute, address) ? (
                  <span>Reveal your verdict</span>
                ) : (
                  <span>Time for mediators to reveal their decision</span>
                )}
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          {getDisputeStatus(dispute) == "awaiting_exec" && (
            <span className="flex gap-1 text-xs items-center font-light tracking-wide">
              <Gavel width="15" className="" />{" "}
              <ToolTip
                tip={
                  <DisputeTipAwaitExec dispute={dispute} address={address} />
                }
                className="flex gap-1 w-full justify-between md:justify-start"
              >
                <span>
                  Awaiting verdict execution (
                  <span className="font-semibold tracking-wider">
                    {getDisputeOutcome(dispute).toUpperCase()})
                  </span>
                </span>
                <IconInfoCircle
                  width="15"
                  className="hidden xs:inline text-gray-300"
                />
              </ToolTip>
            </span>
          )}

          <span
            data-click-trigger="1"
            className="flex py-1 text-[12px] text-gray-400 gap-1 items-center tracking-wide font-light"
          >
            <span className="text-gray-500">
              <ToolTip
                tip={moment(dispute.createdAt).fromNow()}
                className="flex gap-1 items-center"
              >
                <span>
                  <TimerIcon />
                </span>
                <span>
                  {moment(dispute.createdAt)
                    .format("DD MMM YYYY, h:mm:ss a")
                    .toUpperCase()}
                </span>
              </ToolTip>
            </span>
            <IDBadge id={dispute.disputeId} tip="Dispute ID" />
          </span>
        </div>

        {/* Level 3 */}
        <div className="flex justify-between border-t border-card-border">
          <div data-click-trigger="1" className="pt-1 pl-1 flex gap-1">
            {["evidence", "commit"].includes(getDisputeStatus(dispute) || "") &&
              isDisputeDraftee(dispute, address) && (
                <CommitVotePopOver
                  modal={true}
                  disputeId={dispute.disputeId}
                  orderId={dispute.orderId}
                  ticketIndex={dispute.ticketIndex}
                  onActivate={(hash) => {
                    doCommit(hash).catch(console.error);
                  }}
                >
                  <Button
                    variant="secondary"
                    size="sm"
                    rounded="lg"
                    className="text-xs md:text-sm m-w-[110px]"
                    scale="sm"
                    disabled={
                      !enableButtons.commit ||
                      loading.commitVote ||
                      committed != undefined ||
                      isCommitter(dispute, address)
                    }
                  >
                    {!loading.commitVote && <>Commit</>}
                    {loading.commitVote && (
                      <>
                        <IconSpinner
                          width="20"
                          fill="fill-gray-900"
                          className="animate-spin"
                        />
                      </>
                    )}
                    <CountDown
                      wrapL="&nbsp;("
                      isoDate={dispute.evidenceEndAt}
                      onDone={() => {
                        setEnableButtons({ ...enableButtons, commit: true });
                      }}
                    />
                    {enableButtons.commit && (
                      <CountDown
                        wrapL="&nbsp;("
                        isoDate={dispute.commitEndAt}
                        onDone={() => {
                          setEnableButtons({ ...enableButtons, commit: false });
                        }}
                      />
                    )}
                  </Button>
                </CommitVotePopOver>
              )}

            {["commit", "reveal"].includes(getDisputeStatus(dispute) || "") &&
              isDisputeDraftee(dispute, address) && (
                <RevealVotePopOver
                  modal={true}
                  disputeId={dispute.disputeId}
                  orderId={dispute.orderId}
                  ticketIndex={dispute.ticketIndex}
                  onActivate={(vote: string, hash) => {
                    doReveal(vote, hash).catch(console.error);
                  }}
                >
                  <Button
                    size="sm"
                    rounded="lg"
                    className="text-xs md:text-sm m-w-[110px]"
                    scale="sm"
                    disabled={
                      (!enableButtons.reveal &&
                        getDisputeStatus(dispute) != "reveal") ||
                      loading.revealVote ||
                      revealed != undefined ||
                      isRevealer(dispute, address)
                    }
                  >
                    {!loading.revealVote && <>Reveal</>}
                    {loading.revealVote && (
                      <>
                        <IconSpinner
                          width="20"
                          fill="fill-gray-900"
                          className="animate-spin"
                        />
                      </>
                    )}
                    <CountDown
                      wrapL="&nbsp;("
                      headless={true}
                      isoDate={dispute.commitEndAt}
                      onDone={() => {
                        setEnableButtons({ ...enableButtons, reveal: true });
                      }}
                    />
                    {enableButtons.reveal && (
                      <CountDown
                        wrapL="&nbsp;("
                        isoDate={dispute.revealEndAt}
                        onDone={() => {
                          setEnableButtons({ ...enableButtons, reveal: false });
                          setPageSwapState({ revealPhaseEnded: true });
                        }}
                      />
                    )}
                  </Button>
                </RevealVotePopOver>
              )}
          </div>

          <div
            data-click-trigger="1"
            className="flex items-center lg:border-l border-gray-800 shrink-0 px-2"
          >
            <span className="hidden lg:inline border-r border-gray-800 shrink-0">
              <NavLink to={`/swap/${dispute.orderId}`}>
                <Button
                  variant="link"
                  rounded="none"
                  className={cn(
                    "text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1",
                    { hidden: location.pathname.match("^/swap") }
                  )}
                >
                  View Swap
                </Button>
              </NavLink>
            </span>
            <span className="hidden lg:inline border-gray-800 shrink-0">
              <NavLink to={`/my/tickets`}>
                <Button
                  variant="link"
                  rounded="none"
                  className="text-xs px-2 font-light text-gray-400 hover:text-chinese-green flex items-center gap-1"
                >
                  View Tickets
                </Button>
              </NavLink>
            </span>

            <span className="lg:hidden border-l border-gray-800">
              <DropdownMenu
                onOpenChange={(open) => {
                  setMoreMenuOpen(open);
                }}
              >
                <DropdownMenuTrigger className="outline-0 ring-0">
                  <span
                    className={cn(
                      "px-2 py-3 outline-0 ring-0 flex gap-1  items-center hover:scale-x-105 transition-all duration-100 hover:bg-transparent hover:text-chinese-green",
                      { "scale-x-105 text-chinese-green": moreMenuOpen }
                    )}
                  >
                    <DotsVerticalIcon />
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="shadow-xl drop-shadow-2xl rounded-xl bg-modal-background border-gray-600 text-gray-200 tracking-wide px-0 py-0">
                  <NavLink to={`/swap/${dispute.orderId}`}>
                    <DropdownMenuItem
                      className={cn("flex gap-2", {
                        hidden: location.pathname.match("^/swap"),
                      })}
                    >
                      View Swap
                    </DropdownMenuItem>
                  </NavLink>
                  <NavLink to={`/my/tickets`}>
                    <DropdownMenuItem className="flex gap-2">
                      View Tickets
                    </DropdownMenuItem>
                  </NavLink>
                </DropdownMenuContent>
              </DropdownMenu>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
