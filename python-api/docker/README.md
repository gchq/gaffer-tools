# GafferPy Docker 
This is the GafferPy docker instances. This guide will help set out how to build and run your graph database in a container, and run operations from python.

## Requirements
- Maven
- Docker

## Running with Docker Compose
1. Pull and build the Gaffer Quickstart branch, once complete run the script to create the quickstart image.
2. Return to here and in the python-api project run ``` mvn clean install ```
3. Once the project is built you should have a gaffer-release-{verison} folder.
4. Next run the script called ``` run.sh ``` with an optional example folder location for example: ``` sh run.sh basic ```. This will build and start up a secured session and notebook with a gaffer service running as well.
5. You should now be able to access the session by copying and pasting the url and the token generated displayed in the terminal by the notebook.
6. Now you have access you can start exectuing operations in your python notebook over Gaffer. You can follow the [documentation](https://gchq.github.io/gaffer-doc/) for more information upon how to do this.

