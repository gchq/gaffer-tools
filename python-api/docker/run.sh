# Builds and runs all of the containers together

docker build -f Dockerfile.gaffer.quickstart.auth -t gaffer-quickstart-auth .
docker build -f Dockerfile.gaffer.quickstart.pyspark -t gaffer-quickstart-base-pyspark ../gafferpy-release-1.9.1-SNAPSHOT/
docker build -f Dockerfile.gaffer.quickstart.session -t gaffer-quickstart-base-session ../gafferpy-release-1.9.1-SNAPSHOT/

echo "..............................................."
echo "               BASE IMAGES BUILT               "
echo "..............................................."

cd examples/

case "$1" in
basic)
    echo "BUILDING BASIC EXAMPLE"
    cd basic/
    docker build -f Dockerfile.gaffer.basic.session -t gaffer-quickstart-session .
    docker build -f Dockerfile.gaffer.basic.pyspark -t gaffer-quickstart-pyspark .
    cd ..
;;
esac
cd ..

docker-compose up