#!/bin/bash

#
# Setup slider
#

while [[ $# -gt 1 ]]
do
  key="$1"

  case $key in
    -s|--slider-version)
        SLIDER_VERSION="$2"
        shift
        ;;
    *)
        # unknown option
     ;;
esac
shift
done

if [[ "$SLIDER_VERSION" = "" ]]; then
    echo "Slider version is not set - exiting."
    exit
fi

echo "Installing Slider verion $SLIDER_VERSION"

# remove existing slider installation
sudo rm -rf /usr/local/slider

# create working directory

if [ -d ~/slider_tmp ]; then
  rm -rf ~/slider_tmp
fi

mkdir -p slider_tmp
cd slider_tmp

# download, build and install slider
git clone http://github.com/apache/incubator-slider.git

cd incubator-slider
git checkout branches/branch-0.91

mvn clean site:site site:stage install -DskipTests

sudo tar xzvf slider-assembly/target/$SLIDER_VERSION-all.tar.gz -C /usr/local

# setup configuration files
mv /tmp/slider-env.sh /usr/local/slider/conf/slider-env.sh
mv /tmp/slider-client.xml /usr/local/slider/conf/slider-client.xml

# test slider
/usr/local/slider/bin/slider version

cd

if [ -d gaffer_tmp ]; then
  rm -rf gaffer_tmp
fi

mkdir -p gaffer_tmp

cd gaffer_tmp

git clone http://github.com/gchq/gaffer-tools
cd gaffer-tools
git checkout gh-41-slider
mvn clean package -Dgaffer.version=0.6.0 -Daccumulo-version=1.7.0 -Dslider-version="$SLIDER_VERSION" -DskipTests





exit
