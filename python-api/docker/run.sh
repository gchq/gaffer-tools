# Builds and runs all of the containers together

docker build -f Dockerfile.gaffer.quickstart.auth -f gaffer-quickstart-auth ../gafferpy-release-1.9.1-SNAPSHOT/
docker build -f Dockerfile.gaffer.quickstart.pyspark -f gaffer-quickstart-pyspark ../gafferpy-release-1.9.1-SNAPSHOT/
docker build -f Dockerfile.gaffer.quickstart.session -f gaffer-quickstart-session ../gafferpy-release-1.9.1-SNAPSHOT/

docker-compose up