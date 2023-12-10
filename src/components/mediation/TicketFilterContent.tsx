import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useStore from "../../hooks/store/useStore.ts";
import { useUrlQuery } from "../../hooks/useUrlQuery.ts";
import { rmUndefinedAndNull } from "../../libs/helpers.ts";
import { FilterItem } from "../FilterItem.tsx";
import Input2 from "../Input2.tsx";
import ScrollOverflowIndicator from "../ScrollOverflowIndicator.tsx";
import Select2 from "../Select2.tsx";
import { Button } from "../ui/Button.tsx";
import { Accordion } from "../ui/accordion.tsx";
import { ScrollArea } from "../ui/scroll-area.tsx";
import { SelectItem } from "../ui/select.tsx";

interface Values {
  pool?: string;
  order?: string;
  dispute?: string;
  status?: string;
}

export function TicketFilterContent() {
  const query = useUrlQuery();
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
    <div className="flex flex-col h-full ">
      <ScrollOverflowIndicator side="bottom" className="flex-1 h-full">
        <ScrollArea
          type="scroll"
          viewportClassName="absolute xl:relative"
          className="h-full relative"
        >
          <Accordion type="multiple">
            <FilterItem
              title="By Pool ID"
              tip="Find tickets belonging to a pool"
            >
              <Input2
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
              <Input2
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
              <Input2
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
                <Select2
                  value={values.status || ""}
                  placeholder="All"
                  className="w-[200px]"
                  triggerClassName="w-full"
                  onValueChange={(val) => {
                    setValues({ ...values, status: val });
                  }}
                >
                  <>
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
                  </>
                </Select2>
              </div>
            </FilterItem>
          </Accordion>
        </ScrollArea>
      </ScrollOverflowIndicator>
      <div className="px-5 py-5 pt-2 xl:pt-3">
        <Button
          size="full"
          variant="outline"
          onClick={() => {
            const cloned = { ...values };
            navigate({
              pathname: "/my/tickets",
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
