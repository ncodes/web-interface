import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useAirdropService } from "../../hooks/services/backend/useAirdropService";
import useStore from "../../hooks/store/useStore";
import { useToast } from "../../hooks/useToast";
import { cn } from "../../libs/helpers";
import IconSpinner from "../icons/IconSpinner";
import { Button } from "../ui/Button";

export function AirdropAccountConnect() {
  const connectTwitterLink = `https://twitter.com/i/oauth2/authorize?response_type=code&client_id=${import.meta.env.VITE_TWITTER_CLIENT_ID}&redirect_uri=${import.meta.env.VITE_TWITTER_CALLBACK_URL}&scope=users.read%20offline.access%20tweet.read&code_challenge=challenge&code_challenge_method=plain&state=twitter`;
  const connectDiscordLink = `https://discord.com/oauth2/authorize?client_id=${import.meta.env.VITE_DISCORD_CLIENT_ID}&response_type=code&redirect_uri=${import.meta.env.VITE_DISCORD_CALLBACK_URL}&scope=identify+guilds+guilds.members.read&state=discord`;
  const user = useStore((state) => state.user);
  const [searchParams, setSearchParams] = useSearchParams();
  const { linkTwitterUser, unlinkTwitter, linkDiscordUser, unlinkDiscord } =
    useAirdropService();
  const { notifyError, notifySuccess } = useToast();
  const authCode = searchParams.get("code");
  const state = searchParams.get("state");
  const [loading, setLoading] = useState({ twitter: false, discord: false });
  const queryClient = useQueryClient();
  const [connectedAcct, setConnectedAct] = useState(0);

  const linkTwitterMut = useMutation({
    mutationFn: linkTwitterUser,
  });

  const linkDiscordMut = useMutation({
    mutationFn: linkDiscordUser,
  });

  const unlinkTwitterMut = useMutation({
    mutationFn: unlinkTwitter,
  });

  const unlinkDiscordMut = useMutation({
    mutationFn: unlinkDiscord,
  });

  // Handle twitter auth code linking
  useEffect(() => {
    if (state != "twitter") return;
    if (!user || user.twitterUsername || !authCode) return;
    setLoading({ ...loading, twitter: true });

    const link = async function () {
      try {
        await linkTwitterMut.mutateAsync(authCode);
        searchParams.delete("code");
        searchParams.delete("state");
        setSearchParams(searchParams);
        queryClient.refetchQueries({ queryKey: ["getUser"] });
        setLoading({ ...loading, twitter: false });
        notifySuccess("Twitter account linked successfully");
      } catch (err) {
        notifyError((err as { message: string }).message);
        setLoading({ ...loading, twitter: false });
      }
    };

    link?.();
  }, [state, user]);

  // Handle discord auth code linking
  useEffect(() => {
    if (state != "discord") return;
    if (!user || user.discordId || !authCode) return;
    setLoading({ ...loading, discord: true });

    const link = async function () {
      try {
        await linkDiscordMut.mutateAsync(authCode);
        searchParams.delete("code");
        searchParams.delete("state");
        setSearchParams(searchParams);
        queryClient.refetchQueries({ queryKey: ["getUser"] });
        setLoading({ ...loading, discord: false });
        notifySuccess("Discord account linked successfully");
      } catch (err) {
        notifyError((err as { message: string }).message);
        setLoading({ ...loading, discord: false });
      }
    };

    link?.();
  }, [state, user]);

  useEffect(() => {
    if (!user) return;
    let count = 0;
    if (user.twitterUsername) count++;
    if (user.discordId) count++;
    setConnectedAct(count);
  }, [user]);

  function disconnetTwitter(e) {
    e.preventDefault();
    setLoading({ ...loading, twitter: true });
    unlinkTwitterMut
      .mutateAsync()
      .then(() => {
        queryClient.refetchQueries({ queryKey: ["getUser"] });
      })
      .finally(() => {
        setLoading({ ...loading, twitter: false });
      });
  }

  function disconnetDiscord(e) {
    e.preventDefault();
    setLoading({ ...loading, discord: true });
    unlinkDiscordMut
      .mutateAsync()
      .then(() => {
        queryClient.refetchQueries({ queryKey: ["getUser"] });
      })
      .finally(() => {
        setLoading({ ...loading, discord: false });
      });
  }

  return (
    <div className=" border rounded-xl border-gray-800">
      <div className="flex rounded-b-2xl  justify-between tracking-wider p-2 gap-3 px-4 border-b border-gray-800">
        <div className="flex items-center gap-3 font-bold text-xl font-jersey25 tracking-wider">
          <img src="/images/airdrop-icons/connect.svg" className="w-5" />
          <span>Connect Socials</span>
        </div>
        <span className="inline-block mt-1 font-light text-sm text-gray-400">
          {connectedAcct}/2
        </span>
      </div>

      <a
        href={connectTwitterLink}
        onClick={(e) => {
          if (loading.twitter || (user && user.twitterUsername))
            e.preventDefault();
        }}
      >
        <div
          className={cn(
            "py-3 h-auto px-5 rounded-none block w-full hover:text-gray-100 hover:bg-transparent",
            {
              "hover:bg-transparent cursor-default": !!user?.twitterUsername,
              "hover:bg-gray-900": !loading.twitter && !user?.twitterUsername,
            },
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn("flex gap-3 xxs:pr-5", {
                "opacity-50": !!user?.twitterUsername,
              })}
            >
              <img src="/images/airdrop-icons/twitter.svg" className="w-5" />
              {user?.twitterUsername ? (
                <span className="font-light">X Connected</span>
              ) : (
                <span className="font-light text-gray-300">
                  Connect your X account
                </span>
              )}
            </div>
            {loading.twitter ? (
              <>
                <IconSpinner
                  width="20"
                  className="animate-spin text-gray-600"
                />
              </>
            ) : (
              <>
                {!user?.twitterUsername && (
                  <>
                    {!user?.twitterLinkedAt ? (
                      <span className="shrink-0 w-20 h-7 font-normal bg-chinese-green hover:scale-110 transition-all duration-300 rounded-full text-black flex items-center justify-center text-sm">
                        +30 pts
                      </span>
                    ) : (
                      <span className="shrink-0 w-20 h-7 font-normal bg-chinese-green hover:scale-110 transition-all duration-300 rounded-full text-black flex items-center justify-center text-sm">
                        Connect
                      </span>
                    )}
                  </>
                )}
                {user?.twitterUsername && (
                  <Button
                    variant="link"
                    className="shrink-0 cursor-pointer w-20 h-7 font-normal text-gray-400 hover:text-gray-300 rounded-full flex items-center justify-center text-sm"
                    onClick={disconnetTwitter}
                  >
                    Disconnect
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </a>

      <a
        href={connectDiscordLink}
        onClick={(e) => {
          if (loading.discord || (user && user.discordId)) e.preventDefault();
        }}
      >
        <div
          className={cn(
            "py-3 h-auto px-5 rounded-none block w-full hover:text-gray-100 hover:bg-transparent",
            {
              "hover:bg-transparent cursor-default": !!user?.discordId,
              "hover:bg-gray-900": !loading.discord && !user?.discordId,
            },
          )}
        >
          <div className="flex items-center justify-between">
            <div
              className={cn("flex gap-3 xxs:pr-5", {
                "opacity-50": !!user?.discordId,
              })}
            >
              <img src="/images/airdrop-icons/discord.svg" className="w-5" />
              {user?.discordId ? (
                <span className="font-light">Discord Connected</span>
              ) : (
                <span className="font-light text-gray-300">
                  Connect your Discord account
                </span>
              )}
            </div>
            {loading.discord ? (
              <>
                <IconSpinner
                  width="20"
                  className="animate-spin text-gray-600"
                />
              </>
            ) : (
              <>
                {!user?.discordId && (
                  <>
                    {!user?.discordLinkedAt ? (
                      <span className="shrink-0 w-20 h-7 font-normal bg-chinese-green hover:scale-110 transition-all duration-300 rounded-full text-black flex items-center justify-center text-sm">
                        +30 pts
                      </span>
                    ) : (
                      <span className="shrink-0 w-20 h-7 font-normal bg-chinese-green hover:scale-110 transition-all duration-300 rounded-full text-black flex items-center justify-center text-sm">
                        Connect
                      </span>
                    )}
                  </>
                )}
                {user?.discordId && (
                  <Button
                    variant="link"
                    className="shrink-0 cursor-pointer w-20 h-7 font-normal text-gray-400 hover:text-gray-300 rounded-full flex items-center justify-center text-sm"
                    onClick={disconnetDiscord}
                  >
                    Disconnect
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </a>
    </div>
  );
}
