import { getChains } from "@jointlabs/chains-info";
import moment from "moment";
import { arbitrum, hardhat } from "viem/chains";
import { isProd } from "../../libs/helpers";

/**
 * Create message to signed by a wallet
 * @param address - The address of the signer
 * @param email - The email to associate with the signer
 * @param expireTimeStr - The time after which signature is considered expired
 */
export function createSignatureMessage(
  address: string,
  email?: string,
  expireTimeStr = "5 minutes",
) {
  const emailStr = !email ? "" : `Email: ${email}`;
  const msg = `Welcome to ${import.meta.env.VITE_APP_NAME}!
  
Click Sign button to sign and accept the ${import.meta.env.VITE_APP_NAME} Terms of Service: ${
    import.meta.env.VITE_APP_URL
  }/term.
  
This request will not trigger a blockchain transaction or cost any gas fees.
  
Your session will expire after ${expireTimeStr}.
--
Address: "${address}"
${emailStr}
Timestamp: ${moment().toISOString()}`;

  return Buffer.from(msg, "utf-8");
}

export function getSupportedChains() {
  let chains = getChains();
  if (isProd()) {
    chains = chains.filter((chain) => chain.id !== hardhat.id);
  }
  return chains;
}
