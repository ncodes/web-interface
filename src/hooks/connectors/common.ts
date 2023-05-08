// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import moment from 'moment';

/**
 * Create message to signed by a wallet
 * @param address - The address of the signer
 * @param msgPublicKey - The messenger public key of the signer
 * @param email - The email to associate with the signer
 * @param expireTimeStr - The time after which signature is considered expired
 */
export function createSignatureMessage(
  address: string,
  msgPublicKey?: string,
  email?: string,
  expireTimeStr = '5 minutes'
) {
  const emailStr = !email ? '' : `Email: ${email}`;
  const msgPublicKeyStr = !msgPublicKey
    ? ''
    : `Messenger Public Key: "${msgPublicKey}"`;

  const msg = `Welcome to ${process.env.VITE_APP_NAME}!
  
Click Sign button to sign and accept the ${
    process.env.VITE_APP_NAME
  } Terms of Service: ${process.env.VITE_APP_URL}/term.
  
This request will not trigger a blockchain transaction or cost any gas fees.
  
Your session will expire after ${expireTimeStr}.
--
Address: "${address}"
${emailStr}
${msgPublicKeyStr}
Timestamp: ${moment().toISOString()}`;

  return Buffer.from(msg, 'utf-8');
}
