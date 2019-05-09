# GafferPy Docker 
This is the GafferPy docker instances. This guide will help set out how to build and run your graph database in a container, and run operations from python.

## Requirements
- Maven
- Docker
- (Optional) OpenSSL

## Running the Docker Compose
1. Pull and build the Gaffer Quickstart branch, once complete run the script to create the quickstart image.
2. Return to here and in the python-api project run ``` mvn clean install ```
3. Once the project is built you should have a gaffer-release-{verison} folder.
4. Next run the script called ``` run.sh ``` this will build and start up a secured session and notebook with a gaffer service running as well.
5. You should now be able to access this by copying and pasting the url and the token generated displayed in the terminal by ```gaffer-quickstart-pyspark```. 
6. Now you have access you can start exectuing operations in your python notebook over Gaffer. You can follow the [documentation](https://gchq.github.io/gaffer-doc/) for more information upon how to do this.

## Alternative Builds
You can build run this without security element, to do this you need to make changes to the compose file. 
You just need to remove the ```auth``` element. If you do this you will also need to make changes to the environment variables in the pyspark file.

You can run your new configured Docker Compose by either running ```docker-compose up``` or by exectuing the run script. We recommend using the script as it will rebuild the images for you before starting them up.