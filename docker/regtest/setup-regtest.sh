#!/bin/bash

set -e

bitcoin_cli="docker exec --user bitcoin monocle-bitcoind bitcoin-cli -regtest"
lncli="docker exec --user lnd monocle-lnd lncli --network=regtest"
lncli_author="docker exec --user lnd monocle-lnd-author lncli --network=regtest"
lncli_external="docker exec --user lnd monocle-lnd-external lncli --network=regtest"

lnd_wallet_balance=`$lncli walletbalance | jq --raw-output '.confirmed_balance'`
lnd_num_peers=`$lncli listpeers | jq '.peers | length'`
lnd_num_channels=`$lncli listchannels | jq '.channels | length'`
lnd_pubkey=`$lncli getinfo | jq --raw-output '.identity_pubkey'`

lnd_external_wallet_balance=`$lncli_external walletbalance | jq --raw-output '.confirmed_balance'`
lnd_external_num_peers=`$lncli_external listpeers | jq '.peers | length'`
lnd_external_num_channels=`$lncli_external listchannels | jq '.channels | length'`

lnd_author_pubkey=`$lncli_author getinfo | jq --raw-output '.identity_pubkey'`

if [ $lnd_wallet_balance -eq 0 ]; then
    echo "funding lnd..."
    lnd_address=`$lncli newaddress p2wkh | jq --raw-output '.address'`
    $bitcoin_cli generatetoaddress 101 $lnd_address
fi
if [ $lnd_num_peers -eq 0 ]; then
    echo "connecting lnd <-> lnd-author..."
    $lncli connect "$lnd_author_pubkey@lnd-author:9735"
fi
if [ $lnd_num_channels -eq 0 ]; then
    echo "opening channel lnd <-> lnd-author..."
    $lncli openchannel $lnd_author_pubkey 1000000000
    $bitcoin_cli generatetoaddress 10 bcrt1q3d8u9633j25e80lvjmljljdwcv8w3vkcnmtnh8 # mine to burner address to confirm channel
fi

if [ $lnd_external_wallet_balance -eq 0 ]; then
    echo "funding lnd-external..."
    lnd_address=`$lncli_external newaddress p2wkh | jq --raw-output '.address'`
    $bitcoin_cli generatetoaddress 101 $lnd_address
fi
if [ $lnd_external_num_peers -eq 0 ]; then
    echo "connecting lnd-external <-> lnd..."
    $lncli_external connect "$lnd_pubkey@lnd:9735"
fi
if [ $lnd_external_num_channels -eq 0 ]; then
    echo "opening channel lnd-external <-> lnd..."
    $lncli_external openchannel $lnd_pubkey 1000000000
    $bitcoin_cli generatetoaddress 10 bcrt1q3d8u9633j25e80lvjmljljdwcv8w3vkcnmtnh8 # mine to burner address to confirm channel
fi
