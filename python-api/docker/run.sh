# Builds and runs all of the containers together

docker build -f Dockerfile.gaffer.quickstart.pyspark -t gaffer-quickstart-pyspark ../gafferpy-release-1.9.1-SNAPSHOT/
docker build -f Dockerfile.gaffer.quickstart.session -t gaffer-quickstart-session ../gafferpy-release-1.9.1-SNAPSHOT/
docker build -f Dockerfile.gaffer.quickstart.auth -t gaffer-quickstart-auth .

docker-compose up