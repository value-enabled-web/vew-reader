#!/bin/sh
set -e

# containers on linux share file permissions with hosts.
# assigning the same uid/gid from the host user
# ensures that the files can be read/write from both sides
if ! id vewaccounts > /dev/null 2>&1; then
  USERID=${USERID:-1001}
  GROUPID=${GROUPID:-1001}

  echo "adding user vewaccounts ($USERID:$GROUPID)"
  groupadd -f -g $GROUPID vewaccounts
  useradd -r -u $USERID -g $GROUPID vewaccounts
  chown -R $USERID:$GROUPID /home/vewaccounts
fi

echo "Running as vewaccounts user: $@"
cd vew-accounts
exec gosu vewaccounts npm start
