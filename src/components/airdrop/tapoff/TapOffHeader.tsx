import { LucideFlame, PieChart } from "lucide-react";
import IconFriends from "../../icons/IconFriends.tsx";
import IconTask from "../../icons/IconTask.tsx";
import { Button } from "../../ui/Button.tsx";

export function TapOffHeader() {
  return (
    <div className="border-b bg-airdropHeader2 md:bg-airdropHeader3 bg-right-bottom lg:bg-right lg:bg-airdropHeader bg-cover border-gray-900 flex flex-col md:flex-row justify-between items-center md:items-start p-5 py-3">
      <span className="text-3xl tracking-wider font-semibold font-jersey10 inline-block ml-2">
        TapOff
      </span>
      <div className="flex gap-3">
        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 hover:scale-110 hover:rotate-2"
        >
          <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
            <span>
              <IconFriends width="20" className="" />
            </span>
            <span className="text-black font-jersey25 tracking-wider">Ref</span>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 hover:scale-110 hover:-rotate-2"
        >
          <div
            className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r
   from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50"
          >
            <span>
              <IconTask width="20" className="" />
            </span>
            <span className="text-black font-jersey25 tracking-wider">
              Task
            </span>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 hover:scale-110 hover:rotate-2"
        >
          <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
            <span>
              <LucideFlame />
            </span>
            <span className="text-black font-jersey25 tracking-wider">
              Boost
            </span>
          </div>
        </Button>

        <Button
          variant="ghost"
          className="hover:bg-transparent p-0 hover:scale-110 hover:rotate-2"
        >
          <div className="flex w-[60px] flex-col border  items-center rounded-lg px-3 py-1 bg-gradient-to-r from-amber-400 via-yellow-300 to-yellow-500 text-black border-yellow-100/50">
            <span>
              <PieChart />
            </span>
            <span className="text-black font-jersey25 tracking-wider">
              Stats
            </span>
          </div>
        </Button>
      </div>
    </div>
  );
}
