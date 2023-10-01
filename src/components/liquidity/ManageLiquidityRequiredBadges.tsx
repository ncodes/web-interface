import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion.tsx";
import { Textarea } from "../ui/textarea.tsx";
import { useState } from "react";
import { Button } from "../ui/Button.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import {
  delay,
  isDev,
  splitAndCleanBadges,
  splitBadgeFromPath,
} from "../../libs/helpers.ts";
import IconCaution from "../icons/IconCaution.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import useCoreContract from "../../hooks/services/contracts/useCoreContract.ts";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "react-router-dom";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext.tsx";

export function ManageLiquidityRequiredBadges({
  liquidity,
}: {
  liquidity: Liquidity;
}) {
  const { getChainInfo } = useConnectorContext();
  const [badges, setBadges] = useState(
    liquidity.requiredSwapBadges
      ? liquidity.requiredSwapBadges.join(", ").trim()
      : ""
  );
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const { notifySuccess, notifyError } = useToast();
  const { setSwapBadgeForLiquidity, humanizeErrors } = useCoreContract();
  const queryClient = useQueryClient();
  const location = useLocation();

  const doWrite = async () => {
    try {
      setLoading(true);
      const txHash = await setSwapBadgeForLiquidity(
        liquidity.marketAddress,
        liquidity.lid,
        splitBadgeFromPath(splitAndCleanBadges(badges))
      );

      await delay(5000);
      const blockExplorer = getChainInfo().blockExplorer;
      notifySuccess("Successfully updated badge requirement", {
        duration: 5000,
        links: [
          { label: "View Transaction", href: `${blockExplorer}/tx/${txHash}` },
        ],
      });

      const query = location.pathname.includes("liquidity")
        ? "getLiquidityByCreator"
        : "getMarketsByCreator";
      queryClient.refetchQueries([query]).catch(console.error);

      close && close();
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AccordionItem value="badges">
      <AccordionTrigger className="text-lg pb-2 tracking-wide mt-2 px-5">
        Badge Rules
      </AccordionTrigger>
      <AccordionContent className="tracking-wide px-5">
        <div className="font-light text-gray-100 text-sm">
          Specify one or more badges takers are required to have in order to
          swap this liquidity.
        </div>
        <div className="flex flex-col gap-2 mx-1 mt-2">
          <Textarea
            className="mt-1 h-[100px] font-light text-gray-300"
            value={badges}
            disabled={loading}
            spellCheck={false}
            onChange={(e) => {
              const val = e.target.value;
              if (splitAndCleanBadges(val).length > 8)
                setErr("Too many badges (max: 8)");
              else setErr("");
              setBadges(val);
            }}
            placeholder="Enter Badges (comma separated)"
          />
          {err && (
            <span className="flex items-center gap-1 text-red-500 text-xs font-light">
              <span>
                <IconCaution width="15" fillA="#cb0c2c" />
              </span>
              <span>{err}</span>
            </span>
          )}
        </div>
        <div className="pt-4">
          <Button
            variant="default"
            rounded="default"
            size="full"
            className="tracking-wider"
            disabled={
              loading ||
              err != "" ||
              (liquidity.requiredSwapBadges.length == 0 && badges == "") ||
              (liquidity.requiredSwapBadges.length > 0 &&
                badges == liquidity.requiredSwapBadges.join(", ").trim())
            }
            onClick={doWrite}
          >
            {loading && (
              <IconSpinner
                width="15"
                className="animate-spin"
                fill="fill-gray-900"
              />
            )}
            {!loading && "Update"}
          </Button>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
