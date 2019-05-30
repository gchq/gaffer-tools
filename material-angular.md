---
description: >-
  A list of some of the most commonly used/most crucial Material Angular
  components used in the UI
---

# Material Angular

The following are some of the pre-built Material Angular components that have been used in the html code to enhance the aesthetics of the product. They include a short explanation of:

a\) The function of the component

b\) An example of how it has been used here

c\) A link to further documentation on the Material Angular website, [https://material.angular.io/components/categories](https://material.angular.io/components/categories)

### **Mat-Card**

Mat-card acts as a container for any other objects, creating a raised portion of the view. It also has sub-components, such as mat-card-title, mat-card-content etc, but these more dictate the behaviour of their contents relative to the card. Each page of the application includes one as the main container within the component; for example the results table is on a card, the parameter inputs are on a card, and the analytics are each on their individual cards, as well as these cards being mounted on a further main card. [https://material.angular.io/components/card/overview](https://material.angular.io/components/card/overview)

### **Mat-Icon**

This tool allows for the use of the material angular icon library, a set of vector images used in a ‘common language’ sense for the user, e.g. the ‘burger’ \(three horizontal lines\) icon meaning “Menu”, or an i in a circle meaning information, and a small house meaning Home Page. [https://material.angular.io/components/icon/overview](https://material.angular.io/components/icon/overview) \(NB on some occassions this has not worked, and so material-icon has been used as a class on a regular I component, such as in the analytic component\)

### **Mat-Divider**

This provides a thin line to create a divide/space between components. [https://material.angular.io/components/divider/overview](https://material.angular.io/components/divider/overview)

### **Mat-Button**

This, while not a component in itself, is a class attributed to buttons to give them more styling than a regular button. More modifiers can be added to result in more styling – for example, mat-raised-button creates a raised button which casts a shadow on the object below, mat-fab creates a circular button, and mat-stroked-button creates a button with a black stroke around it. [https://material.angular.io/components/button/overview](https://material.angular.io/components/button/overview)

### **Mat-Grid-List**

A grid list component allows us to display a set of items in a grid formation that can either be flexible to its contents, or to be predetermined by us – we have opted for the latter. It is only used in one instance in the current product, on the Analytics page, to display our analytics in a grid, which has been predetermined to have 4 columns. Each item in the grid is contained in a mat-grid-tile, which in itself contains an app-analytic component in the form of a card. [https://material.angular.io/components/grid-list/overview](https://material.angular.io/components/grid-list/overview)

### **Mat-Nav-Tab-Bar**

Again, while not a component in itself, this is a modifier for a nav component, which allows us to have a set of tabs that allow the user to navigate to different portions of the application. This has been used on the nav component in the mat-toolbar, as can be seen at the top of each page. [https://material.angular.io/components/tabs/overview](https://material.angular.io/components/tabs/overview)

### **Mat-Input**

This is a modifier for a standard input component, which elevates it from a simple, often difficult. This has been used on the nav component in the mat-toolbar, as can be seen at the top of each page. [https://material.angular.io/components/tabs/overview](https://material.angular.io/components/tabs/overview)
