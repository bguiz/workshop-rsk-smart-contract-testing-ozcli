const fs = require('fs');

const HDWalletProvider = require('@truffle/hdwallet-provider');

// adjust these as fit to get faster transaction speeds
// minimum value is 1.0, adjust higher to incentivise miners
const TESTNET_GAS_MULT = 1.1;
const MAINNET_GAS_MULT = 1.0;

const testnetSeedPhrase = fs
  .readFileSync('.testnet.seed-phrase')
  .toString()
  .trim();
if (!testnetSeedPhrase || testnetSeedPhrase.split(' ').length !== 12) {
  throw new Error('unable to retrieve testnet seed phrase from .testnet.seed-phrase');
}

// NOTE Depending on your security requirements this is (most) likely insufficient.
// Please consider replacing/ overriding this to suit your needs on Mainnet.
const mainnetSeedPhrase = process.env.RSK_MAINNET_SEED_PHRASE || '';

const gasPriceTestnetRaw = fs
  .readFileSync('.testnet.gas-price.json')
  .toString()
  .trim();
const gasPriceTestnet = parseInt(JSON.parse(gasPriceTestnetRaw).result, 16);
if (typeof gasPriceTestnet !== 'number' || isNaN(gasPriceTestnet)) {
  throw new Error('unable to retrieve testnet gas price from .testnet.gas-price.json');
}

const gasPriceMainnetRaw = fs
  .readFileSync('.mainnet.gas-price.json')
  .toString()
  .trim();
const gasPriceMainnet = parseInt(JSON.parse(gasPriceMainnetRaw).result, 16);
if (typeof gasPriceMainnet !== 'number' || isNaN(gasPriceMainnet)) {
  throw new Error('unable to retrieve mainnet gas price from .mainnet.gas-price.json');
}

module.exports = {
  networks: {
    development: {
      protocol: 'http',
      host: 'localhost',
      port: 8545,
      gas: 5000000,
      gasPrice: 5e9,
      networkId: '*',
    },
    regtest: {
      protocol: 'http',
      host: '127.0.0.1',
      port: 4444,
      networkId: 33,
      networkCheckTimeout: 1e3,
    },
    testnet: {
      provider: () => new HDWalletProvider(
        testnetSeedPhrase,
        'https://public-node.testnet.rsk.co/2.0.1/',
        0,
        10,
        false,
        // Ref: https://developers.rsk.co/rsk/architecture/account-based/#derivation-path-info
        `m/44'/37310'/0'/0/`,
      ),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      networkId: 31,
      gasPrice: Math.floor(gasPriceMainnet * TESTNET_GAS_MULT),
      networkCheckTimeout: 1e6,
    },
    localtestnet: {
      provider: () => new HDWalletProvider(
        testnetSeedPhrase,
        'http://localhost:7777/2.0.1/',
        0,
        10,
        false,
        // Ref: https://developers.rsk.co/rsk/architecture/account-based/#derivation-path-info
        `m/44'/37310'/0'/0/`,
      ),
      network_id: 31,
      gasPrice: Math.floor(gasPriceTestnet * TESTNET_GAS_MULT),
      networkCheckTimeout: 10e3,
    },
    mainnet: {
      // NOTE that this configuration is a template.
      // You should modify it according to your needs and security requirements.
      provider: () => new HDWalletProvider(
        mainnetSeedPhrase,
        'https://public-node.rsk.co/2.0.1/',
        0,
        10,
        false,
        // Ref: https://developers.rsk.co/rsk/architecture/account-based/#derivation-path-info
        `m/44'/137'/0'/0/`,
      ),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      network_id: 30,
      gasPrice: Math.floor(gasPriceMainnet * MAINNET_GAS_MULT),
      networkCheckTimeout: 1e6,
    },
    localmainnet: {
      // NOTE that this configuration is a template.
      // You should modify it according to your needs and security requirements.
      provider: () => new HDWalletProvider(
        mainnetSeedPhrase,
        'http://localhost:8888/2.0.1/',
        0,
        10,
        false,
        // Ref: https://developers.rsk.co/rsk/architecture/account-based/#derivation-path-info
        `m/44'/137'/0'/0/`,
      ),
      // Ref: http://developers.rsk.co/rsk/architecture/account-based/#chainid
      network_id: 30,
      gasPrice: Math.floor(gasPriceMainnet * MAINNET_GAS_MULT),
      networkCheckTimeout: 1e6,
    },
  },
};
