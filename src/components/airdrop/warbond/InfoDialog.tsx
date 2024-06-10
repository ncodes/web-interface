import { X } from "lucide-react";
import { useState } from "react";
import { Button } from "../../ui/Button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../ui/Dialog";

export function InfoDialog({ type }: { type: string }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog
      open={open}
      modal={true}
      onOpenChange={(open) => {
        setOpen(open);
      }}
    >
      <div className="flex justify-center items-center select-none">
        <DialogTrigger asChild>
          <Button
            variant="link"
            className="text-xl border p-4 ml-2 border-gray-700 py-0.5 h-auto hover:border-chinese-green"
          >
            About
          </Button>
        </DialogTrigger>

        <DialogContent className="p-0 outline-none select-none w-[310px] xxs:w-[350px] md:w-auto lg:w-[425px] top-[15%] border-modal-border bg-modal-background text-white">
          {type === "warbond" && (
            <>
              <DialogHeader className=" space-y-0">
                <DialogTitle className="text-center  text-gray-100 font-jersey20 text-2xl tracking-wide rounded-t-lg py-1">
                  About WarBond
                </DialogTitle>
              </DialogHeader>
              <div className="min-h-[200px] text-sm max-h-[400px] overflow-auto p-4 font-light tracking-wider">
                <b>WarBond</b> is a game that allows you to place a bet on the
                outcome of the <b>TapWar</b> between the Droids and Bandits for
                a share of the daily portion of Joint's $JOIN token.
                <br />
                <br />
                <b className="text-yellow-400 font-abrilFatFace tracking-wider text-lg">
                  How does it work?
                </b>
                <br />
                <br />
                <ul className="list-outside list-disc ml-3 flex flex-col gap-2">
                  <li>
                    Everyday at 00:00:00 UTC a new battle is started. Every
                    TapWar player is assigned to the <i>Droid</i> or{" "}
                    <i>Bandit</i> side. Each battle will be allocated a fixed
                    amount of $JOIN tokens.
                  </li>

                  <li>
                    Anyone can buy war $BOND and stake on whether the Droid or
                    Bandit will win (finish the battle with the most TAPs).
                  </li>

                  <li>
                    The side that wins get a portion of the $JOIN allocation
                    based on the win percentage. So if the win side gets 60% of
                    TAPS, then 60% of the $JOIN allocation will be shared to the
                    bond holders of the win side. The rest shared to the lose
                    side.
                  </li>

                  <li>
                    As a bond staker, you get a share of the win/lose side
                    allocation in proportion to the amount of bond you staked
                    and age of your stake - large and early stake = higher
                    allocation.
                  </li>

                  <li>
                    At the end of a battle, allocations are disbursed and
                    visible on the dashboard.
                  </li>

                  <li>
                    You can buy war $BOND in a designated Joint market. Note:
                    $BOND are only meant for side staking. It carries no value
                    outside the game, it is non-refundable and will become
                    useless at the end of the game.
                  </li>
                </ul>
              </div>
            </>
          )}

          {type === "tapwar" && (
            <>
              <DialogHeader className=" space-y-0">
                <DialogTitle className="text-center  text-gray-100 font-jersey20 text-2xl tracking-wide rounded-t-lg py-1">
                  About TapWar
                </DialogTitle>
              </DialogHeader>
              <div className="min-h-[200px] text-sm max-h-[400px] overflow-auto p-4 font-light tracking-wider">
                <b>TapWar</b> is a fun tapping game where you can tap as fast as
                you can to increase your score and rank. The higher your TAP
                score the greater your chance to receive potential $JOIN token
                allocation. TapWar is a battle between the good guys (Droids)
                and the bad guys (Bandits).
                <br />
                <br />
                <b className="text-yellow-400 font-abrilFatFace tracking-wider text-lg">
                  How does it work?
                </b>
                <br />
                <br />
                <ul className="list-outside list-disc ml-3 flex flex-col gap-2">
                  <li>
                    Tap the ship as fast as you can to fire the enemy - The
                    Bandits.
                  </li>
                  <li>
                    As you tap, you ship will overheat. If your overheat level
                    gets to 0, you will need to wait to cooldown.
                  </li>
                  <li>
                    As your TAP score increases, your rank increases and your
                    ship progressively changes.
                  </li>
                  <li>
                    <div>
                      Use the Boost menu to get ahead. Some power-ups include:
                    </div>
                    <div>
                      <ul className="list-outside list-disc ml-3 flex flex-col gap-2 mt-2">
                        <li>
                          <b>Rapid Fire:</b> Gives you 5x more TAPs per tap.
                        </li>
                        <li>
                          <b>Instant Cool:</b> Instant cools down your ship. No
                          wait time.
                        </li>
                        <li>
                          <b>Hyper Fire:</b> Get more TAPs for each tap action.
                        </li>
                        <li>
                          <b>Anti-Overheat:</b> Increase your overheat
                          resistance level.
                        </li>
                        <li>
                          <b>Hyper Cool:</b> Recover from overheat faster
                        </li>
                        {/* <li>
                          <b>Tap Multiplier:</b> Buy multipliers to increase
                          your overall TAPs.
                        </li> */}
                      </ul>
                    </div>
                  </li>
                  <li>
                    Complete quests and refer your friends to receive bonus TAPs
                  </li>
                </ul>
              </div>
            </>
          )}

          <X
            className="absolute right-0 mr-2 top-2 cursor-pointer opacity-80 hover:opacity-100 text-gray-900"
            onClick={() => {
              setOpen(false);
            }}
          />
        </DialogContent>
      </div>
    </Dialog>
  );
}
