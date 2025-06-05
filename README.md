# BankingDashboard

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.2.14.

# Description
As a banking company, we are looking for an interface that would allow us to check the registered clients and their banking accounts.
Our web designer drafted a mock-up of a web page that shows the clients and their accounts as a scrollable page.
The mockup contains some filtering:
- on top of the page, a text filter on client's first name
- then near to each vertical bar chart showing the different accounts per client
- a filter ont he account-type (VISA,ect) with buttons that hide/show bars of the graph
- a filter on the balance >= or < 0 as a pie chart. The actual pie chart shows the proportion of accounts having balance + or -, clicking on one part of the pie highlights corresponding account(s) in the vertical bar chart.

When clicking on a graph or clicking a "More" button, a pop up should open, showing a listing of all the accounts of a client.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
