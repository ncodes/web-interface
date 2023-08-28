import { useQuery } from "../../hooks/useQuery.ts";
import { useNavigate } from "react-router-dom";
import useStore, { TicketFilter } from "../../hooks/store/useStore.ts";
import { useEffect, useState } from "react";
import { rmUndefinedAndNull } from "../../libs/helpers.ts";
import { Accordion } from "../ui/accordion.tsx";
import { FilterItem } from "../FilterItem.tsx";
import { Input } from "../ui/Input.tsx";
import { Button } from "../ui/Button.tsx";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select.tsx";

interface Values {
  pool?: string;
  order?: string;
  dispute?: string;
  status?: string;
}

export function TicketFilterContent() {
  const query = useQuery();
  const navigate = useNavigate();
  const { setTicketFilter, ticketFilter } = useStore((state) => ({
    setTicketFilter: state.setTicketFilter,
    ticketFilter: state.ticketFilter,
  }));
  const [values, setValues] = useState<Values>({
    order: "",
  });

  // Load filter fields default values from market filter in store
  useEffect(() => {
    if (Object.keys(ticketFilter).length === 0) return;

    let update = { ...values };

    update = {
      ...update,
      pool: ticketFilter?.poolId?.toString() || "",
      order: ticketFilter?.orderId?.toString() || "",
      dispute: ticketFilter?.disputeId?.toString() || "",
      status: ticketFilter?.status || "",
    };

    setValues(update);
  }, [ticketFilter]);

  // Build filter from query params
  useEffect(() => {
    const filter: Partial<TicketFilter> = {};
    filter.poolId = query.get("pool")
      ? parseInt(query.get("pool") || "")
      : undefined;
    filter.orderId = query.get("order")
      ? parseInt(query.get("order") || "")
      : undefined;
    filter.disputeId = query.get("dispute")
      ? parseInt(query.get("dispute") || "")
      : undefined;
    filter.status = query.get("status") as string;

    setTicketFilter && setTicketFilter(filter);
  }, [query, setTicketFilter]);

  return (
    <div>
      <Accordion type="multiple">
        <FilterItem title="By Pool ID" tip="Find tickets belonging to a pool">
          <Input
            type="number"
            placeholder="e.g. 1234"
            className="pl-2 !w-6/12"
            value={values.pool}
            onChange={(e) => {
              setValues({
                ...values,
                pool: e.target.value,
              });
            }}
          />
        </FilterItem>

        <FilterItem
          title="By Order ID"
          tip="Search for a ticket using the ID of the order it is associated to."
        >
          <Input
            type="number"
            placeholder="e.g. 1234"
            className="pl-2 !w-6/12"
            value={values.order}
            onChange={(e) => {
              setValues({
                ...values,
                order: e.target.value,
              });
            }}
          />
        </FilterItem>

        <FilterItem
          title="By Dispute ID"
          tip="Find a ticket based on the ID of the dispute it's associated to."
        >
          <Input
            type="number"
            placeholder="e.g. 323"
            className="pl-2 !w-6/12"
            value={values.dispute}
            onChange={(e) => {
              setValues({
                ...values,
                dispute: e.target.value,
              });
            }}
          />
        </FilterItem>

        <FilterItem
          title="Status"
          tip="Find tickets based on their current status"
        >
          <div className="mr-1 w-full">
            <Select
              value={values.status || ""}
              onValueChange={(val) => {
                setValues({ ...values, status: val });
              }}
            >
              <SelectTrigger className="!w-6/12 transition-all duration-500 hover:border-chinese-green hover:scale-x-105 data-[state=open]:border-chinese-green data-[state=open]:scale-x-105 focus:scale-x-105">
                <SelectValue placeholder="All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All</SelectItem>
                <SelectItem value="maturing">Maturing</SelectItem>
                <SelectItem value="matured">Matured</SelectItem>
                <SelectItem value="joined">Joined</SelectItem>
                <SelectItem value="expiring">Expiring</SelectItem>
                <SelectItem value="drafted">Drafted</SelectItem>
                <SelectItem value="undrafted">Undrafted</SelectItem>
                <SelectItem value="slashed">Slashed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
                <SelectItem value="drained">Drained</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </FilterItem>
      </Accordion>
      <div className="px-5 py-5">
        <Button
          size="full"
          onClick={() => {
            const cloned = { ...values };
            navigate({
              pathname: "/tickets/owned",
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
