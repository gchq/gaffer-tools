
#!/bin/bash -e

DATA_PATH_S3=
R_FILE_OUTPUT_LOCATION_S3=
SAMPLE_FRACTION=0.01
NUM_REDUCERS=0

VERSION="1.0"

usage="usage: -dp, -output, -version (optional, default is $VERSION), -sf (optional, default is $SAMPLE_FRACTION), -nr (optional, default is $NUM_REDUCERS)"

if [[ $# -lt 4 ]]; then
    echo $usage
    echo "not enough args, exiting..."
    exit 1
fi

while [[ $# -gt 1 ]]
do
key="$1"

case $key in
    -dp)
    DATA_PATH_S3="$2"
    shift # past argument
    ;;
    -output)
    R_FILE_OUTPUT_LOCATION_S3="$2"
    shift # past argument
    ;;
    -version)
    VERSION="$2"
    shift # past argument
    ;;
    -sf)
    SAMPLE_FRACTION="$2"
    shift # past argument
    ;;
    -nr)
    NUM_REDUCERS="$2"
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

jar=$HOME/road-traffic-${VERSION}-jar-with-dependencies.jar
schemaFile=$HOME/road-traffic-schemas/schema/schema.json
storePropertiesFile=$HOME/road-traffic-schemas/storeproperties/accumulo.store.properties
graphConfigFile=$HOME/road-traffic-schemas/graphconfig/graphconfig.json

sleep 300s

function submitJob { #data-path, data-type

    textMapperGenerator="uk.gov.gchq.gaffer.traffic.data.elementgenerators.MajorRoadTextMapperGenerator"

    echo "using textMapperGenerator ${textMapperGenerator}"

    hdfsDataDir=/user/hadoop/data/$2
    hdfsOutputDir=/user/hadoop/output/$2
    hdfsFailureDir=/user/hadoop/failure/$2
    hdfsSplitsFile=/user/hadoop/splits/$2
    hdfsWorkingPath=/user/hadoop/working/$2

    echo "hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.GenerateRFilesJob $textMapperGenerator ${1} $schemaFile $storePropertiesFile $graphConfigFile $hdfsOutputDir $hdfsFailureDir $hdfsSplitsFile $hdfsWorkingPath $SAMPLE_FRACTION $NUM_REDUCERS"
    hadoop jar $jar uk.gov.gchq.gaffer.traffic.jobs.mapreduce.GenerateRFilesJob $textMapperGenerator ${1} $schemaFile $storePropertiesFile $graphConfigFile $hdfsOutputDir $hdfsFailureDir $hdfsSplitsFile $hdfsWorkingPath $SAMPLE_FRACTION $NUM_REDUCERS

}

function writeRFilesToS3 { #output-path, data-type
    hdfsOutputDir=/user/hadoop/output/$2/rfiles
    hdfsSplitsFile=/user/hadoop/splits/$2
    splitsFile=/

    echo $hdfsOutputDir
    while [ true ]
    do
        if hdfs dfs -test -e $hdfsOutputDir/_SUCCESS
        then
            s3-dist-cp --src $hdfsOutputDir --dest ${R_FILE_OUTPUT_LOCATION_S3}/$2/rfiles
            hadoop fs -get $hdfsSplitsFile $HOME
            echo "copying $2 splits file from $HOME/${2} to ${R_FILE_OUTPUT_LOCATION_S3}/${2}/splits"
            aws s3 cp $HOME/$2 $R_FILE_OUTPUT_LOCATION_S3/$2/splits
            break
        fi
    sleep 10
    done
}

submitJob $DATA_PATH_S3 road-traffic
writeRFilesToS3 $R_FILE_OUTPUT_LOCATION_S3 road-traffic

echo "done. Adios!"
exit 0
