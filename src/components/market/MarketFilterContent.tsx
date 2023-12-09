import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { validators } from "tailwind-merge";
import useStore from "../../hooks/store/useStore.ts";
import { useUrlQuery } from "../../hooks/useUrlQuery.ts";
import { isTrue, rmUndefinedAndNull } from "../../libs/helpers.ts";
import { cn } from "../../libs/utils.ts";
import { FilterItem } from "../FilterItem.tsx";
import Input2 from "../Input2.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { Button } from "../ui/Button.tsx";
import { Accordion } from "../ui/accordion.tsx";
import { Label } from "../ui/label.tsx";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";

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

export function MarketFilterContent() {
  const query = useUrlQuery();
  const navigate = useNavigate();
  const loc = useLocation();
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
    <div className="h-full flex flex-col">
      <ScrollOverflowIndicator side="bottom" className="h-full flex-1">
        <ScrollArea
          type="scroll"
          viewportClassName="absolute xl:relative"
          className="h-full relative"
        >
          <Accordion type="multiple">
            <FilterItem
              title="Base"
              tip="Find markets matching the base token address or symbol"
            >
              <Input2
                type="text"
                placeholder="e.g. 0x0..."
                className="pl-2"
                value={values.base || ""}
                onChange={(e) => {
                  setValues({ ...values, base: e.target.value });
                }}
              />
            </FilterItem>
            <FilterItem
              title="Quote"
              tip="Find markets matching the quote token address or symbol"
            >
              <Input2
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
              className={cn({ hidden: !values.quote })}
            >
              <div>
                <Input2
                  placeholder="0.00"
                  className="w-[100px] px-2 pl-0"
                  value={values.price || ""}
                  onChange={(e) => {
                    setValues({ ...values, price: e.target.value });
                    if (validators.isNumber(e.target.value)) {
                      setErrors({ price: "" });
                    } else {
                      setErrors({ price: "Must be a number" });
                    }
                  }}
                  beforeInput={
                    <div className="w-[50px] ml-[5px]">
                      <Select
                        value={values.price_cur || "USD"}
                        onValueChange={(cur) => {
                          setValues({ ...values, price_cur: cur });
                        }}
                      >
                        <SelectTrigger className="border-none focus:border-0 focus:ring-0 data-[state=open]:border-none">
                          <SelectValue placeholder="$" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">$</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  }
                  err={errors.price}
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
                      <Label
                        htmlFor="lower"
                        className="font-light tracking-wider"
                      >
                        {"<="}
                      </Label>
                    </span>
                  </ToolTip>
                  <ToolTip tip={"Greater than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      {" "}
                      <RadioGroupItem value="higher" id="higher" />
                      <Label
                        htmlFor="higher"
                        className="font-light tracking-wider"
                      >
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
              className={cn({ hidden: !values.base })}
            >
              <div>
                <Input2
                  className="w-[100px] px-2 pl-0"
                  placeholder="0.00"
                  value={values.liq || ""}
                  onChange={(e) => {
                    setValues({ ...values, liq: e.target.value });
                    if (validators.isNumber(e.target.value)) {
                      setErrors({ liquidity: "" });
                    } else {
                      setErrors({ liquidity: "Must be a number" });
                    }
                  }}
                  beforeInput={
                    <div className="w-[50px] ml-[5px]">
                      <Select
                        value={values.liq_cur || "USD"}
                        onValueChange={(cur) => {
                          setValues({ ...values, liq_cur: cur });
                        }}
                      >
                        <SelectTrigger className="border-none focus:border-0 focus:ring-0 data-[state=open]:border-none">
                          <SelectValue placeholder="$" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="USD">$</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  }
                  err={errors.liquidity}
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
                      <Label
                        htmlFor="lower"
                        className="font-light tracking-wider"
                      >
                        {"<="}
                      </Label>
                    </span>
                  </ToolTip>
                  <ToolTip tip={"Greater than or equal to the amount"}>
                    <span className="flex items-center gap-2">
                      {" "}
                      <RadioGroupItem value="higher" id="higher" />
                      <Label
                        htmlFor="higher"
                        className="font-light tracking-wider"
                      >
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
              title="KYC'D LP"
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
              title="KYC'D Takers"
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
              <Input2
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
                <Input2
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
                <Input2
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
        </ScrollArea>
      </ScrollOverflowIndicator>
      <div className="px-5 py-5">
        <Button
          size="full"
          variant="outline"
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
              pathname: loc.pathname,
              search: new URLSearchParams(
                rmUndefinedAndNull(cloned, true),
              ).toString(),
            });
          }}
        >
          Filter
        </Button>
      </div>
    </div>
  );
}
