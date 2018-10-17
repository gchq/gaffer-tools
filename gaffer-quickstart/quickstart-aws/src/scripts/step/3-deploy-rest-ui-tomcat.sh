#!/bin/bash -e

TOMCAT_PATH_S3=""
REST_WAR_PATH_S3=""
REST_PORT="8085"
GAFFER_VERSION="1.5.2"

usage="usage: -tp|--tomcat-path, (optional -rw|--rest-war-path : uses gaffer accumulo rest as default), (optional -rp|--rest-port : default is 8085), (optional -gv|--gaffer-version : default is $GAFFER_VERSION)"

if [[ $# -lt 2 ]]; then
    echo $usage
    echo "not enough args, exiting..."
    exit 1
fi

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -tp|--tomcat-path)
    TOMCAT_PATH_S3="$2"
    shift # past argument
    ;;
    -rw|--rest-war-path)
    REST_WAR_PATH_S3="$2"
    shift # past argument
    ;;
    -rp|--rest-port)
    REST_PORT="$2"
    shift # past argument
    ;;
    -gv|--gaffer-version)
    GAFFER_VERSION="$2"
    shift # past argument
    ;;
    *)
            echo $usage
            echo "unknown args, exiting..."
            exit 1
    ;;
esac
shift # past argument or value
done

homeDir=$HOME
echo "working in "$homeDir

cd $homeDir

#install tomcat
aws s3 cp $TOMCAT_PATH_S3 ./
tomcatTarball=${TOMCAT_PATH_S3##*/}
tomcatDir=${tomcatTarball%%.tar.gz}
tar -xvf $tomcatTarball

CATALINA_HOME=$homeDir/$tomcatDir/
echo $CATALINA_HOME

echo -e "\nexport CATALINA_HOME=${CATALINA_HOME}/" >> $homeDir/.bashrc

source $homeDir/.bashrc

#configure tomcat for the gaffer-rest service

schemaFile=$homeDir/road-traffic-schemas/schema/schema.json
restStorePropertiesFile=$homeDir/road-traffic-schemas/storeproperties/rest.store.properties
echo "gaffer.schemas=${schemaFile}" >> $CATALINA_HOME/conf/catalina.properties
echo "gaffer.storeProperties=${restStorePropertiesFile}" >> $CATALINA_HOME/conf/catalina.properties
echo "gaffer.graph.id=roadtraffic" >> $CATALINA_HOME/conf/catalina.properties

#ship the war file
sudo curl -L -O https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/ui/${GAFFER_VERSION}/ui-${GAFFER_VERSION}.war
mv ui-${GAFFER_VERSION}.war $CATALINA_HOME/webapps/ui.war

if [ -n "{$TOMCAT_PATH_S3}" ]
then
        sudo curl -L -O https://repo1.maven.org/maven2/uk/gov/gchq/gaffer/accumulo-rest/${GAFFER_VERSION}/accumulo-rest-${GAFFER_VERSION}.war
        mv accumulo-rest-${GAFFER_VERSION}.war $CATALINA_HOME/webapps/rest.war
else
        aws s3 cp $REST_WAR_PATH_S3 $CATALINA_HOME/webapps/rest.war
fi
#change the port to 8085

echo "%s/8080/${REST_PORT}/g
w
q
" | ex $CATALINA_HOME/conf/server.xml

#start the webserver

cd $CATALINA_HOME/bin

./startup.sh

cd $homeDir
