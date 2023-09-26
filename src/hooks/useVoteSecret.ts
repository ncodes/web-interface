import forge from "node-forge";
const util = forge.util;

export function useVoteSecret() {
  const voteSecretKey = "voteSecrets";

  function getStoreData(): { [key: string]: [string, string] } {
    const data = localStorage.getItem(voteSecretKey);
    if (!data) return {};
    return JSON.parse(data);
  }

  function saveStoreData(data: { [key: string]: [string, string] }) {
    localStorage.setItem(voteSecretKey, JSON.stringify(data));
  }

  function genSecret(
    network: string,
    orderId: number,
    disputeId: number,
    ticketIndex: number
  ) {
    const secret = forge.random.getBytesSync(8);
    const storeData = getStoreData();
    const secretHex = util.bytesToHex(secret);
    storeData[`${network}:${orderId}:${disputeId}:${ticketIndex}`] = [
      secretHex,
      "",
    ];
    saveStoreData(storeData);
    return secretHex;
  }

  function getSecret(
    network: string,
    orderId: number,
    disputeId: number,
    ticketIndex: number
  ) {
    const storeData = getStoreData();
    return storeData[`${network}:${orderId}:${disputeId}:${ticketIndex}`];
  }

  function setSecret(
    network: string,
    orderId: number,
    disputeId: number,
    ticketIndex: number,
    secret: string,
    vote: string
  ) {
    const storeData = getStoreData();
    storeData[`${network}:${orderId}:${disputeId}:${ticketIndex}`] = [
      secret,
      vote,
    ];
    saveStoreData(storeData);
  }

  return {
    genSecret,
    getSecret,
    setSecret,
  };
}
