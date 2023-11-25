import { isEqlStr } from "../../libs/helpers";

/**
 * TokenInfo describes an ERC20-like token EVM chain
 */
export default class NetTokenInfo {
  address?: string;
  name?: string;
  symbol?: string;
  decimals?: number;
  logoURI?: string;
  abi?: any;

  constructor(props: Partial<NetTokenInfo>) {
    return Object.assign(this, props);
  }

  /**
   * Checks whether the object is equal to o
   * @param o - The other object
   */
  isEqual(o: NetTokenInfo) {
    return isEqlStr(this.address, o.address);
  }
}
