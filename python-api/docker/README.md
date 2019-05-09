# GaffferPy Docker 
This is the GafferPy docker instances. This guide will help set out how to build and run your graph database in a container, and run operations from python.

## Requirements
- Maven
- Docker
- (Optional) OpenSSL

## Running GafferPy
1. Pull the Gaffer Quickstart branch
2. Go into the python-api project and run ``` mvn clean install ```
3. Once the project is built you should have a gaffer-release-{verison} folder.
4. Run (in this folder) ``` docker build -f Dockerfile.gaffer.quickstart.local -t gaffer-local . ```
5. Once this is built run ``` docker run -p 8888:8888 gaffer-local ```
6. Go to [localhost:8888](localhost:8888), enter your token and happy coding!
 
## Running with PySpark
To run this with PySpark, you need to repeat the previous steps however replace the file with the ```Dockerfile.gaffer.quickstart.pyspark``` file.


## Running Securely
**This will require OpenSSL**

1. You will need to create certificates using **OpenSSL** (or alternatives) for your NoteBook and Gaffer Session. These can be added via the ```Application.properties``` file and by changing the ```Cert-Path``` in the ```Dockerfile.gaffer.quickstart.authenticated``` file

- To add this to the ```application.properties``` file you need to enable ssl (by setting ```use-ssl``` to true), add your certificate to a [keystore](https://docs.oracle.com/cd/E19798-01/821-1841/gjrgy/)  and fill in the rest of the file with the correct information.

2. Build and Deploy the docker image using the command: ```docker build -f Dockerfile.gaffer.quickstart.authenticated -t gaffer-auth .; docker run -p 8888:8888 gaffer-auth ```

3. Go to [localhost:8888](https://localhost:8888), enter your token and happy coding!