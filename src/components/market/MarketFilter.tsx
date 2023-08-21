import { Accordion } from "../ui/accordion.tsx";
import { Input } from "../ui/Input.tsx";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx";
import { Label } from "../ui/label.tsx";
import { ReactNode, useEffect, useState } from "react";
import { Button } from "../ui/Button.tsx";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { Cross2Icon } from "@radix-ui/react-icons";
import { FilterItem } from "../FilterItem.tsx";
import useStore, { MarketFilter } from "../../hooks/store/useStore.ts";
import { validators } from "tailwind-merge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { useQuery } from "../../hooks/useQuery.ts";
import { isTrue, rmUndefinedAndNull } from "../../libs/helpers.ts";
import { useNavigate } from "react-router-dom";
import { cn } from "../../libs/utils.ts";

interface Errors {
  price?: string;
  liquidity?: string;
}

interface Values {
  base?: string;
  quote?: string;
  price_cur?: string;
  price?: string;
  price_lte?: string;
  liq_cur?: string;
  liq?: string;
  liq_lte?: string;
  merchant_lp?: string;
  kyc_lp?: string;
  kyc_taker?: string;
  offer_only?: string;
  address?: string;
  creator?: string;
  perm_put?: string;
  perm_swap?: string;
  put_badges?: string;
  swap_badges?: string;
}

export function FilterContent() {
  const query = useQuery();
  const navigate = useNavigate();
  const { setMarketFilter, marketFilter } = useStore((state) => ({
    setMarketFilter: state.setMarketFilter,
    marketFilter: state.marketFilter,
  }));
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  // Load filter fields default values from market filter in store
  useEffect(() => {
    if (Object.keys(marketFilter).length === 0) return;

    let update = { ...values };

    if (marketFilter.priceUsd) {
      const op = marketFilter.priceUsd.startsWith(">") ? ">" : "<";
      const price = marketFilter.priceUsd.replace(">", "").replace("<", "");
      update = {
        ...update,
        price_cur: "USD",
        price: price,
        price_lte: op == "<" ? "lower" : "higher",
      };
    } else {
      update = {
        ...update,
        price_cur: "USD",
        price: "",
        price_lte: "lower",
      };
    }

    if (marketFilter.liquidityUsd) {
      const op = marketFilter.liquidityUsd.startsWith(">") ? ">" : "<";
      const liq = marketFilter.liquidityUsd.replace(">", "").replace("<", "");
      update = {
        ...update,
        liq_cur: "USD",
        liq: liq,
        liq_lte: op == "<" ? "lower" : "higher",
      };
    } else {
      update = {
        ...update,
        liq_cur: "USD",
        liq: "",
        liq_lte: "lower",
      };
    }

    update = {
      ...update,
      base: marketFilter?.base || "",
      quote: marketFilter?.quote || "",
      merchant_lp: marketFilter?.merchantLp?.toString() || "",
      kyc_lp: marketFilter?.kycLp?.toString() || "",
      kyc_taker: marketFilter?.kycTaker?.toString() || "",
      offer_only: marketFilter?.offer?.toString() || "",
      address: marketFilter?.address || "",
      creator: marketFilter?.creator || "",
      perm_put: marketFilter?.permPut?.toString() || "",
      perm_swap: marketFilter?.permSwap?.toString() || "",
      put_badges: marketFilter?.putBadges || "",
      swap_badges: marketFilter?.swapBadges || "",
    };

    setValues(update);
  }, [marketFilter]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<MarketFilter> = {};

    const priceCurrency = query.get("price_cur") || "USD";
    const price = query.get("price");
    const priceLTE = query.get("price_lte") || "lower";
    if (price && priceCurrency == "USD") {
      filter.priceUsd = price;
      const op = priceLTE == "lower" ? "<" : ">";
      filter.priceUsd = op + filter.priceUsd;
    } else filter.priceUsd = undefined;

    const liqCurrency = query.get("liq_cur") || "USD";
    const liquidity = query.get("liq");
    const liqLTE = query.get("liq_lte") || "lower";
    if (liquidity && liqCurrency == "USD") {
      filter.liquidityUsd = liquidity;
      const op = liqLTE == "lower" ? "<" : ">";
      filter.liquidityUsd = op + filter.liquidityUsd;
    } else filter.liquidityUsd = undefined;

    filter.merchantLp = query.get("merchant_lp")
      ? isTrue(query.get("merchant_lp") as string)
      : undefined;

    filter.kycLp = query.get("kyc_lp")
      ? isTrue(query.get("kyc_lp") as string)
      : undefined;

    filter.kycTaker = query.get("kyc_taker")
      ? isTrue(query.get("kyc_taker") as string)
      : undefined;

    filter.offer = query.get("offer_only")
      ? isTrue(query.get("offer_only") as string)
      : undefined;

    filter.address = query.get("address") as string;
    filter.creator = query.get("creator") as string;

    filter.permPut = query.get("perm_put")
      ? isTrue(query.get("perm_put") as string)
      : undefined;

    filter.permSwap = query.get("perm_swap")
      ? isTrue(query.get("perm_swap") as string)
      : undefined;

    filter.putBadges = query.get("put_badges") as string;

    filter.swapBadges = query.get("swap_badges") as string;

    filter.base = query.get("base") as string;

    filter.quote = query.get("quote") as string;

    setMarketFilter && setMarketFilter(filter);
  }, [query, setMarketFilter]);

  return (
    <div>
      <Accordion type="multiple">
        <FilterItem title="Base" tip="Find markets with a certain base token">
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.base || ""}
            onChange={(e) => {
              setValues({ ...values, base: e.target.value });
            }}
          />
        </FilterItem>
        <FilterItem title="Quote" tip="Find markets with a certain quote token">
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.quote || ""}
            onChange={(e) => {
              setValues({ ...values, quote: e.target.value });
            }}
          />
        </FilterItem>
        <FilterItem
          title="Quote Price"
          tip="Filter by price (QUOTE)"
          error={errors.price}
          className={cn({ hidden: !values.quote })}
        >
          <div className="mr-1">
            <Select
              value={values.price_cur || "USD"}
              onValueChange={(cur) => {
                setValues({ ...values, price_cur: cur });
              }}
            >
              <SelectTrigger className="hover:border-chinese-green hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:scale-x-105 focus:scale-x-105">
                <SelectValue placeholder="$" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="">
            <Input
              placeholder="0.00"
              className="w-[100px] px-2 hover:border-chinese-green "
              value={values.price || ""}
              onChange={(e) => {
                setValues({ ...values, price: e.target.value });
                if (validators.isNumber(e.target.value)) {
                  setErrors({ price: "" });
                } else {
                  setErrors({ price: "Amount must be a number" });
                }
              }}
            />
          </div>
          <div className="flex-1 px-3 flex">
            <RadioGroup
              className="flex flex-1 items-center gap-3"
              value={values.price_lte}
              onValueChange={(value) => {
                setValues({
                  ...values,
                  price_lte: value,
                });
              }}
            >
              <ToolTip tip={"Less than or equal to the amount"}>
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="lower" id="lower" />
                  <Label htmlFor="lower" className="font-light tracking-wider">
                    {"<="}
                  </Label>
                </span>
              </ToolTip>
              <ToolTip tip={"Greater than or equal to the amount"}>
                <span className="flex items-center gap-2">
                  {" "}
                  <RadioGroupItem value="higher" id="higher" />
                  <Label htmlFor="higher" className="font-light tracking-wider">
                    {">="}
                  </Label>
                </span>
              </ToolTip>
            </RadioGroup>
          </div>
        </FilterItem>

        <FilterItem
          title="Available Liquidity"
          tip="Find markets with certain amount of available liquidity"
          error={errors.liquidity}
          className={cn({ hidden: !values.base })}
        >
          <div className="mr-1">
            <Select
              value={values.liq_cur || "USD"}
              onValueChange={(cur) => {
                setValues({ ...values, liq_cur: cur });
              }}
            >
              <SelectTrigger className="hover:border-chinese-green hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:scale-x-105 focus:scale-x-105">
                <SelectValue placeholder="$" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Input
              className="w-[121px] px-2 hover:border-chinese-green"
              placeholder="0.00"
              value={values.liq || ""}
              onChange={(e) => {
                setValues({ ...values, liq: e.target.value });
                if (validators.isNumber(e.target.value)) {
                  setErrors({ liquidity: "" });
                } else {
                  setErrors({ liquidity: "Amount must be a number" });
                }
              }}
            />
          </div>
          <div className="flex-1 px-3 flex">
            <RadioGroup
              className="flex flex-1 items-center gap-3"
              value={values.liq_lte}
              onValueChange={(value) => {
                setValues({
                  ...values,
                  liq_lte: value,
                });
              }}
            >
              <ToolTip tip={"Less than or equal to the amount"}>
                <span className="flex items-center gap-2">
                  <RadioGroupItem value="lower" id="lower" />
                  <Label htmlFor="lower" className="font-light tracking-wider">
                    {"<="}
                  </Label>
                </span>
              </ToolTip>
              <ToolTip tip={"Greater than or equal to the amount"}>
                <span className="flex items-center gap-2">
                  {" "}
                  <RadioGroupItem value="higher" id="higher" />
                  <Label htmlFor="higher" className="font-light tracking-wider">
                    {">="}
                  </Label>
                </span>
              </ToolTip>
            </RadioGroup>
          </div>
        </FilterItem>

        <FilterItem
          title="Merchants Only"
          tip="Find markets where liquidity providers are registered merchants"
        >
          <RadioGroup
            value={values.merchant_lp || "false"}
            className="flex flex-1 gap-3"
            onValueChange={(value) => {
              setValues({
                ...values,
                merchant_lp: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="no" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="Doxxed LP"
          tip="Find markets where liquidity providers have completed KYC"
        >
          <RadioGroup
            value={values.kyc_lp || "false"}
            className="flex flex-1 gap-3"
            onValueChange={(value) => {
              setValues({
                ...values,
                kyc_lp: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="Doxxed Takers"
          tip="Find markets where takers have completed KYC"
        >
          <RadioGroup
            value={values.kyc_taker || "false"}
            className="flex flex-1 gap-3"
            onValueChange={(value) => {
              setValues({
                ...values,
                kyc_taker: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="Offer Only"
          tip="Find markets where only offers are allowed (no direct swaps)"
        >
          <RadioGroup
            value={values.offer_only || "false"}
            className="flex flex-1 gap-3"
            onValueChange={(value) => {
              setValues({
                ...values,
                offer_only: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="By Market ID"
          tip="Find a market by its address or ID"
        >
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.address || ""}
            onChange={(e) => {
              setValues({ ...values, address: e.target.value });
            }}
          />
        </FilterItem>

        <FilterItem
          title="By Creator"
          tip="Find a market by its creator's address"
        >
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.creator || ""}
            onChange={(e) => {
              setValues({ ...values, creator: e.target.value });
            }}
          />
        </FilterItem>

        <FilterItem
          title="PUT Permissioned"
          tip="Find markets that require or don't require liquidity providers to be allowlisted before they can add liquidity"
        >
          <RadioGroup
            className="flex flex-1 gap-3"
            value={values.perm_put || "false"}
            onValueChange={(value) => {
              setValues({
                ...values,
                perm_put: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="SWAP Permissioned"
          tip="Find markets that require or don't require takers to be allowlisted before they can swap"
        >
          <RadioGroup
            value={values.perm_swap || "false"}
            className="flex flex-1 gap-3"
            onValueChange={(value) => {
              setValues({
                ...values,
                perm_swap: (value === "true").toString(),
              });
            }}
          >
            <span className="flex items-center gap-2">
              <RadioGroupItem value="false" id="no" />
              <Label htmlFor="all" className="font-light tracking-wider">
                No
              </Label>
            </span>
            <span className="flex items-center gap-2">
              {" "}
              <RadioGroupItem value="true" id="yes" />
              <Label htmlFor="yes" className="font-light tracking-wider">
                Yes
              </Label>
            </span>
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="PUT Badges"
          tip="Find markets that require liquidity providers to have one or more badges"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <Input
              type="text"
              placeholder="e.g merchant, bitcoiner"
              className="pl-2"
              value={values.put_badges || ""}
              onChange={(e) => {
                setValues({ ...values, put_badges: e.target.value });
              }}
            />
          </RadioGroup>
        </FilterItem>

        <FilterItem
          title="SWAP Badges"
          className="border-none"
          tip="Find markets that require takers to have one or more badges"
        >
          <RadioGroup defaultValue="false" className="flex flex-1 gap-3">
            <Input
              type="text"
              placeholder="e.g kyc, bitcoiner"
              className="pl-2"
              value={values.swap_badges || ""}
              onChange={(e) => {
                setValues({ ...values, swap_badges: e.target.value });
              }}
            />
          </RadioGroup>
        </FilterItem>
      </Accordion>
      <div className="px-5 py-5">
        <Button
          size="full"
          onClick={() => {
            const cloned = { ...values };
            if (!cloned.price) {
              delete cloned.price_lte;
              delete cloned.price_cur;
            }

            if (!cloned.liq) {
              delete cloned.liq_lte;
              delete cloned.liq_cur;
            }

            navigate({
              pathname: "/markets",
              search: new URLSearchParams(
                rmUndefinedAndNull(cloned, true)
              ).toString(),
            });
            navigate(0);
          }}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}

export function MarketFilter() {
  return (
    <div className="pt-3">
      <h1 className="text-lg md:text-xl mb-3">Filter Markets</h1>
      <div className="bg-card-background border border-gray-800 rounded-2xl w-full ">
        <FilterContent />
      </div>
    </div>
  );
}

export function MarketFilterSheet({
  active,
  onOpen,
  children,
}: {
  active?: boolean;
  onOpen?: (open: boolean) => void;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(active);

  useEffect(() => {
    setOpen(active);
    onOpen && onOpen(active || false);
  }, [active, onOpen]);

  return (
    <Sheet
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
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
              Filter Markets
            </SheetTitle>
          </div>
        </SheetHeader>
        <div className=" text-white h-full">
          <ScrollArea type="scroll" className="h-full pb-10">
            <FilterContent />
          </ScrollArea>
        </div>
        <div
          className="absolute text-gray-200 right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary"
          onClick={() => {
            setOpen(false);
            onOpen && onOpen(false);
          }}
        >
          <Cross2Icon className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </div>
      </SheetContent>
    </Sheet>
  );
}
