#!/bin/bash

set -e

bitcoin_cli="docker exec --user bitcoin monocle-bitcoind bitcoin-cli -regtest"
lncli="docker exec --user lnd monocle-lnd lncli --network=regtest"
lncli_author="docker exec --user lnd monocle-lnd-author lncli --network=regtest"

lnd_wallet_balance=`$lncli walletbalance | jq --raw-output '.confirmed_balance'`
lnd_author_pubkey=`$lncli_author getinfo | jq --raw-output '.identity_pubkey'`
num_peers=`$lncli listpeers | jq '.peers | length'`
num_channels=`$lncli listchannels | jq '.channels | length'`

if [ $lnd_wallet_balance -eq 0 ]; then
    echo "funding lnd..."
    lnd_address=`$lncli newaddress p2wkh | jq --raw-output '.address'`
    $bitcoin_cli generatetoaddress 101 $lnd_address
fi

if [ $num_peers -eq 0 ]; then
    echo "connecting to lnd-author..."
    $lncli connect "$lnd_author_pubkey@lnd-author:9735"
fi

if [ $num_channels -eq 0 ]; then
    echo "opening channel to lnd-author..."
    $lncli openchannel $lnd_author_pubkey 1000000000 100000000
    $bitcoin_cli generatetoaddress 10 bcrt1q3d8u9633j25e80lvjmljljdwcv8w3vkcnmtnh8 # burner address
fi
