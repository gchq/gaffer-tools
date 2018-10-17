#!/bin/bash
# set up spark to use jupyter:
echo "" | sudo tee --append /etc/spark/conf/spark-env.sh > /dev/null
echo "export PYSPARK_PYTHON=/home/hadoop/anaconda/bin/python" | sudo tee --append /etc/spark/conf/spark-env.sh > /dev/null
echo "export PYSPARK_DRIVER_PYTHON=/home/hadoop/anaconda/bin/jupyter" | sudo tee --append /etc/spark/conf/spark-env.sh > /dev/null
echo "export PYSPARK_DRIVER_PYTHON_OPTS='notebook --no-browser --ip=0.0.0.0'" | sudo tee --append /etc/spark/conf/spark-env.sh > /dev/null