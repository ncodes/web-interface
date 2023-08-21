import { useQuery } from "../../hooks/useQuery.ts";
import { useNavigate } from "react-router-dom";
import useStore, { LiquidityFilter } from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { isTrue, rmUndefinedAndNull } from "../../libs/helpers.ts";
import { Accordion } from "../ui/accordion.tsx";
import { FilterItem } from "../FilterItem.tsx";
import { Input } from "../ui/Input.tsx";
import { cn } from "../../libs/utils.ts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";
import { validators } from "tailwind-merge";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group.tsx";
import { ToolTip } from "../ToolTip.tsx";
import { Label } from "../ui/label.tsx";
import { Button } from "../ui/Button.tsx";

interface Errors {
  price?: string;
  liquidity?: string;
}

interface Values {
  base?: string;
  quote?: string;
  market?: string;
  price_cur?: string;
  price?: string;
  price_lte?: string;
  amt_cur?: string;
  amt?: string;
  amt_lte?: string;
  provider?: string;
  kyc_lp?: string;
  kyc_taker?: string;
  swap_badges?: string;
}

export function LiquidityFilterContent({ ownerMode }: { ownerMode?: boolean }) {
  const query = useQuery();
  const navigate = useNavigate();
  const { setLiquidityFilter, liquidityFilter } = useStore((state) => ({
    setLiquidityFilter: state.setLiquidityFilter,
    liquidityFilter: state.liquidityFilter,
  }));
  const [values, setValues] = useState<Values>({});
  const [errors, setErrors] = useState<Errors>({});

  // Load filter fields default values from market filter in store
  useEffect(() => {
    if (Object.keys(liquidityFilter).length === 0) return;

    let update = { ...values };

    if (liquidityFilter.priceUsd) {
      const op = liquidityFilter.priceUsd.startsWith(">") ? ">" : "<";
      const price = liquidityFilter.priceUsd.replace(">", "").replace("<", "");
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

    if (liquidityFilter.amountUsd) {
      const op = liquidityFilter.amountUsd.startsWith(">") ? ">" : "<";
      const liq = liquidityFilter.amountUsd.replace(">", "").replace("<", "");
      update = {
        ...update,
        amt_cur: "USD",
        amt: liq,
        amt_lte: op == "<" ? "lower" : "higher",
      };
    } else {
      update = {
        ...update,
        amt_cur: "USD",
        amt: "",
        amt_lte: "lower",
      };
    }

    update = {
      ...update,
      base: liquidityFilter?.base || "",
      quote: liquidityFilter?.quote || "",
      kyc_lp: liquidityFilter?.kycLp?.toString() || "",
      kyc_taker: liquidityFilter?.kycTaker?.toString() || "",
      provider: liquidityFilter?.provider?.toString() || "",
      market: liquidityFilter?.market || "",
      swap_badges: liquidityFilter?.swapBadges || "",
    };

    setValues(update);
  }, [liquidityFilter]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<LiquidityFilter> = {};

    const priceCur = query.get("price_cur") || "USD";
    const price = query.get("price");
    const priceLTE = query.get("price_lte") || "lower";
    if (price && priceCur == "USD") {
      filter.priceUsd = price;
      const op = priceLTE == "lower" ? "<" : ">";
      filter.priceUsd = op + filter.priceUsd;
    } else filter.priceUsd = undefined;

    const amtCur = query.get("amt_cur") || "USD";
    const amt = query.get("amt");
    const liqLTE = query.get("amt_lte") || "lower";
    if (amt && amtCur == "USD") {
      filter.amountUsd = amt;
      const op = liqLTE == "lower" ? "<" : ">";
      filter.amountUsd = op + filter.amountUsd;
    } else filter.amountUsd = undefined;

    filter.kycLp = query.get("kyc_lp")
      ? isTrue(query.get("kyc_lp") as string)
      : undefined;

    filter.kycTaker = query.get("kyc_taker")
      ? isTrue(query.get("kyc_taker") as string)
      : undefined;

    filter.market = query.get("market") as string;

    filter.provider = query.get("creator") as string;

    filter.swapBadges = query.get("swap_badges") as string;

    filter.base = query.get("base") as string;

    filter.quote = query.get("quote") as string;

    setLiquidityFilter && setLiquidityFilter(filter);
  }, [query, setLiquidityFilter]);

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
          title="By Market ID"
          tip="Find a market by its address or ID"
        >
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.market || ""}
            onChange={(e) => {
              setValues({ ...values, market: e.target.value });
            }}
          />
        </FilterItem>

        <FilterItem
          title="By Creator"
          tip="Find a market by its creator's address"
          className={cn({ hidden: ownerMode })}
        >
          <Input
            type="text"
            placeholder="e.g. 0x0..."
            className="pl-2"
            value={values.provider || ""}
            onChange={(e) => {
              setValues({ ...values, provider: e.target.value });
            }}
          />
        </FilterItem>
        <FilterItem
          title="Quote Price"
          tip="Filter by price (QUOTE)"
          error={errors.price}
          className={cn({ hidden: !values.market })}
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
          className={cn({ hidden: !values.market })}
        >
          <div className="mr-1">
            <Select
              value={values.amt_cur || "USD"}
              onValueChange={(cur) => {
                setValues({ ...values, amt_cur: cur });
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
              value={values.amt || ""}
              onChange={(e) => {
                setValues({ ...values, amt: e.target.value });
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
              value={values.amt_lte}
              onValueChange={(value) => {
                setValues({
                  ...values,
                  amt_lte: value,
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
          title="Doxxed LP"
          tip="Find markets where liquidity providers have completed KYC"
          className={cn({ hidden: ownerMode })}
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
          className={cn({ hidden: ownerMode })}
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

            if (!cloned.amt) {
              delete cloned.amt_lte;
              delete cloned.amt_cur;
            }

            navigate({
              pathname: "/liquidity/owned",
              search: new URLSearchParams(
                rmUndefinedAndNull(cloned, true)
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
