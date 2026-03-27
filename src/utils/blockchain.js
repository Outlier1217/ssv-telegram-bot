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
  "function getScore(address) view returns (uint256)",
  "function verify(address) view returns (bool)"
];

const contract = new ethers.Contract(VAULT_ADDRESS, ABI, provider);
const nexaContract = new ethers.Contract(NEXAID_ADDRESS, NEXA_ABI, provider);

export async function getUserData(wallet) {
  try {
    console.log(`🔍 Fetching data for wallet: ${wallet}`);
    
    // 🔹 Get NexaID score
    let score = "0";
    let verified = false;
    try {
      score = await nexaContract.getScore(wallet);
      verified = await nexaContract.verify(wallet);
      console.log(`✅ NexaID: Score=${score.toString()}, Verified=${verified}`);
    } catch (e) {
      console.log("⚠️ NexaID fetch failed:", e.message);
    }

    // 🔹 Try Vault data
    let deposit = "0";
    let reward = "0";
    let userXP = "0";
    let userLevel = "1";
    
    try {
      const [balance, xp, level, rewardsData] = await Promise.all([
        contract.balances(wallet),
        contract.xp(wallet),
        contract.level(wallet),
        contract.rewards(wallet)
      ]);
      
      deposit = ethers.formatUnits(balance, 6);
      reward = ethers.formatUnits(rewardsData, 6);
      userXP = xp.toString();
      userLevel = level.toString();
      
      console.log(`✅ Vault: Deposit=${deposit}, Reward=${reward}, XP=${userXP}, Level=${userLevel}`);
      
    } catch (e) {
      console.log("⚠️ Vault fetch failed:", e.message);
    }

    // 🔹 Agar deposit 0 hai toh "—" show karo, warna actual value
    const displayDeposit = (deposit === "0") ? "—" : deposit;
    const displayReward = (reward === "0") ? "—" : reward;

    return {
      deposit: displayDeposit,
      xp: userXP,
      level: userLevel,
      reward: displayReward,
      verified: verified,
      score: score.toString()
    };

  } catch (err) {
    console.log("❌ ERROR:", err.message);
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