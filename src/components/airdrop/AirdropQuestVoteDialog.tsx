import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Eye } from "lucide-react";
import { useState } from "react";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService.ts";
import { useToast } from "../../hooks/useToast.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { DialogDescription, DialogTitle } from "../ui/Dialog.tsx";

type Vote = 0 | 1;

export function AirdropQuestVoteDialog({
  quest,
  requestDialogClose,
}: {
  quest: Quest;
  requestDialogClose: () => void;
}) {
  const { voteQuest } = useAirdropService();
  const [loading, setLoading] = useState({ yes: false, no: false });
  const { notifyError, notifySuccess } = useToast();
  const queryClient = useQueryClient();

  const voteQuestMut = useMutation({
    mutationFn: voteQuest,
  });

  async function doVote(vote: number) {
    const confirmMsg = `Are you sure you want to vote "${vote == 1 ? "YES" : "NO"}"`;
    const resp = confirm(confirmMsg);
    if (!resp) return;

    try {
      setLoading({ yes: vote == 1, no: vote == 0 });
      await voteQuestMut.mutateAsync({
        questId: quest.id,
        vote: vote as Vote,
      });
      setLoading({ yes: false, no: false });
      await queryClient.refetchQueries({ queryKey: ["getQuests"] });
      await queryClient.refetchQueries({ queryKey: ["getUser"] });
      notifySuccess("Vote submitted successfully");
      requestDialogClose();
    } catch (error) {
      setLoading({ yes: false, no: false });
      notifyError((error as Error).message);
    }
  }

  return (
    <>
      {(quest.parent.type == "tweet" ||
        quest.parent.type == "quote" ||
        quest.parent.type == "reply") && (
        <>
          <DialogTitle className="">
            Did @{quest.responder.twitterUsername} create the correct tweet?
          </DialogTitle>

          <DialogDescription className="text-gray-400 font-light [&_a]:text-chinese-green">
            Help the Joint community to verify if{" "}
            <a
              href={`https://x.com/${quest.responder.twitterUsername}`}
              target="_blank"
            >
              @{quest.responder.twitterUsername}
            </a>{" "}
            created a{" "}
            <>
              {quest.parent.type == "quote" && "quote"}{" "}
              {quest.parent.type == "reply" && "reply"} tweet{" "}
            </>
            {(quest.parent.account || quest.parent.tag) && <>that mentioned </>}
            <span className="font-medium text-gray-200">
              {quest.parent.account ? `@${quest.parent.account} ` : ""}
            </span>
            <span className="font-medium text-gray-200">
              {quest.parent.tag ? `${quest.parent.tag} ` : ""}
            </span>
          </DialogDescription>

          <Button
            variant="ghost"
            className="p-2 flex gap-2 rounded-xl justify-center items-center mt-2 hover:bg-transparent hover:text-gray-10 border hover:border hover:border-gray-700 border-gray-800"
            onClick={() => {
              window.open(quest.responderLink, "_blank");
            }}
          >
            <span>
              <Eye size="20" />
            </span>
            {quest.parent.type == "tweet" && <span>Check Tweet</span>}
            {quest.parent.type == "quote" && <span>Check Quote Tweet</span>}
            {quest.parent.type == "reply" && <span>Check Reply Tweet</span>}
          </Button>

          <div className="text-[14px] font-light text-gray-400 bg-gray-800 p-2 rounded">
            When you verify, {quest.parent.verifyBond} points will be deducted
            as security bond. On successful verification, the bond +{" "}
            <b>{quest.parent.verifyPoints}</b> points will be credited to you.
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => doVote(1)}
              disabled={loading.yes}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {!loading.yes && "YES"}
              {loading.yes && (
                <IconSpinner
                  width="20"
                  fill="fill-green-800"
                  className="animate-spin"
                />
              )}
            </Button>
            <Button
              onClick={() => doVote(0)}
              disabled={loading.no}
              variant="destructive"
              className="flex-1"
            >
              {!loading.no && "NO"}
              {loading.no && (
                <IconSpinner
                  width="20"
                  fill="fill-red-800"
                  className="animate-spin"
                />
              )}
            </Button>
          </div>
        </>
      )}

      {quest.parent.type == "follow" && (
        <>
          <DialogTitle className="">
            Did @{quest.responder.twitterUsername} follow @
            {quest.parent.account}?
          </DialogTitle>
          <DialogDescription className="text-gray-400 font-light [&_a]:text-chinese-green">
            Help the Joint community to verify if{" "}
            <a
              href={`https://x.com/${quest.responder.twitterUsername}`}
              target="_blank"
            >
              @{quest.responder.twitterUsername}
            </a>{" "}
            is following{" "}
            <a href={`https://x.com/${quest.parent.account}`} target="_blank">
              @{quest.parent.account}
            </a>
          </DialogDescription>
          <Button
            variant="ghost"
            className="p-2 flex gap-2 rounded-xl justify-center items-center mt-2 hover:bg-transparent hover:text-gray-10 border hover:border hover:border-gray-700 border-gray-800"
            onClick={() => {
              window.open(
                `https://x.com/${quest.responder.twitterUsername}/following`,
                "_blank",
              );
            }}
          >
            <span>
              <Eye size="20" />
            </span>
            <span>Check Following</span>
          </Button>

          <div className="text-[14px] font-light text-gray-400 bg-gray-800 p-2 rounded">
            When you verify, {quest.parent.verifyBond} points will be deducted
            as security bond. On successful verification, the bond +{" "}
            <b>{quest.parent.verifyPoints}</b> points will be credited to you.
          </div>

          <div className="flex gap-3">
            <Button
              onClick={() => doVote(1)}
              disabled={loading.yes}
              className="flex-1 bg-green-500 hover:bg-green-600 text-white"
            >
              {!loading.yes && "YES"}
              {loading.yes && (
                <IconSpinner
                  width="20"
                  fill="fill-green-800"
                  className="animate-spin"
                />
              )}
            </Button>
            <Button
              onClick={() => doVote(0)}
              disabled={loading.no}
              variant="destructive"
              className="flex-1"
            >
              {!loading.no && "NO"}
              {loading.no && (
                <IconSpinner
                  width="20"
                  fill="fill-red-800"
                  className="animate-spin"
                />
              )}
            </Button>
          </div>
        </>
      )}
    </>
  );
}
