#!/bin/bash -e

USERNAME=""
PASSWORD=""
VISIBILITIES=""

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-p|--password)
			PASSWORD=$2
			shift
			;;
		-v|--visibilities)
			VISIBILITIES=$2
			shift
			;;
		*)
			USERNAME=$1
			;;
	esac
	shift
done

if [ "$USERNAME" == "" ]; then
	echo "Usage: $0 <username> [-v <visibilities>]"
	exit 1
fi

if [ "$PASSWORD" == "" ]; then
	while true; do
		read -s -p "Password: " PASSWORD
		echo
		read -s -p "Confirm Password: " PASSWORD2
		echo
		[ "$PASSWORD" = "$PASSWORD2" ] && break
		echo "Passwords do not match, please try again..."
	done
fi

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd $DIR
./install-accumulo-client.sh || exit 1

./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "createuser $USERNAME" <<ARGS
$PASSWORD
$PASSWORD
ARGS

./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "grant -u $USERNAME -s System.CREATE_TABLE"

if [[ "$VISIBILITIES" != "" ]]; then
	./accumulo/*/bin/accumulo shell -u root -p file:./etc/root.password -e "setauths -u $USERNAME -s $VISIBILITIES"
fi
