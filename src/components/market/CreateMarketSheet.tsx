import { ReactNode, useEffect, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { Cross2Icon, InfoCircledIcon } from "@radix-ui/react-icons";
import IconInfoCircle from "../icons/IconInfoCircle.tsx";
import { Input } from "../ui/Input.tsx";
import { Switch } from "../ui/switch.tsx";
import { Button } from "../ui/Button.tsx";
import { useConnectorContext } from "../../hooks/connectors/context.tsx";
import { useAssetService } from "../../hooks/services/backend/useAssetService.ts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AssetSelector } from "./AssetSelector.tsx";
import { ToolTip } from "../ToolTip.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { useToast } from "../../hooks/toast/toast.tsx";
import { isDev } from "../../libs/helpers.ts";
import useMarketContract from "../../hooks/services/contracts/useMarketContract.ts";
import { AssetType } from "../../types/enums.ts";
import _ from "lodash";
import IconCaution from "../icons/IconCaution.tsx";

export function CreateMarketSheet({
  children,
  active,
  onOpen,
}: {
  children?: ReactNode;
  active: boolean;
  onOpen: (open: boolean) => void;
}) {
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [baseAsset, setBaseAsset] = useState<AssetInfo>();
  const [quoteAsset, setQuoteAsset] = useState<AssetInfo>();
  const [commission, setCommission] = useState<number | undefined>(undefined);
  const [commissionErr, setCommissionErr] = useState("");
  const [permissions, setPermissions] = useState({
    permPut: false,
    permSwap: false,
  });
  const { notifySuccess, notifyError } = useToast();
  const { createMarket, humanizeErrors } = useMarketContract();
  const [loading, setLoading] = useState(false);
  const { getChainInfo, connected } = useConnectorContext();
  const { getList } = useAssetService();
  const assets = useQuery({
    queryKey: ["getList", { network: getChainInfo().queryName }],
    queryFn: getList,
    enabled: connected,
  });

  useEffect(() => {
    if (!assets.isSuccess || !assets.data) return;
    const base = _.shuffle(assets.data)[0];
    let quote: AssetInfo;
    do {
      quote = _.shuffle(assets.data)[0];
    } while (base.address == quote.address);
    setBaseAsset(base);
    setQuoteAsset(quote);
  }, [assets.isSuccess, assets.data]);

  useEffect(() => {
    setOpen(active);
    onOpen && onOpen(active);
  }, [active, onOpen]);

  const doCreateMarket = async () => {
    if (!baseAsset || !quoteAsset) return;
    try {
      setLoading(true);
      const txHash = await createMarket(
        baseAsset.address,
        quoteAsset.address,
        baseAsset.type == "ERC20" ? AssetType.ERC20 : AssetType.ERC721,
        quoteAsset.type == "ERC20" ? AssetType.ERC20 : AssetType.ERC721,
        permissions.permPut,
        permissions.permSwap,
        (commission || 0) * 100,
        1
      );
      const blockExplorer = getChainInfo().blockExplorer;
      notifySuccess("Successfully created a market", {
        duration: 10000,
        links: [
          { label: "View Transaction", href: `${blockExplorer}/tx/${txHash}` },
        ],
      });
      queryClient.refetchQueries(["getMarkets"]).catch(console.error);
      close();
    } catch (error) {
      const msg = humanizeErrors(error);
      notifyError(msg);
      if (isDev()) console.error(error);
    } finally {
      setLoading(false);
    }
  };

  function close() {
    setOpen(false);
    onOpen && onOpen(false);
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        onOpen && onOpen(open);
      }}
    >
      <SheetTrigger>{children}</SheetTrigger>
      <SheetContent
        className="w-full border-l focus-visible:outline-0  border-gray-800 pt-0 px-0"
        side="right"
      >
        <SheetHeader className="flex pr-[50px] border-b border-gray-800">
          <div className="text-white">
            <SheetTitle className="flex items-center gap-2 text-gray-100 tracking-wide p-3 pl-5">
              Create Market
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className="flex gap-2 flex-col text-white h-full">
          <div className="flex">
            <div className="p-5 pb-0 flex-1">
              <AssetSelector
                assetsQuery={assets}
                side="Base Asset"
                symbol={baseAsset?.symbol as string}
                image={baseAsset?.logoURI as string}
                disabled={loading}
                tip={
                  "The base asset refers to the currency or asset in which the liquidity is denominated."
                }
                onSelected={(asset) => {
                  setBaseAsset(asset);
                }}
              />
            </div>

            <div className="p-5 pb-0 flex-1">
              <AssetSelector
                assetsQuery={assets}
                side="Quote Asset"
                symbol={quoteAsset?.symbol || "-"}
                image={quoteAsset?.logoURI || ""}
                disabled={loading}
                tip="The quote asset refers to the currency or asset in which the price of the base asset is denominated."
                onSelected={(asset) => {
                  setQuoteAsset(asset);
                }}
              />
            </div>
          </div>

          <div>
            <div className="flex gap-2 flex-col p-5 pb-0">
              <div className="flex items-center gap-2">
                <span className="tracking-wide">Commission</span>
                <ToolTip tip="The percentage of commission that the market creator deducts from each swap">
                  <IconInfoCircle
                    width="15px"
                    className="opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  />
                </ToolTip>
              </div>
              <div>
                <Input
                  type="number"
                  value={commission == undefined ? "" : commission}
                  disabled={loading}
                  onChange={(e) => {
                    setCommission(parseFloat(e.target.value || ""));
                    if (e.target.value == undefined) return;
                    if (parseFloat(e.target.value) > 30) {
                      setCommissionErr("Commission must be less than 30%");
                    } else {
                      setCommissionErr("");
                    }
                  }}
                  className="px-3 p-5 !w-[150px]"
                  placeholder="0.1"
                />
                {commissionErr != "" && (
                  <span className="text-xs mt-2 font-light text-red-500 tracking-wide flex gap-1">
                    <IconCaution width="15px" fillA="#ed4f41" /> {commissionErr}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="flex gap-2 flex-col p-5 pb-0">
              <div className="flex items-center gap-2">
                <span className="tracking-wide">Permissions</span>
                <ToolTip tip="The permissions that the market creator grants to the market">
                  <IconInfoCircle
                    width="15px"
                    className="opacity-70 hover:opacity-100 transition-all duration-300 cursor-pointer"
                  />
                </ToolTip>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex font-light text-sm text-gray-400 justify-between">
                  <span className="flex items-center gap-1">
                    <span>Anyone can add liquidity</span>
                    <ToolTip tip="By enabling this option, anyone can provide liquidity to the market">
                      <InfoCircledIcon className="text-gray-500" />
                    </ToolTip>
                  </span>
                  <span>
                    <Switch
                      disabled={loading}
                      checked={!permissions.permPut}
                      onCheckedChange={(v) => {
                        setPermissions({ ...permissions, permPut: !v });
                      }}
                    />
                  </span>
                </div>
                <div className="flex font-light text-sm text-gray-400 justify-between">
                  <span className="flex items-center gap-1">
                    <span>Anyone can swap</span>
                    <ToolTip tip="By enabling this option, anyone can swap in the market">
                      <InfoCircledIcon className="text-gray-500" />
                    </ToolTip>
                  </span>
                  <span>
                    <Switch
                      disabled={loading}
                      checked={!permissions.permSwap}
                      onCheckedChange={(v) => {
                        setPermissions({ ...permissions, permSwap: !v });
                      }}
                    />
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="px-3 mb-4 pt-4 border-t border-gray-800 absolute w-full bottom-0">
            <Button
              size="full"
              onClick={doCreateMarket}
              disabled={loading || commissionErr.length > 0}
            >
              {!loading && <>Create</>}
              {loading && (
                <>
                  <IconSpinner
                    width="20"
                    stopColor="#06060c"
                    className="animate-spin"
                  />
                </>
              )}
            </Button>
          </div>
        </div>
        <div
          className="absolute cursor-pointer text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            close();
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
