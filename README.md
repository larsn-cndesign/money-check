# MoneyCheck

A simple expense budget web application managing categories, units, currencies, versions, and years with budget follow-up etc.
The main purpose of the project is to develop Angular skills and to adhere to Angular best practices.

### Notes
- Uses Angular version 19
- Data is stored in localStorage
- Available languages are English, Spanish (AI translation) and Swedish
- Unit testing is ongoing. For a complete unit test of a feature, please see [feature/actual-item](https://github.com/larsn-cndesign/money-check/tree/main/src/app/feature/actual-item)
- A fake backend interceptor is used to simulate HTTP requests to a server
- So far the app is mainly tested in Chrome


## Getting Started

Make sure you have the Angular CLI installed globally.

Run ng serve for a dev server. Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

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
* [Angular 19](https://angular.dev/) - The web framework used

## Libraries Used

- [@angular/material](https://material.angular.io/) - Material Design components for Angular
- [@auth0/angular-jwt](https://www.npmjs.com/package/@auth0/angular-jwt) - Automatically attaches a JSON Web Token to HttpClient requests
- [@ngx-translate/core](https://github.com/ngx-translate/core) - The internationalization (i18n) library for Angular

## Versioning

For the versions available, see the [tags on this repository](https://github.com/larsn-cndesign/money-check/tags).

## Authors

**Lars Norrstrand**

- [CN Design AB](https://www.cndesign.se/)
- [Email](mailto:lars.norrstrand@cndesign.se)

## License

This project is licensed under the MIT License.
