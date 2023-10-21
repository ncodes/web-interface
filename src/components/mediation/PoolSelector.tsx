import { ReactNode, useState } from "react";
import { cn } from "../../libs/helpers";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ScrollArea } from "../ui/scroll-area";

export function PoolSelector({
  children,
  pools,
  onSelect,
  disabled,
}: {
  pools: MediatorPool[];
  children: ReactNode;
  open?: boolean;
  onSelect?: (pool: MediatorPool) => void;
  disabled?: boolean;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        disabled={disabled}
        className="outline-0 ring-0"
        asChild
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[250px] outline-0 shadow-xl drop-shadow-2xl rounded-2xl bg-modal-background border-gray-600 text-gray-200 px-0 py-0">
        <ScrollArea className="h-[200px]" type="scroll">
          {pools.map((pool) => (
            <PoolItem pool={pool} key={pool.id} onSelect={onSelect} />
          ))}
        </ScrollArea>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function PoolItem({
  pool,
  onSelect,
}: {
  pool: MediatorPool;
  onSelect?: (pool: MediatorPool) => void;
}) {
  const [highlighted, setHighlighted] = useState(false);

  return (
    <DropdownMenuItem
      className="m-1 rounded-xl"
      onSelect={() => {
        onSelect?.(pool);
      }}
      onFocus={() => {
        setHighlighted(true);
      }}
      onBlur={() => {
        setHighlighted(false);
      }}
    >
      <div className="p-1 ">
        <div className="flex w-full justify-between pb-1">
          <span className="font-medium text-[16px]">{pool.name}</span>
          <span
            className={cn("font-light text-xs text-gray-400", {
              "text-gray-800": highlighted,
            })}
          >
            ID: {pool.id}
          </span>
        </div>
        <div
          className={cn("font-light text-xs text-gray-400", {
            "text-gray-800": highlighted,
          })}
        >
          {pool.description}
        </div>
      </div>
    </DropdownMenuItem>
  );
}
