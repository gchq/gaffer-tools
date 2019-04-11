#!/usr/bin/env bash
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d @ui/example/federated/road-use/json/1a_addRoadUseGraph.json 'http://localhost:8080/rest/v2/graph/operations/execute'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d @ui/example/federated/road-use/json/1b_addRoadJunctionsGraph.json 'http://localhost:8080/rest/v2/graph/operations/execute'
curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d @ui/example/federated/road-use/json/2a_addElements.json 'http://localhost:8080/rest/v2/graph/operations/execute'
