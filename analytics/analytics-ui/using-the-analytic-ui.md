---
description: A step by step guide to the use of the Analytic UI product
---

# Using the Analytic UI

## 1. Analytics

{% hint style="info" %}
As stated in Getting Started, this whole process requires that one or more analytic\(s\) have been added to your REST API.
{% endhint %}

To start, select one of the analytics displayed on screen in the grid by clicking the card/tile it is displayed on. Their titles are displayed on the cards, as well as a description appearing below when the card is hovered over.

![The Analytics page where the REST API has been used to create 2 analytics; X and Y.](./analytics/analytics-ui/assets/2_analytics.png)

## 2. Parameters

Once an analytic is selected, the Parameters page will load, displaying the title of the analytic selected, a description of the analytics function, and inputs for each of the individual parameter inputs required for the analytic to run \(e.g. the maximum desired number of results, or a result type to match\). Fill these inputs, and then click the EXECUTE button in the bottom right corner. Depending on the complexity of the analytic, the loading for the next page may take some time. While this happens, a loading spinner will appear next to the EXECUTE button.

![The Parameters page where Analytic Y was clicked and so the parameters for said analytic, in this case, just the one of "Maximum Results" are given inputs, which has in this case been filled out as 5, meaning the user would get 5 results returned.](./analytics/analytics-ui/assets/analytic_y_params.png)

## 3. Results

Once the analytic has finished running, the results page will load and display a table in which the results of the analytic are displayed. The columns of the table will have titles based on the description of the data provided by the REST API.

![The is the Results page as it would be when Analytic Y is run with a Maximum Results parameter of 5.](./analytics/analytics-ui/assets/results.png)
