#!/bin/bash

NPM_BIN=$( npm bin )

# pre-requisites
echo "(0) Checking ability to reach RSK networks"

function checkReachable {
  ERROR_COUNT=$( curl \
    ${1} \
    -X POST \
    -H "Content-Type: application/json" \
    --data '{"jsonrpc":"2.0","method":"eth_blockNumber","params":[],"id":1}' \
    2>&1 > /dev/null | grep "Failed to connect" | wc -l )
  if [ "${ERROR_COUNT}" != "0" ] ; then
    echo "${2} is unreachable."
    echo "${3}"
    echo "After rectifying this, run scripts/setup.sh again. Exiting."
    exit 1
  else
    echo "${2} is reachable."
  fi
}

checkReachable \
  "https://public-node.testnet.rsk.co/2.0.1/" \
  "RSK Testnet" \
  "Please check that your network proxy or firewall does not filter the public-node.testnet.rsk.co domain. For more details: https://developers.rsk.co/rsk/public-nodes/"

checkReachable \
  "https://public-node.rsk.co/2.0.1/" \
  "RSK Mainnet" \
  "Please check that your network proxy or firewall does not filter the public-node.rsk.co domain. For more details: https://developers.rsk.co/rsk/public-nodes/"

checkReachable \
  "http://localhost:4444/" \
  "RSK Regtest" \
  "Please ensure that you have RSKj installed and running locally, configured for Regtest. For more details: https://developers.rsk.co/quick-start/step1-install-rsk-local-node/"

# install dependencies
echo "(1) Installing dependencies for this project from npm."
npm install

# set up testnet keys
echo "(2) Setting up a BIP39 seed phrase for a HD Wallet for use in RSK Testnet"
${NPM_BIN}/mnemonics > .testnet.seed-phrase

# obtain testnet gas price
echo "(3) Checking the current network gas price on the RSK Testnet"
curl -s \
  https://public-node.testnet.rsk.co/2.0.1/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
  > .testnet.gas-price.json

# obtain mainnet gas price
echo "(4) Checking the current network gas price on the RSK Mainnet"
curl -s \
  https://public-node.testnet.rsk.co/2.0.1/ \
  -X POST \
  -H "Content-Type: application/json" \
  --data '{"jsonrpc":"2.0","method":"eth_gasPrice","params":[],"id":1}' \
  > .mainnet.gas-price.json

# tidy up
echo "NOTES:"
echo "- You are recommended to modify the config file before using Mainnet."
echo "  Its configuration there should be considered a template."
echo "- You may re-run this script any time using scripts/setup.sh"
echo "- You may clean up files generated by this script using scripts/clean.sh"
echo "  Not that this does not clean the installed npm dependencies."
