import TokenInfo from "../hooks/connectors/token_info.ts";


interface ContractInfo {
    address: string;
    abi: string;
}

type Contracts = {
    [key in ContractNames]: ContractInfo;
};

interface NetworkInfo {
    name: string;
    chainId: string;
    symbol: string;
    rpcUrl: string;
    blockExplorer: string;
    logoPath: string;
    eip1559?: boolean;
    tokenInfo: TokenInfo;
    contracts: Contracts;
}

export interface Networks {
    [key: string]: NetworkInfo;
}

declare global {
    type ContractNames = 'energon' | 'nft';

    interface User {
    }

    interface TransactionResponse {
    }
}


