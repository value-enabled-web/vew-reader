#!/bin/sh
set -e

# containers on linux share file permissions with hosts.
# assigning the same uid/gid from the host user
# ensures that the files can be read/write from both sides
if ! id ligess > /dev/null 2>&1; then
  USERID=${USERID:-1001}
  GROUPID=${GROUPID:-1001}

  echo "adding user ligess ($USERID:$GROUPID)"
  groupadd -f -g $GROUPID ligess
  useradd -r -u $USERID -g $GROUPID ligess
  chown -R $USERID:$GROUPID /home/ligess
fi

export LIGESS_LND_MACAROON=$(cat /home/lnd/.lnd/data/chain/bitcoin/regtest/invoice.macaroon | xxd -p -c2000)

echo "Running as ligess user: $@"
cd ligess
exec gosu ligess yarn start
