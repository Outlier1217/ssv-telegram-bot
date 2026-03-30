import { ethers } from "ethers";

const RPC_URL = "https://testnet.hsk.xyz";
const provider = new ethers.JsonRpcProvider(RPC_URL);

// ✅ Tere naye contract addresses (dAPP ke according)
const VAULT_ADDRESS = "0x48CBAD88B6df3D0510a45A5A10c0577CA6C037D4";
const NEXAID_ADDRESS = "0x83660B2dc4C917558CAc56b24EeF98A1524D0bAE";
const USDC_ADDRESS = "0xfD36e42d57DdEF313457FFf750fEd831958E5cd2";

const VAULT_ABI = [
  "function balances(address) view returns (uint256)",
  "function xp(address) view returns (uint256)",
  "function level(address) view returns (uint256)",
  "function rewards(address) view returns (uint256)",
  "function bountiesEarned(address) view returns (uint256)",
  "function getReputationBonus(address) view returns (uint256)"
];

const NEXA_ABI = [
  "function getScore(address) view returns (uint256)",
  "function verify(address) view returns (bool)"
];

const USDC_ABI = [
  "function balanceOf(address) view returns (uint256)",
  "function decimals() view returns (uint8)"
];

const vaultContract = new ethers.Contract(VAULT_ADDRESS, VAULT_ABI, provider);
const nexaContract = new ethers.Contract(NEXAID_ADDRESS, NEXA_ABI, provider);
const usdcContract = new ethers.Contract(USDC_ADDRESS, USDC_ABI, provider);

export async function getUserData(wallet) {
  try {
    console.log(`🔍 Fetching data for: ${wallet}`);
    
    // 1. NexaID Data
    let score = "0";
    let verified = false;
    try {
      const [scoreRaw, verifiedStatus] = await Promise.all([
        nexaContract.getScore(wallet),
        nexaContract.verify(wallet)
      ]);
      score = scoreRaw.toString();
      verified = verifiedStatus;
      console.log(`✅ NexaID: Score=${score}, Verified=${verified}`);
    } catch (e) {
      console.log("⚠️ NexaID error:", e.message);
    }

    // 2. Vault Data
    let deposit = "0";
    let reward = "0";
    let xp = "0";
    let level = "1";
    let bounties = "0";
    let repBonus = "0";

    try {
      const [balance, xpRaw, levelRaw, rewardsRaw, bountiesRaw, bonusRaw] = await Promise.all([
        vaultContract.balances(wallet),
        vaultContract.xp(wallet),
        vaultContract.level(wallet),
        vaultContract.rewards(wallet),
        vaultContract.bountiesEarned(wallet),
        vaultContract.getReputationBonus(wallet)
      ]);
      
      deposit = ethers.formatUnits(balance, 6);
      reward = ethers.formatUnits(rewardsRaw, 6);
      xp = xpRaw.toString();
      level = levelRaw.toString();
      bounties = ethers.formatUnits(bountiesRaw, 6);
      repBonus = bonusRaw.toString();
      
      console.log(`✅ Vault: Deposit=${deposit}, Reward=${reward}, XP=${xp}, Level=${level}, Bounties=${bounties}`);
    } catch (e) {
      console.log("⚠️ Vault error:", e.message);
    }

    // 3. USDC Balance
    let usdcBalance = "0";
    try {
      const decimals = await usdcContract.decimals();
      const balance = await usdcContract.balanceOf(wallet);
      usdcBalance = ethers.formatUnits(balance, decimals);
    } catch (e) {
      console.log("⚠️ USDC error:", e.message);
    }

    return {
      deposit: deposit === "0" ? "—" : deposit,
      reward: reward === "0" ? "—" : reward,
      xp: xp,
      level: level,
      verified: verified,
      score: score,
      bounties: bounties === "0" ? "—" : bounties,
      repBonus: repBonus,
      usdcBalance: usdcBalance
    };

  } catch (err) {
    console.log("❌ ERROR:", err.message);
    return {
      deposit: "—",
      reward: "—",
      xp: "0",
      level: "1",
      verified: false,
      score: "0",
      bounties: "—",
      repBonus: "0",
      usdcBalance: "0"
    };
  }
}