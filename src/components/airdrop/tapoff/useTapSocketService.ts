import { useEffect, useState } from "react";
import { Manager, Socket } from "socket.io-client";
import { useSession } from "../../../hooks/useSession";

export interface TapResult {
  overheatLvl: number;
  overheatLastUpdated: number;
  tapCount: string;
  tapIncrement: number;
  success?: boolean;
  message?: string;
}

export interface PingResult {
  lastTapAt: number;
  overheatLvl: number;
  overheatLastUpdated: number;
  success?: boolean;
  message?: string;
}

export interface ApplyMultiplierResult {
  success?: boolean;
  message?: string;
  newBalance: string;
}

export interface CountTapsResult {
  count: string;
  success?: boolean;
  message?: string;
}

export interface RankInfo {
  [key: string]: {
    taps: number;
    reward: number;
  };
}

export interface InfoResult {
  success?: boolean;
  message?: string;
  maxOverheatLvl: number;
  overheatLvl: number;
  tapCount: string;
  tapIncrement: string;
  rank: string;
  isDiscordConnected: boolean;
  markedTwitterFollow: boolean;
  markedTelegramFollow: boolean;
  markedWebVisitFollow: boolean;
  followQuestCompleted: boolean;
  followQuestBonusAwarded: boolean;
  followQuestReward: string;
  rapidFire: CommonFreeBoostInfo;
  instantCool: CommonFreeBoostInfo;
  hyperFire: CommonBoostInfo;
  antiOverheat: CommonBoostInfo;
  hyperCool: CommonBoostInfo;
  gameStats: {
    totalBalance: string;
    totalShots: string;
    totalPlayers: string;
    totalPlayersLast24h: string;
    totalPlayersLast1min: string;
  };
  multiplier: {
    balance: string;
    cost: string;
    value: number;
    canSpend: boolean;
    curWindowEndsAt?: string;
  };
  rankInfo: RankInfo;
  rankBonusClaimStatus: Record<string, boolean>;
  referralInfo: { count: number; reward: number }[];
  claimableReferrals: number;
}

interface CommonFreeBoostInfo {
  active?: boolean;
  numUsed: number;
  maxPerWindow: number;
  lastUsedAt: string;
  windowDur: number;
}

interface CommonBoostInfo {
  level: number;
  cost: string;
  increment: number;
  nextLevelCost: string;
  nextLevelIncrement: number;
}

export const ErrorOverheating = new Error("Overheating");
export const ErrorPingCooldown = new Error("Ping cooldown required");
export const ErrorTapCooldown = new Error("Tap cooldown required");
export const ErrorAuthFailed = new Error("Not authenticated");

const manager = new Manager(`${import.meta.env.VITE_PRIMARY_API_URL}`, {
  autoConnect: false,
  reconnection: true,
  transports: ["websocket"],
});

const socket: Socket = manager.socket("/v1/taps");

export default function useTapSocketService() {
  const { token } = useSession();
  const [isConnected, setIsConnected] = useState(socket?.connected);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (isAuthenticated || !isConnected) return;
    setIsReady(false);
    socket.emit("auth", { token }, (res) => {
      setTimeout(() => {
        setIsAuthenticated(res.success);
        setIsReady(true);
      }, 1000);
    });
  }, [isAuthenticated, isConnected]);

  useEffect(() => {
    if (!token) return;

    function onConnect() {
      setIsConnected(true);
    }

    function onDisconnect() {
      setIsConnected(false);
      setIsAuthenticated(false);
      setIsReady(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    if (!isConnected) {
      socket.connect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token]);

  async function tap(): Promise<TapResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("tap", (res: TapResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            if (res.message == "You are overheating")
              return reject(ErrorOverheating);
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function ping(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("ping", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            if (res.message == "Ping cooldown required")
              return reject(ErrorPingCooldown);
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function countTaps(): Promise<CountTapsResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    if (!isAuthenticated) throw new Error("Not authenticated");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("countTaps", (res: CountTapsResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function applyRapidFire(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("applyRapidFire", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function applyInstantCool(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("applyInstantCool", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function buyHyperFire(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("buyHyperFire", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function buyAntiOverheat(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("buyAntiOverheat", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function buyHyperCool(): Promise<PingResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("buyHyperCool", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function applyMultiplier(
    amount: string,
  ): Promise<ApplyMultiplierResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit(
          "applyMultiplier",
          { amount },
          (res: ApplyMultiplierResult) => {
            if (!res.success) {
              if (res.message == "Not authenticated")
                return reject(ErrorAuthFailed);
              return reject(new Error(res.message));
            }

            delete res.success;
            resolve(res);
          },
        );
      } catch (error) {
        reject(error);
      }
    });
  }

  async function info(): Promise<InfoResult> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("info", (res: InfoResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function markFollows(
    platform: "x" | "telegram" | "webvisit",
  ): Promise<void> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("markFollows", { [platform]: true }, (res) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function claimQuestsReward(): Promise<void> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("claimQuestsReward", (res) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function claimRankBonus(rank: string): Promise<void> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("claimRankBonus", { rank }, (res) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  async function claimReferralBonus(count: number): Promise<void> {
    if (!socket) throw new Error("Socket not initialized");
    if (!isConnected) throw new Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("claimReferralBonus", { count }, (res) => {
          if (!res.success) {
            if (res.message == "Not authenticated") {
              setIsAuthenticated(false);
              return reject(ErrorAuthFailed);
            }
            return reject(new Error(res.message));
          }

          delete res.success;
          resolve(res);
        });
      } catch (error) {
        reject(error);
      }
    });
  }

  function connect() {
    socket?.connect();
  }

  return {
    socket,
    tap,
    ping,
    countTaps,
    info,
    isReady,
    connect,
    applyRapidFire,
    applyInstantCool,
    buyHyperFire,
    buyAntiOverheat,
    buyHyperCool,
    applyMultiplier,
    markFollows,
    claimQuestsReward,
    claimRankBonus,
    claimReferralBonus,
    isAuthenticated,
  };
}
