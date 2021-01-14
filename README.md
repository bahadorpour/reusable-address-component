# A Reusable Address Component 🔎🌆🔍

## Features : 
+ Vanilla Javascript
+ ES6
+ Web component
+ without any dependencies to any JavaScript library, #useThePlatform :)

## User Story:
A reusable address component with data completion socan put this address component on different forms.

## Business requirements (function):
* The address widget have the following fields:
  + zip
  + city
  + street
  + houseNumber
  + country (is fix: “de” - Deutschland)
* After entering the zip code, the city will be prefilled.
* Based on the zip/city also the streets will be selectable Only streets from the chosen city are selectable.
* In the bottom of the widget there is button “info”. By clicking the button, a message box will be displayed where all data of the widget are formatted as JSON.

## Technical requirements (non-functional):
* For city lookup, reverse engineering of the service from [postdirekt](https://www.postdirekt.de/plzserver/)
* The component is an reusable [ES6 Web Component](https://developer.mozilla.org/en-US/docs/Web/Web_Components)
* Provided a test page that contains two time the widget on the same page