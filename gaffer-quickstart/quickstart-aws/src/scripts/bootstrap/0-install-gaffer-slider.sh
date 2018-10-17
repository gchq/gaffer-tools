#!/bin/bash -e

SLIDER_VERSION=0.92.0-incubating
ACCUMULO_VERSION=1.8.1
GAFFER_VERSION=1.7.0
GAFFER_TOOLS_BRANCH=gaffer-tools-$GAFFER_VERSION
S3_BUCKET=""

HERE=$(pwd)

while [[ $# -gt 0 ]]; do
	key="$1"

	case $key in
		-s|--slider)
			SLIDER_VERSION=$2
			shift
			;;
		-a|--accumulo)
			ACCUMULO_VERSION=$2
			shift
			;;
		-g|--gaffer)
			GAFFER_VERSION=$2
			shift
			;;
		*)
			S3_BUCKET=$1
			;;
	esac
	shift
done

if [ "$S3_BUCKET" == "" ]; then
	echo "Usage: $0 <s3Bucket> [-a <accumuloVersion>] [-g <gafferVersion>] [-s <sliderVersion>]"
	exit 1
fi

sudo curl -L -O https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/${GAFFER_VERSION}/slider-${GAFFER_VERSION}.jar
GAFFER_SLIDER_JAR=$HERE/slider-${GAFFER_VERSION}.jar

ACCUMULO_PKG=$S3_BUCKET/slider-accumulo-app-package-$ACCUMULO_VERSION.zip
GAFFER_TOOLS_REPO=https://raw.githubusercontent.com/gchq/gaffer-tools/$GAFFER_TOOLS_BRANCH

SLIDER_INSTALL_DIR=/opt/slider
ACCUMULO_INSTALL_DIR=/opt/accumulo/$ACCUMULO_VERSION
GAFFER_INSTALL_DIR=/opt/gaffer/$GAFFER_VERSION

# Only install on the master
if grep isMaster /mnt/var/lib/info/instance.json | grep false; then
	echo "isMaster = false, so skipping install of Gaffer"
	exit
fi

# Ensure xmlstarlet is installed
if ! which xmlstarlet >/dev/null 2>&1; then
	sudo yum install -y xmlstarlet
fi

# Install Slider
sudo mkdir -p $SLIDER_INSTALL_DIR
cd $SLIDER_INSTALL_DIR
sudo curl -L -O https://repo1.maven.org/maven2/org/apache/slider/slider-assembly/$SLIDER_VERSION/slider-assembly-$SLIDER_VERSION-all.tar.gz
sudo tar -xf slider-assembly-$SLIDER_VERSION-all.tar.gz

sudo tee /etc/profile.d/slider.sh <<EOF
#!/bin/bash
export PATH=$SLIDER_INSTALL_DIR/slider-$SLIDER_VERSION/bin:\$PATH
EOF

sudo tee /etc/profile.d/hadoop.sh <<EOF
#!/bin/bash
export HADOOP_CONF_DIR=/etc/hadoop/conf
EOF

# Configure Slider with location of ZooKeeper
sudo xmlstarlet ed --inplace \
	-s "/configuration" -t elem -n zkProperty -v "" \
	-s "/configuration/zkProperty" -t elem -n name -v "hadoop.registry.zk.quorum" \
	-s "/configuration/zkProperty" -t elem -n value -v "$HOSTNAME" \
	-r "/configuration/zkProperty" -v property \
	$SLIDER_INSTALL_DIR/slider-$SLIDER_VERSION/conf/slider-client.xml

# Install Accumulo
sudo mkdir -p $ACCUMULO_INSTALL_DIR
cd $ACCUMULO_INSTALL_DIR
sudo aws s3 cp $ACCUMULO_PKG .

# Install Gaffer
sudo mkdir -p $GAFFER_INSTALL_DIR
cd $GAFFER_INSTALL_DIR
sudo curl -L -o gaffer-slider-$GAFFER_VERSION.zip https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/slider/$GAFFER_VERSION/slider-$GAFFER_VERSION.zip
sudo cp $GAFFER_SLIDER_JAR .

sudo curl -O $GAFFER_TOOLS_REPO/slider/src/test/clusters/emr/accumulo/appConfig-default.json
sudo curl -O $GAFFER_TOOLS_REPO/slider/src/test/clusters/emr/accumulo/resources.json

sudo sed -i.bak "s|\${accumulo.version}|$ACCUMULO_VERSION|" appConfig-default.json

sudo aws s3 cp $S3_BUCKET/deploy-gaffer-instance.sh .
sudo aws s3 cp $S3_BUCKET/accumulo-shell.sh .
sudo aws s3 cp $S3_BUCKET/create-accumulo-user.sh .
sudo aws s3 cp $S3_BUCKET/install-accumulo-client.sh .
sudo chmod 755 *.sh
sudo chmod 777 appConfig-default.json

sudo tee /etc/profile.d/gaffer.sh <<EOF
#!/bin/bash
export PATH=$GAFFER_INSTALL_DIR:\$PATH
EOF
