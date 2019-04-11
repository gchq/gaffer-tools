curl -X POST --header 'Content-Type: application/json' --header 'Accept: application/json' -d '{  
    "class": "uk.gov.gchq.gaffer.operation.impl.add.AddElements",  
    "input": [  
       {  
          "class": "uk.gov.gchq.gaffer.data.element.Entity",  
          "group": "BasicEntity",  
          "vertex": {  
             "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {  
                "type": "t1",
                "subType": "st1",  
                "value": "v1"  
            }  
          },  
          "properties": {  
             "endDate": {  
                "java.util.Date": 1519893253772  
             },  
             "count": {  
                "java.lang.Long": 1  
             },  
             "startDate": {  
                "java.util.Date": 1519893253772  
             }  
          }  
       },  
       {  
          "class": "uk.gov.gchq.gaffer.data.element.Entity",  
          "group": "BasicEntity",  
          "vertex": {  
             "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {  
                "type": "t2",  
                "subType": "st2",  
                "value": "v2"  
            }  
          },  
          "properties": {  
             "endDate": {  
                "java.util.Date": 1519893253774  
             },  
             "count": {  
                "java.lang.Long": 2  
             },  
             "startDate": {  
                "java.util.Date": 1519893253774  
             }  
          }  
       },  
       {  
          "class": "uk.gov.gchq.gaffer.data.element.Edge",  
          "group": "BasicEdge",  
          "source": {  
             "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {  
                "type": "t1",  
                "subType": "st1",  
                "value": "v1"  
            }  
          },  
          "destination": {  
             "uk.gov.gchq.gaffer.types.TypeSubTypeValue": {  
                "type": "t2",  
                "subType": "st2",  
                "value": "v2"  
            }  
          },  
          "directed": true,  
          "properties": {  
             "endDate": {  
                "java.util.Date": 1519893253773  
             },  
             "count": {  
                "java.lang.Long": 1  
             },  
             "startDate": {  
                "java.util.Date": 1519893253773  
             }  
          }  
       }  
    ],  
    "skipInvalidElements": false,  
    "validate": true  
 }' 'http://localhost:8080/rest/v2/graph/operations/execute'
