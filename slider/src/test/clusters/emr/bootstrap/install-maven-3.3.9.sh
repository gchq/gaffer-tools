#!/bin/bash

set -e

DST=/opt/
VERSION=3.3.9

# Only install on the master
if grep isMaster /mnt/var/lib/info/instance.json | grep false; then
	echo "isMaster = false, so skipping"
	exit
fi

curl -o maven.tar.gz http://www.mirrorservice.org/sites/ftp.apache.org/maven/maven-3/$VERSION/binaries/apache-maven-$VERSION-bin.tar.gz
tar -xf maven.tar.gz
rm maven.tar.gz

sudo rm -rf $DST/apache-maven-$VERSION
sudo mv apache-maven-$VERSION $DST/
sudo chown -R root:root $DST/apache-maven-$VERSION

sudo tee /etc/profile.d/maven.sh <<EOF
#!/bin/bash
export PATH=$DST/apache-maven-$VERSION/bin:\$PATH
EOF

