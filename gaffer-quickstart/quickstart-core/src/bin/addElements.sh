#!/bin/bash

data="\"$1\""
generator="\"$2\""


echo $data
echo $generator

curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{
       "class": "uk.gov.gchq.gaffer.quickstart.operation.AddElementsFromCsv",
       "filename": '$data',
       "mappingsFile": '$generator'
     }' 'http://localhost:8085/rest/v2/graph/operations/execute'
