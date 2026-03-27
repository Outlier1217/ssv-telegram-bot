import { ethers } from "ethers";

const RPC_URL = "https://testnet.hsk.xyz";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const VAULT_ADDRESS = "0x78c37Dcb5C3C072DAfb9D4e28638BBcdf297FeeB";
const NEXAID_ADDRESS = "0xe5A9A3B722567d8B7Ef728C1A5322Bf1Aa71553c";

const ABI = [
  "function balances(address) view returns (uint256)",
  "function xp(address) view returns (uint256)",
  "function level(address) view returns (uint256)",
  "function rewards(address) view returns (uint256)",
  "function isVerified(address) view returns (bool)"
];

const NEXA_ABI = [
  "function getScore(address) view returns (uint256)"
];

const contract = new ethers.Contract(VAULT_ADDRESS, ABI, provider);
const nexaContract = new ethers.Contract(NEXAID_ADDRESS, NEXA_ABI, provider);

export async function getUserData(wallet) {
  try {

    // 🔹 Always fetch from NexaID (new)
    const score = await nexaContract.getScore(wallet);

    // 🔹 Try Vault data (may fail logically)
    let deposit = "0";
    let reward = "0";
    let userXP = "0";
    let userLevel = "1";
    let verified = false;

    try {
      const vaultData = await Promise.all([
        contract.balances(wallet),
        contract.xp(wallet),
        contract.level(wallet),
        contract.rewards(wallet),
        contract.isVerified(wallet)
      ]);

      const rawDeposit = vaultData[0];
      const rawReward = vaultData[3];

      // ✅ Only use Vault if it actually has data
      if (rawDeposit > 0 || rawReward > 0) {
        deposit = ethers.formatUnits(rawDeposit, 6);
        reward = ethers.formatUnits(rawReward, 6);
        userXP = vaultData[1].toString();
        userLevel = vaultData[2].toString();
        verified = vaultData[4];
      }

    } catch (e) {
      console.log("Vault fallback triggered");
    }

    // 🔹 Fallback logic (important)
    if (deposit === "0") {
      // 👉 simulate UX instead of showing broken system
      deposit = "—";
      reward = "—";
    }

    return {
      deposit,
      xp: userXP,
      level: userLevel,
      reward,
      verified,
      score: score.toString()
    };

  } catch (err) {
    console.log("ERROR:", err.shortMessage || err.message);

    return {
      deposit: "—",
      xp: "0",
      level: "1",
      reward: "—",
      verified: false,
      score: "0"
    };
  }
}