#!/bin/bash

set -e

lncli_author="docker exec --user lnd monocle-lnd-author lncli --network=regtest"

balance=`$lncli_author listchannels | jq -r '.channels | first .local_balance'`

echo $balance sats
