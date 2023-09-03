import { Textarea } from "../ui/textarea.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { InfoIcon } from "lucide-react";
import { TabsContent } from "../ui/Tabs.tsx";
import { Button } from "../ui/Button.tsx";
import { useCallback, useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "../../hooks/toast/toast.tsx";
import {
  InstructionsWithGrantSigResponse,
  useInstructionsService,
} from "../../hooks/services/backend/useInstructionsService.ts";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import useInstructions from "../../hooks/instructions/useInstructions.ts";
import { isDev } from "../../libs/helpers.ts";

export default function ManageLiquidityInstructionsTab({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const { notifySuccess, notifyError } = useToast();
  const { load, update: updateInstruction, parseError } = useInstructions();
  const { updateInstructions } = useInstructionsService();
  const { getChainInfo, address } = useConnectorContext();
  const [originalContent, setOriginalContent] = useState("");
  const [content, setContent] = useState("");
  const [txLoading, setTxLoading] = useState(false);

  const update = useMutation({
    mutationFn: () => {
      return updateInstructions({
        net: getChainInfo().queryName,
        content: content,
        marketAddress: liquidity.marketAddress,
        provider: liquidity.provider,
        lid: liquidity.lid,
      });
    },
  });

  useEffect(() => {
    setTxLoading(true);
    load(address)
      .then((data) => {
        if (!data) return;
        const liqKey = `${liquidity.marketAddress}:${liquidity.provider}:${liquidity.lid}`;
        const content = data.liquidity[liqKey];
        if (!content) return;
        setContent(content);
        setOriginalContent(content);
      })
      .finally(() => {
        setTxLoading(false);
      });
  }, []);

  const onPublish = useCallback(
    async (data: InstructionsWithGrantSigResponse) => {
      try {
        setTxLoading(true);
        const txHash = await updateInstruction(data.sigInfo);
        const blockExplorer = getChainInfo().blockExplorer;
        notifySuccess("Successfully granted instruction badge", {
          duration: 10000,
          links: [
            {
              label: "View Transaction",
              href: `${blockExplorer}/tx/${txHash}`,
            },
          ],
        });
      } catch (error) {
        const msg = parseError(error);
        notifyError(msg);
        if (isDev()) console.error(error);
      } finally {
        setTxLoading(false);
      }
    },
    [update.isSuccess, update.data]
  );

  return (
    <TabsContent value="instructions" className="p-0 mt-0 h-full">
      <div className="px-5 pt-3">
        <div className="font-light text-gray-100 text-sm">
          Provide takers with essential instructions for engaging with this
          liquidity.
        </div>
        <div className="mt-1">
          <div className="flex justify-end text-xs text-gray-400">
            {content?.length || 0}/250
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
                  onPublish(data).catch(console.error);
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
                stopColor="#000000"
              />
            )}
            {!update.isLoading && !txLoading && "Publish"}
          </Button>
        </div>
      </div>
    </TabsContent>
  );
}
