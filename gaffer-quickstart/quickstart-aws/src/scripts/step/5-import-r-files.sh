#!/bin/bash -e

DATA_PATH_S3=""

version="1.0"

usage="usage: -dp|--data-path"

if [[ $# -lt 2 ]]; then
    echo $usage
    echo "not enough args, exiting..."
    exit 1
fi

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -dp|--data-path)
    DATA_PATH_S3="$2"
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

isTableSplit=false

cd $HOME
jar=$HOME/road-traffic-${version}-jar-with-dependencies.jar

function submitJob {

    hdfsRfilesDir=$1/rfiles
    datatype=${hdfsRfilesDir##*/}
    hdfsFailureDir=/user/hadoop/failure/$datatype
    splitsFile=$1/splits

    if [ $isTableSplit == "false" ]
    then
        echo "hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.SplitStoreJob $schemaFile $storePropertiesFile $graphConfigFile $splitsFile"
        hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.SplitStoreJob $schemaFile $storePropertiesFile $graphConfigFile $splitsFile
	isTableSplit=true
    fi

    
    echo "hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.ImportFromRFilesJob $hdfsRfilesDir $schemaFile $storePropertiesFile $graphConfigFile $hdfsFailureDir"
    hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.ImportFromRFilesJob $hdfsRfilesDir $schemaFile $storePropertiesFile $graphConfigFile $hdfsFailureDir

}

schemaFile=$HOME/road-traffic-schemas/schema/schema.json
storePropertiesFile=$HOME/road-traffic-schemas/storeproperties/accumulo.store.properties
graphConfigFile=$HOME/road-traffic-schemas/graphconfig/graphconfig.json
hadoopRfilesLocation=/user/hadoop/rfiles/
hadoop distcp $DATA_PATH_S3 $hadoopRfilesLocation


for filename in `hadoop fs -ls $hadoopRfilesLocation | awk '{print $NF}' | grep '/.' | tr '\n' ' '`
do
        submitJob $filename;
done

exit 0
