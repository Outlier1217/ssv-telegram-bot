import { ethers } from "ethers";

const RPC_URL = "https://testnet.hsk.xyz";
const provider = new ethers.JsonRpcProvider(RPC_URL);

const VAULT_ADDRESS = "0x78c37Dcb5C3C072DAfb9D4e28638BBcdf297FeeB";
const NEXAID_ADDRESS = "0x3a21b6C601B599AB9460e689f4cBb051e5737d0e";

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
    const [deposit, userXP, userLevel, reward, verified, score] = await Promise.all([
      contract.balances(wallet),
      contract.xp(wallet),
      contract.level(wallet),
      contract.rewards(wallet),
      contract.isVerified(wallet),
      nexaContract.getScore(wallet)
    ]);

    return {
      deposit: ethers.formatUnits(deposit, 6),
      xp: userXP.toString(),
      level: userLevel.toString(),
      reward: ethers.formatUnits(reward, 6),
      verified,
      score: score.toString()
    };

  } catch (err) {
    console.log("ERROR:", err.shortMessage || err.message);

    return {
      deposit: "0",
      xp: "0",
      level: "0",
      reward: "0",
      verified: false,
      score: "0"
    };
  }
}