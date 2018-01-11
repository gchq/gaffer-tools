#!/bin/bash -e

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR

./install-accumulo-client.sh || exit 1
./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password --disable-auth-timeout "$@"
