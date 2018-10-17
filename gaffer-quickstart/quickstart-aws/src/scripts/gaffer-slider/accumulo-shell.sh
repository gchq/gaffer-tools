#!/bin/bash -e

GAFFER_INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$GAFFER_INSTALL_DIR/install-accumulo-client.sh || exit 1

DST=accumulo
$DST/*/bin/accumulo shell -u root -p file:root.password

