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

# create working directory
mkdir -p slider_tmp
cd slider_tmp

# download, build and install slider
git clone http://github.com/apache/incubator-slider.git

cd incubator-slider
git checkout $SLIDER_VERSION

mvn clean site:site site:stage install -DskipTests

sudo tar xzvf slider-assembly/target/$SLIDER_VERSION-all.tar.gz -C /usr/local

sudo mv /usr/local/$SLIDER_VERSION /usr/local/slider
