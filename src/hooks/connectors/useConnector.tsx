import { useEffect, useState } from "react";
import { BigNumberish, Contract, Signer } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import { getNetworkByChainId, Nets } from "./networks";

import {
  Chain,
  useAccount,
  useDisconnect,
  useNetwork,
  useProvider,
  useSigner,
  useSignMessage,
  useSwitchNetwork,
} from "wagmi";

type ContractNames = "energon" | "nft";

export interface IConnector {
  defaultNetwork: number;

  getContract(name: ContractNames, f: (contract: Contract) => void);

  provider: Web3Provider;
  connected: boolean;
  disconnect: () => Promise<void>;
  getBalance: () => Promise<BigNumberish>;
  ready: boolean;
  address: string;

  sign: (msg: string) => Promise<string>;
  signedData: string;
  signStatus: string;

  switchNetwork: (id: number) => Promise<void>;
  chainId: number;
  chains: Chain[];
  chain: Chain;
}

/**
 * UseConnector provides wallet connection functionalities.
 * @returns
 */
export default function useConnector() {
  const defaultNetwork =
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    Nets[import.meta.env.VITE_NETWORK!] || Nets.localhost;
  const [connected, setConnected] = useState<boolean | undefined>(undefined);
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const { disconnectAsync } = useDisconnect();
  const { chain } = useNetwork();
  const { isConnected, address: _address } = useAccount();
  const { data: signer } = useSigner();
  const {
    data: signedData,
    status: signStatus,
    signMessageAsync,
  } = useSignMessage();
  const { switchNetwork: _switchNetwork, chains } = useSwitchNetwork();
  const provider = useProvider();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setConnected(isConnected);
    setAddress(_address);
  }, [isConnected, _address]);

  useEffect(() => {
    if (!chain) return;
    setChainId(connected ? chain.id : undefined);
  }, [connected, chain]);

  useEffect(() => {
    setReady(
      provider !== undefined &&
        connected == true &&
        address !== undefined &&
        chainId !== undefined &&
        signer != undefined &&
        chain !== undefined
    );
  }, [provider, connected, address, chainId, chain, signer]);

  /**
   * Disconnect from supported wallet provider
   */
  async function disconnect() {
    try {
      await disconnectAsync();
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(
        new Error(`failed to disconnect: ${(error as Error).message}`)
      );
    }
  }

  /**
   * Sign the message
   * @param msg - The message to be signed
   */
  async function sign(msg: string): Promise<string> {
    try {
      if (!connected)
        return Promise.reject(new Error("not connected to a wallet"));
      const sig = await signMessageAsync({ message: msg });
      return Promise.resolve(sig);
    } catch (error) {
      return Promise.reject(new Error(`User rejected the signing request`));
    }
  }

  /**
   * Switch network
   * @param id - The network ID
   */
  async function switchNetwork(id: number) {
    try {
      if (!connected)
        return Promise.reject(new Error("not connected to a wallet"));
      if (!_switchNetwork)
        return Promise.reject(new Error("switch function not set"));
      await _switchNetwork(id);
      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  }

  /**
   * Get coin balance of the connected wallet
   */
  async function getBalance(): Promise<BigNumberish> {
    try {
      return Promise.resolve(await provider.getBalance(address as string));
    } catch (e) {
      return Promise.reject(e);
    }
  }

  /**
   * Initialize a contract and use it
   * @param name - The name of the contract
   * @param f - The function that will be called with the contract as only parameter
   */
  async function getContract(
    name: ContractNames,
    f: (contract: Contract) => void
  ) {
    if (!provider) throw new Error("no provider found");
    const netInfo = getNetworkByChainId(chainId as number);
    if (!netInfo || !netInfo.contracts) throw new Error("unknown contract");
    const contract = new Contract(
      netInfo.contracts[name].address,
      netInfo.contracts[name].abi,
      signer as Signer
    );
    if (f) await f(contract);
  }

  return {
    defaultNetwork,
    getBalance,
    getContract,
    ready,
    connected,
    disconnect,
    provider,
    sign,
    signedData,
    signStatus,
    address,
    chainId,
    switchNetwork,
    chains,
    chain,
  } as IConnector;
}
