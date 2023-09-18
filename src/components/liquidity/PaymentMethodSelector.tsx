import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover.tsx";
import { Button } from "../ui/Button.tsx";
import { Avatar } from "../avatar/Avatar.tsx";
import IconSpinner from "../icons/IconSpinner.tsx";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command.tsx";
import { cn } from "../../libs/utils.ts";

export function PaymentMethodSelector({
  open,
  setOpen,
  isLoading,
  selected,
  payMethods,
  setSelected,
  onSelected,
  filterMethods,
  contentClassName,
  triggerClassName,
}: {
  contentClassName?: string;
  triggerClassName?: string;
  open: boolean;
  setOpen: (open: boolean) => void;
  isLoading: boolean;
  selected: PaymentMethod | undefined;
  payMethods: PaymentMethod[] | undefined;
  setSelected?: (method: PaymentMethod) => void | undefined;
  onSelected?: (method: PaymentMethod) => void | undefined;
  filterMethods?: (method: PaymentMethod) => boolean;
}) {
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger disabled={isLoading} asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "text-xs pl-2 xxs:text-sm flex-1 mx-1 justify-between pr-2 border-none transition-all duration-500 hover:bg-transparent hover:text-gray-100 hover:scale-[1.02] data-[state=open]:scale-[1.02]",
            triggerClassName
          )}
        >
          {!selected && "Select payment method"}
          {selected && (
            <span className="flex gap-2 items-center">
              <span className="w-[25px]">
                <Avatar
                  className="w-[25px] h-[25px] rounded"
                  src={selected.logoUrl}
                  fallbackClassName="w-[25px] h-[25px] rounded bg-card-background"
                  fallback={<IconSpinner className="animate-spin" width="15" />}
                />
              </span>
              <span>{selected.name}</span>
            </span>
          )}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className={cn(
          "p-0 xs:w-[385px] ml-[20px] xxs:w-[335px] w-[280px] md:ml-[60px] md:w-[345px]  border-card-border bg-card-background",
          contentClassName
        )}
        sideOffset={5}
      >
        <Command className="w-full bg-card-background text-gray-200 border-card-border">
          <CommandInput
            placeholder="Search payment methods"
            wrapperClass="border-gray-700"
            className="h-9"
          />
          <CommandEmpty>No payment method found.</CommandEmpty>
          <CommandGroup>
            {!!payMethods &&
              payMethods
                .filter((method) => {
                  return filterMethods ? filterMethods(method) : true;
                })
                .filter((method) => {
                  return method.badge != selected?.badge;
                })
                .map((method) => (
                  <CommandItem
                    className="text-gray-200 cursor-pointer py-0"
                    key={method.badge}
                    onSelect={() => {
                      setSelected && setSelected(method);
                      setOpen && setOpen(false);
                      onSelected && onSelected(method);
                    }}
                  >
                    <div className="flex gap-2 items-center">
                      <span className="w-[25px]">
                        <Avatar
                          className="w-[25px] h-[25px] rounded"
                          fallbackClassName="w-[25px] h-[25px] rounded bg-card-background"
                          src={method.logoUrl}
                          fallback={
                            <IconSpinner className="animate-spin" width="15" />
                          }
                        />
                      </span>
                      <span>{method.name}</span>
                    </div>
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        selected?.badge === method.badge
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
