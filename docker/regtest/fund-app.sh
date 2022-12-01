#!/bin/bash

set -e

lncli_external="docker exec --user lnd monocle-lnd-external lncli --network=regtest"

$lncli_external sendpayment --force --pay_req=$1
