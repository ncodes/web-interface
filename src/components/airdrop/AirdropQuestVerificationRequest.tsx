import { Cross1Icon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "lucide-react";
import { ReactNode, useState } from "react";
import countryList from "react-select-country-list";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService.ts";
import { useToast } from "../../hooks/useToast.tsx";
import Input2 from "../Input2.tsx";
import Select2 from "../Select2.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/Dialog.tsx";
import { SelectItem } from "../ui/select.tsx";
import { AirdropQuestVoteDialog } from "./AirdropQuestVoteDialog.tsx";

export function AirdropQuestVerificationRequest({
  children,
  quest,
}: {
  children: ReactNode;
  quest: Quest;
}) {
  const [open, setOpen] = useState(false);
  const { createQuestVerifyRequest, applyForPresale, verifySwap } =
    useAirdropService();
  const [link, setLink] = useState("");
  const [country, setCountry] = useState("");
  const { notifyError, notifySuccess } = useToast();
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createQuestVerifyRequestMut = useMutation({
    mutationFn: createQuestVerifyRequest,
  });

  const applyForPresaleMut = useMutation({
    mutationFn: applyForPresale,
  });

  const verifySwapMut = useMutation({
    mutationFn: verifySwap,
  });

  async function createReqVerify() {
    if (!confirm("Are you sure you want to continue?")) return;

    try {
      if (!link && quest.type != "follow") {
        notifyError("Enter a tweet link");
        return;
      }

      setLoading(true);
      await createQuestVerifyRequestMut.mutateAsync({
        questId: quest.id,
        link,
      });

      notifySuccess("Request created successfully");
      setLoading(false);
      setOpen(false);
      setLink("");
    } catch (error) {
      setLoading(false);
      const msg = (error as unknown as { message: string }).message;
      notifyError(msg);
    }
  }

  async function doApplyPresale() {
    if (!confirm("Are you sure you want to continue?")) return;

    try {
      if (!country) {
        notifyError("Select your country");
        return;
      }

      setLoading(true);
      await applyForPresaleMut.mutateAsync({
        countryCode: country,
      });

      await queryClient.refetchQueries({ queryKey: ["getUser"] });
      await queryClient.refetchQueries({ queryKey: ["getQuests"] });

      notifySuccess("Application successful");
      setLoading(false);
      setOpen(false);
      setCountry("");
    } catch (error) {
      setLoading(false);
      const msg = (error as unknown as { message: string }).message;
      notifyError(msg);
    }
  }

  async function doVerifySwap() {
    if (!confirm("Are you sure you want to continue?")) return;

    try {
      setLoading(true);
      await verifySwapMut.mutateAsync({
        questId: quest.id,
      });

      await queryClient.refetchQueries({ queryKey: ["getUser"] });
      await queryClient.refetchQueries({ queryKey: ["getQuests"] });

      notifySuccess("Verification was successful");
      setLoading(false);
      setOpen(false);
    } catch (error) {
      setLoading(false);
      const msg = (error as unknown as { message: string }).message;
      notifyError(msg);
    }
  }

  function getAllowedPresaleCountry() {
    const countries = countryList().getData();

    const restricted = [
      "Afghanistan",
      "Angola",
      "Azerbaijan",
      "Bahamas",
      "Bosnia and Herzegovina",
      "Botswana",
      "Burundi",
      "Cambodia",
      "Cameroon",
      "Canada",
      "Chad",
      "China",
      "Congo (Congo-Brazzaville)",
      "Cuba",
      "Democratic Republic of the Congo",
      "Ethiopia",
      "Eritrea",
      "Iran",
      "Iraq",
      "Lebanon",
      "Libya",
      "Myanmar",
      "Nicaragua",
      "North Korea",
      "Somalia",
      "South Sudan",
      "Sudan",
      "Syria",
      "United States",
      "United States Minor Outlying Islands",
      "Venezuela, Bolivarian Republic of",
      "Yemen",
      "Zimbabwe",
      "Puerto Rico",
      "American Samoa",
      "Baker Island",
      "Guam",
      "Virgin Islands, U.S.",
      "Northern Mariana Islands",
    ];

    return countries.filter((country) => {
      return !restricted.includes(country.label);
    });
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <DialogTrigger asChild>{children}</DialogTrigger>

      {quest.type == "tweet" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle className="">Verify Tweet</DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              Share a link to your twitter post so other community members can
              verify your engagement. <b>{quest.engageBond}</b> points will be
              deducted as security bond and returned if your tweet is
              successfully verified.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div>Tweet Link</div>
            <div className="mt-2">
              <Input2
                placeholder="Paste link (ex. https://x.com/0xJoint/status/177...)"
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
              />
            </div>
            <div className="mt-3">
              <Button
                size="full"
                disabled={loading || !link}
                onClick={createReqVerify}
              >
                {!loading && <>Submit</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "follow" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle className="">Verify Following</DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              A verification request will be created so other community members
              can verify your action. <b>{quest.engageBond}</b> points will be
              deducted as security bond and returned if your action is
              successfully verified.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div className="">
              <Button size="full" disabled={loading} onClick={createReqVerify}>
                {!loading && <>Submit</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "quote" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle className="">Verify Quote Tweet</DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              A verification request will be created so other community members
              can verify your action. <b>{quest.engageBond}</b> points will be
              deducted as security bond and returned if your action is
              successfully verified.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div>Quote Link</div>
            <div className="mt-2">
              <Input2
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                placeholder="Paste link (ex. https://x.com/0xJoint/status/177...)"
              />
            </div>
            <div className="mt-3">
              <Button
                size="full"
                disabled={loading || !link}
                onClick={createReqVerify}
              >
                {!loading && <>Submit</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "reply" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle className="">Verify Reply Tweet</DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              A verification request will be created so other community members
              can verify your action. <b>{quest.engageBond}</b> points will be
              deducted as security bond and returned if your action is
              successfully verified.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div>Reply Link</div>
            <div className="mt-2">
              <Input2
                value={link}
                onChange={(e) => {
                  setLink(e.target.value);
                }}
                placeholder="Paste link (ex. https://x.com/0xJoint/status/177...)"
              />
            </div>
            <div className="mt-3">
              <Button
                size="full"
                disabled={loading || !link}
                onClick={createReqVerify}
              >
                {!loading && <>Submit</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "private-sale" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle>Join $P2P Private Sale</DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              Apply to participate in the upcoming Joint $P2P private sale
              event. <b>{quest.engageBond}</b> points will be deducted as
              security bond and will only be returned after you participate in
              the sale. You will also get an additional{" "}
              <b>{quest.engagePoints}</b> points.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div>Country</div>
            <div className="mt-2">
              <Select2
                placeholder="Choose Country"
                className="w-full"
                triggerClassName="w-full"
                contentClassName="max-h-[200px]"
                onValueChange={(v) => {
                  setCountry(v);
                }}
              >
                <SelectItem value="">Choose Country</SelectItem>
                {getAllowedPresaleCountry().map((country) => (
                  <SelectItem
                    className="hover:bg-gray-800"
                    value={country.value}
                  >
                    {country.label}
                  </SelectItem>
                ))}
              </Select2>
            </div>
            <div className="mt-3">
              <Button
                size="full"
                disabled={loading || !country}
                onClick={doApplyPresale}
              >
                {!loading && <>Submit</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "swap" && (
        <DialogContent className="p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-1 pt-2 border-gray-800">
            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />
            <DialogTitle>
              Complete {quest.count} Swap{quest.count > 1 ? "s" : ""}
            </DialogTitle>
            <DialogDescription className="text-gray-400 font-light">
              Receive <b>{quest.engagePoints}</b> points when you complete{" "}
              {quest.count} swap{quest.count > 1 ? "s" : ""} on the{" "}
              {quest.market.base}/{quest.market.quote} liquidity.
            </DialogDescription>
          </DialogHeader>
          <div className="w-[425px] p-4">
            <div>
              <Button
                variant="ghost"
                className="p-2 w-full flex gap-2 rounded-xl justify-center items-center hover:bg-transparent hover:text-gray-10 border hover:border hover:border-gray-700 border-gray-800"
                onClick={() => {
                  window.open(
                    `/liquidity/${quest.marketAddress}/${quest.provider}/${quest.lid}`,
                    "_blank",
                  );
                }}
              >
                <span>
                  <Link size="20" />
                </span>
                <span>Go to Liquidity</span>
              </Button>
            </div>
            <div className="mt-2 font-light text-sm text-gray-600">
              Once you have completed all swaps, click "Verify" button to
              receive point reward.
            </div>
            <div className="mt-3">
              <Button size="full" disabled={loading} onClick={doVerifySwap}>
                {!loading && <>Verify</>}
                {loading && (
                  <IconSpinner
                    className="animate-spin"
                    width="20"
                    fill="fill-gray-800"
                  />
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      )}

      {quest.type == "verify" && (
        <DialogContent className="select-none p-0 sm:max-w-[425px] top-[25%] border-modal-border bg-modal-background text-white">
          <DialogHeader className="border-b px-4 py-3 gap-2 pt-2 border-gray-800">
            <span className="text-gray-500 text-sm">
              Community Verification
            </span>

            <Cross1Icon
              className="absolute right-0 mr-3 mt-2 cursor-pointer opacity-80 hover:opacity-100"
              onClick={() => {
                setOpen(false);
              }}
            />

            <AirdropQuestVoteDialog
              quest={quest}
              requestDialogClose={() => {
                setOpen(false);
              }}
            />
          </DialogHeader>
        </DialogContent>
      )}
    </Dialog>
  );
}
