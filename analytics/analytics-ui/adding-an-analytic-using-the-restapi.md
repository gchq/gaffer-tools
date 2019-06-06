---
description: >-
  The following is a step-by-step guide on the use of the restAPI to create
  analytics to be run in the UI
---

# Adding an Analytic using the restAPI

{% hint style="info" %}
Before following any of the below steps, make sure you have started the REST API running by following the steps specified in [Overview & Getting Started](./#running-the-rest-api)
{% endhint %}

In this guide we will be constructing a very simple analytic, which runs a GetAllElements operation and limits the number of results displayed. The end result will be as follows:

## Instructions

1\) Navigate to http://localhost:8080/rest, and you will see the below page

![](./analytics/analytics-ui/assets/rest_closed.png)

2\) Click on the **operations** section to open it up, and select the **POST/graph/operations/execute** function. This will allow us to put in our operations.

![](./analytics/analytics-ui/assets/rest_opened.png)

3\) From the **Description** dropdown menu, select _Get All Elements_ and click the **Add Example** button to the right of the dropdown. This will add a simple GetAllElements operation \(as below\) to your Value input.

```text
{
   "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
}
```

4\) Once again from the Description dropdown, select _Limit_ and click Add Example. This will chain these operations into an **Operation Chain** in the Value input. Change the value assigned to "result-limit" from whatever value has been generated to **"\${result-limit}"** - this will allow the user to input it later. The value input should look like this:

```text
{
   "class": "uk.gov.gchq.gaffer.operation.OperationChain",
   "operations": [
      {
         "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
      },
      {
         "class": "uk.gov.gchq.gaffer.operation.impl.Limit",
         "resultLimit": "${result-limit}",
         "truncate": true
      }
   ]
}
```

5\) Cut the now complete Operation Chain from the value input. then go to the Description dropdown and select _AddNamedOperation_ and click Add Example. Change the **operationName** and **Description** to whatever you want them to be \(in our example they are "getAllX" with a description of "10"\). Then replace the value assigned to **operationChain** with our previously generated operation chain from before by pasting it in.

Finally, we add our parameters in. The following code creates a parameter of "result-limit" which will be assigned to the "\${result-limit}" input we created earlier, with a description, a default value, a value class, and a boolean on whether this is required to run the operation or not. Do this for all the parameters to be inputted in this analytic \(in our case, just the one\)

```text
"parameters": {
            "result-limit": {
               "description": "The maximum number of junctions to return",
               "defaultValue": 2,
               "valueClass": "java.lang.Integer",
               "required": false
            }
         },
```

The value input should now be as follows.

```text
{
   "class": "uk.gov.gchq.gaffer.named.operation.AddNamedOperation",
   "operationName": "getAllX",
   "description": "10",
   "score": 7,
   "operationChain": {
   "class": "uk.gov.gchq.gaffer.operation.OperationChain",
   "operations": [
      {
         "class": "uk.gov.gchq.gaffer.operation.impl.get.GetAllElements"
      },
      {
         "class": "uk.gov.gchq.gaffer.operation.impl.Limit",
         "resultLimit": "${result-limit}",
         "truncate": true
      }
   ]
},
   "parameters": {
         "result-limit": {
         "description": "The maximum number of junctions to return",
         "defaultValue": 2,
         "valueClass": "java.lang.Integer",
         "required": false
         }
      },
   "overwriteFlag": true
}
```

6\) Click the **Try it out!** button in the bottom left hand corner, and check down to see the response. If the restAPI has given a 200 code response, then that means the Named Operation has been successfully added to your restAPI, and can be used in Analytics, one of which we will add in the next few steps.

7\) Again from the Description dropdown, select _AddAnalytic_ and click Add Example - a blank analytic will be generated. Make sure to give the analytic a name to be displayed by altering the value given to **analyticName** \(in our example, Analytic X\) and to make sure **operationName** matches the name of the named operation we have generated \(in our example, getAllX\).

Add a **Description**, and alter the **metaData** - change the input of **iconURL** to the name of an icon from the Material Design icon library \(a full list of which can be found [here](https://material.io/tools/icons/)\), and add a **"color"** input and specify a color for the analytic card \(in this example, we chose "yellow"\). Your code should match the excerpt below, which matches our code shown at the beginning.

```text
      {
         "class": "uk.gov.gchq.gaffer.operation.analytic.AddAnalytic",
         "analyticName": "Analytic X",
         "operationName": "getAllX",
         "description": "Get Elements with Result Limit",
         "score": 4,
         "metaData": {
            "iconURL": "public"
            "color" : "yellow"
         },
         "outputType": {
            "output": "table"
         },
         "overwriteFlag": false,
         "readAccessRoles": [
            "User"
         ],
         "uiMapping": {
            "param1": {
               "label": "Maximum Results",
               "userInputType": "TextBox",
               "parameterName": "result-limit"
            }
         },
         "writeAccessRoles": [
            "User"
         ]
      }
```

7\) Click the **Try it out!** button in the bottom left hand corner, and check down to see the response. If the restAPI has given a 200 code response, then that means the Analytic has been successfully added to your restAPI, and when the UI is opened, it will be displayed in the grid.
