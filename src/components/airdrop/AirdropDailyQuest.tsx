import { useQuery } from "@tanstack/react-query";
import { useConnectorContext } from "../../hooks/connectors/useConnectorContext";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService";
import { Button } from "../ui/Button";
import { AirdropApplyLuckyCode } from "./AirdropApplyLuckyCode";
import { AirdropQuestVerificationRequest } from "./AirdropQuestVerificationRequest";

export function AirdropDailyQuest() {
  const { ready } = useConnectorContext();
  const { getQuests } = useAirdropService();

  const getQuestsQuery = useQuery({
    queryKey: ["getQuests", {}],
    queryFn: getQuests,
    initialData: [],
    enabled: ready,
    refetchInterval: 10000,
  });

  return (
    <div className="flex-1">
      <div>
        <div className="flex rounded-2xl gap-2 border border-gray-800 p-4 pb-2 pt-2 font-bold tracking-wider">
          <span>
            <img src="/images/airdrop-icons/quest.svg" className="w-6" />
          </span>
          <span>Daily Quests</span>
        </div>
        <div className="flex flex-col gap-3 py-3 [&_a]:text-chinese-green [&_a]:underline underline-offset-4">
          {getQuestsQuery.data.map((quest) => {
            return (
              <div key={quest.id}>
                {quest.type == "follow" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-10">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <span className="font-light">
                          Follow{" "}
                          <a
                            href={`https://twitter.com/${"@" + quest.account}`}
                          >
                            @{quest.account}
                          </a>
                        </span>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "tweet" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">
                          <div>Create a tweet about Joint Protocol. </div>
                          {quest.account && (
                            <span className="text-gray-400">
                              Mention{" "}
                              <a
                                href={`https://twitter.com/${"@" + quest.account}`}
                              >
                                @{quest.account}
                              </a>
                            </span>
                          )}
                          {quest.tag && (
                            <span className="text-gray-400">
                              {" "}
                              and{" "}
                              <span className="text-gray-200 font-medium">
                                {quest.tag}
                              </span>
                            </span>
                          )}
                        </div>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "quote" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">
                          <div>
                            Quote, like and retweet this{" "}
                            <a href={quest.link}>tweet</a>.{" "}
                          </div>
                        </div>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "reply" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">
                          <div>
                            Reply, like and retweet this{" "}
                            <a href={quest.link}>tweet</a>.{" "}
                          </div>
                        </div>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "private-sale" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">
                          <div>Register for Joint Private Sale</div>
                        </div>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button
                        size="sm"
                        className="hover:scale-105 bg-pink-500 hover:bg-pink-600"
                      >
                        Apply
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "swap" && (
                  <div className="flex justify-between p-4 border border-gray-800 rounded-xl">
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      <div className="flex flex-col">
                        <div className="font-normal">
                          <div>
                            Complete {quest.count} swap
                            {quest.count > 1 ? "s" : ""} on{" "}
                            <a
                              href={`/liquidity/${quest.marketAddress}/${quest.provider}/${quest.lid}`}
                            >
                              {quest.market.base}/{quest.market.quote}
                            </a>
                          </div>
                        </div>
                        <span className="font-light text-sm text-green-400">
                          +{quest.engagePoints} pts
                        </span>
                      </div>
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}

                {quest.type == "verify" && (
                  <div className="flex relative justify-between p-4 border border-chinese-green/50 rounded-xl mt-2">
                    <span className="absolute border border-chinese-green/50 text-[10px] tracking-wider bg-black px-2 rounded-full py-1 font-light -mt-3 top-0">
                      Community Verification
                    </span>
                    <div className="flex gap-3 md:pr-2">
                      <img
                        src="/images/airdrop-icons/twitter.svg"
                        className="w-5"
                      />
                      {quest.parent.type == "quote" && (
                        <div className="flex flex-col">
                          <div className="font-normal">
                            <div>
                              Verify @{quest.responder.twitterUsername}'s quote
                              tweet
                            </div>
                          </div>
                          <span className="font-light text-sm text-green-400">
                            +{quest.parent.verifyPoints} pts
                          </span>
                        </div>
                      )}

                      {quest.parent.type == "tweet" && (
                        <div className="flex flex-col">
                          <div className="font-normal">
                            <div>
                              Verify @{quest.responder.twitterUsername}'s tweet
                            </div>
                          </div>
                          <span className="font-light text-sm text-green-400">
                            +{quest.parent.verifyPoints} pts
                          </span>
                        </div>
                      )}

                      {quest.parent.type == "reply" && (
                        <div className="flex flex-col">
                          <div className="font-normal">
                            <div>
                              Verify @{quest.responder.twitterUsername}'s tweet
                              reply
                            </div>
                          </div>
                          <span className="font-light text-sm text-green-400">
                            +{quest.parent.verifyPoints} pts
                          </span>
                        </div>
                      )}

                      {quest.parent.type == "follow" && (
                        <div className="flex flex-col">
                          <div className="font-normal">
                            <div>
                              Verify @{quest.responder.twitterUsername}'s follow
                            </div>
                          </div>
                          <span className="font-light text-sm text-green-400">
                            +{quest.parent.verifyPoints} pts
                          </span>
                        </div>
                      )}
                    </div>
                    <AirdropQuestVerificationRequest quest={quest}>
                      <Button size="sm" className="hover:scale-105">
                        Verify
                      </Button>
                    </AirdropQuestVerificationRequest>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="lg:hidden">
        <AirdropApplyLuckyCode />
      </div>
    </div>
  );
}
