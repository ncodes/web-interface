import { Button } from "../ui/Button.tsx";
import { Input } from "../ui/Input.tsx";
import { BalanceCard, BalanceCardLink } from "./BalanceCard.tsx";

function FundPouch() {
  return (
    <div className="flex flex-col mt-5 border-t border-gray-800 pt-5">
      <BalanceCard symbol="Pouch (P2P)" balance="34.50" hideHelp>
        <BalanceCardLink title="Withdraw" />
      </BalanceCard>
      <div className="flex flex-col gap-2 mt-5 text-left">
        <h1 className="font-normal tracking-wider text-[18px]">Fund Pouch</h1>
        <p className="font-light text-[13px] text-gray-400 tracking-wide">
          Add P2P to your Pouch to pay trading fees for your liquidity in
          non-ERC20 markets.
        </p>
        <div className="flex gap-2 pb-5 mt-2">
          <Input type="number" variant="primary" placeholder="0.00" w="sm" />
          <Button variant="secondary" rounded="md" size="sm">
            Approve
          </Button>
          <Button variant="default" rounded="md" size="sm">
            Deposit
          </Button>
        </div>
      </div>
    </div>
  );
}
