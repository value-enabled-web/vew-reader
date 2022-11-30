#!/bin/bash

set -e

lncli_author="docker exec --user lnd monocle-lnd-author lncli --network=regtest"

$lncli_author sendpayment --force --pay_req=$1
