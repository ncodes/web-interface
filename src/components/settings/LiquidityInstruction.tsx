import { useMutation } from "@tanstack/react-query";
import { InfoIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";
import {
  InstructionsWithGrantSigResponse,
  useInstructionsService,
} from "../../hooks/services/backend/useInstructionsService.ts";
import useBadgeMgrContract from "../../hooks/services/contracts/useBadgeMgrContract.ts";
import { useToast } from "../../hooks/useToast.tsx";
import { isDev } from "../../libs/helpers.ts";
import { ToolTip } from "../ToolTip.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { Button } from "../ui/Button.tsx";
import { Textarea } from "../ui/textarea.tsx";

export function LiquidityInstruction() {
  const { updateInstructions } = useInstructionsService();
  const {
    loadInstruction,
    grantNewOrUpsetBadgeMetaBySig: updateInstruction,
    humanizeErrors,
  } = useBadgeMgrContract();
  const { getChainInfo, address } = useConnectorContext();
  const { notifySuccess, notifyError } = useToast();
  const [originalContent, setOriginalContent] = useState("");
  const [content, setContent] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  const update = useMutation({
    mutationFn: () => {
      return updateInstructions({
        net: getChainInfo().queryName,
        content: content,
      });
    },
  });

  useEffect(() => {
    setTxLoading(true);
    loadInstruction(address)
      .then((data) => {
        if (!data) return;
        setContent(data.global);
        setOriginalContent(data.global);
      })
      .finally(() => {
        setTxLoading(false);
      });
  }, []);

  const doPublish = useCallback(
    async (data: InstructionsWithGrantSigResponse) => {
      try {
        setTxLoading(true);
        const txHash = await updateInstruction(data.sigInfo);
        const blockExplorer = getChainInfo().blockExplorer;
        notifySuccess("Successfully granted instruction badge", {
          duration: 5000,
          links: [
            {
              label: "View Transaction",
              href: `${blockExplorer}/tx/${txHash}`,
            },
          ],
        });
      } catch (error) {
        const msg = humanizeErrors(error);
        notifyError(msg);
        if (isDev()) console.error(error);
      } finally {
        setTxLoading(false);
      }
    },
    [update.isSuccess, update.data],
  );

  return (
    <div>
      <div className="font-light text-gray-100 text-sm">
        Provide takers with essential instructions for engaging with your
        liquidity across all markets.
      </div>
      <div className="mt-1">
        <div className="flex justify-end text-xs text-gray-400">
          {content.length}/250
        </div>
        <Textarea
          className="mt-1 h-[160px] font-light text-gray-300"
          value={content}
          disabled={update.isLoading || txLoading}
          onChange={(e) => {
            if (e.target.value.length > 250) return;
            setContent(e.target.value);
          }}
          placeholder="Enter Instructions"
        />
      </div>
      <div className="flex flex-col pt-2 text-gray-400">
        <ToolTip tip="Anyone can read it. Do not include information you consider sensitive.">
          <span className="flex gap-1 items-center">
            <InfoIcon width="15" />
            <span className="font-light text-xs">
              Instruction is publicly accessible.
            </span>
          </span>
        </ToolTip>
        <ToolTip tip="Instruction badge allows Joint-powered interfaces to permissionlessly discover your instructions.">
          <span className="flex gap-1 items-center">
            <InfoIcon width="15" />
            <span className="font-light text-xs">
              You will be granted an{" "}
              <b className="text-chinese-green">instruction</b> badge
            </span>
          </span>
        </ToolTip>
        <ToolTip tip="The CID will be linked to your instruction badge">
          <span className="flex gap-1 items-center">
            <InfoIcon width="15" />
            <span className="font-light text-xs">
              Content will be saved to IPFS.
            </span>
          </span>
        </ToolTip>
        <ToolTip tip="The CID will be linked to your instruction badge">
          <span className="flex gap-1 items-center">
            <InfoIcon width="15" />
            <span className="font-light text-xs">
              Requires a blockchain transaction to complete.
            </span>
          </span>
        </ToolTip>
      </div>
      <div className="pt-3">
        <Button
          variant="default"
          rounded="default"
          size="full"
          className="tracking-wider"
          disabled={
            originalContent === content || update.isLoading || txLoading
          }
          onClick={() => {
            update
              .mutateAsync()
              .then((data) => {
                doPublish(data).catch(console.error);
              })
              .catch((e) => {
                notifyError("Failed to update instructions: " + e.message);
              });
          }}
        >
          {(update.isLoading || txLoading) && (
            <IconSpinner
              width="15"
              className="animate-spin"
              fill="fill-gray-900"
            />
          )}
          {!update.isLoading && !txLoading && "Publish"}
        </Button>
      </div>
    </div>
  );
}
