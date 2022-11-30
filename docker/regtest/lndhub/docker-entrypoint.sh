#!/bin/sh
set -e

# containers on linux share file permissions with hosts.
# assigning the same uid/gid from the host user
# ensures that the files can be read/write from both sides
if ! id lndhub > /dev/null 2>&1; then
  USERID=${USERID:-1000}
  GROUPID=${GROUPID:-1000}

  echo "adding user lndhub ($USERID:$GROUPID)"
  groupadd -f -g $GROUPID lndhub
  useradd -r -u $USERID -g $GROUPID lndhub
  chown -R $USERID:$GROUPID /home/lndhub
fi

if [ "$1" = "lndhub" ]; then
  echo "Running as lndhub user: $@"
  exec gosu lndhub lndhub
fi

exec lndhub
