#!/bin/bash -e

if [ "$1" == "" ]; then
	echo "Usage: $0 <username>"
	exit 2
fi

USERNAME="$1"

while true; do
	read -s -p "Password: " PASSWORD
	echo
	read -s -p "Confirm Password: " PASSWORD2
	echo
	[ "$PASSWORD" = "$PASSWORD2" ] && break
	echo "Passwords do not match, please try again..."
done

GAFFER_INSTALL_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
$GAFFER_INSTALL_DIR/install-accumulo-client.sh || exit 1

DST=accumulo

$DST/*/bin/accumulo shell -u root -p file:root.password -e "createuser $USERNAME" <<ARGS
$PASSWORD
$PASSWORD
ARGS

$DST/*/bin/accumulo shell -u root -p file:root.password -e "grant -u $USERNAME -s System.CREATE_TABLE"

