# Gaffer Quickstart #

Gaffer quickstart is a self-contained application that lets you quickly deploy a Gaffer stack by running a couple of scripts. 

It can be deployed either locally using mini-accumulo or (coming soon) on AWS-EMR.

## How to use it in local mode with the example graph ##

This will run a Gaffer-accumulo stack on your local machine, not a distributed version so it won't take a lot of data (basically what will fit in memory on your machine)

### Build and install ###

 1. Clone the repo
 2. `mvn clean install`. This will create a tarball in the `gaffer-quickstart-release-VERSION` directory in the cloned repo.
 3. Unpack the tarball somewhere: `tar -xvf gaffer-release-VERSION.tar.gz`
 4. Set your `GAFFER_HOME` environment variable to point to wherever you unpacked the tarball.

### Start Gaffer ###

Run `$GAFFER_HOME/bin/startup.sh`. 

This will start Gaffer with the rest service and UI running. The UI will be on http://localhost:8080/ui and the rest service will be on http://localhost:8080/rest

Logging for Gaffer will be in `$GAFFER_HOME/gaffer.log`

### Load the Example data ###


### Shutting down ###

Run `$GAFFER_HOME/bin/shutdown.sh`