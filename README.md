# MoneyCheck

A simple expense budget web application managing categories, units, currencies, versions, and years with budget follow-up.
The main purpose of the project is to develop Angular skills and to adhere to Angular best practices.

### Notes
- Uses Angular version 14
- Data is stored in localStorage
- Language is currently only available in Swedish
- Unit testing is ongoing. For a complete unit test of a feature, please see [feature/actual-item](https://github.com/larsn-cndesign/money-check/tree/main/src/app/feature/actual-item)
- A fake backend interceptor is used to simulate http requests to a server
- **For login credentials**, please see the [fake-backend.ts](https://github.com/larsn-cndesign/money-check/blob/main/src/app/mock-backend/fake-backend.ts) file.

## Getting Started

Make sure you have the Angular CLI installed globally.

Run ng serve for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

## Building the project

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Prerequisites

- [Angular CLI](https://www.npmjs.com/package/@angular/cli?activeTab=readme) installed globally.
- [Node.js](https://nodejs.org/en/) JavaScript runtime environment. Not mandatory but highly recommended.

### Installing

1. [Clone repo](https://docs.github.com/en/repositories/creating-and-managing-repositories/cloning-a-repository)
2. `npm install`

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Deployment

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Built With

* [Visula Studio Code](https://code.visualstudio.com/) - The IDE
* [Angular 14](https://angular.io/) - The web framework used

## Libraries Used

- [@angular/material](https://material.angular.io/) - Material Design components for Angular
- [@auth0/angular-jwt](https://www.npmjs.com/package/@auth0/angular-jwt) - Automatically attaches a JSON Web Token to HttpClient requests

## Versioning

For the versions available, see the [tags on this repository](https://github.com/larsn-cndesign/money-check/tags). 

## Authors

* **Lars Norrstrand** - *Initial work* - [CN Design AB](https://www.cndesign.se/)

## License

This project is licensed under the MIT License.
