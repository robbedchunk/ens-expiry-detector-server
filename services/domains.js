const Web3 = require('web3');
const { ethers } = require('ethers');
const { keccak256 } = require('ethers/lib/utils');
const { BaseRegistrarImplementation } = require('@ensdomains/ens-contracts');

const ensBaseRegistrarAddress = '0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85';

const provider = new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/61171ca8c7e74d74a86e2ee706c7558b');
const ethersProvider = new ethers.providers.Web3Provider(provider);

const checkDomain = async (domain) => {
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

// const checkDomain = () => {
//   return "Domain is available."
// }

module.exports = {
  checkDomain,
};