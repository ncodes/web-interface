import { useEffect, useState } from "react";
import { Manager, Socket } from "socket.io-client";
import { useInterval } from "usehooks-ts";
import { useConnectorContext } from "../../../hooks/connectors/useConnectorContext";
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

export interface CountTapsResult {
  count: string;
  success?: boolean;
  message?: string;
}

export interface InfoResult {
  success?: boolean;
  message?: string;
  maxOverheatLvl: number;
  tapCount: string;
  tapIncrement: string;
  rank: string;
  rapidFire: CommonFreeBoostInfo;
  instantCool: CommonFreeBoostInfo;
  hyperFire: CommonBoostInfo;
  antiOverheat: CommonBoostInfo;
  hyperCool: CommonBoostInfo;
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

export default function useTapSocketService() {
  const manager = new Manager(`${import.meta.env.VITE_PRIMARY_API_URL}`, {
    autoConnect: false,
    reconnection: true,
    transports: ["websocket"],
  });

  const { address } = useConnectorContext();
  const { getAccessToken } = useSession();
  const [token, setToken] = useState(getAccessToken(address));
  const [socket, setSocket] = useState<Socket>(manager.socket("/v1/taps"));
  const [isConnected, setIsConnected] = useState(socket.connected);

  useInterval(
    () => {
      const token = getAccessToken(address);
      setToken(token);
    },
    !token ? 100 : null,
  );

  useEffect(() => {
    if (!token) return;

    function onConnect() {
      socket.emit("auth", { token }, (res) => {
        setIsConnected(res.success);
        setSocket(socket);
      });
    }

    function onDisconnect() {
      console.log("DISCONNECTED");
      setIsConnected(false);
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, [token]);

  async function tap(): Promise<TapResult> {
    if (!isConnected) throw Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("tap", (res: TapResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated")
              return reject(ErrorAuthFailed);
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
    if (!isConnected) throw Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("ping", (res: PingResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated")
              return reject(ErrorAuthFailed);
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
    if (!isConnected) throw Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("countTaps", (res: CountTapsResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated")
              return reject(ErrorAuthFailed);
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

  async function info(): Promise<InfoResult> {
    if (!isConnected) throw Error("Not connected");
    return new Promise((resolve, reject) => {
      try {
        socket.emit("info", (res: InfoResult) => {
          if (!res.success) {
            if (res.message == "Not authenticated")
              return reject(ErrorAuthFailed);
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
    socket.connect();
  }

  return {
    socket,
    tap,
    ping,
    countTaps,
    info,
    token,
    isConnected,
    connect,
  };
}
