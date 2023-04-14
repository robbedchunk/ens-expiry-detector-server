const ENS = require('ethereum-ens');
const Web3 = require('web3');
const namehash = require('eth-ens-namehash');
const { BaseRegistrarImplementation } = require('@ensdomains/ens-contracts');
const { ethers } = require('ethers');
const { keccak256 } = require('ethers/lib/utils');

// Set up your Ethereum provider (e.g., Infura or your own Ethereum node)
const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/61171ca8c7e74d74a86e2ee706c7558b');
const ethersProvider = new ethers.providers.Web3Provider(provider);

// Initialize ENS and Web3
const ens = new ENS(provider);
const web3 = new Web3(provider);

// The grace period is typically 90 days; this threshold represents domains close to the end of the grace period
const gracePeriodThreshold = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ENS base registrar contract address
const ensBaseRegistrarAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';

// Utility function to generate all 3-character combinations
function generateDomains() {
  const chars = '0123456789abcdefghijklmnopqrstuvwxyz';
  const domains = [];

  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      for (let k = 0; k < chars.length; k++) {
        domains.push(chars[i] + chars[j] + chars[k]);
      }
    }
  }

  return domains.slice(0,11);
}

async function checkAllDomains() {
  const domains = generateDomains();
  const promises = domains.map((domain) =>  checkDomain(domain)  );
  const results = await Promise.all(promises);
  return results.filter((result) => result !== null);
}


async function checkDomain(domain) {
  try {
    const fullName = `${domain}.eth`;

    const ensBaseRegistrar = new ethers.Contract(ensBaseRegistrarAddress, BaseRegistrarImplementation, ethersProvider);

    const labelhash = keccak256(ethers.utils.toUtf8Bytes(domain));
    const tokenId = ethers.BigNumber.from(labelhash);

    let owner;
    let available = false;

    try {
      owner = await ensBaseRegistrar.ownerOf(tokenId);
    } catch (err) {
      available = true;
      owner = '0x0000000000000000000000000000000000000000';
    }

    // No owner means the domain is not registered
    if (available) {
      return {
        ens: fullName,
        available,
        isInGracePeriod: false,
        owner,
        expirationDate: null,
        theoreticalGracePeriodEnd: null
      };
    }

    const expiry = await ensBaseRegistrar.nameExpires(tokenId);
    const expirationDate = new Date(expiry.mul(1000).toNumber())
    const now = new Date();
    const theoreticalGracePeriodEnd = new Date(expiry.mul(1000).toNumber() + 90 * 24 * 60 * 60 * 1000); // Add 90 days to registrationDate


    return {
      ens: fullName,
      available,
      isInGracePeriod: expirationDate < now,
      owner,
      expirationDate,
      theoreticalGracePeriodEnd,
    };
  } catch (err) {
    console.error(`Error checking ${domain}.eth`, err);
    return null;
  }
}
 module.exports = {
  checkAllDomains,
  checkDomain,
};